# Mauli Rituals — Future of Commerce

Independent student advisory showcase for Mauli Rituals (Hult Business School · Future of Commerce). Not an official Mauli or Hult publication.

**Live site:** [kartavya.tech/mauli-future-of-commerce](https://kartavya.tech/mauli-future-of-commerce/)

## What’s here

| Asset | Location |
| --- | --- |
| Case-study microsite | [`apps/project-site/`](apps/project-site/) |
| **Aushada Peti** — Sacred Wheel of Botanicals (standalone) | [`apps/project-site/artefact/`](apps/project-site/artefact/) |
| Presentation deck (PDF + PPTX) | [`deliverables/drafts/deck/`](deliverables/drafts/deck/) |
| Strategic report (PDF + DOCX) | [`deliverables/drafts/report/`](deliverables/drafts/report/) |
| Client challenge brief (PDF) | [`deliverables/client-brief.pdf`](deliverables/client-brief.pdf) |
| Brand tokens & reference assets | [`packages/brand-assets/`](packages/brand-assets/) |

The microsite embeds Aushada Peti, hosts a deck carousel, download modals for the report/deck/brief, and a slot for the highlighted demo walkthrough (`apps/project-site/media/demo.mp4`).

## Direction (one line)

Strengthen Mauli’s existing Shopify experience with explainable ritual guidance and practitioner-led education — incremental, measurable, and respectful of brand and wellness language.

## Working branch

Full research archive, governance notes, financial models and coursework inputs live on the **`dev`** branch. This **`main`** branch is the post-assignment, client-facing surface.

## Build the public site

```bash
python scripts/build_site.py
python scripts/check_site.py
```

GitHub Pages deploys from `main` via [`.github/workflows/pages.yml`](.github/workflows/pages.yml).
