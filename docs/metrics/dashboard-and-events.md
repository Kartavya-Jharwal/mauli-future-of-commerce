# Dashboard and event specification

10 October 2026. Design specification only: no client connection, collection or fabricated data. `metric-vault.csv` is the reusable dictionary. All values in the initial dashboard are blank with **Not supplied** status. Separate classroom demo interaction counts from live commercial reporting.

## Dashboard views

1. **Decision summary:** contribution after acquisition; matured 90-day repeat; voluntary reported practice; activation; answer accuracy. Show current period, comparable period, eligible population, completeness, owner and interpretation. A control comparison appears only when actual assignment exists.
2. **Channel and AAARRR:** paid social, organic social, search, email/CRM, direct/unknown, AI-observed referrer, spa/hotel QR, retail and referrals. Use actual known sources, keep unknown visible. Stages use consistent units within each motion; no blended person/account funnel.
3. **Economics:** net sales → COGS → fulfillment/freight → fees/commissions → variable service → acquisition → contribution; fixed operating/setup costs shown separately. Slice market, channel, new/repeat and ritual basket. Flag cost coverage and exchange-rate convention.
4. **Customers and rituals:** first-purchase cohort heatmap with immature cells grey; 30/60/90/180-day second purchase; observed contribution per buyer; ritual expansion; consented check-in response and practice distribution. Purchases and self-reported use occupy separate cards.
5. **B2B:** qualified accounts → pilot/sample → training → first commercial order → eligible reorder; account contribution, partner invoice ageing, stock availability. Sell-in and sell-through in separate tables; unavailable partner data is labelled unavailable.
6. **Discovery truth:** Search Console metrics; manual engine/prompt panel; citation/recommendation/accuracy with evidence; observed AI referrer sessions/orders. Never convert panel visibility into inferred revenue.
7. **Experience and trust:** recommendation usefulness, task completion, help handoff, factual corrections, complaints, consent withdrawal, unsubscribes, mobile/reduced-motion task success. Voice uptake is optional, not a success requirement.

Every metric card: metric ID, formula version, observed window, data-as-of timestamp, source refresh, actual/proposed status, numerator, denominator, currency, scope, missingness, attribution model, confidence/limitations and drilldown link. Rates show counts; zero denominators yield **N/A**. Small survey/account cells are aggregated or suppressed under an agreed threshold to avoid identifying participants. Avoid unsupported traffic-light targets.

## Event rules

Names below are a proposed contract, not events proven installed in the Mauli stack. Browser session events use a consent-compatible session ID; commerce truth is reconciled against server/order exports. Common safe properties: event_id, event_name, event_version, occurred_at_utc, environment (`demo`/`pilot`/`live`), consent_state, anonymous_session_id, experiment_assignment_id where applicable, channel_code, campaign_code, partner_code, device_category, locale, schema_version. Restricted operational joins are not committed publicly. No email/name/address, free-form quiz answer, raw voice recording, transcript or sensitive inference in the analytics payload.

| Event | Exact trigger | Safe specific properties | QA / interpretation |
|---|---|---|---|
| entrypoint_viewed | Campaign landing rendered | entrypoint_id, motif_variant | Rendering is not attention |
| partner_bridge_opened | Valid partner-coded landing visit | partner_code, placement_code | Filter bots/test scans; code cannot identify guest |
| motif_interacted | Deliberate click/tap on interactive thread | interaction_type, reduced_motion | Scroll/autoplay is not meaningful activation |
| quiz_started | First deliberate answer submitted | quiz_version | Once per attempt |
| quiz_step_completed | Valid next-step submitted | step_id, attempt_id | Do not send answer value |
| quiz_completed | All required answers processed | quiz_version, attempt_id | Do not call this medical diagnosis |
| recommendation_viewed | Ritual result is visible | recommendation_id, rules_version, available_sku_count | Separate from successful rendering |
| recommendation_saved | Shopper deliberately saves/copies next step | recommendation_id, save_method | Proposed D2C activation; no forced email capture |
| recommendation_feedback_submitted | Optional usefulness vote | response_category | Report response rate and non-response |
| ritual_product_selected | Deliberate chosen SKU | sku_id, ritual_id | Not purchase or practice |
| add_to_cart | Confirmed cart modification | sku_id, quantity, cart_reference | Avoid double counting embedded/custom events |
| checkout_started | Checkout session begins | checkout_reference | Platform integration must be verified |
| purchase_confirmed | Valid paid order reconciled | restricted_order_reference, currency, net_merchandise_value | One event per order; restricted reference never public |
| refund_reconciled | Final refund recorded | restricted_order_reference, refund_reference, value | Order ledger is authoritative |
| voice_session_started | User explicitly opts into voice | voice_mode, vendor_version | No microphone permission inferred |
| voice_handoff_requested | User requests human/text route | reason_category | Do not export conversation content |
| support_resolved | Agent/staff marks resolved with agreed criteria | resolution_category, support_mode | Silent abandonment is not resolution |
| ritual_checkin_submitted | Voluntary check-in completed | survey_version | Store actual responses privately; aggregate only |
| referral_link_used | Referral-coded landing visit | referral_campaign | No customer-identifying referral code publicly |
| b2b_inquiry_received | Account inquiry logged | account_segment_code | Operational account ID private |
| b2b_qualified | Documented fit and explicit next step | qualification_rule_version | Rejected/unknown kept visible |
| b2b_pilot_started | Agreed sample/training/pilot begins | pilot_type, cohort_month | Free sample separate from sales |
| b2b_order_confirmed | Commercial invoice/order confirmed | order_type, net_value, currency | Sell-in event only |
| b2b_sellthrough_reported | Partner provides end-customer units | reporting_period, reporting_basis | Guest treatment use and retail sale differ |

## QA before interpretation

Check consent-off behavior; duplicate purchase events; refresh/back navigation; currency/refund reconciliation; mobile and keyboard navigation; reduced motion; stock mismatch; missing partner codes; timezone boundaries; idempotency; late-arriving transactions. Confirm the current quiz supplier's export and event capabilities before claiming the old/new quiz can be joined. Rerun QA only when event implementation changes. Ledger discrepancies must resolve before showing conversion/revenue impact.
