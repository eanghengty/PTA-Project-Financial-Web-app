# Changelog

All notable changes to Variation Tracker are recorded here.

---

## [Unreleased]

---

## 2026-05-05 — Site Status: copy-from-last-site suggestion banner

### Added — `src/components/SiteStatusView.vue`

**Script**
- `lastSavedInfo = ref(null)` — stores `{ siteKey, siteId, siteName, entry }` after saving a site with entries. Persists in memory during the page session (resets on full page reload).
- `copyBannerDismissed = ref(false)` — tracks whether the banner was dismissed for the current modal session; reset to false each time `startEdit()` opens a new site.
- `showCopyBanner` computed — true when `lastSavedInfo` is set, the current editing site is different from the last saved site, and the banner hasn't been dismissed.
- **`saveEditModal()`** updated — after saving a site's entries, sets `lastSavedInfo` to the last entry from the saved site (entry at `d.costEntries[d.costEntries.length - 1]`).
- **`startEdit(row)`** updated — resets `copyBannerDismissed` to false on each modal open.
- **`copySuggestedEntry()`** — appends the last saved entry to `editEntries` with a new ID and cleared date (date is site-specific, left for user to fill in). Marks banner as dismissed.

**Template**
- Blue suggestion banner at the top of the modal body (above cost entries section). Shows:
  - Copy source: "Copy latest entry from [Site ID]?"
  - Entry formula preview: days × hours × people × rate/hr = total cost
  - Two buttons: "Copy" (blue) and dismiss (X)
- Dismiss button immediately hides the banner; Copy button adds the entry and then dismisses.

### Changed — `CLAUDE.md`

Added **Copy-from-last-site banner** paragraph to Site Status View section.

---

## 2026-05-04 — Site Status: inline edit for existing cost entries

### Changed — `src/components/SiteStatusView.vue`

**Script**
- `editingEntryId = ref(null)` — tracks the `id` of the entry currently being edited in the modal (`null` = add mode).
- `startEdit()` now resets `editingEntryId` to `null` when the modal opens.
- **`startEditEntry(entry)`** — enters edit mode: sets `editingEntryId` to the entry's id and populates `newEntry` with the entry's label, date, days, hours, people, and rate (rate formatted as AUD with 2 dp).
- **`cancelEntryEdit()`** — clears `editingEntryId` and resets `newEntry` to blank; returns form to add mode.
- **`updateCostEntry()`** — parses the form fields, finds the entry by `editingEntryId` in `editEntries`, replaces it in-place preserving the original `id`, then calls `cancelEntryEdit()`.
- `removeCostEntry(id)` — now also calls `cancelEntryEdit()` if the deleted entry is the one currently being edited.

**Template**
- Each existing entry card now has a **pencil (edit) icon** button alongside the existing trash button.
  - Active (editing) state: amber border + `ring-1 ring-amber-300`, numbered badge turns amber, "editing" pill badge appears, pencil button highlighted amber.
  - Idle state: emerald styling unchanged; pencil button is a dimmed gray that turns amber on hover.
- The Add Entry form panel is now a dual-mode panel:
  - **Add mode** — emerald dashed border, title "Add Entry", green "+ Add Entry" button (disabled when cost = 0).
  - **Edit mode** — amber solid border + ring, title "Edit Entry", "Cancel edit" link top-right, amber "✓ Update Entry" button (always enabled in edit mode).
  - Mode switches reactively on `editingEntryId`.

### Changed — `CLAUDE.md`

Updated **Edit modal** paragraph in Site Status View to document the pencil edit button, dual-mode Add/Edit form, amber highlight behaviour, `editingEntryId` ref, `startEditEntry`, `cancelEntryEdit`, and `updateCostEntry`.

---

## 2026-05-04 — Dashboard: fix stale Cost to Complete (live reactivity without reload)

### Changed — `src/components/SiteStatusView.vue`

- `save()` now dispatches `window.dispatchEvent(new Event('siteStatusUpdated'))` after every `localStorage.setItem`. This fires on status toggle, modal save, sync, import, and delete-all.

### Changed — `src/components/Dashboard.vue`

- **`siteStatusRevision = ref(0)`** — reactive counter. `onMounted` registers a `siteStatusUpdated` listener that increments it; `onUnmounted` removes the listener.
- `ctcAllMonths`, `costToCompleteByScope`, `filteredSiteKeys`, and `monthlyCostToCompleteData` all begin with `void siteStatusRevision.value` to declare a reactive dependency on the counter. Vue re-runs these computeds immediately whenever Site Status saves data — no page reload required.
- Added `onMounted` and `onUnmounted` to the `vue` import.

---

## 2026-05-04 — Dashboard: sticky Scope column + fix Invoice colspan + single month toggle

### Changed — `src/components/Dashboard.vue`

