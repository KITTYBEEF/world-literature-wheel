/* ====================================================
   时代转盘
   ==================================================== */
const SVGNS = "http://www.w3.org/2000/svg";
function polarPoint(cx, cy, r, angleDeg){
    const rad = angleDeg * Math.PI / 180;
    return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) };
}
function buildEraWheel(){
    const svg = document.getElementById("eraWheel");
    if (!svg) return;
    svg.innerHTML = "";

    const CX = 200, CY = 200, R = 180;
    const n = eras.length;
    const step = 360 / n;
    const colors = ["#fbf4e3", "#eeddb7"];

    // 扇形
    for (let i = 0; i < n; i++){
        const startA = i * step - step / 2;
        const endA = startA + step;
        const p1 = polarPoint(CX, CY, R, startA);
        const p2 = polarPoint(CX, CY, R, endA);
        const path = document.createElementNS(SVGNS, "path");
        path.setAttribute("d",
            `M ${CX} ${CY} L ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} ` +
            `A ${R} ${R} 0 0 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)} Z`);
        path.setAttribute("fill", colors[i % 2]);
        path.setAttribute("stroke", "#c9a961");
        path.setAttribute("stroke-width", "0.9");
        svg.appendChild(path);
    }

    // ===== 弧形文字 =====
    const textR = R * 0.78;              // 文字所在弧线的半径
    const halfSpan = step * 0.44;        // 文字占据的角半宽（留边距）
    const arcLength = 2 * halfSpan * Math.PI / 180 * textR;  // 弧线长度（px）

    // 估算文字宽度：中文按全角计，英文按窄体计
    function estimateTextWidth(name, fontSize){
        let w = 0;
        for (const ch of name){
            const code = ch.charCodeAt(0);
            if (code > 127) w += fontSize;             // 全角（中/日）
            else if (ch === ' ') w += fontSize * 0.28;
            else w += fontSize * 0.55;                 // 拉丁字母
        }
        return w;
    }

    // 存放弧线路径的 defs
    const defs = document.createElementNS(SVGNS, "defs");
    svg.appendChild(defs);

    for (let i = 0; i < n; i++){
        const midA = i * step;
        const name = getEraName(eras[i]);

        const a1 = midA - halfSpan;
        const a2 = midA + halfSpan;

        // 统一方向：所有扇区都用相同的弧线方向
        const startAngle = a1;
        const endAngle = a2;
        const sweep = 1;

        const pStart = polarPoint(CX, CY, textR, startAngle);
        const pEnd   = polarPoint(CX, CY, textR, endAngle);

        // 弧线路径（隐藏，仅用作 textPath 轨道）
        const arcPathId = "eraArcPath" + i;
        const arcPath = document.createElementNS(SVGNS, "path");
        arcPath.setAttribute("id", arcPathId);
        arcPath.setAttribute("d",
            `M ${pStart.x.toFixed(2)} ${pStart.y.toFixed(2)} ` +
            `A ${textR} ${textR} 0 0 ${sweep} ${pEnd.x.toFixed(2)} ${pEnd.y.toFixed(2)}`);
        arcPath.setAttribute("fill", "none");
        defs.appendChild(arcPath);

        // 字号自适应：先给一个基准，再根据宽度需要缩小
        let fontSize = currentLang === "en" ? 13 : 15;
        const est = estimateTextWidth(name, fontSize) + name.length * fontSize * 0.06;
        if (est > arcLength * 0.92){
            fontSize = Math.max(9, fontSize * (arcLength * 0.92) / est);
        }

        const text = document.createElementNS(SVGNS, "text");
        text.setAttribute("font-family", "'Noto Serif SC', Georgia, serif");
        text.setAttribute("font-size", fontSize.toFixed(1));
        text.setAttribute("font-weight", "500");
        text.setAttribute("letter-spacing", "0.06em");
        text.setAttribute("fill", "#2d1a10");
        text.setAttribute("text-anchor", "middle");

        const textPath = document.createElementNS(SVGNS, "textPath");
        textPath.setAttribute("href", "#" + arcPathId);
        textPath.setAttribute("startOffset", "50%");
        textPath.textContent = name;

        text.appendChild(textPath);
        svg.appendChild(text);
    }

    // 内外金环（不变）
    const ring1 = document.createElementNS(SVGNS, "circle");
    ring1.setAttribute("cx", CX); ring1.setAttribute("cy", CY);
    ring1.setAttribute("r", R);
    ring1.setAttribute("fill", "none");
    ring1.setAttribute("stroke", "#b8935a");
    ring1.setAttribute("stroke-width", "2.5");
    svg.appendChild(ring1);

    const ring2 = document.createElementNS(SVGNS, "circle");
    ring2.setAttribute("cx", CX); ring2.setAttribute("cy", CY);
    ring2.setAttribute("r", R - 6);
    ring2.setAttribute("fill", "none");
    ring2.setAttribute("stroke", "#d4b878");
    ring2.setAttribute("stroke-width", "0.8");
    ring2.setAttribute("opacity", "0.7");
    svg.appendChild(ring2);
}
function manualSelectEra(era){
    if (!era) return;
    selectedEra = era;
    currentJourneySaved = false;
    const sel = document.getElementById("eraManualSelect");
    if (sel) sel.value = "";
    goToContinent();
}
/* 根据转盘当前旋转角度，算出指针指向的时代索引 */
function getEraIndexAtPointer(rotation){
    const n = eras.length;
    const step = 360 / n;
    let offset = ((-rotation % 360) + 360) % 360;
    let index = Math.round(offset / step) % n;
    return index;
}

