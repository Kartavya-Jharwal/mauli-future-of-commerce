# Measurement plan — Mauli Rituals

Prepared 10 October 2026. Status: proposed measurement design; no connected Mauli analytics, financial exports, customer records or verified operational baseline. This is an incremental Shopify/CRM/partner campaign framework, not a store replacement. Metric owners are proposed roles until the seven-person team assigns names.

## The decision this should support

Does the connective thread / ritual profile make discovery more faithful to Mauli, help a shopper choose a useful ritual, and produce profitable repeat relationships without weakening cultural meaning or adding friction? The pitch should foreground three outcomes: contribution after acquisition, matured 90-day repeat purchase, and voluntary reported ritual practice. Visibility and quiz completion explain changes; they do not substitute for those outcomes.

## Evidence already in supplied working material

These are supplied-source claims, not independently verified public KPIs or audited dashboard values. The instructor-synthesized challenge brief PDF reports £87 AOV and D2C 61% (page 3), 46% new / 54% existing under an acquisition-mix label, 77% newsletter opens and approximately 72% Meta / 28% Google allocation (page 4; reiterated pages 9–10). Team notes instead interpret the 54% as existing-customer revenue share. Preserve this conflict: the customer/order/revenue denominator is unresolved, and neither wording establishes matured repeat-purchase conversion. Reporting period, geography, net/gross basis and underlying exports remain unknown. See `data-request-and-baseline.md` for the reconciliation ledger. Newsletter opens are a supporting delivery signal, not evidence of attention or conversion. First-order break-even is a qualitative synthesis claim, not an established CAC or margin figure. Retail economics refer to the retailer's margin demand, not a verified Mauli gross margin.

Use **ritual expansion purchase rate** for buying a second ritual step. Purchasing cannot establish that someone performed a ritual. The AEO/GEO deck slide 14 supplies useful answer-audit ideas but vendor statistics, an illustrative ranking rule and causal language require separate verification; none is a Mauli baseline.

## AAARRR across two commercial motions

| Stage | D2C observable event | B2B observable event | Denominator and interpretation |
|---|---|---|---|
| Awareness | Eligible campaign reach; brand/search panel exposure | Named target account reached via event, referral or outreach | Platform reach cannot be deduplicated across channels without appropriate data |
| Acquisition | Consented measurable site session; partner QR visit | Account inquiry or accepted meeting | A visitor, session, person and account are different units |
| Activation | Shopper saves a useful ritual / chooses a next step after seeing the recommendation | Qualified account agrees a sample/training/pilot next step | Quiz completion alone is a process metric; define activation before testing |
| Retention | Second valid purchase within a matured interval; reported practice | Eligible account reorder or renewal | Repeat order is not use; wholesale reorder is not guest sell-through |
| Revenue | Net sales; contribution after variable cost and acquisition | Net wholesale sales; account contribution; cash collected | Sales are not cash; contribution is not net profit |
| Referral | Valid referred buyer purchase; explicit sharing | Partner-introduced qualified account or consented guest acquisition | Track introductions and resulting outcomes separately |

Activation definitions are hypotheses. During user testing, ask whether the saved ritual was understandable, relevant and feasible. Select the smallest event that captures meaningful progress; do not force account creation to inflate activation.

## Accounting and cohort rules

