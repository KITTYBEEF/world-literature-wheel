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