/* ====================================================
   Q版桌宠系统
   ==================================================== */
const PetSystem = {
  el: null,
  state: 'idle',
  x: 0,
  width: 0,
  isDragging: false,
  dragStartX: 0,
  elementStartX: 0,
  pointerDownTime: 0,
  pointerDownX: 0,
  pointerDownY: 0,
  moveAnimFrame: null,
  idleTimeout: null,
  stateTimeout: null,
  initialized: false,
  paused: false,

  ensureInit(){
    if (this.initialized) return;
    this.el = document.getElementById('pet');
    if (!this.el) return;
    this.initialized = true;

    requestAnimationFrame(() => {
      this.width = this.el.offsetWidth || 120;
      this.x = window.innerWidth * 0.7 - this.width / 2;
      this.clampX();
      this.el.style.left = this.x + 'px';
    });

    this.el.addEventListener('pointerdown', (e) => this.onPointerDown(e));
    document.addEventListener('pointermove', (e) => this.onPointerMove(e));
    document.addEventListener('pointerup', (e) => this.onPointerUp(e));
    document.addEventListener('pointercancel', (e) => this.onPointerUp(e));
    window.addEventListener('resize', () => this.onResize());
  },

  resume(){
    this.paused = false;
    this.scheduleIdle();
  },

  pause(){
    this.paused = true;
    this.cancelMove();
    if (this.idleTimeout){ clearTimeout(this.idleTimeout); this.idleTimeout = null; }
    if (this.stateTimeout){ clearTimeout(this.stateTimeout); this.stateTimeout = null; }
  },

  onPointerDown(e){
    if (this.paused) return;
    if (e.button !== undefined && e.button !== 0) return;
    if (!this.width){ this.width = this.el.offsetWidth || 120; }

    this.isDragging = true;
    this.dragStartX = e.clientX;
    this.elementStartX = this.x;
    this.pointerDownTime = Date.now();
    this.pointerDownX = e.clientX;
    this.pointerDownY = e.clientY;
    this.el.classList.add('dragging');
    this.cancelMove();
    this.setState('surprised');
    try { this.el.setPointerCapture(e.pointerId); } catch(err){}
    e.preventDefault();
  },

  onPointerMove(e){
    if (!this.isDragging) return;
    const dx = e.clientX - this.dragStartX;
    this.x = this.elementStartX + dx;
    this.clampX();
    this.el.style.left = this.x + 'px';
  },

  onPointerUp(e){
    if (!this.isDragging) return;
    this.isDragging = false;
    this.el.classList.remove('dragging');

    const dx = Math.abs(e.clientX - this.pointerDownX);
    const dy = Math.abs(e.clientY - this.pointerDownY);
    const dt = Date.now() - this.pointerDownTime;

    if (dx < 6 && dy < 6 && dt < 500){
      this.onClick();
    } else {
      this.stateTimeout = setTimeout(() => {
        this.setState('idle');
        this.scheduleIdle();
      }, 800);
    }
  },

  onClick(){
    this.cancelMove();
    this.setState('happy');
    if (this.stateTimeout) clearTimeout(this.stateTimeout);
    this.stateTimeout = setTimeout(() => {
      if (this.paused) return;
      this.setState('idle');
      this.scheduleIdle();
    }, 1800);
  },

    setState(s){
    if (this.state === s) return;
    this.state = s;
    if (this.el) this.el.dataset.state = s;
    const img = document.getElementById('petImg');
    if (img) img.src = 'pet-' + s + '.webp';
  },

  clampX(){
    const minX = 8;
    const maxX = window.innerWidth - this.width - 8;
    if (this.x < minX) this.x = minX;
    if (this.x > maxX) this.x = maxX;
  },

  scheduleIdle(){
    if (this.paused) return;
    if (this.idleTimeout) clearTimeout(this.idleTimeout);
    const delay = 5000 + Math.random() * 8000;
    this.idleTimeout = setTimeout(() => {
      if (Math.random() < 0.3){
        this.doThink();
      } else {
        this.startWalk();
      }
    }, delay);
  },

  doThink(){
    if (this.paused || this.isDragging) return;
    this.setState('thinking');
    if (this.stateTimeout) clearTimeout(this.stateTimeout);
    const thinkTime = 2200 + Math.random() * 1800;
    this.stateTimeout = setTimeout(() => {
      if (this.paused) return;
      this.setState('idle');
      this.scheduleIdle();
    }, thinkTime);
  },

  cancelMove(){
    if (this.moveAnimFrame){
      cancelAnimationFrame(this.moveAnimFrame);
      this.moveAnimFrame = null;
    }
    if (this.idleTimeout){
      clearTimeout(this.idleTimeout);
      this.idleTimeout = null;
    }
  },

   startWalk(){
    if (this.paused || this.isDragging) return;

    const startX = this.x;
    const distance = 60 + Math.random() * 220;
    const direction = Math.random() < 0.5 ? -1 : 1;
    let targetX = startX + direction * distance;

    const minX = 8;
    const maxX = window.innerWidth - this.width - 8;
    if (targetX < minX) targetX = minX;
    if (targetX > maxX) targetX = maxX;

    const dist = Math.abs(targetX - startX);
    if (dist < 30){ this.scheduleIdle(); return; }

    const speed = 55;
    const duration = dist / speed * 1000;
    const startTime = performance.now();
    const stepInterval = 400;

    this.setState('walk');

    const animate = (now) => {
      if (this.paused || this.isDragging){
        this.moveAnimFrame = null;
        return;
      }
      const t = Math.min((now - startTime) / duration, 1);
      const ease = t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2, 2)/2;
      this.x = startX + (targetX - startX) * ease;
      this.el.style.left = this.x + 'px';

      const phase = Math.floor((now - startTime) / stepInterval) % 2;
      const wantState = phase === 0 ? 'walk' : 'idle';
      if (this.state !== wantState) this.setState(wantState);

      if (t < 1){
        this.moveAnimFrame = requestAnimationFrame(animate);
      } else {
        this.moveAnimFrame = null;
        this.setState('idle');
        this.scheduleIdle();
      }
    };
    this.moveAnimFrame = requestAnimationFrame(animate);
  },

  onResize(){
    if (!this.el) return;
    this.width = this.el.offsetWidth || this.width;
    this.clampX();
    this.el.style.left = this.x + 'px';
  },

  reactDrawStart(){
    if (this.paused) return;
    this.cancelMove();
    if (this.stateTimeout) clearTimeout(this.stateTimeout);
    this.setState('excited');
  },
  reactRolling(){
    if (this.paused) return;
    this.setState('thinking');
  },

   reactResult(){
    if (this.paused) return;
    this.cancelMove();
    this.setState('surprised');
    if (this.stateTimeout) clearTimeout(this.stateTimeout);
    this.stateTimeout = setTimeout(() => {
      if (this.paused) return;
      this.setState('idle');
      this.scheduleIdle();
    }, 1800);
  }
};
