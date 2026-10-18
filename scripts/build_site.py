"""Assemble the explicit public website payload, excluding the research archive."""
from pathlib import Path
import hashlib
import json
import shutil

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'apps' / 'project-site'
OUT = ROOT / 'dist' / 'project-site'


def copy_tree(src: Path, dst: Path) -> None:
    if not src.exists():
        return
    if dst.exists():
        shutil.rmtree(dst)
    shutil.copytree(
        src,
        dst,
        ignore=shutil.ignore_patterns('README.md', '.gitkeep', '.DS_Store', 'Thumbs.db'),
    )


def copy_download(source: Path, target: Path) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, target)
    assert hashlib.sha256(source.read_bytes()).digest() == hashlib.sha256(target.read_bytes()).digest()


def build():
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir(parents=True, exist_ok=True)

    for name in ('index.html', 'styles.css', 'app.js', 'favicon.svg', 'share.svg'):
        path = SOURCE / name
        if path.exists():
            shutil.copy2(path, OUT / name)
        elif name in ('index.html', 'styles.css', 'app.js'):
            raise FileNotFoundError(path)

    (OUT / 'content').mkdir(exist_ok=True)
    shutil.copy2(SOURCE / 'content' / 'project.json', OUT / 'content' / 'project.json')

    copy_tree(SOURCE / 'artefact', OUT / 'artefact')
    copy_tree(SOURCE / 'media', OUT / 'media')

    # Numbered deck exports supplied at the repository root. Keep source and
    # built media in sync so both direct previews and the public build work.
    slides = sorted((ROOT / 'Slides').glob('[0-9][0-9].png'))
    source_slides = SOURCE / 'media' / 'deck'
    source_slides.mkdir(parents=True, exist_ok=True)
    for old_slide in source_slides.glob('[0-9][0-9].png'):
        old_slide.unlink()
    for slide in slides:
        shutil.copy2(slide, source_slides / slide.name)

    # Public carousel ships WebP only. Keep numbered WebP copies; strip heavy PNGs.
    output_slides = OUT / 'media' / 'deck'
    output_slides.mkdir(parents=True, exist_ok=True)
    for raw_slide in output_slides.glob('[0-9][0-9].png'):
        raw_slide.unlink()
    webps = sorted(output_slides.glob('[0-9][0-9].webp'))
    if len(webps) < 1:
        raise FileNotFoundError('Missing media/deck/*.webp slide exports for the horizontal gallery')

    downloads_out = OUT / 'downloads'
    downloads_out.mkdir(exist_ok=True)

    brief_candidates = [
        ROOT / 'deliverables' / 'client-brief.pdf',
        ROOT / 'Mauli Rituals - Client Challenge Brief.pdf',
        ROOT / 'deliverables' / 'drafts' / 'client-brief.pdf',
    ]
    original = next((p for p in brief_candidates if p.exists()), None)
    if original is None:
        raise FileNotFoundError('Missing client brief PDF')
    download = downloads_out / 'client-brief.pdf'
    copy_download(original, download)

    for folder, output_stem, formats in (
        ('deck', 'mauli-presentation-deck', ('pdf', 'pptx')),
        ('report', 'mauli-project-report', ('pdf', 'docx')),
    ):
        for extension in formats:
            if folder == 'deck':
                root_name = 'Mauli_Rituals-Deck_Final-Extended.pdf' if extension == 'pdf' else 'Mauli Rituals.pptx'
                legacy_stem = 'mauli-course-deck-draft'
            else:
                root_name = f'Mauli Rituals_Team-3.{extension}'
                legacy_stem = 'mauli-course-report-draft'
            candidates = [
                ROOT / root_name,
                ROOT / 'deliverables' / 'drafts' / folder / f'{legacy_stem}.{extension}',
                ROOT / 'deliverables' / folder / f'{legacy_stem}.{extension}',
                ROOT / 'deliverables' / f'{legacy_stem}.{extension}',
            ]
            source = next((p for p in candidates if p.exists()), None)
            if source is None:
                raise FileNotFoundError(f'Missing deliverable: {output_stem}.{extension}')
            copy_download(source, downloads_out / f'{output_stem}.{extension}')

    # Optional Excel model: copied when present, otherwise the card links to a forthcoming file.
    model_candidates = [
        ROOT / 'NOT-A-Deliverable-Mauli-Rituals-Extended-Excel.xlsx',
        ROOT / 'deliverables' / 'mauli-financial-model.xlsx',
        ROOT / 'deliverables' / 'drafts' / 'model' / 'mauli-financial-model.xlsx',
        ROOT / 'models' / 'financial-scenarios' / 'mauli-financial-scenarios.xlsx',
    ]
    model = next((p for p in model_candidates if p.exists()), None)
    if model is not None:
        copy_download(model, downloads_out / 'mauli-financial-model.xlsx')

    # Mirror downloads into the source tree for local preview consistency.
    site_downloads = SOURCE / 'downloads'
    site_downloads.mkdir(exist_ok=True)
    for path in downloads_out.iterdir():
        if path.is_file():
            shutil.copy2(path, site_downloads / path.name)

    (OUT / '.nojekyll').write_text('')
    print(json.dumps({
        'output': str(OUT),
        'brief_sha256': hashlib.sha256(download.read_bytes()).hexdigest(),
        'files': [str(p.relative_to(OUT)) for p in OUT.rglob('*') if p.is_file()],
    }, indent=2))


if __name__ == '__main__':
    build()
