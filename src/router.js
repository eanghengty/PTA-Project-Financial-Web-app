import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from './components/Dashboard.vue'
import TableView from './components/TableView.vue'
import ImportExport from './components/ImportExport.vue'
import AdminView from './components/AdminView.vue'
import InvoiceList from './components/InvoiceList.vue'
import ReminderView from './components/ReminderView.vue'
import MonthlyInvoicing from './components/MonthlyInvoicing.vue'
import CostToDate from './components/CostToDate.vue'
import PLView from './components/PLView.vue'
import SiteStatusView from './components/SiteStatusView.vue'
import IssueLogView from './components/IssueLogView.vue'
import POReceivedSummary from './components/POReceivedSummary.vue'
import POSupplierBreakdown from './components/POSupplierBreakdown.vue'

export const VIEW_PATHS = {
  dashboard: '/dashboard',
  table: '/table',
  'invoice-list': '/invoice-list',
  'monthly-invoice': '/monthly-invoice',
  'po-received-summary': '/po-received-summary',
  'po-supplier-breakdown': '/po-supplier-breakdown',
  reminders: '/reminders',
  'cost-to-date': '/cost-to-date',
  pl: '/pl',
  'site-status': '/site-status',
  'issue-log': '/issue-log',
  'import-export': '/import-export',
  admin: '/admin',
}

const DEFAULT_VIEW = 'dashboard'

function getSavedView() {
  const saved = localStorage.getItem('currentView')
  return VIEW_PATHS[saved] ? saved : DEFAULT_VIEW
}

const routes = [
  { path: '/', redirect: () => VIEW_PATHS[getSavedView()] },
  { path: VIEW_PATHS.dashboard, component: Dashboard, meta: { viewKey: 'dashboard' } },
  { path: VIEW_PATHS.table, component: TableView, meta: { viewKey: 'table' } },
  { path: VIEW_PATHS['invoice-list'], component: InvoiceList, meta: { viewKey: 'invoice-list' } },
  { path: VIEW_PATHS['monthly-invoice'], component: MonthlyInvoicing, meta: { viewKey: 'monthly-invoice' } },
  { path: VIEW_PATHS['po-received-summary'], component: POReceivedSummary, meta: { viewKey: 'po-received-summary' } },
  { path: VIEW_PATHS['po-supplier-breakdown'], component: POSupplierBreakdown, meta: { viewKey: 'po-supplier-breakdown' } },
  { path: VIEW_PATHS.reminders, component: ReminderView, meta: { viewKey: 'reminders' } },
  { path: VIEW_PATHS['cost-to-date'], component: CostToDate, meta: { viewKey: 'cost-to-date' } },
  { path: VIEW_PATHS.pl, component: PLView, meta: { viewKey: 'pl' } },
  { path: VIEW_PATHS['site-status'], component: SiteStatusView, meta: { viewKey: 'site-status' } },
  { path: VIEW_PATHS['issue-log'], component: IssueLogView, meta: { viewKey: 'issue-log' } },
  { path: VIEW_PATHS['import-export'], component: ImportExport, meta: { viewKey: 'import-export' } },
  { path: VIEW_PATHS.admin, component: AdminView, meta: { viewKey: 'admin' } },
  { path: '/:pathMatch(.*)*', redirect: () => VIEW_PATHS[getSavedView()] },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
