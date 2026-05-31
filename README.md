# Variation Tracker

Variation Tracker is a Vue 3 single-page app used to manage variation orders (VOs), invoice progress, site status, reminders, cost tracking, and P&L reporting.

## Quick Start

```bash
npm install
npm run dev
```

Dev server runs on `http://localhost:5100` and opens automatically.

### Available Scripts

```bash
npm run dev       # Start dev server
npm run build     # Production build to dist/ with sourcemaps
npm run preview   # Preview production build locally
```

No test runner or linter is currently configured.

## Tech Stack

- Vue 3 + Vite
- Tailwind CSS
- IndexedDB (primary VO/Issue Log persistence)
- localStorage (UI/app state + admin/config data)
- Chart.js (`vue-chartjs`) for dashboards
- SheetJS (`xlsx`) for import/export flows

## Application Architecture

- Main state lives in `src/stores/voStore.js` via `useVOStore()`.
- Views are keyed by app view names such as:
  - `dashboard`
  - `table`
  - `invoice-list`
  - `monthly-invoice`
  - `po-received-summary`
  - `reminders`
  - `cost-to-date`
  - `pl`
  - `site-status`
  - `issue-log`
  - `import-export`
  - `admin`
- Shared utilities:
  - `src/utils/formatters.js`
  - `src/utils/logger.js`
  - `src/utils/import.js`
  - `src/utils/export.js`
  - `src/utils/backup.js`

## Data Persistence Model

### IndexedDB

Database: `VariationTrackerDB` (v4)

- `variations` store: VO records
- `issueLogs` store: issue log records

Reference: `DATABASE_DIAGRAM.md`

### localStorage

Used for UI and app-level data, including:

- active view/tab state (including `currentView`)
- invoice prep IDs
- activity log (`voActivityLog`)
- flags (`flaggedVOIds`, `flaggedVONotes`)
- admin master data (`globalData`: sites/categories/scopes/settings)
- site status data (`siteStatusData`)
- feature-specific settings/history (for example cost import and P&L preferences)

## Core VO Data Model

Primary fields include:

- identity: `id`, `createdAt`, `updatedAt`
- site/job: `siteId`, `siteName`, `jobNumber`, `scope`
- VO details: `voDescription`, `voAmount`, `voCategory`, `comment`
- tracking: `voStatus`, `ticketNumber`, `ticketSubmissionDate`, `ticketApprovalDate`, `emailSentToNokia`, `emailApprovedFromNokia`
- PO/invoice: `poNumber`, `poReceivedDate`, `invoiceStatus`, `invoiceDate`, `invoiceLog`, `poLog`
- costing: `labourCost`, `thirdPartyCost`
- flags/classification: `boqRelated`, `isDuplicate`

## Critical Business Rules

- `isDuplicate === true` rows stay in table/export flows, but must be excluded from dashboard/store summary metrics.
- Invoiced VO definition: `invoiceStatus === 'SIT Completed'` **and** `invoiceDate` exists.
- Invoice statuses (ordered):
  - `Not Yet Sent`
  - `To Be Sent to Nokia`
  - `Request to Nokia`
  - `SIT Approved`
  - `SIT Completed`
- Base PO categories:
  - `Site Survey`, `WOP`, `C&I`, `SAT&SIT`, `Snag Closure`
- `Detail Site Survey` is tracked separately in dashboard reporting and must not be rolled into Base PO totals.
- BOQ-related VOs are treated as their own reporting segment and have separate status behavior.
- `rejected` and `cancelled` statuses are protected from auto-status overrides.
- Cancelling a VO:
  - sets amount to `0`
  - clears ticket/timeline fields
  - writes a synthetic cancellation note to activity history

## Major Feature Areas

- **Dashboard**: status + financial KPIs, PO/invoice summary by scope, cost-to-complete summaries, monthly charts, timeline/site analytics.
- **Table View**: filtering, pagination, bulk scope edit, duplicate toggle, row flags, column visibility, export menus.
- **Invoice Prep + Invoice List**: prep queue from selected rows, bulk invoice status updates with append-only invoice logs.
- **Monthly Invoicing**: current month plus carry-over handling for selected statuses.
- **PO Received Summary**: grouped by PO received date (with `poLog` fallback).
- **Reminders**: four watchlist sections with urgency buckets and exports.
- **Issue Log**: separate site issue tracking with admin-linked site/scope constraints.
- **Cost to Date**: labour/third-party aggregation + import workflow with progress and rollback on cancel.
- **P&L**: grouped site/job profitability with manual deductions/comments and optional cost-to-complete inclusion.
- **Site Status**: status tracking and multi-entry cost-to-complete model per site/job.
- **Import / Export**: VO import, invoice status import, ticket updates, templates, and backups.
- **Admin**: master data management and routine JSON backup scheduler settings.

## Import, Export, and Backup

- VO import supports `.xlsx/.xls/.csv` with row-level warnings and duplicate checks.
- Invoice Status Import matches by PO number and can update both invoice status and VO amount on mismatch rows.
- Ticket Update Import matches by VO description + amount tolerance and protects rejected/cancelled records.
- Full backup format is restore-ready JSON with `_version: 3` and full app snapshot coverage.
- Restore clears IndexedDB, re-inserts VOs preserving IDs, restores localStorage data, then reloads store state.

## Project Structure

```text
src/
  components/        # All main feature views and UI modules
  stores/            # useVOStore composable
  db/                # IndexedDB wrapper
  utils/             # format/import/export/logging/backup helpers
  App.vue            # App shell
  main.js            # App bootstrap
```

## Key Docs

- `AGENTS.md` - detailed behavior and implementation rules
- `DATABASE_DIAGRAM.md` - persistence schema map
- `DASHBOARD_LOGIC.md` - dashboard-specific reference details
- `CHANGELOG.md` - change history
