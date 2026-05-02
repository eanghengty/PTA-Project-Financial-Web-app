<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between pb-2 border-b border-gray-100">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">Invoice Prep List</h2>
          <p class="text-xs text-gray-400 mt-0.5">{{ displayedItems.length }} of {{ items.length }} variation orders ready for invoicing</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <!-- Update Invoice Status (shown when rows selected) -->
        <button v-if="selectedCount > 0"
          @click="showModal = true"
          class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          Set Invoice Status ({{ selectedCount }})
        </button>
        <button v-if="selectedCount > 0" @click="exportSelected"
          class="inline-flex items-center gap-2 px-4 py-2 border border-blue-300 text-blue-700 rounded-xl text-sm font-semibold hover:bg-blue-50 transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Export Selected ({{ selectedCount }})
        </button>
        <button v-if="hasActiveFilters" @click="clearAllFilters"
          class="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 transition">
          ✕ Clear Filters
        </button>
        <button v-if="items.length > 0" @click="exportInvoicePrep"
          class="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Export All
        </button>
        <button v-if="items.length > 0" @click="clearAll"
          class="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
          Clear All
        </button>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="items.length === 0" class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-12 text-center border border-blue-200">
      <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-100 flex items-center justify-center">
        <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      </div>
      <h3 class="text-xl font-bold text-gray-900 mb-2">No Items in Invoice Prep</h3>
      <p class="text-gray-500 text-sm">Select rows in the Variations table and click <strong>Prep for Invoice</strong> to add them here.</p>
    </div>

    <!-- Invoice list table -->
    <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="overflow-auto" style="max-height: calc(100vh - 280px);">
        <table class="border-collapse w-full">
          <thead class="sticky top-0 z-20">
            <tr>
              <!-- Select all -->
              <th class="px-4 py-3 bg-blue-700 border-b-2 border-blue-800 w-12 text-center">
                <input type="checkbox" :checked="isAllSelected" :indeterminate="isIndeterminate"
                  @change="toggleSelectAll" class="w-4 h-4 rounded cursor-pointer accent-white" />
              </th>
              <template v-for="col in columns" :key="col.key">
                <th class="bg-blue-700 border-b-2 border-blue-800 p-0" :class="col.thClass">
                  <div class="flex items-stretch w-full">
                    <button @click="toggleSort(col.key)"
                      class="flex-1 px-3 py-3 flex items-center gap-1.5 hover:bg-blue-600 transition-colors text-left min-w-0">
                      <span class="text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">{{ col.label }}</span>
                      <span class="flex-shrink-0">
                        <svg v-if="sortColumn === col.key && sortDir === 'asc'" class="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd"/></svg>
                        <svg v-else-if="sortColumn === col.key && sortDir === 'desc'" class="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                        <svg v-else class="w-3 h-3 text-blue-400" viewBox="0 0 20 20" fill="currentColor"><path d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zM3 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm4 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z"/></svg>
                      </span>
                    </button>
                    <button @click="toggleFilterMenu(col.key, $event)"
                      class="px-2 py-3 hover:bg-blue-600 transition-colors border-l border-blue-600 flex-shrink-0 flex items-center">
                      <span class="relative">
                        <svg class="w-3.5 h-3.5 transition-colors" :class="filters[col.key]?.length ? 'text-yellow-300' : 'text-blue-300'" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L13 10.414V15a1 1 0 01-.553.894l-4 2A1 1 0 017 17v-6.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd"/></svg>
                        <span v-if="filters[col.key]?.length" class="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
                      </span>
                    </button>
                  </div>
                </th>
              </template>
              <th class="px-5 py-3 bg-blue-700 border-b-2 border-blue-800 text-right text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">Final Value</th>
              <th class="px-5 py-3 bg-blue-700 border-b-2 border-blue-800 text-center text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">Remove</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="vo in displayedItems" :key="vo.id"
              :class="['transition-colors cursor-pointer', selectedIds.has(vo.id) ? 'bg-blue-50' : 'hover:bg-gray-50']">
              <td class="px-4 py-4 text-center w-12">
                <input type="checkbox" :checked="selectedIds.has(vo.id)"
                  @change="toggleRow(vo.id)" @click.stop
                  class="w-4 h-4 rounded border-gray-300 cursor-pointer accent-blue-600" />
              </td>
              <td class="px-5 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">{{ vo.siteId }}</td>
              <td class="px-5 py-4 text-sm text-gray-900 font-medium whitespace-nowrap">{{ vo.siteName }}</td>
              <td class="px-5 py-4 text-sm text-gray-700 whitespace-nowrap">{{ vo.jobNumber || '—' }}</td>
              <td class="px-5 py-4 text-sm text-gray-700 whitespace-nowrap">{{ vo.scope || '—' }}</td>
              <td class="px-5 py-4 text-sm text-gray-700">
                <div class="max-w-xs truncate" :title="vo.voDescription">{{ vo.voDescription }}</div>
              </td>
              <td class="px-5 py-4 whitespace-nowrap">
                <span :class="['inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold', getStatusColor(vo.voStatus)]">
                  {{ formatStatus(vo.voStatus) }}
                </span>
              </td>
              <td class="px-5 py-4 text-sm text-right font-semibold text-gray-900 whitespace-nowrap">
                {{ formatCurrency(vo.amountLog?.length ? vo.amountLog[0].from : vo.voAmount) }}
              </td>
              <td class="px-5 py-4 whitespace-nowrap">
                <span v-if="vo.poNumber" class="font-mono text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded">{{ vo.poNumber }}</span>
                <span v-else class="text-gray-300 text-xs">—</span>
              </td>
              <td class="px-5 py-4 whitespace-nowrap">
                <span v-if="vo.invoiceStatus"
                  :class="vo.invoiceStatus === 'To Be Sent to Nokia' ? 'bg-indigo-100 text-indigo-700'
                    : vo.invoiceStatus === 'Request to Nokia' ? 'bg-blue-100 text-blue-700'
                    : vo.invoiceStatus === 'SIT Approved' ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-green-100 text-green-700'"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold">
                  {{ vo.invoiceStatus }}
                </span>
                <span v-else class="text-gray-300 text-xs">—</span>
              </td>
              <td class="px-5 py-4 text-sm text-gray-700 whitespace-nowrap">{{ formatDate(vo.invoiceDate) }}</td>
              <!-- Final Value cell -->
              <td class="px-3 py-3 whitespace-nowrap">
                <div class="flex items-center gap-2 justify-end">
                  <template v-if="vo.amountLog?.length">
                    <div class="text-right">
                      <div class="text-sm font-semibold text-orange-700">{{ formatCurrency(vo.voAmount) }}</div>
                      <div class="text-xs" :class="vo.amountLog[vo.amountLog.length-1].delta >= 0 ? 'text-green-600' : 'text-red-600'">
                        {{ vo.amountLog[vo.amountLog.length-1].delta >= 0 ? '+' : '' }}{{ formatCurrency(vo.amountLog[vo.amountLog.length-1].delta) }}
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <span class="text-sm text-gray-400">—</span>
                  </template>
                  <button @click.stop="openFinalModal(vo)"
                    class="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition" title="Edit final value">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                </div>
              </td>
              <td class="px-5 py-4 text-center">
                <button @click="remove(vo.id)"
                  class="inline-flex items-center px-3 py-1 rounded-md text-red-600 hover:bg-red-50 transition font-medium text-sm">
                  Remove
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer summary -->
      <div class="px-6 py-3 bg-blue-50 border-t border-blue-200 flex items-center justify-between gap-4 flex-wrap">
        <span class="text-sm text-gray-600 font-medium">
          {{ displayedItems.length }} of {{ items.length }} items
          <span v-if="hasActiveFilters" class="text-blue-600"> (filtered)</span>
        </span>
        <div class="flex items-center gap-3">
          <div v-if="selectedCount > 0" class="flex items-center gap-2 px-4 py-1.5 bg-white border border-blue-200 rounded-xl">
            <span class="text-xs font-semibold text-blue-600">{{ selectedCount }} selected</span>
            <span class="w-px h-3.5 bg-blue-200"></span>
            <span class="text-sm font-bold text-blue-800">{{ formatCurrency(selectedTotal) }}</span>
          </div>
          <div class="flex items-center gap-2 px-4 py-1.5 bg-blue-600 rounded-xl">
            <span class="text-xs font-semibold text-blue-100">{{ hasActiveFilters ? 'Filtered Total' : 'Total Amount' }}</span>
            <span class="w-px h-3.5 bg-blue-400"></span>
            <span class="text-sm font-bold text-white">{{ formatCurrency(displayedTotal) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Invoice Prep Modal -->
    <InvoicePrepModal
      v-if="showModal"
      :vos="selectedVOs"
      @confirm="onConfirm"
      @cancel="showModal = false"
    />

    <!-- Final Value Modal -->
    <teleport to="body">
      <div v-if="finalModalVO" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="finalModalVO = null"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md" @click.stop>
          <!-- Header -->
          <div class="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-gray-100">
            <div class="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </div>
            <div class="min-w-0">
              <h3 class="text-base font-bold text-gray-900">Set Final Value</h3>
              <p class="text-xs text-gray-400 truncate">{{ finalModalVO.siteId }} · {{ finalModalVO.siteName }}</p>
            </div>
            <button @click="finalModalVO = null" class="ml-auto p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <!-- Body -->
          <div class="px-6 py-5 space-y-4">
            <!-- VO description -->
            <p class="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2 leading-snug">{{ finalModalVO.voDescription }}</p>
            <!-- Amount reference -->
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500">Original Amount</span>
              <span class="font-semibold text-gray-700">
                {{ formatCurrency(finalModalVO.amountLog?.length ? finalModalVO.amountLog[0].from : finalModalVO.voAmount) }}
              </span>
            </div>
            <!-- Input -->
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Final Value (AUD)</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                <input
                  ref="finalModalInput"
                  v-model="finalModalValue"
                  @keydown.enter="confirmFinalModal"
                  @keydown.escape="finalModalVO = null"
                  type="text" inputmode="decimal" placeholder="0.00"
                  class="w-full pl-7 pr-4 py-2.5 border border-orange-300 bg-orange-50 rounded-xl text-sm font-semibold text-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition" />
              </div>
            </div>
            <!-- Live delta preview -->
            <div v-if="finalModalDelta !== null" class="flex items-center justify-between text-sm bg-gray-50 rounded-lg px-3 py-2">
              <span class="text-gray-500">Delta</span>
              <span class="font-semibold" :class="finalModalDelta >= 0 ? 'text-green-600' : 'text-red-600'">
                {{ finalModalDelta >= 0 ? '+' : '' }}{{ formatCurrency(finalModalDelta) }}
              </span>
            </div>
          </div>
          <!-- Footer -->
          <div class="flex items-center justify-end gap-2 px-6 pb-5">
            <button @click="finalModalVO = null"
              class="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition">
              Cancel
            </button>
            <button @click="confirmFinalModal"
              :disabled="!finalModalValueValid"
              class="px-5 py-2 text-sm font-semibold text-white rounded-xl transition"
              :class="finalModalValueValid ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-200 text-gray-400 cursor-not-allowed'">
              Save Final Value
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Filter Popover -->
    <FilterPopover
      v-if="activeFilterMenu"
      :column-key="activeFilterMenu"
      :column-label="columns.find(c => c.key === activeFilterMenu)?.label || activeFilterMenu"
      :values="getUniqueValues(activeFilterMenu)"
      :anchor-rect="activeFilterAnchorRect"
      :selected="filters[activeFilterMenu] || []"
      @update:filters="updateFilter"
      @close="activeFilterMenu = null; activeFilterAnchorRect = null"
    />
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useVOStore } from '../stores/voStore'
import { updateVO } from '../db/indexdb'
import { formatCurrency, formatDate as fmtDate } from '../utils/formatters'
import InvoicePrepModal from './InvoicePrepModal.vue'
import FilterPopover from './FilterPopover.vue'
import * as XLSX from 'xlsx'

const store = useVOStore()

const columns = [
  { key: 'siteId',        label: 'Site ID',        thClass: '' },
  { key: 'siteName',      label: 'Site Name',      thClass: '' },
  { key: 'jobNumber',     label: 'Job No.',         thClass: '' },
  { key: 'scope',         label: 'Scope',           thClass: '' },
  { key: 'voDescription', label: 'Description',     thClass: '' },
  { key: 'voStatus',      label: 'VO Status',       thClass: '' },
  { key: 'voAmount',      label: 'Amount',          thClass: '' },
  { key: 'poNumber',      label: 'PO Number',       thClass: '' },
  { key: 'invoiceStatus', label: 'Invoice Status',  thClass: '' },
  { key: 'invoiceDate',   label: 'Invoice Date',    thClass: '' },
]

const items = computed(() => store.invoicePrepItems.value)

// ── Sort ──
const sortColumn = ref(null)
const sortDir    = ref('asc')

const toggleSort = (key) => {
  if (sortColumn.value === key) {
    if (sortDir.value === 'asc') { sortDir.value = 'desc' }
    else { sortColumn.value = null; sortDir.value = 'asc' }
  } else {
    sortColumn.value = key
    sortDir.value = 'asc'
  }
}

const getSortValue = (vo, col) => {
  if (col === 'voAmount') return vo.voAmount || 0
  if (col === 'invoiceDate') return vo.invoiceDate ? new Date(vo.invoiceDate).getTime() : 0
  if (col === 'voStatus') return formatStatus(vo.voStatus)
  return (vo[col] ?? '').toString().toLowerCase()
}

// ── Filters ──
const filters = ref({
  siteId: [], siteName: [], jobNumber: [], scope: [],
  voDescription: [], voStatus: [], voAmount: [], poNumber: [], invoiceStatus: [], invoiceDate: [],
})
const activeFilterMenu     = ref(null)
const activeFilterAnchorRect = ref(null)

const hasActiveFilters = computed(() => Object.values(filters.value).some(f => f.length > 0))

const getUniqueValues = (key) => {
  const set = new Set()
  items.value.forEach(vo => {
    let v = vo[key]
    if (key === 'voStatus')      v = formatStatus(v)
    else if (key === 'voAmount') v = formatCurrency(v)
    else if (key === 'invoiceDate') v = v ? new Date(v).toLocaleDateString('en-AU') : '—'
    if (v !== null && v !== undefined && v !== '') set.add(String(v))
  })
  return Array.from(set).sort()
}

const matchesFilters = (vo) => {
  for (const [key, selected] of Object.entries(filters.value)) {
    if (!selected.length) continue
    let v = vo[key]
    if (key === 'voStatus')      v = formatStatus(v)
    else if (key === 'voAmount') v = formatCurrency(v)
    else if (key === 'invoiceDate') v = v ? new Date(v).toLocaleDateString('en-AU') : '—'
    if (!selected.includes(String(v ?? ''))) return false
  }
  return true
}

const displayedItems = computed(() => {
  let list = items.value.filter(matchesFilters)
  if (sortColumn.value) {
    const col = sortColumn.value
    const dir = sortDir.value === 'asc' ? 1 : -1
    list = [...list].sort((a, b) => {
      const av = getSortValue(a, col)
      const bv = getSortValue(b, col)
      if (av < bv) return -1 * dir
      if (av > bv) return  1 * dir
      return 0
    })
  }
  return list
})

const displayedTotal = computed(() => displayedItems.value.reduce((s, vo) => s + (vo.voAmount || 0), 0))

const toggleFilterMenu = (key, event) => {
  if (activeFilterMenu.value === key) {
    activeFilterMenu.value = null
    activeFilterAnchorRect.value = null
  } else {
    activeFilterMenu.value = key
    activeFilterAnchorRect.value = event.currentTarget.getBoundingClientRect()
  }
}

const updateFilter = (key, vals) => { filters.value[key] = vals }

const clearAllFilters = () => {
  Object.keys(filters.value).forEach(k => { filters.value[k] = [] })
}

// ── Row selection ──
const selectedIds   = ref(new Set())
const selectedCount = computed(() => selectedIds.value.size)
const isAllSelected = computed(() => displayedItems.value.length > 0 && displayedItems.value.every(vo => selectedIds.value.has(vo.id)))
const isIndeterminate = computed(() => {
  const n = displayedItems.value.filter(vo => selectedIds.value.has(vo.id)).length
  return n > 0 && n < displayedItems.value.length
})
const selectedVOs   = computed(() => displayedItems.value.filter(vo => selectedIds.value.has(vo.id)))
const selectedTotal = computed(() => selectedVOs.value.reduce((s, vo) => s + (vo.voAmount || 0), 0))

const toggleRow = (id) => {
  const s = new Set(selectedIds.value)
  s.has(id) ? s.delete(id) : s.add(id)
  selectedIds.value = s
}
const toggleSelectAll = () => {
  selectedIds.value = isAllSelected.value ? new Set() : new Set(displayedItems.value.map(vo => vo.id))
}

// ── Modal ──
const showModal = ref(false)

const onConfirm = async ({ status, date }) => {
  const ids = [...selectedIds.value]
  await store.bulkUpdateInvoiceStatus(ids, status, date)
  showModal.value = false
  selectedIds.value = new Set()
}

const remove = (id) => {
  store.removeFromInvoicePrep(id)
  const s = new Set(selectedIds.value)
  s.delete(id)
  selectedIds.value = s
}

const clearAll = () => {
  if (confirm('Remove all items from the invoice prep list?')) {
    store.clearInvoicePrep()
    selectedIds.value = new Set()
  }
}

// ── Final Value Modal ──
const finalModalVO    = ref(null)
const finalModalValue = ref('')
const finalModalInput = ref(null)

const finalModalDelta = computed(() => {
  if (!finalModalVO.value) return null
  const v = parseFloat(String(finalModalValue.value).replace(/,/g, ''))
  if (isNaN(v)) return null
  const initial = finalModalVO.value.amountLog?.length
    ? finalModalVO.value.amountLog[0].from
    : (finalModalVO.value.voAmount || 0)
  return v - initial
})

const finalModalValueValid = computed(() => {
  const v = parseFloat(String(finalModalValue.value).replace(/,/g, ''))
  return !isNaN(v) && finalModalValue.value !== ''
})

const openFinalModal = (vo) => {
  finalModalVO.value = vo
  const latest = vo.amountLog?.length ? vo.amountLog[vo.amountLog.length - 1].to : ''
  finalModalValue.value = latest ? String(latest) : ''
  nextTick(() => { finalModalInput.value?.focus(); finalModalInput.value?.select() })
}

const confirmFinalModal = async () => {
  const vo = finalModalVO.value
  if (!vo || !finalModalValueValid.value) return
  const finalAmt = parseFloat(String(finalModalValue.value).replace(/,/g, ''))
  const initialAmt = vo.amountLog?.length ? vo.amountLog[0].from : (vo.voAmount || 0)
  const currentFinal = vo.amountLog?.length ? vo.amountLog[vo.amountLog.length - 1].to : vo.voAmount
  if (finalAmt === currentFinal) { finalModalVO.value = null; return }
  const delta = finalAmt - initialAmt
  const amountLog = [...(vo.amountLog || []), {
    from: initialAmt, to: finalAmt, delta,
    loggedAt: new Date().toISOString(), source: 'invoice-prep'
  }]
  const updatedVO = await updateVO(vo.id, { ...vo, voAmount: finalAmt, amountChangeFlag: true, amountLog, updatedAt: new Date() })
  const idx = store.vos.value.findIndex(v => v.id === vo.id)
  if (idx !== -1) store.vos.value.splice(idx, 1, updatedVO)
  finalModalVO.value = null
}

// ── Export ──
const buildExportRows = (vos) => vos.map(vo => {
  const initialAmt = vo.amountLog?.length ? vo.amountLog[0].from : vo.voAmount
  const finalAmt   = vo.amountLog?.length ? vo.voAmount : null
  const delta      = vo.amountLog?.length ? vo.amountLog[vo.amountLog.length - 1].delta : null
  return {
    'Site ID':            vo.siteId || '',
    'Site Name':          vo.siteName || '',
    'Job Number':         vo.jobNumber || '',
    'Scope':              vo.scope || '',
    'Description':        vo.voDescription || '',
    'VO Status':          formatStatus(vo.voStatus),
    'Initial Amount (AUD)': initialAmt || 0,
    'Final Value (AUD)':  finalAmt ?? '',
    'Delta (AUD)':        delta ?? '',
    'PO Number':          vo.poNumber || '',
    'Invoice Status':     vo.invoiceStatus || '',
    'Invoice Date':       vo.invoiceDate ? fmtDate(vo.invoiceDate) : '',
  }
})

const colWidths = [
  { wch: 10 }, { wch: 22 }, { wch: 14 }, { wch: 18 }, { wch: 40 },
  { wch: 14 }, { wch: 18 }, { wch: 16 }, { wch: 14 }, { wch: 14 }, { wch: 18 }, { wch: 14 },
]

const writeExcel = (vos, filename) => {
  const ws = XLSX.utils.json_to_sheet(buildExportRows(vos))
  ws['!cols'] = colWidths
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Invoice Prep')
  XLSX.writeFile(wb, filename)
}

const exportInvoicePrep = () => {
  const date = new Date().toISOString().slice(0, 10)
  writeExcel(items.value, `InvoicePrep_${date}.xlsx`)
}

const exportSelected = () => {
  const date = new Date().toISOString().slice(0, 10)
  writeExcel(selectedVOs.value, `InvoicePrep_Selected_${date}.xlsx`)
}

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-AU') : '—'

const formatStatus = (status) => {
  const map = { draft: 'Draft', submitted: 'Submitted', 'pending-approval': 'Pending', approved: 'Approved', rejected: 'Rejected' }
  return map[status] || status
}

const getStatusColor = (status) => {
  const map = {
    draft: 'bg-gray-200 text-gray-800',
    submitted: 'bg-blue-200 text-blue-800',
    'pending-approval': 'bg-yellow-200 text-yellow-800',
    approved: 'bg-green-200 text-green-800',
    rejected: 'bg-red-200 text-red-800'
  }
  return map[status] || 'bg-gray-200 text-gray-800'
}
</script>
