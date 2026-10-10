# Client data request and baseline reconciliation

10 October 2026. Request design only; no customer data has been requested or received by this workstream. Public repo contains methodology and blank templates. Keep client personal data, credentials, raw quiz/voice content and join keys outside the public repository. Prefer aggregate exports; pseudonymized records remain restricted, not automatically anonymous.

## Source reconciliation ledger

| Claim | Supplied source and locator | What can be said now | What is missing |
|---|---|---|---|
| £87 AOV; sometimes £100+ | Challenge brief PDF page 3 and page 9 cheat-sheet; repeated in student dossier | Instructor synthesis of client information, unaudited | Date range; gross/net basis; currency; included orders and markets |
| D2C 61%; spa/retail/amenities 39% | Challenge brief PDF page 3 and page 10; working notes | Reported channel mix | Revenue/order/customer basis; period; geography; separate B2B contributions |
| 46% new / 54% existing | Challenge brief PDF page 4 and page 9 | Reported acquisition/customer mix with ambiguous denominator | Whether buyers, orders or revenue; new/existing rule; period. Student notes calling 54% revenue share conflict with this wording |
| Newsletter 77% opens | Challenge brief PDF page 4 and page 9 | Reported email open rate | Platform; period; campaigns vs flows; unique denominator; machine-open filtering |
| ~72% Meta / 28% Google | Challenge brief PDF page 4 and page 9 | Reported paid marketing allocation | Spend basis; period; whether all marketing or paid media only; reconcile differing team-note percentages |
| First order barely breaks even | Challenge brief PDF page 7; cheat-sheet page 9 | Qualitative client-synthesis economics claim | Complete cost stack; acquisition allocation; discount and refund treatment |
| Retailer 65% margin plus 10–15% marketing and free product | Challenge brief PDF page 7 | Reported retailer economics, not Mauli's own gross margin | Contract basis; VAT; wholesale terms; fees and gifts cost; account-level reconciliation |

The PDF is an instructor synthesis of founder Q&A and provided deck, not a raw audited export or verbatim transcript. Citation should describe that evidence level. These are supplied baseline claims awaiting reconciliation, not independently verified public KPI disclosures. No fabricated current target or conversion rate.

## Priority 0: clarify before numbers enter the pitch

Ask for reporting period and definitions behind the ledger above; exact current Shopify/CRM/quiz reporting capability; existing journey/segmentation status; high-level channel costs and team operating limits; confirmation that any requested export can be shared for this coursework. Request 12–18 months of monthly aggregate history where feasible to expose seasonality; do not demand granular personal records by default.

## Priority 1: aggregate decision baseline

| Dataset | Minimal fields | Purpose |
|---|---|---|
| Monthly sales | Month; market; D2C/B2B/retail motion; gross merchandise; discounts; merchandise refunds; tax separately; shipping income; valid orders; first/returning buyer counts | Reconcile mix and economics |
| Cost summary | Month or effective date; SKU/category; COGS coverage; packaging; fulfillment; freight; payment fees; commission; variable support; fixed costs separately | Contribution bridge and missingness |
| Paid/owned channel | Month; source; spend; attribution model/lookback; attributed new buyers; net revenue; delivered email; clicks; unsubscribes | CAC with model caveats; no summed vendor claims |
| Cohort table | First purchase month; cohort size; fully observed 30/60/90/180-day buyer counts; repeat buyers at each interval; net revenue and contribution per eligible buyer | Matured retention without personal records |
| Quiz/journey | Month; starts; completions; result views; saved recommendation; eligibility; assignment counts if any; integration capability | Assess actual activation instrumentation |
| B2B aggregate | Segment; inquiry/qualified/pilot/first-order/reorder counts; agreed maturation interval; net revenue; variable cost; overdue balance | Account economics and feasible partner testing |
| Partner distribution | Partner segment/code; placement; period; aggregate guest exposure if reliably known; scans; measurable visits; consented activation; sell-in; optional sell-through | Hospitality-to-owned bridge; denominators kept separate |
| Discovery | Search Console export with date/query family/page/country/device/clicks/impressions; analytics referrer aggregates; declared survey counts | SEO and observed AI referrals |

## Priority 2: restricted joins only if aggregates cannot answer

Client-generated opaque order/customer/account IDs; order and first-purchase dates; SKU and quantity; retained value; currency; refunds; cost-effective date; campaign/partner code; experiment assignment and event timestamps. Use consistent IDs within a restricted workspace and publish only aggregates. Do not request emails, names, addresses, birthdays, health history, ethnicity, religion, full IP, payment details, voice recordings or free-text dosha answers. General region and expressed non-sensitive preference are sufficient for initial work. Agree access, retention and deletion before transfer. Customer-ID joins do not belong in Git even if the user permits internal coursework documents publicly.

## Blank export conventions

One row per declared grain. Dates ISO-8601; currency explicit; timezone UTC with business reporting timezone Europe/London; unknown values blank plus missing_reason; zero only for an observed zero; source_as_of and definition_version on every table. Provide row counts and totals for reconciliation. Public examples use clearly fictional data only if needed, never mixed with real reported claims. This workstream ships no synthetic baseline numbers.
