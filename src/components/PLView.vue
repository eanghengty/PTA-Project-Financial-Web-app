<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between pb-2 border-b border-gray-100">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
          <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">P&amp;L</h2>
          <p class="text-xs text-gray-400 mt-0.5">Site-level PO, invoice, cost and margin summary</p>
        </div>
      </div>
      <button @click="exportToExcel"
        class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition shadow-sm">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
        Export
      </button>
    </div>

    <div class="grid grid-cols-5 gap-4">
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Sites</p>
        <p class="text-2xl font-bold text-gray-900">{{ plRows.length }}</p>
        <p class="text-xs text-gray-400 mt-1">site/job rows</p>
      </div>
      <div class="bg-white rounded-xl border border-blue-200 shadow-sm px-5 py-4">
        <p class="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1">Total PO</p>
        <p class="text-2xl font-bold text-blue-700">{{ formatCurrency(totals.totalVOAmount) }}</p>
        <p class="text-xs text-gray-400 mt-1">total VO amount</p>
      </div>
      <div class="bg-white rounded-xl border border-green-200 shadow-sm px-5 py-4">
        <p class="text-xs font-semibold text-green-500 uppercase tracking-wider mb-1">SIT Completed</p>
        <p class="text-2xl font-bold text-green-700">{{ formatCurrency(totals.invoiceAmount) }}</p>
        <p class="text-xs text-gray-400 mt-1">invoiced with date</p>
      </div>
      <div class="bg-white rounded-xl border border-violet-200 shadow-sm px-5 py-4">
        <p class="text-xs font-semibold text-violet-500 uppercase tracking-wider mb-1">Cost to Date</p>
        <p class="text-2xl font-bold text-violet-700">{{ formatCurrency(totals.costToDate) }}</p>
        <p class="text-xs text-gray-400 mt-1">labour + third party</p>
      </div>
      <div class="bg-white rounded-xl border shadow-sm px-5 py-4" :class="totals.profitLoss >= 0 ? 'border-emerald-200' : 'border-red-200'">
        <p class="text-xs font-semibold uppercase tracking-wider mb-1" :class="totals.profitLoss >= 0 ? 'text-emerald-500' : 'text-red-500'">P&amp;L</p>
        <p class="text-2xl font-bold" :class="totals.profitLoss >= 0 ? 'text-emerald-700' : 'text-red-600'">{{ formatCurrency(totals.profitLoss) }}</p>
        <p class="text-xs text-gray-400 mt-1">total PO - cost to date</p>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div class="px-6 py-4 border-b border-gray-100 flex items-center gap-4">
        <input v-model="searchText" type="text" placeholder="Search by site ID, site name or job number..."
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
        <button v-if="searchText" @click="searchText = ''"
          class="text-sm text-gray-400 hover:text-gray-600 transition px-2 py-1 rounded">Clear</button>
        <span class="text-sm text-gray-400 whitespace-nowrap">{{ filteredRows.length }} row{{ filteredRows.length !== 1 ? 's' : '' }}</span>
      </div>

      <div class="overflow-auto" style="max-height: calc(100vh - 360px);">
        <table class="border-collapse w-full" style="min-width: 1100px;">
          <thead class="sticky top-0 z-10">
            <tr>
              <th v-for="col in columns" :key="col.key"
                @click="toggleSort(col.key)"
                class="px-5 py-3 bg-emerald-700 border-b-2 border-emerald-800 text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-emerald-600 transition select-none"
                :class="col.align === 'right' ? 'text-right' : 'text-left'">
                <span class="inline-flex items-center gap-1">
                  {{ col.label }}
                  <svg v-if="sortCol === col.key && sortDir === 'asc'" class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd"/></svg>
                  <svg v-else-if="sortCol === col.key && sortDir === 'desc'" class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                  <svg v-else class="w-3 h-3 text-emerald-400" viewBox="0 0 20 20" fill="currentColor"><path d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zM3 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm4 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z"/></svg>
                </span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-if="filteredRows.length === 0">
              <td :colspan="columns.length" class="px-5 py-12 text-center text-gray-400 text-sm">
                {{ searchText ? 'No P&L rows match your search.' : 'No variation data available yet.' }}
              </td>
            </tr>
            <tr v-for="row in sortedRows" :key="row.rowKey" class="hover:bg-emerald-50 transition-colors">
              <td class="px-5 py-3.5 text-sm text-gray-700 whitespace-nowrap">
                <span class="px-2 py-0.5 rounded text-xs font-bold bg-indigo-100 text-indigo-700">{{ row.siteId || '-' }}</span>
              </td>
              <td class="px-5 py-3.5 text-sm text-gray-700">{{ row.siteName || '-' }}</td>
              <td class="px-5 py-3.5 text-sm font-semibold text-gray-900 whitespace-nowrap">{{ row.jobNumber || '-' }}</td>
              <td class="px-5 py-3.5 text-xs text-right text-gray-500 whitespace-nowrap">{{ row.voCount }} VO{{ row.voCount !== 1 ? 's' : '' }}</td>
              <td class="px-5 py-3.5 text-sm text-right font-bold text-blue-700 whitespace-nowrap">{{ formatCurrency(row.totalVOAmount) }}</td>
              <td class="px-5 py-3.5 text-sm text-right whitespace-nowrap">
                <button @click.stop="openDetail(row, 'invoiced')"
                  :disabled="row.invoiceItems.length === 0"
                  class="font-bold text-green-700 rounded-lg px-2 py-1 transition"
                  :class="row.invoiceItems.length ? 'hover:bg-green-50 hover:ring-1 hover:ring-green-200 cursor-pointer' : 'opacity-40 cursor-default'">
                  {{ formatCurrency(row.invoiceAmount) }}
                </button>
              </td>
              <td class="px-5 py-3.5 text-sm text-right whitespace-nowrap">
                <button @click.stop="openDetail(row, 'notYet')"
                  :disabled="row.notYetInvoiceItems.length === 0"
                  class="font-semibold text-orange-600 rounded-lg px-2 py-1 transition"
                  :class="row.notYetInvoiceItems.length ? 'hover:bg-orange-50 hover:ring-1 hover:ring-orange-200 cursor-pointer' : 'opacity-40 cursor-default'">
                  {{ formatCurrency(row.notYetInvoiceAmount) }}
                </button>
              </td>
              <td class="px-5 py-3.5 text-sm text-right font-semibold text-violet-700 whitespace-nowrap">{{ formatCurrency(row.costToDate) }}</td>
              <td class="px-5 py-3.5 text-sm text-right font-bold whitespace-nowrap" :class="row.profitLoss >= 0 ? 'text-emerald-700' : 'text-red-600'">
                {{ formatCurrency(row.profitLoss) }}
              </td>
            </tr>
          </tbody>
          <tfoot v-if="filteredRows.length > 0" class="sticky bottom-0">
            <tr class="bg-gray-50 border-t-2 border-gray-200">
              <td class="px-5 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider" colspan="3">Totals ({{ filteredRows.length }} rows)</td>
              <td class="px-5 py-3 text-xs text-right text-gray-500">{{ filteredTotals.voCount }} VOs</td>
              <td class="px-5 py-3 text-sm text-right font-bold text-blue-700 whitespace-nowrap">{{ formatCurrency(filteredTotals.totalVOAmount) }}</td>
              <td class="px-5 py-3 text-sm text-right font-bold text-green-700 whitespace-nowrap">{{ formatCurrency(filteredTotals.invoiceAmount) }}</td>
              <td class="px-5 py-3 text-sm text-right font-bold text-orange-600 whitespace-nowrap">{{ formatCurrency(filteredTotals.notYetInvoiceAmount) }}</td>
              <td class="px-5 py-3 text-sm text-right font-bold text-violet-700 whitespace-nowrap">{{ formatCurrency(filteredTotals.costToDate) }}</td>
              <td class="px-5 py-3 text-sm text-right font-bold whitespace-nowrap" :class="filteredTotals.profitLoss >= 0 ? 'text-emerald-700' : 'text-red-600'">{{ formatCurrency(filteredTotals.profitLoss) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="detailModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        @click.self="detailModal = null">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] flex flex-col overflow-hidden">
          <div class="flex items-center justify-between px-6 py-4 shrink-0"
            :class="detailModal.type === 'invoiced' ? 'bg-green-700' : 'bg-orange-600'">
            <div>
              <h3 class="font-bold text-white text-base">
                {{ detailModal.title }}
              </h3>
              <p class="text-xs mt-0.5" :class="detailModal.type === 'invoiced' ? 'text-green-100' : 'text-orange-100'">
                {{ detailModal.row.siteId || '-' }} · {{ detailModal.row.siteName || '-' }} · Job {{ detailModal.row.jobNumber || '-' }}
              </p>
            </div>
            <button @click="detailModal = null"
              class="w-8 h-8 flex items-center justify-center rounded-xl text-white text-lg font-bold transition"
              :class="detailModal.type === 'invoiced' ? 'bg-green-600 hover:bg-green-500' : 'bg-orange-500 hover:bg-orange-400'">×</button>
          </div>

          <div class="px-6 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-3 flex-wrap shrink-0">
            <div class="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-100 rounded-xl">
              <span class="text-xs text-gray-500">Items</span>
              <span class="text-sm font-bold text-gray-800">{{ detailModal.items.length }}</span>
            </div>
            <div class="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-100 rounded-xl">
              <span class="text-xs text-gray-500">Total</span>
              <span class="text-sm font-bold" :class="detailModal.type === 'invoiced' ? 'text-green-700' : 'text-orange-600'">
                {{ formatCurrency(detailModal.total) }}
              </span>
            </div>
            <div v-if="detailModal.type === 'notYet'" class="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-teal-100 rounded-xl">
              <span class="text-xs text-gray-500">Has PO</span>
              <span class="text-sm font-bold text-teal-700">{{ formatCurrency(detailModal.havePO) }}</span>
            </div>
            <div v-if="detailModal.type === 'notYet'" class="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-xl">
              <span class="text-xs text-gray-500">No PO</span>
              <span class="text-sm font-bold text-gray-700">{{ formatCurrency(detailModal.noPO) }}</span>
            </div>
          </div>

          <div class="flex-1 overflow-auto">
            <table class="w-full text-sm border-collapse" style="min-width: 900px;">
              <thead class="sticky top-0 z-10">
                <tr>
                  <th class="px-5 py-3 bg-gray-100 border-b border-gray-200 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Description</th>
                  <th class="px-4 py-3 bg-gray-100 border-b border-gray-200 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">Category</th>
                  <th class="px-4 py-3 bg-gray-100 border-b border-gray-200 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">Scope</th>
                  <th class="px-4 py-3 bg-gray-100 border-b border-gray-200 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">PO Number</th>
                  <th class="px-4 py-3 bg-gray-100 border-b border-gray-200 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">Invoice Status</th>
                  <th class="px-4 py-3 bg-gray-100 border-b border-gray-200 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">Invoice Date</th>
                  <th class="px-4 py-3 bg-gray-100 border-b border-gray-200 text-right text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">Amount</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="vo in detailModal.items" :key="vo.id" class="hover:bg-gray-50 transition">
                  <td class="px-5 py-3">
                    <div class="max-w-xs truncate text-gray-800 font-medium" :title="vo.voDescription">{{ vo.voDescription || '-' }}</div>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-gray-600">{{ vo.voCategory || '-' }}</td>
                  <td class="px-4 py-3 whitespace-nowrap text-gray-600">{{ vo.scope || '-' }}</td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span v-if="vo.poNumber" class="font-mono text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded">{{ vo.poNumber }}</span>
                    <span v-else class="text-gray-300 text-xs">-</span>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span v-if="vo.invoiceStatus"
                      :class="vo.invoiceStatus === 'SIT Completed' ? 'bg-green-100 text-green-700'
                        : vo.invoiceStatus === 'To Be Sent to Nokia' ? 'bg-indigo-100 text-indigo-700'
                        : vo.invoiceStatus === 'SIT Approved' ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700'"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold">
                      {{ vo.invoiceStatus }}
                    </span>
                    <span v-else class="text-gray-300 text-xs">-</span>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-gray-600">{{ vo.invoiceDate ? new Date(vo.invoiceDate).toLocaleDateString('en-AU') : '-' }}</td>
                  <td class="px-4 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">{{ formatCurrency(vo.voAmount || 0) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-end shrink-0">
            <button @click="detailModal = null"
              class="px-5 py-2 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition">Close</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import * as XLSX from 'xlsx'
import { useVOStore } from '../stores/voStore'
import { formatCurrency } from '../utils/formatters'

const store = useVOStore()
const searchText = ref('')
const sortCol = ref('siteId')
const sortDir = ref('asc')
const detailModal = ref(null)

const columns = [
  { key: 'siteId',              label: 'Site ID',                 align: 'left' },
  { key: 'siteName',            label: 'Site Name',               align: 'left' },
  { key: 'jobNumber',           label: 'Job',                     align: 'left' },
  { key: 'voCount',             label: 'Total VO Qty',            align: 'right' },
  { key: 'totalVOAmount',       label: 'Total VO Amount',         align: 'right' },
  { key: 'invoiceAmount',       label: 'Total Invoice Amount',    align: 'right' },
  { key: 'notYetInvoiceAmount', label: 'Not Yet Invoice Amount',  align: 'right' },
  { key: 'costToDate',          label: 'Cost to Date',            align: 'right' },
  { key: 'profitLoss',          label: 'P&L',                     align: 'right' },
]

const plRows = computed(() => {
  const map = new Map()
  for (const vo of store.vos.value || []) {
    const key = `${vo.siteId || ''}|${vo.jobNumber || ''}|${vo.siteName || ''}`
    const existing = map.get(key) || {
      rowKey: key,
      siteId: vo.siteId || '',
      siteName: vo.siteName || '',
      jobNumber: vo.jobNumber || '',
      voCount: 0,
      totalVOAmount: 0,
      invoiceAmount: 0,
      costToDate: 0,
      vos: [],
    }

    const voAmount = Number(vo.voAmount) || 0
    const cost = (Number(vo.labourCost) || 0) + (Number(vo.thirdPartyCost) || 0)
    const isInvoiced = vo.invoiceStatus === 'SIT Completed' && !!vo.invoiceDate

    existing.voCount += 1
    existing.totalVOAmount += voAmount
    existing.invoiceAmount += isInvoiced ? voAmount : 0
    existing.costToDate += cost
    existing.vos.push(vo)
    map.set(key, existing)
  }

  return [...map.values()].map(row => ({
    ...row,
    invoiceItems: row.vos.filter(vo => vo.invoiceStatus === 'SIT Completed' && !!vo.invoiceDate),
    notYetInvoiceItems: row.vos.filter(vo => !(vo.invoiceStatus === 'SIT Completed' && !!vo.invoiceDate)),
    notYetInvoiceAmount: row.totalVOAmount - row.invoiceAmount,
    profitLoss: row.totalVOAmount - row.costToDate,
  }))
})

const filteredRows = computed(() => {
  const q = searchText.value.trim().toLowerCase()
  if (!q) return plRows.value
  return plRows.value.filter(row =>
    row.siteId.toLowerCase().includes(q) ||
    row.siteName.toLowerCase().includes(q) ||
    row.jobNumber.toLowerCase().includes(q)
  )
})

const sortedRows = computed(() => {
  const dir = sortDir.value === 'asc' ? 1 : -1
  return [...filteredRows.value].sort((a, b) => {
    let av = a[sortCol.value]
    let bv = b[sortCol.value]
    if (typeof av === 'string') av = av.toLowerCase()
    if (typeof bv === 'string') bv = bv.toLowerCase()
    if (av < bv) return -1 * dir
    if (av > bv) return 1 * dir
    return 0
  })
})

const totals = computed(() => summarize(plRows.value))
const filteredTotals = computed(() => summarize(filteredRows.value))

function summarize(rows) {
  return rows.reduce((acc, row) => {
    acc.voCount += row.voCount
    acc.totalVOAmount += row.totalVOAmount
    acc.invoiceAmount += row.invoiceAmount
    acc.notYetInvoiceAmount += row.notYetInvoiceAmount
    acc.costToDate += row.costToDate
    acc.profitLoss += row.profitLoss
    return acc
  }, {
    voCount: 0,
    totalVOAmount: 0,
    invoiceAmount: 0,
    notYetInvoiceAmount: 0,
    costToDate: 0,
    profitLoss: 0,
  })
}

function toggleSort(key) {
  if (sortCol.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortCol.value = key
    sortDir.value = 'asc'
  }
}

function openDetail(row, type) {
  const isInvoiced = type === 'invoiced'
  const items = isInvoiced ? row.invoiceItems : row.notYetInvoiceItems
  if (!items.length) return
  detailModal.value = {
    row,
    type,
    title: isInvoiced ? 'Total Invoice Amount Detail' : 'Not Yet Invoice Amount Detail',
    items,
    total: items.reduce((sum, vo) => sum + (Number(vo.voAmount) || 0), 0),
    havePO: items.filter(vo => vo.poNumber?.trim()).reduce((sum, vo) => sum + (Number(vo.voAmount) || 0), 0),
    noPO: items.filter(vo => !vo.poNumber?.trim()).reduce((sum, vo) => sum + (Number(vo.voAmount) || 0), 0),
  }
}

function exportToExcel() {
  const rows = sortedRows.value.map(row => ({
    'Site ID': row.siteId,
    'Site Name': row.siteName,
    'Job': row.jobNumber,
    'Total VO Qty': row.voCount,
    'Total VO Amount': row.totalVOAmount,
    'Total Invoice Amount': row.invoiceAmount,
    'Not Yet Invoice Amount': row.notYetInvoiceAmount,
    'Cost to Date': row.costToDate,
    'P&L': row.profitLoss,
  }))
  const ws = XLSX.utils.json_to_sheet(rows)
  ws['!cols'] = [
    { wch: 14 }, { wch: 28 }, { wch: 18 }, { wch: 14 }, { wch: 18 },
    { wch: 22 }, { wch: 24 }, { wch: 16 }, { wch: 16 },
  ]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'P&L')
  const date = new Date().toLocaleDateString('en-AU').replace(/\//g, '-')
  XLSX.writeFile(wb, `P&L_${date}.xlsx`)
}
</script>
