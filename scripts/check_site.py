"""Check the public static payload's navigation, assets and release states."""
from html.parser import HTMLParser
from pathlib import Path
import json
from urllib.parse import urlparse, unquote

ROOT=Path(__file__).resolve().parents[1]
SITE=ROOT/'dist'/'project-site'
class Page(HTMLParser):
    def __init__(self):
        super().__init__();self.ids=set();self.links=[];self.title=False;self.description=False;self.lang=False
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if 'id' in a:
            assert a['id'] not in self.ids, f"Duplicate id: {a['id']}"
            self.ids.add(a['id'])
        if tag=='html':self.lang=bool(a.get('lang'))
        if tag=='title':self.title=True
        if tag=='meta' and a.get('name')=='description':self.description=bool(a.get('content'))
        if tag in ('a','link') and 'href' in a:self.links.append(a['href'])
        if tag in ('script','img') and 'src' in a:self.links.append(a['src'])

p=Page();p.feed((SITE/'index.html').read_text(encoding='utf8'))
assert p.title and p.description and p.lang,'Missing document metadata'
for ref in p.links:
    u=urlparse(ref)
    if u.scheme or ref.startswith('//'):continue
    if not u.path:
        assert u.fragment and u.fragment in p.ids,f'Broken anchor: {ref}'
    else:
        assert not u.path.startswith('/'),f'Root-relative path breaks project Pages: {ref}'
        assert (SITE/unquote(u.path)).is_file(),f'Missing public asset: {ref}'
content=json.loads((SITE/'content'/'project.json').read_text())
assert len(content['team'])==7
assert all(m['linkedinUrl'] is None for m in content['team'])
assert content['project']['status']=='in_progress'
assert content['downloads'][0]['state']=='forthcoming'
assert content['downloads'][1]['state']=='forthcoming'
assert not any(SITE.rglob('*.xlsx')),'Workbook unexpectedly included in website payload'
print(f'Passed: {len(p.ids)} unique anchors, {len(p.links)} asset/navigation references, seven placeholders, release states and public payload.')
