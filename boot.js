if (!window.PgSignin || !window.PgDash || !window.PlaygroundApp) {
  console.error('[playground] a half did not evaluate — scroll UP for the first error.', {
    PgSignin: !!window.PgSignin,
    PgDash: !!window.PgDash,
    PlaygroundApp: !!window.PlaygroundApp
  });
}
ReactDOM.createRoot(document.getElementById('app')).render(React.createElement(window.PlaygroundApp, null));
requestAnimationFrame(() => {
  const boot = document.getElementById('boot');
  boot.classList.add('is-gone');
  setTimeout(() => boot.remove(), 400);
});
const params = new URLSearchParams(window.location.search);
if (params.get('bare')) document.body.classList.add('is-bare');
const isBare = !!params.get('bare');
function fit() {
  const scaler = document.getElementById('scaler');
  const box = document.getElementById('scaler-box');
  const dev = document.querySelector('.device');
  if (!scaler || !box || !dev) return;
  scaler.style.transform = 'scale(1)';
  box.style.width = box.style.height = '';
  if (isBare) return;
  const w = dev.offsetWidth,
    h = dev.offsetHeight;
  if (!w || !h || !window.innerWidth) return;
  const host = box.parentElement;
  const availW = host && host.clientWidth || window.innerWidth;
  const availH = host && host.clientHeight || window.innerHeight;
  const k = Math.max(0.2, Math.min(1, (availW - 40) / w, (availH - 40) / h));
  scaler.style.transform = 'scale(' + k + ')';
  box.style.width = w * k + 'px';
  box.style.height = h * k + 'px';
}
window.addEventListener('resize', fit);
if (window.ResizeObserver) new ResizeObserver(fit).observe(document.getElementById('app'));
fit();
setTimeout(fit, 150);
setTimeout(fit, 600);
const app = document.getElementById('app');
const curScale = () => {
  const sc = document.getElementById('scaler');
  if (!sc) return 1;
  try {
    return new DOMMatrixReadOnly(getComputedStyle(sc).transform).a || 1;
  } catch (e) {
    return 1;
  }
};
const indHide = new WeakMap();
app.addEventListener('scroll', e => {
  const el = e.target;
  if (!el || el.nodeType !== 1 || !el.closest) return;
  const ds = el.closest('.device-screen');
  if (!ds) return;
  const range = el.scrollHeight - el.clientHeight;
  if (range <= 0) return;
  let ind = ds.querySelector(':scope > .vc-scrollbar');
  if (!ind) {
    ind = document.createElement('div');
    ind.className = 'vc-scrollbar';
    ds.appendChild(ind);
  }
  const s = curScale();
  const top = (el.getBoundingClientRect().top - ds.getBoundingClientRect().top) / s;
  const visH = el.clientHeight;
  const thumbH = Math.max(24, visH * visH / el.scrollHeight);
  ind.style.height = thumbH + 'px';
  ind.style.top = top + el.scrollTop / range * (visH - thumbH) + 'px';
  ind.classList.add('is-visible');
  clearTimeout(indHide.get(ind));
  indHide.set(ind, setTimeout(() => ind.classList.remove('is-visible'), 700));
}, true);