# Thread, ritual discovery and recommendation MVP

Status: implementation brief for a future coursework prototype; no live integration built or deployed in this foundation.

## Brand anchor

The supplied August 2026 retailer deck, page 3, describes the sacred red thread as a symbol of protection, connection and wellbeing and says secondary packaging contains it. This provides a direct brand rationale for a connecting thread through discovery, recommendation and return. Confirm the brand's preferred name and presentation of the Kautuka/mauli motif before final design. Use movement to orient the audience, with a reduced-motion equivalent and no reliance on colour alone.

## Minimum useful demonstration

Entry point with a short thread animation; choice of a practical goal such as a hair-care or evening self-care routine; a small set of voluntary preference questions; a circular chord visualization linking selected goals, ritual steps and reviewed product ingredients; and a concise recommendation with an explanation and an optional starter product. Provide a text/list equivalent of the circular visualization and allow back, skip and change-answer actions.

The later explanatory input from the owner will define chord nodes, notes and Ayurvedic mappings. Until then, botanical associations are illustrative, never inferred therapeutic evidence. Do not label a simple scoring result as a diagnosis, clinical confidence or a calibrated probability.

## Recommendation contract

- Return a ritual name, simple sequence, reason tied to volunteered preferences and reviewed content sources.
- Show a smaller starter option. A compulsory multi-product basket would conflict with useful guidance and affordability.
- Filter products on catalog eligibility and current stock only when real inventory is connected; otherwise label demonstration inventory clearly.
- Keep fit and user constraints ahead of margin. Commercial tie-breaks among equally suitable choices must be documented rather than hidden behind wellness explanations.
- Ask only what is needed. Avoid capturing clinical history in the coursework demo; provide a path to human support for questions beyond product guidance.
- Log recommendation version and interaction events with synthetic session identifiers in the demo. Do not save raw voice or customer health disclosures.

## Architecture for coursework

`apps/ritual-demo` is the future interaction surface. `packages/recommendation-engine` will hold deterministic, inspectable rules and fixtures; `packages/ritual-content` will hold reviewed content and provenance; `packages/thread-motion` can contain the motif; `packages/event-contracts` can share measurement definitions. These are reserved boundaries, not implemented packages.

Start with fixture content and offline rules, then test the customer experience before selecting paid AI services. This avoids treating the aspirational PRD as an implementation requirement. Its neural classifier, fine-tuning, inventory negotiation, spatial/native UI and sub-50 ms claims have no validation in the supplied files. Use an actual usability/latency measurement once an interaction exists.

## Shopify and voice feasibility

Shopify Winter '26 is a useful inspiration reference, but it is not the latest verified edition as of this review: an official Spring '26 page is also available. Evaluate individual features using current help documentation and the client's admin eligibility rather than edition headlines. The current Agentic Storefronts help page differentiates ChatGPT referral checkout from direct-checkout options in other channels; do not promise identical in-chat checkout everywhere. Mauli's eligibility and enabled channels remain unknown. [Current Shopify help](https://help.shopify.com/en/manual/online-sales-channels/agentic-storefronts), [Spring '26](https://www.shopify.com/editions/spring2026), [Winter '26](https://www.shopify.com/editions/winter2026). Accessed 10 October 2026.

ElevenLabs documents an embeddable multimodal widget and custom SDK approaches. That supports a voice-interface feasibility hypothesis, not demonstrated Mauli integration. Decide agent setup, reviewed knowledge, optional text mode, domain controls, usage cost and Shopify app/theme insertion only after the current journey audit. The widget documentation describes public-agent requirements and allowed-domain configuration. No account, agent, API key or billable request has been created. [ElevenLabs widget documentation](https://elevenlabs.io/docs/eleven-agents/customization/widget), accessed 10 October 2026.

## Acceptance criteria for the later build

Participants can find and change a recommendation, explain its reason, and reach the product handoff; keyboard and reduced-motion users receive equivalent information; recommendations disclose demonstration content and respect preferences; no invented health claim or unsupported confidence score appears; and measurement events match the shared taxonomy. Compare the chord view with a simpler list to test whether it aids understanding. Revisit voice if it improves the experience without adding abandonment or unacceptable cost.
