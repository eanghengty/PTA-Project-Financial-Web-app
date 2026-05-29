<template>
  <div class="space-y-6">

    <!-- Page Header -->
    <div class="flex items-center justify-between pb-2 border-b border-gray-100">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">Monthly Invoicing</h2>
          <p class="text-xs text-gray-400 mt-0.5">Invoice breakdown for the selected month, including carried-over pending items</p>
        </div>
      </div>

      <!-- Month navigation -->
      <div class="flex items-center gap-2">
        <button @click="prevMonth" :disabled="showAllMonths"
          class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition disabled:opacity-30 disabled:cursor-not-allowed">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <input type="month" v-model="selectedMonth" :disabled="showAllMonths"
          class="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-40 disabled:cursor-not-allowed" />
        <button @click="nextMonth" :disabled="showAllMonths"
          class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition disabled:opacity-30 disabled:cursor-not-allowed">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
        <button @click="showAllMonths = !showAllMonths"
          :class="showAllMonths ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'"
          class="px-3 py-1.5 rounded-lg border text-xs font-semibold transition whitespace-nowrap">
          All Months
        </button>
        <!-- Notification bell -->
        <div v-if="alertCount > 0" class="relative" ref="bellRef">
          <button @click="showAlerts = !showAlerts"
            class="relative w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <span class="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
              :class="wrongAmountItems.length > 0 ? 'bg-rose-500' : 'bg-orange-500'">
              {{ alertCount }}
            </span>
          </button>
          <!-- Dropdown -->
          <div v-if="showAlerts"
            class="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
            <div class="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <span class="text-sm font-semibold text-gray-700">Alerts</span>
              <button @click="showAlerts = false" class="text-gray-400 hover:text-gray-600 transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div class="divide-y divide-gray-100">
              <div v-if="carryOverItems.filter(v => v.invoiceStatus !== 'SIT Wrong Amount').length > 0"
                class="flex items-start gap-3 px-4 py-3 bg-orange-50">
                <svg class="w-4 h-4 text-orange-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                </svg>
                <div class="text-sm">
                  <span class="font-bold text-orange-800">{{ carryOverItems.filter(v => v.invoiceStatus !== 'SIT Wrong Amount').length }} item{{ carryOverItems.filter(v => v.invoiceStatus !== 'SIT Wrong Amount').length !== 1 ? 's' : '' }} carried over from prior months</span>
                  <span class="text-orange-700"> — still pending with status <em>To Be Sent to Nokia</em> or <em>Request to Nokia</em>. Amount: </span>
                  <span class="font-bold text-orange-800">{{ formatCurrency(carryOverItems.filter(v => v.invoiceStatus !== 'SIT Wrong Amount').reduce((s,v)=>s+displayAmt(v),0)) }}</span>
                </div>
              </div>
              <div v-if="wrongAmountItems.length > 0"
                class="flex items-start gap-3 px-4 py-3 bg-rose-50">
                <svg class="w-4 h-4 text-rose-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                </svg>
                <div class="text-sm">
                  <span class="font-bold text-rose-800">{{ wrongAmountItems.length }} SIT Wrong Amount item{{ wrongAmountItems.length !== 1 ? 's' : '' }}</span>
                  <span class="text-rose-700"> — customer invoiced incorrectly. VO value: </span>
                  <span class="font-bold text-rose-800">{{ formatCurrency(wrongAmountItems.reduce((s,v)=>s+(v.voAmount||0),0)) }}</span>
                  <span class="text-rose-700"> · Invoiced by customer: </span>
                  <span class="font-bold text-rose-800">{{ formatCurrency(wrongInvoicedTotal) }}</span>
                  <span class="text-rose-700"> · </span>
                  <span class="font-bold text-rose-900">Outstanding delta: {{ formatCurrency(wrongAmountTotal) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button v-if="allDisplayItems.length > 0 || manualEntries.length > 0" @click="openExportModal"
          class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Export
        </button>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="allDisplayItems.length === 0 && manualEntries.length === 0" class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-12 text-center border border-blue-100">
      <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-100 flex items-center justify-center">
        <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
      </div>
      <h3 class="text-xl font-bold text-gray-900 mb-2">No invoices for {{ monthLabel }}</h3>
      <p class="text-gray-500 text-sm mb-4">No variation orders have an invoice date in this month and no pending items carried over.</p>
      <button @click="openManualForm()"
        class="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition shadow-sm">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Add Manual Invoice Line
      </button>
    </div>

    <template v-else>

      <!-- KPI Summary Row -->
      <div class="grid gap-4" :class="kpiGridCols">
        <!-- Total includes carry-over + manual -->
        <div class="bg-white border border-blue-100 rounded-xl p-4">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total This Month</p>
          <p class="text-2xl font-bold text-gray-900">{{ formatCompact(grandTotal) }}</p>
          <p class="text-xs text-gray-400 mt-1">
            {{ allDisplayItems.length + manualEntries.length }} item{{ (allDisplayItems.length + manualEntries.length) !== 1 ? 's' : '' }}
            <span v-if="carryOverItems.length > 0" class="text-orange-500"> incl. {{ carryOverItems.length }} carry-over</span>
            <span v-if="manualEntries.length > 0" class="text-violet-500"> + {{ manualEntries.length }} manual</span>
          </p>
        </div>
        <div class="bg-white border border-blue-100 rounded-xl p-4">
          <p class="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Variation Orders</p>
          <p class="text-2xl font-bold text-blue-700">{{ formatCompact(voTotal) }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ voItems.length }} item{{ voItems.length !== 1 ? 's' : '' }} <span v-if="carryOverItems.filter(v=>!BASE_PO_CATEGORIES.has(v.voCategory)).length" class="text-orange-500">incl. {{ carryOverItems.filter(v=>!BASE_PO_CATEGORIES.has(v.voCategory)).length }} carry-over</span></p>
        </div>
        <div class="bg-white border border-amber-100 rounded-xl p-4">
          <p class="text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">Base PO</p>
          <p class="text-2xl font-bold text-amber-700">{{ formatCompact(basePOTotal) }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ basePOItems.length }} item{{ basePOItems.length !== 1 ? 's' : '' }} <span v-if="carryOverItems.filter(v=>BASE_PO_CATEGORIES.has(v.voCategory)).length" class="text-orange-500">incl. {{ carryOverItems.filter(v=>BASE_PO_CATEGORIES.has(v.voCategory)).length }} carry-over</span></p>
        </div>
        <div v-if="carryOverItems.filter(v => v.invoiceStatus !== 'SIT Wrong Amount').length > 0" class="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <p class="text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">Carried Over</p>
          <p class="text-2xl font-bold text-orange-700">{{ formatCompact(carryOverItems.filter(v => v.invoiceStatus !== 'SIT Wrong Amount').reduce((s,v)=>s+displayAmt(v),0)) }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ carryOverItems.filter(v => v.invoiceStatus !== 'SIT Wrong Amount').length }} from prior months</p>
        </div>
        <div v-if="manualEntries.length > 0" class="bg-violet-50 border border-violet-200 rounded-xl p-4">
          <p class="text-xs font-bold text-violet-500 uppercase tracking-wider mb-1">Manual Lines</p>
          <p class="text-2xl font-bold text-violet-700">{{ formatCompact(manualTotal) }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ manualEntries.length }} manual entr{{ manualEntries.length !== 1 ? 'ies' : 'y' }}</p>
        </div>
        <div v-if="wrongAmountItems.length > 0" class="bg-rose-50 border border-rose-200 rounded-xl p-4">
          <p class="text-xs font-bold text-rose-500 uppercase tracking-wider mb-1">SIT Wrong Amount</p>
          <p class="text-2xl font-bold text-rose-700">{{ formatCompact(wrongAmountTotal) }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ wrongAmountItems.length }} item{{ wrongAmountItems.length !== 1 ? 's' : '' }} · delta outstanding</p>
        </div>
      </div>

      <!-- Manual Invoice Lines Section -->
      <div class="border border-violet-200 rounded-xl overflow-hidden">
        <div class="px-4 py-3 bg-violet-50 border-b border-violet-200 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            <h3 class="text-sm font-semibold text-violet-800">Manual Invoice Lines</h3>
            <span v-if="manualEntries.length > 0" class="px-2 py-0.5 rounded-full text-xs font-bold bg-violet-100 text-violet-700">{{ manualEntries.length }}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs text-violet-500">For split invoices or amounts not tied to a VO record</span>
            <button @click="manualSectionOpen = !manualSectionOpen"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 border border-violet-200 bg-white text-violet-700 rounded-lg text-xs font-semibold hover:bg-violet-50 transition">
              <svg class="w-3.5 h-3.5 transition-transform" :class="manualSectionOpen ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
              {{ manualSectionOpen ? 'Collapse' : 'Expand' }}
            </button>
            <button @click="openManualForm()"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 text-white rounded-lg text-xs font-semibold hover:bg-violet-700 transition">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Add Line
            </button>
          </div>
        </div>

        <div v-show="manualSectionOpen">
        <!-- Add / Edit form -->
        <div v-if="showManualForm" class="px-4 py-4 bg-violet-50/50 border-b border-violet-100">
          <p class="text-xs font-semibold text-violet-700 mb-3">{{ editingManualId ? 'Edit' : 'New' }} Manual Invoice Line</p>
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <div class="lg:col-span-2">
              <label class="block text-xs text-gray-500 mb-1">Description <span class="text-red-400">*</span></label>
              <input v-model="manualForm.description" type="text" placeholder="e.g. Split invoice – civil works"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">Category</label>
              <input v-model="manualForm.category" type="text" list="manual-categories-list" placeholder="Category"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
              <datalist id="manual-categories-list">
                <option v-for="c in allCategories" :key="c" :value="c" />
              </datalist>
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">Scope</label>
              <input v-model="manualForm.scope" type="text" list="manual-scopes-list" placeholder="Scope"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
              <datalist id="manual-scopes-list">
                <option v-for="s in adminScopes" :key="s" :value="s" />
              </datalist>
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">Invoice Status</label>
              <select v-model="manualForm.invoiceStatus"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-400">
                <option v-for="s in RAW_STATUS_ORDER" :key="s" :value="s">{{ s }}</option>
              </select>
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">Amount (AUD) <span class="text-red-400">*</span></label>
              <input v-model="manualForm.amount" type="number" min="0" step="0.01" placeholder="0.00"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
            </div>
          </div>
          <div class="flex items-center gap-2 mt-3">
            <button @click="saveManualEntry"
              :disabled="!manualForm.description || !manualForm.amount"
              class="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-semibold hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              {{ editingManualId ? 'Update' : 'Add' }}
            </button>
            <button @click="cancelManualForm"
              class="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition">
              Cancel
            </button>
          </div>
        </div>

        <!-- Manual entries table -->
        <div v-if="manualEntries.length > 0" class="overflow-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-violet-700 text-white text-xs uppercase tracking-wider">
                <th class="px-4 py-2.5 text-left font-semibold">Description</th>
                <th class="px-4 py-2.5 text-center font-semibold">Satish</th>
                <th class="px-4 py-2.5 text-left font-semibold">Category</th>
                <th class="px-4 py-2.5 text-left font-semibold">Scope</th>
                <th class="px-4 py-2.5 text-left font-semibold">Invoice Status</th>
                <th class="px-4 py-2.5 text-right font-semibold">Amount</th>
                <th class="px-4 py-2.5 text-center font-semibold w-20">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-violet-50">
              <tr v-for="entry in manualEntries" :key="entry.id"
                :class="satishRequestIds.has(entry.id) ? 'bg-teal-50 hover:bg-teal-100' : 'hover:bg-violet-50/40'"
                class="transition-colors">
                <td class="px-4 py-3 text-gray-800 font-medium">{{ entry.description }}</td>
                <td class="px-4 py-3 text-center">
                  <input
                    v-if="isRequestToNokia(entry)"
                    type="checkbox"
                    :checked="satishRequestIds.has(entry.id)"
                    @change="toggleRequestRowSatish(entry.id)"
                    class="rounded border-gray-300 text-teal-500 cursor-pointer"
                  />
                  <span v-else class="text-gray-300 text-xs">-</span>
                </td>
                <td class="px-4 py-3">
                  <span v-if="entry.category"
                    :class="BASE_PO_CATEGORIES.has(entry.category) ? 'bg-amber-100 text-amber-700' : 'bg-violet-100 text-violet-700'"
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold">
                    {{ entry.category }}
                  </span>
                  <span v-else class="text-gray-300 text-xs">—</span>
                </td>
                <td class="px-4 py-3 text-gray-500 text-sm">{{ entry.scope || '—' }}</td>
                <td class="px-4 py-3">
                  <span :class="(STATUS_CFG[getDisplayInvoiceStatus(entry, 'SIT Completed')] || STATUS_CFG['Not Yet Sent']).badge"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold">
                    {{ getDisplayInvoiceStatus(entry, 'SIT Completed') }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right font-semibold text-violet-800">{{ formatCurrency(entry.amount) }}</td>
                <td class="px-4 py-3 text-center">
                  <div class="flex items-center justify-center gap-1">
                    <button @click="openManualForm(entry)" title="Edit"
                      class="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>
                    <button @click="deleteManualEntry(entry.id)" title="Delete"
                      class="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
            <tfoot class="border-t-2 border-violet-200 bg-violet-50">
              <tr>
                <td colspan="4" class="px-4 py-2.5 text-xs font-bold text-violet-700 uppercase">Manual Total</td>
                <td class="px-4 py-2.5 text-right font-bold text-violet-800">{{ formatCurrency(manualTotal) }}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- Empty manual state -->
        <div v-else-if="!showManualForm" class="px-4 py-5 text-center text-sm text-gray-400">
          No manual lines added yet. Use <strong>Add Line</strong> for split invoices or amounts outside the VO system.
        </div>
        </div>
      </div>

      <!-- Status Breakdown Cards (includes manual entries) -->
      <div v-if="statusGroups.length > 0" class="border border-blue-100 rounded-xl overflow-hidden">
        <div class="px-4 py-3 bg-blue-50/40 border-b border-blue-100 flex items-center justify-between">
          <h3 class="text-sm font-semibold text-gray-700">Invoice Status Breakdown</h3>
          <span class="text-xs text-gray-400">All items incl. carry-over &amp; manual · {{ allDisplayItems.length + manualEntries.length }} items · {{ formatCurrency(grandTotal) }}</span>
        </div>
        <div class="p-4 grid gap-3"
          :class="statusGroups.length >= 4 ? 'grid-cols-4' : statusGroups.length === 3 ? 'grid-cols-3' : statusGroups.length === 2 ? 'grid-cols-2' : 'grid-cols-1'">
          <div v-for="g in statusGroups" :key="g.status"
            class="border rounded-xl p-4 bg-white" :class="g.cfg.border">
            <div class="flex items-center gap-2 mb-3">
              <span class="w-2.5 h-2.5 rounded-full shrink-0" :class="g.cfg.dot"></span>
              <span class="text-xs font-bold uppercase tracking-wider leading-tight" :class="g.cfg.text">{{ g.status }}</span>
            </div>
            <p class="text-xl font-bold text-gray-900 mb-0.5">{{ formatCompact(g.total) }}</p>
            <p class="text-xs text-gray-400">{{ g.count }} item{{ g.count !== 1 ? 's' : '' }}<span v-if="g.manualCount" class="text-violet-500"> ({{ g.manualCount }} manual)</span></p>
            <div class="mt-3 h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div class="h-full rounded-full transition-all" :class="g.cfg.bar"
                :style="{ width: grandTotal > 0 ? ((g.total / grandTotal) * 100).toFixed(1) + '%' : '0%' }">
              </div>
            </div>
            <p class="text-xs mt-1" :class="g.cfg.muted">
              {{ grandTotal > 0 ? ((g.total / grandTotal) * 100).toFixed(1) : '0' }}% of total
            </p>
          </div>
        </div>

        <!-- Third Party & Service breakdown by status -->
        <div class="border-t border-blue-100 overflow-auto">
          <table class="w-full text-xs">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-4 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wider">Category Group</th>
                <th class="px-4 py-2.5 text-right font-semibold text-gray-500 uppercase tracking-wider">Items</th>
                <th v-for="s in statusGroups.map(g => g.status)" :key="s"
                  class="px-4 py-2.5 text-right font-semibold uppercase tracking-wider whitespace-nowrap"
                  :class="STATUS_CFG[s]?.text || 'text-gray-500'">
                  {{ s }}
                </th>
                <th class="px-4 py-2.5 text-right font-semibold text-gray-700 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="grp in tpServiceRows" :key="grp.label" class="hover:bg-blue-50/30 transition">
                <td class="px-4 py-2.5 font-semibold text-gray-700 flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full shrink-0" :class="grp.dot"></span>
                  {{ grp.label }}
                </td>
                <td class="px-4 py-2.5 text-right text-gray-500">{{ grp.count }}</td>
                <td v-for="s in statusGroups.map(g => g.status)" :key="s"
                  class="px-4 py-2.5 text-right"
                  :class="grp.byStatus[s] ? 'font-semibold text-gray-800' : 'text-gray-300'">
                  <template v-if="grp.byStatus[s]">
                    <div>{{ formatCompact(grp.byStatus[s].amount) }}</div>
                    <div class="text-[10px] font-normal text-gray-400">{{ grp.byStatus[s].count }} item{{ grp.byStatus[s].count !== 1 ? 's' : '' }}</div>
                  </template>
                  <template v-else>—</template>
                </td>
                <td class="px-4 py-2.5 text-right font-bold text-gray-800">
                  <div>{{ formatCompact(grp.total) }}</div>
                  <div class="text-[10px] font-normal text-gray-400">{{ formatCurrency(grp.total) }}</div>
                </td>
              </tr>
            </tbody>
            <tfoot class="border-t-2 border-gray-200 bg-gray-50">
              <tr>
                <td class="px-4 py-2.5 font-bold text-gray-600 uppercase text-xs">Total</td>
                <td class="px-4 py-2.5 text-right font-bold text-gray-600">{{ tpServiceRows.reduce((s, g) => s + g.count, 0) }}</td>
                <td v-for="s in statusGroups.map(g => g.status)" :key="s"
                  class="px-4 py-2.5 text-right font-bold text-gray-700">
                  {{ formatCompact(tpServiceRows.reduce((sum, g) => sum + (g.byStatus[s]?.amount || 0), 0)) }}
                </td>
                <td class="px-4 py-2.5 text-right font-bold text-gray-800">{{ formatCompact(grandTotal) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Amount by Scope Chart -->
      <div v-if="scopeChartData.scopes.length > 0" class="border border-blue-100 rounded-xl overflow-hidden">
        <div class="px-4 py-3 bg-blue-50/40 border-b border-blue-100 flex items-center justify-between">
          <div>
            <h3 class="text-sm font-semibold text-gray-700">Invoice Amount by Scope</h3>
            <p class="text-xs text-gray-400">Stacked by invoice status · includes carry-over &amp; manual lines</p>
          </div>
          <div class="flex items-center gap-2 text-xs text-gray-400">
            <span class="font-semibold text-gray-700">{{ scopeChartData.scopes.length }}</span> scopes
          </div>
        </div>
        <div class="p-5">
          <div :style="{ height: Math.max(180, scopeChartData.scopes.length * 44) + 'px' }">
            <Bar :data="scopeChartData" :options="scopeChartOptions" />
          </div>
          <!-- Scope breakdown table -->
          <div class="mt-5 rounded-xl border border-gray-200 overflow-hidden">
            <table class="w-full text-xs">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-4 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wider">Scope</th>
                  <th v-for="s in STATUS_ORDER.filter(s => scopeChartData.datasets.map(d=>d.label).includes(s))" :key="s"
                    class="px-4 py-2.5 text-right font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {{ s }}
                  </th>
                  <th class="px-4 py-2.5 text-right font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="scope in scopeChartData.scopes" :key="scope" class="hover:bg-blue-50/30 transition">
                  <td class="px-4 py-2.5 font-medium text-gray-700">{{ scope }}</td>
                  <td v-for="s in STATUS_ORDER.filter(s => scopeChartData.datasets.map(d=>d.label).includes(s))" :key="s"
                    class="px-4 py-2.5 text-right"
                    :class="scopeChartData.scopeMap[scope]?.[s] ? 'font-semibold text-gray-800' : 'text-gray-300'">
                    {{ scopeChartData.scopeMap[scope]?.[s] ? formatCompact(scopeChartData.scopeMap[scope][s]) : '—' }}
                  </td>
                  <td class="px-4 py-2.5 text-right font-bold text-gray-800">
                    {{ formatCompact(Object.values(scopeChartData.scopeMap[scope] || {}).reduce((s,v)=>s+v,0)) }}
                  </td>
                </tr>
              </tbody>
              <tfoot class="border-t-2 border-gray-200 bg-gray-50">
                <tr>
                  <td class="px-4 py-2.5 font-bold text-gray-600 uppercase text-xs">Total</td>
                  <td v-for="s in STATUS_ORDER.filter(s => scopeChartData.datasets.map(d=>d.label).includes(s))" :key="s"
                    class="px-4 py-2.5 text-right font-bold text-gray-700">
                    {{ formatCompact(scopeChartData.scopes.reduce((sum, sc) => sum + (scopeChartData.scopeMap[sc]?.[s] || 0), 0)) }}
                  </td>
                  <td class="px-4 py-2.5 text-right font-bold text-gray-800">{{ formatCompact(grandTotal) }}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <!-- Detail Table (VO items only) -->
      <div class="border border-blue-100 rounded-xl overflow-hidden">
        <div class="px-4 py-3 bg-blue-50/40 border-b border-blue-100 flex items-center justify-between">
          <h3 class="text-sm font-semibold text-gray-700">All VO Items — {{ monthLabel }}</h3>
          <div class="flex items-center gap-3">
            <span v-if="carryOverItems.length > 0" class="flex items-center gap-1.5 text-xs text-orange-600 font-medium">
              <span class="w-2 h-2 rounded-sm bg-orange-200 inline-block"></span>
              {{ carryOverItems.length }} carried over
            </span>
            <span class="text-xs text-gray-400">{{ filteredSortedItems.length }}{{ hasActiveFilters ? ` of ${sortedAllItems.length}` : ` total` }} · click row to edit</span>
            <button v-if="hasActiveFilters" @click="clearFilters"
              class="text-xs text-red-500 hover:text-red-700 font-medium underline">Clear filters</button>
          </div>
        </div>

        <!-- Filter amount summary bar -->
        <div v-if="hasActiveFilters" class="px-4 py-2 bg-blue-50 border-b border-blue-100 flex items-center gap-2 flex-wrap text-xs">
          <span class="font-semibold text-blue-700">Filter summary:</span>
          <span class="text-blue-600">{{ filteredSortedItems.length }} items</span>
          <span class="text-blue-300">·</span>
          <span class="font-bold text-blue-800">{{ formatCurrency(filteredTotal) }}</span>
          <span class="text-blue-300 mx-1">|</span>
          <template v-for="statusConf in [
            { key: 'SIT Completed',       label: 'SIT Completed',       color: 'text-green-700 bg-green-100' },
            { key: 'SIT Approved',        label: 'SIT Approved',        color: 'text-yellow-700 bg-yellow-100' },
            { key: WAITING_ROM_APPROVAL,  label: WAITING_ROM_APPROVAL,  color: 'text-blue-700 bg-blue-100' },
            { key: WAITING_SATISH,        label: WAITING_SATISH,        color: 'text-teal-700 bg-teal-100' },
            { key: 'To Be Sent to Nokia', label: 'To Be Sent',          color: 'text-indigo-700 bg-indigo-100' },
            { key: 'Not Yet Sent',        label: 'Not Yet Sent',        color: 'text-gray-600 bg-gray-100' },
            { key: 'SIT Wrong Amount',    label: 'SIT Wrong Amount',    color: 'text-rose-700 bg-rose-100' },
          ]" :key="statusConf.key">
            <span v-if="filterSummary[statusConf.key]" :class="['px-2 py-0.5 rounded-full font-medium', statusConf.color]">
              {{ statusConf.label }}: {{ formatCurrency(filterSummary[statusConf.key]) }}
            </span>
          </template>
        </div>

        <div class="overflow-auto">
          <table class="border-collapse w-full">
            <thead class="sticky top-0 z-10">
              <tr>
                <th class="bg-blue-700 border-b border-blue-800 px-3 py-3 text-center whitespace-nowrap min-w-[92px]">
                  <div class="flex items-center justify-center gap-2">
                    <input
                      type="checkbox"
                      :checked="allFilteredRequestRowsSatish"
                      v-bind:indeterminate.prop="someFilteredRequestRowsSatish"
                      :disabled="filteredRequestRows.length === 0"
                      @change="toggleAllFilteredRequestRowsSatish"
                      class="rounded border-white/30 text-teal-500 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <span class="text-xs font-bold text-white uppercase tracking-wider">Satish</span>
                  </div>
                </th>
                <th v-for="col in tableColumns" :key="col.key"
                  class="bg-blue-700 border-b border-blue-800 p-0 whitespace-nowrap"
                  :class="col.right ? 'text-right' : 'text-left'"
                  :style="col.minW ? { minWidth: col.minW } : {}">
                  <div class="flex items-stretch" :class="col.right ? 'flex-row-reverse' : ''">
                    <!-- Sort label -->
                    <button @click="toggleSort(col.key)"
                      class="flex-1 px-3 py-3 flex items-center gap-1.5 hover:bg-blue-600 transition-colors text-left min-w-0">
                      <span class="text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap">{{ col.label }}</span>
                      <span class="flex-shrink-0">
                        <svg v-if="sortCol === col.key && sortDir === 'asc'" class="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd"/></svg>
                        <svg v-else-if="sortCol === col.key && sortDir === 'desc'" class="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                        <svg v-else class="w-3 h-3 text-blue-400" viewBox="0 0 20 20" fill="currentColor"><path d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zM3 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm4 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z"/></svg>
                      </span>
                    </button>
                    <!-- Filter funnel -->
                    <button @click="toggleFilterMenu(col.key, $event)"
                      class="px-2 py-3 hover:bg-blue-600 transition-colors border-l border-blue-600 flex-shrink-0 flex items-center">
                      <span class="relative">
                        <svg class="w-3.5 h-3.5 transition-colors" :class="filters[col.key]?.length ? 'text-yellow-300' : 'text-blue-300 hover:text-blue-100'" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L13 10.414V15a1 1 0 01-.553.894l-4 2A1 1 0 017 17v-6.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd"/></svg>
                        <span v-if="filters[col.key]?.length" class="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
                      </span>
                    </button>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <template v-for="(vo, idx) in paginatedItems" :key="vo.id">
                <!-- Section divider when carry-over rows start -->
                <tr v-if="isFirstCarryOverInPage(vo, idx)"
                  class="bg-orange-100 border-t-2 border-orange-300">
                  <td colspan="11" class="px-4 py-1.5">
                    <span class="text-xs font-bold text-orange-700 uppercase tracking-wider">↩ Carried Over from Prior Months — Pending Action</span>
                  </td>
                </tr>
                <tr @click="openEdit(vo)"
                  :class="satishRequestIds.has(vo.id)
                    ? 'bg-teal-50 hover:bg-teal-100'
                    : carryOverIds.has(vo.id) ? 'bg-orange-50 hover:bg-orange-100' : 'hover:bg-blue-50/40'"
                  class="transition-colors cursor-pointer">
                  <td class="px-3 py-3 text-center" @click.stop>
                    <input
                      v-if="isRequestToNokia(vo)"
                      type="checkbox"
                      :checked="satishRequestIds.has(vo.id)"
                      @change="toggleRequestRowSatish(vo.id)"
                      class="rounded border-gray-300 text-teal-500 cursor-pointer"
                    />
                    <span v-else class="text-gray-300 text-xs">-</span>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span class="px-1.5 py-0.5 rounded text-xs font-bold bg-indigo-100 text-indigo-700">{{ vo.siteId }}</span>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{{ vo.siteName || '—' }}</td>
                  <td class="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{{ vo.jobNumber || '—' }}</td>
                  <td class="px-4 py-3 text-sm text-gray-700">
                    <div class="max-w-xs truncate" :title="vo.voDescription">{{ vo.voDescription }}</div>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span :class="BASE_PO_CATEGORIES.has(vo.voCategory) ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'"
                      class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold">
                      {{ vo.voCategory || '—' }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{{ vo.scope || '—' }}</td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span v-if="vo.poNumber" class="font-mono text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded">{{ vo.poNumber }}</span>
                    <span v-else class="text-gray-300 text-xs">—</span>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <span v-if="vo.invoiceStatus"
                        :class="(STATUS_CFG[getDisplayInvoiceStatus(vo)] || STATUS_CFG['Not Yet Sent']).badge"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold">
                        {{ getDisplayInvoiceStatus(vo) }}
                      </span>
                      <span v-if="carryOverIds.has(vo.id) && vo.invoiceStatus !== 'SIT Wrong Amount'"
                        class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-600 border border-orange-200">
                        ↩ Prior Month
                      </span>
                      <span v-if="carryOverIds.has(vo.id) && vo.invoiceStatus === 'SIT Wrong Amount'"
                        class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-600 border border-rose-200">
                        ↩ Wrong Amt
                      </span>
                    </div>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span :class="carryOverIds.has(vo.id) ? 'text-sm text-orange-700 font-semibold' : 'text-sm text-gray-600'">
                      {{ vo.invoiceDate ? new Date(vo.invoiceDate).toLocaleDateString('en-AU') : '—' }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-sm font-semibold text-right whitespace-nowrap"
                    :class="vo.invoiceStatus === 'SIT Wrong Amount' ? 'text-rose-700' : carryOverIds.has(vo.id) ? 'text-orange-700' : 'text-gray-900'">
                    {{ formatCurrency(displayAmt(vo)) }}
                    <div v-if="vo.invoiceStatus === 'SIT Wrong Amount' && vo.wrongInvoiceAmount != null"
                      class="text-[10px] font-normal text-rose-400 leading-tight">
                      VO {{ formatCurrency(vo.voAmount) }} − {{ formatCurrency(vo.wrongInvoiceAmount) }}
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
            <tfoot>
              <tr class="bg-blue-50 border-t-2 border-blue-200">
                <td colspan="10" class="px-4 py-3 text-sm font-bold text-gray-700">
                  VO Total
                  <span class="text-xs font-normal text-gray-400 ml-1">
                    ({{ monthItems.length }} this month{{ carryOverItems.length > 0 ? ` + ${carryOverItems.length} carried over` : '' }}{{ wrongAmountItems.length > 0 ? ` · ${wrongAmountItems.length} wrong amount (delta)` : '' }})
                  </span>
                </td>
                <td class="px-4 py-3 text-sm font-bold text-gray-900 text-right whitespace-nowrap">
                  {{ formatCurrency(allDisplayAmount) }}
                </td>
              </tr>
              <tr v-if="manualEntries.length > 0" class="bg-violet-50 border-t border-violet-200">
                <td colspan="10" class="px-4 py-2 text-sm font-bold text-violet-700">
                  + Manual Lines
                  <span class="text-xs font-normal text-violet-500 ml-1">({{ manualEntries.length }} entr{{ manualEntries.length !== 1 ? 'ies' : 'y' }})</span>
                </td>
                <td class="px-4 py-2 text-sm font-bold text-violet-700 text-right whitespace-nowrap">{{ formatCurrency(manualTotal) }}</td>
              </tr>
              <tr v-if="manualEntries.length > 0" class="bg-gray-100 border-t-2 border-gray-300">
                <td colspan="10" class="px-4 py-2.5 text-sm font-bold text-gray-800">Grand Total</td>
                <td class="px-4 py-2.5 text-sm font-bold text-gray-900 text-right whitespace-nowrap">{{ formatCurrency(grandTotal) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- Pagination footer -->
        <div v-if="totalPages > 1" class="px-4 py-3 bg-white border-t border-blue-100 flex items-center justify-between gap-4">
          <span class="text-xs text-gray-500">
            Showing {{ pageStart }}–{{ pageEnd }} of {{ filteredSortedItems.length }}{{ hasActiveFilters ? ` (filtered from ${allDisplayItems.length})` : '' }}
          </span>
          <div class="flex items-center gap-1">
            <button @click="currentPage = 1" :disabled="currentPage === 1"
              class="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition"
              :class="currentPage === 1 ? 'text-gray-300 cursor-default' : 'text-gray-500 hover:bg-gray-100'">
              «
            </button>
            <button @click="currentPage--" :disabled="currentPage === 1"
              class="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition"
              :class="currentPage === 1 ? 'text-gray-300 cursor-default' : 'text-gray-500 hover:bg-gray-100'">
              ‹
            </button>
            <template v-for="p in pageNumbers" :key="p">
              <span v-if="p === '...'" class="w-8 h-8 flex items-center justify-center text-xs text-gray-400">…</span>
              <button v-else @click="currentPage = p"
                class="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition"
                :class="currentPage === p ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'">
                {{ p }}
              </button>
            </template>
            <button @click="currentPage++" :disabled="currentPage === totalPages"
              class="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition"
              :class="currentPage === totalPages ? 'text-gray-300 cursor-default' : 'text-gray-500 hover:bg-gray-100'">
              ›
            </button>
            <button @click="currentPage = totalPages" :disabled="currentPage === totalPages"
              class="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition"
              :class="currentPage === totalPages ? 'text-gray-300 cursor-default' : 'text-gray-500 hover:bg-gray-100'">
              »
            </button>
          </div>
        </div>
      </div>

    </template>

    <!-- Filter Popover -->
    <FilterPopover
      v-if="activeFilterMenu"
      :column-key="activeFilterMenu"
      :column-label="tableColumns.find(c => c.key === activeFilterMenu)?.label || activeFilterMenu"
      :values="getUniqueValues(activeFilterMenu)"
      :current-values="filters[activeFilterMenu] || []"
      :anchor-rect="activeFilterAnchorRect"
      @update:filters="updateFilter"
      @close="activeFilterMenu = null; activeFilterAnchorRect = null"
    />

    <!-- VO Edit Modal -->
    <VOForm
      v-if="showForm"
      :vo="editingVO"
      @save="saveVO"
      @cancel="closeForm"
    />

    <!-- Export Modal -->
    <div v-if="showExportModal"
      class="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 pt-16 overflow-y-auto"
      @click.self="showExportModal = false">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col" style="max-height: 82vh">

        <!-- Modal header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div class="flex items-center gap-2">
            <button v-if="exportCustomizeMode" @click="exportCustomizeMode = false"
              class="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <h3 class="text-base font-bold text-gray-900">
              {{ exportCustomizeMode ? 'Customize Export' : 'Export Monthly Invoicing' }}
            </h3>
            <span v-if="!exportCustomizeMode" class="text-xs text-gray-400 font-normal">— {{ monthLabel }}</span>
          </div>
          <button @click="showExportModal = false"
            class="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Mode selection -->
        <div v-if="!exportCustomizeMode" class="p-6 grid grid-cols-2 gap-4">
          <!-- Default export -->
          <div @click="exportMonth(); showExportModal = false"
            class="border-2 border-blue-100 rounded-xl p-5 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition group">
            <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-3 group-hover:bg-blue-200 transition">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
            </div>
            <h4 class="text-sm font-bold text-gray-900 mb-1">Export Default</h4>
            <p class="text-xs text-gray-500 leading-relaxed">Export all {{ allDisplayItems.length + manualEntries.length }} items for {{ monthLabel }}, including carry-overs and manual lines.</p>
            <div class="mt-4 text-xs text-blue-600 font-semibold flex items-center gap-1">
              Export now
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </div>

          <!-- Customize export -->
          <div @click="enterCustomizeMode"
            class="border-2 border-gray-100 rounded-xl p-5 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition group">
            <div class="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition">
              <svg class="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
              </svg>
            </div>
            <h4 class="text-sm font-bold text-gray-900 mb-1">Export Customize</h4>
            <p class="text-xs text-gray-500 leading-relaxed">Filter by scope and invoice status, then hand-pick which rows to include in the export.</p>
            <div class="mt-4 text-xs text-gray-500 group-hover:text-blue-600 font-semibold flex items-center gap-1 transition">
              Set filters
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Customize mode -->
        <template v-else>

          <!-- Filters -->
          <div class="px-6 py-4 border-b border-gray-100 space-y-4 flex-shrink-0">

            <!-- Scope filter -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="text-xs font-bold text-gray-600 uppercase tracking-wider">Scope</label>
                <label class="flex items-center gap-1.5 cursor-pointer select-none">
                  <input type="checkbox"
                    :checked="customScopeSelectAll"
                    v-bind:indeterminate.prop="customScopeIndeterminate"
                    @change="toggleAllCustomScopes"
                    class="rounded text-blue-600 cursor-pointer">
                  <span class="text-xs text-gray-500 font-medium">Select All</span>
                </label>
              </div>
              <div class="flex flex-wrap gap-1.5">
                <label v-for="scope in availableExportScopes" :key="scope"
                  class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border cursor-pointer text-xs font-medium transition select-none"
                  :class="customScopes.includes(scope)
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'">
                  <input type="checkbox" :checked="customScopes.includes(scope)" @change="toggleCustomScope(scope)" class="rounded text-blue-600 cursor-pointer">
                  {{ scope }}
                </label>
              </div>
            </div>

            <!-- Invoice Status filter -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="text-xs font-bold text-gray-600 uppercase tracking-wider">Invoice Status</label>
                <label class="flex items-center gap-1.5 cursor-pointer select-none">
                  <input type="checkbox"
                    :checked="customStatusSelectAll"
                    v-bind:indeterminate.prop="customStatusIndeterminate"
                    @change="toggleAllCustomStatuses"
                    class="rounded text-blue-600 cursor-pointer">
                  <span class="text-xs text-gray-500 font-medium">Select All</span>
                </label>
              </div>
              <div class="flex flex-wrap gap-1.5">
                <label v-for="status in availableExportStatuses" :key="status"
                  class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border cursor-pointer text-xs font-medium transition select-none"
                  :class="customStatuses.includes(status)
                    ? (STATUS_CFG[status]?.badge || 'bg-gray-100 text-gray-600') + ' border-transparent'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'">
                  <input type="checkbox" :checked="customStatuses.includes(status)" @change="toggleCustomStatus(status)" class="rounded text-blue-600 cursor-pointer">
                  {{ status }}
                </label>
              </div>
            </div>
          </div>

          <!-- Row selection table -->
          <div class="flex-1 overflow-auto min-h-0">
            <table class="w-full text-xs border-collapse">
              <thead class="sticky top-0 z-10">
                <tr class="bg-blue-700 text-white">
                  <th class="px-3 py-2.5 w-10 text-center">
                    <input type="checkbox"
                      :checked="customRowSelectAll"
                      v-bind:indeterminate.prop="customRowIndeterminate"
                      @change="toggleAllCustomRows"
                      class="rounded cursor-pointer">
                  </th>
                  <th class="px-3 py-2.5 text-left font-semibold uppercase tracking-wider whitespace-nowrap">Type / Site</th>
                  <th class="px-3 py-2.5 text-left font-semibold uppercase tracking-wider">Description</th>
                  <th class="px-3 py-2.5 text-left font-semibold uppercase tracking-wider whitespace-nowrap">Scope</th>
                  <th class="px-3 py-2.5 text-left font-semibold uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th class="px-3 py-2.5 text-right font-semibold uppercase tracking-wider whitespace-nowrap">Amount</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-if="customFilteredItems.length === 0">
                  <td colspan="6" class="px-4 py-8 text-center text-gray-400 text-sm">No items match the selected filters.</td>
                </tr>
                <tr v-for="item in customFilteredItems" :key="item.id"
                  @click="toggleCustomRow(item.id)"
                  class="cursor-pointer transition-colors"
                  :class="customSelectedIds.includes(item.id) ? 'bg-blue-50 hover:bg-blue-100' : 'bg-white hover:bg-gray-50'">
                  <td class="px-3 py-2.5 text-center" @click.stop>
                    <input type="checkbox"
                      :checked="customSelectedIds.includes(item.id)"
                      @change="toggleCustomRow(item.id)"
                      class="rounded text-blue-600 cursor-pointer">
                  </td>
                  <td class="px-3 py-2.5 whitespace-nowrap">
                    <span v-if="!item._isManual" class="px-1.5 py-0.5 rounded text-xs font-bold bg-indigo-100 text-indigo-700">{{ item.siteId || '—' }}</span>
                    <span v-else class="px-1.5 py-0.5 rounded text-xs font-bold bg-violet-100 text-violet-700">Manual</span>
                    <span v-if="carryOverIds.has(item.id)" class="ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-600">↩ CO</span>
                  </td>
                  <td class="px-3 py-2.5 text-gray-700 max-w-[220px]">
                    <div class="truncate" :title="item.voDescription || item.description">{{ item.voDescription || item.description || '—' }}</div>
                  </td>
                  <td class="px-3 py-2.5 text-gray-500 whitespace-nowrap">{{ item.scope || '(No Scope)' }}</td>
                  <td class="px-3 py-2.5 whitespace-nowrap">
                    <span :class="(STATUS_CFG[getDisplayInvoiceStatus(item, item._isManual ? 'SIT Completed' : 'Not Yet Sent')] || STATUS_CFG['Not Yet Sent']).badge"
                      class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap">
                      {{ getDisplayInvoiceStatus(item, item._isManual ? 'SIT Completed' : 'Not Yet Sent') }}
                    </span>
                  </td>
                  <td class="px-3 py-2.5 text-right font-semibold text-gray-800 whitespace-nowrap">
                    {{ formatCurrency(item._isManual ? (item.amount || 0) : displayAmt(item)) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Customize footer -->
          <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-between flex-shrink-0 bg-gray-50/50 rounded-b-2xl">
            <span class="text-sm text-gray-500">
              <span class="font-semibold text-gray-800">{{ customExportSelectedCount }}</span>
              of {{ customFilteredItems.length }} item{{ customFilteredItems.length !== 1 ? 's' : '' }} selected
            </span>
            <div class="flex items-center gap-2">
              <button @click="exportCustomizeMode = false"
                class="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-100 transition">
                Back
              </button>
              <button @click="exportCustom"
                :disabled="customExportSelectedCount === 0"
                class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                Export {{ customExportSelectedCount }} item{{ customExportSelectedCount !== 1 ? 's' : '' }}
              </button>
            </div>
          </div>

        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title,
} from 'chart.js'
import { useVOStore } from '../stores/voStore'
import { formatCurrency, formatCompact } from '../utils/formatters'
import VOForm from './VOForm.vue'
import FilterPopover from './FilterPopover.vue'
import * as XLSX from 'xlsx'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title)

const store = useVOStore()

const showAlerts = ref(false)
const bellRef    = ref(null)

const BASE_PO_CATEGORIES = new Set(['Site Survey', 'WOP', 'C&I', 'SAT&SIT', 'Snag Closure'])
const CARRYOVER_STATUSES = new Set(['To Be Sent to Nokia', 'Request to Nokia', 'SIT Wrong Amount'])
const PAGE_SIZE = 25
const MANUAL_ENTRIES_KEY = 'manualInvoiceEntries'
const MONTHLY_REQUEST_SATISH_KEY = 'monthlyRequestSatishIds'
const WAITING_ROM_APPROVAL = 'Waiting ROM Approval'
const WAITING_SATISH = 'Waiting Satish'

const RAW_STATUS_ORDER = ['To Be Sent to Nokia', 'Request to Nokia', 'SIT Approved', 'SIT Completed', 'SIT Wrong Amount', 'Not Yet Sent']
const STATUS_ORDER = ['To Be Sent to Nokia', WAITING_ROM_APPROVAL, WAITING_SATISH, 'SIT Approved', 'SIT Completed', 'SIT Wrong Amount', 'Not Yet Sent']

const STATUS_CFG = {
  'To Be Sent to Nokia': { border: 'border-indigo-200', text: 'text-indigo-700', muted: 'text-indigo-400', dot: 'bg-indigo-500', bar: 'bg-indigo-500', badge: 'bg-indigo-100 text-indigo-700' },
  [WAITING_ROM_APPROVAL]: { border: 'border-blue-200', text: 'text-blue-700', muted: 'text-blue-400', dot: 'bg-blue-500', bar: 'bg-blue-500', badge: 'bg-blue-100 text-blue-700' },
  [WAITING_SATISH]:      { border: 'border-teal-200', text: 'text-teal-700', muted: 'text-teal-400', dot: 'bg-teal-500', bar: 'bg-teal-500', badge: 'bg-teal-100 text-teal-700' },
  'SIT Approved':        { border: 'border-yellow-200', text: 'text-yellow-700', muted: 'text-yellow-400', dot: 'bg-yellow-400', bar: 'bg-yellow-400', badge: 'bg-yellow-100 text-yellow-700' },
  'SIT Completed':       { border: 'border-green-200',  text: 'text-green-700',  muted: 'text-green-400',  dot: 'bg-green-500',  bar: 'bg-green-500',  badge: 'bg-green-100 text-green-700'  },
  'SIT Wrong Amount':    { border: 'border-rose-200',   text: 'text-rose-700',   muted: 'text-rose-400',   dot: 'bg-rose-500',   bar: 'bg-rose-500',   badge: 'bg-rose-100 text-rose-700'    },
  'Not Yet Sent':        { border: 'border-gray-200',   text: 'text-gray-600',   muted: 'text-gray-400',   dot: 'bg-gray-400',   bar: 'bg-gray-400',   badge: 'bg-gray-100 text-gray-600'   },
}

// For SIT Wrong Amount VOs the amount that still needs to be collected is the delta
const displayAmt = (vo) => {
  if (vo.invoiceStatus === 'SIT Wrong Amount') {
    return (vo.voAmount || 0) - (vo.wrongInvoiceAmount || 0)
  }
  return vo.voAmount || 0
}

const satishRequestIds = ref(new Set())

const loadSatishRequestIds = () => {
  try {
    satishRequestIds.value = new Set(JSON.parse(localStorage.getItem(MONTHLY_REQUEST_SATISH_KEY) || '[]'))
  } catch {
    satishRequestIds.value = new Set()
  }
}

const saveSatishRequestIds = () => {
  localStorage.setItem(MONTHLY_REQUEST_SATISH_KEY, JSON.stringify([...satishRequestIds.value]))
}

const isRequestToNokia = (item) => (item?.invoiceStatus || '') === 'Request to Nokia'

const getDisplayInvoiceStatus = (item, fallback = 'Not Yet Sent') => {
  const rawStatus = item?.invoiceStatus || fallback
  if (rawStatus !== 'Request to Nokia') return rawStatus
  return satishRequestIds.value.has(item.id) ? WAITING_SATISH : WAITING_ROM_APPROVAL
}

const today = new Date()
const selectedMonth  = ref(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`)
const showAllMonths  = ref(false)
const currentPage    = ref(1)

watch([selectedMonth, showAllMonths], () => { currentPage.value = 1 })

const toMonthKey = (d) => {
  if (!d) return ''
  const dt = typeof d === 'string' ? new Date(d) : d
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`
}

const monthLabel = computed(() => {
  if (showAllMonths.value) return 'All Months'
  const [y, m] = selectedMonth.value.split('-')
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })
})

const prevMonth = () => {
  const [y, m] = selectedMonth.value.split('-').map(Number)
  const d = new Date(y, m - 2, 1)
  selectedMonth.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

const nextMonth = () => {
  const [y, m] = selectedMonth.value.split('-').map(Number)
  const d = new Date(y, m, 1)
  selectedMonth.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

const monthItems = computed(() =>
  showAllMonths.value
    ? (store.vos.value || []).filter(vo => vo.invoiceDate)
    : (store.vos.value || []).filter(vo =>
        vo.invoiceDate && toMonthKey(vo.invoiceDate) === selectedMonth.value
      )
)

const carryOverItems = computed(() =>
  showAllMonths.value
    ? []
    : (store.vos.value || []).filter(vo =>
        vo.invoiceDate &&
        toMonthKey(vo.invoiceDate) < selectedMonth.value &&
        CARRYOVER_STATUSES.has(vo.invoiceStatus)
      )
)

const carryOverIds     = computed(() => new Set(carryOverItems.value.map(vo => vo.id)))
const carryOverAmount  = computed(() => carryOverItems.value.reduce((s, vo) => s + displayAmt(vo), 0))
const allDisplayItems  = computed(() => [...monthItems.value, ...carryOverItems.value])

const voItems     = computed(() => allDisplayItems.value.filter(vo => !BASE_PO_CATEGORIES.has(vo.voCategory)))
const basePOItems = computed(() => allDisplayItems.value.filter(vo =>  BASE_PO_CATEGORIES.has(vo.voCategory)))

const allDisplayAmount = computed(() => allDisplayItems.value.reduce((s, vo) => s + displayAmt(vo), 0))
const voTotal          = computed(() => voItems.value.reduce((s, vo) => s + displayAmt(vo), 0))
const basePOTotal      = computed(() => basePOItems.value.reduce((s, vo) => s + displayAmt(vo), 0))

// SIT Wrong Amount items — for a dedicated summary card
const wrongAmountItems   = computed(() => allDisplayItems.value.filter(vo => vo.invoiceStatus === 'SIT Wrong Amount'))
const wrongAmountTotal   = computed(() => wrongAmountItems.value.reduce((s, vo) => s + displayAmt(vo), 0))
const wrongInvoicedTotal = computed(() => wrongAmountItems.value.reduce((s, vo) => s + (vo.wrongInvoiceAmount || 0), 0))

const alertCount = computed(() =>
  (carryOverItems.value.filter(v => v.invoiceStatus !== 'SIT Wrong Amount').length > 0 ? 1 : 0) +
  (wrongAmountItems.value.length > 0 ? 1 : 0)
)

// ── Third Party & Service breakdown rows ──
const tpServiceRows = computed(() => {
  const groups = {
    thirdParty: { label: 'Third Party', dot: 'bg-purple-500', total: 0, count: 0, byStatus: {} },
    service:    { label: 'Service',     dot: 'bg-blue-500',   total: 0, count: 0, byStatus: {} },
  }
  for (const vo of allDisplayItems.value) {
    const key = (vo.voCategory || '').toLowerCase() === 'third party' ? 'thirdParty' : 'service'
    const g = groups[key]
    const amt = displayAmt(vo)
    const s = getDisplayInvoiceStatus(vo)
    g.total += amt
    g.count++
    if (!g.byStatus[s]) g.byStatus[s] = { amount: 0, count: 0 }
    g.byStatus[s].amount += amt
    g.byStatus[s].count++
  }
  for (const e of manualEntries.value) {
    const key = (e.category || '').toLowerCase() === 'third party' ? 'thirdParty' : 'service'
    const g = groups[key]
    const s = getDisplayInvoiceStatus(e, 'SIT Completed')
    g.total += e.amount || 0
    g.count++
    if (!g.byStatus[s]) g.byStatus[s] = { amount: 0, count: 0 }
    g.byStatus[s].amount += e.amount || 0
    g.byStatus[s].count++
  }
  return [groups.thirdParty, groups.service]
})

// ── Manual entries ──
const manualEntries = ref([])
const manualSectionOpen = ref(true)
const showManualForm = ref(false)
const editingManualId = ref(null)
const manualForm = ref({ description: '', category: '', scope: '', amount: '', invoiceStatus: 'SIT Completed' })
const adminCategories = ref([])
const adminScopes = ref([])

const allCategories = computed(() => {
  const cats = new Set([...BASE_PO_CATEGORIES, ...adminCategories.value])
  return [...cats].sort()
})

const loadManualEntries = () => {
  try {
    const all = JSON.parse(localStorage.getItem(MANUAL_ENTRIES_KEY) || '{}')
    if (showAllMonths.value) {
      manualEntries.value = Object.values(all).flat()
    } else {
      manualEntries.value = all[selectedMonth.value] || []
    }
  } catch { manualEntries.value = [] }
}

const saveManualEntriesToStorage = () => {
  try {
    const all = JSON.parse(localStorage.getItem(MANUAL_ENTRIES_KEY) || '{}')
    all[selectedMonth.value] = manualEntries.value
    localStorage.setItem(MANUAL_ENTRIES_KEY, JSON.stringify(all))
  } catch {}
}

const loadAdminData = () => {
  try {
    const gd = JSON.parse(localStorage.getItem('globalData') || '{}')
    adminCategories.value = (gd.categories || []).map(c => typeof c === 'string' ? c : c.name).filter(Boolean)
    adminScopes.value = (gd.scopes || []).map(s => typeof s === 'string' ? s : s.name).filter(Boolean)
  } catch {}
}

watch([selectedMonth, showAllMonths], loadManualEntries)

const manualTotal = computed(() => manualEntries.value.reduce((s, e) => s + (e.amount || 0), 0))
const grandTotal  = computed(() => allDisplayAmount.value + manualTotal.value)

const kpiGridCols = computed(() => {
  const count = 3
    + (carryOverItems.value.length > 0 ? 1 : 0)
    + (manualEntries.value.length > 0 ? 1 : 0)
    + (wrongAmountItems.value.length > 0 ? 1 : 0)
  if (count >= 6) return 'grid-cols-3 sm:grid-cols-6'
  if (count === 5) return 'grid-cols-5'
  if (count === 4) return 'grid-cols-4'
  return 'grid-cols-3'
})

const openManualForm = (entry = null) => {
  manualSectionOpen.value = true
  if (entry) {
    editingManualId.value = entry.id
    manualForm.value = { description: entry.description, category: entry.category || '', scope: entry.scope || '', amount: entry.amount, invoiceStatus: entry.invoiceStatus }
  } else {
    editingManualId.value = null
    manualForm.value = { description: '', category: '', scope: '', amount: '', invoiceStatus: 'SIT Completed' }
  }
  showManualForm.value = true
}

const cancelManualForm = () => {
  showManualForm.value = false
  editingManualId.value = null
}

const saveManualEntry = () => {
  const amt = parseFloat(manualForm.value.amount)
  if (!manualForm.value.description || isNaN(amt)) return
  if (editingManualId.value) {
    const idx = manualEntries.value.findIndex(e => e.id === editingManualId.value)
    if (idx >= 0) {
      manualEntries.value[idx] = { ...manualEntries.value[idx], description: manualForm.value.description, category: manualForm.value.category, scope: manualForm.value.scope, invoiceStatus: manualForm.value.invoiceStatus, amount: amt }
      if (manualForm.value.invoiceStatus !== 'Request to Nokia' && satishRequestIds.value.has(editingManualId.value)) {
        const next = new Set(satishRequestIds.value)
        next.delete(editingManualId.value)
        satishRequestIds.value = next
        saveSatishRequestIds()
      }
    }
  } else {
    manualEntries.value.push({
      id: 'manual_' + Date.now() + '_' + Math.random().toString(36).slice(2),
      description: manualForm.value.description,
      category: manualForm.value.category,
      scope: manualForm.value.scope,
      invoiceStatus: manualForm.value.invoiceStatus,
      amount: amt,
    })
  }
  saveManualEntriesToStorage()
  cancelManualForm()
}

const deleteManualEntry = (id) => {
  if (!confirm('Remove this manual invoice line?')) return
  manualEntries.value = manualEntries.value.filter(e => e.id !== id)
  if (satishRequestIds.value.has(id)) {
    const next = new Set(satishRequestIds.value)
    next.delete(id)
    satishRequestIds.value = next
    saveSatishRequestIds()
  }
  saveManualEntriesToStorage()
}

const statusGroups = computed(() => {
  const groups = {}
  allDisplayItems.value.forEach(vo => {
    const s = getDisplayInvoiceStatus(vo)
    if (!groups[s]) groups[s] = { count: 0, total: 0, manualCount: 0 }
    groups[s].count++
    groups[s].total += displayAmt(vo)
  })
  manualEntries.value.forEach(e => {
    const s = getDisplayInvoiceStatus(e, 'SIT Completed')
    if (!groups[s]) groups[s] = { count: 0, total: 0, manualCount: 0 }
    groups[s].count++
    groups[s].manualCount++
    groups[s].total += e.amount || 0
  })
  return STATUS_ORDER.filter(s => groups[s]).map(s => ({
    status: s,
    ...groups[s],
    cfg: STATUS_CFG[s] || STATUS_CFG['Not Yet Sent'],
  }))
})

const tableColumns = [
  { key: 'siteId',        label: 'Site ID',        minW: '80px'  },
  { key: 'siteName',      label: 'Site Name',      minW: '140px' },
  { key: 'jobNumber',     label: 'Job No.',         minW: '90px'  },
  { key: 'voDescription', label: 'Description',    minW: '180px' },
  { key: 'voCategory',    label: 'Category',       minW: '90px'  },
  { key: 'scope',         label: 'Scope',          minW: '80px'  },
  { key: 'poNumber',      label: 'PO Number',      minW: '100px' },
  { key: 'invoiceStatus', label: 'Invoice Status', minW: '130px' },
  { key: 'invoiceDate',   label: 'Invoice Date',   minW: '110px' },
  { key: 'voAmount',      label: 'Amount',         minW: '90px', right: true },
]

// ── Filter state ──
const filters = ref({
  siteId: [], siteName: [], jobNumber: [], voDescription: [],
  voCategory: [], scope: [], poNumber: [], invoiceStatus: [], invoiceDate: [], voAmount: [],
})

const hasActiveFilters = computed(() => Object.values(filters.value).some(v => v.length > 0))
const clearFilters = () => { for (const k in filters.value) filters.value[k] = [] }

const activeFilterMenu      = ref(null)
const activeFilterAnchorRect = ref(null)

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

const closeFilterMenu = () => {
  activeFilterMenu.value = null
  activeFilterAnchorRect.value = null
}


const onClickOutsideBell = (e) => {
  if (bellRef.value && !bellRef.value.contains(e.target)) showAlerts.value = false
}

onMounted(() => {
  window.addEventListener('mousedown', onClickOutsideBell)
  loadManualEntries()
  loadAdminData()
  loadSatishRequestIds()
})
onUnmounted(() => {
  window.removeEventListener('mousedown', onClickOutsideBell)
})

const getUniqueValues = (key) => {
  const s = new Set()
  for (const vo of allDisplayItems.value) {
    let v
    if (key === 'invoiceDate') {
      v = vo.invoiceDate ? new Date(vo.invoiceDate).toLocaleDateString('en-AU') : '—'
    } else if (key === 'voAmount') {
      v = formatCurrency(vo.voAmount)
    } else if (key === 'invoiceStatus') {
      v = getDisplayInvoiceStatus(vo)
    } else {
      v = (vo[key] ?? '').toString().trim() || '—'
    }
    s.add(v)
  }
  return [...s].sort()
}

watch(filters, () => { currentPage.value = 1 }, { deep: true })

const sortCol = ref(null)
const sortDir = ref('asc')

const toggleSort = (col) => {
  if (sortCol.value === col) {
    if (sortDir.value === 'asc') { sortDir.value = 'desc' }
    else { sortCol.value = null; sortDir.value = 'asc' }
  } else {
    sortCol.value = col
    sortDir.value = 'asc'
  }
  currentPage.value = 1
}

const colVal = (vo, col) => {
  switch (col) {
    case 'siteId':        return (vo.siteId || '').toLowerCase()
    case 'siteName':      return (vo.siteName || '').toLowerCase()
    case 'jobNumber':     return (vo.jobNumber || '').toLowerCase()
    case 'voDescription': return (vo.voDescription || '').toLowerCase()
    case 'voCategory':    return (vo.voCategory || '').toLowerCase()
    case 'scope':         return (vo.scope || '').toLowerCase()
    case 'poNumber':      return (vo.poNumber || '').toLowerCase()
    case 'invoiceStatus': return getDisplayInvoiceStatus(vo).toLowerCase()
    case 'invoiceDate':   return vo.invoiceDate || ''
    case 'voAmount':      return vo.voAmount || 0
    default:              return ''
  }
}

const sortFn = (a, b) => {
  if (!sortCol.value) {
    const sa = (a.scope || '').toLowerCase(), sb = (b.scope || '').toLowerCase()
    if (sa !== sb) return sa < sb ? -1 : 1
    return (a.siteId || '').localeCompare(b.siteId || '')
  }
  const av = colVal(a, sortCol.value)
  const bv = colVal(b, sortCol.value)
  let cmp = typeof av === 'number' ? av - bv : av < bv ? -1 : av > bv ? 1 : 0
  return sortDir.value === 'asc' ? cmp : -cmp
}

const sortedAllItems = computed(() => [
  ...[...monthItems.value].sort(sortFn),
  ...[...carryOverItems.value].sort(sortFn),
])

const filteredSortedItems = computed(() => {
  return sortedAllItems.value.filter(vo => {
    for (const [key, selected] of Object.entries(filters.value)) {
      if (!selected.length) continue
      let val
      if (key === 'invoiceDate') {
        val = vo.invoiceDate ? new Date(vo.invoiceDate).toLocaleDateString('en-AU') : '—'
      } else if (key === 'voAmount') {
        val = formatCurrency(vo.voAmount)
      } else if (key === 'invoiceStatus') {
        val = getDisplayInvoiceStatus(vo)
      } else {
        val = (vo[key] ?? '').toString().trim() || '—'
      }
      if (!selected.includes(val)) return false
    }
    return true
  })
})

const filteredTotal = computed(() =>
  filteredSortedItems.value.reduce((s, vo) => s + displayAmt(vo), 0)
)

const filterSummary = computed(() => {
  const byStatus = {}
  for (const vo of filteredSortedItems.value) {
    const s = getDisplayInvoiceStatus(vo)
    byStatus[s] = (byStatus[s] || 0) + displayAmt(vo)
  }
  return byStatus
})

const totalPages   = computed(() => Math.max(1, Math.ceil(filteredSortedItems.value.length / PAGE_SIZE)))
const pageStart    = computed(() => (currentPage.value - 1) * PAGE_SIZE + 1)
const pageEnd      = computed(() => Math.min(currentPage.value * PAGE_SIZE, filteredSortedItems.value.length))
const paginatedItems = computed(() =>
  filteredSortedItems.value.slice((currentPage.value - 1) * PAGE_SIZE, currentPage.value * PAGE_SIZE)
)

const pageNumbers = computed(() => {
  const total = totalPages.value
  const cur   = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = []
  if (cur <= 4) {
    pages.push(1, 2, 3, 4, 5, '...', total)
  } else if (cur >= total - 3) {
    pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total)
  } else {
    pages.push(1, '...', cur - 1, cur, cur + 1, '...', total)
  }
  return pages
})

const isFirstCarryOverInPage = (vo, idx) => {
  if (!carryOverIds.value.has(vo.id)) return false
  if (idx === 0) return monthItems.value.length > 0
  return !carryOverIds.value.has(paginatedItems.value[idx - 1]?.id)
}

// Edit modal
const editingVO = ref(null)
const showForm  = ref(false)

const openEdit = (vo) => {
  editingVO.value = vo
  showForm.value  = true
}

const closeForm = () => {
  showForm.value  = false
  editingVO.value = null
}

const saveVO = async (voData) => {
  try {
    await store.editVO(editingVO.value.id, voData)
    if ((voData.invoiceStatus || '') !== 'Request to Nokia' && satishRequestIds.value.has(editingVO.value.id)) {
      const next = new Set(satishRequestIds.value)
      next.delete(editingVO.value.id)
      satishRequestIds.value = next
      saveSatishRequestIds()
    }
    closeForm()
  } catch (err) {
    console.error('❌ Error saving VO:', err)
    alert('Error saving VO: ' + err.message)
  }
}

// ── Scope summary for chart (includes manual entries) ──
const filteredRequestRows = computed(() =>
  filteredSortedItems.value.filter(vo => isRequestToNokia(vo))
)

const allFilteredRequestRowsSatish = computed(() =>
  filteredRequestRows.value.length > 0 &&
  filteredRequestRows.value.every(vo => satishRequestIds.value.has(vo.id))
)

const someFilteredRequestRowsSatish = computed(() =>
  filteredRequestRows.value.some(vo => satishRequestIds.value.has(vo.id)) &&
  !allFilteredRequestRowsSatish.value
)

const toggleRequestRowSatish = (id) => {
  const next = new Set(satishRequestIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  satishRequestIds.value = next
  saveSatishRequestIds()
}

const toggleAllFilteredRequestRowsSatish = () => {
  const next = new Set(satishRequestIds.value)
  if (allFilteredRequestRowsSatish.value) {
    filteredRequestRows.value.forEach(vo => next.delete(vo.id))
  } else {
    filteredRequestRows.value.forEach(vo => next.add(vo.id))
  }
  satishRequestIds.value = next
  saveSatishRequestIds()
}

const SCOPE_STATUS_COLORS = {
  'SIT Completed':       { bg: 'rgba(34,197,94,0.85)',  border: '#16a34a' },
  'SIT Approved':        { bg: 'rgba(234,179,8,0.85)',  border: '#ca8a04' },
  [WAITING_ROM_APPROVAL]: { bg: 'rgba(59,130,246,0.85)', border: '#2563eb' },
  [WAITING_SATISH]:      { bg: 'rgba(20,184,166,0.85)', border: '#0f766e' },
  'To Be Sent to Nokia': { bg: 'rgba(99,102,241,0.85)', border: '#4f46e5' },
  'SIT Wrong Amount':    { bg: 'rgba(244,63,94,0.80)',  border: '#e11d48' },
  'Not Yet Sent':        { bg: 'rgba(156,163,175,0.85)',border: '#9ca3af' },
}

const scopeChartData = computed(() => {
  const scopeMap = {}

  for (const vo of allDisplayItems.value) {
    const scope = vo.scope?.trim() || '(No Scope)'
    const status = getDisplayInvoiceStatus(vo)
    if (!scopeMap[scope]) scopeMap[scope] = {}
    scopeMap[scope][status] = (scopeMap[scope][status] || 0) + displayAmt(vo)
  }

  for (const e of manualEntries.value) {
    const scope = e.scope?.trim() || '(No Scope)'
    const status = getDisplayInvoiceStatus(e, 'SIT Completed')
    if (!scopeMap[scope]) scopeMap[scope] = {}
    scopeMap[scope][status] = (scopeMap[scope][status] || 0) + (e.amount || 0)
  }

  const scopes = Object.keys(scopeMap).sort((a, b) => {
    const totA = Object.values(scopeMap[a]).reduce((s, v) => s + v, 0)
    const totB = Object.values(scopeMap[b]).reduce((s, v) => s + v, 0)
    return totB - totA
  })

  const datasets = STATUS_ORDER.filter(s =>
    scopes.some(sc => scopeMap[sc][s])
  ).map(s => ({
    label: s,
    data: scopes.map(sc => scopeMap[sc][s] || 0),
    backgroundColor: SCOPE_STATUS_COLORS[s]?.bg  || 'rgba(156,163,175,0.8)',
    borderColor:     SCOPE_STATUS_COLORS[s]?.border || '#9ca3af',
    borderWidth: 1,
    borderRadius: 3,
  }))

  return { labels: scopes, datasets, scopeMap, scopes }
})

const scopeChartOptions = computed(() => ({
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top', labels: { boxWidth: 12, font: { size: 11 } } },
    tooltip: {
      callbacks: {
        label: ctx => ` ${ctx.dataset.label}: ${formatCompact(ctx.parsed.x)}`,
      },
    },
  },
  scales: {
    y: { stacked: true, grid: { display: false }, ticks: { font: { size: 11 } } },
    x: {
      stacked: true,
      grid: { color: '#f3f4f6' },
      ticks: {
        font: { size: 10 },
        callback: v => {
          if (v >= 1_000_000) return '$' + (v / 1_000_000).toFixed(1) + 'M'
          if (v >= 1_000)     return '$' + (v / 1_000).toFixed(0) + 'k'
          return '$' + v
        },
      },
    },
  },
}))

// ── Export Modal ──
const showExportModal     = ref(false)
const exportCustomizeMode = ref(false)
const customScopes        = ref([])
const customStatuses      = ref([])
const customSelectedIds   = ref([])

const availableExportScopes = computed(() => {
  const s = new Set()
  for (const vo of sortedAllItems.value) s.add((vo.scope || '').trim() || '(No Scope)')
  for (const e of manualEntries.value)   s.add((e.scope  || '').trim() || '(No Scope)')
  return [...s].sort()
})

const availableExportStatuses = computed(() => {
  const s = new Set()
  for (const vo of sortedAllItems.value) s.add(getDisplayInvoiceStatus(vo))
  for (const e of manualEntries.value)   s.add(getDisplayInvoiceStatus(e, 'SIT Completed'))
  return STATUS_ORDER.filter(st => s.has(st))
})

const customFilteredItems = computed(() => {
  const combined = [
    ...sortedAllItems.value.map(vo => ({ ...vo, _isManual: false })),
    ...manualEntries.value.map(e => ({
      ...e, _isManual: true,
      voDescription: e.description,
      voCategory:    e.category,
    })),
  ]
  return combined.filter(item => {
    const scope  = (item.scope || '').trim() || '(No Scope)'
    const status = getDisplayInvoiceStatus(item, item._isManual ? 'SIT Completed' : 'Not Yet Sent')
    return customScopes.value.includes(scope) && customStatuses.value.includes(status)
  })
})

const customScopeSelectAll    = computed(() => customScopes.value.length === availableExportScopes.value.length)
const customScopeIndeterminate = computed(() => customScopes.value.length > 0 && !customScopeSelectAll.value)
const customStatusSelectAll    = computed(() => customStatuses.value.length === availableExportStatuses.value.length)
const customStatusIndeterminate = computed(() => customStatuses.value.length > 0 && !customStatusSelectAll.value)

const customExportSelectedCount = computed(() => {
  const filteredIds = new Set(customFilteredItems.value.map(i => i.id))
  return customSelectedIds.value.filter(id => filteredIds.has(id)).length
})

const customRowSelectAll = computed(() =>
  customFilteredItems.value.length > 0 &&
  customFilteredItems.value.every(item => customSelectedIds.value.includes(item.id))
)
const customRowIndeterminate = computed(() =>
  customFilteredItems.value.some(item => customSelectedIds.value.includes(item.id)) &&
  !customRowSelectAll.value
)

const openExportModal = () => {
  exportCustomizeMode.value = false
  showExportModal.value = true
}

const enterCustomizeMode = () => {
  customScopes.value   = [...availableExportScopes.value]
  customStatuses.value = [...availableExportStatuses.value]
  customSelectedIds.value = [
    ...sortedAllItems.value.map(vo => vo.id),
    ...manualEntries.value.map(e => e.id),
  ]
  exportCustomizeMode.value = true
}

const toggleCustomScope = (scope) => {
  customScopes.value = customScopes.value.includes(scope)
    ? customScopes.value.filter(s => s !== scope)
    : [...customScopes.value, scope]
}
const toggleAllCustomScopes = () => {
  customScopes.value = customScopeSelectAll.value ? [] : [...availableExportScopes.value]
}

const toggleCustomStatus = (status) => {
  customStatuses.value = customStatuses.value.includes(status)
    ? customStatuses.value.filter(s => s !== status)
    : [...customStatuses.value, status]
}
const toggleAllCustomStatuses = () => {
  customStatuses.value = customStatusSelectAll.value ? [] : [...availableExportStatuses.value]
}

const toggleCustomRow = (id) => {
  customSelectedIds.value = customSelectedIds.value.includes(id)
    ? customSelectedIds.value.filter(i => i !== id)
    : [...customSelectedIds.value, id]
}
const toggleAllCustomRows = () => {
  if (customRowSelectAll.value) {
    const filteredIds = new Set(customFilteredItems.value.map(i => i.id))
    customSelectedIds.value = customSelectedIds.value.filter(id => !filteredIds.has(id))
  } else {
    const existing = new Set(customSelectedIds.value)
    for (const item of customFilteredItems.value) existing.add(item.id)
    customSelectedIds.value = [...existing]
  }
}

const exportCustom = () => {
  const toExport = customFilteredItems.value.filter(i => customSelectedIds.value.includes(i.id))
  const rows = toExport.map(item => {
    if (item._isManual) {
      return {
        'Type':                    'Manual',
        'Carry Over':              '',
        'Invoice Month':           showAllMonths.value ? '' : selectedMonth.value,
        'Site ID':                 '',
        'Site Name':               '',
        'Job No.':                 '',
        'Description':             item.description || '',
        'Category':                item.category || '',
        'Scope':                   item.scope || '',
        'PO Number':               '',
        'Invoice Status':          getDisplayInvoiceStatus(item, 'SIT Completed'),
        'Invoice Date':            '',
        'Amount (AUD)':            item.amount || 0,
        'Wrong Invoice Amt (AUD)': '',
        'Delta (AUD)':             '',
      }
    }
    return {
      'Type':                    'VO',
      'Carry Over':              carryOverIds.value.has(item.id) ? 'Yes' : '',
      'Invoice Month':           toMonthKey(item.invoiceDate),
      'Site ID':                 item.siteId || '',
      'Site Name':               item.siteName || '',
      'Job No.':                 item.jobNumber || '',
      'Description':             item.voDescription || '',
      'Category':                item.voCategory || '',
      'Scope':                   item.scope || '',
      'PO Number':               item.poNumber || '',
      'Invoice Status':          getDisplayInvoiceStatus(item),
      'Invoice Date':            item.invoiceDate ? new Date(item.invoiceDate).toLocaleDateString('en-AU') : '',
      'Amount (AUD)':            item.voAmount || 0,
      'Wrong Invoice Amt (AUD)': item.invoiceStatus === 'SIT Wrong Amount' ? (item.wrongInvoiceAmount || 0) : '',
      'Delta (AUD)':             item.invoiceStatus === 'SIT Wrong Amount' ? displayAmt(item) : '',
    }
  })
  const ws = XLSX.utils.json_to_sheet(rows)
  ws['!cols'] = [
    { wch: 8 }, { wch: 10 }, { wch: 14 }, { wch: 10 }, { wch: 22 }, { wch: 12 },
    { wch: 45 }, { wch: 18 }, { wch: 18 }, { wch: 14 }, { wch: 22 }, { wch: 14 }, { wch: 14 },
  ]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Monthly Invoicing')
  const suffix = showAllMonths.value ? 'All' : selectedMonth.value
  XLSX.writeFile(wb, `Monthly_Invoicing_${suffix}_Custom.xlsx`)
  showExportModal.value = false
}

const exportMonth = () => {
  const voRows = sortedAllItems.value.map(vo => ({
    'Type':           'VO',
    'Carry Over':     carryOverIds.value.has(vo.id) ? 'Yes' : '',
    'Invoice Month':  toMonthKey(vo.invoiceDate),
    'Site ID':        vo.siteId || '',
    'Site Name':      vo.siteName || '',
    'Job No.':        vo.jobNumber || '',
    'Description':    vo.voDescription || '',
    'Category':       vo.voCategory || '',
    'Scope':          vo.scope || '',
    'PO Number':      vo.poNumber || '',
    'Invoice Status':          getDisplayInvoiceStatus(vo),
    'Invoice Date':            vo.invoiceDate ? new Date(vo.invoiceDate).toLocaleDateString('en-AU') : '',
    'Amount (AUD)':            vo.voAmount || 0,
    'Wrong Invoice Amt (AUD)': vo.invoiceStatus === 'SIT Wrong Amount' ? (vo.wrongInvoiceAmount || 0) : '',
    'Delta (AUD)':             vo.invoiceStatus === 'SIT Wrong Amount' ? displayAmt(vo) : '',
  }))
  const manualRows = manualEntries.value.map(e => ({
    'Type':           'Manual',
    'Carry Over':     '',
    'Invoice Month':  selectedMonth.value,
    'Site ID':        '',
    'Site Name':      '',
    'Job No.':        '',
    'Description':    e.description || '',
    'Category':       e.category || '',
    'Scope':          e.scope || '',
    'PO Number':      '',
    'Invoice Status': getDisplayInvoiceStatus(e, 'SIT Completed'),
    'Invoice Date':   '',
    'Amount (AUD)':   e.amount || 0,
  }))
  const rows = [...voRows, ...manualRows]
  const ws = XLSX.utils.json_to_sheet(rows)
  ws['!cols'] = [
    { wch: 8 }, { wch: 10 }, { wch: 14 }, { wch: 10 }, { wch: 22 }, { wch: 12 },
    { wch: 45 }, { wch: 18 }, { wch: 18 }, { wch: 14 }, { wch: 22 }, { wch: 14 }, { wch: 14 },
  ]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Monthly Invoicing')
  XLSX.writeFile(wb, `Monthly_Invoicing_${selectedMonth.value}.xlsx`)
}
</script>
