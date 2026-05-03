# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:5100 (auto-opens browser)
npm run build     # Production build to dist/ with sourcemaps
npm run preview   # Preview the production build locally
```

No test runner or linter is configured.

## Architecture

**Vue 3 SPA — no Vue Router.** Views are swapped via `<component :is="currentComponent">` in `App.vue`, with the active view persisted to `localStorage` as `currentView`. Available views: `dashboard`, `table`, `invoice-list`, `monthly-invoice`, `reminders`, `cost-to-date`, `site-status`, `import-export`, `admin`.

**State:** A single composable store in `src/stores/voStore.js` (`useVOStore()`) holds all reactive state — no Pinia or Vuex. Key refs: `vos`, `loading`, `error`, `invoicePrepIds` (a `Set`), `selectedFilters`. Key computed: `filteredVOs`, `statusSummary`, `financialSummary`, `categoryDistribution`, `timelineMetrics`, `invoicePrepItems`. All components import this composable directly.

**Persistence split:**
- `src/db/indexdb.js` — IndexedDB ("VariationTrackerDB" v3, store "variations") for all VO records. All operations return Promises.
- `localStorage` — UI state (active view/tab), invoice prep IDs, flagged VO IDs (`flaggedVOIds`), flagged VO notes (`flaggedVONotes`), activity log (no cap — all entries preserved), global admin data (sites, categories, scopes, settings), site status data (`siteStatusData`).

**VO data model** (key fields): `id` (UUID), `siteId`, `siteName`, `jobNumber`, `voDescription`, `voAmount`, `voCategory`, `scope`, `boqRelated` (boolean `true`/`false`), `voStatus` (`draft|submitted|pending-approval|approved|rejected|cancelled`), invoice fields (`poNumber`, `invoiceStatus`, `invoiceDate`, `invoiceLog`, `poLog`), tracking fields (`emailSentToNokia`, `emailApprovedFromNokia`, `ticketNumber`, `ticketSubmissionDate`, `ticketApprovalDate`), cost fields (`labourCost`, `thirdPartyCost` — both numeric, default `0`), `comment`, and `createdAt`/`updatedAt`.

- `invoiceLog` — append-only array of `{ status, date, loggedAt, source? }`. Written by `bulkUpdateInvoiceStatus` (bulk ops) and by `VOForm` on manual status change (`source: 'manual'`).
- `poLog` — append-only array of `{ from, to, loggedAt }`. Written by `VOForm` on every `poNumber` change, including initial assignment on new VOs (`from: null`). `from`/`to` are trimmed strings or `null` if cleared/unset.
- `boqRelated` is stored as a boolean — always check `=== true` or `=== 'yes'`, never compare as string alone.

**Utilities:**
- `src/utils/formatters.js` — `formatDate`, `formatCurrency` (AUD, full format), `formatCompact` (K/M suffix for dashboard), `getStatusColor`, `formatStatus`, `daysBetween`
- `src/utils/logger.js` — `addLog`, `diffVOs` (returns field-level diff array), `getLogs`, `clearLogs`. Activity log lives in localStorage under key `voActivityLog`.
- `src/utils/import.js` — `importFromFile(file, existingVOs)` parses `.xlsx/.xls/.csv` via SheetJS. Required columns: Site ID, VO Description, VO Amount. Returns `{ vos, warnings }` with row-level errors. Duplicate detection: same description+no PO blocked; same description+different PO allowed; same ticket number or same PO number always blocked.
- `src/utils/export.js` — `exportToExcel` / `exportToCSV` with auto-timestamped filenames. Columns include `Comment` as the last field.

**Invoice Status Import** (`ImportExport.vue` — `parseInvoiceImportFile`): Bulk-updates invoice statuses from `.xlsx/.xls/.csv`. Columns: `PO Number` (required), `VO Amount` (optional), `Invoice Status` (optional). Match is by PO number only. Rows appear in the diff preview when status differs OR amount differs from the existing VO. Amount-mismatch rows: displayed with the current amount struck through and the imported amount in orange; row background is orange when selected. The diff object includes `amountMismatch: boolean`, `importedAmount: number|null`, and `siteId`. On apply, `invoiceStatus`, `invoiceDate`, and `invoiceLog` are updated; if `amountMismatch` is true, `voAmount` is also updated to `importedAmount`. Preview table columns: Checkbox · Site ID · PO Number · VO Description · Amount (with mismatch indicator) · Current Status → New Status · Invoice Date. The toolbar shows a badge counting rows with amount changes. Success message reports how many amounts were also updated.

**Backup & Restore:** `ImportExport.vue` exports a versioned `.json` snapshot containing `vos` (all fields including `invoiceLog` and `poLog`, original IDs/dates), `invoicePrepIds` (array), `adminData` (`globalData` object), and `activityLog`. Format has `_version: 2` and `exportedAt` ISO timestamp. Restore clears IndexedDB via `clearAllData()`, re-inserts via `bulkInsertVOs()` (preserving original IDs), writes all three localStorage keys, then calls `store.loadAllVOs()` to refresh all views. Version guard: restoring a file with `_version < 1` (corrupt) or `_version > BACKUP_VERSION` (too new) throws an error with a descriptive message.

**Invoice statuses** (ordered): `Not Yet Sent` → `To Be Sent to Nokia` (indigo) → `Request to Nokia` (blue) → `SIT Approved` (yellow) → `SIT Completed` (green). A VO is only counted as **invoiced** when `invoiceStatus === 'SIT Completed'` **and** `invoiceDate` is set. The `invoiceLog` field is an append-only array of `{ status, date, loggedAt, source? }`.

**Invoice prep workflow:** VOs are added to an in-memory `invoicePrepIds` Set (persisted to localStorage) from TableView, then managed in InvoiceList.
- **VOs without a `poNumber` cannot be added to the prep list.** The "Prep for Invoice" button in TableView is disabled (with tooltip) if any selected VO has no PO. The guard is also enforced at the store level in `addToInvoicePrep` — VOs without a PO are silently filtered out even if called directly.
- Row selection is automatically cleared when search text or filters change, preventing stale selections from carrying over to unrelated rows.
- Bulk status updates via `bulkUpdateInvoiceStatus(ids, status, date)` in the store — each call appends to `invoiceLog`.
- If `invoiceStatus` is cleared or set to `'Not Yet Sent'`, the VO is automatically removed from the prep list.
- A VO is only counted as **invoiced** (in Dashboard and any future metric) when `invoiceStatus === 'SIT Completed'` **and** `invoiceDate` is set.

**Admin data** (sites, VO categories, scopes, app settings) lives entirely in `localStorage` under the key `globalData`. It is loaded independently by `AdminView.vue` — the main store does not read it except `VOForm.vue` consumes it for autocomplete dropdowns.

## Base PO Categories

The following VO categories are treated as **Base PO**, not variation orders:
`Site Survey`, `WOP`, `C&I`, `SAT&SIT`, `Snag Closure`

- Defined as `BASE_PO_CATEGORIES` (a `Set`) in both `Dashboard.vue` (script) and `VOForm.vue` (script).
- `Dashboard.vue` splits `store.vos.value` into `voItems` (non-base PO) and `basePOItems` (base PO) using `isBasePO(vo)`. All VO-specific computeds (status cards, financial cards, charts, site summary, etc.) use `voItems` only.
- Base PO items have their own **Base PO Summary** card (amber-themed) in the dashboard showing total amount, Has PO / No PO split, and a scope × category breakdown table.
- The **financial KPI row** has 6 cards: Total Approved, Total Pending, Total VO Value, **Total Base PO** (amber), Total Submitted, Draft Value.
- In `VOForm.vue`, `isBasePOForm` computed hides the **Status** and **Ticket** sections for Base PO categories and shows an amber info notice instead. Invoice and PO fields remain visible.
- On app load (`loadAllVOs`), status is auto-corrected for all records: has PO or ticket approval date → `approved`; has ticket number + submission date → `submitted` (from `draft`/`pending-approval`). `rejected` and `cancelled` are never overridden.
- In the edit modal watcher, the same auto-status logic fires live as fields change.

## BOQ Related VOs

VOs with `boqRelated === true` (or `=== 'yes'`) are tracked separately for invoice metrics:
- **BOQ Related card** (7th financial KPI, teal-themed) — shows total BOQ-related VO amount and count
- **Monthly Invoiced Amount chart** — third green line shows BOQ-related invoiced amount (subset of VO invoiced)
- **Edit modal behavior** — green "BOQ Related" badge and notice. Ticket section is hidden (like Base PO). Status auto-corrects:
  - Has PO → `approved`
  - No PO → `pending-approval`
  - Fires reactively as PO or BOQ flag changes; blocked during form load via `isInitializing` guard to prevent unintended overwrites
- **App load auto-correct** (`voStore.js` `loadAllVOs`) — applies same BOQ status logic to fix any stale records

## Auto-Status Logic (VOForm & voStore)

**Standard VOs (neither Base PO nor BOQ):**
- Watcher on `[ticketNumber, ticketSubmissionDate, ticketApprovalDate, poNumber]`:
  - If `rejected` or `cancelled` → no change (protected)
  - If `poNumber` filled **or** `ticketApprovalDate` filled → `approved`
  - Else if `ticketNumber` + `ticketSubmissionDate` both filled → `submitted` (from `draft` or `pending-approval`)

**BOQ VOs (overrides standard logic):**
- If has PO → `approved`
- Else → `pending-approval`

**Base PO:** Status and Ticket sections hidden; no auto-status (manual edit only)

**Cancelled:** Auto-status watcher is blocked. `rejected` and `cancelled` are both protected statuses — neither is ever overridden by the watcher or by `loadAllVOs`.

## Cancelled VOs

Setting `voStatus` to `cancelled` triggers special behaviour:

- **Amount** is automatically set to `0` and the amount input shows `0.00`
- **Ticket & timeline fields cleared:** `ticketNumber`, `ticketSubmissionDate`, `ticketApprovalDate`, `emailSentToNokia`, `emailApprovedFromNokia` are all wiped
- **Amount required validation** is lifted for cancelled VOs (the input is not `required`)
- **Activity log note:** `voStore.editVO` detects the `→ cancelled` transition and appends a synthetic `"Cancelled — fields removed"` entry to the `changes` array, listing every field that had data and the previous amount. This is permanently preserved in the activity log.
- **VOForm UI:** A slate-coloured notice banner appears explaining the cancellation. A `Cancelled` badge appears in the modal header.
- **Reminders view:** All three reminder sections exclude cancelled VOs.
- `getStatusColor('cancelled')` returns `'slate'`; `formatStatus('cancelled')` returns `'Cancelled'`.

## VOForm Cost Fields

The VO edit/create modal includes **Labour Cost** and **Third Party Cost** inputs (side by side, in the left panel). Both are numeric fields stored as numbers on the VO record (`labourCost`, `thirdPartyCost`, default `0`). These feed the Cost to Date view and the Dashboard PO & Invoice Summary by Scope. The inputs format on blur (comma-separated AUD) and strip formatting on focus for raw numeric entry.

## VOForm Activity History

The right panel of the VO edit modal includes an **Activity History** section (bottom, read-only) that shows all `voActivityLog` entries for the current VO, filtered by `voId`. Each entry displays:
- Timestamp, action label (`created` / `updated`), status badge at that point
- Field-level diff: `Label: old → new` for every changed field
- The cancellation note (`"Cancelled — fields removed"`) rendered with slate styling

Uses `getLogs()` from `src/utils/logger.js`, filtered client-side per VO. Only shown when editing an existing VO (not on the new VO form).

## Reminders View (`src/components/ReminderView.vue`)

A dedicated **Reminders** tab (bell icon, orange badge in nav) with four independent watchlists presented as **collapsible accordion sections**. Section 1 is expanded by default; Sections 2, 3, and 4 start collapsed. State refs: `section1Open = ref(true)`, `section2Open = ref(false)`, `section3Open = ref(false)`, `section4Open = ref(false)`. Each accordion uses `v-show` on the body (DOM stays mounted). Sections 1, 2, and 3 exclude Base PO categories, BOQ-related VOs, rejected, and cancelled VOs. Section 4 is BOQ-specific. Each section has:
- Three urgency KPI cards: Overdue (>30 days, red), Warning (14–30 days, amber), Recent (<14 days, green) — each shows count + total amount + proportional progress bar
- Scrollable table sorted **primary by scope (A→Z), secondary by days descending** within each scope
- Per-row left-bar urgency accent (red/amber/green) + subtle background tint
- Export button → downloads `.xlsx` via `exportToExcel`
- Empty state when nothing matches

**Section 1 — Ticket submitted, awaiting PO**
- Filter: non-BOQ, non-Base PO, status not approved/rejected/cancelled, has `ticketNumber` + `ticketSubmissionDate`, no `ticketApprovalDate`, no `poNumber`
- Days counted from `ticketSubmissionDate`
- Export filename: `Reminders_Ticket_Pending_PO_YYYY-MM-DD.xlsx`

**Section 2 — Email sent, awaiting Nokia approval**
- Filter: non-BOQ, status not rejected/cancelled, no `poNumber`, has `emailSentToNokia`, no `emailApprovedFromNokia`
- Days counted from `emailSentToNokia`
- Table includes Status column (purple header theme)
- Export filename: `Reminders_Awaiting_Nokia_Email_YYYY-MM-DD.xlsx`

**Section 3 — Ticket approved, still no PO**
- Filter: non-BOQ, non-Base PO, status not rejected/cancelled, has `ticketApprovalDate`, no `poNumber`
- Days counted from `ticketApprovalDate`
- Table shows Ticket #, Ticket Approved date, Days Since Approval (teal header theme)
- Export filename: `Reminders_Approved_No_PO_YYYY-MM-DD.xlsx`

**Section 4 — BOQ Related, pending PO** (emerald theme)
- Filter: `boqRelated === true` or `=== 'yes'`, no `poNumber`, status not rejected/cancelled
- Days counted from `createdAt` (BOQ VOs have no ticket submission date)
- Table columns: Site, Job #, Description, Category, Scope, Created, Days Waiting, Amount, Action
- Export filename: `Reminders_BOQ_Pending_PO_YYYY-MM-DD.xlsx`

The nav badge (`reminderCount`) in `App.vue` reflects Section 1's count only (ticket pending PO).

## Dashboard Sections

All currency in Dashboard uses `formatCompact()` (e.g., $1.23M, $456.7K, $999).

1. **Status summary cards** — count per VO status (Service & Third Party categories, Non-BOQ only)
2. **Financial KPI cards (7)** — Total Approved, Total Pending, Total VO Value, Total Base PO (amber), Total Submitted, Draft Value, **BOQ Related** (teal)
3. **Base PO Summary** (amber card) — total amount + Has PO / No PO pills + scope × category breakdown table
4. **Invoice Prep banner** — shown when prep list is non-empty
5. **Status doughnut + Amount by status bar** — visual VO-only status breakdown
6. **PO & Invoice Summary by Scope** — **collapsible** (collapsed by default, `poInvoiceOpen = ref(false)`). Full-width table combining PO status, invoice progress, and cost-to-date in one view. Computed: `poInvoiceSummary`.
   - **Have PO** group (teal): VO · BOQ · Base PO · Total. **No PO** group (gray): VO · BOQ · Base PO · Total — all three No PO cells are clickable, opening a `noPOScope`/`noPOType` slide-over (refs + `noPOItems` computed) showing items without a PO number, split by type (VO/BOQ/Base PO). **Total** column. **Cost to Date**: Labour (violet) · 3rd Party (blue) · Total.
   - **Invoice group** has **10 sub-columns** in this order: Invoiced (green) · **Not Inv. 3rd Party** · **Not Inv. BOQ 3rd** · **Not Inv. Service** · **Not Inv. BOQ Svc** · **Not Inv. Base** · **Total Not Inv.** (bold orange) · Inv. Progress bar. The "VO" not-yet-invoiced is split by `voCategory`: `'Service'` → Not Inv. Service, `'Third Party'` → Not Inv. 3rd Party. The "BOQ" not-yet-invoiced is split the same way: `'Service'` → Not Inv. BOQ Svc, `'Third Party'` → Not Inv. BOQ 3rd. **Total Not Inv.** = Not Inv. Service + Not Inv. BOQ Svc + Not Inv. Base (excludes both 3rd Party columns). All six clickable Not Inv. cells open the `notYetInvItems` drill-down slide-over (`notYetInvScope` / `notYetInvType` refs). Supported types: `'vo'` · `'service'` · `'3rdParty'` · `'boqService'` · `'boq3rdParty'` · `'boq'` · `'basePO'` · `null` (all). `poInvoiceSummary` accumulates `voServicePO`, `vo3rdPartyPO`, `boqServicePO`, `boq3rdPartyPO` (and their invoiced counterparts) per scope.
   - Four summary pills in the header: Total Have PO (teal) · No PO (gray) · Invoiced (green) · Not Yet Inv. (orange); plus Labour Cost (violet) and 3rd Party (blue) pills. Table scrolls horizontally (`overflow-x-auto`).
7. **Monthly Invoiced Amount** — Three-line chart: VO Invoiced (blue) + Base PO Invoiced (amber) + **BOQ Related Invoiced** (green). Breakdown table has columns: Month, VO Amount, VO Count, Base PO Amount, Base PO Count, **BOQ Amount**, **BOQ Count**, Total.
8. **BOQ Related VO Amount by Scope** — Four-way split per scope: BOQ×Have PO, BOQ×No PO, Non-BOQ×Have PO, Non-BOQ×No PO. VO items only.
9. **Ticket breakdown** — With Ticket vs Without Ticket per scope (VO items, non-draft only)
10. **Timeline metrics** — Avg days from `emailApprovedFromNokia` to `ticketApprovalDate` (VOs with both dates), overdue >30 days, approval rate (`ticketApprovalDate` count / (`ticketApprovalDate` count + `ticketNumber`-but-no-approval count))
11. **Site breakdown table** — Per-site VO counts and amounts
12. **Recent activity** — Last 8 updated VOs (VO items only)

## Monthly Invoicing View (`src/components/MonthlyInvoicing.vue`)

Dedicated view (`monthly-invoice`) for reviewing invoices per calendar month. Month picker with prev/next navigation, defaults to current month. Pagination: 25 rows per page (page resets on month change). Rows are click-to-edit via VOForm modal.

**Carry-over logic:** VOs from any prior month whose `invoiceDate` month is before `selectedMonth` AND whose `invoiceStatus` is `'To Be Sent to Nokia'` or `'Request to Nokia'` are pulled into the current view as carry-overs (`CARRYOVER_STATUSES` Set). They appear after current-month rows in the table, separated by an orange divider row, with amber row highlighting and a "↩ Prior Month" badge.

**KPI row (3–4 cards):** Total This Month (= current month + carry-over combined, gray), Variation Orders (blue, current month only), Base PO (amber, current month only), Carried Over (orange, shown only when carry-over > 0).

**Status breakdown cards:** Current month items only, grouped by `invoiceStatus` in `STATUS_ORDER`, each card shows amount, count, and a proportional progress bar (% of month total).

**Detail table columns:** Site ID · Site Name · Job No. · Description · Category · Scope · PO Number · Invoice Status · Invoice Date · Amount. Footer row shows combined total with "(X this month + Y carried over)" note.

**Export:** Includes "Carry Over" and "Invoice Month" columns in addition to the detail columns; filename `Monthly_Invoicing_YYYY-MM.xlsx`.

## Color Palette

The primary UI chrome uses `blue-600/700` for action buttons and table headers, `blue-50/100` for backgrounds and badges, `gray-*` for text and borders. Semantic color assignments:
- `blue-600/700` — all primary actions including invoice prep (InvoicePrepModal, Prep for Invoice button, Invoice Prep banner on Dashboard)
- `amber` — Base PO category indicators, Base PO summary card, Base PO financial KPI card, Base PO chart lines/bars
- `teal` — PO status indicators, PO Change Log in VOForm, Reminders Section 3 header, "Have PO" group in Dashboard PO & Invoice Summary
- `indigo` — site ID badges in activity logs and empty-state illustrations; **"To Be Sent to Nokia"** invoice status badge
- `green/yellow/red` — VO status indicators (approved / pending / rejected)
- `green/emerald` — BOQ Related indicators and chart lines; Invoiced amounts in PO & Invoice Summary
- `orange` — Reminders nav badge and Section 1 accent; carry-over items in Monthly Invoicing; "Not Yet Invoiced" in PO & Invoice Summary
- `purple` — Reminders Section 2 header and accent
- `slate` — Cancelled status indicators, cancelled notice banner in VOForm
- `violet` — Cost to Date view chrome (header, table header `bg-violet-700`, export button, Labour Cost values in Dashboard and Cost to Date)
- Do not use these colors for generic new UI chrome outside their established semantic roles.

## TableView Features

**Pagination:** 50 rows per page. Page resets on search/filter change. Footer shows "Showing X of Y [filtered (Z total)]" with first/prev/next/last buttons.

**Bulk Scope Edit:** When rows are selected, indigo "Edit Scope" button opens a modal. Pick scope from admin list → applies to all selected VOs at once. Closes and clears selection on apply.

**Column Visibility:** Toggle columns via "Columns" button. Persisted to localStorage. Reset to defaults via modal button.

**Row Selection:** Cleared automatically when search text or filters change (prevents stale multi-page selections).

**Flag with Description:** Each row has an amber flag icon button.
- **Unflagged:** clicking opens a modal to enter a reason/note, then flags the VO.
- **Flagged:** hovering shows the note as a native tooltip; clicking reopens the modal pre-filled with the existing note — "Save" updates it, "Unflag" removes the flag entirely.
- Store actions: `setFlag(id, description)` (add/update), `removeFlag(id)` (remove). State: `flaggedIds` (Set, for `.has()` checks), `flaggedNotes` (`{ [id]: string }`). Both persisted to localStorage (`flaggedVOIds`, `flaggedVONotes`).
- Flagged rows get an amber left-border highlight (`border-l-4 border-l-amber-400 bg-amber-50`).
- The "Flagged" filter button in the toolbar shows a count badge and filters to flagged rows only.

## Cost to Date View (`src/components/CostToDate.vue`)

Dedicated view (`cost-to-date`, violet-themed) for tracking labour and third party costs per job. Aggregates `labourCost` and `thirdPartyCost` from all VOs, grouped by `jobNumber + siteId + siteName`.

**KPI cards (4):** Total Jobs (unique job numbers), Total Labour Cost (violet), Total Third Party Cost (blue), Grand Total Cost (gray).

**Table columns:** Job Number · Site ID · Site Name · Labour Cost · Third Party Cost · Total Cost · VOs. Table header is violet (`bg-violet-700`). Sortable by any column (click header toggles asc/desc). Sticky footer row shows filtered totals.

**Search:** Filters rows by job number, site ID, or site name. Shows filtered count.

**Import costs:** Accepts `.xlsx/.xls/.csv`. Matches rows to VOs by `jobNumber` (preferred) or `siteId`/`siteName`. Distributes costs evenly across all matched VOs for a job (`labourCost / matchedCount`, `thirdPartyCost / matchedCount`). Shows success/error banner with per-row warnings (up to 10). Required columns: one of `Job Number`, `Site ID`, or `Site Name`.

**Download template:** Pre-fills with current job data (job number, site ID, site name, existing costs) so user can fill in updated costs and re-import.

**Export:** Downloads current (filtered + sorted) view as `Cost_to_Date_DD-MM-YYYY.xlsx`.

## Site Status View (`src/components/SiteStatusView.vue`)

Dedicated view (`site-status`, emerald-themed) for tracking construction progress per site. Data persists entirely in `localStorage` under `siteStatusData` — a plain object keyed by `"siteId|jobNumber"`.

**Data model per entry:** `siteId`, `siteName`, `jobNumber`, `status` (`'started'|'not-started'`, default `'not-started'`), `costToComplete` (numeric, default `0`), `comment` (string).

**Sync from Variations** button — async with a 3-second loading delay. Button disables and shows a spinning icon + `"Syncing…"` label while running. Scans all VOs for unique `siteId + jobNumber` combos and adds any that don't yet exist. Existing entries are updated (site name / job number refreshed) but their `status`, `costToComplete`, and `comment` are preserved. Two categories of VOs are always excluded from sync:
- `voCategory` is `"Detail Site Survey"` (case-insensitive)
- `siteId` or `jobNumber` is blank, `"NA"`, or `"N/A"` (checked via `isNA()` helper, case-insensitive)

**Delete All** button — red-bordered, disabled when no sites exist. Opens a confirmation modal showing the count of entries to be removed. Confirming wipes all entries from `siteStatusData` in localStorage immediately.

**Status toggle** — clicking the Started / Not Started pill on a row flips `status` immediately and persists. Emerald = started, amber = not started. Left border accent follows the same color.

**Inline editing** — clicking any cost or comment cell (or the edit pencil) puts that row into edit mode. Enter saves, Escape cancels. Cost input strips formatting on focus and reformats as AUD on blur.

**KPI cards (4):** Total Sites · Started (count + total cost to complete) · Not Started (count + total cost to complete) · Total Cost to Complete.

**Filter bar:** Text search (site ID / name / job) + All / Started / Not Started toggle buttons.

**Export:** Downloads filtered view as `Site_Status_YYYY-MM-DD.xlsx` with columns: Site ID, Site Name, Job Number, Status, Cost to Complete, Comment.

**Dashboard integration (planned):** `siteStatusData` in localStorage is the source of truth for a future dashboard toggle to split VO values by started vs not-started sites.

## Admin View Features

**Sync from VOs:** (Indigo button, Sites tab) Pulls site/job data from all existing VOs and offers to add or override duplicates.
- **New sites:** Added immediately
- **Conflicts:** Matched by `jobNumber` (if both have one) or `siteId + siteName`. One modal decision applies to **all** conflicts at once:
  - **"Add New Only (skip conflicts)"** — adds new sites, leaves conflicting existing sites unchanged
  - **"Add New + Override All"** — adds new sites AND replaces all conflicting entries with VO data (comment field is preserved)
- Deduplication: same job number or same siteId+siteName blocks duplicate syncing

## Import / Export View Layout

- **Left column card** — Export Data (Excel + CSV buttons) stacked above Import Data (file drop zone + 3-step preview/confirm flow), separated by a thin divider within the same card.
- **Right column card** — Import Template (download blank xlsx + required/optional column reference).
- **Full-width card** — Backup & Restore (Export Backup left / Restore Backup right, divided by a vertical rule). Restore button uses amber to signal destructive action.
