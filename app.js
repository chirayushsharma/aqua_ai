/* ── Navigation ── */
const PAGES = ['home','dashboard','monitor','ai','camera','map','analytics','alerts','report'];

function go(name) {
  PAGES.forEach(p => {
    document.getElementById('page-' + p)?.classList.remove('show');
    document.getElementById('nl-' + p)?.classList.remove('active');
  });
  document.querySelectorAll('.bn-item').forEach(b => b.classList.remove('on'));

  document.getElementById('page-' + name)?.classList.add('show');
  document.getElementById('nl-' + name)?.classList.add('active');

  const bnMap = {home:0,dashboard:1,monitor:1,ai:1,map:2,alerts:3,report:4};
  const bnItems = document.querySelectorAll('.bn-item');
  if (bnMap[name] !== undefined) bnItems[bnMap[name]]?.classList.add('on');

  // page inits
  if (name === 'monitor')  { drawChart('ph'); }
  if (name === 'ai')       { setTimeout(animRiskBar, 150); }

  window.scrollTo(0, 0);
}

/* ── Toast ── */
let toastTimer;
function toast(title, body) {
  clearTimeout(toastTimer);
  document.getElementById('toast-title').textContent = title;
  document.getElementById('toast-body').textContent  = body;
  const t = document.getElementById('toast');
  t.classList.add('show');
  toastTimer = setTimeout(() => t.classList.remove('show'), 3600);
}

/* ── Chart ── */
const CHART_DATA = {
  ph:   [80,74,82,77,70,67,72,76,82,86,80,76,71,74,77,81,83,78,73,71,76,80,83,85],
  tds:  [100,94,90,100,112,122,104,96,88,92,101,106,112,100,96,90,88,93,97,101,106,100,94,90],
  turb: [122,112,100,116,132,126,110,100,94,101,110,122,132,120,110,100,94,100,106,112,116,110,106,100],
  do:   [70,75,80,75,70,64,70,76,81,86,80,75,70,72,76,81,83,80,74,70,75,81,83,86]
};
const CHART_LABELS = { ph:'pH Level', tds:'TDS (ppm)', turb:'Turbidity (NTU)', do:'Dissolved O₂ (mg/L)' };

function drawChart(key) {
  const d = CHART_DATA[key], svgW = 900, svgH = 180, padX = 10, padY = 10;
  const usableH = svgH - 40, usableW = svgW - 2 * padX;
  const mn = Math.min(...d), mx = Math.max(...d);
  const pts = d.map((v,i) => [
    padX + (i/(d.length-1))*usableW,
    padY + (1-(v-mn)/(mx-mn||1))*usableH
  ]);
  const seg = (a,b) => {
    const dx=b[0]-a[0], dy=b[1]-a[1];
    return { c1:[a[0]+dx*.3,a[1]+dy*.1], c2:[b[0]-dx*.3,b[1]-dy*.1] };
  };
  let line = `M${pts[0][0]},${pts[0][1]}`;
  for (let i=1;i<pts.length;i++) {
    const s=seg(pts[i-1],pts[i]);
    line += ` C${s.c1[0]},${s.c1[1]} ${s.c2[0]},${s.c2[1]} ${pts[i][0]},${pts[i][1]}`;
  }
  const area = line + ` L${pts[pts.length-1][0]},${svgH-20} L${pts[0][0]},${svgH-20} Z`;
  document.getElementById('c-line').setAttribute('d', line);
  document.getElementById('c-area').setAttribute('d', area);
  document.getElementById('chart-title').textContent = CHART_LABELS[key] + ' — Last 24 Hours';
}

function switchTab(btn, key) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('on'));
  btn.classList.add('on');
  drawChart(key);
}

/* ── AI Risk Bar ── */
function animRiskBar() {
  document.getElementById('re-bar').style.width = '47%';
}

