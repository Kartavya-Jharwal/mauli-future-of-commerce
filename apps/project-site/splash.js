(() => {
'use strict';

const splash   = document.getElementById('splash');
const word     = splash.querySelector('.ms-brand .ms-word');
const sub      = splash.querySelector('.ms-brand .ms-sub');
const halo     = splash.querySelector('.ms-halo');
const fadeEl   = splash.querySelector('.ms-fade');
const skipBtn  = splash.querySelector('.ms-skip');
const stage    = document.getElementById('netflix-stage');
const splashAnim = document.getElementById('splash-anim');
if (!splash || !word || !stage) return;

/* ================= config ================= */
const clampN = (x,a,b)=>Math.min(b,Math.max(a,x));
const cfg = {
  logo:  (splash.dataset.logo  || 'MAULI').toUpperCase(),
  sub:   (splash.dataset.sub   || '').toUpperCase(),
  letter:(splash.dataset.letter|| 'M').trim().charAt(0).toUpperCase(),
  speed: clampN(parseFloat(splash.dataset.speed)||1,.4,2),
  skippable: splash.dataset.skippable !== 'false',
};

/* ============ TIMELINE (s @ speed 1) ============ */
const TL = {
  wordIn:  .85,
  subAt:   1.6,
  delAt:   2.4,
  caretOff:3.0,
  growAt:  3.6,
  weaveAt: 7.0,    // swap SVG → Netflix-strip M at ~80% growth
  fadeAt: 11.0,   // Netflix zoom-in complete (7.0 + 0.5 + 3.5)
  darkAt: 12.0,
  endAt:  12.5
};
const DUR = {
  chIn:      .22,
  stagger:   .075,
  eraseStep: .075,
  grow:      3.4,
  weaveFade: .35,
  fade:      1.0
};
const sp = cfg.speed;
for (const k in TL){ TL[k] *= sp; }
for (const k in DUR){ DUR[k] *= sp; }

/* ================= helpers ================= */
const S            = (x)=>(+x.toFixed(3))+'s';
const lerp         = (a,b,t)=>a+(b-a)*t;
const rnd          = (i)=>{const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);};
const atTime = (t,fn)=>setTimeout(fn, Math.max(0, TL.wordIn*0 + t*1000));

/* ================= lifecycle ================= */
let ended=false, booted=false, anchor=0;
const atTimeFromAnchor = (t,fn)=>setTimeout(fn, Math.max(0, anchor + t*1000 - performance.now()));

function end(){
  if (ended) return; ended = true;
  splash.classList.add('is-done');
  document.dispatchEvent(new CustomEvent('matter-splash:end'));
  setTimeout(()=>splash.remove(), DUR.fade*1000 + 150);
}
window.MatterSplash = { start:startSplash, finish:end, skip(){ if (cfg.skippable) end(); }, get active(){ return !ended; } };
splash.style.setProperty('--fade', S(DUR.fade));
if (cfg.skippable){
  skipBtn.addEventListener('click', end);
  addEventListener('keydown', e => { if (e.key === 'Escape') window.MatterSplash.skip(); });
} else skipBtn.remove();

/* ============================================================
   THE LETTERFORM — custom flare M (single M typeform).
   Tapered stems with gaussian flare at terminals, hairline
   diagonals into the V vertex. This SAME polygon builds the
   inline SVG M in the lockup → the SVG grows out of perspective
   → at 80% it's replaced by the Netflix-strip M.
   ============================================================ */
const MPOLYS = (()=>{
  const W=.92, P=[];
  const flare = y => 1 + .62*(Math.exp(-(y*y)/.022) + Math.exp(-((1-y)*(1-y))/.022));
  const stem = cx => { const pts=[];
    for (let i=0;i<=24;i++){ const y=i/24, h=.070*flare(y); pts.push([cx-h,y]); }
    for (let i=24;i>=0;i--){ const y=i/24, h=.070*flare(y); pts.push([cx+h,y]); }
    return pts; };
  P.push(stem(.115), stem(W-.115));
  const diag=(x1,y1,x2,y2,w1,w2)=>{
    const dx=x2-x1, dy=y2-y1, L=Math.hypot(dx,dy), px=-dy/L, py=dx/L;
    return [[x1+px*w1/2,y1+py*w1/2],[x2+px*w2/2,y2+py*w2/2],
            [x2-px*w2/2,y2-py*w2/2],[x1-px*w1/2,y1-py*w1/2]]; };
  P.push(diag(.205,0,.46,.645,.070,.046));
  P.push(diag(W-.205,0,.46,.645,.070,.046));
  return P;
})();
let sx0=1,sx1=0,sy0=1,sy1=0;
for (const pts of MPOLYS) for (const p of pts){
  if(p[0]<sx0)sx0=p[0]; if(p[0]>sx1)sx1=p[0];
  if(p[1]<sy0)sy0=p[1]; if(p[1]>sy1)sy1=p[1];
}
const SVG_INKW = sx1-sx0, SVG_INKH = Math.max(.0001, sy1-sy0);
const M_PATH = MPOLYS.map(pts =>
  'M'+pts.map(p=>p[0].toFixed(4)+' '+p[1].toFixed(4)).join('L')+'Z').join('');

/* M SVG markup — used INLINE in the lockup so the M typeform is
   identical from the very first frame. No second M anywhere. */
const M_SVG_MARKUP =
  '<svg viewBox="0 0 0.92 1" preserveAspectRatio="xMidYMid meet">'+
  '<path d="'+M_PATH+'" fill="currentColor"/></svg>';

/* ---------- font ink metrics (cap height + width, in em) ---------- */
let INK = { h:.70, w:.78 };
function measureInk(ch){
  try{
    const N=256, c=document.createElement('canvas'); c.width=N; c.height=N;
    const g=c.getContext('2d',{willReadFrequently:true});
    g.font='400 200px "Marcellus", Georgia, serif';
    g.textAlign='center'; g.textBaseline='alphabetic'; g.fillStyle='#fff';
    g.fillText(ch, N/2, 170);
    const d=g.getImageData(0,0,N,N).data;
    let t=N,b=-1,l=N,r=-1;
    for(let y=0;y<N;y++)for(let x=0;x<N;x++)
      if(d[(y*N+x)*4+3]>120){ if(y<t)t=y; if(y>b)b=y; if(x<l)l=x; if(x>r)r=x; }
    if (b>t) return { h:(b-t)/200, w:(r-l)/200 };
  }catch(e){}
  return { h:.70, w:.78 };
}

/* ============================================================
   WORDMARK — spans + per-pair kerning + caret.
   The M (focus letter) is an inline SVG using the custom flare M.
   Other letters (A,U,L,I) are Marcellus text. The M is ONE typeform
   from frame 1 — no morph, no second M.
   ============================================================ */
const KERN={'MA':-.045,'AU':-.02,'UL':-.012,'LI':-.02,'RI':-.012,'TU':-.01,'UA':-.012,'AL':-.01,'LS':-.01};
const spans=[];
[...cfg.logo].forEach((ch,i)=>{
  const s=document.createElement('span');
  if (ch === cfg.letter){
    s.className = 'ms-m-svg';
    s.innerHTML = M_SVG_MARKUP;
  } else {
    s.textContent = ch;
  }
  if(i>0){ const k=KERN[cfg.logo[i-1]+ch]; if(k) s.style.marginLeft=k+'em'; }
  word.appendChild(s); spans.push(s);
});
let focusIdx=cfg.logo.indexOf(cfg.letter); if(focusIdx<0) focusIdx=cfg.logo.length-1;
const mSvg = spans[focusIdx];
const caret=document.createElement('span'); caret.className='ms-caret'; word.appendChild(caret);
if (cfg.sub) sub.textContent=cfg.sub; else sub.style.display='none';

/* Preload shows the same lockup frame (custom M + Marcellus letters), static. */
const lockWord = document.getElementById('splash-lockup-word');
const lockSub  = document.getElementById('splash-lockup-sub');
if (lockWord){
  spans.forEach(s => lockWord.appendChild(s.cloneNode(true)));
  const lockM = lockWord.querySelector('.ms-m-svg');
  if (document.fonts && document.fonts.load){
    document.fonts.load('400 90px "Marcellus"','MAULI').then(()=>{
      if (!lockM) return;
      const ink = measureInk(cfg.letter);
      lockM.style.width  = (ink.h * (SVG_INKW/SVG_INKH)).toFixed(4)+'em';
      lockM.style.height = ink.h.toFixed(4)+'em';
    }, ()=>{});
  }
}
if (lockSub){ if (cfg.sub) lockSub.textContent = cfg.sub; else lockSub.remove(); }

/* ============================================================
   NETFLIX-STRIP M DATA — fur strips + lamp beams in red+amber.
   31 strips per helper, 28 lamps total (helper-1 only).
   Strip widths 1-1.7% → 3-5px on the 300px stage.
   ============================================================ */
const FUR_COUNT  = 31;
const LAMP_COUNT = 28;

/* RED + AMBER PALETTE ONLY — no greens/blues/purples. */
const RED_AMBER_PALETTE = [
  '#ff0f1f',  // netflix red
  '#e40913',  // deep red
  '#ff3030',  // bright red
  '#ff5500',  // orange-red
  '#ff7700',  // orange
  '#ff9600',  // light orange
  '#ffaa00',  // amber
  '#ffae01',  // warm amber
  '#ffc601',  // yellow-amber
  '#f30b34',  // red-pink
  '#ec0014',  // pure red
  '#ff0036'   // red-pink
];

function generateFurData(){
  const data = [];
  const rawWidths = [];
  for (let i = 0; i < FUR_COUNT; i++){
    rawWidths.push(1 + Math.random() * 0.7);   // 1-1.7%
  }
  const total = rawWidths.reduce((a,b) => a + b, 0);
  const scale = 100 / total;
  let left = 0;
  for (let i = 0; i < FUR_COUNT; i++){
    const width = rawWidths[i] * scale;
    data.push({
      left:   left.toFixed(2),
      width:  width.toFixed(2),
      fillEnd:   Math.floor(10 + Math.random() * 40),
      fadeStart: Math.floor(60 + Math.random() * 40)
    });
    left += width;
  }
  return data;
}

function generateLampData(){
  const data = [];
  const seg = 100 / LAMP_COUNT;
  for (let i = 0; i < LAMP_COUNT; i++){
    const left  = (i * seg + Math.random() * seg * 0.6).toFixed(2);
    const width = (1 + Math.random() * 0.7).toFixed(2);
    const color = RED_AMBER_PALETTE[Math.floor(Math.random() * RED_AMBER_PALETTE.length)];
    const dir   = i % 2 === 0 ? 'left' : 'right';
    data.push({ left, width, color, dir });
  }
  return data;
}

function renderFur(containerId, data){
  const c = document.getElementById(containerId);
  if (!c) return;
  const frag = document.createDocumentFragment();
  data.forEach((s, i) => {
    const el = document.createElement('span');
    el.className = 'fur-' + (i + 1);
    el.style.left   = s.left + '%';
    el.style.width  = s.width + '%';
    el.style.background = `linear-gradient(to bottom, var(--netflix-red) 0%, var(--netflix-red) ${s.fillEnd}%, rgba(0,0,0,0) ${s.fadeStart}%, rgba(0,0,0,0) 100%)`;
    el.style.zIndex = i;
    frag.appendChild(el);
  });
  c.appendChild(frag);
}

function renderLamps(containerId, data){
  const c = document.getElementById(containerId);
  if (!c) return;
  const frag = document.createDocumentFragment();
  data.forEach((l, i) => {
    const el = document.createElement('span');
    el.className = 'lamp lamp-' + (i + 1) + ' lamp-' + l.dir;
    el.style.left  = l.left + '%';
    el.style.width = l.width + '%';
    el.style.setProperty('--color', l.color);
    // per-lamp staggered delay
    el.style.animationDelay = (Math.random() * 2).toFixed(2) + 's';
    const brightness = 1 + Math.random() * 0.6;
    el.style.filter = 'brightness(' + brightness.toFixed(2) + ')';
    frag.appendChild(el);
  });
  c.appendChild(frag);
}

/* ============================================================
   PHASES — lockup → smooth quick erase → perspective grow →
   swap to Netflix-strip M → Netflix intro plays → fade → hero.
   ============================================================ */
function phaseLockup(){
  spans.forEach((s,i)=>{
    s.style.animationDelay = S(i*DUR.stagger);
    s.classList.add('in');
  });
  caret.classList.add('on');
}

/* ERASE — smooth quick, no pauses. Every non-M letter drops at
   a FIXED short interval (DUR.eraseStep). The M stays. */
function phaseErase(){
  if (cfg.sub) sub.classList.add('out');
  mSvg.style.color = 'var(--brand)';
  let deleted = 0;
  for (let i=spans.length-1; i>focusIdx; i--){
    const s = spans[i];
    const dt = deleted * DUR.eraseStep;
    deleted++;
    atTimeFromAnchor(TL.delAt + dt, ()=>{
      s.style.animationDelay = '0s';
      s.classList.add('del');
      setTimeout(()=>s.remove(), 140);
    });
  }
  if (cfg.skippable) skipBtn.classList.add('is-on');
}

/* GROW — SVG M grows toward the viewport from deep perspective.
   .ms-brand has perspective:1200px; .ms-word has preserve-3d.
   The CSS keyframe m-perspective-grow drives translateZ from
   -3800px (24%) to -300px (80%). */
function phaseGrow(){
  mSvg.classList.remove('in');
  mSvg.classList.add('grow');
}

/* SWAP — at ~80% growth, swap the solid SVG fill for the
   Netflix-strip M. Read the SVG's current perceived rect (post-
   perspective), position + scale the Netflix stage to match, then
   add .is-on to trigger all the Netflix-style animations. */
function phaseWeave(){
  halo.classList.add('is-on');

  // read the M's current screen rect (post-perspective, at 80%)
  const r = mSvg.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  // uniform scale so the 300px Netflix stage matches the SVG M's
  // perceived height at the swap moment
  const initScale = Math.max(.05, r.height / 300);

  stage.style.left = cx + 'px';
  stage.style.top  = cy + 'px';
  stage.style.transform = `translate(-50%, -50%) scale(${initScale})`;

  // compute the zoom-in final scale so the M overflows the viewport
  // (the Netflix "ta-dum" effect)
  const zoomFinal = Math.max(15, Math.max(innerWidth, innerHeight) * 1.3 / Math.max(20, r.width));
  splashAnim.style.setProperty('--zoom-final', zoomFinal);

  // crossfade: show Netflix-strip M, fade out SVG
  stage.classList.add('is-on');
  mSvg.classList.add('fading');
  setTimeout(()=>{ mSvg.style.display='none'; }, DUR.weaveFade*1000 + 60);
}

/* ============================================================
   BOOT — one anchor for all DOM phases
   ============================================================ */
function boot(){
  if (booted) return; booted=true;
  anchor=performance.now();

  // measure Marcellus M ink metrics + size the inline SVG M
  INK = measureInk(cfg.letter);
  const boxH = INK.h;
  const boxW = INK.h * (SVG_INKW/SVG_INKH);
  mSvg.style.width  = boxW.toFixed(4)+'em';
  mSvg.style.height = boxH.toFixed(4)+'em';

  // pre-render the fur strips + lamp beams (animations stay
  // dormant until .is-on is added at swap time)
  const furData  = generateFurData();
  const lampData = generateLampData();
  renderFur('brush-1', furData);
  renderFur('brush-2', furData);
  renderFur('brush-3', furData);
  renderFur('brush-4', furData);
  renderLamps('lamps-1', lampData);

  atTimeFromAnchor(TL.wordIn,   phaseLockup);
  atTimeFromAnchor(TL.subAt,    ()=>{ if(cfg.sub) sub.classList.add('in'); });
  atTimeFromAnchor(TL.delAt,    phaseErase);
  atTimeFromAnchor(TL.caretOff, ()=>{ caret.classList.remove('on'); caret.classList.add('off'); });
  atTimeFromAnchor(TL.growAt,   phaseGrow);
  atTimeFromAnchor(TL.weaveAt,  phaseWeave);
  atTimeFromAnchor(TL.fadeAt,   ()=>{ fadeEl.classList.add('is-on'); halo.classList.add('dim'); });
  atTimeFromAnchor(TL.darkAt,   ()=>{ document.dispatchEvent(new CustomEvent('matter-splash:dark')); });
  atTimeFromAnchor(TL.endAt,    end);
  atTimeFromAnchor(TL.endAt+4,  end);
}

function runAnimation(){
  if (booted || ended) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches){
    splash.classList.add('ms-static');
    spans.forEach(s=>{ s.style.opacity='1'; });
    mSvg.style.opacity = '1';
    if (cfg.sub) sub.style.opacity='1';
    setTimeout(end, 2400);
    return;
  }
  const go=()=>{ if(!booted) boot(); };
  if (document.fonts && document.fonts.load){
    document.fonts.load('400 90px "Marcellus"','MAULI').then(go,go);
    setTimeout(go,1400);
  } else go();
}

function startSplash(){
  if (ended) return;
  const preload = document.getElementById('splash-preload');
  const begin = ()=> runAnimation();
  if (!preload){
    begin();
    return;
  }
  preload.classList.add('is-done');
  let began = false;
  const kick = ()=>{
    if (began) return;
    began = true;
    begin();
  };
  preload.addEventListener('transitionend', (e)=>{
    if (e.propertyName === 'opacity') kick();
  }, { once: true });
  setTimeout(kick, 500);
}

})();
