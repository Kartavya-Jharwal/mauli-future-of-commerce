# Project site

Static public showcase for the Mauli / Future of Commerce student case study.

## Shape

Curated single-page skimmer (no primary nav): hero visual scaffold → problem/context → deliverable modals → **Aushada Peti** (Sacred Wheel of Botanicals; embedded + [standalone](artefact/index.html)) → sticky horizontal deck gallery (`media/deck/01.jpg`…) → sharper choices → feedback/grading → process → team → closing mark / bowtie → footer.

A thin SVG yarn thread runs in the background (GSAP ScrollTrigger) with smooth Catmull-Rom curves — no crayon displacement filter. Progress follows section anchors in the viewport.

## Files

- `index.html` / `styles.css` / `app.js` — main page
- `artefact/` — Aushada Peti prototype (standalone HTML; also embedded via iframe)
- `downloads/` — PDF / PPTX / DOCX targets (binaries via release copy)
- `media/` — demo video target (`demo.mp4`) and deck slide images (`deck/01.jpg`…)
- `content/project.json` — section/deliverable manifest

GSAP is loaded from jsDelivr CDN on the case-study page; Aushada Peti ships with an inlined GSAP build. Reading, anchors and modal markup remain usable if scripts fail; reduced-motion shows the full thread.

Live: [GitHub Pages showcase](https://kartavya.tech/mauli-future-of-commerce/).
