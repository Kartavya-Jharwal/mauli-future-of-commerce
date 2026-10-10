"""Assemble the explicit public website payload, excluding the research archive."""
from pathlib import Path
import hashlib
import json
import shutil

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'apps' / 'project-site'
OUT = ROOT / 'dist' / 'project-site'

def build():
    OUT.mkdir(parents=True, exist_ok=True)
    for name in ('index.html', 'styles.css', 'app.js', 'favicon.svg', 'share.svg'):
        path = SOURCE / name
        if path.exists():
            shutil.copy2(path, OUT / name)
        elif name in ('index.html', 'styles.css', 'app.js'):
            raise FileNotFoundError(path)
    (OUT / 'content').mkdir(exist_ok=True)
    shutil.copy2(SOURCE / 'content' / 'project.json', OUT / 'content' / 'project.json')
    (OUT / 'downloads').mkdir(exist_ok=True)
    original = ROOT / 'Mauli Rituals - Client Challenge Brief.pdf'
    download = OUT / 'downloads' / 'client-brief.pdf'
    shutil.copy2(original, download)
    assert hashlib.sha256(original.read_bytes()).digest() == hashlib.sha256(download.read_bytes()).digest()
    (OUT / '.nojekyll').write_text('')
    print(json.dumps({'output': str(OUT), 'brief_sha256': hashlib.sha256(download.read_bytes()).hexdigest(), 'files': [str(p.relative_to(OUT)) for p in OUT.rglob('*') if p.is_file()]}, indent=2))

if __name__ == '__main__':
    build()
