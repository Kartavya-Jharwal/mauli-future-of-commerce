# Public project showcase: scope and launch contract

Status: scoped for an **in-progress case study**, 10 October 2026. This document defines the website and its first release. It is not a claim that a hosted website or final visual design is complete. The public GitHub repository is separate from the future hosted showcase.

## Purpose and audience

Give the client, professor, peers and prospective collaborators a clear account of the team's pro bono advisory work: the problem, evidence, decisions, prototypes and recommendations. Put the actual deliverables within immediate reach. Readers should understand the team's contribution without mistaking this for Mauli's shop or corporate website.

Primary actions: download the current deliverables; understand the recommendation; explore the prototype when available; contact the team. The site is a project case study, with the existing commerce platform as the subject of the advice.

## Page sequence

| Order / anchor | Section | Reader's question | Content and composition | Initial state |
| --- | --- | --- | --- | --- |
| 0 | Splash | Where am I? | Custom motion supplied separately, followed by the case study; visible Skip/Enter; direct anchors bypass it | Reserved integration point; page is usable without it |
| 1 / `top` | Hero | What is this project? | Large editorial title; short project thesis; Future of Commerce / Hult context; pro bono advisory; work-in-progress label and updated date | Draft copy available |
| 2 / `downloads` | Downloads | Can I read the work? | Three direct document rows: presentation deck, report, client briefing; format, version, date and size; Preview secondary to Download | Client briefing available; final team report/deck forthcoming |
| 3 / `problem` | The problem | What are we trying to solve? | Brand relevance and personal guidance as discovery changes; existing Shopify foundation; evidence attached to claims | Source-supported working diagnosis |
| 4 / `process` | Our process | How did you arrive at the work? | Briefing, audit, segmentation, economic model, prototype and validation as actual dated stages | Completed and planned stages distinguished |
| 5 / `insights` | Marketing insights | What did the research change? | Channel mix; B2B and D2C activation; ICP jobs; ritual and cultural relevance; SEO/AEO/GEO; each insight leads to a decision | First research pass, reported baseline caveats visible |
| 6 / `prototyping` | Prototyping | What did you try and learn? | Current journey versus proposed interaction; sketches/tests when available; thread, onboarding and chord concept; captions explain decisions | Concepts scoped; tests have not been conducted |
| 7 / `showcase` | Final showcase | What does the proposed experience feel like? | One large demo stage; poster/recorded fallback; controls; full-screen optional; version and prototype status | Visible forthcoming section; no fake interactive demo |
| 8 / `recommendations` | Recommendations | What should Mauli do next? | Immediate, short and longer horizons with ownership, cost drivers, outcome metrics and dependencies | Working recommendations, not implemented outcomes |
| 9 / `feedback` | Client and professor feedback | How was the work received? | Attributed quote or clearly labelled team paraphrase; date and context | Awaiting feedback; no invented quote or score |
| 10 / `outcomes` | Grade and what's next | What happened and what continues? | Grade only when supplied; project learnings and next experiment; archive of revisions | Grade pending; next steps can be published now |
| 11 / `team` | Team and contact | Who did the work? | Seven consistently presented member slots; contributions and LinkedIn links when confirmed | All names, roles and links are placeholders at user request |
| 12 | Footer and attribution | Who owns this site and the material? | Course/project credits; source repository; accessibility/contact route once known; concise independence and rights text | Draft attribution available |

The order is intentional. Downloads remain directly after the hero even when an animated introduction is present. On mobile, retain reading order and avoid horizontal document carousels.

## Navigation and visitor paths

Use a quiet project header with Overview, Research, Prototype, Recommendations, Team and a prominent Documents link. Keep the entire narrative on one page initially; anchors are stable and shareable. Long source tables, workbooks and appendices open as separate documents. A reader arriving at `#downloads` or `#showcase` should land there immediately, without replaying the splash.

Desktop composition can vary between full-width imagery, narrow reading columns, wide evidence rows and a dedicated prototype stage. Avoid repeating identical cards for every section. Use section numbers and concise captions to communicate sequence. Any body stroke is decorative orientation; navigation and content must work when it is absent.

## Initial content and publication states

Use `draft`, `available`, `forthcoming`, `awaiting_feedback` and `archived` states in the content manifest. Do not equate a file in the repository with an approved final download. The original brand retailer deck must not be labelled as the team's final presentation. The working Markdown brief is supporting work and must not masquerade as the final four-page submission.

The first release can expose the client briefing download, a concise working case-study narrative, the research summary, the proposed recommendation and next steps. Keep unavailable files as plain status rows rather than disabled controls or dead links. Feedback and grade sections can be short until real input arrives. Team labels are placeholders; no guessed LinkedIn profiles.

## Visual direction to develop

The design should show the care of a crafted editorial case study: deliberate typography, controlled line lengths, strong image cropping, precise spacing and a restrained use of the connecting thread. The brand audit defines observed Mauli tokens and assets. The showcase's own semantic tokens should distinguish project authorship while relating to the brand. Do not claim a design-agency affiliation or use award language as evidence of quality.

Detailed colour, type and image choices will follow the saved brand audit. Font files require provenance and an understood use permission before deployment. Source assets can remain in the research archive even when the site chooses a licensed alternative. Do not let large type, low-contrast heritage colours or animation make the work hard to read.

## Build boundary

Start with a static, responsive page in `apps/project-site`, with content kept in `content/project.json`. No sign-in, cart, live customer database or visitor-upload flow is needed. Later prototype integration can use a separate route or a constrained embedded experience. Site-specific assets must be copied from the audited asset library through an explicit build manifest, rather than shipping the entire archive.

The visual build and hosting follow the scope. The splash and body effect arrive through separate integration contracts. Do not import the separate motion repository's Git history or dependencies without inspecting its exported artifact.

## Release acceptance

- Every visible download resolves to the advertised file, and the original client brief matches the archived source.
- All team links are real confirmed profiles before becoming active; all feedback is attributed and supplied.
- Reading, navigation and downloads work without JavaScript and with reduced motion.
- Mobile at 360 px and desktop layouts have no clipped text or required horizontal scroll.
- Splash skip works immediately; focus returns to the page; deep links and browser Back remain predictable.
- Prototype state and illustrative assumptions are clear. Financial model scenarios are not presented as results achieved by the client.
- Keyboard focus is visible, headings are sequential, contrast is checked, and images receive appropriate alternative text.
- Large media and the prototype load only when needed. The hero and downloads do not wait for a motion bundle.
- Page title, description, favicon, sharing image and canonical URL describe the student project accurately.
- Hosting is public only after the assembled initial release is checked. A GitHub repository URL is never described as a live website URL.

## Remaining inputs

Custom splash export and usage instructions; body SVG effect export; final chord explanation; final deck/report; client/professor feedback; future grade; seven member names/contributions/LinkedIn links; preferred public site title/domain. Placeholders are intentional until these arrive.
