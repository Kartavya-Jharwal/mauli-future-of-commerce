# Mauli Rituals · Future of Commerce

> *A thread through the future of commerce.*

An independent, pro bono student advisory project for [Mauli Rituals](https://www.maulirituals.com/), developed for the Future of Commerce course under Prof. Nikhil Soi at Hult International Business School.

**[View the live case study →](https://kartavya.tech/mauli-future-of-commerce/)**

---

## The question

How does a deeply personal ritual travel through an increasingly mediated purchase?

Our working answer: strengthen Mauli’s existing Shopify experience with **explainable ritual guidance** and **practitioner-led education**. Keep it incremental, measurable and respectful of brand and wellness language, with no rebuild for its own sake.

## What’s inside

| Asset | Where |
| --- | --- |
| Case-study microsite | [`apps/project-site/`](apps/project-site/) |
| **Aushada Peti**, the Sacred Wheel of Botanicals (interactive prototype) | [`apps/project-site/artefact/`](apps/project-site/artefact/) |
| Presentation deck (PDF · PPTX) | [`deliverables/drafts/deck/`](deliverables/drafts/deck/) |
| Project report (PDF · DOCX) | [`deliverables/drafts/report/`](deliverables/drafts/report/) |
| Financial model (XLSX) | `deliverables/mauli-financial-model.xlsx` (to be added) |
| Client challenge brief (PDF) | [`deliverables/client-brief.pdf`](deliverables/client-brief.pdf) |
| Observed brand tokens and reference assets | [`packages/brand-assets/`](packages/brand-assets/) |

## The site

A single, skimmable page with no build framework:

- **The thread.** A hand-dyed mauli yarn enters from the top-left corner, loops beside the headline, then follows the reader down the page: meandering along the margins, weaving under and over cards and slides, passing behind every team member's name, and tying a bow at the end. GSAP ScrollTrigger keeps its tip at the reader's eye line.
- **Deliverables.** Deck, report and financial model, plus the client brief and the repo.
- **Aushada Peti.** The prototype is embedded live and also available [in its own window](apps/project-site/artefact/index.html).
- **Voice agent.** Two clips of the ElevenLabs guide, loaded only when played.
- **Accessible by default.** Content reads without JavaScript, and reduced-motion users get the full thread drawn statically.

## Run it locally

```bash
python scripts/build_site.py      # assemble dist/project-site
python scripts/check_site.py      # verify links, assets and release states
python -m http.server 8000 --directory dist/project-site
```

Then open <http://localhost:8000>. Pushes to `main` deploy to GitHub Pages through [`pages.yml`](.github/workflows/pages.yml).

## Branches

| Branch | Purpose |
| --- | --- |
| `main` | Client-facing showcase: the site, deliverables and brand references |
| `dev` | Full research archive: governance notes, financial models and coursework inputs |

## Status

Work in progress. The deck and report are course drafts dated 11 October 2026. Client feedback, final submissions and grading are still pending.

---

<sub>Independent student coursework. This is not an official Mauli Rituals or Hult publication and does not imply endorsement. Names, marks and supplied materials belong to their respective owners.</sub>
