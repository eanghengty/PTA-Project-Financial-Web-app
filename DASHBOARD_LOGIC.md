# Dashboard Logic Reference

**File:** `src/components/Dashboard.vue`
**Route key:** `dashboard`
**Data source:** `useVOStore()` — all reactive state flows from here; Dashboard does not write back to the store.

---

## Data Split — the most important rule

Every section in the Dashboard first categorises each VO into one of three buckets:

| Bucket | Definition | Variable |
|--------|-----------|----------|
| **VO items** | `voCategory` is NOT in `BASE_PO_CATEGORIES` | `voItems` |
| **Base PO items** | `voCategory` IS in `BASE_PO_CATEGORIES` | `basePOItems` |
| **BOQ items** | `boqRelated === true` or `=== 'yes'` (subset of VO items) | filtered inline |

`BASE_PO_CATEGORIES` (defined as a `Set` in the script):
`Site Survey`, `WOP`, `C&I`, `SAT&SIT`, `Snag Closure`

**Status cards, financial KPIs, charts, ticket breakdown, site summary, and recent activity all operate on `voItems` only** unless explicitly stated otherwise below.

---

## Section 1 — Status KPI Cards

**5 cards** in a row. Counts are VO items only (Service & Third Party categories, non-BOQ).

| Card | Status value | Color |
|------|-------------|-------|
| Draft | `draft` | gray |
| Submitted | `submitted` | blue |
| Pending Approval | `pending-approval` | amber |
| Approved | `approved` | green |
| Rejected | `rejected` | red |

Each card shows: label · count · progress bar (count / totalVOs × 100%).  
`totalVOs` = `voItems.length`.

---

## Section 2 — Financial KPI Cards

**7 cards** in a row. All amounts use `formatCompact()` (K/M suffix).

| # | Card | Color | Logic |
|---|------|-------|-------|
| 1 | Total Approved | green | Sum of `voAmount` where `voStatus === 'approved'`, VO items only |
| 2 | Total Pending | amber | Sum where `voStatus === 'pending-approval'`, VO items only |
| 3 | Total VO Value | blue | Sum of all `voAmount`, VO items only |
| 4 | Total Base PO | amber | Sum of all `voAmount`, Base PO items |
| 5 | Total Submitted | sky | Sum where `voStatus === 'submitted'`, VO items only |
| 6 | Draft Value | slate | Sum where `voStatus === 'draft'`, VO items only |
| 7 | BOQ Related | teal | Sum of `voAmount` for BOQ items (`boqRelated === true`) |

---

## Section 3 — Base PO Summary (collapsible, amber-themed)

**Collapsed by default.** Only renders if `basePOItems.length > 0`.

**Header pills (always visible):** Total Amount · Has PO · No PO · Items count.

**Expanded body:** Scope × Category breakdown table.

Computed: `basePOByScope` — groups Base PO items by `scope`, then by `voCategory` within each scope.  
Per scope row: category · item count · Has PO amount (has `poNumber`) · No PO amount · Total amount.  
Footer: grand totals across all scopes.

`basePOTotals`:
- `total` — sum of all Base PO `voAmount`
- `havePO` — sum where `poNumber` is set
- `noPO` — sum where `poNumber` is absent
- `count` — total Base PO item count

---

## Section 3b — SAT&SIT Not Yet Invoiced by Site (collapsible, amber-themed)

Only renders when `satSitNotYetInvoiced.totalCount > 0`.

**Filter:** Base PO items where `voCategory === 'SAT&SIT'` AND `invoiceStatus !== 'SIT Completed'`.

Grouped by `scope`, then sorted by `siteId` within each scope.

Table columns: Site ID · Site Name · Job No. · Description · PO Number · Invoice Status · Amount.

---

## Section 3c — Snag Closure & C&I Not Yet Invoiced by Site (collapsible, amber-themed)

Only renders when `snagCiNotYetInvoiced.totalCount > 0`.

