<template>
  <div class="space-y-6">

    <!-- Page header -->
    <div class="flex items-center justify-between pb-2 border-b border-gray-100">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center">
          <svg class="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">Cost to Date</h2>
          <p class="text-xs text-gray-400 mt-0.5">Labour &amp; third party costs per job</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <!-- Import -->
        <label class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold transition"
          :class="importing ? 'opacity-60 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
          </svg>
          {{ importing ? 'Importing...' : 'Import Costs' }}
          <input type="file" accept=".xlsx,.xls,.csv" class="hidden" @change="handleImport" :disabled="importing" />
        </label>
        <!-- Download template -->
        <button @click="downloadTemplate"
          class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          Download Template
        </button>
        <!-- Export -->
        <button @click="exportToExcel"
          class="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition shadow-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          Export
        </button>
      </div>
    </div>

    <!-- Import History -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
      <button @click="historyOpen = !historyOpen"
        class="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition rounded-xl">
        <div class="flex items-center gap-3">
          <svg class="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span class="text-sm font-semibold text-gray-700">Import History</span>
          <span v-if="importHistory.length" class="px-2 py-0.5 rounded-full text-xs font-bold bg-violet-100 text-violet-700">{{ importHistory.length }}</span>
          <span v-else class="text-xs text-gray-400">no imports yet</span>
        </div>
        <svg class="w-4 h-4 text-gray-400 transition-transform" :class="historyOpen ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      <div v-show="historyOpen" class="border-t border-gray-100">
        <div v-if="importHistory.length === 0" class="px-6 py-8 text-center text-sm text-gray-400">
          No import records yet. Each successful cost import will be logged here.
        </div>
        <div v-else>
          <div class="overflow-auto">
            <table class="w-full border-collapse" style="min-width: 700px;">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-200">
                  <th class="px-5 py-2.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">#</th>
                  <th class="px-5 py-2.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date &amp; Time</th>
                  <th class="px-5 py-2.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">File</th>
                  <th class="px-5 py-2.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Labour</th>
                  <th class="px-5 py-2.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">3rd Party</th>
                  <th class="px-5 py-2.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Grand Total</th>
                  <th class="px-5 py-2.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Delta</th>
                  <th class="px-5 py-2.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">VOs Updated</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(entry, idx) in importHistory" :key="entry.importedAt"
                  class="hover:bg-violet-50 transition-colors">
                  <td class="px-5 py-3 text-xs text-gray-400 font-mono">{{ importHistory.length - idx }}</td>
                  <td class="px-5 py-3 text-sm text-gray-700 whitespace-nowrap">{{ formatImportDate(entry.importedAt) }}</td>
                  <td class="px-5 py-3 text-xs text-gray-500 max-w-[180px] truncate" :title="entry.filename">{{ entry.filename || '—' }}</td>
                  <td class="px-5 py-3 text-sm text-right font-semibold text-violet-700 whitespace-nowrap">{{ formatCurrency(entry.labour) }}</td>
                  <td class="px-5 py-3 text-sm text-right font-semibold text-blue-700 whitespace-nowrap">{{ formatCurrency(entry.thirdParty) }}</td>
                  <td class="px-5 py-3 text-sm text-right font-bold text-gray-900 whitespace-nowrap">{{ formatCurrency(entry.grand) }}</td>
                  <td class="px-5 py-3 text-sm text-right font-semibold whitespace-nowrap">
                    <span v-if="idx === importHistory.length - 1" class="text-gray-300 text-xs">baseline</span>
                    <span v-else :class="getDelta(idx) > 0 ? 'text-emerald-600' : getDelta(idx) < 0 ? 'text-red-500' : 'text-gray-400'">
                      {{ getDelta(idx) > 0 ? '+' : '' }}{{ formatCurrency(getDelta(idx)) }}
                    </span>
                  </td>
                  <td class="px-5 py-3 text-xs text-right text-gray-500">{{ entry.updatedCount }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="px-6 py-3 border-t border-gray-100 flex justify-end">
            <button @click="clearHistory"
              class="text-xs text-red-400 hover:text-red-600 transition font-medium">
              Clear history
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Import progress banner -->
    <div v-if="importing" class="flex items-start gap-3 px-4 py-3 rounded-xl border bg-violet-50 border-violet-200">
      <svg class="w-4 h-4 mt-0.5 shrink-0 text-violet-600 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"></circle>
        <path class="opacity-90" fill="currentColor" d="M12 2a10 10 0 0 1 10 10h-3a7 7 0 0 0-7-7V2z"></path>
      </svg>
      <div class="flex-1 text-sm text-violet-700">
        <p class="font-semibold">{{ cancelRequested ? 'Cancelling import and rolling back...' : 'Import in progress...' }}</p>
        <p class="text-xs mt-0.5">Rows {{ progress.processedRows }} / {{ progress.totalRows }} · Matched VOs {{ progress.matchedVOs }} · Applied {{ progress.appliedVOs }}</p>
      </div>
      <button
        @click="requestCancelImport"
        :disabled="cancelRequested"
        class="shrink-0 inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border transition"
        :class="cancelRequested ? 'border-gray-300 text-gray-400 cursor-not-allowed' : 'border-violet-300 text-violet-700 hover:bg-violet-100'">
        {{ cancelRequested ? 'Cancelling...' : 'Cancel' }}
      </button>
    </div>

    <!-- Import result banner -->
    <div v-if="importResult" class="flex items-start gap-3 px-4 py-3 rounded-xl border"
      :class="importResult.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'">
      <svg class="w-4 h-4 mt-0.5 shrink-0" :class="importResult.type === 'success' ? 'text-green-500' : 'text-red-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path v-if="importResult.type === 'success'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <div class="flex-1 text-sm" :class="importResult.type === 'success' ? 'text-green-700' : 'text-red-700'">
        <p class="font-semibold">{{ importResult.title }}</p>
        <p class="text-xs mt-0.5">{{ importResult.message }}</p>
        <ul v-if="importResult.warnings?.length" class="mt-1 space-y-0.5">
          <li v-for="(w, i) in importResult.warnings" :key="i" class="text-xs">• {{ w }}</li>
        </ul>
      </div>
      <button @click="importResult = null" class="shrink-0 text-gray-400 hover:text-gray-600 transition">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- KPI cards -->
    <div class="grid grid-cols-4 gap-4">
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Jobs</p>
        <p class="text-2xl font-bold text-gray-900">{{ jobRows.length }}</p>
        <p class="text-xs text-gray-400 mt-1">unique job numbers</p>
      </div>
      <div class="bg-white rounded-xl border border-violet-200 shadow-sm px-5 py-4">
        <p class="text-xs font-semibold text-violet-500 uppercase tracking-wider mb-1">Total Labour Cost</p>
        <p class="text-2xl font-bold text-violet-700">{{ formatCurrency(totals.labour) }}</p>
        <p class="text-xs text-gray-400 mt-1">across all jobs</p>
      </div>
      <div class="bg-white rounded-xl border border-blue-200 shadow-sm px-5 py-4">
        <p class="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1">Total Third Party Cost</p>
        <p class="text-2xl font-bold text-blue-700">{{ formatCurrency(totals.thirdParty) }}</p>
        <p class="text-xs text-gray-400 mt-1">across all jobs</p>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Grand Total Cost</p>
        <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(totals.grand) }}</p>
        <p class="text-xs text-gray-400 mt-1">labour + third party</p>
      </div>
    </div>

    <!-- Table card -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm">

      <!-- Search bar -->
      <div class="px-6 py-4 border-b border-gray-100 flex items-center gap-4">
        <input v-model="searchText" type="text" placeholder="Search by job number, site ID or site name…"
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" />
        <button v-if="searchText" @click="searchText = ''"
          class="text-sm text-gray-400 hover:text-gray-600 transition px-2 py-1 rounded">✕ Clear</button>
        <span class="text-sm text-gray-400 whitespace-nowrap">{{ filteredRows.length }} job{{ filteredRows.length !== 1 ? 's' : '' }}</span>
      </div>

      <!-- Table -->
      <div class="overflow-auto" style="max-height: calc(100vh - 380px);">
        <table class="border-collapse w-full" style="min-width: 700px;">
          <thead class="sticky top-0 z-10">
            <tr>
              <th v-for="col in columns" :key="col.key"
                @click="toggleSort(col.key)"
                class="px-5 py-3 bg-violet-700 border-b-2 border-violet-800 text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-violet-600 transition select-none"
                :class="col.align === 'right' ? 'text-right' : 'text-left'">
                <span class="inline-flex items-center gap-1">
                  {{ col.label }}
                  <svg v-if="sortCol === col.key && sortDir === 'asc'" class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd"/></svg>
                  <svg v-else-if="sortCol === col.key && sortDir === 'desc'" class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                  <svg v-else class="w-3 h-3 text-violet-400" viewBox="0 0 20 20" fill="currentColor"><path d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zM3 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm4 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z"/></svg>
                </span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="filteredRows.length === 0">
              <td :colspan="columns.length" class="px-5 py-12 text-center text-gray-400 text-sm">
                {{ searchText ? 'No jobs match your search.' : 'No cost data recorded yet. Edit variation orders to add labour or third party costs.' }}
              </td>
            </tr>
            <tr v-for="row in sortedRows" :key="row.jobKey"
              class="hover:bg-violet-50 transition-colors">
              <td class="px-5 py-3.5 text-sm font-semibold text-gray-900 whitespace-nowrap">{{ row.jobNumber || '—' }}</td>
              <td class="px-5 py-3.5 text-sm text-gray-700 whitespace-nowrap">
                <span class="px-2 py-0.5 rounded text-xs font-bold bg-indigo-100 text-indigo-700">{{ row.siteId }}</span>
              </td>
              <td class="px-5 py-3.5 text-sm text-gray-700">{{ row.siteName }}</td>
              <td class="px-5 py-3.5 text-sm text-right font-semibold whitespace-nowrap"
                :class="row.labourCost > 0 ? 'text-violet-700' : 'text-gray-300'">
                {{ row.labourCost > 0 ? formatCurrency(row.labourCost) : '—' }}
              </td>
              <td class="px-5 py-3.5 text-sm text-right font-semibold whitespace-nowrap"
                :class="row.thirdPartyCost > 0 ? 'text-blue-700' : 'text-gray-300'">
                {{ row.thirdPartyCost > 0 ? formatCurrency(row.thirdPartyCost) : '—' }}
              </td>
              <td class="px-5 py-3.5 text-sm text-right font-bold text-gray-900 whitespace-nowrap">
                {{ (row.labourCost + row.thirdPartyCost) > 0 ? formatCurrency(row.labourCost + row.thirdPartyCost) : '—' }}
              </td>
              <td class="px-5 py-3.5 text-xs text-gray-400 text-right whitespace-nowrap">{{ row.voCount }} VO{{ row.voCount !== 1 ? 's' : '' }}</td>
            </tr>
          </tbody>
          <!-- Footer totals -->
          <tfoot v-if="filteredRows.length > 0" class="sticky bottom-0">
            <tr class="bg-gray-50 border-t-2 border-gray-200">
              <td class="px-5 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider" colspan="3">Totals ({{ filteredRows.length }} jobs)</td>
              <td class="px-5 py-3 text-sm text-right font-bold text-violet-700 whitespace-nowrap">{{ formatCurrency(filteredTotals.labour) }}</td>
              <td class="px-5 py-3 text-sm text-right font-bold text-blue-700 whitespace-nowrap">{{ formatCurrency(filteredTotals.thirdParty) }}</td>
              <td class="px-5 py-3 text-sm text-right font-bold text-gray-900 whitespace-nowrap">{{ formatCurrency(filteredTotals.grand) }}</td>
              <td class="px-5 py-3 text-xs text-right text-gray-400">{{ filteredTotals.voCount }} VOs</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import * as XLSX from 'xlsx'
