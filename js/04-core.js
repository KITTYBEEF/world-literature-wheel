/* ===== 重新开始函数 ===== */
function restartJourney() {
    // 1. 重置所有状态变量（包含你刚刚发来的这几个）
    selectedEra = "";
    selectedCountry = "";
    selectedGender = "";
    selectedGenre = "";
    chosenContinent = "不限";
    pickedContinentThisDraw = "";
    currentJourneySaved = false;
    eraRotation = 0;
    
    // 清理可能还在运行的定时器
    if (eraTimer) { clearInterval(eraTimer); eraTimer = null; }
    eraSpinState = null;
    if (countryTimer) { clearInterval(countryTimer); countryTimer = null; }
    if (genderTimer) { clearInterval(genderTimer); genderTimer = null; }
    if (genreTimer) { clearInterval(genreTimer); genreTimer = null; }
    spinState = null;
    drawingPool = null;
    isDrawingCountry = false;

    // 2. 隐藏历史记录和更多书籍弹窗
    const historyOverlay = document.getElementById('historyOverlay');
    const moreBooksOverlay = document.getElementById('moreBooksOverlay');
    if (historyOverlay) historyOverlay.classList.add('hidden');
    if (moreBooksOverlay) moreBooksOverlay.classList.add('hidden');

    // 3. 重置各个页面的结果显示文字为“尚未抽取”
    const notDrawnText = typeof t === 'function' ? t('notDrawn') : '尚未抽取';
    ['eraResult', 'countryResult', 'genderResult', 'genreResult'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = notDrawnText;
    });

    // 4. 隐藏“下一步”和“重新抽取”按钮
    ['eraActions', 'countryActions', 'genderActions', 'genreActions'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
    // 4.5 重新显示四个「好/抽取」按钮
    ['eraStartButton', 'countryStartButton', 'genderStartButton', 'genreStartButton'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('hidden');
    });
    // 5. 清空最终结果页面的文字
    ['finalEra', 'finalCountry', 'finalGender', 'finalGenre'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '';
    });

    // 6. 重置“找书”页面
    const findBookList = document.getElementById('findBookList');
    if (findBookList) findBookList.innerHTML = '（待填数据）';
    const seeMoreWrap = document.getElementById('seeMoreWrap');
    if (seeMoreWrap) seeMoreWrap.style.display = 'none';

    // 7. 切换回首页（需要判断 showScreen 函数是否存在）
     const pupilEl = document.getElementById('kanbanEyePupil');
    if (pupilEl) pupilEl.style.transform = 'translate(0, 0)';
   if (typeof showScreen === 'function') {
        showScreen('homeScreen');
    } else {
        document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
        const homeScreen = document.getElementById('homeScreen');
        if (homeScreen) homeScreen.classList.remove('hidden');
    }
}

/* ====================================================
   语言切换
   ==================================================== */
