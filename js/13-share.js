/* ====================================================
   分享卡片：把当前结果画成一张图
   ==================================================== */
async function downloadShareCard(){
    if (!selectedEra || !selectedCountry || !selectedGender || !selectedGenre){
        alert(currentLang === 'en' ? 'No result to share yet.' : '还没有抽签结果呢。');
        return;
    }

    // 等字体加载
    try {
        await Promise.all([
            document.fonts.load('500 76px "Noto Serif SC"'),
            document.fonts.load('500 58px "Noto Serif SC"'),
            document.fonts.load('400 24px "Noto Serif SC"'),
            document.fonts.load('400 22px "Noto Serif SC"'),
            document.fonts.load('400 18px "Noto Serif SC"')
        ]);
    } catch(e){}

    const W = 1200, H = 1600;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    /* 背景 */
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, '#fefcf7');
    bgGrad.addColorStop(0.55, '#faf4e6');
    bgGrad.addColorStop(1, '#f4ecd6');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    /* 双框 */
    ctx.strokeStyle = 'rgba(184,147,90,0.55)';
    ctx.lineWidth = 2;
    ctx.strokeRect(48, 48, W - 96, H - 96);
    ctx.strokeStyle = 'rgba(184,147,90,0.28)';
    ctx.lineWidth = 1;
    ctx.strokeRect(60, 60, W - 120, H - 120);

    /* 顶部菱形 */
    shareDrawDiamond(ctx, W / 2, 130, 14, '#b8935a');

    /* 主标题 */
    ctx.fillStyle = '#2d1a10';
    ctx.font = '500 76px "Noto Serif SC", "Songti SC", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('世界文学大转盘', W / 2, 260);

    /* 金线 */
    shareDrawLine(ctx, W / 2, 330, 220);

    /* 副标题 */
    ctx.fillStyle = '#8b6a4e';
    ctx.font = '400 24px "Noto Serif SC", "Songti SC", serif';
    ctx.fillText('· 你 的 文 学 旅 程 ·', W / 2, 390);

    /* 四个结果 */
    const items = [
        ['时代', getEraName(selectedEra)],
        ['国家', getCountryName(selectedEra, selectedCountry)],
        ['作家性别', getGenderName(selectedGender)],
        ['文学文体', getGenreName(selectedGenre)]
    ];
    let y = 560;
    const gap = 200;
    items.forEach(function(pair){
        ctx.fillStyle = '#b8935a';
        ctx.font = '400 22px "Noto Serif SC", "Songti SC", serif';
        ctx.fillText(pair[0], W / 2, y);
        ctx.fillStyle = '#2d1a10';
        ctx.font = '500 58px "Noto Serif SC", "Songti SC", serif';
        ctx.fillText(pair[1], W / 2, y + 68);
        y += gap;
    });

    /* 寄语 */
    ctx.fillStyle = '#8b6a4e';
    ctx.font = '400 22px "Noto Serif SC", "Songti SC", serif';
    ctx.fillText('愿你在陌生的文学世界中，', W / 2, 1370);
    ctx.fillText('遇见意料之外的思想与灵魂', W / 2, 1410);

    /* 底部菱形 */
    shareDrawDiamond(ctx, W / 2, 1465, 8, '#b8935a');

    /* 网址（自动从 og:url 读） */
    const siteUrl = (document.querySelector('meta[property="og:url"]') || {}).content || '';
    const displayUrl = siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
    ctx.fillStyle = '#b8935a';
    ctx.font = '400 18px "Noto Serif SC", "Songti SC", serif';
    ctx.fillText(displayUrl, W / 2, 1505);

    /* 转图片 → 弹窗展示 */
    const dataUrl = canvas.toDataURL('image/png');
    shareShowOverlay(dataUrl);
}

function shareShowOverlay(dataUrl){
    const existing = document.querySelector('.share-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'share-overlay';

    const panel = document.createElement('div');
    panel.className = 'share-panel';

    const hint = document.createElement('div');
    hint.className = 'share-hint';
    hint.textContent = t('shareHint');

    const img = document.createElement('img');
    img.src = dataUrl;
    img.alt = 'share card';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'share-close';
    closeBtn.textContent = t('btnClose');
    closeBtn.onclick = function(){ overlay.remove(); };

    panel.appendChild(hint);
    panel.appendChild(img);
    panel.appendChild(closeBtn);
    overlay.appendChild(panel);

    overlay.onclick = function(e){
        if (e.target === overlay) overlay.remove();
    };
    document.body.appendChild(overlay);
}

function shareDrawDiamond(ctx, x, y, size, color){
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = color;
    ctx.fillRect(-size / 2, -size / 2, size, size);
    ctx.restore();
}

function shareDrawLine(ctx, x, y, width){
    const grad = ctx.createLinearGradient(x - width / 2, y, x + width / 2, y);
    grad.addColorStop(0, 'rgba(184,147,90,0)');
    grad.addColorStop(0.5, 'rgba(184,147,90,0.85)');
    grad.addColorStop(1, 'rgba(184,147,90,0)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x - width / 2, y);
    ctx.lineTo(x + width / 2, y);
    ctx.stroke();
}