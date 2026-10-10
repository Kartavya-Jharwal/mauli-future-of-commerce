"""Rebuild source Markdown with stable source IDs; originals are never modified."""
from pathlib import Path
import hashlib, json, re, zipfile
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from urllib.parse import quote, unquote
from pypdf import PdfReader
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'docs'/'inputs'
EXCLUDED={'README.md','AGENTS.md','mauli-rituals-strategy-brief personal student written.md'}
A='{http://schemas.openxmlformats.org/drawingml/2006/main}'
P='{http://schemas.openxmlformats.org/presentationml/2006/main}'

class MarkdownHTML(HTMLParser):
    def __init__(self):
        super().__init__(); self.parts=[]; self.skip=0; self.links=[]; self.rows=[]; self.row=[]; self.cell=None
    def emit(self,s): (self.cell if self.cell is not None else self.parts).append(s)
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if tag in ('head','script','style'): self.skip+=1
        if self.skip: return
        if re.fullmatch('h[1-6]',tag): self.emit('\n\n'+'#'*int(tag[1])+' ')
        elif tag in ('p','div','ul','ol'): self.emit('\n\n')
        elif tag=='br': self.emit('\n')
        elif tag=='li': self.emit('\n- ')
        elif tag in ('strong','b'): self.emit('**')
        elif tag in ('em','i'): self.emit('*')
        elif tag=='a':
            href=attrs.get('href',''); local=ROOT/unquote(href.rsplit('/',1)[-1])
            if not re.match(r'\w+://',href) and local.is_file(): href='../../'+quote(local.name)
            self.links.append(href); self.emit('[')
        elif tag=='img': self.emit('[Image in original: '+attrs.get('alt','no alternate text')+']')
        elif tag=='table': self.rows=[]
        elif tag=='tr': self.row=[]
        elif tag in ('td','th'): self.cell=[]
    def handle_endtag(self,tag):
        if tag in ('head','script','style'): self.skip=max(0,self.skip-1); return
        if self.skip: return
        if tag in ('strong','b'): self.emit('**')
        elif tag in ('em','i'): self.emit('*')
        elif tag=='a': self.emit(']('+(self.links.pop() if self.links else '')+')')
        elif tag in ('td','th'):
            self.row.append(re.sub(r'\s+',' ',''.join(self.cell or [])).strip().replace('|','\\|')); self.cell=None
        elif tag=='tr': self.rows.append(self.row)
        elif tag=='table' and self.rows:
            width=max(map(len,self.rows)); rows=[r+['']*(width-len(r)) for r in self.rows]
            lines=['| '+' | '.join(r)+' |' for r in rows]; lines.insert(1,'| '+' | '.join(['---']*width)+' |')
            self.emit('\n\n'+'\n'.join(lines)+'\n\n')
        elif tag in ('p','div','li') or re.fullmatch('h[1-6]',tag): self.emit('\n\n')
    def handle_data(self,s):
        if not self.skip: self.emit(s)

def paragraphs(tree):
    return '\n\n'.join(s for p in tree.iter(A+'p') if (s:=''.join(t.text or '' for t in p.iter(A+'t')).strip()))

