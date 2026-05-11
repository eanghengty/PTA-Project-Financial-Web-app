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
      <div class="flex items-center gap-2">
        <label class="inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold cursor-pointer transition"
          :class="includeCostToComplete ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'">
          <input v-model="includeCostToComplete" type="checkbox" class="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
          Include Cost to Complete
        </label>
        <select v-model="costToCompleteMonth"
          :disabled="!includeCostToComplete"
          class="px-3 py-2 rounded-xl border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed"
          :class="includeCostToComplete && costToCompleteMonth ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-white border-gray-300 text-gray-600'">
          <option value="">Select month</option>
          <option v-for="month in costToCompleteMonths" :key="month.value" :value="month.value">{{ month.label }}</option>
        </select>
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

    <div class="grid grid-cols-5 gap-4">
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Sites</p>
        <p class="text-2xl font-bold text-gray-900">{{ summaryRows.length }}</p>
        <p class="text-xs text-gray-400 mt-1">site/job rows</p>
      </div>
      <div class="bg-white rounded-xl border border-blue-200 shadow-sm px-5 py-4">
        <p class="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1">Total PO</p>
        <p class="text-2xl font-bold text-blue-700">{{ formatCurrency(summaryTotals.totalVOAmount) }}</p>
        <p class="text-xs text-gray-400 mt-1">total VO amount</p>
      </div>
      <div class="bg-white rounded-xl border border-green-200 shadow-sm px-5 py-4">
        <p class="text-xs font-semibold text-green-500 uppercase tracking-wider mb-1">SIT Completed</p>
        <p class="text-2xl font-bold text-green-700">{{ formatCurrency(summaryTotals.invoiceAmount) }}</p>
        <p class="text-xs text-gray-400 mt-1">invoiced with date</p>
      </div>
      <div class="bg-white rounded-xl border border-violet-200 shadow-sm px-5 py-4">
        <p class="text-xs font-semibold text-violet-500 uppercase tracking-wider mb-1">Cost to Date</p>
        <p class="text-2xl font-bold text-violet-700">{{ formatCurrency(summaryTotals.costToDate) }}</p>
        <p class="text-xs text-gray-400 mt-1">labour + third party</p>
      </div>
      <div class="bg-white rounded-xl border shadow-sm px-5 py-4" :class="summaryTotals.profitLoss >= 0 ? 'border-emerald-200' : 'border-red-200'">
        <p class="text-xs font-semibold uppercase tracking-wider mb-1" :class="summaryTotals.profitLoss >= 0 ? 'text-emerald-500' : 'text-red-500'">P&amp;L</p>
        <p class="text-2xl font-bold" :class="summaryTotals.profitLoss >= 0 ? 'text-emerald-700' : 'text-red-600'">{{ formatCurrency(summaryTotals.profitLoss) }}</p>
        <p class="text-xs text-gray-400 mt-1">total PO - cost to date</p>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div class="px-6 py-4 border-b border-gray-100 flex items-center gap-4">
        <input v-model="searchText" type="text" placeholder="Search by site ID, site name or job number..."
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
        <div class="relative shrink-0">
          <button @click.stop="siteFilterOpen = !siteFilterOpen; scopeFilterOpen = false"
            class="inline-flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-semibold transition"
            :class="selectedSiteIds.size ? 'border-indigo-300 bg-indigo-50 text-indigo-700' : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'">
            Site ID
            <span v-if="selectedSiteIds.size" class="px-1.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] leading-none">{{ selectedSiteIds.size }}</span>
            <svg class="w-3.5 h-3.5" :class="siteFilterOpen ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <div v-if="siteFilterOpen" class="absolute right-0 z-30 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
            <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Filter Site ID</p>
              <button v-if="selectedSiteIds.size" @click="selectedSiteIds = new Set()" class="text-xs text-indigo-600 font-semibold hover:text-indigo-800">Clear</button>
            </div>
            <div class="max-h-72 overflow-auto py-2">
              <label v-for="site in siteOptions" :key="site"
                class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 cursor-pointer">
                <input type="checkbox" :checked="selectedSiteIds.has(site)" @change="toggleSite(site)"
                  class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <span class="font-mono text-xs">{{ site || '-' }}</span>
              </label>
            </div>
          </div>
        </div>
        <div class="relative shrink-0">
          <button @click.stop="scopeFilterOpen = !scopeFilterOpen; siteFilterOpen = false"
            class="inline-flex items-center gap-2 px-3 py-2 border rounded-lg text-sm font-semibold transition"
            :class="selectedScopes.size ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'">
            Scope
            <span v-if="selectedScopes.size" class="px-1.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] leading-none">{{ selectedScopes.size }}</span>
            <svg class="w-3.5 h-3.5" :class="scopeFilterOpen ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <div v-if="scopeFilterOpen" class="absolute right-0 z-30 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
            <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Filter Scope</p>
              <button v-if="selectedScopes.size" @click="selectedScopes = new Set()" class="text-xs text-emerald-600 font-semibold hover:text-emerald-800">Clear</button>
            </div>
            <div class="max-h-72 overflow-auto py-2">
              <label v-for="scope in scopeOptions" :key="scope"
                class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 cursor-pointer">
                <input type="checkbox" :checked="selectedScopes.has(scope)" @change="toggleScope(scope)"
                  class="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                <span>{{ scope || '-' }}</span>
              </label>
            </div>
          </div>
        </div>
        <button v-if="hasActiveFilters" @click="clearAllFilters"
          class="text-sm text-gray-400 hover:text-gray-600 transition px-2 py-1 rounded">Clear</button>
        <span class="text-sm text-gray-400 whitespace-nowrap">{{ filteredRows.length }} row{{ filteredRows.length !== 1 ? 's' : '' }}</span>
      </div>

      <div class="overflow-auto" style="max-height: calc(100vh - 360px);">
        <table class="border-collapse w-full" style="min-width: 2150px;">
          <thead class="sticky top-0 z-40">
            <tr>
              <th v-for="col in columns" :key="col.key"
                @click="toggleSort(col.key)"
                class="sticky top-0 z-40 px-5 py-3 bg-emerald-700 border-b-2 border-emerald-800 text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-emerald-600 transition select-none"
                :class="[
                  col.align === 'right' ? 'text-right' : 'text-left',
                  col.sticky === 1 ? 'left-0 z-50 min-w-[130px] !bg-emerald-700 hover:!bg-emerald-600 shadow-[4px_0_8px_-6px_rgba(15,23,42,0.45)]' : '',
                  col.sticky === 2 ? 'left-[130px] z-50 min-w-[240px] !bg-emerald-700 hover:!bg-emerald-600 shadow-[4px_0_8px_-6px_rgba(15,23,42,0.45)]' : ''
                ]">
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
              <td class="sticky left-0 z-10 min-w-[130px] px-5 py-3.5 text-sm text-gray-700 whitespace-nowrap bg-white shadow-[4px_0_8px_-6px_rgba(15,23,42,0.35)]">
                <span class="px-2 py-0.5 rounded text-xs font-bold bg-indigo-100 text-indigo-700">{{ row.siteId || '-' }}</span>
              </td>
              <td class="sticky left-[130px] z-10 min-w-[240px] px-5 py-3.5 text-sm text-gray-700 bg-white shadow-[4px_0_8px_-6px_rgba(15,23,42,0.35)]">{{ row.siteName || '-' }}</td>
              <td class="px-5 py-3.5 text-sm font-semibold text-gray-900 whitespace-nowrap">{{ row.jobNumber || '-' }}</td>
              <td class="px-5 py-3.5 text-sm text-gray-600">
                <div class="max-w-[220px] truncate" :title="row.scopeLabel">{{ row.scopeLabel || '-' }}</div>
              </td>
              <td class="px-5 py-3.5 text-xs text-right text-gray-500 whitespace-nowrap">{{ row.voCount }} VO{{ row.voCount !== 1 ? 's' : '' }}</td>
              <td class="px-5 py-3.5 text-sm text-right font-bold text-blue-700 whitespace-nowrap">{{ formatCurrency(row.totalVOAmount) }}</td>
              <td class="px-5 py-3.5 text-sm text-right whitespace-nowrap">
                <button @click.stop="openCategoryDetail(row, 'service')"
                  :disabled="row.serviceItems.length === 0"
                  class="font-semibold text-blue-700 rounded-lg px-2 py-1 transition"
                  :class="row.serviceItems.length ? 'hover:bg-blue-50 hover:ring-1 hover:ring-blue-200 cursor-pointer' : 'opacity-40 cursor-default'">
                  {{ row.serviceAmount > 0 ? formatCurrency(row.serviceAmount) : '-' }}
                </button>
              </td>
              <td class="px-5 py-3.5 text-sm text-right whitespace-nowrap">
                <button @click.stop="openCategoryDetail(row, 'thirdParty')"
                  :disabled="row.thirdPartyItems.length === 0"
                  class="font-semibold text-sky-700 rounded-lg px-2 py-1 transition"
                  :class="row.thirdPartyItems.length ? 'hover:bg-sky-50 hover:ring-1 hover:ring-sky-200 cursor-pointer' : 'opacity-40 cursor-default'">
                  {{ row.thirdPartyAmount > 0 ? formatCurrency(row.thirdPartyAmount) : '-' }}
                </button>
              </td>
              <td class="px-5 py-3.5 text-sm text-right whitespace-nowrap">
                <button @click.stop="openCategoryDetail(row, 'boq')"
                  :disabled="row.boqItems.length === 0"
                  class="font-semibold text-emerald-700 rounded-lg px-2 py-1 transition"
                  :class="row.boqItems.length ? 'hover:bg-emerald-50 hover:ring-1 hover:ring-emerald-200 cursor-pointer' : 'opacity-40 cursor-default'">
                  {{ row.boqAmount > 0 ? formatCurrency(row.boqAmount) : '-' }}
                </button>
              </td>
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
              <td class="px-5 py-3.5 text-sm text-right font-semibold whitespace-nowrap"
                :class="row.labourCost > 0 ? 'text-violet-700' : 'text-gray-300'">
                {{ row.labourCost > 0 ? formatCurrency(row.labourCost) : '-' }}
              </td>
              <td class="px-5 py-3.5 text-sm text-right font-semibold whitespace-nowrap"
                :class="row.thirdPartyCost > 0 ? 'text-blue-700' : 'text-gray-300'">
                {{ row.thirdPartyCost > 0 ? formatCurrency(row.thirdPartyCost) : '-' }}
              </td>
              <td class="px-5 py-3.5 text-sm text-right font-semibold text-gray-900 whitespace-nowrap">{{ formatCurrency(row.costToDate) }}</td>
              <td class="px-5 py-3.5 text-right whitespace-nowrap">
                <input :value="formatManualDeductionInput(row.costKey)"
                  @focus="$event.target.select()"
                  @change="setManualDeduction(row.costKey, $event.target.value)"
                  class="w-32 px-2 py-1.5 rounded-lg border border-gray-200 bg-white text-right text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300" />
              </td>
              <td class="px-5 py-3.5 text-sm text-right font-semibold whitespace-nowrap"
                :class="row.costToComplete > 0 ? 'text-emerald-700' : includeCostToComplete ? 'text-gray-300' : 'text-gray-300'">
                {{ includeCostToComplete ? (row.costToComplete > 0 ? formatCurrency(row.costToComplete) : '-') : 'Not included' }}
              </td>
              <td class="px-5 py-3.5 text-sm text-right font-bold whitespace-nowrap" :class="row.profitLoss >= 0 ? 'text-emerald-700' : 'text-red-600'">
                {{ formatCurrency(row.profitLoss) }}
              </td>
              <td class="px-5 py-3.5 text-sm text-gray-600">
                <input :value="row.manualComment"
                  @change="setManualComment(row.costKey, $event.target.value)"
                  placeholder="Add remark..."
                  class="w-64 px-2 py-1.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-300" />
              </td>
            </tr>
          </tbody>
          <tfoot v-if="filteredRows.length > 0" class="sticky bottom-0">
            <tr class="bg-gray-50 border-t-2 border-gray-200">
              <td class="sticky left-0 z-20 min-w-[130px] px-5 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider bg-gray-50 shadow-[4px_0_8px_-6px_rgba(15,23,42,0.35)]">Totals</td>
              <td class="sticky left-[130px] z-20 min-w-[240px] px-5 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider bg-gray-50 shadow-[4px_0_8px_-6px_rgba(15,23,42,0.35)]">{{ filteredRows.length }} rows</td>
              <td class="px-5 py-3 text-xs font-bold text-gray-600 uppercase tracking-wider" colspan="2"></td>
              <td class="px-5 py-3 text-xs text-right text-gray-500">{{ filteredTotals.voCount }} VOs</td>
              <td class="px-5 py-3 text-sm text-right font-bold text-blue-700 whitespace-nowrap">{{ formatCurrency(filteredTotals.totalVOAmount) }}</td>
              <td class="px-5 py-3 text-sm text-right font-bold text-blue-700 whitespace-nowrap">{{ formatCurrency(filteredTotals.serviceAmount) }}</td>
              <td class="px-5 py-3 text-sm text-right font-bold text-sky-700 whitespace-nowrap">{{ formatCurrency(filteredTotals.thirdPartyAmount) }}</td>
              <td class="px-5 py-3 text-sm text-right font-bold text-emerald-700 whitespace-nowrap">{{ formatCurrency(filteredTotals.boqAmount) }}</td>
              <td class="px-5 py-3 text-sm text-right font-bold text-green-700 whitespace-nowrap">{{ formatCurrency(filteredTotals.invoiceAmount) }}</td>
              <td class="px-5 py-3 text-sm text-right font-bold text-orange-600 whitespace-nowrap">{{ formatCurrency(filteredTotals.notYetInvoiceAmount) }}</td>
              <td class="px-5 py-3 text-sm text-right font-bold text-violet-700 whitespace-nowrap">{{ formatCurrency(filteredTotals.labourCost) }}</td>
              <td class="px-5 py-3 text-sm text-right font-bold text-blue-700 whitespace-nowrap">{{ formatCurrency(filteredTotals.thirdPartyCost) }}</td>
              <td class="px-5 py-3 text-sm text-right font-bold text-gray-900 whitespace-nowrap">{{ formatCurrency(filteredTotals.costToDate) }}</td>
              <td class="px-5 py-3 text-sm text-right font-bold text-slate-700 whitespace-nowrap">{{ formatCurrency(filteredTotals.manualDeduction) }}</td>
              <td class="px-5 py-3 text-sm text-right font-bold text-emerald-700 whitespace-nowrap">{{ formatCurrency(filteredTotals.costToComplete) }}</td>
              <td class="px-5 py-3 text-sm text-right font-bold whitespace-nowrap" :class="filteredTotals.profitLoss >= 0 ? 'text-emerald-700' : 'text-red-600'">{{ formatCurrency(filteredTotals.profitLoss) }}</td>
              <td class="px-5 py-3 text-xs text-gray-400"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="categoryDrawer" class="fixed inset-0 z-50 flex">
        <div class="absolute inset-0 bg-black/40" @click="categoryDrawer = null"></div>
        <div class="relative ml-auto h-full w-full max-w-5xl bg-white shadow-2xl flex flex-col">
          <div class="px-6 py-4 border-b border-gray-100 shrink-0"
            :class="categoryDrawer.type === 'boq' ? 'bg-emerald-700' : categoryDrawer.type === 'thirdParty' ? 'bg-sky-700' : 'bg-blue-700'">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="text-base font-bold text-white">{{ categoryDrawer.title }}</h3>
                <p class="text-xs text-white/80 mt-0.5">
                  {{ categoryDrawer.row.siteId || '-' }} · {{ categoryDrawer.row.siteName || '-' }} · Job {{ categoryDrawer.row.jobNumber || '-' }}
                </p>
              </div>
              <button @click="categoryDrawer = null"
                class="w-8 h-8 flex items-center justify-center rounded-xl bg-white/15 text-white hover:bg-white/25 transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="px-6 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-3 shrink-0">
            <div class="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-100 rounded-xl">
              <span class="text-xs text-gray-500">Items</span>
              <span class="text-sm font-bold text-gray-800">{{ categoryDrawer.items.length }}</span>
            </div>
            <div class="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-100 rounded-xl">
              <span class="text-xs text-gray-500">Total</span>
              <span class="text-sm font-bold"
                :class="categoryDrawer.type === 'boq' ? 'text-emerald-700' : categoryDrawer.type === 'thirdParty' ? 'text-sky-700' : 'text-blue-700'">
                {{ formatCurrency(categoryDrawer.total) }}
              </span>
            </div>
          </div>

          <div class="flex-1 overflow-auto">
            <table class="w-full text-sm border-collapse" style="min-width: 950px;">
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
                <tr v-for="vo in categoryDrawer.items" :key="vo.id" class="hover:bg-gray-50 transition">
                  <td class="px-5 py-3">
                    <div class="max-w-sm truncate text-gray-800 font-medium" :title="vo.voDescription">{{ vo.voDescription || '-' }}</div>
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
        </div>
      </div>
    </Teleport>

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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import * as XLSX from 'xlsx'
import { useVOStore } from '../stores/voStore'
import { formatCurrency } from '../utils/formatters'

