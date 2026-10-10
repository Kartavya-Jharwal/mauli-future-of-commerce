# SEO, AEO and GEO answer audit

Proposed protocol, 10 October 2026. No audit has been run by this metrics workstream. Supplied `Mauli Rituals.md` contains a one-run exploratory audit; its own lines 239–243 acknowledge variability. Retain it as exploratory evidence, not a durable baseline. The team reports Mauli named in 6/10 Gemini answers and 7/10 ChatGPT answers, with all five checkable ChatGPT prices correct. These are team-reported observations from ten questions at default settings with one run per assistant; the metrics workstream has neither rerun nor independently verified them, and underlying raw captures were not supplied. Prices and answers in the report must not be treated as current facts. Mention frequency is not necessarily citation or recommendation frequency.

## Three measurements to keep separate

**SEO performance:** verified-property Search Console impressions, clicks, CTR and average position, split brand/nonbrand, query family, page, country and device. Position is a reported aggregate, not a fixed rank. Country is geographic reporting, not inferred identity.

**AEO/GEO answer presence:** a controlled manual panel that observes whether a brand is mentioned, recommended and cited, and whether a specific answer is factually correct. Its denominator is completed prompt-engine observations, not consumers or category market share.

**Attributed site outcomes:** observed AI-domain referrers and declared discovery responses. A citation may yield no click; a click may lack a referrer; a purchase may cross device or occur later. Do not interpret panel recommendation rate as click-through, traffic or revenue. Branded search lift is a supporting observation, not AI-caused conversion.

[M04 Google Search Central](https://developers.google.com/search/docs/appearance/ai-features) says AI-feature site performance is included in Search Console's Web search reporting. Check what is actually available in the client's property before designing any feature-specific split. Do not promise a universal AI visibility API or manufacture an AI-only Google referral segment. Google also says standard SEO principles apply and special AI markup/files are not necessary; `llms.txt` is not a guaranteed citation fix. Crawlers for search and model training have different purposes: review controls explicitly before changes.

## Reproducible proposed panel

Start with a small fixed, feasible panel: 12 nonbranded prompts across 3 query families (4 discovery, 4 ritual-selection, 4 high-intent product/stock questions), plus 4 branded fact-check prompts. Run on each accessible engine with actual engine/mode/version recorded; do not claim coverage of unavailable engines. Repeat each prompt in a fresh session twice per monthly audit, randomizing prompt order. Panel size is a proposed research design, not measured volume or a platform benchmark. Record any model limit or access failure; no paid/API calls are required.

Candidate prompts must be reviewed against live product claims: premium Ayurvedic evening ritual; simple body-care ritual for limited time; meaningful wellness gift with explained heritage; Ayurvedic hair oil options in the UK; Mauli product price and stock; where to find Mauli in London; what the Mauli thread represents; whether Mauli recommendations are health advice. Do not write prompts designed to guarantee Mauli's inclusion. Freeze wording before comparison, preserve a dated panel version and include brand-neutral alternatives.

Audit dimensions: run_id; prompt_id; panel_version; exact prompt; timestamp UTC; engine; displayed model/mode; locale; approximate market; language; logged-in/out; fresh-session flag; personalization state where known; repeat_number; response evidence path; availability/failure; brand_mentioned; brand_recommended; owned_url_cited; third_party_url_cited; competitor set; supported ranking position if explicitly ranked; answer claims; claim accuracy; uncertainty; reviewer and adjudicator. Save observed citations and screenshots/transcripts permitted by the surface; public copies omit account identifiers.

Use separate definitions:

- Mention rate = observations naming Mauli / valid completed category observations.
- Recommendation rate = observations explicitly recommending Mauli / valid completed category observations. Do not assume any mention is endorsement.
- Owned citation rate = observations linking to a verified Mauli-owned URL / valid completed observations. Third-party mention/citation is separate.
- Share of observed brand mentions = Mauli brand occurrences / all brand occurrences under a predeclared counting rule; report per engine and family. It is not market share or universal "share of agent mind".
- Claim accuracy = correct assessable claims / assessable claims checked against dated authoritative facts. Count unverifiable separately, not as correct. For price/stock retain live-check timestamp and currency; not every answer surfaces such facts.
- Unsupported health claim incidence = observations making unsupported health assertions / reviewed brand-related observations. Correctness is not clinical efficacy.
- Citation drift = 1 minus Jaccard overlap of citation URL sets for a matched prompt-engine pair at two periods; both empty yields N/A. Canonicalize URLs and report small-set instability. Aggregate matched-pair results, keeping missing pairs visible.

No "top five" assumption when an engine gives an unranked list. Show raw numerator/denominator plus within-run repeat disagreement. A panel is directional; variation by prompts, retrieval, locale, personalization and model version prevents extrapolation to all shoppers. Annotate changes; historical results remain associated with the old version. Improved presence cannot establish content-change causality without a stronger design.

## Referrers and surveys

Maintain a dated observed-domain allowlist; include only actual traffic that analytics exposes, not a hardcoded assertion that every AI domain passes referral. Keep unknown/direct. Deduplicate commerce through the order ledger. Optional discovery survey: "Where did you first hear about Mauli?" with AI assistant, search, social, partner/spa, friend, other and prefer not to say; offer a separate optional assistant name. Store counts and response bias; do not replace transaction attribution with survey recall.

Lecture deck provenance: `AEO_GEO_DeepDive_FutureOfCommerce.pptx`, slides 14 (measurement) and 16 (sprint). Deck evidence grades and estimates remain instructional context. The present audit corrects possible conflation between recommendation, citation, actual traffic and causality.