- Valid purchase: paid, non-test order with positive retained merchandise value after cancellations/refunds; treat replacements and zero-value samples separately. Define whether partially refunded purchases qualify and retain an audit trail. Exclude fully refunded orders from customer-purchase qualification after a stated reconciliation window.
- Net merchandise sales: gross merchandise value minus merchandise discounts and returns/refunds, excluding tax and shipping. Never deduct a refund twice. Revenue including shipping can be a separate reconciled field.
- Contribution before acquisition: net merchandise sales plus retained shipping income minus COGS, pick/pack, packaging, outbound and return freight, payment/platform transaction fees, partner/affiliate commissions, variable samples, and per-use support/voice costs. Classify costs once. Report missing cost coverage rather than assume zero. Fixed salaries, overhead and ongoing fixed software fees remain a separate operating-cost bridge.
- Contribution after acquisition: previous contribution minus assigned acquisition spend; separately show fully loaded pilot economics including setup/design and fixed operating costs. Shopify gross-profit reports are not this contribution metric. Cost-at-sale completeness is necessary [M02].
- Blended acquisition CAC: acquisition-designated spend / acquired first-time valid buyers over the same period. Keep paid-channel attributed CAC separately, documenting attribution model, lookback and spend allocation. Without allocation, total marketing / new buyers is a proxy, not a causal CAC. Platform-attributed ROAS does not establish incremental return [M03].
- Cohort: first valid purchase month, channel, market and optional consented non-sensitive preference. For 90-day repeat, include only buyers whose first order date is at least 90 days before the analysis cutoff; numerator is buyers with a subsequent valid order within 90 days. Recent cohorts are **immature**, not zero retention. For 30/60/180 days apply the same maturity rule.
- Distinguish cumulative second-purchase conversion from purchases in a specific cohort month and calendar-period returning-customer share. Shopify reports may use entire customer history and its cohort configuration must be inspected before comparison [M01].
- Observed 180-day value is not lifetime value. Report observed net revenue and contribution per eligible buyer; do not extrapolate lifetime or use revenue-based LTV:CAC against contribution economics.
- Time to second purchase: report observed distribution with unresolved buyers right-censored; a median of repeat buyers alone has selection bias. If a survival estimate cannot be supported, label the statistic explicitly.
- Returns/complaint-free rate requires a fixed matured post-delivery window and visible support-channel coverage. It cannot prove satisfaction, absence of harm, or actual ritual use.

## Ritual and cultural measures

Offer a voluntary brief check-in: "In the last seven days, on how many days did you use this ritual?" and "Did the explanation feel respectful and clear?" Track respondent practice days, invite response rate, feasibility, understanding and open feedback separately. Respondents are self-selected; show count and missingness. Do not infer dosha, health benefit, religious practice, ethnicity or identity from purchases, names, accents or postcode. No medical efficacy KPI. Dosha answers and voice transcripts are not public analytics material.

For London community or diaspora hypotheses, recruit by self-expressed interest in Ayurveda/heritage and context, not ethnic inference. Heritage connection is optional, purpose-specific and not necessary for service. Use consented qualitative interviews and aggregate reporting; the user phrase "ABCD" is not an audience label for customer-facing research. The thread motif should be tested for comprehension and respectful meaning, not only engagement. Ask what it means to the participant rather than assign an interpretation.

## Immediate, short and long horizons

| Horizon | Work | Evidence to decide continuation |
|---|---|---|
| Immediate: coursework and first month | Reconcile source claims; request minimal aggregate extracts; create baseline; instrument a local quiz/thread demo; test comprehension | Coverage, event QA, qualitative task success; no commercial impact claim from demo clicks |
| Short: roughly 1–3 months after client approval | Test one ritual/profile journey and one partner QR bridge; retain Shopify; manual answer panel | Activation and contribution signal; 30/60-day repeat only when mature; complaint/unsubscribe guardrails |
| Longer: 3–12 months | Review matured 90/180-day cohorts; partner reorder and sell-through where provided; expand only supported journeys | Incremental contribution, repeat, experience and staff burden; persistent answer accuracy |

These are planning windows, not promised delivery dates or performance targets. Actual targets follow a reconciled baseline, budget, minimum detectable effect and brand guardrails.

## Pilot evaluation

Pre-register the eligible population, exclusion rules, one primary metric, assignment unit, intervention duration, cost treatment and guardrails. Randomize eligible customers where operationally possible, retain assignment even when they ignore the flow, and analyze intention-to-treat. Avoid contamination between pilot and control; account-level randomization may suit B2B, where sample size may be too small for causal conclusions. Report numerator, denominator, difference, uncertainty and matured coverage. No repeated peeking until significance. If randomization is infeasible, use comparable prior cohorts and annotate seasonality, stock, discounting and channel changes; call the result observational. Do not attribute a sales increase to AI because it followed a new feature.

## Operating cadence

Daily during a live pilot: instrument failures and factual/safety incidents. Weekly: activation, spend, cost coverage, friction and answer audit. Monthly: reconciled contribution and partner activity. At cohort maturity: 30/60/90/180-day outcome readout. All dashboard values start as **not supplied**, not zero; all targets start as **to agree after baseline**.

Sources: [M01 Shopify customer reports](https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/report-types/default-reports/customers-reports), [M02 Shopify profit reports](https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/report-types/default-reports/profit-reports), [M03 Shopify marketing reports](https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/report-types/default-reports/marketing-reports). Metric definitions above are proposed project specifications unless explicitly identified as platform documentation.
