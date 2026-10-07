/* ==========================================================
   VIA AMALFI — interacciones
   Neón VA que se enciende, manifiesto que se escribe con el
   scroll, selector de las tres pastas sobre su reel, la carta
   como un viaje en Vespa, galería arrastrable y reels.
   ========================================================== */
(() => {
'use strict';

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
const motion = hasGSAP && !reduced;
if (hasGSAP) gsap.registerPlugin(ScrollTrigger);
// si el navegador congela los frames (pestaña oculta), se completa la animación
const watchdog = (tl, ms) => { setTimeout(() => { if (tl.progress() < 1) tl.progress(1); }, ms); return tl; };
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

/* ----------------------------------------------------------
   DATOS
   ---------------------------------------------------------- */
const LUNCH = [780, 960];
const HOURS = { 0: [LUNCH, [1170, 1380]], 1: [LUNCH, [1170, 1380]], 2: [LUNCH, [1170, 1380]], 3: [LUNCH, [1170, 1380]], 4: [LUNCH, [1170, 1380]], 5: [LUNCH, [1170, 1410]], 6: [LUNCH, [1170, 1410]] };
const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const SEASON = [5, 10]; // mayo — octubre

const STOPS = [
  { town: 'Positano', t: 'Tapas', img: 'assets/img/brindis.jpg', items: [
    ['Patatas bravas', '6', 'Patatas frescas fritas con salsa brava casera'],
    ['Patatas cacio e pepe', '6,5', 'Con salsa de cacio e pepe'],
    ['Patatas sombrero', '7,5', 'Con butifarra asada y provola fundida'],
    ['Bruschetta', '6', 'Pan tostado con tomates cherry'],
    ['Croquetas (5)', '6,5', 'Croquetas de pollo'],
    ['Provola', '7,5', 'Mozzarella ahumada al horno en cazuela, con tomate y orégano'],
    ['Bacalao frito (4)', '8', 'Con mayonesa de cebolla roja y lima'],
    ['Albóndigas de la nonna (4)', '8', 'En salsa de tomate'],
    ['Jamón pata blanca gran reserva', '19,5', 'Cortado a mano, con pan carasau']
  ] },
  { town: 'Ravello', t: 'Entrantes', img: 'assets/img/burrata.jpg', items: [
    ['Ensalada césar', '10', 'Salsa césar, lascas de parmesano, crutones y cherry'],
    ['Parmigiana', '12', 'Lasaña de berenjena frita con mozzarella, tomate y parmesano'],
    ['Sauté de mejillones', '13', 'Salteados con ajo, perejil y vino blanco'],
    ['Burrata italiana 250 g', '13,5', 'Con tomates cherry'],
    ['Ensalada de mar', '14', 'Sepia, calamares y pulpo con vinagreta'],
    ['Steak tartare eco', '20', 'Con mayonesa trufada y picatostes crujientes']
  ] },
  { town: 'Amalfi', t: 'Pastas clásicas', img: 'assets/img/amatriciana.jpg', items: [
    ['Gnocchi alla sorrentina', '15,5', 'Ñoquis al horno con cherry y mozzarella'],
    ['Pomodorini e burrata', '16', 'Espagueti con cherry salteados y burrata'],
    ['Amatriciana', '17', 'Tomate, guanciale y pecorino'],
    ['Carbonara con trufa', '18', 'Con trufa de verano'],
    ['Cacio e pepe (mín. 2)', '20', 'Terminada en la rueda de parmesano']
  ] },
  { town: 'Sorrento', t: 'Segundos', img: 'assets/img/cocina.jpg', items: [
    ['Brochetta de butifarra', '16,5', 'A la parrilla, con crema de patata y fondue de mozzarella ahumada'],
    ['Napolitana', '18', 'Escalopa de pollo con jamón de Parma, burrata y cherry'],
    ['Dorada de la costa', '19', 'Con mayonesa de anchoas, zanahoria a baja temperatura y aceite de perejil'],
    ['Pulpo', '20', 'A la brasa, sobre crema de patatas, con patatas y mejillones']
  ] },
  { town: 'Napoli', t: 'A la brasa', img: 'assets/img/entrana.jpg', items: [
    ['Entrecot', '22', 'De hembra de Girona'],
    ['Chuletón', '70', 'Chuletón de vaca'],
    ['Tomahawk', '90', 'Servido en la mesa sobre piedra volcánica caliente'],
    ['Pescado del día', 's/m', 'Pregunta en sala']
  ] }
];

const PASTE = [
  { seg: [0, 2.15], d: 'Carbonara con trufa · espaguetis a la carbonara con trufa de verano.' },
  { seg: [2.15, 4.3], d: 'Amatriciana · salsa de tomate, guanciale y pecorino. “Uno de esos imprescindibles de Via Amalfi”.' },
  { seg: [4.3, 6.45], d: 'Cacio e pepe · terminada en una rueda de parmesano, delante de ti. Mínimo 2 personas.' }
];

const GALLERY = [
  ['amatriciana.jpg', 'Amatriciana, recién salida de la sartén'],
  ['cacio-rueda.jpg', 'La rueda de parmesano, en llamas'],
  ['burrata-parma.jpg', 'Burrata y jamón de Parma'],
  ['entrana.jpg', 'Entraña a la parrilla con parmentier'],
  ['baba.jpg', 'Babà bien empapado, con fresas'],
  ['bogavante.jpg', 'Pasta con bogavante'],
  ['burrata.jpg', 'Burrata con tomates cherry'],
  ['amatriciana-2.jpg', 'La amatriciana, de cerca'],
  ['brindis.jpg', '“Los mejores planes son así de sencillos”'],
  ['cocina.jpg', 'Las personas que hacen posible Via Amalfi'],
  ['sala-neon.jpg', 'La sala, con el neón VA'],
  ['manifiesto-3.jpg', '“Pasta casera, como nuestras abuelas”']
];

const VOICES = [
  ['Todo un descubrimiento. Servicio muy atento, comida espectacular. Un restaurante por encima del nivel de la zona.', 'Reseña en Google'],
  ['Hemos comido de lujo, productos de calidad y el servicio de 10. La burrata, hecha con muchísimo mimo.', 'Reseña en Google'],
  ['Auténtico italiano, la pasta está espectacular y todo muy rico.', 'Opinión de cliente'],
  ['Se nota un montón que la comida es casera y que la hacen en el momento.', 'Opinión de cliente'],
  ['Cada plato es una verdadera experiencia de sabor. Además, la atención muy buena y el ambiente muy agradable.', 'Reseña en Google']
];

/* ----------------------------------------------------------
   HORA DE LLORET
   ---------------------------------------------------------- */
function madridNow() {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', weekday: 'short', month: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t).value;
  return { day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday')), month: +get('month'), min: (+get('hour') % 24) * 60 + +get('minute') };
}
const hhmm = (m) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
function statusText() {
  const { day, min, month } = madridNow();
  if (month < SEASON[0] || month > SEASON[1]) return ['closed', 'Cerrado por temporada · volvemos en mayo'];
  for (const [a, b] of HOURS[day]) {
    if (min >= a && min < b) return b - min <= 30 ? ['soon', `Cierra pronto · ${hhmm(b)}`] : ['open', `Abierto · hasta las ${hhmm(b)}`];
    if (min < a) return a - min <= 60 ? ['soon', `Abre a las ${hhmm(a)}`] : ['closed', `Cerrado · abre a las ${hhmm(a)}`];
  }
  return ['closed', `Cerrado · abre mañana a las ${hhmm(HOURS[(day + 1) % 7][0][0])}`];
}
function paintStatus() {
  const [state, txt] = statusText();
  $$('[data-status]').forEach((el) => { el.dataset.state = state; $('b', el).textContent = txt; });
}
(function paintHours() {
  const t = $('#hours'), { day } = madridNow();
  [1, 2, 3, 4, 5, 6, 0].forEach((d) => {
    const tr = document.createElement('tr');
    if (d === day) tr.className = 'is-today';
    tr.innerHTML = `<td>${DAYS[d]}</td><td>${HOURS[d].map(([a, b]) => `${hhmm(a)}–${hhmm(b)}`).join(' · ')}</td>`;
    t.appendChild(tr);
  });
})();
paintStatus();
setInterval(paintStatus, 60000);

/* ----------------------------------------------------------
   SCROLL + NAV
   ---------------------------------------------------------- */
let lenis = null;
if (motion && window.Lenis) {
  lenis = new Lenis({ lerp: 0.09 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
const nav = $('#nav'), links = $('#navLinks'), burger = $('#burger');
let lastY = 0;
addEventListener('scroll', () => {
  const y = scrollY;
  nav.classList.toggle('is-solid', y > 40);
  nav.classList.toggle('is-hidden', y > lastY && y > 700 && !links.classList.contains('is-open'));
  lastY = y;
}, { passive: true });
burger.addEventListener('click', () => {
  const open = !links.classList.contains('is-open');
  links.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', String(open));
});
$$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
  const id = a.getAttribute('href');
  const target = id.length > 1 ? $(id) : document.body;
  if (!target) return;
  e.preventDefault();
  links.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false');
  if (lenis) lenis.scrollTo(target, { offset: id === '#top' ? 0 : -50, duration: 1.6 });
  else target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
}));

/* vídeos perezosos */
const vio = new IntersectionObserver((entries) => entries.forEach((e) => {
  const v = e.target;
  if (e.isIntersecting) { if (!v.getAttribute('src')) v.src = v.dataset.src; if (!reduced) v.play().catch(() => {}); }
  else v.pause();
}), { rootMargin: '250px 0px', threshold: 0.01 });
$$('video[data-auto]').forEach((v) => vio.observe(v));

/* ----------------------------------------------------------
   INTRO · el neón se enciende
   ---------------------------------------------------------- */
function heroIn() {
  if (!motion) return;
  return watchdog(gsap.timeline({ defaults: { ease: 'expo.out' } })
    .from('.hero__w--l', { xPercent: -40, opacity: 0, duration: 1.6 })
    .from('.hero__w--r', { xPercent: 40, opacity: 0, duration: 1.6 }, 0)
    .from('.hero__frame', { clipPath: 'inset(100% 0 0 0)', duration: 1.5, ease: 'expo.inOut' }, 0)
    .from('.hero__video', { scale: 1.3, duration: 2.2 }, 0)
    .from('.hero__kicker span, .hero__foot > *', { y: 20, opacity: 0, duration: 1.1, stagger: 0.06 }, 0.5), 4500);
}
const neon = $('#neon');
let seen = false;
try { seen = sessionStorage.getItem('va-intro') === '1'; sessionStorage.setItem('va-intro', '1'); } catch (e) { /* sin storage */ }
if (!motion || seen) { neon.remove(); heroIn(); }
else {
  document.body.classList.add('is-locked');
  const flick = (el, at) => tl.set(el, { opacity: 0.9 }, at).set(el, { opacity: 0.1 }, at + 0.06).set(el, { opacity: 1 }, at + 0.12).set(el, { opacity: 0.2 }, at + 0.2).set(el, { opacity: 1 }, at + 0.32);
  const tl = gsap.timeline({ onComplete: () => { neon.remove(); document.body.classList.remove('is-locked'); } });
  watchdog(tl, 8000);
  tl.set('.neon__v, .neon__a', { opacity: 0.06 });
  flick('.neon__v', 0.35);
  flick('.neon__a', 0.75);
  tl.from('.neon__name', { y: 16, opacity: 0, duration: 0.8, ease: 'expo.out' }, 1.2)
    .from('.neon__sub', { opacity: 0, duration: 0.8 }, 1.4)
    .to(neon, { opacity: 0, scale: 1.08, filter: 'blur(8px)', duration: 1, ease: 'power2.inOut' }, 2.4)
    .add(heroIn, 2.6);
  neon.addEventListener('click', () => tl.progress(1));
}

/* ----------------------------------------------------------
   MANIFIESTO · palabras que se encienden
   ---------------------------------------------------------- */
const man = $('#manifesto');
man.innerHTML = man.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span> `).join('');
const words = $$('.w', man);
if (motion) {
  ScrollTrigger.create({ trigger: man, start: 'top 80%', end: 'bottom 45%', scrub: true,
    onUpdate: (s) => { const n = Math.round(s.progress * words.length); words.forEach((w, i) => w.classList.toggle('is-on', i < n)); } });
  $$('.manifesto__imgs img').forEach((img) => gsap.fromTo(img, { yPercent: -8 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));
} else words.forEach((w) => w.classList.add('is-on'));

/* ----------------------------------------------------------
   LE TRE PASTE · segmentos del reel
   ---------------------------------------------------------- */
const pv = $('#pastaVideo'), pBar = $('#pastaBar'), pDesc = $('#pastaDesc');
const pBtns = $$('.pasta-pick [role="tab"]');
let pIdx = 0, pReady = false;
function playPasta(i) {
  pIdx = i;
  pBtns.forEach((b, k) => b.setAttribute('aria-selected', String(k === i)));
  pDesc.textContent = PASTE[i].d;
  if (motion) gsap.fromTo(pDesc, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' });
  if (!pReady) return;
  pv.currentTime = PASTE[i].seg[0];
  if (!reduced) pv.play().catch(() => {});
}
pv.addEventListener('timeupdate', () => {
  const [a, b] = PASTE[pIdx].seg;
  if (pv.currentTime >= b - 0.06 || pv.currentTime < a - 0.3) pv.currentTime = a;
  pBar.style.width = `${clamp((pv.currentTime - a) / (b - a), 0, 1) * 100}%`;
});
pv.addEventListener('ended', () => { pv.currentTime = PASTE[pIdx].seg[0]; pv.play().catch(() => {}); });
new IntersectionObserver(([e]) => {
  if (e.isIntersecting) {
    if (!pReady) { pv.src = pv.dataset.src; pReady = true; pv.addEventListener('loadedmetadata', () => playPasta(pIdx), { once: true }); }
    else if (!reduced) pv.play().catch(() => {});
  } else if (pReady) pv.pause();
}, { rootMargin: '200px 0px' }).observe(pv);
pBtns.forEach((b, i) => b.addEventListener('click', () => playPasta(i)));
pDesc.textContent = PASTE[0].d;

/* ----------------------------------------------------------
   LA VIA · carta en ruta
   ---------------------------------------------------------- */
const viaPin = $('.via__pin'), track = $('#viaTrack'), road = $('#road'), roadPath = $('#roadPath'), roadLine = $('#roadLine'), vespa = $('#vespa'), stopsEl = $('#stops');
const roadDone = document.createElementNS('http://www.w3.org/2000/svg', 'path');
roadDone.setAttribute('class', 'road__done');
roadDone.setAttribute('style', 'fill:none;stroke:#F3C53B;stroke-width:4;stroke-linecap:round');
road.appendChild(roadDone);
stopsEl.innerHTML = STOPS.map((s, i) => `
  <li class="stop">
    <p class="stop__pin"><b>${i + 1}</b><span>${s.town}</span></p>
    <h3>${s.t}</h3>
    <ul>${s.items.map(([n, p, d]) => `<li><b>${n}</b><em>${p}${p === 's/m' ? '' : ' €'}</em><small>${d}</small></li>`).join('')}</ul>
    <figure class="stop__img"><img src="${s.img}" alt="" loading="lazy"></figure>
  </li>`).join('');
const stopEls = $$('.stop', stopsEl);
const headFade = $('.via__head');
const nowEl = document.createElement('p');
nowEl.className = 'via__now';
nowEl.setAttribute('aria-hidden', 'true');
viaPin.appendChild(nowEl);
let viaST = null, LUT = [], roadLen = 0, travel = 0;

function buildRoad() {
  if (viaST) { viaST.kill(); viaST = null; }
  gsap.set(track, { x: 0 });
  if (innerWidth <= 900 || !hasGSAP) { track.style.width = ''; return; }
  const W = innerWidth, H = viaPin.offsetHeight;
  const headW = Math.min(480, W * 0.36);
  const cw = stopEls[0].offsetWidth;
  const S = cw + clamp(W * 0.17, 200, 300);
  const x0 = headW + cw * 0.5 + 90;
  const T = x0 + (STOPS.length - 1) * S + W * 0.6;
  track.style.width = T + 'px';
  road.setAttribute('width', T); road.setAttribute('height', H);
  road.setAttribute('viewBox', `0 0 ${T} ${H}`);
  const yLow = H * 0.86, yHigh = H * 0.2;
  // tramos rectos bajo / sobre cada tarjeta y curvas en los huecos
  const segs = [];
  stopEls.forEach((el, i) => {
    const low = i % 2 === 0;
    const x = x0 + i * S, y = low ? yLow : yHigh;
    segs.push({ a: x - cw / 2 - 24, b: x + cw / 2 + 24, y });
    const h = el.offsetHeight;
    el.style.left = (x - cw / 2) + 'px';
    el.style.top = (low ? clamp(yLow - 48 - h, 64, H) : yHigh + 52) + 'px';
  });
  let d = `M-80 ${yLow} L${segs[0].a} ${segs[0].y} L${segs[0].b} ${segs[0].y}`;
  for (let k = 1; k < segs.length; k++) {
    const p = segs[k - 1], q = segs[k], dx = (q.a - p.b) / 2;
    d += ` C${p.b + dx} ${p.y} ${q.a - dx} ${q.y} ${q.a} ${q.y} L${q.b} ${q.y}`;
  }
  const last = segs[segs.length - 1], mid = H * 0.53, ex = last.b + (T - last.b) * 0.5;
  d += ` C${last.b + 120} ${last.y} ${ex - 160} ${mid} ${ex} ${mid} L${T + 80} ${mid}`;
  [roadPath, roadLine, roadDone].forEach((p) => p.setAttribute('d', d));
  roadLen = roadPath.getTotalLength();
  LUT = [];
  for (let k = 0; k <= 400; k++) { const l = roadLen * k / 400; LUT.push([l, roadPath.getPointAtLength(l).x]); }
  roadDone.style.strokeDasharray = `${roadLen} ${roadLen}`;
  travel = T - W;
  viaST = ScrollTrigger.create({
    trigger: viaPin, start: 'top top', end: () => '+=' + travel, pin: true, scrub: 0.6, anticipatePin: 1, refreshPriority: 1,
    onUpdate: (s) => placeVespa(s.progress)
  });
  placeVespa(0);
}
function lenAtX(x) {
  let lo = 0, hi = LUT.length - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (LUT[m][1] < x) lo = m; else hi = m; }
  const [l0, x0] = LUT[lo], [l1, x1] = LUT[hi];
  return l0 + (l1 - l0) * clamp((x - x0) / ((x1 - x0) || 1), 0, 1);
}
function placeVespa(p) {
  const W = innerWidth;
  const shift = p * travel;
  gsap.set(track, { x: -shift });
  const vx = shift + W * (0.42 + p * 0.1);
  const l = lenAtX(vx);
  const a = roadPath.getPointAtLength(l), b = roadPath.getPointAtLength(Math.min(roadLen, l + 3));
  const ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
  gsap.set(vespa, { x: a.x, y: a.y, rotation: ang });
  roadDone.style.strokeDashoffset = String(roadLen - l);
  let near = 0, best = Infinity;
  stopEls.forEach((el, i) => {
    const cx = el.offsetLeft + el.offsetWidth / 2 - shift;
    const vis = clamp(1 - Math.abs(cx - W * 0.55) / (W * 0.55), 0.25, 1);
    el.style.opacity = vis.toFixed(2);
    const dv = Math.abs(el.offsetLeft + el.offsetWidth / 2 - vx);
    if (dv < best) { best = dv; near = i; }
  });
  headFade.style.opacity = clamp(1 - shift / (W * 0.22), 0, 1).toFixed(2);
  headFade.style.visibility = shift > W * 0.22 ? 'hidden' : 'visible';
  if (near !== nowIdx) { nowIdx = near; nowEl.innerHTML = `<b>${near + 1}</b> ${STOPS[near].town} · ${STOPS[near].t}`; }
  nowEl.style.opacity = shift > W * 0.15 ? '1' : '0';
}
let nowIdx = -1;
let rTimer;
addEventListener('resize', () => { clearTimeout(rTimer); rTimer = setTimeout(() => { buildRoad(); ScrollTrigger.refresh(); }, 250); });

/* ----------------------------------------------------------
   GALLERIA · arrastrable
   ---------------------------------------------------------- */
const gal = $('#gal'), gTrack = $('#galTrack'), gCount = $('#galCount'), gBar = $('#galBar');
gTrack.innerHTML = GALLERY.map(([f, c], i) => `<figure class="slide"><div class="slide__img"><img src="assets/img/${f}" alt="${c.replace(/[“”"]/g, '')}" loading="lazy" draggable="false"></div><p><b>${String(i + 1).padStart(2, '0')}</b>${c}</p></figure>`).join('');
const slides = $$('.slide', gTrack);
let gx = 0, gmin = 0, gIdx = 0, gTween = null;
function gMeasure() { gmin = Math.min(0, gal.clientWidth - gTrack.scrollWidth - parseFloat(getComputedStyle(gal).paddingLeft)); gSet(gx); }
function gSet(x) {
  gx = clamp(x, gmin, 0);
  gTrack.style.transform = `translate3d(${gx}px,0,0)`;
  const step = slides[1] ? slides[1].offsetLeft - slides[0].offsetLeft : 1;
  gIdx = clamp(Math.round(-gx / step), 0, slides.length - 1);
  gCount.textContent = `${String(gIdx + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  gBar.style.width = `${gmin ? 8 + 92 * (gx / gmin) : 100}%`;
}
function gGo(i) {
  const step = slides[1].offsetLeft - slides[0].offsetLeft;
  const o = { x: gx };
  if (gTween) gTween.kill();
  if (!motion) { gSet(-i * step); return; }
  gTween = gsap.to(o, { x: clamp(-i * step, gmin, 0), duration: 1, ease: 'expo.out', onUpdate: () => gSet(o.x) });
}
$('#galNext').addEventListener('click', () => gGo(Math.min(slides.length - 1, gIdx + 1)));
$('#galPrev').addEventListener('click', () => gGo(Math.max(0, gIdx - 1)));
gal.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') gGo(gIdx + 1); if (e.key === 'ArrowLeft') gGo(Math.max(0, gIdx - 1)); });
let gDrag = false, gStart = 0, gOrig = 0, gVel = 0, gLast = 0;
gal.addEventListener('pointerdown', (e) => { gDrag = true; gStart = gLast = e.clientX; gOrig = gx; gVel = 0; if (gTween) gTween.kill(); gal.classList.add('is-drag'); gal.setPointerCapture(e.pointerId); });
gal.addEventListener('pointermove', (e) => { if (!gDrag) return; gVel = e.clientX - gLast; gLast = e.clientX; gSet(gOrig + (e.clientX - gStart)); });
function gUp() {
  if (!gDrag) return;
  gDrag = false; gal.classList.remove('is-drag');
  const step = slides[1].offsetLeft - slides[0].offsetLeft;
  gGo(clamp(Math.round(-(gx + gVel * 12) / step), 0, slides.length - 1));
}
gal.addEventListener('pointerup', gUp);
gal.addEventListener('pointercancel', gUp);
addEventListener('resize', gMeasure);
addEventListener('load', gMeasure);
gMeasure();

/* ----------------------------------------------------------
   REELS
   ---------------------------------------------------------- */
const reels = $$('.reel');
const player = $('#player'), pVideo = $('video', player);
reels.forEach((r) => {
  const open = () => reels.forEach((o) => o.classList.toggle('is-open', o === r));
  r.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') open(); });
  r.addEventListener('focus', open);
  r.addEventListener('click', () => {
    pVideo.src = r.dataset.video; pVideo.muted = false;
    $('.player__t', player).textContent = r.dataset.title;
    player.hidden = false; lenis?.stop();
    pVideo.play().catch(() => {});
    $('.player__close', player).focus();
  });
});
function closePlayer() { pVideo.pause(); pVideo.removeAttribute('src'); pVideo.load(); player.hidden = true; lenis?.start(); }
$('.player__close', player).addEventListener('click', closePlayer);
player.addEventListener('click', (e) => { if (e.target === player) closePlayer(); });
addEventListener('keydown', (e) => { if (e.key === 'Escape' && !player.hidden) closePlayer(); });

/* ----------------------------------------------------------
   OPINIONES
   ---------------------------------------------------------- */
const vStage = $('#voices'), vDots = $('#voicesDots');
vStage.innerHTML = VOICES.map(([t, w], i) => `<figure class="voice" ${i ? 'aria-hidden="true"' : ''}><p>${t}</p><cite>${w}</cite></figure>`).join('');
vDots.innerHTML = VOICES.map((_, i) => `<button role="tab" aria-selected="${i === 0}" aria-label="Opinión ${i + 1}"></button>`).join('');
const vEls = $$('.voice', vStage), vBtns = $$('button', vDots);
let vIdx = 0, vTimer = null;
vEls.forEach((v, i) => { v.style.opacity = i ? 0 : 1; v.style.visibility = i ? 'hidden' : 'visible'; });
function showVoice(i) {
  const prev = vEls[vIdx], next = vEls[i];
  vIdx = i;
  vBtns.forEach((b, k) => b.setAttribute('aria-selected', String(k === i)));
  vEls.forEach((v, k) => v.setAttribute('aria-hidden', String(k !== i)));
  if (motion) {
    gsap.to(prev, { opacity: 0, y: -16, duration: 0.6, ease: 'power2.in', onComplete: () => { prev.style.visibility = 'hidden'; } });
    gsap.fromTo(next, { opacity: 0, y: 20, visibility: 'visible' }, { opacity: 1, y: 0, duration: 1, delay: 0.45, ease: 'expo.out' });
  } else { vEls.forEach((v, k) => { v.style.opacity = k === i ? 1 : 0; v.style.visibility = k === i ? 'visible' : 'hidden'; }); }
}
function autoVoice() { clearInterval(vTimer); vTimer = setInterval(() => showVoice((vIdx + 1) % vEls.length), 6500); }
vBtns.forEach((b, i) => b.addEventListener('click', () => { if (i !== vIdx) showVoice(i); autoVoice(); }));
if (!reduced) autoVoice();

/* ----------------------------------------------------------
   REVEALS
   ---------------------------------------------------------- */
buildRoad();
if (motion) {
  const reveal = (sel, trig, vars = {}) => gsap.from(sel, { y: 40, opacity: 0, duration: 1.3, ease: 'expo.out', stagger: 0.08, ...vars, scrollTrigger: { trigger: trig || sel, start: 'top 84%' } });
  reveal('.manifesto .numeral', '.manifesto');
  $$('.manifesto__imgs figure').forEach((f) => gsap.from(f, { clipPath: 'inset(100% 0 0 0)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: f, start: 'top 88%' } }));
  reveal('.paste__copy > *', '.paste');
  gsap.from('.paste__video', { clipPath: 'inset(100% 0 0 0)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: '.paste__media', start: 'top 80%' } });
  gsap.from('.paste__wheel', { y: 100, rotation: 6, opacity: 0, duration: 1.5, ease: 'expo.out', scrollTrigger: { trigger: '.paste__media', start: 'top 70%' } });
  reveal('.galleria__head > *', '.galleria');
  gsap.from('.slide', { x: 120, opacity: 0, duration: 1.4, ease: 'expo.out', stagger: 0.06, scrollTrigger: { trigger: '.gal', start: 'top 85%' } });
  reveal('.reels__head > *', '.reels');
  gsap.from('.reel', { y: 80, opacity: 0, duration: 1.3, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: '.strip', start: 'top 85%' } });
  reveal('.voices .numeral, .voices__stage', '.voices');
  reveal('.prenota__card > *', '.prenota', { stagger: 0.04 });
  gsap.from('.foot__big', { yPercent: 40, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.foot', start: 'top 85%' } });
}
if (hasGSAP) {
  if (document.fonts) document.fonts.ready.then(() => { buildRoad(); ScrollTrigger.refresh(); });
  addEventListener('load', () => ScrollTrigger.refresh());
}
})();