**Filter:** Base PO items where `voCategory === 'Snag Closure'` OR `voCategory === 'C&I'` AND `invoiceStatus !== 'SIT Completed'`.

Same structure as SAT&SIT section. Table adds a Category column.

---

## Section 4 — Invoice Prep Banner

Only renders when `invoicePrepSummary.count > 0` (items currently in the invoice prep list).

Shows: count of VOs ready for invoicing + total amount (blue-themed, read-only).

---

## Section 5 — Charts Row

### Status Doughnut (2/5 width)
- Chart.js `Doughnut` — one segment per VO status
- Colors match status card colors
- Legend: label + count + percentage

### VO Amount by Status Bar (3/5 width)
- Chart.js `Bar` — one bar per status
- Y-axis uses compact currency formatting
- Only VO items

---

## Section 6 — PO & Invoice Summary by Scope (collapsible, blue-themed)

**Collapsed by default** (`poInvoiceOpen = ref(false)`).

**Header pills (always visible):** Total Have PO (teal) · No PO (gray) · Invoiced (green) · Not Yet Inv. (orange) · Labour Cost (violet) · 3rd Party (blue) · Total Cost (gray).

**Computed: `poInvoiceSummary`** — one row per unique `scope`, aggregating across VO items, BOQ items, and Base PO items.

Per row fields:

| Field | What it counts |
|-------|---------------|
| `voPO` | VO items with PO — sum of `voAmount` |
| `boqPO` | BOQ items with PO — sum of `voAmount` |
| `basePOAmt` | Base PO items with PO — sum of `voAmount` |
| `totalHavePO` | `voPO + boqPO + basePOAmt` |
| `voNoPO` | VO items without PO — sum of `voAmount` |
| `boqNoPO` | BOQ items without PO — sum of `voAmount` |
| `baseNoPO` | Base PO items without PO — sum of `voAmount` |
| `totalNoPO` | `voNoPO + boqNoPO + baseNoPO` |
| `total` | `totalHavePO + totalNoPO` |
| `invoiced` | Items where `invoiceStatus === 'SIT Completed'` AND `invoiceDate` set — sum of `voAmount` (all types) |
| `voServiceNotYetInv` | VO items, `voCategory === 'Service'`, not yet invoiced |
| `vo3rdPartyNotYetInv` | VO items, `voCategory === 'Third Party'`, not yet invoiced |
| `boqServiceNotYetInv` | BOQ items, `voCategory === 'Service'`, not yet invoiced |
| `boq3rdPartyNotYetInv` | BOQ items, `voCategory === 'Third Party'`, not yet invoiced |
| `baseNotYetInv` | Base PO items, not yet invoiced |
| `totalNotYetInv` | Service + BOQ Service + Base PO not-yet-invoiced (excludes 3rd party columns) |
| `labourCost` | Sum of `labourCost` across all VOs in scope |
| `thirdPartyCost` | Sum of `thirdPartyCost` across all VOs in scope |
| `totalCost` | `labourCost + thirdPartyCost` |

**Invoice Progress bar** per row = `invoiced / totalHavePO × 100%`.

**Clickable cells (open slide-over drill-downs):**
- No PO cells (VO / BOQ / Base PO) → `openNoPODetail(row, type)` → `noPOItems` computed shows matching VOs in a slide-over
- Not Yet Invoiced cells → `openNotYetInvDetail(row, type)` → `notYetInvItems` computed. Supported `type` values: `'vo'`, `'service'`, `'3rdParty'`, `'boqService'`, `'boq3rdParty'`, `'boq'`, `'basePO'`, `null` (all)

---

## Section 7 — Monthly Invoiced Amount

**Three-line Chart.js `Line` chart:**
- Blue line — VO invoiced amount per month
- Amber line — Base PO invoiced amount per month
- Green line — BOQ-related invoiced amount per month

**Invoiced definition:** `invoiceStatus === 'SIT Completed'` AND `invoiceDate` is set. Grouped by `invoiceDate` month (`YYYY-MM`).