const store = useVOStore()
const searchText = ref('')
const sortCol = ref('siteId')
const sortDir = ref('asc')
const detailModal = ref(null)
const categoryDrawer = ref(null)
const siteFilterOpen = ref(false)
const scopeFilterOpen = ref(false)
const selectedSiteIds = ref(new Set())
const selectedScopes = ref(new Set())
const includeCostToComplete = ref(false)
const costToCompleteMonth = ref('')
const siteStatusRevision = ref(0)

const MANUAL_DEDUCTION_KEY = 'plManualDeductions'
const MANUAL_COMMENT_KEY = 'plManualComments'
const PL_CTC_INCLUDE_KEY = 'plIncludeCostToComplete'
const PL_CTC_MONTH_KEY = 'plCostToCompleteMonth'

function loadManualDeductions() {
  try { return JSON.parse(localStorage.getItem(MANUAL_DEDUCTION_KEY) || '{}') } catch { return {} }
}

const manualDeductions = ref(loadManualDeductions())
const manualComments = ref(loadManualComments())
includeCostToComplete.value = localStorage.getItem(PL_CTC_INCLUDE_KEY) === 'true'
costToCompleteMonth.value = localStorage.getItem(PL_CTC_MONTH_KEY) || ''

function loadManualComments() {
  try { return JSON.parse(localStorage.getItem(MANUAL_COMMENT_KEY) || '{}') } catch { return {} }
}

