<template>
  <div class="space-y-6">

    <!-- Page header -->
    <div class="flex items-center justify-between pb-2 border-b border-gray-100">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
          <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">Site Status</h2>
          <p class="text-xs text-gray-400 mt-0.5">Track started / not started per site with cost to complete</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button @click="confirmDeleteAll" :disabled="rows.length === 0"
          class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 transition disabled:opacity-40 disabled:cursor-not-allowed">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
          Delete All
        </button>
        <button @click="syncFromVOs" :disabled="syncing"
          class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition disabled:opacity-60 disabled:cursor-not-allowed">
          <svg class="w-4 h-4 transition-transform" :class="syncing ? 'animate-spin' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          {{ syncing ? 'Syncing…' : 'Sync from Variations' }}
        </button>
        <button @click="exportToExcel"
          class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition shadow-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          Export
        </button>
      </div>
    </div>

    <!-- Delete All confirm modal -->
    <teleport to="body">
      <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-base font-bold text-gray-900">Delete all sites?</p>
              <p class="text-xs text-gray-500 mt-0.5">This will remove all {{ rows.length }} site entries including their status, cost to complete, and comments. This cannot be undone.</p>
            </div>
          </div>
          <div class="flex gap-2 justify-end">
            <button @click="showDeleteConfirm = false"
              class="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition">
              Cancel
            </button>
            <button @click="deleteAll"
              class="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition">
              Delete All
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Sync banner -->
    <div v-if="syncMessage" class="flex items-center gap-3 px-4 py-3 rounded-xl border bg-emerald-50 border-emerald-200">
      <svg class="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <p class="text-sm text-emerald-700 font-medium flex-1">{{ syncMessage }}</p>
      <button @click="syncMessage = ''" class="text-gray-400 hover:text-gray-600">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- KPI cards -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Sites</p>
        <p class="text-2xl font-bold text-gray-900">{{ rows.length }}</p>
        <p class="text-xs text-gray-400 mt-1">unique sites tracked</p>
      </div>
      <div class="bg-white rounded-xl border border-emerald-200 shadow-sm px-5 py-4">
        <p class="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">Started</p>
        <p class="text-2xl font-bold text-emerald-700">{{ startedRows.length }}</p>
        <p class="text-xs text-gray-400 mt-1">{{ formatCurrency(startedCostToComplete) }} cost to complete</p>
      </div>
      <div class="bg-white rounded-xl border border-amber-200 shadow-sm px-5 py-4">
        <p class="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">Not Started</p>
        <p class="text-2xl font-bold text-amber-700">{{ notStartedRows.length }}</p>
        <p class="text-xs text-gray-400 mt-1">{{ formatCurrency(notStartedCostToComplete) }} cost to complete</p>
      </div>
      <div class="bg-white rounded-xl border border-blue-200 shadow-sm px-5 py-4">
        <p class="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1">Total Cost to Complete</p>
        <p class="text-2xl font-bold text-blue-700">{{ formatCurrency(totalCostToComplete) }}</p>
        <p class="text-xs text-gray-400 mt-1">across all sites</p>
      </div>
    </div>

    <!-- Filter / search bar -->
    <div class="flex items-center gap-3 flex-wrap">
      <div class="relative flex-1 min-w-48">
        <svg class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input v-model="search" type="text" placeholder="Search site ID, name or job…"
          class="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"/>
      </div>
      <div class="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
        <button @click="statusFilter = 'all'"
          class="px-3 py-1.5 rounded-lg text-xs font-semibold transition"
          :class="statusFilter === 'all' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-100'">
          All
        </button>
        <button @click="statusFilter = 'started'"
          class="px-3 py-1.5 rounded-lg text-xs font-semibold transition"
          :class="statusFilter === 'started' ? 'bg-emerald-600 text-white' : 'text-gray-500 hover:bg-gray-100'">
          Started
        </button>
        <button @click="statusFilter = 'not-started'"
          class="px-3 py-1.5 rounded-lg text-xs font-semibold transition"
          :class="statusFilter === 'not-started' ? 'bg-amber-500 text-white' : 'text-gray-500 hover:bg-gray-100'">
          Not Started
        </button>
      </div>
      <p class="text-xs text-gray-400">{{ filteredRows.length }} of {{ rows.length }} sites</p>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div v-if="rows.length === 0" class="py-16 text-center">
        <div class="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <svg class="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          </svg>
        </div>
        <p class="text-sm font-semibold text-gray-500">No sites yet</p>
        <p class="text-xs text-gray-400 mt-1">Click <strong>Sync from Variations</strong> to pull sites from your VO records.</p>
      </div>

      <table v-else class="w-full text-sm">
        <thead>
          <tr class="bg-emerald-700 text-white text-xs uppercase tracking-wider">
            <th class="px-4 py-3 text-left font-semibold">Site ID</th>
            <th class="px-4 py-3 text-left font-semibold">Site Name</th>
            <th class="px-4 py-3 text-left font-semibold">Job #</th>
            <th class="px-4 py-3 text-center font-semibold">Status</th>
            <th class="px-4 py-3 text-right font-semibold">Cost to Complete</th>
            <th class="px-4 py-3 text-left font-semibold">Comment</th>
            <th class="px-4 py-3 text-center font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredRows.length === 0">
            <td colspan="7" class="px-4 py-8 text-center text-sm text-gray-400">No sites match your filter.</td>
          </tr>
          <tr v-for="row in filteredRows" :key="row.key"
            class="border-t border-gray-100 hover:bg-gray-50 transition"
            :class="row.status === 'started' ? 'border-l-4 border-l-emerald-400' : 'border-l-4 border-l-amber-300'">
            <td class="px-4 py-3">
              <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-indigo-100 text-indigo-700">
                {{ row.siteId }}
              </span>
            </td>
            <td class="px-4 py-3 text-gray-800 font-medium">{{ row.siteName }}</td>
            <td class="px-4 py-3 text-gray-600">{{ row.jobNumber || '—' }}</td>
            <td class="px-4 py-3 text-center">
              <button @click="toggleStatus(row)"
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition"
                :class="row.status === 'started'
                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200'">
                <span class="w-1.5 h-1.5 rounded-full"
                  :class="row.status === 'started' ? 'bg-emerald-500' : 'bg-amber-500'"></span>
                {{ row.status === 'started' ? 'Started' : 'Not Started' }}
              </button>
            </td>
            <td class="px-4 py-3 text-right">
              <span v-if="editingKey !== row.key" class="text-gray-800 font-medium cursor-pointer hover:text-emerald-700"
                @click="startEdit(row)">
                {{ row.costToComplete ? formatCurrency(row.costToComplete) : '—' }}
              </span>
              <input v-else
                v-model="editForm.costToComplete"
                type="text"
                class="w-32 text-right border border-emerald-400 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                @blur="formatCostInput"
                @focus="rawCostInput"
                @keydown.enter="saveEdit(row)"
                @keydown.escape="cancelEdit" />
            </td>
            <td class="px-4 py-3">
              <span v-if="editingKey !== row.key"
                class="text-gray-600 text-xs cursor-pointer hover:text-emerald-700 line-clamp-2 max-w-xs"
                @click="startEdit(row)">
                {{ row.comment || '—' }}
              </span>
              <input v-else
                v-model="editForm.comment"
                type="text"
                placeholder="Add a comment…"
                class="w-full border border-emerald-400 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                @keydown.enter="saveEdit(row)"
                @keydown.escape="cancelEdit" />
            </td>
            <td class="px-4 py-3 text-center">
              <div v-if="editingKey !== row.key" class="flex items-center justify-center gap-1">
                <button @click="startEdit(row)" title="Edit"
                  class="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>
                <button @click="deleteRow(row)" title="Remove"
                  class="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
              <div v-else class="flex items-center justify-center gap-1">
                <button @click="saveEdit(row)"
                  class="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition">
                  Save
                </button>
                <button @click="cancelEdit"
                  class="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-semibold hover:bg-gray-200 transition">
                  Cancel
                </button>
              </div>
            </td>
          </tr>
        </tbody>
        <!-- Footer totals -->
        <tfoot>
          <tr class="bg-gray-50 border-t-2 border-gray-200 text-xs font-semibold text-gray-600">
            <td colspan="4" class="px-4 py-3">
              {{ filteredRows.length }} site{{ filteredRows.length !== 1 ? 's' : '' }}
              <span v-if="statusFilter !== 'all'" class="text-gray-400 font-normal"> (filtered)</span>
            </td>
            <td class="px-4 py-3 text-right text-emerald-700">
              {{ formatCurrency(filteredRows.reduce((s, r) => s + (r.costToComplete || 0), 0)) }}
            </td>
            <td colspan="2" class="px-4 py-3 text-gray-400 font-normal">Total cost to complete</td>
          </tr>
        </tfoot>
      </table>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useVOStore } from '../stores/voStore'
