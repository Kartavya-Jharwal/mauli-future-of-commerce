# Project site

The static public showcase for the Mauli / Future of Commerce case study. Plain HTML, CSS and JavaScript; GSAP (ScrollTrigger) and Three.js load from jsDelivr.

## Page flow

1. **Cover:** Mauli Rituals logo top-left, Hult logo top-right, headline, one line
2. **The problem**
3. **Approach:** four cards the thread weaves under and over
4. **Deliverables:** deck, report and financial model, plus small links to the brief and the repo
5. **Ask Vaidya:** the floating ElevenLabs voice widget (docked bottom-right on every screen) glides into the centre of this screen, then back to the corner
6. **Aushada Peti:** the prototype, embedded at full viewport height, with an open-in-new-window link
7. **Voice agent:** two clips that open in a lightbox and load only on click
8. **The deck:** all 29 slide exports in a sticky horizontal carousel driven by vertical scroll, one slide per scroll gesture
9. **Three horizons**
10. **Team:** the thread loops behind every name
11. **Closing mark:** the thread ties a bow
12. **Footer**

## Snapping

The page uses CSS scroll snapping (`mandatory` on desktop, `proximity` on phones). The masthead, every `.section`, the closing card and the footer are snap points. Inside the deck, `app.js` adds one invisible snap marker per slide, positioned so that each stop centres that slide; scrolling down into the deck therefore pins it, and each wheel or trackpad gesture moves exactly one slide sideways.

## The thread

`app.js` builds one SVG path from the live layout, so it follows the real positions of headings, cards and names:

- Enters from the top-left corner, wiggles across the empty band above the headline, makes four uneven loops beside it, and swings to the right rail.
- Meanders down one rail per section; crosses to the other rail with a flattened S in the gap between sections.
- Weaves around cards and slides row by row (left to right, then back), running in the margin just outside each frame — below one, above the next — so it never cuts through text. "Over" is a second copy of the path above the content, clipped to those elements.
- Piles loose loops behind the demo frame and the video clips: the loops stack from top to bottom of each box, so the thread accumulates behind it while the reader scrolls through, then leaves as they scroll past.
- Loops around each team member's name, then descends vertically into a horizontal wrap line, settles through three shallow coils and finishes in a concentrated, upward-looping parcel bow.

Progress is driven by GSAP ScrollTrigger: the tip of the thread sits at about 82% of the viewport height, so it stays just ahead of the reader. The path is drawn in on load and rebuilt on resize, font load and content height changes. A Three.js shader adds a faint woven-cloth grain over the page (desktop only; off with reduced motion). With reduced motion, the thread shows complete.

## Files

| Path | Contents |
| --- | --- |
| `index.html`, `styles.css`, `app.js` | The page |
| `artefact/` | Aushada Peti (standalone, also embedded via iframe) |
| `downloads/` | PDF, PPTX, DOCX and XLSX files, copied in by `scripts/build_site.py` |
| `media/` | Video clips, thumbnails and slide exports; see `media/README.md` |
| `content/project.json` | Section and deliverable manifest checked by `scripts/check_site.py` |

## Swapping in assets

- **Logos:** `media/logos/mauli-rituals.png` and `media/logos/hult.png`.
- **Slides:** root-level `Slides/*.png` files are copied into `media/deck/` by the build.
- **Videos:** `media/video/demo.mp4`, `guardrails.mp4` and their `-thumb.jpg` files.
- **Excel model:** the supplied root workbook is published as `downloads/mauli-financial-model.xlsx`.

Fonts are Fraunces and Inter from Google Fonts, falling back to Georgia and Arial.