**Sticky Scope column**
- `<th rowspan="2">Scope</th>` now has `sticky left-0 z-20 bg-white` + a subtle right-side `box-shadow` separator.
- Every Scope `<td>` in `<tbody>` and the "Total" `<td>` in `<tfoot>` have `sticky left-0 z-10 bg-white` + the same shadow, so the column stays visible during horizontal scroll.

**Invoice colspan bug fix**
- Invoice group header had `colspan=11` but contains exactly 9 sub-columns (Invoiced · Not Inv. 3rd Party · Not Inv. BOQ 3rd · Not Inv. Service · Not Inv. BOQ Svc · Not Inv. Base · Total Service Not Inv. · Total 3rd Party Not Inv. · Inv. Progress). The 2-column over-count caused Labour and 3rd Party to render under the Invoice banner, and the "All Months" chip to appear under Cost to Date instead of Cost to Complete. Fixed to `colspan=9`.

**Single month toggle — moved to filter bar**
- Removed the month `<select>` that was embedded inside the Cost to Complete header pill.
- Removed the month `<select>` that was inside the Cost to Complete column sub-header.
- Added one month `<select>` (calendar icon, "All Months" default, emerald when active) directly to the right of the All Sites / Started / Not Started toggle group in the card header. Both controls are wrapped in the same `@click.stop` zone so they don't collapse the accordion.
- The Cost to Complete column sub-header now shows a **read-only chip** reflecting the active selection (`All Months` in gray when unset, month label in an emerald pill when set).
- The Cost to Complete header pill shows only the total value — no embedded dropdown.

---

## 2026-05-04 — Admin View: replace emoji tab icons with Material Design SVG

### Changed — `src/components/AdminView.vue`

- **Tab icons** — removed all emoji characters (`📍 📂 🎯 🕓 ⚙️`) from the `tabs` array. Each tab's `icon` field now holds a raw Material Design SVG `<path d="…">` string. Template renders `<svg fill="currentColor" viewBox="0 0 24 24"><path :d="tab.icon"/></svg>` so icons inherit the button's active/inactive colour automatically.
  - Sites → `place` (location pin)
  - Categories → `folder`
  - Scopes → `my_location` (crosshair)
  - Activity Log → `history` (clock with arrow)
  - Settings → `settings` (gear)
- **Log comment** — replaced `💬` emoji prefix with an inline Material `chat_bubble` SVG icon aligned to the first text line.

### Changed — `CLAUDE.md`

Added **Tab icons** paragraph to Admin View Features section documenting the Material Design icon approach and the absence of emoji.

---

## 2026-05-04 — Site Status: filter summary row above table header

### Added — `src/components/SiteStatusView.vue`

- **`isFiltered` computed** — `true` when any of the three filters (status, scope, search) is active.
- **`filterSummary` computed** — aggregates `filteredRows` into `{ count, total, started, notStarted, costToComplete }`.
- **Filter summary row** — conditional `<tr v-if="isFiltered">` inserted as the first row inside `<thead>`, appearing above the green column-header row whenever any filter is active.
  - **Left side:** active filter chips (status, scope, search text) each with an `×` dismiss button, plus a "Clear all" link that resets all three at once.
  - **Right side:** `N of M sites` · emerald dot + started count · amber dot + not-started count · blue total cost to complete — all scoped to the current filtered set.
  - Row disappears automatically when all filters are cleared.

### Changed — `CLAUDE.md`

Added **Filter summary row** paragraph to Site Status View section.

---

## 2026-05-04 — Site Status: scope sync, scope column, scope filter

### Added — `src/components/SiteStatusView.vue`

- **`scopes` field in data model** — string array stored per site entry. Always refreshed from VOs on sync; never manually editable. Existing entries that pre-date this change default to `[]`.
- **Scope sync in `syncFromVOs`** — before iterating sites, builds a `scopeMap` (`key → Set<scope>`) from all non-Downtime VOs. For new rows `scopes` is set at creation; for existing rows `scopes` is always overwritten with the latest VO data. Downtime row collects all unique scopes from Downtime VOs.
- **Scope column** — new read-only column after Status. Displays scopes as small emerald-tinted badges (`bg-emerald-50 text-emerald-700 border-emerald-200`); `—` when empty. Column count: 12 → 13.
- **`scopeFilter` ref** — `'all'` by default.
- **`allScopes` computed** — sorted unique scopes across all rows.
- **Scope filter dropdown** — placed after the status toggle group in the filter bar. Lists `All Scopes` plus each value from `allScopes`. Turns emerald (`border-emerald-300 bg-emerald-50 text-emerald-700`) when a scope is selected. Combinable with status filter and search.
- Footer "(filtered)" label now also triggers when scope filter is active.

### Changed — `CLAUDE.md`

Updated Site Status View data model, sync rules, filter bar, and table columns description.

---

## 2026-05-04 — Site Status: Import Status feature

