from pathlib import Path

root = Path(__file__).resolve().parents[1] / "apps" / "project-site"
html = (root / "splash.html").read_text(encoding="utf-8")

i0 = html.index("<style>") + len("<style>")
i1 = html.index("</style>", i0)
css = html[i0:i1].strip()

lines = css.splitlines()
out = []
skip = False
for line in lines:
    if "HERO PAGE" in line and "==============" in line:
        skip = True
    if skip:
        if "SPLASH OVERLAY" in line and "==============" in line:
            skip = False
        else:
            continue
    out.append(line)
css = "\n".join(out)

preload = """

/* ============== PRELOAD (mark + progress while assets load) ============== */
.splash-preload{
  position:absolute;inset:0;z-index:20;
  display:grid;place-items:center;
  background:var(--bg);
  transition:opacity .45s ease,visibility .45s ease;
}
.splash-preload.is-done{
  opacity:0;visibility:hidden;pointer-events:none;
}
.splash-preload-inner{
  width:min(72vw,720px);
  display:grid;justify-items:center;
  gap:clamp(28px,5vh,48px);
}
.splash-preload .splash-mark{
  width:min(100%,560px);height:auto;display:block;
}
.splash-meter{width:min(100%,280px);display:grid;gap:10px;justify-items:center}
.splash-meter-track{width:100%;height:2px;background:rgba(243,231,211,.15);overflow:hidden}
#splash-progress-fill{
  display:block;height:100%;width:0%;
  background:linear-gradient(90deg,#e02026,#ff8c1a,#ffc22e);
  transition:width .35s ease;
}
.splash-meter-label{
  margin:0;font-size:10px;letter-spacing:.22em;text-transform:uppercase;
  color:rgba(243,231,211,.55);
}
@media (max-width:760px){
  .splash-preload-inner{width:min(88vw,420px)}
  .splash-preload .splash-mark{width:min(100%,360px)}
}
"""

(root / "splash.css").write_text(css + preload, encoding="utf-8")

j0 = html.index("<script>", html.index("SPLASH OVERLAY"))
j1 = html.index("</script>", j0)
js = html[j0 + len("<script>") : j1].strip()

marker = "   HERO PAGE"
idx = js.find(marker)
if idx != -1:
    js = js[: js.rfind("/*", 0, idx)].rstrip()

old_boot = """/* reduced motion: static lockup, polite exit */
if (matchMedia('(prefers-reduced-motion: reduce)').matches){
  splash.classList.add('ms-static');
  spans.forEach(s=>{ s.style.opacity='1'; });
  mSvg.style.opacity = '1';
  if (cfg.sub) sub.style.opacity='1';
  setTimeout(end, 2400);
} else {
  const go=()=>{ if(!booted) boot(); };
  if (document.fonts && document.fonts.load){
    document.fonts.load('400 90px "Marcellus"','MAULI').then(go,go);
    setTimeout(go,1400);
  } else go();
}"""

new_boot = """function runAnimation(){
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
}"""

if old_boot not in js:
    raise SystemExit("boot block not found")
js = js.replace(old_boot, new_boot)

js = js.replace(
    "window.MatterSplash = { finish:end, skip(){ if (cfg.skippable) end(); }, get active(){ return !ended; } };",
    "window.MatterSplash = { start:startSplash, finish:end, skip(){ if (cfg.skippable) end(); }, get active(){ return !ended; } };",
)

(root / "splash.js").write_text(js + "\n", encoding="utf-8")
print("OK", (root / "splash.css").stat().st_size, (root / "splash.js").stat().st_size)
