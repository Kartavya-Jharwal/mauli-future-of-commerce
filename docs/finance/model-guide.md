# Financial scenarios: use and interpretation

Prepared 10 October 2026. Independent student advisory work. **Every populated baseline and scenario number in the delivered workbook is a fictional demonstration assumption, not a Mauli actual, approved budget, benchmark or predicted uplift.**

[Open the editable Excel model](../../models/financial-scenarios/mauli-financial-scenarios.xlsx).

## What decision it supports

Assess whether an incremental Shopify discovery/education pilot can cover its development, content, distribution and operating costs. The comparator is a continuing business with acquisition, repeat orders, wholesale sales and existing operating costs. It is not zero revenue. The model is a 24-month, monthly operating forecast, beginning in an explicitly assumed November 2026; change the date before use.

The scope follows the [updated brief](../brief/updated-project-brief.md), especially its commercial-test section. Optional voice and the partner bridge can each be set to zero. The model does not require replacing Shopify, compulsory bundles, diagnostic recommendations or a production AI platform.

## Opening and editing

1. Open `Summary`. It compares 24-month sales and contribution, then shows incremental cash, peak funding, NPV, first payback crossing, investment and no-benefit downside.
2. On `Assumptions`, D4 is the only scenario selector: **1 Low, 2 Base, 3 High**. Each driver has an Active row followed by three editable case inputs. One forecast updates with the selected case. There are no silently frozen case-result tabs.
3. D8 selects **1 Demo / 2 Client inputs**. The client fields in `Actual inputs` D7:D25 are intentionally blank. Record each input's source, period and approving owner in the adjacent column. Selecting client mode before supplying the necessary fields returns `Not supplied`, not a plausible zero forecast.
4. The demo baseline is in `Assumptions` E13:E31. Do not relabel it as actual. D9 is the first month. D5 and D6 are benefit and pilot-cost multipliers; keep both at 1 for the chosen scenario's standard run.
5. Review all scenario assumptions with the team and client owner. Blue text and amber fill identify editable inputs. Green working numbers link across sheets; output numbers are dark. Blank selected case inputs expose missingness; numeric zero remains valid. A missing unselected case does not block a complete selected case.
6. Inspect `Forecast` and `Review`, then save the selected case. In Excel, enable Automatic calculation **including Data Tables** to refresh the sensitivity grid. Do not rely on an old cached table after editing.

The model accepts aggregate inputs only. It contains no personal customer data, credentials, external workbook links or live APIs. The separate actual-input fields are a calibration template, not a claim that a historical financial statement has been supplied.

## Formula map and accounting basis

Amounts are GBP, nominal, excluding VAT. Merchandise basket is after discounts and before refunds. Shipping income is excluded; delivery is included in fulfilment. Use consistent definitions when adding client values.