import { formatCurrency } from '../utils/formatters'
import * as XLSX from 'xlsx'

const STORAGE_KEY = 'siteStatusData'

const store = useVOStore()

// ── Persist helpers ──────────────────────────────────────────────────────────
function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} }
}
function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// ── State ────────────────────────────────────────────────────────────────────
const siteData = ref(load())   // keyed by "siteId|jobNumber"
const search = ref('')
const statusFilter = ref('all')
const syncMessage = ref('')
const syncing = ref(false)
const showDeleteConfirm = ref(false)
const editingKey = ref(null)
const editForm = ref({ costToComplete: '', comment: '' })

// ── Rows ─────────────────────────────────────────────────────────────────────
const rows = computed(() => {
  return Object.entries(siteData.value).map(([key, d]) => ({
    key,
    siteId:        d.siteId,
    siteName:      d.siteName,
    jobNumber:     d.jobNumber,
    status:        d.status || 'not-started',
    costToComplete: d.costToComplete || 0,
    comment:       d.comment || '',
  })).sort((a, b) => (a.siteId || '').localeCompare(b.siteId || ''))
})

const filteredRows = computed(() => {
  let list = rows.value
  if (statusFilter.value !== 'all') list = list.filter(r => r.status === statusFilter.value)
  if (search.value.trim()) {
    const q = search.value.trim().toLowerCase()
    list = list.filter(r =>
      r.siteId?.toLowerCase().includes(q) ||
      r.siteName?.toLowerCase().includes(q) ||
      r.jobNumber?.toLowerCase().includes(q)
    )
  }
  return list
})

