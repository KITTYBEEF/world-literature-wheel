/* ====================================================
   地球
   ==================================================== */
let landFeature = null;
let landPathEl = null;
let markerEl = null;
let projection = null;
let pathGen = null;

let currentLambda = 20;
let currentGlobePhi = -18;
const defaultPhi = -18;
let globeIdleRotating = true;
let rotateAnim = null;

let markerLon = null;
let markerLat = null;

let lastT = 0;
const baseSpeed = 18;
const fastSpinSpeed = 260;
let isDrawingCountry = false;
let drawingPool = null;
let spinState = null;
let drawingEraForLon = "";
let lastLonUpdate = 0;

function initGlobe(){
    landPathEl = document.getElementById("landPath");
    markerEl = document.getElementById("countryMarker");
    if (typeof d3 === "undefined") { console.warn("d3 未加载"); return; }

    projection = d3.geoOrthographic()
        .scale(130).translate([150, 150]).clipAngle(90)
        .rotate([currentLambda, currentGlobePhi]);
    pathGen = d3.geoPath(projection);

    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/land-110m.json")
        .then(world => {
            landFeature = topojson.feature(world, world.objects.land);
            renderGlobe();
        })
        .catch(err => {
            console.error("地图数据加载失败:", err);
            if (landPathEl) landPathEl.setAttribute("d", "");
        });
    requestAnimationFrame(tick);
}

function renderGlobe(){
    if (!landFeature || !landPathEl) return;
    projection.rotate([currentLambda, currentGlobePhi]);
    landPathEl.setAttribute("d", pathGen(landFeature));

    if (markerEl && markerLon !== null && markerLat !== null){
        const p = projection([markerLon, markerLat]);
        if (p && !isNaN(p[0]) && !isNaN(p[1])){
            markerEl.setAttribute("transform", `translate(${p[0].toFixed(2)}, ${p[1].toFixed(2)})`);
        }
    }
}

function tick(t){
    const dt = lastT ? Math.min((t - lastT) / 1000, 0.05) : 0;
    lastT = t;
    const now = performance.now();

    if (spinState){
        let rotation;
        let finished = false;

        if (now < spinState.uniformEnd){
            // 匀速段
            const elapsed = (now - spinState.startTime) / 1000;
            rotation = spinState.startLambda + spinState.v0 * elapsed;
        } else if (now < spinState.totalEnd){
            // 减速段
            const tDec = (now - spinState.uniformEnd) / (spinState.totalEnd - spinState.uniformEnd);
            const ease = 1 - Math.pow(1 - tDec, 2);
            rotation = spinState.startLambda + spinState.uniformDeg + spinState.decelDeg * ease;
        } else {
            // 停下
            rotation = spinState.startLambda + spinState.uniformDeg + spinState.decelDeg;
            finished = true;
        }

        currentLambda = ((rotation % 360) + 360) % 360;

        if (finished){
            spinState = null;
            if (typeof pendingOnStop === "function"){
                const cb = pendingOnStop;
                pendingOnStop = null;
                cb();
            }
        }
    } else if (rotateAnim){
        const elapsed = now - rotateAnim.startTime;
        const progress = Math.min(elapsed / rotateAnim.duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);

        currentLambda = rotateAnim.startLambda + (rotateAnim.targetLambda - rotateAnim.startLambda) * ease;
        currentGlobePhi = rotateAnim.startPhi + (rotateAnim.targetPhi - rotateAnim.startPhi) * ease;

        if (progress >= 1){
            currentLambda = ((rotateAnim.targetLambda % 360) + 360) % 360;
            currentGlobePhi = rotateAnim.targetPhi;
            rotateAnim = null;
            if (typeof pendingOnStop === "function"){
                const cb = pendingOnStop;
                pendingOnStop = null;
                cb();
            }
        }
    } else if (globeIdleRotating){
        currentLambda += baseSpeed * dt;
        if (currentLambda > 360) currentLambda -= 360;
        if (currentLambda < 0) currentLambda += 360;
    }

    // 抽国家时，下方文字跟着地球经度联动
    if (isDrawingCountry){
        if (now - lastLonUpdate > 60){
            lastLonUpdate = now;
            const centerLon = -currentLambda;
            const c = getCountryByLon(centerLon, drawingPool);
            if (c){
                const el = document.getElementById("countryResult");
                if (el) el.textContent = getCountryName(drawingEraForLon, c);
            }
        }
    }

    renderGlobe();
    requestAnimationFrame(tick);
}
let pendingOnStop = null;

function applyGlobeTheme(era){
    const theme = eraGlobeThemes[era] || eraGlobeThemes["当代"];
    const seaStops = document.querySelectorAll("#seaGrad stop");
    if (seaStops[0]) seaStops[0].setAttribute("stop-color", theme.sea1);
    if (seaStops[1]) seaStops[1].setAttribute("stop-color", theme.sea2);
    if (landPathEl) landPathEl.setAttribute("fill", theme.land);
}

function glideGlobeTo(lon, lat, duration, onStop){
    const lonOffset = (Math.random() - 0.5) * 30;
    let targetLambda = -lon - lonOffset;

    let diff = targetLambda - currentLambda;
    while (diff > 180) diff -= 360;
    while (diff < -180) diff += 360;
    targetLambda = currentLambda + diff;

    const targetPhi = -lat * 0.65;

    rotateAnim = {
        startLambda: currentLambda,
        startPhi: currentGlobePhi,
        targetLambda,
        targetPhi,
        startTime: performance.now(),
        duration
    };
    globeIdleRotating = false;
    pendingOnStop = onStop || null;
}

function setMarker(lon, lat){
    markerLon = lon;
    markerLat = lat;
}
function showMarker(){
    if (markerEl){
        markerEl.classList.remove("show");
        void markerEl.offsetWidth;
        markerEl.classList.add("show");
    }
}
function clearMarker(){
    if (markerEl) markerEl.classList.remove("show");
    markerLon = null;
    markerLat = null;
}
/* 快速自转 + 减速停下（用于抽国家） */
function startSpin(onStop){
    rotateAnim = null;
    globeIdleRotating = false;

    // 随机总时长 1.00 ~ 1.50 秒（步长 0.01）
    const totalSec = Math.round((2 + Math.random() * 0.5) * 100) / 100;
    // 随机初速度（决定转过多少角度，也就决定最终落在哪个国家）
    const v0 = 480 + Math.random() * 320;   // 480 ~ 800 度/秒

    const startTime = performance.now();
    const uniformRatio = 0.7;              // 前 70% 匀速

    spinState = {
        startLambda: currentLambda,
        startTime: startTime,
        v0: v0,
        uniformEnd: startTime + totalSec * uniformRatio * 1000,
        totalEnd: startTime + totalSec * 1000,
        uniformDeg: v0 * totalSec * uniformRatio,
        decelDeg: v0 * totalSec * (1 - uniformRatio) / 2
    };
    pendingOnStop = onStop || null;
}
/* 根据经度找最近的国家（用于抽国家时的联动显示） */
function getCountryByLon(lon, pool){
    let L = ((lon % 360) + 540) % 360 - 180;
    let best = null, bestDist = 999;
    const list = pool || countries;
    for (const c of list){
        const coords = countryCoords[c];
        if (!coords) continue;
        let d = Math.abs(coords[0] - L);
        if (d > 180) d = 360 - d;
        if (d < bestDist){ bestDist = d; best = c; }
    }
    return best;
}