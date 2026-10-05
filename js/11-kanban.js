/* ====================================================
   主界面立绘：眨眼 + 目光跟随
   ==================================================== */
function initKanban(){
  const baseEye  = document.getElementById('kanbanEyeBase');
  const pupilEye = document.getElementById('kanbanEyePupil');
  const closeEye = document.getElementById('kanbanEyeClose');
  if (!baseEye || !pupilEye || !closeEye) return;

  /* -------- 眨眼 -------- */
  function blinkOnce(){
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
    const delay = 2800 + Math.random() * 4200;
    setTimeout(() => {
      blinkOnce();
      if (Math.random() < 0.25){
        setTimeout(blinkOnce, 320);
      }
      scheduleBlink();
    }, delay);
  }
  scheduleBlink();

  /* -------- 目光跟随鼠标（只动瞳孔，仅桌面端） -------- */
  const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  const hasHover = window.matchMedia('(hover: hover)').matches;
  // 触屏且无 hover → 不跟随（手机/平板）
  if (!isTouch || hasHover){
    document.addEventListener('mousemove', (e) => {
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
    // 手机端：瞳孔固定在中央
    pupilEye.style.transform = 'translate(0, 0)';
  }
}
