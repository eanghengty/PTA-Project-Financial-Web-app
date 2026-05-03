# Changelog

All notable changes to Variation Tracker are recorded here.

---

## [Unreleased]

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
