/* ====================================================
   抽国家
   ==================================================== */
function startCountryDraw(){
    const result = document.getElementById("countryResult");
    const btn = document.getElementById("countryStartButton");
    const actions = document.getElementById("countryActions");

    btn.classList.add("hidden");
    actions.classList.add("hidden");
    PetSystem.reactDrawStart();
    clearMarker();

    rotateAnim = null;
    pendingOnStop = null;
    globeIdleRotating = false;

    const eraPool = getEraCountries(selectedEra);
    const eraPoolSet = new Set(eraPool);

    let pool;
    if (chosenContinent === "不限"){ pool = [...eraPool]; pickedContinentThisDraw = ""; }
    else if (chosenContinent === "随机"){
        // 大洲已经在点按钮时抽好了，直接用
        const contKey = pickedContinentThisDraw;
        pool = (continents[contKey] || []).filter(c => eraPoolSet.has(c));
        if (pool.length === 0) pool = [...eraPool];
    }
    else {
        pickedContinentThisDraw = chosenContinent;
        pool = continents[chosenContinent].filter(c => eraPoolSet.has(c));
    }
    // 保存联动用的状态
    isDrawingCountry = true;
    drawingEraForLon = selectedEra;
    drawingPool = pool;
    lastLonUpdate = 0;

    // 立刻先更新一次下方文字
    const initCountry = getCountryByLon(-currentLambda, pool);
    if (initCountry) result.textContent = getCountryName(selectedEra, initCountry);

    // 随机 1000~1500ms 快速自转 → 减速停下
    startSpin(function(){        isDrawingCountry = false;

        // 停下后，用当前经度找最近的国家
        const centerLon = -currentLambda;
        selectedCountry = getCountryByLon(centerLon, pool) || randomChoice(pool);
        const coords = countryCoords[selectedCountry] || null;
        if (coords){
            setMarker(coords[0], coords[1]);
            showMarker();
        }

        const displayCountry = getCountryName(selectedEra, selectedCountry);
        if (chosenContinent === "随机" && pickedContinentThisDraw){
            const contMap = { "亚洲":"contAsia","欧洲":"contEurope","非洲":"contAfrica","美洲":"contAmericas","大洋洲":"contOceania" };
            result.textContent = t("prefixVisit") + displayCountry + "（" + t(contMap[pickedContinentThisDraw]) + "）";
        } else {
            result.textContent = t("prefixVisit") + displayCountry;
        }
        actions.classList.remove("hidden");
        PetSystem.reactResult();
    });
}
function goToGender(){
    showScreen("genderScreen");
    document.getElementById("genderEraText").textContent = t("prefixEra") + getEraName(selectedEra);
    document.getElementById("genderCountryText").textContent = t("prefixCountry") + getCountryName(selectedEra, selectedCountry);
}

/* ====================================================
   抽性别
   ==================================================== */
function manualSelectGender(gender){
    if (!gender) return;
    selectedGender = gender;
    const sel = document.getElementById("genderManualSelect");
    if (sel) sel.value = "";
    clearInterval(genderTimer);
    const result = document.getElementById("genderResult");
    result.textContent = t("msgWillLead").replace("{name}", getGenderName(gender));
    const boat = document.getElementById("boat");
    boat.classList.remove("swaying");
    boat.style.left = gender === "女性作家" ? "25%" : "75%";
    document.getElementById("genderStartButton").classList.add("hidden");
    document.getElementById("genderActions").classList.remove("hidden");
}
function startGenderDraw(){
    const result = document.getElementById("genderResult");
    const btn = document.getElementById("genderStartButton");
    const actions = document.getElementById("genderActions");
    const boat = document.getElementById("boat");
    btn.classList.add("hidden");
    actions.classList.add("hidden");
    result.textContent = t("drawing");
    PetSystem.reactDrawStart();
    boat.classList.add("swaying");
    boat.style.left = "50%";
    let count = 0; const total = 24;
    clearInterval(genderTimer);
    genderTimer = setInterval(() => {
        const temp = randomChoice(genders);
        result.textContent = getGenderName(temp);
        boat.style.left = temp === "女性作家" ? "25%" : "75%";
        if (++count >= total){
            clearInterval(genderTimer);
            selectedGender = randomChoice(genders);
            result.textContent = t("msgWillLead").replace("{name}", getGenderName(selectedGender));
            boat.style.left = selectedGender === "女性作家" ? "25%" : "75%";
            boat.classList.remove("swaying");
            actions.classList.remove("hidden");
            PetSystem.reactResult();
        }
    }, 160);
}
function goToGenre(){
    showScreen("genreScreen");
    document.getElementById("genreEraText").textContent = t("prefixEra") + getEraName(selectedEra);
    document.getElementById("genreCountryText").textContent = t("prefixCountry") + getCountryName(selectedEra, selectedCountry);
    document.getElementById("genreGenderText").textContent = t("prefixGender") + getGenderName(selectedGender);
    buildBook();
}

