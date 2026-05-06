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

    <Teleport to="body">
      <div v-if="routineBackupPrompt" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div class="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div class="px-5 py-4 bg-blue-700">
            <p class="text-sm font-bold text-white">Routine JSON Backup</p>
            <p class="text-xs text-blue-100 mt-0.5">Automatic export is about to run</p>
          </div>
          <div class="p-5 space-y-4">
            <p class="text-sm text-gray-600">
              Your full restore backup will export in
              <span class="font-bold text-blue-700">{{ routineBackupCountdown }}s</span>.
            </p>
            <div class="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div class="h-full bg-blue-600 transition-all"
                :style="{ width: ((15 - routineBackupCountdown) / 15 * 100) + '%' }"></div>
            </div>
            <div class="flex justify-end gap-2">
              <button @click="cancelRoutineBackupForToday"
                class="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm font-semibold hover:bg-gray-200 transition">
                Cancel Today
              </button>
              <button @click="runRoutineBackupNow"
                class="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition">
                Export Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <transition name="routine-toast">
        <div v-if="routineBackupToast"
          class="fixed right-5 top-20 z-[60] w-full max-w-sm rounded-2xl bg-white shadow-2xl border overflow-hidden">
          <div class="flex items-start gap-3 p-4"
            :class="routineBackupToast.type === 'success' ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-slate-400'">
            <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              :class="routineBackupToast.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'">
              <svg v-if="routineBackupToast.type === 'success'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.4" d="M5 13l4 4L19 7"/>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-gray-900">{{ routineBackupToast.title }}</p>
              <p class="text-xs text-gray-500 mt-0.5">{{ routineBackupToast.message }}</p>
            </div>
            <button @click="routineBackupToast = null" class="p-1 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-50 transition">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="h-1 bg-gray-100">
            <div class="h-full"
              :class="routineBackupToast.type === 'success' ? 'bg-emerald-500' : 'bg-slate-400'"></div>
          </div>
        </div>
      </transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, h } from 'vue'
import Dashboard         from './components/Dashboard.vue'
import TableView         from './components/TableView.vue'
import ImportExport      from './components/ImportExport.vue'
import AdminView         from './components/AdminView.vue'
import InvoiceList       from './components/InvoiceList.vue'
import ReminderView      from './components/ReminderView.vue'
import MonthlyInvoicing  from './components/MonthlyInvoicing.vue'
import CostToDate        from './components/CostToDate.vue'
import PLView            from './components/PLView.vue'
import SiteStatusView    from './components/SiteStatusView.vue'
import { useVOStore } from './stores/voStore'
import { downloadFullBackup } from './utils/backup'

const VALID_VIEWS = ['dashboard', 'table', 'invoice-list', 'monthly-invoice', 'reminders', 'cost-to-date', 'pl', 'site-status', 'import-export', 'admin']
const saved = localStorage.getItem('currentView')
const currentView = ref(VALID_VIEWS.includes(saved) ? saved : 'dashboard')

const store = useVOStore()

// Persist active view on every change
watch(currentView, v => localStorage.setItem('currentView', v))

// Map view key → component (used by <component :is>)
const viewMap = { dashboard: Dashboard, table: TableView, 'invoice-list': InvoiceList, 'monthly-invoice': MonthlyInvoicing, reminders: ReminderView, 'cost-to-date': CostToDate, pl: PLView, 'site-status': SiteStatusView, 'import-export': ImportExport, admin: AdminView }
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
const routineBackupPrompt = ref(false)
const routineBackupCountdown = ref(15)
const routineBackupToast = ref(null)
let routineBackupCheckTimer = null
let routineBackupCountdownTimer = null
let routineBackupToastTimer = null

function todayKey() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

