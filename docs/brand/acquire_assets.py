"""Bounded public asset acquisition; no scripts executed, no session data stored."""
import concurrent.futures, hashlib, json, re, urllib.request, urllib.parse
from pathlib import Path
from html.parser import HTMLParser

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'packages/brand-assets'
EVIDENCE=ROOT/'docs/brand/evidence'
DATE='2026-10-10'
records={}
def add(url,kind,source):
    url=urllib.parse.urljoin(source,url)
    if url.startswith('https://'):
        records.setdefault(url,{'url':url,'kind':kind,'sources':[]})['sources'].append(source)
def fetch(url):
    return urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'}),timeout=15).read()
class Parser(HTMLParser):
    def __init__(self,url): super().__init__(); self.url=url; self.styles=[]; self.capture=False; self.text=[]; self.headings=[]
    def handle_starttag(self,tag,attrs):
        d=dict(attrs)
        if tag=='img':
            for key in ['src','data-src']:
                if d.get(key) and '{' not in d[key]: add(d[key],'image',self.url)
        if tag=='link' and d.get('rel')=='stylesheet': add(d.get('href',''),'stylesheet',self.url)
        if tag=='style': self.capture=True
    def handle_endtag(self,tag):
        if tag=='style': self.capture=False
    def handle_data(self,data):
        if self.capture:self.styles.append(data)

home=json.loads((EVIDENCE/'homepage-dom.json').read_text())
for im in home['images']:add(im['src'],'image',home['url'])
for url in home['styles']: add(url,'stylesheet',home['url'])
for rule in home['fontRules']:
    for url in re.findall(r'url\("([^" ]+)"\)',rule):add(url,'font',home['url'])
inventory=json.loads((EVIDENCE/'asset-inventory.json').read_text())
for a in inventory['assets']:
    if a['kind'] in ['font','image','stylesheet','video']:add(a['url'],a['kind'],home['url'])
pages=['https://www.maulirituals.com/products/supreme-skin-face-serum','https://www.maulirituals.com/collections/skincare','https://www.maulirituals.com/pages/create-your-ritual-quiz','https://www.maulirituals.com/pages/story']
for i,url in enumerate(pages):
    try:
        html=fetch(url).decode(); p=Parser(url);p.feed(html)
        # Keep only public style declarations, never Shopify session/bootstrap scripts.
        (EVIDENCE/f'page-{i+1}-styles.css').write_text('\n'.join(p.styles),encoding='utf8')
        title=re.search(r'<title>(.*?)</title>',html,re.S)
        (EVIDENCE/f'page-{i+1}-source.json').write_text(json.dumps({'url':url,'accessed':DATE,'method':'HTTP source; browser unavailable after interruption','title':title.group(1).strip() if title else None,'headings':re.findall(r'<h[1-4][^>]*>(.*?)</h[1-4]>',html,re.S)},indent=2),encoding='utf8')
    except Exception as e:print('PAGE FAILED',url,str(e))
typekit=(OUT/'css/typekit.css').read_text()
for url in re.findall(r'url\("([^" ]+)"\)',typekit):
    if '/af/' in url:add(url,'font','https://use.typekit.net/gby1gbw.css')
def download(r):
    url=r['url']; kind=r['kind']; r.update(accessed=DATE,rights='Third-party; no redistribution or deployment license inferred')
    if kind=='video':r.update(status='discovered-only',reason='Video inventory retained; full media download outside bounded visual-asset archive');return r
    if kind=='stylesheet' and not ('maulirituals.com/cdn/shop/' in url or 'typekit.net' in url):r.update(status='discovered-only',reason='Third-party app CSS, outside brand/theme stylesheet archive');return r
    if kind=='image' and not any(x in urllib.parse.urlparse(url).netloc for x in ['maulirituals.com','shopify.com','klaviyo.com']):r.update(status='discovered-only',reason='Third-party widget/analytics resource');return r
    digest=hashlib.sha256(url.encode()).hexdigest()[:10]
    name=urllib.parse.unquote(urllib.parse.urlparse(url).path.split('/')[-1]) or kind
    name=re.sub(r'[^a-zA-Z0-9._-]','_',name)[:140]
    if kind=='font' and '/af/' in url:name+= {'l':'.woff2','d':'.woff','a':'.otf'}.get(name,'')
    folder={'image':'images','font':'fonts','stylesheet':'css'}[kind]
    path=OUT/folder/(digest+'-'+name);path.parent.mkdir(parents=True,exist_ok=True)
    try:
        data=fetch(url);path.write_bytes(data);r.update(status='downloaded',path=path.relative_to(ROOT).as_posix(),bytes=len(data),sha256=hashlib.sha256(data).hexdigest())
    except Exception as e:r.update(status='failed',reason=str(e))
    return r
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool: result=list(pool.map(download,records.values()))
# Inline SVGs preserve DOM serialization; not original response-byte claims.
seen=set()
for svg in inventory['inlineSvgs']:
    data=svg['markup'].encode();sha=hashlib.sha256(data).hexdigest()
    if sha in seen:continue
    seen.add(sha);path=OUT/'svg'/f'{sha[:12]}.svg';path.write_bytes(data)
    result.append({'url':home['url'],'kind':'inline-svg','status':'extracted','path':path.relative_to(ROOT).as_posix(),'sha256':sha,'bytes':len(data),'accessed':DATE,'method':'DOM serialization','rights':'Third-party; license unverified'})
manifest={'accessed':DATE,'scope':'Homepage browser inventory plus four linked page HTML image references; all discovered font representations and unique homepage inline SVGs. Not a full product-catalog/CDN crawl.','assets':result,'counts':{s:sum(r['status']==s for r in result) for s in ['downloaded','extracted','discovered-only','failed']}}
(OUT/'asset-manifest.json').write_text(json.dumps(manifest,indent=2),encoding='utf8')
print(json.dumps(manifest['counts']))
