"""Check the public static payload's navigation, assets and release states."""
from html.parser import HTMLParser
from pathlib import Path
import json
from urllib.parse import urlparse, unquote

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / 'dist' / 'project-site'


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.links = []
        self.iframes = []
        self.videos = []
        self.title = False
        self.description = False
        self.lang = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a:
            assert a['id'] not in self.ids, f'Duplicate id: {a["id"]}'
            self.ids.add(a['id'])
        if tag == 'html':
            self.lang = bool(a.get('lang'))
        if tag == 'title':
            self.title = True
        if tag == 'meta' and a.get('name') == 'description':
            self.description = bool(a.get('content'))
        if tag in ('a', 'link') and 'href' in a:
            self.links.append(a['href'])
        if tag in ('script', 'img') and 'src' in a:
            self.links.append(a['src'])
        if tag == 'img' and 'data-src' in a:
            self.links.append(a['data-src'])
        if tag == 'iframe' and 'src' in a:
            self.iframes.append(a['src'])
            self.links.append(a['src'])
        if tag == 'source' and 'src' in a:
            self.videos.append(a['src'])


assert SITE.is_dir(), f'Missing built site at {SITE}; run scripts/build_site.py first'

p = Page()
p.feed((SITE / 'index.html').read_text(encoding='utf8'))
assert p.title and p.description and p.lang, 'Missing document metadata'
assert 'prototype' in p.ids, 'Missing #prototype section'
assert 'deck' in p.ids, 'Missing #deck horizontal gallery section'
assert any('artefact/index.html' in src for src in p.iframes), 'Missing Aushada Peti iframe embed'
assert (SITE / 'media' / 'deck' / '01.webp').is_file(), 'Missing first deck WebP slide'
assert len(list((SITE / 'media' / 'deck').glob('[0-9][0-9].webp'))) >= 29, 'Expected 29 deck WebP slides'

for ref in p.links:
    u = urlparse(ref)
    if u.scheme or ref.startswith('//'):
        continue
    if not u.path:
        # Allow placeholder href="#" (e.g. forthcoming LinkedIn links).
        if not u.fragment:
            continue
        assert u.fragment in p.ids, f'Broken anchor: {ref}'
    else:
        assert not u.path.startswith('/'), f'Root-relative path breaks project Pages: {ref}'
        target = SITE / unquote(u.path)
        # Optional assets: media drops and the Excel model may land after the first deploy.
        if (u.path.startswith('media/') or u.path.endswith('.xlsx')) and not target.is_file():
            continue
        assert target.is_file(), f'Missing public asset: {ref}'

artefact = SITE / 'artefact' / 'index.html'
assert artefact.is_file(), 'Missing standalone Aushada Peti page'
artefact_html = artefact.read_text(encoding='utf8')
assert 'Aushada Peti' in artefact_html, 'Standalone artefact is missing Aushada Peti branding'
assert '../index.html' in artefact_html, 'Standalone artefact is missing case-study back link'

content = json.loads((SITE / 'content' / 'project.json').read_text(encoding='utf8'))
assert len(content['team']) == 7
assert all(m['name'] and m['linkedinUrl'].startswith('https://www.linkedin.com/') for m in content['team'])
assert content['project']['status'] == 'in_progress'
assert content['downloads'][0]['state'] == 'available'
assert content['downloads'][1]['state'] == 'available'
assert any(item['id'] == 'model' and item['state'] == 'available' for item in content['downloads'])
for item in content['downloads']:
    assert (SITE / item['publicUrl']).is_file(), f"Missing download: {item['id']}"
    if item.get('editableUrl'):
        assert (SITE / item['editableUrl']).is_file(), f"Missing editable download: {item['id']}"

print(
    f'Passed: {len(p.ids)} unique anchors, {len(p.links)} asset/navigation references, '
    f'{len(p.iframes)} iframe embed(s), seven linked team profiles, release states and public payload.'
)