| Schedule | Location | Definition |
|---|---|---|
| Baseline sales and cost stack | Forecast 11–30 | Eligible non-customer sessions × new-buyer conversion gives first orders. Opening active prior buyers × repeat order frequency gives repeat orders. The two populations do not overlap within the month. |
| Buyer-pool rollforward | Forecast 13–16, 38–42 | Closing pool = (opening pool + new buyers) × (1 − attrition). Current-month new buyers enter the repeat pool in the following month. Repeat orders do not create new customers. |
| Rollout | Forecast 33–34 | Linear launch-to-ramp adoption capped at maximum adoption; multiplied by (1 − cannibalisation) and the benefit multiplier. Launch month 1 is permitted. Launch beyond month 24 produces no in-horizon operational benefits. |
| Intervention acquisition | Forecast 35–37 | Traffic and conversion have separate relative lifts applied to effective adoption. Their interaction is intentional: more eligible visits can also convert at a changed rate. Conversion is bounded to 0–100%. |
| Intervention repeat | Forecast 39–40 | Baseline monthly repeat-order frequency plus an additive percentage-point change, applied only to opening active buyers. Nonnegative frequency. |
| Basket and refunds | Forecast 43–46 | Basket receives a relative lift; refunds reduce merchandise sales. No forced multiproduct purchase is assumed. |
| Partner bridge | Forecast 47–48 | Saturated incremental partner-equivalent accounts × monthly order frequency × net wholesale basket × effective adoption. Fractional expected accounts are allowed in a forecast. Baseline B2B continues separately. Count Mauli sell-in, not retailer sell-through. |
| D2C variable costs | Forecast 22–25, 50–53 | Product and payment/commission percentages apply to gross merchandise; fulfilment and variable service apply to orders. No recovery of product cost or fees is assumed on refunds; validate this conservative simplification. |
| B2B contribution | Forecast 26, 54 | Net wholesale sales × (1 − contribution margin) gives the complete B2B variable cost allowance. Never interpret this percentage as a retail markup. |
| Acquisition and fixed costs | Forecast 28–30, 56–61 | Existing acquisition and overhead are deducted in both cases. Incremental paid media, tools/content/support and optional voice are deducted once in the intervention. They are not also subtracted as a separate CAC charge. |
| Setup | Forecast 67 | Design/research, integration, initial content and training/QA total: 50% paid in month 1, 50% at launch. If launch is month 1, both halves are paid that month. Launch outside the horizon leaves the second half outside the horizon. |
| Cost funding reserve | Forecast 68 | Buffer months × positive incremental D2C product cost plus B2B variable cost. This is a conservative **operating-cost reserve proxy, not physical inventory valuation**. The aggregate B2B cost allowance includes service/commission. Replace with a detailed inventory/payables schedule if material. |
| Incremental receivables | Forecast 69 | Wholesale sales not yet collected at the selected whole-month delay (0–6). D2C assumed collected in the month. Baseline AR is steady-state and cancels in the incremental bridge. |
| Cash | Forecast 70–73 | Incremental operating contribution − setup − change in reserve and receivables. The ending funding balance is not automatically released. Cash is discounted at month end using `(1 + annual rate)^(month/12)`. |

The simplified repeat pool is an explicit planning approximation, not a cohort lifetime model. Attrition describes loss from the active purchasing pool; it is not newsletter unsubscribe, customer deletion or a measured retention probability. If the client supplies cohort schedules, replace the approximation through a separate reviewed model revision rather than putting a 90-day cohort rate into the monthly frequency cell.

The ordinary baseline forecast grows its active pool as it continues acquiring buyers, even when monthly sessions are flat. This creates baseline repeat growth. Incremental results compare against that growing continuing business, so repeat orders are not automatically credited to the recommendation.

## Return measures and decision boundaries

- **Incremental operating cash** is the 24-month sum after pilot costs and the reserve/receivables changes. It is a pre-tax planning proxy, not free cash flow, a full three-statement model, a business valuation or distributable cash.
- **Peak funding** is the absolute value of the most negative cumulative incremental cash balance, with opening incremental cash of zero. It is a project funding need, not the business's total cash runway.
- **Investment** includes setup, incremental media, recurring tools/content/support and optional voice. It excludes baseline spend, variable product costs already netted into contribution and incremental funding balances.
- **Cash ROI** = net incremental operating cash / pilot investment. A zero denominator returns `n.a.`. This is not ROAS or an unqualified profitability claim.
- **NPV** discounts the project cash proxy at an explicitly assumed hurdle rate. There is no terminal value, tax shield, financing cost, debt balance, depreciation schedule or enterprise-value claim.
- **Payback** reports the first month cumulative cash becomes nonnegative after positive spending. If that does not occur within 24 months it says `Not reached`. Later deterioration remains visible in the cash chart; this is not a sustained-payback guarantee.
- **Month-24 break-even benefit** is the recurring pilot cost that month. Covering it does not establish recovery of historic setup costs. Compare the adjacent contribution-benefit value and the cumulative cash path.
- **No-benefit downside** removes all assumed commercial gains while retaining launch, adoption and the corresponding spending. Voice demand in this downside uses the baseline audience. The low case additionally allows conversion deterioration; no-benefit is not the worst possible outcome.

Costs are expensed and cash-paid in their modelled month. There is no VAT, corporate tax, debt, supplier-credit schedule, stock liquidation value or inflation adjustment. Labour includes opportunity cost only to the extent entered; pro bono student effort is not automatically a zero-cost future client implementation. Flat baseline growth and no seasonality are demo simplifications to replace during calibration.

## Sensitivity and scenario discipline

`Assumptions` G11:L16 is a native two-variable Excel What-If Data Table. It recalculates the actual forecast, using D5 for benefit multiplier across the top and D6 for cost multiplier down the side. Each cell is 24-month incremental cash. The 1× / 1× result matches the selected standard case; the 0-benefit column retains costs. The tool is useful for asking how much combined benefit or cost reduction is needed; it does not imply that traffic, conversion, frequency, basket and wholesale gains will all move together in real life.

