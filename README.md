# Mauli Rituals — Future of Commerce

An independent, pro bono student advisory project exploring the long-term relevance, adaptability and commercial sustainability of Mauli Rituals. Prepared for Hult Business School's Future of Commerce coursework; the course instructor is identified by the project owner as Professor Nikhil Soi. This repository is not an official Mauli Rituals or Hult publication and does not imply endorsement.

## Working direction

Strengthen the existing commerce experience through feasible, incremental marketing and Shopify improvements. The project is not a proposal to replace the store or a turnaround or new-market mandate. Assess immediate, short-term and longer-term opportunities separately, including costs, implementation dependencies and measurable outcomes.

The project owner leads metrics, AI and the technical MVP. Proposed concepts include a Kautuka thread motif, an exploratory dosha onboarding and recommendation experience, and a voice-led apothecary interaction. These are hypotheses and prototypes until validated, not approved client deliverables or medical advice.

## Repository map

| Location | Purpose |
| --- | --- |
| Original files at the repository root | Supplied client, course, team and personal inputs, preserved under their original filenames |
| `docs/governance/` | Scope, workstreams and publication rules |
| `docs/templates/` | Reusable research, source, experiment and decision records |
| `docs/inputs/` | Searchable extracts and a hashed inventory of all 17 supplied files |
| `docs/research/` | Channel/funnel research, STP/ICPs, sources and research backlog |
| `docs/metrics/` | Measurement definitions, metric vault, event taxonomy and dashboard specification |
| `docs/strategy/` | Execution roadmap and coursework pitch structure |
| `docs/mvp/` | Thread, chord diagram and recommendation experience brief |
| `apps/` | Coursework prototypes and demonstrations |
| `packages/` | Shared prototype code and reusable assets |

This is a lightweight monorepo foundation. The package manifest defines workspace boundaries; no application framework or dependencies are selected yet.

Start execution with [the roadmap](docs/strategy/execution-roadmap.md), [MVP scope](docs/mvp/experience-and-feasibility.md) and [research backlog](docs/research/research-backlog.md). Original source files and their text extracts remain evidence inputs, not settled recommendations.

Use [the master index](docs/index.md) to navigate the research and metrics. Run `python scripts/validate_repository.py` to check input hashes, document links and CSV structure; refreshing extraction additionally requires `pypdf`.

## GitHub publication

Git is initialized locally on `main`. Public publication was requested, including the supplied internal documents. GitHub creation is blocked by an invalid saved GitHub CLI credential; no remote URL exists yet. After restoring GitHub authentication, create the repository with `gh repo create mauli-future-of-commerce --public --source . --remote origin --push` from this folder. This command publishes the committed files to the authenticated account. No credentials should be added to this repository.

## Evidence discipline

Keep supplied material, verified public evidence, interpretation and proposals distinguishable. Cite the specific source and access date for factual claims. A number in a client deck is a supplied assertion unless independently verified. Missing customer, revenue or retention data must remain unknown: do not invent a baseline. Proposed targets need a named assumption and a validation plan.

Use AAARRR as Awareness, Acquisition, Activation, Retention, Revenue and Referral, while documenting the event definitions used in each channel. Analyze D2C customer psychographics and B2B account firmographics separately. Link recommendations to funnel events, segments, economics and cultural or ritual relevance.

## Collaboration

Start with [the charter](docs/governance/project-charter.md), [workstreams](docs/governance/team-workstreams.md) and [publication policy](docs/governance/publication-policy.md). Each workstream should produce source-linked findings, explicit uncertainties and a practical next step. Prototype work stays within the marketing coursework scope.

The project owner explicitly authorized publication of the supplied internal inputs in this public repository. That authorization is distinct from a copyright license: client brands, course material and other third-party assets retain their respective rights. No blanket license is applied.
