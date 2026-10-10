# Mauli Rituals — observed identity and design-system audit

Independent student research, accessed **10 October 2026**. This is an analytical brandbook, not an official identity manual or an endorsement. The public store is the primary source. Token names in this audit are editorial aliases.

## Read the system before borrowing its surface

Mauli's strongest visual relationship is between an intimate, sensorial photographic world and restrained editorial typography. Warm brown lettering, near-white and cream surfaces, fine outlined icons, open spacing and serif product names carry the everyday interface. The live homepage places bodily ritual and movement ahead of a conventional static product hero. The study should translate the pace, care and material quality into evidence-led editorial presentation; a student project must retain its own title, authorship and purpose.

The thread is supported by public brand evidence: the homepage defines the name through a sacred thread and wellbeing; the story page has sections about its sacred thread and Thread Fund. That supports a connecting motif. It does **not** establish a particular red color, knot geometry, animation curve or mandatory logo treatment. Those remain proposed design decisions pending the separate motion handoff.

## Evidence and coverage

| ID | Source | Method and confidence | Local evidence |
|---|---|---|---|
| B01 | [Homepage](https://www.maulirituals.com/) | Browser, rendered 1280 × 720 viewport; computed styles, DOM asset references and screenshots. High confidence for captured state. | `evidence/homepage-dom.json`, `homepage-1280.png`, `homepage-overlays-1280.png` |
| B02 | [Homepage](https://www.maulirituals.com/) | CSS viewport set to 390 × 844. DOM reported width 390 and body width 390. Screenshot capture displayed a scaled page in a wider canvas and an extra popup; unsuitable for pixel-precise mobile visual conclusions. | `evidence/homepage-390.png`; mobile values recorded in tokens |
| B03 | [Supreme Skin Face Serum](https://www.maulirituals.com/products/supreme-skin-face-serum) | Public HTML/CSS source after browser became unavailable. No claim of rendered PDP inspection. | `evidence/page-1-source.json`, `page-1-styles.css` |
| B04 | [Skincare collection](https://www.maulirituals.com/collections/skincare) | Public HTML/CSS source. No filter/hover/scroll interaction verification. | `evidence/page-2-source.json`, `page-2-styles.css` |
| B05 | [Our Story](https://www.maulirituals.com/pages/story) | Public HTML/CSS source. Editorial headings and assets inspected. | `evidence/page-4-source.json`, `page-4-styles.css` |
| B06 | [Create Your Ritual quiz](https://www.maulirituals.com/pages/create-your-ritual-quiz) | Entry points verified on homepage. Direct HTTP returned 429; quiz interior not audited and not retried. | Coverage limitation, not a finding about quiz usability |
| B07 | [Adobe kit gby1gbw](https://use.typekit.net/gby1gbw.css) | Original CSS and font binaries downloaded. | `packages/brand-assets/css`, `fonts`; `evidence/font-faces.json` |

An initial browser bundle export stalled and was interrupted. Bounded public HTTP downloads then succeeded. This limitation must travel with the audit: homepage browser proof is real; the other page types are source analysis. Session/cookie/cart data were not collected. Miscellaneous runtime and script URLs were removed from the saved browser inventory.

## Typography — three different layers

Do not identify brand typography from theme settings alone. The homepage's theme variables declare **Inter** as body and **Bodoni Moda** as heading. Its computed paragraph and button styles instead resolve to `gotham, sans-serif`; headings resolve to `ltc-caslon-pro, serif`. The product source also contains `!important` selectors explicitly applying this pairing across headings and body/UI elements. Computed CSS establishes the requested family stack, not proof that every glyph rendered from the intended binary on every device.

The primary Adobe kit defines Gotham regular 400, LTC Caslon Pro regular 400 and italic 400. A second observed kit, `bji1tmk`, declares **Adobe Caslon Pro** and additional Gotham faces. Adobe Caslon Pro and LTC Caslon Pro are separate families; do not silently interchange them. Every discovered face, weight, style, source stylesheet and URL is recorded in `evidence/font-faces.json`. Shopify Inter/Bodoni preloads and Klaviyo font declarations are retained as secondary/app declarations, not promoted into brand headline choices.

| Role | Observed desktop value | Implication |
|---|---|---|
| Intro statement h2 | LTC Caslon Pro stack, 25px/30px, 400 | Quiet editorial scale, not oversized display typography |
| Definition h4 | LTC Caslon Pro stack, 20px/24px | The definition is a deliberate typographic moment |
| Product-card h3 | LTC Caslon Pro stack, 14px/16.8px | Delicate retail hierarchy; increase for dense academic content |
| Body / small intro | Gotham stack, 13px/20.8px | Current store is compact; proposed case-study body should start at 16px |
| Ingredient description | Gotham stack, 14px/22.4px | Generous line-height compensates for small text |
| Category tabs | Gotham stack, 19px/30.4px | Navigation has more presence than product titles |
| Announcement utility | 10px/14px | Record as observed; do not treat as a legibility recommendation |

At the 390px CSS viewport, intro h2 changed to 18px and definition h4 to 16px. These are DOM measurements, not a completed mobile usability test. Header/logo type must not be inferred from `--logo-font-family`: the visible wordmark is a supplied raster asset. Hero text visible in the photograph/video treatment was not present as equivalent live heading text in the captured main DOM; do not reverse-engineer its font size from screenshot pixels or claim it is live accessible text.

## Color and material

| Audit alias | Exact value | Source / usage |
|---|---|---|
| Ink | `#512f2d` | Body, heading, primary buttons, footer text |
| Paper | `#fefefe` | Default and header background |
| Cream | `#f6f6f2` | Footer, navigation, alternate surface, button text |
| Link ink | `#51302d` | Link channels are 81/48/45, slightly different from body |
| Header ink | `#512f24` | Declared header text; preserve exact variance |
| Input boundary | `#d3caca` | Input border |
| Input hover | `#9f8c8b` | Hover border |
| Success | `#108043` | Functional success state, not a brand accent |
| Announcement dark | `#171717` | Computed announcement buttons |

The palette is predominantly neutral. Warm skin, oil, dark packaging and botanical imagery provide saturation. Do not impose a rainbow Ayurvedic taxonomy on this evidence. A future thread accent can be a clearly documented proposal, selected against the actual motion assets and contrast requirements.

Contrast should be checked on actual components: ink on cream is strong, but thin pale input borders and text over moving photography need their own verification. The screenshot shows desktop navigation over a dark hero with low apparent separation; this is a captured visual concern, not a measured whole-site WCAG failure. Transparency and moving frames prevent a single palette ratio from proving all overlays accessible.

## Grid, spacing and geometry

Observed root variables: maximum page container 1440px; reading width 720px; desktop container padding 50px; mobile gutter 16px; desktop gutter 20px; larger gutter 30px; base space unit 4px. Section scales are 50px, 80px and 110px, with larger mobile section spacing 60px. These are theme declarations, not evidence that every custom section follows one spacing system.

Buttons and theme modals declare zero corner radius. Carousel navigation has circular buttons. The captured quiz popup has its own rounded container/button treatment; do not normalize third-party component exceptions into a single official radius token. Input/button vertical padding is 13px; inputs request 16px text. Icons use 24px viewboxes with mostly 1.5px strokes, rounded ends and joins, and `currentColor`. The theme uses desktop/mobile breakpoint families around 768px, then 1000px, 1300px and 1450px in the downloaded main CSS. These are source-observed media queries, not independently tested transitions.

For the academic showcase, **proposal**: use the reading measure for arguments and sources, wider grids for paired research/prototype evidence, and large editorial whitespace between chapters. Keep financial tables visually disciplined and horizontally navigable on small screens. Do not force every deliverable into identical retail product cards.

## Identity assets and iconography

Dark and light Mauli wordmarks were discovered as PNGs, not SVG master artwork. Preserve their proportions; do not trace them and call the output an official vector master. The saved SVG collection contains actual inline UI/brand-adjacent symbols including chevrons, menu, search, account, bag, social/payment symbols and other rendered icons. Payment and platform marks are third-party assets within a third-party site and are not Mauli-owned identity elements.

Original downloaded response bytes are hashed in the manifest. Inline SVG files are DOM serializations, explicitly distinguished from byte-for-byte HTTP originals. A unique hash filename is stable provenance, not a semantic icon name. Consult the SVG markup and source before reuse. Do not add an open-source license across this folder or remove trademark attribution.

## Photography and editorial direction

The browser-captured hero uses close bodily framing and ritual movement, warm skin against dark space, wet/oiled surfaces and limited UI. Product images include isolated packs/tools against light backgrounds; editorial bundle imagery adds tactile context. The archive includes the discovered rendered-size image responses and linked-page source image references. Alternate size renditions are kept, rather than falsely described as distinct photographs. No inference of an original camera file or maximum available resolution is made.

For the student project, **proposal**: use one strong atmospheric opening, then evidence at useful scale—annotated journey captures, diagram states, measurable experiment cards, workbook views. Keep captions, date, evidence status and source close to each item. Motif continuity should come from controlled thread placement and rhythm, not repeated ornamental borders around every block.

Brand prose joins traditional Ayurvedic vocabulary with modern botanical/sensorial language. Source phrases can include product efficacy claims; their appearance is evidence of brand communication, not independent clinical substantiation. Project recommendations should explain discovery and ritual preference without diagnosis or claims that the quiz knows what a body medically needs. Cultural meaning should be attributed to Mauli's own account; identity is not a presumed shopping behavior.

## Interaction and accessibility findings

The homepage offers a direct ritual-quiz navigation link, hero-linked entry, product category tabs, quick-buy links, carousel controls, a newsletter entry and expandable footer/navigation structures. The first captured state showed **both cookie notice and quiz popup over the hero**. They were dismissed using ordinary controls for the unobstructed screenshot. This is observed competing attention, with conversion impact unmeasured.

Root scroll-animation duration is 0.6s; the stylesheet includes a reduced-motion media query. Actual timings, pause controls, focus trapping, keyboard traversal and reduced-motion behavior have not been exercised. The DOM includes a skip-to-content link and named slider controls, but many editorial/image-only links were unnamed in the snapshot. Determine whether meaningful images need text alternatives in context; an empty decorative alt alone is not a defect. The homepage heading hierarchy includes a logo h1, definition h4 and subsequent h2—worth reviewing for semantic order.

For the case study, **proposal**: splash must have a skip control and static reduced-motion state; render essential hero copy as text; downloads must remain reachable immediately; never use an animation to block reading. Maintain visible keyboard focus, useful accessible link names, minimum readable body type, and text/table equivalents for financial graphics and chord diagrams. These are implementation acceptance criteria, not claims that the existing site satisfies them.

## Asset scope and rights handoff

Read [`asset-manifest.json`](../../packages/brand-assets/asset-manifest.json) for current counts, hashes, byte lengths and exact URLs. The archive covers the homepage's observed asset inventory plus image references on the serum PDP, skincare collection and story page. It includes all discovered downloadable font representations from inspected declarations and unique homepage inline SVGs. **It is not all assets across Mauli's whole store**, not a crawl of the product catalog, and not a replacement for the brand's original asset library. Video URLs and unrelated app stylesheets are explicitly discovered-only. The quiz interior is a coverage gap due to HTTP 429.

Adobe font stylesheets include face-specific EULA URLs and copyright notices. Public accessibility is not evidence of this project's embedding or redistribution entitlement. Font files are reference captures; confirm the correct project/domain license before deploying them. The same applies to photography, logos, app icons and platform marks. A legally distinct student showcase should identify independent pro bono coursework and should not imply Mauli, Hult, a professor, Adobe or another rights holder endorsed it.

## Design handoff checklist

1. Read `tokens.json` alongside raw computed samples; avoid theme-default font confusion.
2. Choose assets by manifest source and role; keep original bytes unmodified and create derivatives separately if needed.
3. Obtain motion agent's exact thread geometry, timing, breakpoint and reduced-motion contract before selecting accent color or hero composition.
4. Revisit browser PDP, collection, story and quiz at 390/768/1280 widths when browser access is restored. Validate keyboard and reduced motion; do not fill gaps with guesses.
5. Present academic recommendations, assumptions, interim work, feedback and outcomes as distinct statuses. Do not visually imply final client approval or a grade that does not exist.

Quality here means consistency, precision of provenance and deliberate editorial choices. No award-level certification or professional brand approval is implied.
