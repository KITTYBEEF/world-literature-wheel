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

    // 精确匹配优先（书名或作者名完全等于关键词）
    const exact = BOOKS.filter(b =>
        b.title === keyword || b.author === keyword
    );
    // 模糊匹配（书名或作者名包含关键词）
    const fuzzy = BOOKS.filter(b =>
        (b.title && b.title.includes(keyword)) ||
        (b.author && b.author.includes(keyword))
    );

    // 置顶组：所有匹配到的书（精确 + 模糊，去重）
    const seen = new Set();
    const pinned = [];
    for (const b of [...exact, ...fuzzy]){
        const key = (b.title || "") + "||" + (b.author || "");
        if (seen.has(key)) continue;
        seen.add(key);
        pinned.push(b);
    }

    if (pinned.length === 0){
        alert('没找到包含「' + keyword + '」的书');
        return;
    }

    // 用第一本（精确匹配优先）的属性作为筛选条件
    const anchor = exact[0] || pinned[0];
    selectedEra = anchor.era;
    selectedCountry = anchor.country;
    selectedGender = anchor.gender;
    selectedGenre = anchor.genre;
    chosenContinent = "不限";
    pickedContinentThisDraw = "";
    currentJourneySaved = true;

    // 把这批书钉在最前
    searchPinnedBooks = pinned;

    await goToFindBook();
}