const columns = [
  { key: 'siteId',              label: 'Site ID',                 align: 'left', sticky: 1 },
  { key: 'siteName',            label: 'Site Name',               align: 'left', sticky: 2 },
  { key: 'jobNumber',           label: 'Job',                     align: 'left' },
  { key: 'scopeLabel',          label: 'Scope',                   align: 'left' },
  { key: 'voCount',             label: 'Total VO Qty',            align: 'right' },
  { key: 'totalVOAmount',       label: 'Total VO Amount',         align: 'right' },
  { key: 'serviceAmount',       label: 'VO Service',              align: 'right' },
  { key: 'thirdPartyAmount',    label: 'VO 3rd Party',            align: 'right' },
  { key: 'boqAmount',           label: 'BOQ Related',             align: 'right' },
  { key: 'invoiceAmount',       label: 'Total Invoice Amount',    align: 'right' },
  { key: 'notYetInvoiceAmount', label: 'Not Yet Invoice Amount',  align: 'right' },
  { key: 'labourCost',          label: 'Labour Cost',             align: 'right' },
  { key: 'thirdPartyCost',      label: 'Third Party Cost',        align: 'right' },
  { key: 'costToDate',          label: 'Cost to Date',            align: 'right' },
  { key: 'manualDeduction',     label: 'Manual Deduction',        align: 'right' },
  { key: 'costToComplete',      label: 'Cost to Complete',        align: 'right' },
  { key: 'profitLoss',          label: 'P&L',                     align: 'right' },
  { key: 'manualComment',       label: 'Comment',                 align: 'left' },
]