def extract(path):
    if path.suffix.lower()=='.pdf':
        pages=PdfReader(path).pages
        return '\n\n'.join(f'## Page {i}\n\n'+(p.extract_text() or '[No extractable text; inspect original.]') for i,p in enumerate(pages,1)),len(pages),'page','PDF text layer only. Reading order, diagrams, charts and visual tables require original inspection. No OCR.'
    if path.suffix.lower()=='.pptx':
        parts=[]
        with zipfile.ZipFile(path) as z:
            names=sorted([n for n in z.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml',n)],key=lambda n:int(re.search(r'(\d+)\.xml',n).group(1)))
            for i,name in enumerate(names,1):
                text=paragraphs(ET.fromstring(z.read(name))); notes=None
                rel=f'ppt/slides/_rels/slide{i}.xml.rels'
                if rel in z.namelist():
                    for item in ET.fromstring(z.read(rel)):
                        if item.get('Type','').endswith('/notesSlide'): notes='ppt/'+item.get('Target','').removeprefix('../')
                note_parts=[]
                if notes and notes in z.namelist():
                    for shape in ET.fromstring(z.read(notes)).iter(P+'sp'):
                        ph=shape.find('.//'+P+'ph')
                        if ph is not None and ph.get('type') in ('sldNum','hdr','ftr','dt','sldImg'): continue
                        value=paragraphs(shape)
                        if value: note_parts.append(value)
                parts.append(f'## Slide {i}\n\n'+(text or '[No text in slide shapes; inspect original.]')+('\n\n### Speaker notes\n\n'+'\n\n'.join(note_parts) if note_parts else ''))
        return '\n\n'.join(parts),len(parts),'slide','Shape text and available speaker notes. Images, charts, animation, visual order and layout require originals.'
    raw=path.read_text(encoding='utf-8-sig')
    if path.suffix.lower()=='.html' or raw.lstrip().lower().startswith('<!doctype'):
        parser=MarkdownHTML(); parser.feed(raw)
        return re.sub(r'\n{3,}','\n\n',''.join(parser.parts)).strip(),1,'document','HTML converted with headings, lists, links and tables. Styling and images require original.'
    raw=re.sub(r'data:image/[^\s)>"\']+','embedded-image-omitted',raw)
    raw=re.sub(r'!\[([^\]]*)\]\(embedded-image-omitted\)',r'[Embedded image in original: \1]',raw)
    omitted=re.findall(r'^\[([^\]]+)\]:\s*<embedded-image-omitted>\s*$',raw,re.M)
    for ref in omitted:
        raw=re.sub(r'!\[([^\]]*)\]\['+re.escape(ref)+r'\]',lambda m:'[Embedded image '+ref+' in original'+(': '+m.group(1) if m.group(1) else '')+']',raw)
    raw=re.sub(r'^\[[^\]]+\]:\s*<embedded-image-omitted>\s*$','',raw,flags=re.M)
    return raw.strip(),1,'document','Markdown retained; embedded image payloads omitted. Images remain in original.'

def main():
    OUT.mkdir(parents=True,exist_ok=True)
    old=json.loads((OUT/'inventory.json').read_text(encoding='utf-8-sig'))
    ids={x['path']:x['source_id'] for x in old}; counter=max(int(x.split('-')[-1]) for x in ids.values())
    inventory=[]; hashes={}
    for path in sorted(ROOT.iterdir()):
        if path.suffix.lower() not in ('.pdf','.pptx','.html','.md') or path.name in EXCLUDED: continue
        if path.name not in ids: counter+=1; ids[path.name]=f'LOCAL-{counter:02}'
        body,units,locator,limits=extract(path); digest=hashlib.sha256(path.read_bytes()).hexdigest()
        canonical=hashes.setdefault(digest,ids[path.name]); duplicate=canonical!=ids[path.name]
        target=OUT/(path.name+'.md')
        header=f'# {path.name}\n\n- Source ID: `{ids[path.name]}`\n- Evidence ID: `{canonical}`'+(' (byte-identical duplicate; count once)' if duplicate else '')+f'\n- Original: [supplied file](../../{quote(path.name)})\n- SHA-256: `{digest}`\n- Provenance: supplied input; assertions are not independently verified.\n- Conversion date: 2026-10-10\n- Coverage: {units} {locator}(s).\n- Limitations: {limits}\n\n---\n\n'
        target.write_text(header+body+'\n',encoding='utf-8')
        inventory.append({'source_id':ids[path.name],'evidence_id':canonical,'duplicate_of':canonical if duplicate else None,'path':path.name,'sha256':digest,'bytes':path.stat().st_size,'extraction':target.relative_to(ROOT).as_posix(),'units':units,'locator':locator,'status':'supplied source; factual claims require provenance verification','extraction_limitations':limits})
    for suffix in ('.txt','.md'): (OUT/('mauli-rituals-strategy-brief personal student written.md'+suffix)).unlink(missing_ok=True)
    (OUT/'inventory.json').write_text(json.dumps(inventory,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    rows=['| Source | ID | Coverage | Evidence |','| --- | --- | --- | --- |']
    for x in inventory: rows.append(f"| [{x['path']}]({quote(Path(x['extraction']).name)}) | {x['source_id']} | {x['units']} {x['locator']}(s) | {x['evidence_id']}"+(' duplicate' if x['duplicate_of'] else '')+' |')
    intro=f'# Supplied-source Markdown archive\n\n{len(inventory)} original files, {len(hashes)} unique evidence objects. Original files retain their names and bytes. Each Markdown derivative contains provenance, a hash and page/slide locators where applicable. Stable IDs retain the gap left by withdrawn LOCAL-13.\n\n'
    ending='\n\n## Interpretation and limits\n\nThese are source transcriptions, not verified research or adopted recommendations. The owner withdrew the personal student brief and its derivative on 2026-10-10 because its design choices should not govern execution. Other supplied proposals remain historical inputs to assess against the updated brief.\n\nThe two client challenge PDFs are byte-identical: count the shared evidence ID once. Legacy `.txt` derivatives have been retired; maintained research links use the Markdown archive. The inventory points to the current Markdown derivatives, which also include available speaker notes and HTML structure.\n\nRun `python scripts/ingest_sources.py` with `pypdf` available to rebuild. No OCR or visual reconstruction is performed. Check images, diagrams, charts and layouts in the originals before relying on them. External links are retained as supplied and have not been verified.\n'
    (OUT/'README.md').write_text(intro+'\n'.join(rows)+ending,encoding='utf-8')
    print(f'Generated {len(inventory)} Markdown files; {len(hashes)} unique evidence objects.')
if __name__=='__main__': main()