**`monthlyInvoiceData`** array, one entry per month sorted ascending:
- `key` — `YYYY-MM`
- `label` — `Mon YYYY` (e.g. `Apr 2025`)
- `voAmount` / `voCount`
- `basePOAmount` / `basePOCount`
- `boqAmount` / `boqCount`

**Breakdown table** below the chart with those same columns + Total column.

---

## Section 8 — BOQ Related VO Amount by Scope

VO items only (no Base PO). Four-way split per scope:

| Column | Definition |
|--------|-----------|
| BOQ · Have PO | `boqRelated === true` AND `poNumber` set |
| BOQ · No PO | `boqRelated === true` AND no `poNumber` |
| Non-BOQ · Have PO | `boqRelated !== true` AND `poNumber` set |
| Non-BOQ · No PO | `boqRelated !== true` AND no `poNumber` |

**`boqTotals`:** Aggregate totals for BOQ (total, havePO, noPO) and Non-BOQ (total, havePO, noPO) across all scopes. Shown as two summary pills above the table.

---

## Section 9 — Ticket Breakdown

VO items only, **non-draft** (`voStatus !== 'draft'`).

**Two side-by-side panels:**

| Panel | Filter |
|-------|--------|
| With Ticket Number | `ticketNumber` is set |
| Without Ticket Number | `ticketNumber` is absent |

Each panel: total amount + count in header, then per-scope rows with amount + proportional bar.

**`ticketBreakdown`** computed:
- `withTicket` → `{ count, total, scopes: [{ scope, count, amount }] }`
- `withoutTicket` → same shape

---

## Section 10 — Timeline Metrics

Three stat cards sourced from `store.timelineMetrics.value` (computed in the store, not re-computed in Dashboard):

| Card | Field | Description |
|------|-------|-------------|
| Avg Days to Approval | `averageDaysToApproval` | Average days from `emailApprovedFromNokia` to `ticketApprovalDate`. Only VOs where both dates are set contribute. Uses `Math.max(0, ...)` to guard against negative values. |
| Overdue >30 days | `overduePending` | VOs in `pending-approval` with `emailSentToNokia` set, where days since `emailSentToNokia` > 30 |
| Approval Rate | `approvalRate` | `withTicketApproval / (withTicketApproval + withTicketNoApproval) × 100`. `withTicketApproval` = VOs with `ticketApprovalDate` set. `withTicketNoApproval` = VOs with `ticketNumber` but no `ticketApprovalDate`. Returns 0 when no tickets exist. Shown with progress bar. |

---

## Section 11 — VOs by Site

VO items only (non-cancelled filtered out implicitly by amount logic).

**`siteSummary`** computed — one entry per unique `siteId + jobNumber` combination:
- `siteId`, `siteName`, `jobNumber`
- `total` — VO count
- `approved`, `pending`, `submitted`, `draft` — counts per status
- `amount` — sum of `voAmount`

**Sort toggle:** By Count or By Amount (buttons in header).  
**Pagination:** `SITE_PAGE_SIZE = 20` rows per page. `sitePage` ref, resets when sort changes.

---

## Section 12 — Invoice by Site

All VOs (VO + Base PO + BOQ combined). One row per unique `siteId + jobNumber`.

**`invoiceBySite`** computed per row:
- `total` — total VO count
- `invoiced` — count where `invoiceStatus === 'SIT Completed'` AND `invoiceDate` set
- `canInvoice` — count where `poNumber` set AND not yet invoiced
- `noPO` — count where no `poNumber`
- `invoicedAmt` — sum of invoiced VO amounts
- `pendingAmt` — sum of can-invoice VO amounts
- `totalAmt` — sum of all VO amounts

**Sort toggle:** By Invoiced or By Total (amounts).  
**Search:** `invoiceSiteSearch` — filters by site ID, site name, or job number.  
**Pagination:** `INVOICE_SITE_PAGE_SIZE = 20`.