/* ====================================================
   翻书抽文体
   ==================================================== */
let genreTimeouts = [];
function buildBook(){
    const container = document.getElementById("bookLeaves");
    if (!container) return;
    container.innerHTML = "";
    genreTimeouts.forEach(t => clearTimeout(t));
    genreTimeouts = [];
    const shuffled = [...genres].sort(() => Math.random() - 0.5);
    shuffled.forEach((genre, i) => {
        const leaf = document.createElement("div");
        leaf.className = "leaf";
        leaf.dataset.genre = genre;
        leaf.dataset.index = i;
        leaf.style.zIndex = i + 10;
        const front = document.createElement("div");
        front.className = "leaf-face leaf-front";
        const frontText = document.createElement("span");
        frontText.className = "leaf-text";
        frontText.textContent = getGenreName(genre);
        front.appendChild(frontText);
        const back = document.createElement("div");
        back.className = "leaf-face leaf-back";
        leaf.appendChild(front); leaf.appendChild(back);
        container.appendChild(leaf);
    });
}
function manualSelectGenre(genre){
    if (!genre) return;
    selectedGenre = genre;
    const sel = document.getElementById("genreManualSelect");
    if (sel) sel.value = "";
    genreTimeouts.forEach(t => clearTimeout(t));
    genreTimeouts = [];
    buildBook();
    const result = document.getElementById("genreResult");
    result.textContent = t("prefixRead") + getGenreName(genre);
    document.getElementById("genreStartButton").classList.add("hidden");
    document.getElementById("genreActions").classList.remove("hidden");
}
function startGenreDraw(){
    const result = document.getElementById("genreResult");
    const btn = document.getElementById("genreStartButton");
    const actions = document.getElementById("genreActions");
    btn.classList.add("hidden");
    actions.classList.add("hidden");
    result.textContent = t("drawing");
    PetSystem.reactDrawStart();
    genreTimeouts.forEach(t => clearTimeout(t));
    genreTimeouts = [];
    buildBook();

    const container = document.getElementById("bookLeaves");
    const leaves = Array.from(container.querySelectorAll(".leaf"));
    const n = leaves.length;
    if (n === 0) return;

    const targetIdx = Math.floor(Math.random() * n);
    selectedGenre = leaves[targetIdx].dataset.genre;

    let delay = 0;
    for (let i = n - 1; i > targetIdx; i--){
        const leaf = leaves[i];
        const newZ = n - i;
        const t1 = setTimeout(() => leaf.classList.add("flipped"), delay);
        genreTimeouts.push(t1);
        const t2 = setTimeout(() => { leaf.style.zIndex = newZ; }, delay + 450);
        genreTimeouts.push(t2);
        delay += 200;
    }
    const settleTime = delay + 700;
    const t3 = setTimeout(() => {
        const front = leaves[targetIdx].querySelector(".leaf-front");
        if (front) front.classList.add("settled");
    }, settleTime);
    genreTimeouts.push(t3);

    const totalTime = delay + 1000;
    clearTimeout(genreTimer);
    genreTimer = setTimeout(() => {
        result.textContent = t("prefixRead") + getGenreName(selectedGenre);
        actions.classList.remove("hidden");
        PetSystem.reactResult();
    }, totalTime);
}
/* ====================================================
   最终结果
   ==================================================== */
function showFinalResult(){
    document.getElementById("finalEra").textContent = t("finalEra") + getEraName(selectedEra);
    document.getElementById("finalCountry").textContent = t("finalCountry") + getCountryName(selectedEra, selectedCountry);
    document.getElementById("finalGender").textContent = t("finalGender") + getGenderName(selectedGender);
    document.getElementById("finalGenre").textContent = t("finalGenre") + getGenreName(selectedGenre);
    saveJourney();
    showScreen("finalScreen");
    // 正常流程：显示"重新开始"，隐藏"退出"
    const r = document.getElementById("restartJourneyBtn");
    const e = document.getElementById("exitToHistoryBtn");
    if (r) r.classList.remove("hidden");
    if (e) e.classList.add("hidden");
}