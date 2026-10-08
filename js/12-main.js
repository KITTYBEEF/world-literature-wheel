/* ====================================================
   启动
   ==================================================== */
// 初始化语言
document.documentElement.lang = currentLang === "zh" ? "zh-CN" : "en";
applyI18nToDocument();

// 等浏览器空闲一拍再构建一次转盘，避免和页面初始渲染抢时机
setTimeout(buildEraWheel, 0);

// 启动桌宠和立绘
/* ====================================================
   点击转盘 / 地球 / 书页 = 点「好」
   ==================================================== */
function initClickToDraw(){
  function bind(selector, btnId, actionsId, fn){
    const el = document.querySelector(selector);
    const btn = document.getElementById(btnId);
    const actions = document.getElementById(actionsId);
    if (!el || !btn || !actions) return;
    el.addEventListener('click', function(){
      const btnVisible     = !btn.classList.contains('hidden');
      const actionsVisible = !actions.classList.contains('hidden');
      // 「好」显示 → 可以抽；「重新抽取/下一步」显示 → 可以重抽
      // 两个都隐藏 → 说明正在转，不响应
      if (btnVisible || actionsVisible) fn();
    });
  }
  bind('.wheel-stage', 'eraStartButton',     'eraActions',     startEraDraw);
  bind('#globe',       'countryStartButton', 'countryActions', startCountryDraw);
  bind('.sea',         'genderStartButton',  'genderActions',  startGenderDraw);
  bind('.book-stage',  'genreStartButton',   'genreActions',   startGenreDraw);
}
initClickToDraw();
initKanban();
initGlobe();

/* ====================================================
   主页测试搜索：输入书名直接跳到找书页
   ==================================================== */
async function homeSearchBook(){
    const input = document.getElementById('homeSearchInput');
    const keyword = input ? input.value.trim() : '';
    if (!keyword) return;

    // 书库没加载就先加载（第一次搜索会慢一点）
    if (!booksLoaded){
        if (input) input.placeholder = '加载书库中……';
        await loadBooks();
        if (input) input.placeholder = '测试：输入书名';
    }

    // 模糊匹配书名
    const found = BOOKS.find(b => b.title.includes(keyword));
    if (!found){
        alert('没找到包含「' + keyword + '」的书');
        return;
    }

    // 把这本书的所有属性写进当前状态
    selectedEra = found.era;
    selectedCountry = found.country;
    selectedGender = found.gender;
    selectedGenre = found.genre;
    chosenContinent = "不限";
    pickedContinentThisDraw = "";
    currentJourneySaved = true; // 测试用，不写入历史记录

    // 跳到找书页
    await goToFindBook();
}