For a specific lever, edit its case input and inspect the same forecast. Keep a dated assumption log when changing the business case. Low/Base/High are alternative planning inputs, not estimated probabilities or statistical confidence intervals. Actual incremental effects need a credible holdout or, if unavailable, a clearly labelled observational evaluation.

## Fictional demonstration results

These values validate and illustrate the model only. They must not be used as a Mauli forecast or client recommendation without calibration. The baseline 24-month net sales of approximately £691,832 are also fictional.

| Demo case | Incremental cash, 24 months | Peak funding | NPV | Payback first crossing |
|---|---:|---:|---:|---|
| Low | −£45,873 | £45,873 | −£40,783 | Not reached |
| Base | −£5,959 | £9,237 | −£6,259 | Not reached |
| High | £69,435 | £4,782 | £59,594 | Month 6 |

The base demo raises net sales by approximately £52,736 but does not recover the pilot's complete costs and funding balance within 24 months. That is a useful demonstration of why conversion or revenue alone cannot establish viability. At zero benefit with base spending, incremental cash is −£35,100. At zero benefit and zero pilot cost, the delta is exactly zero.

## Manual crosswalk to the customer economics workbook

Use [the customer workbook guide](../metrics/workbook-guide.md) for observed metrics. No automatic file link is required or present.

| Customer evidence | What can inform this model | Do not substitute |
|---|---|---|
| Monthly merchandise / discounts / refunds and orders | Reconcile an ex-VAT basket **after discounts, before refunds**, plus a separately calculated refund fraction | Net AOV directly into pre-refund basket, which would deduct refunds twice |
| New customers and attributable acquisition spend | Validate baseline spend and implied first-order economics; separately obtain eligible acquisition sessions and conversion | Monthly CAC as a traffic conversion rate, or multiplying all orders by CAC |
| Matured 90-day repeat-buyer conversion | Validate the broad repeat hypothesis and derive a separate monthly order-frequency model with cohort evidence | 90-day repeat probability as monthly repeat-order frequency |
| Contribution after full variable costs | Calibrate product, fulfilment, fees, service and B2B margin consistently | Revenue-based LTV as contribution, or subtracting acquisition twice |
| Partner account/order contribution | Calibrate wholesale basket, orders, contribution and collection terms | Retail sell-through or guest D2C purchases also counted as B2B revenue |

## Sources, provenance and validation

The workbook's numerical demo inputs were authored as deliberately fictional modelling fixtures on 10 October 2026. There are no current vendor-price assumptions presented as quotes. Obtain actual agency/tool/labour estimates and a client-approved expenditure ceiling before proposing a live budget.

Method and scope sources are the [updated project brief](../brief/updated-project-brief.md), [measurement plan](../metrics/measurement-plan.md), [baseline reconciliation](../metrics/data-request-and-baseline.md) and [decision ledger](../brief/decision-assumption-ledger.md), as inspected on 10 October 2026. The supplied challenge PDF pages 3–4 and 7–10 contain classroom-synthesis claims including £87 AOV and 61% D2C. Those are unresolved reference claims; neither is used as a default actual here.

Validation uses a separate ordinary JavaScript calculation of the full 24-month model, compared against workbook formulas for all three cases, total sales, funding, NPV, no-benefit/zero-cost, zero acquisition and opening buyers, full refunds, 0/6-month collection-delay boundaries, month-one launch and optional voice costs. Missing actual inputs, missing selected versus unselected case inputs and invalid refund bounds are tested separately. Native sensitivity base and zero-benefit cells are checked against the independent calculation. Reconciliation formulas cover sales, costs, first/repeat orders and cash versus contribution and funding. All five tabs were rendered and inspected.

The delivered file is an editable `.xlsx` with formulas, validation and a native two-input Data Table. Calculation and sensitivity behavior were verified in the bundled Artifact Tool engine. Microsoft Excel desktop recalculation was **not** available for verification; reopen with Automatic calculation including Data Tables and confirm the 1× / 1× sensitivity cell equals Summary D15 before sharing outputs.

Machine-readable verification is retained in `models/financial-scenarios/fixture-validation.json`; it records engine and comparison results. It is supporting QA, not client evidence. Changing inputs after delivery requires reviewing outputs and recalculating again.
