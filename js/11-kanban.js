/* ====================================================
   主界面立绘：眨眼 + 目光跟随 + 自动睡眠
   ==================================================== */
function initKanban(){
  const baseEye  = document.getElementById('kanbanEyeBase');
  const pupilEye = document.getElementById('kanbanEyePupil');
  const closeEye = document.getElementById('kanbanEyeClose');
  if (!baseEye || !pupilEye || !closeEye) return;

  let blinkTimer = null;
  let sleepTimer = null;
  let isSleeping = false;

  /* -------- 基础眨眼动画 -------- */
  function blinkOnce(){
    if (isSleeping) return; // 睡着了就不执行眨眼
    // 确保眨眼瞬间没有过渡
    baseEye.style.transition = 'none';
    pupilEye.style.transition = 'none';
    closeEye.style.transition = 'none';

    baseEye.style.opacity = '0';
    pupilEye.style.opacity = '0';
    closeEye.style.opacity = '1';
    setTimeout(() => {
      closeEye.style.opacity = '0';
      baseEye.style.opacity = '1';
      pupilEye.style.opacity = '1';
    }, 130);
  }

  function scheduleBlink(){
    if (isSleeping) return;
    const delay = 2800 + Math.random() * 4200;
    blinkTimer = setTimeout(() => {
      blinkOnce();
      if (Math.random() < 0.25){
        setTimeout(blinkOnce, 320);
      }
      scheduleBlink();
    }, delay);
  }

  function triggerClickBlink(){
    if (isSleeping) {
      wakeUp(); // 如果睡着了，点击就唤醒她
      return;
    }
    if (blinkTimer) {
      clearTimeout(blinkTimer);
      blinkTimer = null;
    }
    blinkOnce();
    setTimeout(blinkOnce, 280);
    setTimeout(blinkOnce, 560);
    setTimeout(scheduleBlink, 1200);
  }

  /* -------- 睡眠与唤醒逻辑 -------- */
  function goToSleep(){
    isSleeping = true;
    if (blinkTimer) {
      clearTimeout(blinkTimer);
      blinkTimer = null;
    }
    // 用 2 秒的时间渐渐合眼
    baseEye.style.transition = 'opacity 2s ease';
    pupilEye.style.transition = 'opacity 2s ease';
    closeEye.style.transition = 'opacity 2s ease';

    baseEye.style.opacity = '0';
    pupilEye.style.opacity = '0';
    closeEye.style.opacity = '1';

    // 睡着时瞳孔归中
    pupilEye.style.transform = 'translate(0, 0)';
  }

  function wakeUp(){
    if (!isSleeping) return;
    isSleeping = false;
    // 瞬间睁眼（加一点点过渡也可以，这里用 0.15s 比较自然）
    baseEye.style.transition = 'opacity 0.15s ease';
    pupilEye.style.transition = 'opacity 0.15s ease';
    closeEye.style.transition = 'opacity 0.15s ease';

    baseEye.style.opacity = '1';
    pupilEye.style.opacity = '1';
    closeEye.style.opacity = '0';

    // 唤醒后重置随机眨眼定时器
    if (blinkTimer) clearTimeout(blinkTimer);
    scheduleBlink();
  }

  /* -------- 空闲检测（不点击就睡觉） -------- */
  function resetSleepTimer(){
    if (sleepTimer) clearTimeout(sleepTimer);
    // 如果当前是睡眠状态，立刻唤醒
    if (isSleeping) wakeUp();
    
    // 设定无操作 30 秒后进入睡眠（可改）
    sleepTimer = setTimeout(goToSleep, 30000); 
  }

  // 添加全局监听器，鼠标移动、点击、滚动、触摸都会重置计时器
  document.addEventListener('mousemove', resetSleepTimer);
  document.addEventListener('click', resetSleepTimer);
  document.addEventListener('scroll', resetSleepTimer);
  document.addEventListener('touchstart', resetSleepTimer);
  
  // 初始化睡眠定时器
  resetSleepTimer();

  // 添加看板娘点击事件
  const main = document.getElementById('kanbanMain');
  if (main) {
    main.addEventListener('click', triggerClickBlink);
  }

  /* -------- 目光跟随鼠标（只动瞳孔，仅桌面端） -------- */
  const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  const hasHover = window.matchMedia('(hover: hover)').matches;
  
  if (!isTouch || hasHover){
    document.addEventListener('mousemove', (e) => {
      if (isSleeping) return; // 睡着了不跟随
      const main = document.getElementById('kanbanMain');
      if (!main) return;
      const r = main.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * 0.28;
      const dx = (e.clientX - cx) / (window.innerWidth * 0.5);
      const dy = (e.clientY - cy) / (window.innerHeight * 0.5);
      const tx = Math.max(-2, Math.min(2, dx * 2.5));
      const ty = Math.max(-1.5, Math.min(1.5, dy * 2));
      pupilEye.style.transform = `translate(${tx}px, ${ty}px)`;
    });
  } else {
    pupilEye.style.transform = 'translate(0, 0)';
  }

  // 启动随机眨眼
  scheduleBlink();
}