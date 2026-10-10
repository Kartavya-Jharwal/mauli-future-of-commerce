# Foresight-based Mauli workbook

The local working workbook is `mauli-foresight-integrated.xlsx`. It merges both supplied Foresight templates and all thirteen existing Mauli model sheets, then adds a source register. This is the template-based working version; the earlier standalone workbooks remain source archives.

The workbook and template-derived support files are excluded from Git because the supplied licences restrict redistribution. Both original Foresight files remain unchanged. Original attribution, licence, disclaimer and supporting sheets are preserved in the merged file.

## What is populated

- `Get Started` contains the company name, GBP, the prior model's proposed November 2026 start, and the reported £87 blended AOV. Applying that AOV to both new and repeat orders is explicitly a proxy; the repository provides no measured split or confirmed gross/net basis.
- `Unit Economics` uses the template's transaction route and links to `Get Started` for order revenue, costs, CAC and repeat assumptions. The original subscription example is disabled in its existing input cells. The template's output formulas and chart are retained.
- `Mauli sources` records reported channel shares, customer mix, email opens, paid allocation and retailer terms with evidence limitations. These do not become unrelated financial drivers.
- Remaining Foresight input figures and historical cohorts are explicitly labelled template examples, not Mauli actuals. The imported Impact model retains its separate fictional scenarios and blank client-input mode; the customer/cohort tracker retains blank actuals.

Foresight's 48-month forecast and the imported 24-month intervention model have different purposes and mechanics. Their totals and modelled LTV must not be treated as interchangeable with observed cohort contribution LTV.

## Preservation and checks

Native Excel sheet copying preserved the template structure, five charts, nine tables, grouped rows and formulas. Duplicate supporting sheet names use a `UE` prefix. Existing financial scenario tabs use `Impact` names to avoid collisions. A source register makes thirty sheets in total.

Six table containers in the earlier Mauli tracker caused a native Excel reopening failure. Only those containers were rebuilt using Excel, retaining their data ranges, names and styles. Five inherited text-format rules were given their missing formula definitions. Foresight tables were not rebuilt.

The combined workbook opens and reopens normally in Excel. Native recalculation checks cover AOV propagation into both templates, changing intervention scenarios, and the sensitivity table's 1×/1× result. Source hashes and cell/formula comparisons are retained locally alongside the workbook. No source-file links are required.