function startEraDraw(){
    const result = document.getElementById("eraResult");
    const btn = document.getElementById("eraStartButton");
    const actions = document.getElementById("eraActions");
    const wrapper = document.getElementById("eraWheelWrapper");

    btn.classList.add("hidden");
    actions.classList.add("hidden");
    result.textContent = t("drawing");
    PetSystem.reactDrawStart();

    clearInterval(eraTimer);
    wrapper.style.transition = "none";

    /* ===== 随机总时长：1.00 ~ 1.50 秒，步长 0.01 ===== */
    const totalSec = Math.round((1.8 + Math.random() * 0.5) * 100) / 100;

    /* ===== 随机初速度（决定最终落点） ===== */
    const v0 = 520 + Math.random() * 380;   // 520 ~ 900 度/秒

    const startRotation = eraRotation;
    const startTime = performance.now();
    const uniformRatio = 0.7;              // 前 70% 匀速

    const uniformEnd = startTime + totalSec * uniformRatio * 1000;
    const totalEnd = startTime + totalSec * 1000;

    // 匀速段总转过的角度
    const uniformDeg = v0 * totalSec * uniformRatio;
    // 减速段总转过的角度（easeOutQuad 从 v0 平滑减到 0）
    const decelDeg = v0 * totalSec * (1 - uniformRatio) / 2;

    let lastTextUpdate = 0;

    function step(){
        const now = performance.now();
        let rotation;

        if (now < uniformEnd){
            // 匀速段
            const elapsed = (now - startTime) / 1000;
            rotation = startRotation + v0 * elapsed;
        } else if (now < totalEnd){
            // 减速段
            const tDec = (now - uniformEnd) / (totalEnd - uniformEnd);  // 0~1
            const ease = 1 - Math.pow(1 - tDec, 2);                     // easeOutQuad
            rotation = startRotation + uniformDeg + decelDeg * ease;
        } else {
            // 停下
            rotation = startRotation + uniformDeg + decelDeg;
            eraRotation = ((rotation % 360) + 360) % 360;
            wrapper.style.transform = `rotate(${rotation}deg)`;

            const idx = getEraIndexAtPointer(rotation);
            selectedEra = eras[idx];
            result.textContent = t("willArrive") + getEraName(selectedEra);
            actions.classList.remove("hidden");
            PetSystem.reactResult();
            return;
        }

        wrapper.style.transform = `rotate(${rotation}deg)`;

        if (now - lastTextUpdate > 40){
            lastTextUpdate = now;
            const idx = getEraIndexAtPointer(rotation);
            result.textContent = getEraName(eras[idx]);
        }

        requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
}
/* ====================================================
   大洲选择页
   ==================================================== */
function refreshContinentButtonCounts(eraPool){
    const eraPoolSet = new Set(eraPool);
    let randomAvailableCount = 0;
    const availableCounts = {};
    Object.keys(continents).forEach(k => {
        const avail = continents[k].filter(c => eraPoolSet.has(c)).length;
        availableCounts[k] = avail;
        if (avail > 0) randomAvailableCount++;
    });
    document.querySelectorAll(".continent-btn").forEach(btn => {
        const c = btn.dataset.continent;
        let count;
        if (c === "不限") count = eraPool.length;
        else if (c === "随机") count = randomAvailableCount;
        else count = availableCounts[c] || 0;
        const sub = btn.querySelector(".cont-sub");
        if (sub){
            const enPart = sub.dataset.en || sub.textContent.split(" · ")[0];
            if (!sub.dataset.en) sub.dataset.en = enPart;
            sub.textContent = (sub.dataset.en) + " · " + count;
        }
        if (count === 0){ btn.disabled = true; btn.classList.add("disabled"); }
        else { btn.disabled = false; btn.classList.remove("disabled"); }
        btn.classList.toggle("active", c === chosenContinent);
    });
}

function goToContinent(){
    showScreen("continentScreen");
    const meta = getEraMeta(selectedEra);
    document.getElementById("eraCardYears").textContent = meta.years;
    document.getElementById("eraCardDesc").textContent = meta.desc;
        document.getElementById("eraCardFeeling").textContent = meta.feeling || "";

    const eraPool = getEraCountries(selectedEra);
    const eraPoolSet = new Set(eraPool);

    if (chosenContinent !== "不限" && chosenContinent !== "随机"){
        const cc = continents[chosenContinent] || [];
        const intersect = cc.filter(c => eraPoolSet.has(c));
        if (intersect.length === 0) chosenContinent = "不限";
    }

    refreshContinentButtonCounts(eraPool);
    document.getElementById("continentHint").textContent = t("hintAvailable").replace("{n}", eraPool.length);
}

function chooseContinent(c){
    const oldCont = chosenContinent;
    const oldPicked = pickedContinentThisDraw;
    chosenContinent = c;

    if (c === "随机"){
        const eraPool = getEraCountries(selectedEra);
        const eraPoolSet = new Set(eraPool);
        const availableConts = Object.keys(continents).filter(k =>
            continents[k].some(x => eraPoolSet.has(x))
        );
        pickedContinentThisDraw = randomChoice(availableConts);
    } else {
        pickedContinentThisDraw = "";
    }

    const realChanged = (oldCont !== c) || (oldPicked !== pickedContinentThisDraw);

    document.querySelectorAll(".continent-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.continent === c);
    });

    if (realChanged){
        selectedCountry = "";
        document.getElementById("countryResult").textContent = t("notDrawn");
        document.getElementById("countryActions").classList.add("hidden");
        document.getElementById("countryStartButton").classList.remove("hidden");
        clearMarker();
        globeIdleRotating = true;
    }
    goToCountry();
}
function goToCountry(){
    showScreen("countryScreen");
    document.getElementById("countryEra").textContent = t("prefixEra") + getEraName(selectedEra);
    document.getElementById("countryRange").textContent = t("prefixRange") + getRangeText();
    applyGlobeTheme(selectedEra);
    if (!selectedCountry){
        rotateAnim = null;
        pendingOnStop = null;
        globeIdleRotating = true;
    }
    refreshCountryManualSelect();
}

