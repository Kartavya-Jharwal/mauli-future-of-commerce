# Mauli Rituals · Future of Commerce

> *A thread through the future of commerce.*

An independent, pro bono student advisory project for [Mauli Rituals](https://www.maulirituals.com/), developed for the Future of Commerce course under Prof. Nikhil Soi at Hult International Business School.

**[Try Aushada Peti →](https://kartavya.tech/mauli-future-of-commerce/)** · **[Case study landing →](https://kartavya.tech/mauli-future-of-commerce/landing/)**

---

## The question

How does a deeply personal ritual travel through an increasingly mediated purchase?

Our working answer: strengthen Mauli’s existing Shopify experience with **explainable ritual guidance** and **practitioner-led education**. Keep it incremental, measurable and respectful of brand and wellness language, with no rebuild for its own sake.

## What’s inside

| Asset | Where |
| --- | --- |
| **Aushada Peti** (site root / first experience) | [`apps/project-site/index.html`](apps/project-site/index.html) |
| Case-study landing | [`apps/project-site/landing/`](apps/project-site/landing/) |
| Presentation deck | [`Mauli_Rituals-Deck_Final-Extended.pdf`](Mauli_Rituals-Deck_Final-Extended.pdf) · [`Mauli Rituals.pptx`](Mauli%20Rituals.pptx) |
| Project report | [`Mauli Rituals_Team-3.pdf`](Mauli%20Rituals_Team-3.pdf) · [`Mauli Rituals_Team-3.docx`](Mauli%20Rituals_Team-3.docx) |
| Financial model (XLSX) | [`NOT-A-Deliverable-Mauli-Rituals-Extended-Excel.xlsx`](NOT-A-Deliverable-Mauli-Rituals-Extended-Excel.xlsx) |
| Client challenge brief (PDF) | [`deliverables/client-brief.pdf`](deliverables/client-brief.pdf) |
| Observed brand tokens and reference assets | [`packages/brand-assets/`](packages/brand-assets/) |

## The site

A single, skimmable page with no build framework:

- **The thread.** A hand-dyed mauli yarn enters from the top-left corner, loops beside the headline, then follows the reader down the page: meandering along the margins, weaving under and over cards and slides, passing behind every team member's name, and tying a bow at the end. GSAP ScrollTrigger keeps its tip at the reader's eye line.
- **Deliverables.** Deck, report and financial model, plus the client brief and the repo.
- **Aushada Peti.** The botanical demo is the site entry at `/`. The case study lives at [`/landing`](apps/project-site/landing/index.html) and embeds the same demo.
- **Voice agent.** Two clips of the ElevenLabs guide, loaded only when played.
- **Accessible by default.** Content reads without JavaScript, and reduced-motion users get the full thread drawn statically.

## Run it locally

```bash
python scripts/build_site.py      # assemble dist/project-site
python scripts/check_site.py      # verify links, assets and release states
python -m http.server 8000 --directory dist/project-site
```

Then open <http://localhost:8000> for Aushada Peti, or <http://localhost:8000/landing/> for the case study. Pushes to `main` deploy to GitHub Pages through [`pages.yml`](.github/workflows/pages.yml).

## Branches

| Branch | Purpose |
| --- | --- |
| `main` | Client-facing showcase: the site, deliverables and brand references |
| `dev` | Full research archive: governance notes, financial models and coursework inputs |

## Status

Work in progress. The supplied presentation, report, model, slide exports and demo recordings are integrated into the showcase. Client feedback and grading are still pending.

---

<sub>Independent student coursework. This is not an official Mauli Rituals or Hult publication and does not imply endorsement. Names, marks and supplied materials belong to their respective owners.</sub>
