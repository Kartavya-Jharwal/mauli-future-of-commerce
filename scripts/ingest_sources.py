"""Index supplied documents without changing originals; run with bundled Python."""
from pathlib import Path
import hashlib, json, re, zipfile
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs' / 'inputs'

class TextHTML(HTMLParser):
    def __init__(self):
        super().__init__(); self.parts = []; self.skip = 0
    def handle_starttag(self, tag, attrs):
        if tag in ('script', 'style'): self.skip += 1
        if tag in ('p', 'div', 'h1', 'h2', 'h3', 'li', 'tr', 'br'): self.parts.append('\n')
    def handle_endtag(self, tag):
        if tag in ('script', 'style'): self.skip = max(0, self.skip - 1)
    def handle_data(self, data):
        if not self.skip: self.parts.append(data)

def extract(path):
    suffix = path.suffix.lower()
    if suffix == '.pdf':
        return '\n\n'.join(f'## Page {i}\n{p.extract_text() or "[No extractable text]"}' for i,p in enumerate(PdfReader(path).pages,1))
    if suffix == '.pptx':
        parts = []
        with zipfile.ZipFile(path) as z:
            names = sorted([n for n in z.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml',n)],key=lambda n:int(re.search(r'(\d+)\.xml',n).group(1)))
            for i,n in enumerate(names,1):
                tree = ET.fromstring(z.read(n))
                parts.append(f'## Slide {i}\n'+'\n'.join(t.text or '' for t in tree.iter('{http://schemas.openxmlformats.org/drawingml/2006/main}t')))
        return '\n\n'.join(parts)
    raw = path.read_text(encoding='utf-8-sig')
    raw = re.sub(r'data:image/[^\s)>"\']+', '[embedded image omitted from text extraction]', raw)
    if suffix == '.html' or raw.lstrip().lower().startswith('<!doctype'):
        parser = TextHTML(); parser.feed(raw); return '\n'.join(s.strip() for s in ''.join(parser.parts).splitlines() if s.strip())
    return raw

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    inventory = []
    for path in sorted(ROOT.iterdir()):
        if path.suffix.lower() not in ('.pdf','.pptx','.html','.md') or path.name in ('README.md','AGENTS.md'): continue
        target = OUT / (path.stem + '.txt')
        text = extract(path)
        # Each source keeps a distinct extraction even when source stems collide.
        target = OUT / (path.name + '.txt')
        target.write_text(text, encoding='utf-8')
        inventory.append({'source_id':f'LOCAL-{len(inventory)+1:02}', 'path':path.name, 'sha256':hashlib.sha256(path.read_bytes()).hexdigest(), 'bytes':path.stat().st_size, 'extraction':target.relative_to(ROOT).as_posix(), 'status':'supplied source; factual claims require provenance verification', 'extraction_limitations':'text only; images, layout, slide notes and charts may require visual inspection'})
    (OUT/'inventory.json').write_text(json.dumps(inventory,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    print(json.dumps([{'path':i['path'],'bytes':i['bytes']} for i in inventory],indent=2))

if __name__ == '__main__': main()
