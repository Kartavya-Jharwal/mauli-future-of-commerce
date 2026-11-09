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
        self.base = None
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
        if tag == 'base' and 'href' in a:
            self.base = a['href']
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


def resolve_local(page_dir: Path, ref: str, base: str | None) -> Path | None:
    """Resolve a local asset path, honouring <base href> when present."""
    u = urlparse(ref)
    if u.scheme or ref.startswith('//'):
        return None
    if not u.path:
        return page_dir  # fragment-only / empty
    assert not u.path.startswith('/'), f'Root-relative path breaks project Pages: {ref}'
    # Landing uses <base href="../"> so document-relative URLs resolve from site root.
    origin = SITE if base and base.rstrip('/').endswith('..') else page_dir
    return (origin / unquote(u.path)).resolve()


assert SITE.is_dir(), f'Missing built site at {SITE}; run scripts/build_site.py first'

tool = Page()
tool.feed((SITE / 'index.html').read_text(encoding='utf8'))
assert tool.title and tool.description and tool.lang, 'Missing tool document metadata'
assert 'Aushada Peti' in (SITE / 'index.html').read_text(encoding='utf8'), 'Root must be Aushada Peti'
assert 'landing/#prototype' in (SITE / 'index.html').read_text(encoding='utf8'), 'Tool missing case-study back link'

landing_path = SITE / 'landing' / 'index.html'
assert landing_path.is_file(), 'Missing /landing case-study page'
landing = Page()
landing.feed(landing_path.read_text(encoding='utf8'))
assert landing.title and landing.description and landing.lang, 'Missing landing document metadata'
assert landing.base and '..' in landing.base, 'Landing should use <base href="../"> for shared assets'
assert 'prototype' in landing.ids, 'Missing #prototype section'
assert 'deck' in landing.ids, 'Missing #deck horizontal gallery section'
assert any(src.rstrip('/') in ('index.html', '.', '') or src == 'index.html' for src in landing.iframes), (
    'Missing Aushada Peti iframe embed pointing at site root'
)
assert (SITE / 'media' / 'deck' / '01.webp').is_file(), 'Missing first deck WebP slide'
assert len(list((SITE / 'media' / 'deck').glob('[0-9][0-9].webp'))) >= 29, 'Expected 29 deck WebP slides'

for page, page_dir in ((tool, SITE), (landing, landing_path.parent)):
    for ref in page.links:
        u = urlparse(ref)
        if u.scheme or ref.startswith('//'):
            continue
        if not u.path:
            if not u.fragment:
                continue
            assert u.fragment in page.ids, f'Broken anchor on {page_dir.name}: {ref}'
            continue
        target = resolve_local(page_dir, ref, page.base)
        if target is None:
            continue
        # Optional assets: media drops and the Excel model may land after the first deploy.
        rel = str(Path(unquote(u.path))).replace('\\', '/')
        if (rel.startswith('media/') or rel.endswith('.xlsx')) and not target.is_file():
            continue
        if target.is_dir() and (target / 'index.html').is_file():
            continue
        assert target.is_file(), f'Missing public asset from {page_dir}: {ref} -> {target}'

artefact = SITE / 'artefact' / 'index.html'
assert artefact.is_file(), 'Missing legacy artefact redirect'
artefact_html = artefact.read_text(encoding='utf8')
assert 'Aushada Peti' in artefact_html, 'Artefact redirect is missing Aushada Peti branding'
assert '../' in artefact_html, 'Artefact redirect should send visitors to the site root'

content = json.loads((SITE / 'content' / 'project.json').read_text(encoding='utf8'))
assert len(content['team']) == 7
assert all(m['name'] and m['linkedinUrl'].startswith('https://www.linkedin.com/') for m in content['team'])
assert content['project']['status'] == 'in_progress'
assert content['project'].get('demoUrl', '').endswith('/') or content['project'].get('demoUrl', '').endswith('index.html') or content['sections']
assert content['downloads'][0]['state'] == 'available'
assert content['downloads'][1]['state'] == 'available'
assert any(item['id'] == 'model' and item['state'] == 'available' for item in content['downloads'])
for item in content['downloads']:
    assert (SITE / item['publicUrl']).is_file(), f"Missing download: {item['id']}"
    if item.get('editableUrl'):
        assert (SITE / item['editableUrl']).is_file(), f"Missing editable download: {item['id']}"

print(
    f'Passed: tool at /, landing at /landing/ ({len(landing.ids)} anchors), '
    f'{len(tool.links) + len(landing.links)} asset/navigation references, '
    f'{len(landing.iframes)} iframe embed(s), seven linked team profiles, release states and public payload.'
)