### Added — `src/components/SiteStatusView.vue`

Two new header toolbar buttons:

- **Template button** — calls `downloadImportTemplate()`. Downloads `Site_Status_Import_Template.xlsx` with columns `Site ID` and `Status`, pre-filled from all current rows. If no rows exist, ships two labelled example rows.
- **Import Status button** — triggers a hidden `<input type="file" accept=".xlsx,.xls,.csv">`. On file select, `handleImportFile()` runs:
  - Parses file via SheetJS.
  - Builds a case-insensitive `siteIndex` map from `siteData` (`siteId → storage key`).
  - For each data row: normalises the Status cell (`Started/Yes/1/True/start` → `started`; `Not Started/Not-Started/No/0/False` → `not-started`). Rows with blank Site ID are skipped silently; unrecognised status values are marked `skipped`.
  - Calls `save()` after all valid updates.
  - File input value is reset so the same file can be re-imported.

**Import result log panel** — appears above KPI cards after import, dismissed with ✕:
- Summary pills: **X updated** (emerald) · **Y not found** (red) · **Z skipped — invalid status** (amber).
- Per-row entries: green bg = updated (struck-through old → new status); red bg = not found; amber bg = skipped (raw value in monospace). Each entry shows the original file row number.
- Computed: `importUpdated`, `importNotFound`, `importSkipped` from `importLog` array.

### Changed — `CLAUDE.md`

Added **Import Status** section to Site Status View.

---

## 2026-05-04 — Site Status: VO Qty column and detail slide-over

### Added — `src/components/SiteStatusView.vue`

- **VO Qty column** — new column between Rate and Cost to Complete. Shows a blue pill badge (`bg-blue-100 text-blue-700`) with the count of VOs linked to the row. Disabled/gray when count is 0. Clicking calls `openVODrawer(row)`.
- **`voItemsFor(row)`** — returns VOs matching the row: all VOs where `siteId === 'Downtime'` for the Downtime row; `siteId + jobNumber` match for all others.
- **`voCountFor(row)`** — returns `voItemsFor(row).length`.
- **`voDrawerItems`** computed — `voItemsFor(voDrawerRow.value)`.
- **`voDrawerStatusCounts`** computed — `{ [status]: count }` map for the current drawer.
- **`openVODrawer(row)`** — sets `voDrawerRow` and opens the drawer.
- **VO detail slide-over** (`<teleport to="body">`, `<transition name="drawer">`):
  - Emerald header: site ID badge, site name, VO count, job number.
  - Summary bar: total VO amount (emerald pill) + per-status count badges with semantic colours.
  - Scrollable VO list: description, category badge, scope, PO (teal), ticket number, amount (struck-through if cancelled), status badge, invoice status + date if set.
  - Backdrop click or ✕ button closes.
- Added `<style scoped>` CSS transition: `drawer-enter/leave` slides the panel from the right and fades the backdrop.
- Imports `formatStatus`, `formatDate` from `../utils/formatters`.

### Changed — `CLAUDE.md`

Added **VO Qty column** section to Site Status View.

---

## 2026-05-04 — Site Status: Downtime VO consolidation in sync

### Changed — `src/components/SiteStatusView.vue` (`syncFromVOs`)

- VOs are now split into `downtimeVOs` (where `siteId === 'Downtime'`) and `otherVOs` before processing.
- **Downtime VOs** — regardless of jobNumber or blank-field rules, all Downtime VOs produce exactly **one** site row with key `"Downtime|"`, `siteId = 'Downtime'`, `siteName = 'Downtime'`, `jobNumber = ''`. On first sync the row is created; on subsequent syncs the existing row is preserved (manually entered values kept), only `scopes` is refreshed.
- **Other VOs** — unchanged one-row-per-`siteId+jobNumber` logic, but now iterated from `otherVOs` instead of the full array.

### Changed — `CLAUDE.md`

Added Downtime special case to Site Status View sync rules.

---

## 2026-05-04 — Site Status: cost-to-complete calculation fields

### Changed — `src/components/SiteStatusView.vue`

Replaced the single manually-entered `costToComplete` field with four input fields whose product is the computed cost:

- **New fields stored per entry:** `qtyDays`, `qtyHours`, `qtyPeople`, `rate` (all numeric, default `0`).
- **`costToComplete` is now derived** (`qtyDays × qtyHours × qtyPeople × rate`) inside the `rows` computed; it is no longer stored in `siteStatusData`.
- **Table columns added:** Days · Hours · People · Rate (all right-aligned, editable inline via `type="number"` or currency-formatted text input). Cost to Complete cell is now read-only.
- **`editForm`** updated to `{ qtyDays, qtyHours, qtyPeople, rate, comment }`. `startEdit` and `saveEdit` updated accordingly.
- **`syncFromVOs`** initialises all four new fields to `0` for newly created rows.
- **`formatRateInput` / `rawRateInput`** — blur/focus handlers for the Rate input (AUD comma-format on blur, raw number on focus).
- **Export** — updated column list: Days · Hours · People · Rate · Cost to Complete (calculated value).
- Old `formatCostInput` / `rawCostInput` removed (replaced by rate equivalents).

