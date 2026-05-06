# Changelog

All notable changes to the Variation Tracker are recorded here.
Format: `## YYYY-MM-DD — <summary>` with sub-sections for **Added**, **Fixed**, and **Changed**.

---

## 2026-05-06 - P&L view

### Added
- **P&L view** (`PLView.vue`): new site/job-level table synced from Variation records. Groups by Site ID, Site Name, and Job; shows total VO quantity, total VO amount, SIT Completed invoice amount, not-yet-invoiced amount, Cost to Date, and P&L calculated as `Total PO - Cost to Date`.
- Added the **P&L** tab to the main navigation and persisted view list in `App.vue`.

### Changed
- **Dashboard › Invoice by Site detail modal** (`Dashboard.vue`): clicking a site now shows grouped detail sections with category totals for VO - Service (non-BOQ), VO - Third Party (non-BOQ), BOQ Related, and Base PO.
- **P&L view** (`PLView.vue`): Total Invoice Amount and Not Yet Invoice Amount cells are now clickable and open a detail modal for the selected site/job.
- **P&L view › Not Yet Invoice detail** (`PLView.vue`): modal summary now splits the selected not-yet-invoiced amount into Has PO and No PO amounts.

---

## 2026-05-05 — Dashboard site filter propagation & Cost to Date import history

### Fixed
- **Dashboard › PO & Invoice Summary — No PO slide-over** (`Dashboard.vue` `noPOItems` computed): the drill-down panel now applies `voMatchesSiteFilter` so it only shows items matching the active Started / Not Started site toggle. Previously it always showed all sites regardless of the filter.
- **Dashboard › PO & Invoice Summary — Not Yet Invoiced slide-over** (`Dashboard.vue` `notYetInvItems` computed): same fix — slide-over now respects the Started / Not Started toggle via `voMatchesSiteFilter`.
- **Dashboard › PO & Invoice Summary — Cost to Complete column** (`Dashboard.vue` `costToCompleteByScope` computed): column values, per-row cells, and the header pill now update when the site status toggle changes. Previously the column always summed all sites regardless of the filter. Fix: iterate `Object.entries(raw)` and skip keys absent from `filteredSiteKeys` when a filter is active.

### Added
- **Cost to Date › Import History panel** (`CostToDate.vue`): collapsible section that logs every successful cost import. Each record stores filename, timestamp, total labour, total third party, grand total (snapshot of all VOs at import time), and VOs updated count. The **Delta** column shows the change in grand total vs the previous import — green for increase, red for decrease, "baseline" for the oldest entry. Persists to `localStorage` key `ctdImportHistory`. Auto-opens after each import. Includes "Clear history" button (confirmation required).

---

## 2026-05-05 — Remove nested git repository

### Changed
- Removed nested git repository and added `.gitignore` (`50db286`).

---

## 2026-05-05 — Latest working state commit

### Changed
- Committed latest working state across all views (`3ea3151`).

---

## 2026-05-04 — Status view and dashboard updates

### Changed
- Updated status view and dashboard logic including site status filter integration and PO & Invoice Summary refinements (`09b76a6`).
- Updated all relevant MD files to reflect architectural changes (`4876b94`).

---

## 2026-05-04 — Cost to complete view and logic

### Added
- Cost to Complete column in Dashboard PO & Invoice Summary, reading `siteStatusData` from localStorage via `costToCompleteByScope` computed (`2a263ab`).

---

## 2026-05-03 — Dashboard section 10 and full dashboard logic

### Added
- Minor dashboard logic update for section 10 (ticket breakdown) (`75a2c98`).
- Full dashboard logic implementation across all sections (`d8422d0`).
- Site Status view and initial changelog (`20713d2`).

---

## 2026-05-02 — v1.0 usable release

### Added
- Initial usable release of Variation Tracker with core views: Dashboard, Table, Invoice List, Monthly Invoicing, Reminders, Cost to Date, Site Status, Import/Export, Admin (`ca7b0c0`).
