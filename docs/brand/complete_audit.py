import concurrent.futures,hashlib,json,re,urllib.request,urllib.parse
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]; OUT=ROOT/'packages/brand-assets'; E=ROOT/'docs/brand/evidence'
m=json.loads((OUT/'asset-manifest.json').read_text()); known={x['url'] for x in m['assets']};faces=[];pending=[]
for p in (OUT/'css').glob('*.css'):
    for rule in re.findall(r'@font-face\s*\{[^}]+\}',p.read_text(encoding="utf-8")):
        family=re.search(r'font-family:\s*([^;]+)',rule); weight=re.search(r'font-weight:\s*([^;]+)',rule);style=re.search(r'font-style:\s*([^;]+)',rule)
        urls=re.findall(r'url\("([^\"]+)"\)',rule)
        faces.append({'family':family.group(1) if family else None,'weight':weight.group(1) if weight else None,'style':style.group(1) if style else None,'urls':urls,'stylesheet':p.relative_to(ROOT).as_posix(),'usage':'Declared; only homepage Gotham / LTC Caslon computed styles verified','license':'Adobe EULA references preserved in original stylesheet; project entitlement unverified'})
        for u in urls:
            if u not in known:known.add(u);pending.append(u)
def fetchfont(u):
    r={'url':u,'kind':'font','accessed':'2026-10-10','rights':'Third-party font; project deployment/redistribution entitlement unverified'}
    try:
        b=urllib.request.urlopen(u,timeout=15).read();ext={'l':'woff2','d':'woff','a':'otf'}.get(urllib.parse.urlparse(u).path.split('/')[-1],'bin');p=OUT/'fonts'/(hashlib.sha256(u.encode()).hexdigest()[:12]+'.'+ext);p.write_bytes(b)
        r.update(status='downloaded',path=p.relative_to(ROOT).as_posix(),sha256=hashlib.sha256(b).hexdigest(),bytes=len(b))
    except Exception as e:r.update(status='failed',reason=str(e))
    return r
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:m['assets'].extend(pool.map(fetchfont,pending))
m['counts']={s:sum(x['status']==s for x in m['assets']) for s in ['downloaded','extracted','discovered-only','failed']}
(OUT/'asset-manifest.json').write_text(json.dumps(m,indent=2));(E/'font-faces.json').write_text(json.dumps(faces,indent=2))
# Remove unrelated runtime resources from inventory: retain only audit-relevant public URLs.
i=json.loads((E/'asset-inventory.json').read_text());i['assets']=[a for a in i['assets'] if a['kind'] in ['image','font','stylesheet','video']];i['note']='Scripts and miscellaneous runtime resources omitted from saved inventory; original summary counts describe discovery before this privacy minimization.';(E/'asset-inventory.json').write_text(json.dumps(i,indent=2))
h=json.loads((E/'homepage-dom.json').read_text());v=h['variables']
def tok(value,source,kind='observed'):return {'value':value,'source':source,'status':kind}
t={'accessed':'2026-10-10','source':'https://www.maulirituals.com/','scope':'Homepage computed styles and variables; source-only linked-page styles. Names are audit aliases, not official brand token names.','color':{},'typography':{},'layout':{},'motion':{},'rawThemeVariables':v}
for name,val,key in [('ink','#512f2d','--body-text-color'),('paper','#fefefe','--color-scheme-default'),('cream','#f6f6f2','--footer-bg-col'),('link','#51302d','--body-link-color'),('headerInk','#512f24','--header-text-col'),('inputBorder','#d3caca','--input-border-color'),('inputHover','#9f8c8b','--input-border-color-hover'),('success','#108043','--success-text-color')]:t['color'][name]=tok(val,key)
t['typography']={'body':tok('gotham, sans-serif','homepage computed p/button styles'),'heading':tok('ltc-caslon-pro, serif','homepage computed h2/h3/h4 styles'),'baseSize':tok('13px','--base-text-size'),'bodyLineHeight':tok(1.6,'--base-line-height'),'headingWeight':tok(400,'homepage computed headings'),'homeIntroDesktop':tok('25px / 30px','homepage h2, 1280 viewport'),'homeIntroMobile':tok('18px','homepage h2, 390 CSS viewport; screenshot scaling unreliable'),'productCardHeading':tok('14px / 16.8px','homepage h3'),'themeDefaults':tok({'body':'Inter','heading':'Bodoni Moda'},'CSS variables; overridden by !important font selectors','declared-overridden')}
for name,key in [('maxWidth','--page-container-width'),('readingWidth','--reading-container-width'),('desktopPadding','--container-pad-x'),('gutterMobile','--gutter-mobile'),('gutterDesktop','--gutter-desktop'),('section','--section-padding'),('largeSection','--larger-section-padding'),('largestSection','--largest-section-padding'),('spaceUnit','--space-unit'),('buttonRadius','--btn-border-radius'),('iconSize','--icon-size')]:t['layout'][name]=tok(v[key],key)
t['motion']['scrollDuration']=tok(v['--aos-animate-duration'],'--aos-animate-duration; not measured timing')
t['proposedShowcase']={'status':'proposal, not Mauli observed tokens','bodyMinimum':'16px','threadAccent':'choose after motion handoff; no official red token verified','motion':'optional, skippable; reduced-motion static equivalent; never gate downloads'}
(OUT/'tokens.json').write_text(json.dumps(t,indent=2))
print(m['counts'])