const BASE_PO_CATEGORIES = new Set(['Site Survey', 'WOP', 'C&I', 'SAT&SIT', 'Snag Closure'])
const isBasePO = (vo) => BASE_PO_CATEGORIES.has(vo.voCategory?.trim())
const isBOQ = (vo) => !isBasePO(vo) && (vo.boqRelated === true || vo.boqRelated === 'yes')
const isStandardService = (vo) => !isBasePO(vo) && !isBOQ(vo) && vo.voCategory?.trim() === 'Service'
const isStandardThirdParty = (vo) => !isBasePO(vo) && !isBOQ(vo) && vo.voCategory?.trim() === 'Third Party'

function calcEntryCost(e) {
  return (parseFloat(e.qtyDays) || 0) * (parseFloat(e.qtyHours) || 0) *
         (parseFloat(e.qtyPeople) || 0) * (parseFloat(e.rate) || 0)
}

function entryMonthKey(e) {
  if (!e?.date) return ''
  const dt = new Date(e.date)
  if (isNaN(dt)) return ''
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`
}

function readSiteStatusData() {
  try { return JSON.parse(localStorage.getItem('siteStatusData') || '{}') } catch { return {} }
}

const costToCompleteMonths = computed(() => {
  void siteStatusRevision.value
  const monthMap = {}
  for (const d of Object.values(readSiteStatusData())) {
    for (const entry of (d.costEntries || [])) {
      const key = entryMonthKey(entry)
      if (!key) continue
      const dt = new Date(entry.date)
      monthMap[key] = dt.toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })
    }
  }
  return Object.entries(monthMap)
    .map(([value, label]) => ({ value, label }))
    .sort((a, b) => a.value.localeCompare(b.value))
})

const costToCompleteBySiteJob = computed(() => {
  void siteStatusRevision.value
  if (!includeCostToComplete.value || !costToCompleteMonth.value) return {}

  const result = {}
  for (const [key, d] of Object.entries(readSiteStatusData())) {
    const entries = Array.isArray(d.costEntries) ? d.costEntries : []
    result[key] = entries
      .filter(entry => entryMonthKey(entry) === costToCompleteMonth.value)
      .reduce((sum, entry) => sum + calcEntryCost(entry), 0)
  }
  return result
})

const plRows = computed(() => {
  const map = new Map()
  for (const vo of store.vos.value || []) {
    const key = `${vo.siteId || ''}|${vo.jobNumber || ''}|${vo.siteName || ''}`
    const existing = map.get(key) || {
      rowKey: key,
      siteId: vo.siteId || '',
      siteName: vo.siteName || '',
      jobNumber: vo.jobNumber || '',
      costKey: `${vo.siteId || ''}|${vo.jobNumber || ''}`,
      voCount: 0,
      totalVOAmount: 0,
      invoiceAmount: 0,
      labourCost: 0,
      thirdPartyCost: 0,
      costToDate: 0,
      scopes: new Set(),
      vos: [],
    }

    const voAmount = Number(vo.voAmount) || 0
    const labourCost = Number(vo.labourCost) || 0
    const thirdPartyCost = Number(vo.thirdPartyCost) || 0
    const cost = labourCost + thirdPartyCost
    const isInvoiced = vo.invoiceStatus === 'SIT Completed' && !!vo.invoiceDate

    existing.voCount += 1
    existing.totalVOAmount += voAmount
    existing.invoiceAmount += isInvoiced ? voAmount : 0
    existing.labourCost += labourCost
    existing.thirdPartyCost += thirdPartyCost
    existing.costToDate += cost
    if (vo.scope?.trim()) existing.scopes.add(vo.scope.trim())
    existing.vos.push(vo)
    map.set(key, existing)
  }

  return [...map.values()].map(row => ({
    ...row,
    scopeList: [...row.scopes].sort((a, b) => a.localeCompare(b)),
    scopeLabel: [...row.scopes].sort((a, b) => a.localeCompare(b)).join(', '),
    manualComment: manualComments.value[row.costKey] || '',
    serviceItems: row.vos.filter(isStandardService),
    thirdPartyItems: row.vos.filter(isStandardThirdParty),
    boqItems: row.vos.filter(isBOQ),
    serviceAmount: row.vos.filter(isStandardService).reduce((sum, vo) => sum + (Number(vo.voAmount) || 0), 0),
    thirdPartyAmount: row.vos.filter(isStandardThirdParty).reduce((sum, vo) => sum + (Number(vo.voAmount) || 0), 0),
    boqAmount: row.vos.filter(isBOQ).reduce((sum, vo) => sum + (Number(vo.voAmount) || 0), 0),
    invoiceItems: row.vos.filter(vo => vo.invoiceStatus === 'SIT Completed' && !!vo.invoiceDate),
    notYetInvoiceItems: row.vos.filter(vo => !(vo.invoiceStatus === 'SIT Completed' && !!vo.invoiceDate)),
    notYetInvoiceAmount: row.totalVOAmount - row.invoiceAmount,
    manualDeduction: Number(manualDeductions.value[row.costKey]) || 0,
    costToComplete: costToCompleteBySiteJob.value[row.costKey] || 0,
    profitLoss: row.totalVOAmount - row.costToDate - (Number(manualDeductions.value[row.costKey]) || 0) - (costToCompleteBySiteJob.value[row.costKey] || 0),
  }))
})

const siteOptions = computed(() =>
  [...new Set(plRows.value.map(row => row.siteId).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
)

const scopeOptions = computed(() =>
  [...new Set(plRows.value.flatMap(row => row.scopeList || []).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b))
)

const hasActiveFilters = computed(() =>
  !!searchText.value.trim() || selectedSiteIds.value.size > 0 || selectedScopes.value.size > 0
)

const filteredRows = computed(() => {
  const q = searchText.value.trim().toLowerCase()
  const siteIds = selectedSiteIds.value
  const scopes = selectedScopes.value

  return plRows.value.filter(row => {
    const matchesSearch = !q ||
      row.siteId.toLowerCase().includes(q) ||
      row.siteName.toLowerCase().includes(q) ||
      row.jobNumber.toLowerCase().includes(q) ||
      row.scopeLabel.toLowerCase().includes(q) ||
      row.manualComment.toLowerCase().includes(q)

    const matchesSite = siteIds.size === 0 || siteIds.has(row.siteId)
    const matchesScope = scopes.size === 0 || row.scopeList.some(scope => scopes.has(scope))

    return matchesSearch && matchesSite && matchesScope
  })
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
const summaryRows = computed(() => hasActiveFilters.value ? filteredRows.value : plRows.value)
const summaryTotals = computed(() => hasActiveFilters.value ? filteredTotals.value : totals.value)

function summarize(rows) {
  return rows.reduce((acc, row) => {
    acc.voCount += row.voCount
    acc.totalVOAmount += row.totalVOAmount
    acc.serviceAmount += row.serviceAmount
    acc.thirdPartyAmount += row.thirdPartyAmount
    acc.boqAmount += row.boqAmount
    acc.invoiceAmount += row.invoiceAmount
    acc.notYetInvoiceAmount += row.notYetInvoiceAmount
    acc.labourCost += row.labourCost
    acc.thirdPartyCost += row.thirdPartyCost
    acc.costToDate += row.costToDate
    acc.manualDeduction += row.manualDeduction
    acc.costToComplete += row.costToComplete
    acc.profitLoss += row.profitLoss
    return acc
  }, {
    voCount: 0,
    totalVOAmount: 0,
    serviceAmount: 0,
    thirdPartyAmount: 0,
    boqAmount: 0,
    invoiceAmount: 0,
    notYetInvoiceAmount: 0,
    labourCost: 0,
    thirdPartyCost: 0,
    costToDate: 0,
    manualDeduction: 0,
    costToComplete: 0,
    profitLoss: 0,
  })
}

function openCategoryDetail(row, type) {
  const map = {
    service: { title: 'VO Service Detail', items: row.serviceItems },
    thirdParty: { title: 'VO 3rd Party Detail', items: row.thirdPartyItems },
    boq: { title: 'BOQ Related Detail', items: row.boqItems },
  }
  const config = map[type]
  if (!config?.items?.length) return
  categoryDrawer.value = {
    row,
    type,
    title: config.title,
    items: config.items,
    total: config.items.reduce((sum, vo) => sum + (Number(vo.voAmount) || 0), 0),
  }
}

function toggleSort(key) {
  if (sortCol.value === key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortCol.value = key
    sortDir.value = 'asc'
  }
}

function toggleSite(siteId) {
  const next = new Set(selectedSiteIds.value)
  next.has(siteId) ? next.delete(siteId) : next.add(siteId)
  selectedSiteIds.value = next
}

function toggleScope(scope) {
  const next = new Set(selectedScopes.value)
  next.has(scope) ? next.delete(scope) : next.add(scope)
  selectedScopes.value = next
}

function clearAllFilters() {
  searchText.value = ''
  selectedSiteIds.value = new Set()
  selectedScopes.value = new Set()
  siteFilterOpen.value = false
  scopeFilterOpen.value = false
}

function parseCurrencyInput(value) {
  return Math.max(0, parseFloat(String(value || '').replace(/[,$\s]/g, '')) || 0)
}

function formatManualDeductionInput(rowKey) {
  const value = Number(manualDeductions.value[rowKey]) || 0
  return value ? value.toFixed(2) : ''
}

function setManualDeduction(rowKey, value) {
  const amount = parseCurrencyInput(value)
  const next = { ...manualDeductions.value }
  if (amount > 0) next[rowKey] = amount
  else delete next[rowKey]
  manualDeductions.value = next
  localStorage.setItem(MANUAL_DEDUCTION_KEY, JSON.stringify(next))
}

function setManualComment(rowKey, value) {
  const comment = String(value || '').trim()
  const next = { ...manualComments.value }
  if (comment) next[rowKey] = comment
  else delete next[rowKey]
  manualComments.value = next
  localStorage.setItem(MANUAL_COMMENT_KEY, JSON.stringify(next))
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
    'Scope': row.scopeLabel,
    'Total VO Qty': row.voCount,
    'Total VO Amount': row.totalVOAmount,
    'VO Service': row.serviceAmount,
    'VO 3rd Party': row.thirdPartyAmount,
    'BOQ Related': row.boqAmount,
    'Total Invoice Amount': row.invoiceAmount,
    'Not Yet Invoice Amount': row.notYetInvoiceAmount,
    'Labour Cost': row.labourCost,
    'Third Party Cost': row.thirdPartyCost,
    'Cost to Date': row.costToDate,
    'Manual Deduction': row.manualDeduction,
    'Cost to Complete': row.costToComplete,
    'P&L': row.profitLoss,
    'Comment': row.manualComment,
  }))
  const ws = XLSX.utils.json_to_sheet(rows)
  ws['!cols'] = [
    { wch: 14 }, { wch: 28 }, { wch: 18 }, { wch: 28 }, { wch: 14 }, { wch: 18 },
    { wch: 16 }, { wch: 16 }, { wch: 16 },
    { wch: 22 }, { wch: 24 }, { wch: 16 }, { wch: 18 }, { wch: 16 }, { wch: 18 },
    { wch: 18 }, { wch: 16 }, { wch: 36 },
  ]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'P&L')
  const date = new Date().toLocaleDateString('en-AU').replace(/\//g, '-')
  XLSX.writeFile(wb, `P&L_${date}.xlsx`)
}

function onSiteStatusUpdated() {
  siteStatusRevision.value++
}

watch(includeCostToComplete, value => {
  localStorage.setItem(PL_CTC_INCLUDE_KEY, value ? 'true' : 'false')
})

watch(costToCompleteMonth, value => {
  localStorage.setItem(PL_CTC_MONTH_KEY, value || '')
})

onMounted(() => {
  window.addEventListener('siteStatusUpdated', onSiteStatusUpdated)
})

onUnmounted(() => {
  window.removeEventListener('siteStatusUpdated', onSiteStatusUpdated)
})
</script>