function currentTimeKey() {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

function scheduledTodayAt(time) {
  const [hours, minutes] = String(time || '').split(':').map(Number)
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null
  const dt = new Date()
  dt.setHours(hours, minutes, 0, 0)
  return dt
}

function routineBackupSettings() {
  try {
    const data = JSON.parse(localStorage.getItem('globalData') || '{}')
    return data.settings || {}
  } catch {
    return {}
  }
}

function routineBackupFilename() {
  const now = new Date()
  const date = now.toISOString().slice(0, 10)
  const time = `${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}`
  return `VariationTracker_Backup_${date}_${time}.json`
}

function markRoutineBackupDone() {
  localStorage.setItem('routineBackupLastRunDate', todayKey())
}

function showRoutineBackupToast(type, title, message) {
  routineBackupToast.value = { type, title, message }
  clearTimeout(routineBackupToastTimer)
  routineBackupToastTimer = setTimeout(() => {
    routineBackupToast.value = null
  }, 5000)
}

function runRoutineBackupNow() {
  if (!routineBackupPrompt.value) return
  routineBackupPrompt.value = false
  clearInterval(routineBackupCountdownTimer)
  routineBackupCountdownTimer = null
  try {
    downloadFullBackup(store.vos.value || [], store.invoicePrepIds?.value || [], routineBackupFilename())
    markRoutineBackupDone()
    showRoutineBackupToast('success', 'Backup Export Started', 'Your full restore backup has been downloaded.')
  } catch (err) {
    showRoutineBackupToast('cancel', 'Backup Failed', err.message || 'Could not export the routine backup.')
  }
}

function cancelRoutineBackupForToday() {
  routineBackupPrompt.value = false
  clearInterval(routineBackupCountdownTimer)
  routineBackupCountdownTimer = null
  markRoutineBackupDone()
  showRoutineBackupToast('cancel', 'Backup Cancelled Today', 'Routine backup will wait until the next scheduled day.')
}

function showRoutineBackupPrompt() {
  if (routineBackupPrompt.value) return
  routineBackupPrompt.value = true
  routineBackupCountdown.value = 15
  clearInterval(routineBackupCountdownTimer)
  routineBackupCountdownTimer = setInterval(() => {
    routineBackupCountdown.value -= 1
    if (routineBackupCountdown.value <= 0) runRoutineBackupNow()
  }, 1000)
}

function checkRoutineBackupSchedule() {
  const settings = routineBackupSettings()
  if (!settings.routineBackupEnabled || !settings.routineBackupTime) return
  if (localStorage.getItem('routineBackupLastRunDate') === todayKey()) return
  const scheduled = scheduledTodayAt(settings.routineBackupTime)
  if (scheduled && new Date() >= scheduled) showRoutineBackupPrompt()
}

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

const IconPL = {
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2',
      d: 'M11 3v18m4-14H9.5a2.5 2.5 0 000 5H14a2.5 2.5 0 010 5H8' })
  ])
}

const IconSiteStatus = {
  render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2',
      d: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' }),
    h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M15 11a3 3 0 11-6 0 3 3 0 016 0z' })
  ])
}

const navItems = [
  { key: 'dashboard',       label: 'Dashboard',      icon: IconDashboard },
  { key: 'table',           label: 'Variations',     icon: IconTable     },
  { key: 'invoice-list',    label: 'Invoice Prep',   icon: IconInvoice   },
  { key: 'monthly-invoice', label: 'Monthly',        icon: IconMonthly   },
  { key: 'reminders',       label: 'Reminders',      icon: IconReminder  },
  { key: 'cost-to-date',    label: 'Cost to Date',   icon: IconCost        },
  { key: 'pl',              label: 'P&L',            icon: IconPL          },
  { key: 'site-status',     label: 'Site Status',    icon: IconSiteStatus  },
  { key: 'import-export',   label: 'Import/Export',  icon: IconImport      },
  { key: 'admin',           label: 'Admin',           icon: IconAdmin     },
]

onMounted(() => {
  store.loadAllVOs()
  routineBackupCheckTimer = setInterval(checkRoutineBackupSchedule, 30000)
  checkRoutineBackupSchedule()
})

onUnmounted(() => {
  clearInterval(routineBackupCheckTimer)
  clearInterval(routineBackupCountdownTimer)
  clearTimeout(routineBackupToastTimer)
})
</script>

<style scoped>
.routine-toast-enter-active,
.routine-toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.routine-toast-enter-from,
.routine-toast-leave-to {
  opacity: 0;
  transform: translateY(-8px) translateX(12px);
}
</style>