function refreshCountryManualSelect(){
    const sel = document.getElementById("countryManualSelect");
    if (!sel) return;

    const eraPool = getEraCountries(selectedEra);
    const eraPoolSet = new Set(eraPool);

    let pool;
    if (chosenContinent === "不限"){
        pool = eraPool;
    } else if (chosenContinent === "随机"){
        pool = (continents[pickedContinentThisDraw] || []).filter(c => eraPoolSet.has(c));
        if (pool.length === 0) pool = eraPool;
    } else {
        pool = (continents[chosenContinent] || []).filter(c => eraPoolSet.has(c));
    }
    if (!pool || pool.length === 0) pool = eraPool;

    let html = '<option value="" data-i18n="optOrCustom">' + t("optOrCustom") + '</option>';
    pool.forEach(c => {
        html += '<option value="' + c + '">' + getCountryName(selectedEra, c) + '</option>';
    });
    sel.innerHTML = html;
}
function manualSelectCountry(country){
    if (!country) return;
    selectedCountry = country;
    const sel = document.getElementById("countryManualSelect");
    if (sel) sel.value = "";
    clearInterval(countryTimer);
    const result = document.getElementById("countryResult");
    result.textContent = t("prefixVisit") + getCountryName(selectedEra, country);
    document.getElementById("countryStartButton").classList.add("hidden");
    document.getElementById("countryActions").classList.remove("hidden");
    const coords = countryCoords[country] || null;
    if (coords){
        setMarker(coords[0], coords[1]);
        rotateAnim = null;
        pendingOnStop = null;
        globeIdleRotating = false;
        glideGlobeTo(coords[0], coords[1], 1200, function(){ showMarker(); });
    } else {
        showMarker();
    }
}
