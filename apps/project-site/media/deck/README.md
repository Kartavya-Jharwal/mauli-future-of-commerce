# Deck slide images

Sticky horizontal gallery assets (29 frames):

- Prefer `01.webp` … `29.webp` for the live site (already referenced in `index.html`).
- Keep matching `01.png` … `29.png` as source masters if needed; the public build strips PNGs from `dist/` and ships WebP only.

First slide loads eagerly; remaining slides lazy-load via `data-src` as they approach the viewport.
