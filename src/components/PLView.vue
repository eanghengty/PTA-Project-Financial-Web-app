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
              <td class="px-5 py-3.5 text-sm text-right font-bold text-green-700 whitespace-nowrap">{{ formatCurrency(row.invoiceAmount) }}</td>
              <td class="px-5 py-3.5 text-sm text-right font-semibold text-orange-600 whitespace-nowrap">{{ formatCurrency(row.notYetInvoiceAmount) }}</td>
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
    }

    const voAmount = Number(vo.voAmount) || 0
    const cost = (Number(vo.labourCost) || 0) + (Number(vo.thirdPartyCost) || 0)
    const isInvoiced = vo.invoiceStatus === 'SIT Completed' && !!vo.invoiceDate

    existing.voCount += 1
    existing.totalVOAmount += voAmount
    existing.invoiceAmount += isInvoiced ? voAmount : 0
    existing.costToDate += cost
    map.set(key, existing)
  }

  return [...map.values()].map(row => ({
    ...row,
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