**Click a row** → opens `invoiceSiteModal` slide-over showing all VOs for that site with columns: Description · Scope · VO Status · Amount · PO Number · Invoice Status · Invoice Date. Invoiced rows highlighted green.

---

## Section 13 — VO by Category

All VOs (VO + Base PO combined, per `voCategory`).

**`voCategorySummary`** per category:
- `isBasePO` — whether the category is in `BASE_PO_CATEGORIES`
- `total` — count
- `invoiced` / `uninvoiced` — counts
- `invoicedAmt` / `uninvoicedAmt` / `totalAmt`

**Sort toggle:** By Invoiced or By Total (amounts).  
**Search:** `voCatSearch` — filters by category name.  
**Pagination:** `VO_CAT_PAGE_SIZE = 20`.

**Click a row** → opens `voCatModal` showing all VOs for that category. Modal has **All / Invoiced / Uninvoiced** tab filter (`voCatModalTab`). Color theme: amber for Base PO categories, blue for VO categories.

---

## Section 14 — Recent Activity

VO items only. Shows last **8** VOs sorted by `updatedAt` descending.

Each row: site ID badge · site name · job number · VO description (truncated) · VO status badge · compact amount.

---

## Key Computed Refs (script)

| Ref | Type | Description |
|-----|------|-------------|
| `voItems` | array | All VOs where `voCategory` NOT in `BASE_PO_CATEGORIES` |
| `basePOItems` | array | All VOs where `voCategory` IN `BASE_PO_CATEGORIES` |
| `totalVOs` | number | `voItems.length` |
| `statusCards` | array | 5 status KPI objects |
| `financialCards` | array | 7 financial KPI objects |
| `basePOByScope` | array | Scope × category breakdown for Base PO |
| `basePOTotals` | object | `{ total, havePO, noPO, count }` for Base PO |
| `satSitNotYetInvoiced` | object | `{ totalAmount, totalCount, byScope }` |
| `snagCiNotYetInvoiced` | object | Same shape as above |
| `poInvoiceSummary` | array | One row per scope, full PO + invoice + cost breakdown |
| `monthlyInvoiceData` | array | One row per invoice month |
| `boqByScope` | array | BOQ vs Non-BOQ per scope |
| `boqTotals` | object | Aggregate BOQ/Non-BOQ totals |
| `ticketBreakdown` | object | `{ withTicket, withoutTicket }` |
| `siteSummary` | array | Per-site VO counts and amounts |
| `invoiceBySite` | array | Per-site invoice progress |
| `voCategorySummary` | array | Per-category invoice summary |
| `recentVOs` | array | Last 8 updated VO items |

---

## Collapse State Refs

| Ref | Default | Controls |
|-----|---------|---------|
| `basePOOpen` | `false` | Base PO Summary body |
| `satSitOpen` | `false` | SAT&SIT Not Yet Invoiced body |
| `snagCiOpen` | `false` | Snag Closure & C&I Not Yet Invoiced body |
| `poInvoiceOpen` | `false` | PO & Invoice Summary body |

---

## Drill-down Slide-overs

| Trigger | Ref | Items computed |
|---------|-----|---------------|
| No PO cell in PO & Invoice table | `noPOScope`, `noPOType` | `noPOItems` |
| Not Yet Inv. cell in PO & Invoice table | `notYetInvScope`, `notYetInvType` | `notYetInvItems` |

Both slide-overs close when the backing ref is cleared (`noPOScope = null` / `notYetInvScope = null`).

---

## Currency Formatting Rules

- All Dashboard numbers use `formatCompact()` from `src/utils/formatters.js` — e.g. `$1.23M`, `$456.7K`, `$999`
- The only exception is the Invoice by Site detail modal, which uses `formatCurrency()` (full AUD format)

---

## What Dashboard Does NOT Do

- Does not write to IndexedDB or localStorage
- Does not open VOForm or allow editing
- Does not read `siteStatusData` (Site Status feature is not yet wired into Dashboard — planned toggle for started/not-started filtering)
