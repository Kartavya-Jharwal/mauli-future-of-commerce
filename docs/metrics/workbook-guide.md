# Customer economics workbook

Deliverable: [editable Excel workbook](../../models/customer-economics/mauli-customer-economics.xlsx). Created 10 October 2026 for independent student advisory work. All client actuals remain blank; `Not supplied` is intentional. No customer-level personal records or invented client results are included.

## Monthly workflow

1. Reconcile an aggregate order and cost export with the client finance/commerce owner. Convert currencies to GBP upstream and retain the conversion basis. Sales exclude VAT and reflect discounts and refunds. Enter confirmed zeros; leave unknown costs blank.
2. Populate **Monthly economics** with one calendar month × D2C/B2B motion × mutually exclusive acquisition channel. Each customer or buying account belongs to exactly one channel under a documented first-acquisition assignment. Include direct/unknown and allocate shared acquisition spend once. New customers plus returning customers must equal active purchasers. B2B counts buying accounts, not individual contacts.
3. Mark each complete source row `Yes`, retain source/export date and owner in the provenance column, then select the month and motion on **Dashboard**. Confirm complete channel coverage only after reconciliation. Readiness does not independently prove that an omitted channel has been supplied.
4. Refresh **Cohort LTV** using upstream aggregates from day 0 through day h−1 after each customer's first purchase. Store cohort end as the final acquisition date of the cohort. Available horizons are 30, 60, 90 and 180 days. All customers must have matured through the selected horizon. Replace older snapshots instead of appending duplicate cohort/channel/horizon keys.
5. Maintain ritual survey and discovery observations separately. Add remaining metrics to **KPI database**, using the 56 definitions from **Metric dictionary** and recording evidence status. Proposed values must never be presented as verified actuals.

## Calculations and interpretation

- Attributed CAC = channel acquisition spend / new customers assigned to that channel. Blended CAC = total acquisition spend / deduplicated new customers for one motion and complete month. Neither is an incrementality estimate.
- Contribution = net merchandise sales + retained shipping − COGS − fulfilment − freight − payment fees − commission − variable service costs. Contribution after acquisition subtracts acquisition spend. These measures are not operating or net profit.
- Observed contribution LTV = cumulative contribution within the mature horizon / original acquired cohort customers. Dashboard LTV weights ready mature cohorts by acquired customers. Immature, incomplete and duplicate rows are excluded and retain their row status; review those rows before interpreting the result. The dashboard cohort population need not match its calendar reporting month.
- Optional cohort acquisition spend in **Cohort LTV U** produces cohort CAC in V and a matched contribution LTV:CAC ratio in W. The same cohort's acquisition cost is repeated for each horizon for comparison, never summed across horizons. Zero CAC produces `n.a.` for the ratio. Missing cost remains `Not supplied`. Do not divide the dashboard's historical cohort LTV by calendar-period blended CAC.
- Cohort repurchase rate counts acquired customers with a second valid paid order in the horizon. Calendar returning customer mix divides returning period buyers by active period buyers. They answer different questions.
- Ritual practice asks respondents whether they practised on **all seven days** in a stated seven-day recall window. Multiple rituals is a separate response measure. Neither implies purchasing, health outcomes or cultural identity.
- SEO CTR uses clicks/impressions. AEO/GEO mention, recommendation and citation rates use valid completed panel observations. Accuracy uses assessable claims checked. Keep engine, locale, prompt panel and version stable. These are separate from observed AI referral sessions/orders and do not prove causal revenue impact. See [the detailed protocol](seo-aeo-geo-protocol.md).

## Entry conventions and capacity

The workbook contains eight sheets and five entry tables with **60 rows each (6–65)**. The metric dictionary contains 56 reference definitions from [the vault](metric-vault.csv). Blue cells are inputs and dark cells are calculations. Dates are typed dates, GBP amounts are numeric, and rate results retain numeric decimals. General KPI results use neutral numeric formatting because metric units differ; the dictionary owns the unit.

Before adding row 66, extend table ranges, formula columns, validation, conditional formatting and all bounded dashboard ranges together. Do not assume Excel table expansion extends cross-sheet formulas. Do not overwrite formula columns or copy new raw data over source status formulas. Cohort cost columns U–W form part of the cohort table and remain aligned during table sorting.

The workbook is an aggregate tracking model, not an ingestion pipeline. Duplicate customers across channels, source ledger completeness, period windows, attribution policy and excluded failed panel runs must be validated upstream. Finance/commerce validates spend, revenue and costs; CRM validates deduplicated customers and cohorts; research owners validate survey and panel denominators.

## Verification

Created and recalculated with the bundled spreadsheet authoring engine. A temporary synthetic fixture produced CAC £50, contribution £2,300, 90-day observed LTV £142.50, repurchase 40%, and cohort LTV:CAC 2.85×. The fixture was removed before delivery. Zero acquisition spend produced zero CAC; missing spend produced `Not supplied`. Final formula error scan found no errors. Each sheet's opening range was rendered and visually inspected; entry sheets include tables, categorical validation and frozen headers. Actuals are blank, so the dashboard uses a table rather than an empty chart.

No connected Excel session was available, and no Cowork-specific tool was exposed. Native Microsoft Excel interaction and recalculation have not been tested. The file is editable `.xlsx`, with formulas and cached results checked in the exported package. Source aggregation, real actuals, future rows beyond the stated capacity and native Excel behavior require validation when client data becomes available.