function applyI18nToDocument(){
  // 静态元素
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  // 历史面板的空状态（含 <br>）
  const emptyEl = document.getElementById("historyEmpty");
  if (emptyEl) emptyEl.innerHTML = t("historyEmpty");
  // 文档标题
  document.title = t("homeTitle");
  // 语言按钮文字
  const langBtn = document.getElementById("langSwitch");
  if (langBtn) langBtn.textContent = currentLang === "zh" ? "EN" : "中";
  refreshSelectOptions();
}
function refreshSelectOptions(){
  const eraSel = document.getElementById("eraManualSelect");
  if (eraSel){
    Array.from(eraSel.options).forEach(opt => {
      if (!opt.value) opt.textContent = t("optOrCustom");
      else opt.textContent = getEraName(opt.value);
    });
  }
  const genderSel = document.getElementById("genderManualSelect");
  if (genderSel){
    Array.from(genderSel.options).forEach(opt => {
      if (!opt.value) opt.textContent = t("optOrCustom");
      else opt.textContent = getGenderName(opt.value);
    });
  }
  const genreSel = document.getElementById("genreManualSelect");
  if (genreSel){
    Array.from(genreSel.options).forEach(opt => {
      if (!opt.value) opt.textContent = t("optOrCustom");
      else opt.textContent = getGenreName(opt.value);
    });
  }
  if (typeof refreshCountryManualSelect === "function"){
    refreshCountryManualSelect();
  }
}
function refreshDynamicContent(){
  // 根据当前可见屏幕，刷新动态内容
  if (!document.getElementById("countryScreen").classList.contains("hidden")){
    document.getElementById("countryEra").textContent = t("prefixEra") + getEraName(selectedEra);
    document.getElementById("countryRange").textContent = t("prefixRange") + getRangeText();
    // 结果
    const cr = document.getElementById("countryResult");
    if (selectedCountry){
      cr.textContent = t("prefixVisit") + getCountryName(selectedEra, selectedCountry);
    }
  }
  if (!document.getElementById("continentScreen").classList.contains("hidden")){
    const meta = getEraMeta(selectedEra);
    document.getElementById("eraCardYears").textContent = meta.years;
    document.getElementById("eraCardDesc").textContent = meta.desc;
    const eraPool = getEraCountries(selectedEra);
    document.getElementById("continentHint").textContent = t("hintAvailable").replace("{n}", eraPool.length);
    // 刷新每个按钮的副文本
    refreshContinentButtonCounts(eraPool);
  }
  if (!document.getElementById("genderScreen").classList.contains("hidden")){
    document.getElementById("genderEraText").textContent = t("prefixEra") + getEraName(selectedEra);
    document.getElementById("genderCountryText").textContent = t("prefixCountry") + getCountryName(selectedEra, selectedCountry);
    const gr = document.getElementById("genderResult");
    if (selectedGender){
      gr.textContent = t("msgWillLead").replace("{name}", getGenderName(selectedGender));
    }
  }
  if (!document.getElementById("genreScreen").classList.contains("hidden")){
    document.getElementById("genreEraText").textContent = t("prefixEra") + getEraName(selectedEra);
    document.getElementById("genreCountryText").textContent = t("prefixCountry") + getCountryName(selectedEra, selectedCountry);
    document.getElementById("genreGenderText").textContent = t("prefixGender") + getGenderName(selectedGender);
    const gr = document.getElementById("genreResult");
    if (selectedGenre){
      gr.textContent = t("prefixRead") + getGenreName(selectedGenre);
    }
    buildBook();
  }
  if (!document.getElementById("finalScreen").classList.contains("hidden")){
    document.getElementById("finalEra").textContent = t("finalEra") + getEraName(selectedEra);
    document.getElementById("finalCountry").textContent = t("finalCountry") + getCountryName(selectedEra, selectedCountry);
    document.getElementById("finalGender").textContent = t("finalGender") + getGenderName(selectedGender);
    document.getElementById("finalGenre").textContent = t("finalGenre") + getGenreName(selectedGenre);
  }
  // 历史面板
  if (!document.getElementById("historyOverlay").classList.contains("hidden")){
    renderHistory();
  }
  // 时代转盘（重建，标签会更新）
  buildEraWheel();
}

function setLanguage(lang){
  currentLang = lang;
  localStorage.setItem("wlt_lang", lang);
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";

  applyI18nToDocument();
  refreshDynamicContent();
}

function toggleLanguage(){
  setLanguage(currentLang === "zh" ? "en" : "zh");
}

function getEraMeta(era){
  if (currentLang === "en") return ERA_META_EN[era] || { years:"", desc:"" };
  return eraMeta[era] || { years:"", desc:"" };
}

function getRangeText(){
    const contMap = { "亚洲":"contAsia","欧洲":"contEurope","非洲":"contAfrica","美洲":"contAmericas","大洋洲":"contOceania" };
    if (chosenContinent === "不限") return t("rangeAll");
    if (chosenContinent === "随机"){
        if (pickedContinentThisDraw){
            return t("rangeRandom") + "（" + t(contMap[pickedContinentThisDraw] || pickedContinentThisDraw) + "）";
        }
        return t("rangeRandom");
    }
    return t(contMap[chosenContinent] || chosenContinent);
}
/* ====================================================
   通用
   ==================================================== */
function showScreen(id){
    document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");
    if (id === "findBookScreen" && booksLoaded) renderFindBook();
    // 看板娘切换：主界面 -> 大立绘；其他 -> Q版桌宠
    const isHome = (id === "homeScreen");
    const mainChar = document.getElementById("kanbanMain");
    const pet = document.getElementById("pet");
    if (mainChar) mainChar.classList.toggle("hidden", !isHome);
    if (pet){
        pet.classList.toggle("hidden", isHome);
        if (!isHome){
            PetSystem.ensureInit();
            PetSystem.resume();
        } else {
            PetSystem.pause();
        }
    }
}
function randomChoice(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function startJourney(){
    currentJourneySaved = false;
    showScreen("eraScreen");
    buildEraWheel();   // ← 保证进入时代页时转盘已经渲染
}
function getEraCountries(era){ return eraCountries[era] || countries; }

function goBack(target){
    if (target === "home"){ showScreen("homeScreen"); }
    if (target === "era"){ showScreen("eraScreen"); }
    else if (target === "continent"){ goToContinent(); }
    else if (target === "country"){ goToCountry(); }
    else if (target === "gender"){
        showScreen("genderScreen");
        document.getElementById("genderEraText").textContent = t("prefixEra") + getEraName(selectedEra);
        document.getElementById("genderCountryText").textContent = t("prefixCountry") + getCountryName(selectedEra, selectedCountry);
    }
    else if (target === "final"){ showScreen("finalScreen"); }
}
