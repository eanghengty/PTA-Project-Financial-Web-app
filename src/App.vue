<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">

    <!-- ── Top navbar ── -->
    <header class="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div class="w-full px-4 lg:px-6 h-14 flex items-center gap-4">

        <!-- Brand -->
        <div class="flex items-center gap-2.5 shrink-0 pr-3 border-r border-gray-200">
          <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-sm shrink-0">
            <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <div class="leading-tight hidden lg:block">
            <p class="text-sm font-bold text-gray-900 tracking-tight whitespace-nowrap">Variation Tracker</p>
            <p class="text-[9px] text-gray-400 font-medium uppercase tracking-widest">SkyAus Infrastructure</p>
          </div>
        </div>

        <!-- Nav items -->
        <nav class="flex items-center gap-0.5 flex-1 min-w-0">
          <button v-for="item in navItems" :key="item.key"
            @click="currentView = item.key"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap"
            :class="currentView === item.key
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'">
            <component :is="item.icon" class="w-3.5 h-3.5 shrink-0" />
            <span class="hidden sm:inline">{{ item.label }}</span>
            <!-- Badge for Variations count -->
            <span v-if="item.key === 'table' && voCount > 0"
              class="px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none"
              :class="currentView === 'table' ? 'bg-white/25 text-white' : 'bg-gray-200 text-gray-600'">
              {{ voCount }}
            </span>
            <!-- Badge for Invoice Prep count -->
            <span v-if="item.key === 'invoice-list' && invoicePrepCount > 0"
              class="px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none"
              :class="currentView === 'invoice-list' ? 'bg-white/25 text-white' : 'bg-purple-100 text-purple-700'">
              {{ invoicePrepCount }}
            </span>
            <!-- Badge for Reminder count -->
            <span v-if="item.key === 'reminders' && reminderCount > 0"
              class="px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none"
              :class="currentView === 'reminders' ? 'bg-white/25 text-white' : 'bg-orange-100 text-orange-700'">
              {{ reminderCount }}
            </span>
          </button>
        </nav>

        <!-- Right slot: date -->
        <div class="shrink-0 text-right hidden xl:block pl-3 border-l border-gray-200">
          <p class="text-[11px] text-gray-400 whitespace-nowrap">{{ today }}</p>
          <p class="text-[11px] font-semibold text-gray-600 whitespace-nowrap">{{ voCount }} total VOs</p>
        </div>

      </div>
    </header>

    <!-- ── Page content ── -->
    <main class="flex-1 w-full px-4 lg:px-6 py-6">
      <KeepAlive>
        <component :is="currentComponent" />
      </KeepAlive>
    </main>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, h } from 'vue'
import Dashboard         from './components/Dashboard.vue'
import TableView         from './components/TableView.vue'
import ImportExport      from './components/ImportExport.vue'
import AdminView         from './components/AdminView.vue'
import InvoiceList       from './components/InvoiceList.vue'
import ReminderView      from './components/ReminderView.vue'
import MonthlyInvoicing  from './components/MonthlyInvoicing.vue'
import CostToDate        from './components/CostToDate.vue'
import { useVOStore } from './stores/voStore'

const VALID_VIEWS = ['dashboard', 'table', 'invoice-list', 'monthly-invoice', 'reminders', 'cost-to-date', 'import-export', 'admin']
const saved = localStorage.getItem('currentView')
const currentView = ref(VALID_VIEWS.includes(saved) ? saved : 'dashboard')

const store = useVOStore()

// Persist active view on every change
watch(currentView, v => localStorage.setItem('currentView', v))

// Map view key → component (used by <component :is>)
const viewMap = { dashboard: Dashboard, table: TableView, 'invoice-list': InvoiceList, 'monthly-invoice': MonthlyInvoicing, reminders: ReminderView, 'cost-to-date': CostToDate, 'import-export': ImportExport, admin: AdminView }
const currentComponent = computed(() => viewMap[currentView.value] ?? Dashboard)

const voCount = computed(() => store.vos.value?.length || 0)
const invoicePrepCount = computed(() => store.invoicePrepSummary.value?.count || 0)

const BASE_PO_CATEGORIES = new Set(['Site Survey', 'WOP', 'C&I', 'SAT&SIT', 'Snag Closure'])
const reminderCount = computed(() =>
  (store.vos.value || []).filter(vo => {
    if (BASE_PO_CATEGORIES.has(vo.voCategory)) return false
    if (vo.boqRelated === true || vo.boqRelated === 'yes') return false
    if (vo.voStatus === 'approved' || vo.voStatus === 'rejected') return false
    if (!vo.ticketNumber || !vo.ticketSubmissionDate) return false
    if (vo.ticketApprovalDate || vo.poNumber) return false
    return true
  }).length
)

const today = new Date().toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

// SVG icon components inline
const IconDashboard = {
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2',
      d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' })
  ])
}
const IconTable = {
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2',
      d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' })
  ])
}
const IconImport = {
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2',
      d: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12' })
  ])
}
const IconAdmin = {
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2',
      d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }),
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' })
  ])
}

const IconInvoice = {
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2',
      d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' })
  ])
}

const IconReminder = {
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2',
      d: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' })
  ])
}

const IconMonthly = {
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2',
      d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' })
  ])
}

const IconCost = {
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2',
      d: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' })
  ])
}

const navItems = [
  { key: 'dashboard',       label: 'Dashboard',      icon: IconDashboard },
  { key: 'table',           label: 'Variations',     icon: IconTable     },
  { key: 'invoice-list',    label: 'Invoice Prep',   icon: IconInvoice   },
  { key: 'monthly-invoice', label: 'Monthly',        icon: IconMonthly   },
  { key: 'reminders',       label: 'Reminders',      icon: IconReminder  },
  { key: 'cost-to-date',    label: 'Cost to Date',   icon: IconCost      },
  { key: 'import-export',   label: 'Import/Export',  icon: IconImport    },
  { key: 'admin',           label: 'Admin',           icon: IconAdmin     },
]

onMounted(() => {
  store.loadAllVOs()
})
</script>