const startedRows    = computed(() => rows.value.filter(r => r.status === 'started'))
const notStartedRows = computed(() => rows.value.filter(r => r.status === 'not-started'))
const startedCostToComplete    = computed(() => startedRows.value.reduce((s, r) => s + (r.costToComplete || 0), 0))
const notStartedCostToComplete = computed(() => notStartedRows.value.reduce((s, r) => s + (r.costToComplete || 0), 0))
const totalCostToComplete      = computed(() => rows.value.reduce((s, r) => s + (r.costToComplete || 0), 0))

// ── Actions ──────────────────────────────────────────────────────────────────
function rowKey(siteId, jobNumber) {
  return `${siteId || ''}|${jobNumber || ''}`
}

function isNA(val) {
  const s = (val || '').toString().trim().toUpperCase()
  return s === '' || s === 'NA' || s === 'N/A'
}

async function syncFromVOs() {
  if (syncing.value) return
  syncing.value = true
  syncMessage.value = ''

  await new Promise(resolve => setTimeout(resolve, 3000))

  const vos = store.vos.value || []
  const seen = new Set()
  let added = 0

  vos.forEach(vo => {
    // Skip Detail Site Survey category
    if ((vo.voCategory || '').trim().toLowerCase() === 'detail site survey') return
    // Skip rows where site ID or job number is NA / blank
    if (isNA(vo.siteId) || isNA(vo.jobNumber)) return

    const key = rowKey(vo.siteId, vo.jobNumber)
    if (seen.has(key)) return
    seen.add(key)
    if (!siteData.value[key]) {
      siteData.value[key] = {
        siteId:        vo.siteId,
        siteName:      vo.siteName,
        jobNumber:     vo.jobNumber,
        status:        'not-started',
        costToComplete: 0,
        comment:       '',
      }
      added++
    } else {
      // Update site name / job in case it changed
      siteData.value[key].siteId    = vo.siteId
      siteData.value[key].siteName  = vo.siteName
      siteData.value[key].jobNumber = vo.jobNumber
    }
  })

  save(siteData.value)
  syncing.value = false
  syncMessage.value = added > 0
    ? `Synced ${added} new site${added !== 1 ? 's' : ''} from Variations.`
    : 'All sites already up to date — no new sites found.'
}

function confirmDeleteAll() {
  showDeleteConfirm.value = true
}

function deleteAll() {
  siteData.value = {}
  save(siteData.value)
  showDeleteConfirm.value = false
  syncMessage.value = 'All site entries deleted.'
}

function toggleStatus(row) {
  const d = siteData.value[row.key]
  if (!d) return
  d.status = d.status === 'started' ? 'not-started' : 'started'
  save(siteData.value)
}

function startEdit(row) {
  editingKey.value = row.key
  editForm.value = {
    costToComplete: row.costToComplete ? String(row.costToComplete) : '',
    comment:        row.comment || '',
  }
}

function cancelEdit() {
  editingKey.value = null
}

function saveEdit(row) {
  const d = siteData.value[row.key]
  if (!d) return
  const raw = String(editForm.value.costToComplete).replace(/[^0-9.]/g, '')
  d.costToComplete = parseFloat(raw) || 0
  d.comment        = editForm.value.comment.trim()
  save(siteData.value)
  editingKey.value = null
}

function deleteRow(row) {
  delete siteData.value[row.key]
  save(siteData.value)
}

function formatCostInput(e) {
  const raw = String(e.target.value).replace(/[^0-9.]/g, '')
  const num = parseFloat(raw) || 0
  editForm.value.costToComplete = num ? num.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''
}

function rawCostInput(e) {
  const raw = String(editForm.value.costToComplete).replace(/[^0-9.]/g, '')
  editForm.value.costToComplete = raw
  e.target.select()
}

function exportToExcel() {
  const data = filteredRows.value.map(r => ({
    'Site ID':          r.siteId,
    'Site Name':        r.siteName,
    'Job Number':       r.jobNumber || '',
    'Status':           r.status === 'started' ? 'Started' : 'Not Started',
    'Cost to Complete': r.costToComplete || 0,
    'Comment':          r.comment || '',
  }))
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Site Status')
  const date = new Date().toISOString().slice(0, 10)
  XLSX.writeFile(wb, `Site_Status_${date}.xlsx`)
}
</script>