### Changed — `CLAUDE.md`

Updated Site Status View data model and inline editing description.

---

## 2026-05-03 — Fix Dashboard timeline metrics logic

### Changed — `src/stores/voStore.js` (`timelineMetrics` computed)

**Avg Days to Approval** — was measuring `emailSentToNokia → emailApprovedFromNokia`. Now correctly measures `emailApprovedFromNokia → ticketApprovalDate`. Only VOs where both dates are present contribute to the average. `Math.max(0, ...)` guards against negative values from out-of-order date entry.

**Approval Rate** — was `approved VOs / total VOs`. Now correctly measures ticket approval rate: `ticketApprovalDate count / (ticketApprovalDate count + ticketNumber-but-no-ticketApprovalDate count)`. Returns 0 when no VOs have a ticket number at all.

### Changed — `CLAUDE.md`

Updated Dashboard section 10 description to reflect the corrected metric logic.

### Changed — `DASHBOARD_LOGIC.md`

Updated Section 10 table with precise field definitions for all three timeline metric cards.

---

## 2026-05-03 — Site Status: Delete All button & sync loading state

### Changed — `src/components/SiteStatusView.vue`

- **Sync loading state** — `syncFromVOs` converted to `async`. Waits 3 seconds before processing (via `setTimeout` promise). Button disables during the wait and shows a spinning icon + `"Syncing…"` label. New `syncing` ref drives both the disabled state and the label swap.
- **Delete All button** — new red-bordered button in the header toolbar. Disabled (opacity-40) when no sites exist. Clicking opens a confirmation modal (`showDeleteConfirm` ref) that shows the total count of entries to be removed. Confirming calls `deleteAll()` which clears `siteData` and writes an empty object to `localStorage['siteStatusData']`. Cancelling closes the modal without changes. Success message `"All site entries deleted."` shown in the sync banner.

### Changed — `CLAUDE.md`

Updated Site Status View sync and delete descriptions to reflect the 3-second loading UX and the Delete All confirmation flow.

---

## 2026-05-03 — Site Status sync exclusion rules

### Changed — `src/components/SiteStatusView.vue`

Updated `syncFromVOs()` to skip VOs that should not produce site entries:

- **Detail Site Survey category** — VOs where `voCategory` is `"Detail Site Survey"` (case-insensitive) are excluded.
- **NA site or job** — VOs where `siteId` or `jobNumber` is blank, `"NA"`, or `"N/A"` are excluded. Checked via new `isNA()` helper (trims whitespace, uppercases before comparing).

These guards apply only at sync time; manually created site entries are unaffected.

### Changed — `CLAUDE.md`

Updated Site Status View sync description to document the two exclusion rules and the `isNA()` helper.

---

## 2026-05-03

### Added — Site Status view (`src/components/SiteStatusView.vue`)

New navigation tab **Site Status** (map-pin icon, between Cost to Date and Import/Export).

- **Sync from Variations** — pulls unique site ID + site name + job number combos from all VO records into a separate site registry. Existing entries are not overwritten (status/cost/comment preserved); only names/job numbers are refreshed.
- **Started / Not Started toggle** — click the pill on any row to flip status. Persists immediately to `localStorage['siteStatusData']`.
- **Cost to Complete** — inline-editable numeric field per site. Formats as AUD on blur.
- **Comment** — inline-editable free-text field per site.
- **4 KPI cards** — Total Sites, Started (count + cost to complete), Not Started (count + cost to complete), Total Cost to Complete.
- **Filter bar** — text search by site ID / name / job, plus All / Started / Not Started filter buttons.
- **Export** — downloads the filtered view as `Site_Status_YYYY-MM-DD.xlsx`.
- Storage: `localStorage['siteStatusData']` — keyed by `"siteId|jobNumber"`.

### Changed — `App.vue`

- Added `site-status` to `VALID_VIEWS`, `viewMap`, and `navItems`.
- Added `SiteStatusView` import and `IconSiteStatus` inline SVG.

### Changed — `CLAUDE.md`

- Updated available views list to include `site-status`.
- Added `siteStatusData` to the localStorage persistence list.
- Added full **Site Status View** section documenting data model, sync behaviour, inline editing, KPIs, filtering, export, and planned dashboard integration.

---

## 2026-05-03 — v1.0 initial commit

- First stable release (`ca7b0c0`). Full feature set including Dashboard, Variations table, Invoice Prep, Monthly Invoicing, Reminders, Cost to Date, Import/Export, and Admin views.
