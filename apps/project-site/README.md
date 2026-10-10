# Project showcase

This workspace contains the implemented static public showcase: `index.html`, `styles.css` and `app.js`. It uses no framework or dependencies, no external fonts and no third-party photography. Original geometric thread artwork connects the editorial sections.

The initial release is an in-progress case study. See [site scope](../../docs/website/site-scope.md) and [motion integration](../../docs/website/motion-integration.md). The custom splash and body SVG effect will be supplied separately. All seven team members use placeholders for now, as requested.

`content/project.json` records ordered sections, deliverable availability, future feedback/grade states and team placeholders. Page copy is authored in HTML; future content changes should keep the manifest aligned. The release build copies the available original client PDF to `downloads/client-brief.pdf`, along with the parent-owned favicon and sharing illustration. It does not ship the brand research asset archive or restricted Foresight workbooks.

Deployment target: [GitHub Pages showcase](https://kartavya.tech/mauli-future-of-commerce/). The repository workflow builds and deploys the site; a successful Pages run and live checks confirm a release, rather than this target URL alone.

Reading, anchors and downloads work without JavaScript. The optional static thread introduction is opened by a footer button only when accessible dialog support is present; it can be closed with its Enter button or Escape and restores focus. Direct links never wait for an introduction. The custom splash and body motion exports remain pending. The explanatory chord drawing is a concept sketch, not a working recommendation interface.

Responsive layouts include mobile reading order, visible keyboard focus, a skip link and reduced-motion support. Deck/report, prototype, feedback, assessment and all seven team identities remain explicitly pending until supplied.