function runAI() {
  const btn = document.getElementById('ai-run-btn');
  btn.innerHTML = '<span class="spin"></span> Analysing…';
  btn.disabled = true;
  document.getElementById('re-bar').style.width = '0%';

  setTimeout(() => {
    const scores = [18, 35, 47, 64, 73, 89];
    const s = scores[Math.floor(Math.random() * scores.length)];
    document.getElementById('re-bar').style.width = s + '%';
    document.getElementById('re-num').textContent = s;

    const levels = [
      [18, 'var(--safe)',     '✅ LOW RISK'],
      [35, 'var(--safe)',     '✅ LOW RISK'],
      [47, 'var(--moderate)', '⚠ MODERATE RISK'],
      [64, 'var(--high)',     '🔴 HIGH RISK'],
      [73, 'var(--high)',     '🔴 HIGH RISK'],
      [89, 'var(--critical)', '🚨 CRITICAL RISK'],
    ];
    const [,color,label] = levels.find(l => l[0] === s);
    document.getElementById('re-num').style.color    = color;
    document.getElementById('re-status').style.color = color;
    document.getElementById('re-status').textContent  = label;

    btn.innerHTML = '🔄 Re-run Analysis';
    btn.disabled  = false;
    toast('AI Analysis Complete', `Risk Score: ${s}/100 — ${label}`);
  }, 1900);
}

/* ── Camera AI ── */
function analyzeImg(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const wrap = document.getElementById('cam-img-wrap');
    wrap.innerHTML = `<img src="${ev.target.result}" alt="Water sample">`;
    document.getElementById('cam-result').classList.add('show');
    toast('AI Analysis Complete', '3 pollution indicators detected');
  };
  reader.readAsDataURL(file);
}

function runDemoAnalysis() {
  const wrap = document.getElementById('cam-img-wrap');
  wrap.innerHTML = `
    <div style="text-align:center;padding:40px 20px;color:var(--safe)">
      <div style="font-size:52px;margin-bottom:12px">🌊</div>
      <div style="font-size:14px;font-weight:700">Demo: River Surface Analysis</div>
      <div style="font-size:12px;color:var(--muted);margin-top:6px">Simulated sensor image</div>
    </div>`;
  document.getElementById('cam-result').classList.add('show');
  toast('AI Analysis Complete', '3 pollution indicators detected · High confidence');
}

/* ── Map popup ── */
function showPin(el, loc, ph, wqi, status, cls) {
  const popup = document.getElementById('map-popup');
  document.getElementById('mp-loc').textContent    = '📍 ' + loc;
  document.getElementById('mp-ph').textContent     = ph;
  document.getElementById('mp-wqi').textContent    = wqi;
  const colMap = { safe:'var(--safe)', moderate:'var(--moderate)', unsafe:'var(--high)' };
  const sv = document.getElementById('mp-status');
  sv.textContent  = status;
  sv.style.color  = colMap[cls] || 'var(--white)';

  const shell = document.getElementById('map-shell');
  const sr = shell.getBoundingClientRect();
  const er = el.getBoundingClientRect();
  let left = er.left - sr.left + 20;
  let top  = er.top  - sr.top  - 140;
  if (left + 210 > sr.width)  left = left - 230;
  if (top < 10) top = er.bottom - sr.top + 10;
  popup.style.left = left + 'px';
  popup.style.top  = top  + 'px';
  popup.classList.add('show');
}

document.addEventListener('click', e => {
  if (!e.target.closest('.map-pin'))
    document.getElementById('map-popup')?.classList.remove('show');
});

/* ── Report Generator ── */
let genRunning = false;
function generateReport() {
  if (genRunning) return;
  genRunning = true;
  const btn = document.getElementById('gen-btn');
  btn.innerHTML = '<span class="spin"></span> Generating…';
  btn.disabled  = true;
  setTimeout(() => {
    document.getElementById('report-doc').classList.add('show');
    btn.innerHTML = '✅ Report Ready — Download PDF';
    btn.disabled  = false;
    genRunning    = false;
    toast('Report Generated', 'AquaAI_Report_June2025.pdf is ready');
  }, 2000);
}

/* ── Init ── */
window.addEventListener('load', () => {
  drawChart('ph');          // pre-render chart data
  setTimeout(animRiskBar, 800); // soft init
});