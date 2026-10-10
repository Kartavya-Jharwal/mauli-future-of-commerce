"""Check source preservation, JSON, CSV shape and internal documentation links."""
from pathlib import Path
import csv, hashlib, json, re
import subprocess, sys
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[1]
errors = []
manifest = json.loads((ROOT/'package.json').read_text(encoding='utf-8-sig'))
assert manifest['private'] is True
inventory = json.loads((ROOT/'docs/inputs/inventory.json').read_text(encoding='utf-8-sig'))
for item in inventory:
    source = ROOT/item['path']
    if not source.is_file() or hashlib.sha256(source.read_bytes()).hexdigest() != item['sha256']:
        errors.append(f"Original differs: {item['path']}")
    if not (ROOT/item['extraction']).is_file(): errors.append(f"Missing extraction: {item['extraction']}")
csv_count = 0
for path in (ROOT/'docs').rglob('*.csv'):
    with path.open(encoding='utf-8-sig',newline='') as f:
        rows = list(csv.reader(f))
    if not rows: errors.append(f'Empty CSV: {path.relative_to(ROOT)}'); continue
    for n,row in enumerate(rows[1:],2):
        if not row: continue
        if len(row)!=len(rows[0]): errors.append(f'CSV shape: {path.relative_to(ROOT)} row {n}')
    csv_count += 1
for path in [ROOT/'README.md',*(ROOT/'docs').rglob('*.md')]:
    for link in re.findall(r'\[[^\]]*\]\(([^\s)]+)\)',path.read_text(encoding='utf-8-sig')):
        if re.match(r'\w+://',link) or link.startswith('#'): continue
        target = unquote(link.split('#')[0])
        if target and not (path.parent/target).exists(): errors.append(f'Broken link in {path.relative_to(ROOT)}: {target}')
print(f'Checked {len(inventory)} original hashes and extractions, package manifest, {csv_count} CSV files and documentation links.')
if errors:
    print('\n'.join(errors)); raise SystemExit(1)
print('Checks passed.')
if '--staged' in sys.argv:
    requests = b''.join((':'+r['path']+'\n').encode('utf-8') for r in inventory)
    batch = subprocess.check_output(['git','cat-file','--batch'],input=requests)
    for item in inventory:
        header, batch = batch.split(b'\n',1)
        size = int(header.split()[-1])
        data, batch = batch[:size], batch[size+1:]
        if hashlib.sha256(data).hexdigest()!=item['sha256']:
            raise ValueError(f"Staged source differs: {item['path']}")
    print('All staged original documents match their source hashes byte-for-byte.')