import { useVOStore } from '../stores/voStore'
import { formatCurrency } from '../utils/formatters'

const store = useVOStore()
const searchText = ref('')
const sortCol = ref('jobNumber')
const sortDir = ref('asc')
const importResult = ref(null)
const historyOpen = ref(false)
const importing = ref(false)
const cancelRequested = ref(false)
const importSessionId = ref(null)
const progress = ref({
  totalRows: 0,
  processedRows: 0,
  matchedVOs: 0,
  appliedVOs: 0,
})

const HISTORY_KEY = 'ctdImportHistory'

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') } catch { return [] }
}
function saveHistory(arr) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(arr))
}

const importHistory = ref(loadHistory())  // newest first

onMounted(() => {
  if (import.meta.env.DEV && typeof importing?.value !== 'boolean') {
    console.warn('[CostToDate] import state binding is stale. Hard refresh the browser to clear HMR cache.')
  }
})

function getDelta(idx) {
  // idx=0 is newest; delta = this entry grand minus previous (older) entry grand
  const prev = importHistory.value[idx + 1]
  if (!prev) return 0
  return importHistory.value[idx].grand - prev.grand
}

function formatImportDate(iso) {
  const d = new Date(iso)
  return d.toLocaleString('en-AU', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function clearHistory() {
  if (!confirm('Clear all import history records?')) return
  importHistory.value = []
  saveHistory([])
}

const columns = [
  { key: 'jobNumber',      label: 'Job Number',       align: 'left'  },
  { key: 'siteId',         label: 'Site ID',           align: 'left'  },
  { key: 'siteName',       label: 'Site Name',         align: 'left'  },
  { key: 'labourCost',     label: 'Labour Cost',       align: 'right' },
  { key: 'thirdPartyCost', label: 'Third Party Cost',  align: 'right' },
  { key: 'total',          label: 'Total Cost',        align: 'right' },
  { key: 'voCount',        label: 'VOs',               align: 'right' },
]

// Aggregate VOs by jobNumber+siteId+siteName
const jobRows = computed(() => {
  const map = new Map()
  for (const vo of store.vos.value || []) {
    const key = `${vo.jobNumber || ''}|${vo.siteId || ''}|${vo.siteName || ''}`
    const existing = map.get(key)
    if (existing) {
      existing.labourCost     += vo.labourCost     || 0
      existing.thirdPartyCost += vo.thirdPartyCost || 0
      existing.voCount++
    } else {
      map.set(key, {
        jobKey:         key,
        jobNumber:      vo.jobNumber  || '',
        siteId:         vo.siteId     || '',
        siteName:       vo.siteName   || '',
        labourCost:     vo.labourCost     || 0,
        thirdPartyCost: vo.thirdPartyCost || 0,
        voCount:        1,
      })
    }
  }
  return [...map.values()]
})

const filteredRows = computed(() => {
  if (!searchText.value.trim()) return jobRows.value
  const q = searchText.value.toLowerCase()
  return jobRows.value.filter(r =>
    r.jobNumber?.toLowerCase().includes(q) ||
    r.siteId?.toLowerCase().includes(q) ||
    r.siteName?.toLowerCase().includes(q)
  )
})

const sortedRows = computed(() => {
  const dir = sortDir.value === 'asc' ? 1 : -1
  return [...filteredRows.value].sort((a, b) => {
    let av = sortCol.value === 'total' ? a.labourCost + a.thirdPartyCost : a[sortCol.value]
    let bv = sortCol.value === 'total' ? b.labourCost + b.thirdPartyCost : b[sortCol.value]
    if (typeof av === 'string') av = av.toLowerCase()
    if (typeof bv === 'string') bv = bv.toLowerCase()
    if (av < bv) return -1 * dir
    if (av > bv) return  1 * dir
    return 0
  })
})

const totals = computed(() => ({
  labour:     jobRows.value.reduce((s, r) => s + r.labourCost, 0),
  thirdParty: jobRows.value.reduce((s, r) => s + r.thirdPartyCost, 0),
  grand:      jobRows.value.reduce((s, r) => s + r.labourCost + r.thirdPartyCost, 0),
}))

const filteredTotals = computed(() => ({
  labour:     filteredRows.value.reduce((s, r) => s + r.labourCost, 0),
  thirdParty: filteredRows.value.reduce((s, r) => s + r.thirdPartyCost, 0),
  grand:      filteredRows.value.reduce((s, r) => s + r.labourCost + r.thirdPartyCost, 0),
  voCount:    filteredRows.value.reduce((s, r) => s + r.voCount, 0),
}))

function toggleSort(key) {
  if (sortCol.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortCol.value = key
    sortDir.value = 'asc'
  }
}

function resetImportProgress() {
  progress.value = {
    totalRows: 0,
    processedRows: 0,
    matchedVOs: 0,
    appliedVOs: 0,
  }
}

function requestCancelImport() {
  if (!importing.value) return
  cancelRequested.value = true
}

async function yieldToUI() {
  await new Promise(resolve => setTimeout(resolve, 0))
}

// ── Download import template ──
function downloadTemplate() {
  // Pre-fill with existing job data so user can just fill in costs
  const rows = jobRows.value.length > 0
    ? jobRows.value.map(r => ({
        'Job Number':       r.jobNumber,
        'Site ID':          r.siteId,
        'Site Name':        r.siteName,
        'Labour Cost':      r.labourCost || 0,
        'Third Party Cost': r.thirdPartyCost || 0,
      }))
    : [{ 'Job Number': '', 'Site ID': '', 'Site Name': '', 'Labour Cost': 0, 'Third Party Cost': 0 }]

  const ws = XLSX.utils.json_to_sheet(rows)
  ws['!cols'] = [{ wch: 18 }, { wch: 12 }, { wch: 28 }, { wch: 16 }, { wch: 18 }]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Cost Import Template')
  XLSX.writeFile(wb, 'Cost_Import_Template.xlsx')
}

// ── Export current view ──
function exportToExcel() {
  const rows = sortedRows.value.map(r => ({
    'Job Number':       r.jobNumber,
    'Site ID':          r.siteId,
    'Site Name':        r.siteName,
    'Labour Cost':      r.labourCost,
    'Third Party Cost': r.thirdPartyCost,
    'Total Cost':       r.labourCost + r.thirdPartyCost,
    'VO Count':         r.voCount,
  }))
  const ws = XLSX.utils.json_to_sheet(rows)
  ws['!cols'] = [{ wch: 18 }, { wch: 12 }, { wch: 28 }, { wch: 16 }, { wch: 18 }, { wch: 16 }, { wch: 10 }]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Cost to Date')
  const date = new Date().toLocaleDateString('en-AU').replace(/\//g, '-')
  XLSX.writeFile(wb, `Cost_to_Date_${date}.xlsx`)
}

// ── Import costs from xlsx ──
async function handleImport(e) {
  const file = e.target.files?.[0]
  e.target.value = ''
  if (!file || importing.value) return
  importResult.value = null
  importing.value = true
  cancelRequested.value = false
  importSessionId.value = `${Date.now()}-${Math.random().toString(36).slice(2)}`
  resetImportProgress()
  await nextTick()
  await yieldToUI()

  try {
    const importContext = {
      rows: [],
      originalCosts: new Map(),
      touchedVOIds: new Set(),
      warnings: [],
      skipped: 0,
      updated: 0,
    }

    // Phase 1: parse and build execution plan
    await yieldToUI()
    const data = await file.arrayBuffer()
    const wb = XLSX.read(data, { type: 'array' })
    const ws = wb.Sheets[wb.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(ws, { defval: '' })
    await yieldToUI()
    progress.value.totalRows = rows.length

    if (rows.length === 0) {
      importResult.value = { type: 'error', title: 'Empty file', message: 'No rows found in the spreadsheet.' }
      store.addCostImportSummaryLog({ status: 'failed', filename: file.name, message: 'No rows found in the spreadsheet.' })
      return
    }

    const headers = Object.keys(rows[0]).map(h => h.trim().toLowerCase())
    const hasJob = headers.some(h => h.includes('job'))
    const hasSite = headers.some(h => h.includes('site id') || h === 'site_id' || h === 'siteid')
    if (!hasJob && !hasSite) {
      importResult.value = { type: 'error', title: 'Invalid template', message: 'File must have a "Job Number" or "Site ID" column to match VOs.' }
      store.addCostImportSummaryLog({ status: 'failed', filename: file.name, rowsTotal: rows.length, message: 'Missing Job Number or Site ID column.' })
      return
    }

    const getVal = (row, ...keys) => {
      for (const k of keys) {
        const found = Object.keys(row).find(h => h.trim().toLowerCase() === k.toLowerCase())
        if (found !== undefined) return row[found]
      }
      return undefined
    }

    for (let i = 0; i < rows.length; i++) {
      if (cancelRequested.value) break
      const row = rows[i]
      const rowNum = i + 2
      const jobNumber = String(getVal(row, 'Job Number', 'Job No.', 'Job No', 'jobNumber') || '').trim()
      const siteId = String(getVal(row, 'Site ID', 'Site Id', 'siteId') || '').trim()
      const siteName = String(getVal(row, 'Site Name', 'siteName') || '').trim()
      const labourRaw = getVal(row, 'Labour Cost', 'labourCost')
      const thirdPartyRaw = getVal(row, 'Third Party Cost', 'thirdPartyCost')
      const labourCost = parseFloat(String(labourRaw).replace(/[,$]/g, '')) || 0
      const thirdPartyCost = parseFloat(String(thirdPartyRaw).replace(/[,$]/g, '')) || 0

      let matched = []
      if (jobNumber) {
        matched = store.vos.value.filter(vo => vo.jobNumber?.trim() === jobNumber)
      } else if (siteId || siteName) {
        matched = store.vos.value.filter(vo =>
          (siteId && vo.siteId?.trim().toLowerCase() === siteId.toLowerCase()) ||
          (siteName && vo.siteName?.trim().toLowerCase() === siteName.toLowerCase())
        )
      }

      if (matched.length === 0) {
        importContext.warnings.push(`Row ${rowNum}: no matching VOs found for "${jobNumber || siteId || siteName}".`)
        importContext.skipped++
        progress.value.processedRows++
        if (i % 20 === 0) await yieldToUI()
        continue
      }

      const perVO = matched.length
      importContext.rows.push({
        matched,
        labourPer: labourCost / perVO,
        thirdPartyPer: thirdPartyCost / perVO,
      })
      progress.value.processedRows++
      progress.value.matchedVOs += matched.length
      if (i % 20 === 0) await yieldToUI()
    }

    // Phase 2: apply updates with cancel checkpoints
    for (let i = 0; i < importContext.rows.length; i++) {
      if (cancelRequested.value) break
      const rowPlan = importContext.rows[i]
      for (const vo of rowPlan.matched) {
        if (cancelRequested.value) break
        if (!importContext.originalCosts.has(vo.id)) {
          importContext.originalCosts.set(vo.id, {
            labourCost: vo.labourCost || 0,
            thirdPartyCost: vo.thirdPartyCost || 0,
          })
        }
        importContext.touchedVOIds.add(vo.id)
        await store.editVO(
          vo.id,
          { ...vo, labourCost: rowPlan.labourPer, thirdPartyCost: rowPlan.thirdPartyPer },
          { suppressActivityLog: true, suppressLoadingToggle: true }
        )
        importContext.updated++
        progress.value.appliedVOs = importContext.updated
      }
      await yieldToUI()
    }

    if (cancelRequested.value) {
      let reverted = 0
      for (const voId of importContext.touchedVOIds) {
        const snapshot = importContext.originalCosts.get(voId)
        const current = store.vos.value.find(v => v.id === voId)
        if (!snapshot || !current) continue
        await store.editVO(
          voId,
          { ...current, labourCost: snapshot.labourCost, thirdPartyCost: snapshot.thirdPartyCost },
          { suppressActivityLog: true, suppressLoadingToggle: true }
        )
        reverted++
        if (reverted % 25 === 0) await yieldToUI()
      }

      importResult.value = {
        type: 'error',
        title: 'Canceled - rolled back',
        message: `Import canceled after ${progress.value.processedRows} row${progress.value.processedRows !== 1 ? 's' : ''}. ${reverted} VO${reverted !== 1 ? 's were' : ' was'} reverted.`,
        warnings: importContext.warnings.slice(0, 10),
      }
      store.addCostImportSummaryLog({
        status: 'canceled_rolled_back',
        filename: file.name,
        rowsTotal: progress.value.totalRows,
        rowsProcessed: progress.value.processedRows,
        updatedCount: importContext.updated,
        revertedCount: reverted,
        message: `Canceled by user. Rolled back ${reverted} VO updates.`,
      })
      return
    }

    const updated = importContext.updated
    const skipped = importContext.skipped
    const warnings = importContext.warnings

    importResult.value = {
      type: updated > 0 ? 'success' : 'error',
      title: updated > 0 ? `Import complete - ${updated} VO${updated !== 1 ? 's' : ''} updated` : 'No VOs updated',
      message: skipped > 0 ? `${skipped} row${skipped !== 1 ? 's' : ''} skipped (no matching VOs).` : 'All rows matched successfully.',
      warnings: warnings.slice(0, 10),
    }

    if (updated > 0) {
      const allVOs = store.vos.value || []
      const snap = {
        importedAt: new Date().toISOString(),
        filename: file.name,
        labour: allVOs.reduce((s, v) => s + (v.labourCost || 0), 0),
        thirdParty: allVOs.reduce((s, v) => s + (v.thirdPartyCost || 0), 0),
        grand: allVOs.reduce((s, v) => s + (v.labourCost || 0) + (v.thirdPartyCost || 0), 0),
        updatedCount: updated,
      }
      importHistory.value = [snap, ...importHistory.value]
      saveHistory(importHistory.value)
      historyOpen.value = true
    }

    store.addCostImportSummaryLog({
      status: updated > 0 ? 'completed' : 'failed',
      filename: file.name,
      rowsTotal: progress.value.totalRows,
      rowsProcessed: progress.value.processedRows,
      updatedCount: updated,
      message: updated > 0 ? 'Cost import completed successfully.' : 'No VOs were updated.',
    })
  } catch (err) {
    importResult.value = { type: 'error', title: 'Import failed', message: err.message }
    store.addCostImportSummaryLog({
      status: 'failed',
      filename: file?.name || '',
      rowsTotal: progress.value.totalRows,
      rowsProcessed: progress.value.processedRows,
      updatedCount: progress.value.appliedVOs,
      message: err.message,
    })
  } finally {
    importing.value = false
    cancelRequested.value = false
    importSessionId.value = null
  }
}
</script>
