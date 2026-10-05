/* ====================================================
   历史
   ==================================================== */
function loadHistory(){
    try { const raw = localStorage.getItem(HISTORY_KEY); const arr = raw ? JSON.parse(raw) : []; return Array.isArray(arr) ? arr : []; }
    catch(e){ return []; }
}
function saveHistoryToStorage(list){ try { localStorage.setItem(HISTORY_KEY, JSON.stringify(list)); } catch(e){} }
function formatTime(ts){
    const d = new Date(ts);
    const pad = n => String(n).padStart(2,'0');
    return `${d.getFullYear()}/${pad(d.getMonth()+1)}/${pad(d.getDate())}  ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function saveJourney(){
    if (currentJourneySaved) return;
    if (!selectedEra || !selectedCountry || !selectedGender || !selectedGenre) return;
    const list = loadHistory();
    list.unshift({ era:selectedEra, country:selectedCountry, gender:selectedGender, genre:selectedGenre, time:Date.now() });
    if (list.length > HISTORY_MAX) list.length = HISTORY_MAX;
    saveHistoryToStorage(list);
    currentJourneySaved = true;
}
function computeStats(list){
    if (!list || list.length === 0) return null;
    const counts = { era:{}, country:{}, gender:{}, genre:{} };
    list.forEach(item => {
        counts.era[item.era] = (counts.era[item.era] || 0) + 1;
        counts.country[item.country] = (counts.country[item.country] || 0) + 1;
        counts.gender[item.gender] = (counts.gender[item.gender] || 0) + 1;
        counts.genre[item.genre] = (counts.genre[item.genre] || 0) + 1;
    });
    function top(obj){ let b=null, bc=0; for (const k in obj){ if (obj[k] > bc){ b=k; bc=obj[k]; } } return { value:b, count:bc }; }
    return { era:top(counts.era), country:top(counts.country), gender:top(counts.gender), genre:top(counts.genre) };
}
function renderStats(stats){
    const statsEl = document.getElementById("historyStats");
    if (!stats){ statsEl.classList.add("hidden"); return; }
    statsEl.classList.remove("hidden");
    function setRow(prefix, data, kind){
        const v = document.getElementById("stat"+prefix+"Value");
        const c = document.getElementById("stat"+prefix+"Count");
        if (!v || !c) return;
        // 统计区里显示：朝代/国家直接用内部中文作为 key，显示时按语言映射
        if (data.value){
            if (kind === "era") v.textContent = getEraName(data.value);
            else if (kind === "country"){
                // 国家在多时代里可能有不同显示名，取最简单的映射
                v.textContent = currentLang === "en" ? (COUNTRY_EN[data.value] || data.value) : data.value;
            }
            else if (kind === "gender") v.textContent = getGenderName(data.value);
            else if (kind === "genre") v.textContent = getGenreName(data.value);
        } else {
            v.textContent = "—";
        }
        c.textContent = data.count ? data.count : "";
    }
    setRow("Era", stats.era, "era");
    setRow("Country", stats.country, "country");
    setRow("Gender", stats.gender, "gender");
    setRow("Genre", stats.genre, "genre");
}
function renderHistory(){
    const list = loadHistory();
    const container = document.getElementById("historyList");
    const emptyEl = document.getElementById("historyEmpty");
    const countEl = document.getElementById("historyCount");
    container.innerHTML = "";
    countEl.innerHTML = t("countRecords").replace("{n}", list.length);
    renderStats(computeStats(list));
    if (list.length === 0){ emptyEl.classList.remove("hidden"); return; }
    emptyEl.classList.add("hidden");
    list.forEach((item, index) => {
        const el = document.createElement("div");
        el.style.cursor = "pointer";
        el.onclick = function(){
            selectedEra = item.era;
            selectedCountry = item.country;
            selectedGender = item.gender;
            selectedGenre = item.genre;
            currentJourneySaved = true;
            openFinalFromHistory();
            closeHistory();
        };
        el.className = "history-item";
        const timeEl = document.createElement("div");
        timeEl.className = "history-time";
        timeEl.textContent = formatTime(item.time);
        const fieldsEl = document.createElement("div");
        fieldsEl.className = "history-fields";
        const parts = [
          getEraName(item.era),
          getCountryName(item.era, item.country),
          getGenderName(item.gender),
          getGenreName(item.genre)
        ];
        parts.forEach((p, i) => {
            const span = document.createElement("span");
            span.className = "history-tag";
            span.textContent = p;
            fieldsEl.appendChild(span);
            if (i < parts.length - 1){
                const dot = document.createElement("span");
                dot.className = "history-dot";
                dot.textContent = "·";
                fieldsEl.appendChild(dot);
            }
        });
        const del = document.createElement("button");
        del.className = "history-delete";
        del.textContent = "✕";
        del.title = t("deleteTitle");
        del.onclick = function(e){ e.stopPropagation(); deleteHistoryItem(index, el); };
        el.appendChild(timeEl); el.appendChild(fieldsEl); el.appendChild(del);
        container.appendChild(el);
    });
}
function deleteHistoryItem(index, el){
    const list = loadHistory();
    if (index < 0 || index >= list.length) return;
    if (el) el.classList.add("removing");
    setTimeout(() => { list.splice(index, 1); saveHistoryToStorage(list); renderHistory(); }, 280);
}
function openHistory(){ renderHistory(); document.getElementById("historyOverlay").classList.remove("hidden"); }
function closeHistory(){ document.getElementById("historyOverlay").classList.add("hidden"); }
function overlayClick(e){ if (e.target.id === "historyOverlay") closeHistory(); }
/* 从历史记录打开最终结果页 */
function openFinalFromHistory(){
    document.getElementById("finalEra").textContent = t("finalEra") + getEraName(selectedEra);
    document.getElementById("finalCountry").textContent = t("finalCountry") + getCountryName(selectedEra, selectedCountry);
    document.getElementById("finalGender").textContent = t("finalGender") + getGenderName(selectedGender);
    document.getElementById("finalGenre").textContent = t("finalGenre") + getGenreName(selectedGenre);
    showScreen("finalScreen");
    // 显示"退出"，隐藏"重新开始"
    const r = document.getElementById("restartJourneyBtn");
    const e = document.getElementById("exitToHistoryBtn");
    if (r) r.classList.add("hidden");
    if (e) e.classList.remove("hidden");
}

/* 从结果页退出到历史记录 */
function exitToHistory(){
    openHistory();
}
function exitHistoryToHome(){
    closeHistory();
    showScreen("homeScreen");
}
function clearHistory(){ if (!confirm(t("confirmClear"))) return; saveHistoryToStorage([]); renderHistory(); }
document.addEventListener("keydown", function(e){
    if (e.key === "Escape"){
        const ov = document.getElementById("historyOverlay");
        if (ov && !ov.classList.contains("hidden")) closeHistory();
    }
});
