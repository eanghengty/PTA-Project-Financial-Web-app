<template>
  <div class="space-y-5">

    <!-- ── Page header ── -->
    <div class="flex items-center justify-between pb-2 border-b border-gray-100">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">Dashboard</h2>
          <p class="text-xs text-gray-400 mt-0.5">{{ totalVOs }} variation orders · {{ basePOItems.length }} base PO items</p>
        </div>
      </div>
      <div class="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        Updated {{ now }}
      </div>
    </div>

    <!-- ── Row 1: Status KPI cards ── -->
    <div class="grid grid-cols-5 gap-3">
      <div v-for="s in statusCards" :key="s.label"
        class="bg-white rounded-xl px-5 py-4 flex flex-col gap-1 cursor-default transition border border-l-4"
        :class="{
          'border-gray-300  hover:border-gray-400':  s.color === 'gray',
          'border-blue-400  hover:border-blue-500':  s.color === 'blue',
          'border-amber-400 hover:border-amber-500': s.color === 'amber',
          'border-green-500 hover:border-green-600': s.color === 'green',
          'border-red-400   hover:border-red-500':   s.color === 'red',
        }">
        <span class="text-xs font-bold uppercase tracking-wider"
          :class="{
            'text-gray-500':  s.color === 'gray',
            'text-blue-600':  s.color === 'blue',
            'text-amber-600': s.color === 'amber',
            'text-green-700': s.color === 'green',
            'text-red-600':   s.color === 'red',
          }">{{ s.label }}</span>
        <span class="text-3xl font-bold text-gray-900">{{ s.count }}</span>
        <div class="mt-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
          <div class="h-full rounded-full transition-all"
            :class="{
              'bg-gray-400':  s.color === 'gray',
              'bg-blue-500':  s.color === 'blue',
              'bg-amber-400': s.color === 'amber',
              'bg-green-500': s.color === 'green',
              'bg-red-400':   s.color === 'red',
            }"
            :style="{ width: totalVOs ? (s.count / totalVOs * 100) + '%' : '0%' }"></div>
        </div>
        <span class="text-[10px] text-gray-400 mt-0.5">Service &amp; Third Party · Non-BOQ</span>
      </div>
    </div>

    <!-- ── Row 2: Financial KPI cards ── -->
    <div class="grid grid-cols-7 gap-3">
      <div v-for="fin in financialCards" :key="fin.label"
        class="bg-white rounded-xl p-4 transition border border-l-4"
        :class="{
          'border-green-400  hover:border-green-500':  fin.color === 'green',
          'border-amber-400  hover:border-amber-500':  fin.color === 'amber',
          'border-blue-500   hover:border-blue-600':   fin.color === 'blue',
          'border-orange-400 hover:border-orange-500': fin.color === 'orange',
          'border-sky-400    hover:border-sky-500':    fin.color === 'sky',
          'border-slate-400  hover:border-slate-500':  fin.color === 'slate',
          'border-teal-500   hover:border-teal-600':   fin.color === 'teal',
        }">
        <div class="flex items-center justify-between mb-2">
          <span class="text-[10px] font-bold uppercase tracking-wider leading-tight"
            :class="{
              'text-green-700':  fin.color === 'green',
              'text-amber-600':  fin.color === 'amber',
              'text-blue-700':   fin.color === 'blue',
              'text-orange-600': fin.color === 'orange',
              'text-sky-600':    fin.color === 'sky',
              'text-slate-600':  fin.color === 'slate',
              'text-teal-700':   fin.color === 'teal',
            }">{{ fin.label }}</span>
          <div class="w-6 h-6 rounded-lg flex items-center justify-center"
            :class="{
              'bg-green-100':  fin.color === 'green',
              'bg-amber-100':  fin.color === 'amber',
              'bg-blue-100':   fin.color === 'blue',
              'bg-orange-100': fin.color === 'orange',
              'bg-sky-100':    fin.color === 'sky',
              'bg-slate-100':  fin.color === 'slate',
              'bg-teal-100':   fin.color === 'teal',
            }">
            <svg class="w-3 h-3" :class="{
              'text-green-600':  fin.color === 'green',
              'text-amber-600':  fin.color === 'amber',
              'text-blue-600':   fin.color === 'blue',
              'text-orange-500': fin.color === 'orange',
              'text-sky-500':    fin.color === 'sky',
              'text-slate-500':  fin.color === 'slate',
              'text-teal-600':   fin.color === 'teal',
            }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="fin.icon"/>
            </svg>
          </div>
        </div>
        <div class="text-xl font-bold text-gray-900 leading-tight">{{ formatCompact(fin.amount) }}</div>
        <div class="text-[10px] text-gray-400 mt-0.5">{{ fin.sub }}</div>
      </div>
    </div>

    <!-- ── Base PO Summary (collapsible) ── -->
    <div v-if="basePOItems.length > 0 || basePOByScope.length > 0" class="bg-white rounded-xl border border-amber-100 overflow-hidden">
      <!-- Clickable header — collapsed by default -->
      <div @click="basePOOpen = !basePOOpen"
        class="flex items-center justify-between px-5 py-4 cursor-pointer select-none transition"
        :class="basePOOpen ? 'bg-amber-50/40 border-b border-amber-100' : 'hover:bg-amber-50/40'">
        <!-- Left: icon + title -->
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <div>
            <h3 class="text-sm font-semibold text-gray-700">Base PO Summary</h3>
            <p class="text-xs text-gray-400">Site Survey · WOP · C&amp;I · SAT&amp;SIT · Snag Closure — tracked separately from VOs</p>
          </div>
        </div>
        <!-- Right: summary pills + chevron -->
        <div class="flex items-center gap-2 flex-wrap justify-end">
          <div class="flex flex-col items-end px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-lg">
            <span class="text-sm font-bold text-amber-700">{{ formatCompact(basePOTotals.total) }}</span>
            <span class="text-[10px] text-amber-400 uppercase tracking-wider">Total Amount</span>
          </div>
          <div class="flex flex-col items-end px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-lg">
            <span class="text-sm font-bold text-amber-700">{{ formatCompact(basePOTotals.havePO) }}</span>
            <span class="text-[10px] text-amber-400 uppercase tracking-wider">Has PO</span>
          </div>
          <div class="flex flex-col items-end px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg">
            <span class="text-sm font-bold text-gray-500">{{ formatCompact(basePOTotals.noPO) }}</span>
            <span class="text-[10px] text-gray-400 uppercase tracking-wider">No PO</span>
          </div>
          <div class="flex flex-col items-end px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg">
            <span class="text-sm font-bold text-gray-700">{{ basePOTotals.count }}</span>
            <span class="text-[10px] text-gray-400 uppercase tracking-wider">Items</span>
          </div>
          <!-- Chevron -->
          <svg class="w-4 h-4 text-gray-400 transition-transform ml-1 shrink-0"
            :class="basePOOpen ? 'rotate-180' : ''"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </div>

      <!-- Collapsible body -->
      <div v-show="basePOOpen" class="p-5">
        <!-- Per-scope breakdown -->
        <div class="rounded-xl border border-gray-200 overflow-hidden">
          <table class="min-w-full text-xs">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-4 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wider">Scope</th>
                <th class="px-4 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th class="px-4 py-2.5 text-center font-semibold text-gray-400 uppercase tracking-wider">Items</th>
                <th class="px-4 py-2.5 text-right font-semibold text-amber-600 uppercase tracking-wider">Has PO</th>
                <th class="px-4 py-2.5 text-right font-semibold text-gray-400 uppercase tracking-wider">No PO</th>
                <th class="px-4 py-2.5 text-right font-semibold text-gray-600 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <template v-for="row in basePOByScope" :key="row.scope">
                <tr v-for="(cat, ci) in row.categories" :key="cat.category" class="hover:bg-amber-50/30 transition">
                  <td v-if="ci === 0" :rowspan="row.categories.length"
                    class="px-4 py-2.5 font-semibold text-gray-700 align-top border-r border-gray-100">
                    {{ row.scope }}
                  </td>
                  <td class="px-4 py-2.5 text-gray-600">{{ cat.category }}</td>
                  <td class="px-4 py-2.5 text-center text-gray-400">{{ cat.count }}</td>
                  <td class="px-4 py-2.5 text-right font-semibold text-amber-700">{{ cat.havePOAmount ? formatCompact(cat.havePOAmount) : '—' }}</td>
                  <td class="px-4 py-2.5 text-right text-gray-400">{{ cat.noPOAmount ? formatCompact(cat.noPOAmount) : '—' }}</td>
                  <td class="px-4 py-2.5 text-right font-semibold text-gray-800">{{ formatCompact(cat.amount) }}</td>
                </tr>
                <tr class="bg-amber-50/60 border-t border-amber-100">
                  <td class="px-4 py-2 font-semibold text-gray-500 uppercase text-[10px] tracking-wider">Scope Total</td>
                  <td class="px-4 py-2 text-center text-gray-500 font-semibold text-[10px]">{{ row.count }}</td>
                  <td class="px-4 py-2 text-right font-bold text-amber-700">{{ formatCompact(row.havePO) }}</td>
                  <td class="px-4 py-2 text-right text-gray-400">{{ formatCompact(row.noPO) }}</td>
                  <td class="px-4 py-2 text-right font-bold text-gray-800">{{ formatCompact(row.total) }}</td>
                </tr>
              </template>
            </tbody>
            <tfoot class="border-t-2 border-gray-200 bg-gray-50">
              <tr>
                <td colspan="2" class="px-4 py-2.5 font-bold text-gray-600 uppercase text-xs">Grand Total</td>
                <td class="px-4 py-2.5 text-center font-bold text-gray-700">{{ basePOTotals.count }}</td>
                <td class="px-4 py-2.5 text-right font-bold text-amber-700">{{ formatCompact(basePOTotals.havePO) }}</td>
                <td class="px-4 py-2.5 text-right text-gray-400">{{ formatCompact(basePOTotals.noPO) }}</td>
                <td class="px-4 py-2.5 text-right font-bold text-gray-800">{{ formatCompact(basePOTotals.total) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>

    <!-- ── SAT&SIT Not Yet Invoiced by Site ── -->
    <div v-if="satSitNotYetInvoiced.totalCount > 0" class="bg-white rounded-xl border border-amber-200 overflow-hidden">
      <!-- Clickable header -->
      <div @click="satSitOpen = !satSitOpen"
        class="flex items-center justify-between px-5 py-4 cursor-pointer select-none transition"
        :class="satSitOpen ? 'bg-amber-50/60 border-b border-amber-100' : 'hover:bg-amber-50/40'">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <h3 class="text-sm font-semibold text-gray-700">SAT&amp;SIT — Not Yet Invoiced by Site</h3>
            <p class="text-xs text-gray-400">Base PO · SAT&amp;SIT category · invoiceStatus ≠ SIT Completed — grouped by scope, sorted by Site ID</p>
          </div>
        </div>
        <div class="flex items-center gap-2 flex-wrap justify-end">
          <div class="flex flex-col items-end px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-lg">
            <span class="text-sm font-bold text-amber-700">{{ formatCompact(satSitNotYetInvoiced.totalAmount) }}</span>
            <span class="text-[10px] text-amber-400 uppercase tracking-wider">Total Amount</span>
          </div>
          <div class="flex flex-col items-end px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg">
            <span class="text-sm font-bold text-gray-700">{{ satSitNotYetInvoiced.totalCount }}</span>
            <span class="text-[10px] text-gray-400 uppercase tracking-wider">Sites</span>
          </div>
          <svg class="w-4 h-4 text-gray-400 transition-transform ml-1 shrink-0"
            :class="satSitOpen ? 'rotate-180' : ''"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </div>

      <!-- Collapsible body -->
      <div v-show="satSitOpen" class="divide-y divide-amber-50">
        <div v-for="group in satSitNotYetInvoiced.byScope" :key="group.scope">
          <!-- Scope header -->
          <div class="px-5 py-2 bg-amber-50/60 flex items-center justify-between">
            <span class="text-xs font-bold text-amber-700 uppercase tracking-wider">{{ group.scope }}</span>
            <div class="flex items-center gap-3">
              <span class="text-xs text-gray-500">{{ group.items.length }} site{{ group.items.length !== 1 ? 's' : '' }}</span>
              <span class="text-xs font-semibold text-amber-700">{{ formatCompact(group.total) }}</span>
            </div>
          </div>
          <!-- Site rows -->
          <table class="w-full text-xs">
            <thead class="bg-gray-50 border-b border-gray-100">
              <tr>
                <th class="px-4 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider w-20">Site ID</th>
                <th class="px-4 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider">Site Name</th>
                <th class="px-4 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider">Job No.</th>
                <th class="px-4 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                <th class="px-4 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider w-28">PO Number</th>
                <th class="px-4 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider w-36">Invoice Status</th>
                <th class="px-4 py-2 text-right font-semibold text-gray-500 uppercase tracking-wider w-28">Amount</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="vo in group.items" :key="vo.id" class="hover:bg-amber-50/30 transition">
                <td class="px-4 py-2.5">
                  <span class="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs font-semibold">{{ vo.siteId || '—' }}</span>
                </td>
                <td class="px-4 py-2.5 text-gray-700 font-medium truncate max-w-[140px]" :title="vo.siteName">{{ vo.siteName || '—' }}</td>
                <td class="px-4 py-2.5 font-mono text-gray-400">{{ vo.jobNumber || '—' }}</td>
                <td class="px-4 py-2.5 text-gray-600 truncate max-w-[200px]" :title="vo.voDescription">{{ vo.voDescription || '—' }}</td>
                <td class="px-4 py-2.5">
                  <span v-if="vo.poNumber" class="font-mono text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">{{ vo.poNumber }}</span>
                  <span v-else class="text-gray-300">—</span>
                </td>
                <td class="px-4 py-2.5">
                  <span v-if="vo.invoiceStatus" class="px-2 py-0.5 rounded-full font-semibold text-[10px]"
                    :class="vo.invoiceStatus === 'To Be Sent to Nokia' ? 'bg-indigo-100 text-indigo-700'
                      : vo.invoiceStatus === 'SIT Approved' ? 'bg-yellow-100 text-yellow-700'
                      : vo.invoiceStatus === 'Request to Nokia' ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-500'">
                    {{ vo.invoiceStatus }}
                  </span>
                  <span v-else class="text-gray-300">Not Set</span>
                </td>
                <td class="px-4 py-2.5 text-right font-semibold text-gray-800">{{ formatCompact(vo.voAmount || 0) }}</td>
              </tr>
            </tbody>
            <tfoot class="border-t border-amber-100 bg-amber-50/40">
              <tr>
                <td colspan="6" class="px-4 py-1.5 text-right text-xs font-bold text-amber-600 uppercase tracking-wider">Scope Total</td>
                <td class="px-4 py-1.5 text-right text-xs font-bold text-amber-700">{{ formatCompact(group.total) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <!-- Grand total footer -->
        <div class="px-5 py-3 bg-amber-50 border-t border-amber-200 flex items-center justify-between">
          <span class="text-xs font-bold text-amber-700 uppercase tracking-wider">Grand Total</span>
          <span class="text-sm font-bold text-amber-800">{{ formatCompact(satSitNotYetInvoiced.totalAmount) }}</span>
        </div>
      </div>
    </div>

    <!-- ── Snag Closure & C&I Not Yet Invoiced by Site ── -->
    <div v-if="snagCiNotYetInvoiced.totalCount > 0" class="bg-white rounded-xl border border-amber-200 overflow-hidden">
      <div @click="snagCiOpen = !snagCiOpen"
        class="flex items-center justify-between px-5 py-4 cursor-pointer select-none transition"
        :class="snagCiOpen ? 'bg-amber-50/60 border-b border-amber-100' : 'hover:bg-amber-50/40'">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <h3 class="text-sm font-semibold text-gray-700">Snag Closure &amp; C&amp;I — Not Yet Invoiced by Site</h3>
            <p class="text-xs text-gray-400">Base PO · Snag Closure &amp; C&amp;I combined · grouped by scope, sorted by Site ID</p>
          </div>
        </div>
        <div class="flex items-center gap-2 flex-wrap justify-end">
          <div class="flex flex-col items-end px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-lg">
            <span class="text-sm font-bold text-amber-700">{{ formatCompact(snagCiNotYetInvoiced.totalAmount) }}</span>
            <span class="text-[10px] text-amber-400 uppercase tracking-wider">Total Amount</span>
          </div>
          <div class="flex flex-col items-end px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg">
            <span class="text-sm font-bold text-gray-700">{{ snagCiNotYetInvoiced.totalCount }}</span>
            <span class="text-[10px] text-gray-400 uppercase tracking-wider">Items</span>
          </div>
          <svg class="w-4 h-4 text-gray-400 transition-transform ml-1 shrink-0"
            :class="snagCiOpen ? 'rotate-180' : ''"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </div>

      <div v-show="snagCiOpen" class="divide-y divide-amber-50">
        <div v-for="group in snagCiNotYetInvoiced.byScope" :key="group.scope">
          <div class="px-5 py-2 bg-amber-50/60 flex items-center justify-between">
            <span class="text-xs font-bold text-amber-700 uppercase tracking-wider">{{ group.scope }}</span>
            <div class="flex items-center gap-3">
              <span class="text-xs text-gray-500">{{ group.items.length }} item{{ group.items.length !== 1 ? 's' : '' }}</span>
              <span class="text-xs font-semibold text-amber-700">{{ formatCompact(group.total) }}</span>
            </div>
          </div>
          <table class="w-full text-xs">
            <thead class="bg-gray-50 border-b border-gray-100">
              <tr>
                <th class="px-4 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider w-20">Site ID</th>
                <th class="px-4 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider">Site Name</th>
                <th class="px-4 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider">Job No.</th>
                <th class="px-4 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th class="px-4 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                <th class="px-4 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider w-28">PO Number</th>
                <th class="px-4 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider w-36">Invoice Status</th>
                <th class="px-4 py-2 text-right font-semibold text-gray-500 uppercase tracking-wider w-28">Amount</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="vo in group.items" :key="vo.id" class="hover:bg-amber-50/30 transition">
                <td class="px-4 py-2.5">
                  <span class="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs font-semibold">{{ vo.siteId || '—' }}</span>
                </td>
                <td class="px-4 py-2.5 text-gray-700 font-medium truncate max-w-[140px]" :title="vo.siteName">{{ vo.siteName || '—' }}</td>
                <td class="px-4 py-2.5 font-mono text-gray-400">{{ vo.jobNumber || '—' }}</td>
                <td class="px-4 py-2.5">
                  <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-700">{{ vo.voCategory }}</span>
                </td>
                <td class="px-4 py-2.5 text-gray-600 truncate max-w-[200px]" :title="vo.voDescription">{{ vo.voDescription || '—' }}</td>
                <td class="px-4 py-2.5">
                  <span v-if="vo.poNumber" class="font-mono text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">{{ vo.poNumber }}</span>
                  <span v-else class="text-gray-300">—</span>
                </td>
                <td class="px-4 py-2.5">
                  <span v-if="vo.invoiceStatus" class="px-2 py-0.5 rounded-full font-semibold text-[10px]"
                    :class="vo.invoiceStatus === 'To Be Sent to Nokia' ? 'bg-indigo-100 text-indigo-700'
                      : vo.invoiceStatus === 'SIT Approved' ? 'bg-yellow-100 text-yellow-700'
                      : vo.invoiceStatus === 'Request to Nokia' ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-500'">
                    {{ vo.invoiceStatus }}
                  </span>
                  <span v-else class="text-gray-300">Not Set</span>
                </td>
                <td class="px-4 py-2.5 text-right font-semibold text-gray-800">{{ formatCompact(vo.voAmount || 0) }}</td>
              </tr>
            </tbody>
            <tfoot class="border-t border-amber-100 bg-amber-50/40">
              <tr>
                <td colspan="7" class="px-4 py-1.5 text-right text-xs font-bold text-amber-600 uppercase tracking-wider">Scope Total</td>
                <td class="px-4 py-1.5 text-right text-xs font-bold text-amber-700">{{ formatCompact(group.total) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div class="px-5 py-3 bg-amber-50 border-t border-amber-200 flex items-center justify-between">
          <span class="text-xs font-bold text-amber-700 uppercase tracking-wider">Grand Total</span>
          <span class="text-sm font-bold text-amber-800">{{ formatCompact(snagCiNotYetInvoiced.totalAmount) }}</span>
        </div>
      </div>
    </div>

    <!-- ── Invoice Prep summary banner ── -->
    <div v-if="invoicePrepSummary.count > 0"
      class="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <div>
          <p class="text-sm font-semibold text-blue-800">Invoice Prep List</p>
          <p class="text-xs text-blue-500 mt-0.5">{{ invoicePrepSummary.count }} variation orders ready for invoicing</p>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <div class="text-right">
          <p class="text-xs text-blue-500 font-medium">Total Amount</p>
          <p class="text-xl font-bold text-blue-800">{{ formatCompact(invoicePrepSummary.total) }}</p>
        </div>
      </div>
    </div>

    <!-- ── Row 3: Charts ── -->
    <div class="grid grid-cols-5 gap-4">

      <!-- Doughnut: Status distribution -->
      <div class="col-span-2 bg-white rounded-xl border border-blue-100 p-5">
        <div class="mb-4">
          <h3 class="text-sm font-semibold text-gray-700">Status Distribution</h3>
          <p class="text-xs text-gray-400">VO count by status</p>
        </div>
        <div v-if="totalVOs > 0" class="flex items-center gap-4">
          <div class="w-36 h-36 shrink-0">
            <Doughnut :data="statusDoughnutData" :options="doughnutOptions" />
          </div>
          <div class="flex-1 space-y-2">
            <div v-for="s in statusCards" :key="s.label" class="flex items-center justify-between">
              <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full shrink-0" :class="{
                  'bg-gray-600':  s.color === 'gray',
                  'bg-blue-600':  s.color === 'blue',
                  'bg-amber-500': s.color === 'amber',
                  'bg-green-600': s.color === 'green',
                  'bg-red-500':   s.color === 'red',
                }"></span>
                <span class="text-xs text-gray-600">{{ s.label }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-semibold text-gray-800">{{ s.count }}</span>
                <span class="text-xs text-gray-400 w-8 text-right">{{ totalVOs ? Math.round(s.count/totalVOs*100) : 0 }}%</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="flex items-center justify-center h-36 text-gray-400 text-sm">No data yet</div>
      </div>

      <!-- Bar: Amount by status -->
      <div class="col-span-3 bg-white rounded-xl border border-blue-100 p-5">
        <div class="mb-4">
          <h3 class="text-sm font-semibold text-gray-700">VO Amount by Status</h3>
          <p class="text-xs text-gray-400">Total value per status group</p>
        </div>
        <div v-if="totalVOs > 0" class="h-44">
          <Bar :data="amountBarData" :options="amountBarOptions" />
        </div>
        <div v-else class="flex items-center justify-center h-44 text-gray-400 text-sm">No data yet</div>
      </div>
    </div>

    <!-- ── Row 4+5: Combined PO & Invoice Summary by Scope (collapsible) ── -->
    <div class="bg-white rounded-xl border border-blue-100 overflow-hidden">
      <!-- Clickable header — collapsed by default -->
      <div @click="poInvoiceOpen = !poInvoiceOpen"
        class="flex items-center justify-between px-5 py-4 cursor-pointer select-none transition"
        :class="poInvoiceOpen ? 'bg-blue-50/40 border-b border-blue-100' : 'hover:bg-blue-50/40'">
        <div>
          <h3 class="text-sm font-semibold text-gray-700">PO &amp; Invoice Summary by Scope</h3>
          <p class="text-xs text-gray-400">Have PO breakdown (VO · BOQ · Base PO), outstanding PO, and invoice progress per scope</p>
        </div>
        <!-- Site status filter toggle + month filter -->
        <div class="flex items-center gap-2 mx-2 shrink-0" @click.stop>
          <div class="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
            <button @click="poInvoiceSiteFilter = 'all'"
              class="px-3 py-1 rounded-lg text-xs font-semibold transition"
              :class="poInvoiceSiteFilter === 'all' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:bg-gray-100'">
              All Sites
            </button>
            <button @click="poInvoiceSiteFilter = 'started'"
              class="px-3 py-1 rounded-lg text-xs font-semibold transition"
              :class="poInvoiceSiteFilter === 'started' ? 'bg-emerald-600 text-white' : 'text-gray-500 hover:bg-gray-100'">
              Started
            </button>
            <button @click="poInvoiceSiteFilter = 'not-started'"
              class="px-3 py-1 rounded-lg text-xs font-semibold transition"
              :class="poInvoiceSiteFilter === 'not-started' ? 'bg-amber-500 text-white' : 'text-gray-500 hover:bg-gray-100'">
              Not Started
            </button>
          </div>
          <!-- Month filter for Cost to Complete -->
          <div class="relative inline-flex items-center">
            <svg class="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none"
              :class="ctcMonth ? 'text-emerald-500' : 'text-gray-400'"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <select v-model="ctcMonth"
              class="pl-6 pr-6 py-1.5 text-[10px] font-semibold border rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-400 transition"
              :class="ctcMonth ? 'text-emerald-700 border-emerald-400 bg-emerald-100' : 'text-gray-500 border-gray-300 bg-white'">
              <option value="">All Months</option>
              <option v-for="m in ctcAllMonths" :key="m.value" :value="m.value">{{ m.label }}</option>
            </select>
            <svg class="w-3 h-3 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
        </div>
        <!-- Summary pills -->
        <div class="flex items-center gap-2 flex-wrap justify-end">
          <div class="flex flex-col items-end px-3 py-1.5 bg-teal-50 border border-teal-100 rounded-lg">
            <span class="text-sm font-bold text-teal-700">{{ formatCompact(poInvoiceSummary.reduce((s,r)=>s+r.totalHavePO,0)) }}</span>
            <span class="text-[10px] text-teal-400 uppercase tracking-wider">Total Have PO</span>
          </div>
          <div class="flex flex-col items-end px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg">
            <span class="text-sm font-bold text-gray-500">{{ formatCompact(poInvoiceSummary.reduce((s,r)=>s+r.totalNoPO,0)) }}</span>
            <span class="text-[10px] text-gray-400 uppercase tracking-wider">No PO</span>
          </div>
          <div class="flex flex-col items-end px-3 py-1.5 bg-green-50 border border-green-100 rounded-lg">
            <span class="text-sm font-bold text-green-700">{{ formatCompact(poInvoiceSummary.reduce((s,r)=>s+r.invoiced,0)) }}</span>
            <span class="text-[10px] text-green-400 uppercase tracking-wider">Invoiced</span>
          </div>
          <div class="flex flex-col items-end px-3 py-1.5 bg-orange-50 border border-orange-100 rounded-lg">
            <span class="text-sm font-bold text-orange-600">{{ formatCompact(poInvoiceSummary.reduce((s,r)=>s+r.notYetInvoiced,0)) }}</span>
            <span class="text-[10px] text-orange-400 uppercase tracking-wider">Not Yet Inv.</span>
          </div>
          <div class="flex flex-col items-end px-3 py-1.5 bg-violet-50 border border-violet-100 rounded-lg">
            <span class="text-sm font-bold text-violet-700">{{ formatCompact(poInvoiceSummary.reduce((s,r)=>s+r.labourCost,0)) }}</span>
            <span class="text-[10px] text-violet-400 uppercase tracking-wider">Labour Cost</span>
          </div>
          <div class="flex flex-col items-end px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg">
            <span class="text-sm font-bold text-blue-700">{{ formatCompact(poInvoiceSummary.reduce((s,r)=>s+r.thirdPartyCost,0)) }}</span>
            <span class="text-[10px] text-blue-400 uppercase tracking-wider">3rd Party</span>
          </div>
          <div class="flex flex-col items-end px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg">
            <span class="text-sm font-bold text-gray-700">{{ formatCompact(poInvoiceSummary.reduce((s,r)=>s+r.totalCost,0)) }}</span>
            <span class="text-[10px] text-gray-400 uppercase tracking-wider">Total Cost</span>
          </div>
          <!-- Cost to Complete pill -->
          <div class="flex flex-col items-end px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
            <span class="text-sm font-bold text-emerald-700">
              {{ formatCompact(Object.values(costToCompleteByScope).reduce((s,v)=>s+v,0)) || '—' }}
            </span>
            <span class="text-[10px] text-emerald-400 uppercase tracking-wider">Cost to Complete</span>
          </div>
          <!-- Chevron -->
          <svg class="w-4 h-4 text-gray-400 transition-transform ml-1 shrink-0"
            :class="poInvoiceOpen ? 'rotate-180' : ''"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </div>
      <!-- Collapsible body -->
      <div v-show="poInvoiceOpen" class="p-5">
        <div v-if="poInvoiceSummary.length > 0" class="overflow-x-auto">
        <table class="w-full text-xs border-collapse">
          <!-- Grouped column headers -->
          <thead>
            <tr>
              <th rowspan="2" class="pb-3 text-left font-semibold text-gray-500 uppercase tracking-wider pr-4 w-20 align-bottom sticky left-0 z-20 bg-white" style="box-shadow: 2px 0 4px -2px rgba(0,0,0,0.08)">Scope</th>
              <!-- Have PO group -->
              <th colspan="4" class="pb-1 text-center font-semibold text-teal-600 uppercase tracking-wider border-b border-teal-200 px-1">
                Have PO
              </th>
              <!-- No PO group -->
              <th colspan="4" class="pb-1 text-center font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-200 px-1">
                No PO
              </th>
              <!-- Grand Total -->
              <th rowspan="2" class="pb-3 text-right font-semibold text-gray-600 uppercase tracking-wider px-3 align-bottom">Total</th>
              <!-- Invoice group: Invoiced + 5 Not Yet Inv. sub-cols + Total Service Not Inv. + Total 3rd Party Not Inv. + Inv. Progress = 9 -->
              <th colspan="9" class="pb-1 text-center font-semibold text-blue-600 uppercase tracking-wider border-b border-blue-100 px-1">
                Invoice
              </th>
              <!-- Cost group -->
              <th colspan="3" class="pb-1 text-center font-semibold text-violet-600 uppercase tracking-wider border-b border-violet-200 px-1">
                Cost to Date
              </th>
              <!-- Cost to Complete group header -->
              <th class="pb-1 text-right font-semibold text-emerald-600 uppercase tracking-wider border-b border-emerald-200 px-3 whitespace-nowrap border-l border-l-emerald-100">
                Cost to Complete
              </th>
            </tr>
            <tr class="border-b-2 border-gray-100">
              <!-- Have PO sub-cols -->
              <th class="pt-1 pb-2 text-right font-semibold text-blue-500 px-2 whitespace-nowrap">VO</th>
              <th class="pt-1 pb-2 text-right font-semibold text-emerald-600 px-2 whitespace-nowrap">BOQ</th>
              <th class="pt-1 pb-2 text-right font-semibold text-amber-600 px-2 whitespace-nowrap">Base PO</th>
              <th class="pt-1 pb-2 text-right font-bold text-teal-700 px-2 whitespace-nowrap">Total</th>
              <!-- No PO sub-cols -->
              <th class="pt-1 pb-2 text-right font-semibold text-blue-300 px-2 whitespace-nowrap">VO</th>
              <th class="pt-1 pb-2 text-right font-semibold text-emerald-300 px-2 whitespace-nowrap">BOQ</th>
              <th class="pt-1 pb-2 text-right font-semibold text-amber-300 px-2 whitespace-nowrap">Base PO</th>
              <th class="pt-1 pb-2 text-right font-bold text-gray-500 px-2 whitespace-nowrap">Total</th>
              <!-- Invoice sub-cols -->
              <th class="pt-1 pb-2 text-right font-semibold text-green-600 px-2 whitespace-nowrap">Invoiced</th>
              <!-- Not Yet Inv. breakdown: 3rd Party / BOQ 3rd / Service / BOQ Svc / Base / Total -->
              <th class="pt-1 pb-2 text-right font-semibold text-orange-400 px-2 whitespace-nowrap">Not Inv. 3rd Party</th>
              <th class="pt-1 pb-2 text-right font-semibold text-orange-400 px-2 whitespace-nowrap">Not Inv. BOQ 3rd</th>
              <th class="pt-1 pb-2 text-right font-semibold text-orange-400 px-2 whitespace-nowrap">Not Inv. Service</th>
              <th class="pt-1 pb-2 text-right font-semibold text-orange-400 px-2 whitespace-nowrap">Not Inv. BOQ Svc</th>
              <th class="pt-1 pb-2 text-right font-semibold text-orange-400 px-2 whitespace-nowrap">Not Inv. Base</th>
              <th class="pt-1 pb-2 text-right font-bold text-orange-600 px-2 whitespace-nowrap">Total Service Not Inv.</th>
              <th class="pt-1 pb-2 text-right font-bold text-orange-600 px-2 whitespace-nowrap">Total 3rd Party Not Inv.</th>
              <th class="pt-1 pb-2 text-left font-semibold text-gray-400 px-2 w-28 whitespace-nowrap">Inv. Progress</th>
              <!-- Cost sub-cols -->
              <th class="pt-1 pb-2 text-right font-semibold text-violet-600 px-2 whitespace-nowrap">Labour</th>
              <th class="pt-1 pb-2 text-right font-semibold text-blue-500 px-2 whitespace-nowrap">3rd Party</th>
              <th class="pt-1 pb-2 text-right font-bold text-gray-600 px-2 whitespace-nowrap">Total Cost</th>
              <!-- Cost to Complete sub-header -->
              <th class="pt-1 pb-2 px-3 text-right font-semibold text-emerald-600 border-l border-emerald-100 whitespace-nowrap">
                <span v-if="ctcMonth" class="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">
                  {{ ctcAllMonths.find(m => m.value === ctcMonth)?.label || ctcMonth }}
                </span>
                <span v-else class="text-[10px] text-emerald-400">All Months</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="row in poInvoiceSummary" :key="row.scope" class="hover:bg-blue-50/30 transition">
              <td class="py-2.5 pr-4 font-medium text-gray-700 truncate max-w-[80px] sticky left-0 z-10 bg-white" style="box-shadow: 2px 0 4px -2px rgba(0,0,0,0.08)" :title="row.scope">{{ row.scope }}</td>
              <!-- Have PO breakdown -->
              <td class="py-2.5 text-right text-blue-600 px-2">{{ row.voPO ? formatCompact(row.voPO) : '—' }}</td>
              <td class="py-2.5 text-right text-emerald-600 px-2">{{ row.boqPO ? formatCompact(row.boqPO) : '—' }}</td>
              <td class="py-2.5 text-right text-amber-600 px-2">{{ row.basePOAmt ? formatCompact(row.basePOAmt) : '—' }}</td>
              <td class="py-2.5 text-right font-bold text-teal-700 px-2 bg-teal-50/40">{{ row.totalHavePO ? formatCompact(row.totalHavePO) : '—' }}</td>
              <!-- No PO breakdown — clickable -->
              <td class="py-2.5 text-right px-2 transition"
                :class="row.voNoPO > 0 ? 'text-blue-400 font-semibold cursor-pointer hover:text-blue-600 underline decoration-dotted' : 'text-gray-300'"
                @click="row.voNoPO > 0 && openNoPODetail(row, 'vo')"
                :title="row.voNoPO > 0 ? 'Click to view VO detail' : ''">
                {{ row.voNoPO ? formatCompact(row.voNoPO) : '—' }}
              </td>
              <td class="py-2.5 text-right px-2 transition"
                :class="row.boqNoPO > 0 ? 'text-emerald-400 font-semibold cursor-pointer hover:text-emerald-600 underline decoration-dotted' : 'text-gray-300'"
                @click="row.boqNoPO > 0 && openNoPODetail(row, 'boq')"
                :title="row.boqNoPO > 0 ? 'Click to view BOQ detail' : ''">
                {{ row.boqNoPO ? formatCompact(row.boqNoPO) : '—' }}
              </td>
              <td class="py-2.5 text-right px-2 transition"
                :class="row.baseNoPO > 0 ? 'text-amber-400 font-semibold cursor-pointer hover:text-amber-600 underline decoration-dotted' : 'text-gray-300'"
                @click="row.baseNoPO > 0 && openNoPODetail(row, 'basePO')"
                :title="row.baseNoPO > 0 ? 'Click to view Base PO detail' : ''">
                {{ row.baseNoPO ? formatCompact(row.baseNoPO) : '—' }}
              </td>
              <td class="py-2.5 text-right font-bold text-gray-500 px-2 bg-gray-50">{{ row.totalNoPO ? formatCompact(row.totalNoPO) : '—' }}</td>
              <!-- Grand Total -->
              <td class="py-2.5 text-right font-semibold text-gray-800 px-3">{{ formatCompact(row.total) }}</td>
              <!-- Invoice: Invoiced total -->
              <td class="py-2.5 text-right font-semibold text-green-700 px-2">{{ row.invoiced ? formatCompact(row.invoiced) : '—' }}</td>
              <!-- Not Yet Invoiced breakdown: 3rd Party / BOQ 3rd / Service / BOQ Svc / Base / Total -->
              <td class="py-2.5 text-right px-2 transition"
                :class="row.vo3rdPartyNotYetInv > 0 ? 'text-orange-500 font-semibold cursor-pointer hover:text-orange-700 underline decoration-dotted' : 'text-gray-300'"
                @click="row.vo3rdPartyNotYetInv > 0 && openNotYetInvDetail(row, '3rdParty')"
                :title="row.vo3rdPartyNotYetInv > 0 ? 'Click to view 3rd Party VO detail' : ''">
                {{ row.vo3rdPartyNotYetInv > 0 ? formatCompact(row.vo3rdPartyNotYetInv) : '—' }}
              </td>
              <td class="py-2.5 text-right px-2 transition"
                :class="row.boq3rdPartyNotYetInv > 0 ? 'text-orange-500 font-semibold cursor-pointer hover:text-orange-700 underline decoration-dotted' : 'text-gray-300'"
                @click="row.boq3rdPartyNotYetInv > 0 && openNotYetInvDetail(row, 'boq3rdParty')"
                :title="row.boq3rdPartyNotYetInv > 0 ? 'Click to view BOQ 3rd Party detail' : ''">
                {{ row.boq3rdPartyNotYetInv > 0 ? formatCompact(row.boq3rdPartyNotYetInv) : '—' }}
              </td>
              <td class="py-2.5 text-right px-2 transition"
                :class="row.voServiceNotYetInv > 0 ? 'text-orange-500 font-semibold cursor-pointer hover:text-orange-700 underline decoration-dotted' : 'text-gray-300'"
                @click="row.voServiceNotYetInv > 0 && openNotYetInvDetail(row, 'service')"
                :title="row.voServiceNotYetInv > 0 ? 'Click to view Service VO detail' : ''">
                {{ row.voServiceNotYetInv > 0 ? formatCompact(row.voServiceNotYetInv) : '—' }}
              </td>
              <td class="py-2.5 text-right px-2 transition"
                :class="row.boqServiceNotYetInv > 0 ? 'text-orange-500 font-semibold cursor-pointer hover:text-orange-700 underline decoration-dotted' : 'text-gray-300'"
                @click="row.boqServiceNotYetInv > 0 && openNotYetInvDetail(row, 'boqService')"
                :title="row.boqServiceNotYetInv > 0 ? 'Click to view BOQ Service detail' : ''">
                {{ row.boqServiceNotYetInv > 0 ? formatCompact(row.boqServiceNotYetInv) : '—' }}
              </td>
              <td class="py-2.5 text-right px-2 transition"
                :class="row.baseNotYetInv > 0 ? 'text-orange-500 font-semibold cursor-pointer hover:text-orange-700 underline decoration-dotted' : 'text-gray-300'"
                @click="row.baseNotYetInv > 0 && openNotYetInvDetail(row, 'basePO')"
                :title="row.baseNotYetInv > 0 ? 'Click to view Base PO detail' : ''">
                {{ row.baseNotYetInv > 0 ? formatCompact(row.baseNotYetInv) : '—' }}
              </td>
              <td class="py-2.5 text-right font-bold px-2 whitespace-nowrap"
                :class="row.totalNotYetInv > 0 ? 'text-orange-600' : 'text-gray-300'">
                {{ row.totalNotYetInv > 0 ? formatCompact(row.totalNotYetInv) : '—' }}
              </td>
              <td class="py-2.5 text-right font-bold px-2 whitespace-nowrap"
                :class="(row.vo3rdPartyNotYetInv + row.boq3rdPartyNotYetInv) > 0 ? 'text-orange-600' : 'text-gray-300'">
                {{ (row.vo3rdPartyNotYetInv + row.boq3rdPartyNotYetInv) > 0 ? formatCompact(row.vo3rdPartyNotYetInv + row.boq3rdPartyNotYetInv) : '—' }}
              </td>
              <!-- Progress bar -->
              <td class="py-2.5 px-2">
                <div class="flex items-center gap-1.5">
                  <div class="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden min-w-[56px]">
                    <div class="h-full rounded-full bg-green-400 transition-all"
                      :style="{ width: row.totalHavePO > 0 ? Math.min(100,(row.invoiced/row.totalHavePO*100)).toFixed(0)+'%' : '0%' }">
                    </div>
                  </div>
                  <span class="text-[10px] text-gray-400 w-7 text-right shrink-0">
                    {{ row.totalHavePO > 0 ? (row.invoiced/row.totalHavePO*100).toFixed(0)+'%' : '—' }}
                  </span>
                </div>
              </td>
              <!-- Cost to Date -->
              <td class="py-2.5 text-right font-semibold text-violet-700 px-2 whitespace-nowrap">{{ row.labourCost ? formatCompact(row.labourCost) : '—' }}</td>
              <td class="py-2.5 text-right font-semibold text-blue-600 px-2 whitespace-nowrap">{{ row.thirdPartyCost ? formatCompact(row.thirdPartyCost) : '—' }}</td>
              <td class="py-2.5 text-right font-bold text-gray-800 px-2 whitespace-nowrap">{{ row.totalCost ? formatCompact(row.totalCost) : '—' }}</td>
              <!-- Cost to Complete -->
              <td class="py-2.5 text-right font-bold px-2 whitespace-nowrap border-l border-emerald-100"
                :class="costToCompleteByScope[row.scope] ? 'text-emerald-700' : 'text-gray-300'">
                {{ costToCompleteByScope[row.scope] ? formatCompact(costToCompleteByScope[row.scope]) : '—' }}
              </td>
            </tr>
          </tbody>
          <tfoot class="border-t-2 border-blue-100">
            <tr class="font-semibold">
              <td class="pt-2.5 pb-1 text-gray-600 uppercase text-[10px] tracking-wider pr-4 sticky left-0 z-10 bg-white" style="box-shadow: 2px 0 4px -2px rgba(0,0,0,0.08)">Total</td>
              <!-- Have PO totals -->
              <td class="pt-2.5 text-right text-blue-600 px-2">{{ formatCompact(poInvoiceSummary.reduce((s,r)=>s+r.voPO,0)) }}</td>
              <td class="pt-2.5 text-right text-emerald-600 px-2">{{ formatCompact(poInvoiceSummary.reduce((s,r)=>s+r.boqPO,0)) }}</td>
              <td class="pt-2.5 text-right text-amber-600 px-2">{{ formatCompact(poInvoiceSummary.reduce((s,r)=>s+r.basePOAmt,0)) }}</td>
              <td class="pt-2.5 text-right font-bold text-teal-700 px-2 bg-teal-50/40">{{ formatCompact(poInvoiceSummary.reduce((s,r)=>s+r.totalHavePO,0)) }}</td>
              <!-- No PO totals -->
              <td class="pt-2.5 text-right text-blue-300 px-2">{{ formatCompact(poInvoiceSummary.reduce((s,r)=>s+r.voNoPO,0)) }}</td>
              <td class="pt-2.5 text-right text-emerald-300 px-2">{{ formatCompact(poInvoiceSummary.reduce((s,r)=>s+r.boqNoPO,0)) }}</td>
              <td class="pt-2.5 text-right text-amber-300 px-2">{{ formatCompact(poInvoiceSummary.reduce((s,r)=>s+r.baseNoPO,0)) }}</td>
              <td class="pt-2.5 text-right font-bold text-gray-500 px-2 bg-gray-50">{{ formatCompact(poInvoiceSummary.reduce((s,r)=>s+r.totalNoPO,0)) }}</td>
              <!-- Grand Total -->
              <td class="pt-2.5 text-right font-bold text-gray-800 px-3">{{ formatCompact(poInvoiceSummary.reduce((s,r)=>s+r.total,0)) }}</td>
              <!-- Invoice totals -->
              <td class="pt-2.5 text-right font-bold text-green-700 px-2">{{ formatCompact(poInvoiceSummary.reduce((s,r)=>s+r.invoiced,0)) }}</td>
              <td class="pt-2.5 text-right text-orange-500 px-2">{{ formatCompact(poInvoiceSummary.reduce((s,r)=>s+r.vo3rdPartyNotYetInv,0)) }}</td>
              <td class="pt-2.5 text-right text-orange-500 px-2">{{ formatCompact(poInvoiceSummary.reduce((s,r)=>s+r.boq3rdPartyNotYetInv,0)) }}</td>
              <td class="pt-2.5 text-right text-orange-500 px-2">{{ formatCompact(poInvoiceSummary.reduce((s,r)=>s+r.voServiceNotYetInv,0)) }}</td>
              <td class="pt-2.5 text-right text-orange-500 px-2">{{ formatCompact(poInvoiceSummary.reduce((s,r)=>s+r.boqServiceNotYetInv,0)) }}</td>
              <td class="pt-2.5 text-right text-orange-500 px-2">{{ formatCompact(poInvoiceSummary.reduce((s,r)=>s+r.baseNotYetInv,0)) }}</td>
              <td class="pt-2.5 text-right font-bold text-orange-600 px-2">{{ formatCompact(poInvoiceSummary.reduce((s,r)=>s+r.totalNotYetInv,0)) }}</td>
              <td class="pt-2.5 text-right font-bold text-orange-600 px-2">{{ formatCompact(poInvoiceSummary.reduce((s,r)=>s+(r.vo3rdPartyNotYetInv+r.boq3rdPartyNotYetInv),0)) }}</td>
              <td class="pt-2.5 px-2">
                <div class="flex items-center gap-1.5">
                  <div class="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden min-w-[56px]">
                    <div class="h-full rounded-full bg-green-400 transition-all"
                      :style="{ width: poInvoiceSummary.reduce((s,r)=>s+r.totalHavePO,0) > 0 ? Math.min(100,(poInvoiceSummary.reduce((s,r)=>s+r.invoiced,0)/poInvoiceSummary.reduce((s,r)=>s+r.totalHavePO,0)*100)).toFixed(0)+'%' : '0%' }">
                    </div>
                  </div>
                  <span class="text-[10px] text-gray-400 w-7 text-right shrink-0">
                    {{ poInvoiceSummary.reduce((s,r)=>s+r.totalHavePO,0) > 0 ? (poInvoiceSummary.reduce((s,r)=>s+r.invoiced,0)/poInvoiceSummary.reduce((s,r)=>s+r.totalHavePO,0)*100).toFixed(0)+'%' : '—' }}
                  </span>
                </div>
              </td>
              <!-- Cost to Date totals -->
              <td class="pt-2.5 text-right font-bold text-violet-700 px-2">{{ formatCompact(poInvoiceSummary.reduce((s,r)=>s+r.labourCost,0)) }}</td>
              <td class="pt-2.5 text-right font-bold text-blue-600 px-2">{{ formatCompact(poInvoiceSummary.reduce((s,r)=>s+r.thirdPartyCost,0)) }}</td>
              <td class="pt-2.5 text-right font-bold text-gray-800 px-2">{{ formatCompact(poInvoiceSummary.reduce((s,r)=>s+r.totalCost,0)) }}</td>
              <!-- Cost to Complete total -->
              <td class="pt-2.5 text-right font-bold text-emerald-700 px-2 border-l border-emerald-100">
                {{ formatCompact(Object.values(costToCompleteByScope).reduce((s,v)=>s+v,0)) }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
        <div v-else class="flex items-center justify-center h-28 text-gray-400 text-sm">No data yet</div>
      </div>
    </div>

    <!-- ── Monthly Invoice Summary ── -->
    <div class="bg-white rounded-xl border border-blue-100 p-5">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-sm font-semibold text-gray-700">Monthly Invoiced Amount</h3>
          <p class="text-xs text-gray-400">SIT Completed invoices by invoice date</p>
        </div>
        <div v-if="monthlyInvoiceData.length > 0" class="flex items-center gap-6 text-right">
          <div>
            <div class="text-sm font-bold text-blue-700">{{ formatCompact(monthlyInvoiceData.reduce((s,r)=>s+r.voAmount,0)) }}</div>
            <div class="text-xs text-gray-400">{{ monthlyInvoiceData.reduce((s,r)=>s+r.voCount,0) }} VOs invoiced</div>
          </div>
          <div>
            <div class="text-sm font-bold text-amber-600">{{ formatCompact(monthlyInvoiceData.reduce((s,r)=>s+r.basePOAmount,0)) }}</div>
            <div class="text-xs text-gray-400">{{ monthlyInvoiceData.reduce((s,r)=>s+r.basePOCount,0) }} Base PO invoiced</div>
          </div>
          <div>
            <div class="text-sm font-bold text-emerald-600">{{ formatCompact(monthlyInvoiceData.reduce((s,r)=>s+r.boqAmount,0)) }}</div>
            <div class="text-xs text-gray-400">{{ monthlyInvoiceData.reduce((s,r)=>s+r.boqCount,0) }} BOQ invoiced</div>
          </div>
        </div>
      </div>

      <div v-if="monthlyInvoiceData.length > 0">
        <div class="h-56">
          <Line :data="monthlyInvoiceChartData" :options="monthlyInvoiceChartOptions" />
        </div>

        <!-- Monthly breakdown table -->
        <div class="mt-4 rounded-xl border border-gray-200 overflow-hidden">
          <table class="min-w-full text-xs">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-4 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wider">Month</th>
                <th class="px-4 py-2.5 text-right font-semibold text-blue-600 uppercase tracking-wider">VO Amount</th>
                <th class="px-4 py-2.5 text-right font-semibold text-blue-400 uppercase tracking-wider">VO Count</th>
                <th class="px-4 py-2.5 text-right font-semibold text-amber-600 uppercase tracking-wider">Base PO Amount</th>
                <th class="px-4 py-2.5 text-right font-semibold text-amber-400 uppercase tracking-wider">Base PO Count</th>
                <th class="px-4 py-2.5 text-right font-semibold text-emerald-600 uppercase tracking-wider">BOQ Amount</th>
                <th class="px-4 py-2.5 text-right font-semibold text-emerald-400 uppercase tracking-wider">BOQ Count</th>
                <th class="px-4 py-2.5 text-right font-semibold text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="row in monthlyInvoiceData" :key="row.key" class="hover:bg-blue-50/30">
                <td class="px-4 py-2.5 font-medium text-gray-700">{{ row.label }}</td>
                <td class="px-4 py-2.5 text-right font-semibold text-blue-700">{{ row.voAmount ? formatCompact(row.voAmount) : '—' }}</td>
                <td class="px-4 py-2.5 text-right text-blue-400">{{ row.voCount || '—' }}</td>
                <td class="px-4 py-2.5 text-right font-semibold text-amber-600">{{ row.basePOAmount ? formatCompact(row.basePOAmount) : '—' }}</td>
                <td class="px-4 py-2.5 text-right text-amber-400">{{ row.basePOCount || '—' }}</td>
                <td class="px-4 py-2.5 text-right font-semibold text-emerald-600">{{ row.boqAmount ? formatCompact(row.boqAmount) : '—' }}</td>
                <td class="px-4 py-2.5 text-right text-emerald-400">{{ row.boqCount || '—' }}</td>
                <td class="px-4 py-2.5 text-right font-semibold text-gray-800">{{ formatCompact(row.voAmount + row.basePOAmount + row.boqAmount) }}</td>
              </tr>
            </tbody>
            <tfoot class="border-t-2 border-gray-200 bg-gray-50">
              <tr>
                <td class="px-4 py-2.5 font-bold text-gray-600 uppercase text-xs">Total</td>
                <td class="px-4 py-2.5 text-right font-bold text-blue-700">{{ formatCompact(monthlyInvoiceData.reduce((s,r)=>s+r.voAmount,0)) }}</td>
                <td class="px-4 py-2.5 text-right font-bold text-blue-400">{{ monthlyInvoiceData.reduce((s,r)=>s+r.voCount,0) }}</td>
                <td class="px-4 py-2.5 text-right font-bold text-amber-600">{{ formatCompact(monthlyInvoiceData.reduce((s,r)=>s+r.basePOAmount,0)) }}</td>
                <td class="px-4 py-2.5 text-right font-bold text-amber-400">{{ monthlyInvoiceData.reduce((s,r)=>s+r.basePOCount,0) }}</td>
                <td class="px-4 py-2.5 text-right font-bold text-emerald-600">{{ formatCompact(monthlyInvoiceData.reduce((s,r)=>s+r.boqAmount,0)) }}</td>
                <td class="px-4 py-2.5 text-right font-bold text-emerald-400">{{ monthlyInvoiceData.reduce((s,r)=>s+r.boqCount,0) }}</td>
                <td class="px-4 py-2.5 text-right font-bold text-gray-800">{{ formatCompact(monthlyInvoiceData.reduce((s,r)=>s+r.voAmount+r.basePOAmount+r.boqAmount,0)) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div v-else class="flex flex-col items-center justify-center h-40 gap-2 text-gray-400">
        <svg class="w-8 h-8 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
        <p class="text-sm">No SIT Completed invoices yet</p>
        <p class="text-xs text-gray-300">Data will appear once VOs or Base PO items are marked as SIT Completed with an invoice date</p>
      </div>
    </div>

    <!-- ── Monthly Cost to Complete ── -->
    <div class="bg-white rounded-xl border border-emerald-100 p-5">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-sm font-semibold text-gray-700">Monthly Cost to Complete</h3>
          <p class="text-xs text-gray-400">Cost entries from Site Status view, grouped by entry date and site status</p>
        </div>
        <div v-if="monthlyCostToCompleteData.length > 0" class="flex items-center gap-6 text-right">
          <div>
            <div class="text-sm font-bold text-emerald-700">
              {{ formatCompact(monthlyCostToCompleteData.reduce((s,r)=>s+r.startedCost,0)) }}
            </div>
            <div class="text-xs text-gray-400">
              {{ monthlyCostToCompleteData.reduce((s,r)=>s+r.startedCount,0) }} entries · Started sites
            </div>
          </div>
          <div>
            <div class="text-sm font-bold text-amber-600">
              {{ formatCompact(monthlyCostToCompleteData.reduce((s,r)=>s+r.notStartedCost,0)) }}
            </div>
            <div class="text-xs text-gray-400">
              {{ monthlyCostToCompleteData.reduce((s,r)=>s+r.notStartedCount,0) }} entries · Not Started
            </div>
          </div>
          <div>
            <div class="text-sm font-bold text-gray-700">
              {{ formatCompact(monthlyCostToCompleteData.reduce((s,r)=>s+r.startedCost+r.notStartedCost,0)) }}
            </div>
            <div class="text-xs text-gray-400">Total cost to complete</div>
          </div>
        </div>
      </div>

      <div v-if="monthlyCostToCompleteData.length > 0">
        <div class="h-56">
          <Line :data="monthlyCostChartData" :options="monthlyCostChartOptions" />
        </div>

        <!-- Monthly breakdown table -->
        <div class="mt-4 rounded-xl border border-gray-200 overflow-hidden">
          <table class="min-w-full text-xs">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-4 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wider">Month</th>
                <th class="px-4 py-2.5 text-right font-semibold text-emerald-600 uppercase tracking-wider">Started Amount</th>
                <th class="px-4 py-2.5 text-right font-semibold text-emerald-400 uppercase tracking-wider">Started Entries</th>
                <th class="px-4 py-2.5 text-right font-semibold text-amber-600 uppercase tracking-wider">Not Started Amount</th>
                <th class="px-4 py-2.5 text-right font-semibold text-amber-400 uppercase tracking-wider">Not Started Entries</th>
                <th class="px-4 py-2.5 text-right font-semibold text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="row in monthlyCostToCompleteData" :key="row.key" class="hover:bg-emerald-50/30">
                <td class="px-4 py-2.5 font-medium text-gray-700">{{ row.label }}</td>
                <td class="px-4 py-2.5 text-right font-semibold text-emerald-700">
                  {{ row.startedCost ? formatCompact(row.startedCost) : '—' }}
                </td>
                <td class="px-4 py-2.5 text-right text-emerald-400">{{ row.startedCount || '—' }}</td>
                <td class="px-4 py-2.5 text-right font-semibold text-amber-600">
                  {{ row.notStartedCost ? formatCompact(row.notStartedCost) : '—' }}
                </td>
                <td class="px-4 py-2.5 text-right text-amber-400">{{ row.notStartedCount || '—' }}</td>
                <td class="px-4 py-2.5 text-right font-semibold text-gray-800">
                  {{ formatCompact(row.startedCost + row.notStartedCost) }}
                </td>
              </tr>
            </tbody>
            <tfoot class="border-t-2 border-gray-200 bg-gray-50">
              <tr>
                <td class="px-4 py-2.5 font-bold text-gray-600 uppercase text-xs">Total</td>
                <td class="px-4 py-2.5 text-right font-bold text-emerald-700">
                  {{ formatCompact(monthlyCostToCompleteData.reduce((s,r)=>s+r.startedCost,0)) }}
                </td>
                <td class="px-4 py-2.5 text-right font-bold text-emerald-400">
                  {{ monthlyCostToCompleteData.reduce((s,r)=>s+r.startedCount,0) }}
                </td>
                <td class="px-4 py-2.5 text-right font-bold text-amber-600">
                  {{ formatCompact(monthlyCostToCompleteData.reduce((s,r)=>s+r.notStartedCost,0)) }}
                </td>
                <td class="px-4 py-2.5 text-right font-bold text-amber-400">
                  {{ monthlyCostToCompleteData.reduce((s,r)=>s+r.notStartedCount,0) }}
                </td>
                <td class="px-4 py-2.5 text-right font-bold text-gray-800">
                  {{ formatCompact(monthlyCostToCompleteData.reduce((s,r)=>s+r.startedCost+r.notStartedCost,0)) }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div v-else class="flex flex-col items-center justify-center h-40 gap-2 text-gray-400">
        <svg class="w-8 h-8 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
        <p class="text-sm">No cost entries with dates yet</p>
        <p class="text-xs text-gray-300">Add cost entries with a date in the Site Status view to see the monthly breakdown here</p>
      </div>
    </div>

    <!-- ── BOQ Amount by Scope ── -->
    <div class="bg-white rounded-xl border border-blue-100 p-5">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-sm font-semibold text-gray-700">BOQ Related VO Amount by Scope</h3>
          <p class="text-xs text-gray-400">BOQ vs Non-BOQ split — Have PO vs No PO per scope</p>
        </div>
        <div class="flex items-center gap-4 text-xs text-gray-500">
          <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm bg-blue-600"></span>BOQ · Have PO</div>
          <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm bg-blue-200"></span>BOQ · No PO</div>
          <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm bg-teal-500"></span>Non-BOQ · Have PO</div>
          <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm bg-teal-100"></span>Non-BOQ · No PO</div>
        </div>
      </div>

      <div v-if="boqByScope.length > 0">
        <!-- Summary pills -->
        <div class="grid grid-cols-2 gap-3 mb-5">
          <div class="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <div class="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">BOQ Related</div>
            <div class="flex justify-between items-end">
              <div>
                <div class="text-lg font-bold text-blue-700">{{ formatCompact(boqTotals.boqTotal) }}</div>
                <div class="text-xs text-blue-400 mt-0.5">Total VO Amount</div>
              </div>
              <div class="text-right space-y-0.5">
                <div class="text-xs text-gray-600 font-semibold">Have PO: <span class="text-blue-700">{{ formatCompact(boqTotals.boqHavePO) }}</span></div>
                <div class="text-xs text-gray-400">No PO: {{ formatCompact(boqTotals.boqNoPO) }}</div>
              </div>
            </div>
          </div>
          <div class="rounded-xl border border-teal-100 bg-teal-50 p-4">
            <div class="text-xs font-bold text-teal-600 uppercase tracking-wider mb-2">Non-BOQ</div>
            <div class="flex justify-between items-end">
              <div>
                <div class="text-lg font-bold text-teal-700">{{ formatCompact(boqTotals.nonBoqTotal) }}</div>
                <div class="text-xs text-teal-400 mt-0.5">Total VO Amount</div>
              </div>
              <div class="text-right space-y-0.5">
                <div class="text-xs text-gray-600 font-semibold">Have PO: <span class="text-teal-700">{{ formatCompact(boqTotals.nonBoqHavePO) }}</span></div>
                <div class="text-xs text-gray-400">No PO: {{ formatCompact(boqTotals.nonBoqNoPO) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Scope breakdown table -->
        <div class="rounded-xl border border-gray-200 overflow-hidden">
          <table class="min-w-full text-xs">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-4 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wider">Scope</th>
                <th class="px-4 py-2.5 text-right font-semibold text-blue-600 uppercase tracking-wider">BOQ · Have PO</th>
                <th class="px-4 py-2.5 text-right font-semibold text-blue-300 uppercase tracking-wider">BOQ · No PO</th>
                <th class="px-4 py-2.5 text-right font-semibold text-blue-600 uppercase tracking-wider">BOQ Total</th>
                <th class="px-4 py-2.5 text-right font-semibold text-teal-600 uppercase tracking-wider">Non-BOQ · Have PO</th>
                <th class="px-4 py-2.5 text-right font-semibold text-teal-300 uppercase tracking-wider">Non-BOQ · No PO</th>
                <th class="px-4 py-2.5 text-right font-semibold text-teal-600 uppercase tracking-wider">Non-BOQ Total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="row in boqByScope" :key="row.scope" class="hover:bg-gray-50">
                <td class="px-4 py-2.5 text-gray-700 font-medium truncate max-w-[120px]" :title="row.scope">{{ row.scope }}</td>
                <td class="px-4 py-2.5 text-right font-semibold text-blue-700">{{ row.boqHavePO ? formatCompact(row.boqHavePO) : '—' }}</td>
                <td class="px-4 py-2.5 text-right text-gray-400">{{ row.boqNoPO ? formatCompact(row.boqNoPO) : '—' }}</td>
                <td class="px-4 py-2.5 text-right font-semibold text-gray-800">{{ row.boqTotal ? formatCompact(row.boqTotal) : '—' }}</td>
                <td class="px-4 py-2.5 text-right font-semibold text-teal-700">{{ row.nonBoqHavePO ? formatCompact(row.nonBoqHavePO) : '—' }}</td>
                <td class="px-4 py-2.5 text-right text-gray-400">{{ row.nonBoqNoPO ? formatCompact(row.nonBoqNoPO) : '—' }}</td>
                <td class="px-4 py-2.5 text-right font-semibold text-gray-800">{{ row.nonBoqTotal ? formatCompact(row.nonBoqTotal) : '—' }}</td>
              </tr>
            </tbody>
            <tfoot class="border-t-2 border-gray-200 bg-gray-50">
              <tr>
                <td class="px-4 py-2.5 font-bold text-gray-600 uppercase text-xs">Total</td>
                <td class="px-4 py-2.5 text-right font-bold text-blue-700">{{ formatCompact(boqTotals.boqHavePO) }}</td>
                <td class="px-4 py-2.5 text-right text-gray-400">{{ formatCompact(boqTotals.boqNoPO) }}</td>
                <td class="px-4 py-2.5 text-right font-bold text-gray-800">{{ formatCompact(boqTotals.boqTotal) }}</td>
                <td class="px-4 py-2.5 text-right font-bold text-teal-700">{{ formatCompact(boqTotals.nonBoqHavePO) }}</td>
                <td class="px-4 py-2.5 text-right text-gray-400">{{ formatCompact(boqTotals.nonBoqNoPO) }}</td>
                <td class="px-4 py-2.5 text-right font-bold text-gray-800">{{ formatCompact(boqTotals.nonBoqTotal) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div v-else class="flex items-center justify-center h-28 text-gray-400 text-sm">No data yet</div>
    </div>

    <!-- ── Row 6: Ticket breakdown ── -->
    <div class="grid grid-cols-2 gap-4">

      <!-- With Ticket -->
      <div class="bg-white rounded-xl border border-blue-100 overflow-hidden">
        <div class="px-5 py-4 border-b border-blue-50 flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-gray-700 text-sm">With Ticket Number</h3>
            <p class="text-xs text-gray-400 mt-0.5">{{ ticketBreakdown.withTicket.count }} VOs</p>
          </div>
          <div class="text-base font-bold text-blue-700">{{ formatCompact(ticketBreakdown.withTicket.total) }}</div>
        </div>
        <div v-if="ticketBreakdown.withTicket.scopes.length === 0" class="px-6 py-8 text-center text-gray-400 text-sm">No data yet</div>
        <div v-else class="divide-y divide-gray-50">
          <div v-for="row in ticketBreakdown.withTicket.scopes" :key="row.scope"
            class="flex items-center gap-4 px-5 py-3 hover:bg-blue-50/30 transition">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>
                <span class="text-sm text-gray-700 truncate">{{ row.scope }}</span>
                <span class="text-xs text-gray-400 shrink-0">×{{ row.count }}</span>
              </div>
              <div class="mt-1.5 h-1 rounded-full bg-blue-50 overflow-hidden">
                <div class="h-full rounded-full bg-blue-300 transition-all"
                  :style="{ width: ticketBreakdown.withTicket.total ? (row.amount / ticketBreakdown.withTicket.total * 100) + '%' : '0%' }"></div>
              </div>
            </div>
            <span class="text-sm font-semibold text-gray-800 shrink-0">{{ formatCompact(row.amount) }}</span>
          </div>
          <div class="flex items-center justify-between px-5 py-3 bg-blue-50/50">
            <span class="text-xs font-semibold text-blue-500 uppercase tracking-wider">Total</span>
            <span class="text-sm font-semibold text-blue-700">{{ formatCompact(ticketBreakdown.withTicket.total) }}</span>
          </div>
        </div>
      </div>

      <!-- Without Ticket -->
      <div class="bg-white rounded-xl border border-blue-100 overflow-hidden">
        <div class="px-5 py-4 border-b border-blue-50 flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-gray-700 text-sm">Without Ticket Number</h3>
            <p class="text-xs text-gray-400 mt-0.5">{{ ticketBreakdown.withoutTicket.count }} VOs</p>
          </div>
          <div class="text-base font-bold text-gray-600">{{ formatCompact(ticketBreakdown.withoutTicket.total) }}</div>
        </div>
        <div v-if="ticketBreakdown.withoutTicket.scopes.length === 0" class="px-6 py-8 text-center text-gray-400 text-sm">No data yet</div>
        <div v-else class="divide-y divide-gray-50">
          <div v-for="row in ticketBreakdown.withoutTicket.scopes" :key="row.scope"
            class="flex items-center gap-4 px-5 py-3 hover:bg-blue-50/20 transition">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-blue-200 shrink-0"></span>
                <span class="text-sm text-gray-700 truncate">{{ row.scope }}</span>
                <span class="text-xs text-gray-400 shrink-0">×{{ row.count }}</span>
              </div>
              <div class="mt-1.5 h-1 rounded-full bg-blue-50 overflow-hidden">
                <div class="h-full rounded-full bg-blue-100 transition-all"
                  :style="{ width: ticketBreakdown.withoutTicket.total ? (row.amount / ticketBreakdown.withoutTicket.total * 100) + '%' : '0%' }"></div>
              </div>
            </div>
            <span class="text-sm font-semibold text-gray-800 shrink-0">{{ formatCompact(row.amount) }}</span>
          </div>
          <div class="flex items-center justify-between px-5 py-3 bg-blue-50/30">
            <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</span>
            <span class="text-sm font-semibold text-gray-700">{{ formatCompact(ticketBreakdown.withoutTicket.total) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Row 6: Timeline metrics ── -->
    <div class="grid grid-cols-3 gap-4">
      <div class="bg-white rounded-xl border border-blue-100 p-5 flex items-center gap-4">
        <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
        </div>
        <div>
          <div class="text-xs font-medium text-blue-400 uppercase tracking-wider">Avg Days to Approval</div>
          <div class="text-2xl font-bold text-gray-800 mt-0.5">{{ store.timelineMetrics.value?.averageDaysToApproval || 0 }}</div>
          <div class="text-xs text-gray-400 mt-0.5">Based on approved VOs</div>
        </div>
      </div>
      <div class="bg-white rounded-xl border border-blue-100 p-5 flex items-center gap-4">
        <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div>
          <div class="text-xs font-medium text-blue-400 uppercase tracking-wider">Overdue &gt;30 days</div>
          <div class="text-2xl font-bold text-gray-800 mt-0.5">{{ store.timelineMetrics.value?.overduePending || 0 }}</div>
          <div class="text-xs text-gray-400 mt-0.5">Pending approval</div>
        </div>
      </div>
      <div class="bg-white rounded-xl border border-blue-100 p-5 flex items-center gap-4">
        <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
        </div>
        <div class="flex-1">
          <div class="text-xs font-medium text-blue-400 uppercase tracking-wider">Approval Rate</div>
          <div class="text-2xl font-bold text-gray-800 mt-0.5">{{ store.timelineMetrics.value?.approvalRate || 0 }}%</div>
          <div class="mt-1.5 h-1 rounded-full bg-blue-50 overflow-hidden">
            <div class="h-full rounded-full bg-blue-400 transition-all"
              :style="{ width: (store.timelineMetrics.value?.approvalRate || 0) + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Row 7: Site Summary ── -->
    <div class="bg-white rounded-xl border border-blue-100 overflow-hidden">
      <div class="px-6 py-4 border-b border-blue-50 flex items-center justify-between">
        <div>
          <h3 class="font-semibold text-gray-700 text-sm">VOs by Site</h3>
          <p class="text-xs text-gray-400 mt-0.5">{{ siteSummary.length }} sites with variation orders</p>
        </div>
        <div class="flex items-center gap-2">
          <button @click="siteSortBy = 'count'; sitePage = 1" :class="siteSortBy === 'count' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-500 hover:bg-blue-100'"
            class="px-2.5 py-1 rounded-lg text-xs font-medium transition">By Count</button>
          <button @click="siteSortBy = 'amount'; sitePage = 1" :class="siteSortBy === 'amount' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-500 hover:bg-blue-100'"
            class="px-2.5 py-1 rounded-lg text-xs font-medium transition">By Amount</button>
        </div>
      </div>
      <div v-if="siteSummary.length === 0" class="px-6 py-10 text-center text-gray-400 text-sm">No variation orders yet</div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
              <th class="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Site</th>
              <th class="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Job Number</th>
              <th class="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
              <th class="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Approved</th>
              <th class="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Pending</th>
              <th class="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Draft</th>
              <th class="px-5 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
              <th class="px-5 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider w-28">Breakdown</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="row in pagedSiteSummary" :key="row.key" class="hover:bg-gray-50 transition">
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-semibold shrink-0">{{ row.siteId || '—' }}</span>
                  <span class="font-medium text-gray-800 truncate max-w-[140px]" :title="row.siteName">{{ row.siteName }}</span>
                </div>
              </td>
              <td class="px-5 py-3.5">
                <span v-if="row.jobNumber" class="font-mono text-xs text-gray-500">{{ row.jobNumber }}</span>
                <span v-else class="text-gray-300 text-xs">—</span>
              </td>
              <td class="px-4 py-3.5 text-center font-semibold text-gray-800">{{ row.total }}</td>
              <td class="px-4 py-3.5 text-center text-gray-700 text-sm">{{ row.approved || '—' }}</td>
              <td class="px-4 py-3.5 text-center text-gray-500 text-sm">{{ row.pending || '—' }}</td>
              <td class="px-4 py-3.5 text-center text-gray-400 text-sm">{{ row.draft || '—' }}</td>
              <td class="px-5 py-3.5 text-right font-semibold text-gray-800">{{ formatCompact(row.amount) }}</td>
              <td class="px-5 py-3.5">
                <div class="flex h-1.5 rounded-full overflow-hidden gap-px w-24 ml-auto bg-gray-100">
                  <div v-if="row.approved"  class="bg-gray-600" :style="{ width: (row.approved  / row.total * 100) + '%' }"></div>
                  <div v-if="row.pending"   class="bg-gray-400" :style="{ width: (row.pending   / row.total * 100) + '%' }"></div>
                  <div v-if="row.submitted" class="bg-gray-300" :style="{ width: (row.submitted / row.total * 100) + '%' }"></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Site pagination footer -->
      <div v-if="siteTotalPages > 1" class="px-5 py-2.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3">
        <span class="text-xs text-gray-500">
          Showing {{ (sitePage - 1) * SITE_PAGE_SIZE + 1 }}–{{ Math.min(sitePage * SITE_PAGE_SIZE, siteSummary.length) }} of {{ siteSummary.length }} sites
        </span>
        <div class="flex items-center gap-1">
          <button @click="sitePage = 1" :disabled="sitePage === 1"
            class="px-2 py-1 text-xs rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">«</button>
          <button @click="sitePage--" :disabled="sitePage === 1"
            class="px-2 py-1 text-xs rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">‹</button>
          <span class="px-3 py-1 text-xs font-semibold text-gray-700">{{ sitePage }} / {{ siteTotalPages }}</span>
          <button @click="sitePage++" :disabled="sitePage === siteTotalPages"
            class="px-2 py-1 text-xs rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">›</button>
          <button @click="sitePage = siteTotalPages" :disabled="sitePage === siteTotalPages"
            class="px-2 py-1 text-xs rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">»</button>
        </div>
      </div>
    </div>

    <!-- ── Row 8: Invoice by Site ── -->
    <div class="bg-white rounded-xl border border-blue-100 overflow-hidden">
      <div class="px-6 py-4 border-b border-blue-50 flex items-center justify-between">
        <div>
          <h3 class="font-semibold text-gray-700 text-sm">Invoice by Site</h3>
          <p class="text-xs text-gray-400 mt-0.5">{{ invoiceBySite.length }} sites · click a row to view detail</p>
        </div>
        <div class="flex items-center gap-2">
          <button @click="invoiceSiteSortBy = 'invoiced'; invoiceSitePage = 1"
            :class="invoiceSiteSortBy === 'invoiced' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-500 hover:bg-blue-100'"
            class="px-2.5 py-1 rounded-lg text-xs font-medium transition">By Invoiced</button>
          <button @click="invoiceSiteSortBy = 'total'; invoiceSitePage = 1"
            :class="invoiceSiteSortBy === 'total' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-500 hover:bg-blue-100'"
            class="px-2.5 py-1 rounded-lg text-xs font-medium transition">By Total</button>
        </div>
      </div>
      <div class="px-4 py-2.5 border-b border-gray-100 bg-white">
        <input v-model="invoiceSiteSearch" type="text" placeholder="Search site ID, name or job number…"
          class="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
      </div>
      <div v-if="filteredInvoiceBySite.length === 0" class="px-6 py-10 text-center text-gray-400 text-sm">No matching sites</div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
              <th class="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Site</th>
              <th class="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Job No.</th>
              <th class="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Total VOs</th>
              <th class="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Invoiced</th>
              <th class="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Can Invoice</th>
              <th class="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">No PO</th>
              <th class="px-5 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Invoiced Amt</th>
              <th class="px-5 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Pending Amt</th>
              <th class="px-5 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Total Amt</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="row in pagedInvoiceBySite" :key="row.key"
              @click="openInvoiceSiteModal(row)"
              class="hover:bg-blue-50 cursor-pointer transition">
              <td class="px-5 py-3.5">
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-semibold shrink-0">{{ row.siteId || '—' }}</span>
                  <span class="font-medium text-gray-800 truncate max-w-[140px]" :title="row.siteName">{{ row.siteName }}</span>
                </div>
              </td>
              <td class="px-5 py-3.5">
                <span v-if="row.jobNumber" class="font-mono text-xs text-gray-500">{{ row.jobNumber }}</span>
                <span v-else class="text-gray-300 text-xs">—</span>
              </td>
              <td class="px-4 py-3.5 text-center font-semibold text-gray-800">{{ row.total }}</td>
              <td class="px-4 py-3.5 text-center">
                <span v-if="row.invoiced" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">{{ row.invoiced }}</span>
                <span v-else class="text-gray-300 text-xs">—</span>
              </td>
              <td class="px-4 py-3.5 text-center">
                <span v-if="row.canInvoice" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">{{ row.canInvoice }}</span>
                <span v-else class="text-gray-300 text-xs">—</span>
              </td>
              <td class="px-4 py-3.5 text-center">
                <span v-if="row.noPO" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">{{ row.noPO }}</span>
                <span v-else class="text-gray-300 text-xs">—</span>
              </td>
              <td class="px-5 py-3.5 text-right font-semibold text-green-700">{{ row.invoicedAmt ? formatCompact(row.invoicedAmt) : '—' }}</td>
              <td class="px-5 py-3.5 text-right text-gray-600">{{ row.pendingAmt ? formatCompact(row.pendingAmt) : '—' }}</td>
              <td class="px-5 py-3.5 text-right font-semibold text-gray-800">{{ formatCompact(row.totalAmt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="invoiceSiteTotalPages > 1" class="px-5 py-2.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3">
        <span class="text-xs text-gray-500">
          Showing {{ (invoiceSitePage - 1) * INVOICE_SITE_PAGE_SIZE + 1 }}–{{ Math.min(invoiceSitePage * INVOICE_SITE_PAGE_SIZE, filteredInvoiceBySite.length) }} of {{ filteredInvoiceBySite.length }} sites
        </span>
        <div class="flex items-center gap-1">
          <button @click="invoiceSitePage = 1" :disabled="invoiceSitePage === 1"
            class="px-2 py-1 text-xs rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">«</button>
          <button @click="invoiceSitePage--" :disabled="invoiceSitePage === 1"
            class="px-2 py-1 text-xs rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">‹</button>
          <span class="px-3 py-1 text-xs font-semibold text-gray-700">{{ invoiceSitePage }} / {{ invoiceSiteTotalPages }}</span>
          <button @click="invoiceSitePage++" :disabled="invoiceSitePage === invoiceSiteTotalPages"
            class="px-2 py-1 text-xs rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">›</button>
          <button @click="invoiceSitePage = invoiceSiteTotalPages" :disabled="invoiceSitePage === invoiceSiteTotalPages"
            class="px-2 py-1 text-xs rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">»</button>
        </div>
      </div>
    </div>

    <!-- Invoice by Site Detail Modal -->
    <Teleport to="body">
      <div v-if="invoiceSiteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        @click.self="invoiceSiteModal = null">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] flex flex-col overflow-hidden">
          <!-- Modal header -->
          <div class="flex items-center justify-between px-6 py-4 bg-blue-700 shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-white text-base">
                  <span class="px-2 py-0.5 bg-blue-600 rounded text-sm mr-2">{{ invoiceSiteModal.siteId }}</span>{{ invoiceSiteModal.siteName }}
                </h3>
                <p class="text-blue-200 text-xs mt-0.5">{{ invoiceSiteModal.vos.length }} variation orders · Job {{ invoiceSiteModal.jobNumber || '—' }}</p>
              </div>
            </div>
            <button @click="invoiceSiteModal = null"
              class="w-8 h-8 flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-500 transition text-white text-lg font-bold">✕</button>
          </div>
          <!-- Summary pills -->
          <div class="px-6 py-3 bg-blue-50 border-b border-blue-100 flex items-center gap-3 flex-wrap shrink-0">
            <div class="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-100 rounded-xl">
              <span class="text-xs text-gray-500">Total</span>
              <span class="text-sm font-bold text-gray-800">{{ invoiceSiteModal.total }}</span>
              <span class="text-xs text-gray-400">VOs</span>
            </div>
            <div class="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-100 rounded-xl">
              <span class="w-2 h-2 rounded-full bg-green-500 shrink-0"></span>
              <span class="text-xs text-gray-500">Invoiced</span>
              <span class="text-sm font-bold text-green-700">{{ invoiceSiteModal.invoiced }}</span>
              <span class="text-xs text-gray-400">· {{ formatCompact(invoiceSiteModal.invoicedAmt) }}</span>
            </div>
            <div class="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-xl">
              <span class="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
              <span class="text-xs text-gray-500">Can Invoice</span>
              <span class="text-sm font-bold text-blue-700">{{ invoiceSiteModal.canInvoice }}</span>
              <span class="text-xs text-gray-400">· {{ formatCompact(invoiceSiteModal.pendingAmt) }}</span>
            </div>
            <div class="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl">
              <span class="w-2 h-2 rounded-full bg-gray-400 shrink-0"></span>
              <span class="text-xs text-gray-500">No PO</span>
              <span class="text-sm font-bold text-gray-600">{{ invoiceSiteModal.noPO }}</span>
            </div>
            <div class="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 rounded-xl">
              <span class="text-xs text-blue-100">Total Amt</span>
              <span class="text-sm font-bold text-white">{{ formatCompact(invoiceSiteModal.totalAmt) }}</span>
            </div>
          </div>
          <!-- Grouped detail -->
          <div class="flex-1 overflow-auto bg-gray-50/70 p-4 space-y-4">
            <div v-for="group in invoiceSiteModalGroups" :key="group.key"
              class="bg-white rounded-xl border overflow-hidden"
              :class="group.borderClass">
              <div class="px-5 py-3 flex items-center justify-between gap-4"
                :class="group.headerClass">
                <div>
                  <h4 class="text-sm font-bold" :class="group.titleClass">{{ group.label }}</h4>
                  <p class="text-xs text-gray-400 mt-0.5">{{ group.description }}</p>
                </div>
                <div class="flex items-center gap-2 flex-wrap justify-end">
                  <span class="px-2.5 py-1 bg-white border border-gray-100 rounded-lg text-xs font-semibold text-gray-600">
                    {{ group.items.length }} item{{ group.items.length !== 1 ? 's' : '' }}
                  </span>
                  <span class="px-2.5 py-1 bg-white border border-gray-100 rounded-lg text-xs font-bold" :class="group.titleClass">
                    {{ formatCurrency(group.total) }}
                  </span>
                  <span class="px-2.5 py-1 bg-white border border-teal-100 rounded-lg text-xs font-bold text-teal-700">
                    Has PO {{ formatCurrency(group.havePO) }}
                  </span>
                  <span class="px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600">
                    No PO {{ formatCurrency(group.noPO) }}
                  </span>
                </div>
              </div>

              <div v-if="group.items.length === 0" class="px-5 py-5 text-sm text-gray-400 text-center">
                No items in this category.
              </div>
              <table v-else class="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    <th class="px-5 py-2.5 bg-gray-50 border-b border-gray-200 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                    <th class="px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Category</th>
                    <th class="px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Scope</th>
                    <th class="px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">VO Status</th>
                    <th class="px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-right text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Amount</th>
                    <th class="px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">PO Number</th>
                    <th class="px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Invoice Status</th>
                    <th class="px-4 py-2.5 bg-gray-50 border-b border-gray-200 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Invoice Date</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-for="vo in group.items" :key="vo.id"
                    :class="vo.invoiceStatus === 'SIT Completed' && vo.invoiceDate ? 'bg-green-50' : 'hover:bg-gray-50'"
                    class="transition">
                    <td class="px-5 py-3">
                      <div class="max-w-xs truncate text-gray-800 font-medium" :title="vo.voDescription">{{ vo.voDescription }}</div>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-gray-600">{{ vo.voCategory || '-' }}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-gray-600">{{ vo.scope || '-' }}</td>
                    <td class="px-4 py-3 whitespace-nowrap">
                      <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', modalStatusBadge(vo.voStatus)]">
                        {{ formatStatus(vo.voStatus) }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-right font-semibold text-gray-800 whitespace-nowrap">{{ formatCurrency(vo.voAmount) }}</td>
                    <td class="px-4 py-3 whitespace-nowrap">
                      <span v-if="vo.poNumber" class="font-mono text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded">{{ vo.poNumber }}</span>
                      <span v-else class="text-gray-300 text-xs">-</span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap">
                      <span v-if="vo.invoiceStatus"
                        :class="vo.invoiceStatus === 'To Be Sent to Nokia' ? 'bg-indigo-100 text-indigo-700'
                          : vo.invoiceStatus === 'SIT Completed' ? 'bg-green-100 text-green-700'
                          : vo.invoiceStatus === 'SIT Approved' ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-blue-700'"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold">
                        {{ vo.invoiceStatus }}
                      </span>
                      <span v-else class="text-gray-300 text-xs">-</span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-gray-600">{{ vo.invoiceDate ? new Date(vo.invoiceDate).toLocaleDateString('en-AU') : '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <!-- Original flat table hidden -->
          <div v-if="false" class="flex-1 overflow-auto">
            <table class="w-full text-sm border-collapse">
              <thead class="sticky top-0 z-10">
                <tr>
                  <th class="px-5 py-3 bg-gray-100 border-b border-gray-200 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Description</th>
                  <th class="px-4 py-3 bg-gray-100 border-b border-gray-200 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">Scope</th>
                  <th class="px-4 py-3 bg-gray-100 border-b border-gray-200 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">VO Status</th>
                  <th class="px-4 py-3 bg-gray-100 border-b border-gray-200 text-right text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">Amount</th>
                  <th class="px-4 py-3 bg-gray-100 border-b border-gray-200 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">PO Number</th>
                  <th class="px-4 py-3 bg-gray-100 border-b border-gray-200 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">Invoice Status</th>
                  <th class="px-4 py-3 bg-gray-100 border-b border-gray-200 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">Invoice Date</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="vo in invoiceSiteModal.vos" :key="vo.id"
                  :class="vo.invoiceStatus === 'SIT Completed' && vo.invoiceDate ? 'bg-green-50' : 'hover:bg-gray-50'"
                  class="transition">
                  <td class="px-5 py-3">
                    <div class="max-w-xs truncate text-gray-800 font-medium" :title="vo.voDescription">{{ vo.voDescription }}</div>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-gray-600">{{ vo.scope || '—' }}</td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', modalStatusBadge(vo.voStatus)]">
                      {{ formatStatus(vo.voStatus) }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-right font-semibold text-gray-800 whitespace-nowrap">{{ formatCurrency(vo.voAmount) }}</td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span v-if="vo.poNumber" class="font-mono text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded">{{ vo.poNumber }}</span>
                    <span v-else class="text-gray-300 text-xs">—</span>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span v-if="vo.invoiceStatus"
                      :class="vo.invoiceStatus === 'To Be Sent to Nokia' ? 'bg-indigo-100 text-indigo-700'
                        : vo.invoiceStatus === 'SIT Completed' ? 'bg-green-100 text-green-700'
                        : vo.invoiceStatus === 'SIT Approved' ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700'"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold">
                      {{ vo.invoiceStatus }}
                    </span>
                    <span v-else class="text-gray-300 text-xs">—</span>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-gray-600">{{ vo.invoiceDate ? new Date(vo.invoiceDate).toLocaleDateString('en-AU') : '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Modal footer -->
          <div class="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-end shrink-0">
            <button @click="invoiceSiteModal = null"
              class="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition">Close</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ── Row 9: VO Category Summary ── -->
    <div class="bg-white rounded-xl border border-blue-100 overflow-hidden">
      <div class="px-6 py-4 border-b border-blue-50 flex items-center justify-between">
        <div>
          <h3 class="font-semibold text-gray-700 text-sm">VO by Category</h3>
          <p class="text-xs text-gray-400 mt-0.5">{{ voCategorySummary.length }} categories · click a row to view detail</p>
        </div>
        <div class="flex items-center gap-2">
          <button @click="voCatSortBy = 'invoiced'; voCatPage = 1"
            :class="voCatSortBy === 'invoiced' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-500 hover:bg-blue-100'"
            class="px-2.5 py-1 rounded-lg text-xs font-medium transition">By Invoiced</button>
          <button @click="voCatSortBy = 'total'; voCatPage = 1"
            :class="voCatSortBy === 'total' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-500 hover:bg-blue-100'"
            class="px-2.5 py-1 rounded-lg text-xs font-medium transition">By Total</button>
        </div>
      </div>
      <!-- Search -->
      <div class="px-4 py-2.5 border-b border-gray-100 bg-white">
        <input v-model="voCatSearch" type="text" placeholder="Search category…"
          class="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
      </div>
      <div v-if="filteredVOCategorySummary.length === 0" class="px-6 py-10 text-center text-gray-400 text-sm">No matching categories</div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
              <th class="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
              <th class="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
              <th class="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Total VOs</th>
              <th class="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Invoiced</th>
              <th class="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Uninvoiced</th>
              <th class="px-5 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Invoiced Amt</th>
              <th class="px-5 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Uninvoiced Amt</th>
              <th class="px-5 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Total Amt</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="row in pagedVOCategorySummary" :key="row.category"
              @click="openVOCatModal(row)"
              class="hover:bg-blue-50 cursor-pointer transition">
              <td class="px-5 py-3.5 font-medium text-gray-800">{{ row.category }}</td>
              <td class="px-4 py-3.5 text-center">
                <span :class="row.isBasePO ? 'bg-amber-100 text-amber-700' : 'bg-blue-50 text-blue-600'"
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold">
                  {{ row.isBasePO ? 'Base PO' : 'VO' }}
                </span>
              </td>
              <td class="px-4 py-3.5 text-center font-semibold text-gray-800">{{ row.total }}</td>
              <td class="px-4 py-3.5 text-center">
                <span v-if="row.invoiced" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">{{ row.invoiced }}</span>
                <span v-else class="text-gray-300 text-xs">—</span>
              </td>
              <td class="px-4 py-3.5 text-center">
                <span v-if="row.uninvoiced" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">{{ row.uninvoiced }}</span>
                <span v-else class="text-gray-300 text-xs">—</span>
              </td>
              <td class="px-5 py-3.5 text-right font-semibold text-green-700">{{ row.invoicedAmt ? formatCompact(row.invoicedAmt) : '—' }}</td>
              <td class="px-5 py-3.5 text-right text-gray-600">{{ row.uninvoicedAmt ? formatCompact(row.uninvoicedAmt) : '—' }}</td>
              <td class="px-5 py-3.5 text-right font-semibold text-gray-800">{{ formatCompact(row.totalAmt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="voCatTotalPages > 1" class="px-5 py-2.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3">
        <span class="text-xs text-gray-500">
          Showing {{ (voCatPage - 1) * VO_CAT_PAGE_SIZE + 1 }}–{{ Math.min(voCatPage * VO_CAT_PAGE_SIZE, filteredVOCategorySummary.length) }} of {{ filteredVOCategorySummary.length }} categories
        </span>
        <div class="flex items-center gap-1">
          <button @click="voCatPage = 1" :disabled="voCatPage === 1"
            class="px-2 py-1 text-xs rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">«</button>
          <button @click="voCatPage--" :disabled="voCatPage === 1"
            class="px-2 py-1 text-xs rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">‹</button>
          <span class="px-3 py-1 text-xs font-semibold text-gray-700">{{ voCatPage }} / {{ voCatTotalPages }}</span>
          <button @click="voCatPage++" :disabled="voCatPage === voCatTotalPages"
            class="px-2 py-1 text-xs rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">›</button>
          <button @click="voCatPage = voCatTotalPages" :disabled="voCatPage === voCatTotalPages"
            class="px-2 py-1 text-xs rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">»</button>
        </div>
      </div>
    </div>

    <!-- VO Category Detail Modal -->
    <Teleport to="body">
      <div v-if="voCatModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        @click.self="voCatModal = null">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] flex flex-col overflow-hidden">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 shrink-0"
            :class="voCatModal.isBasePO ? 'bg-amber-600' : 'bg-blue-700'">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                :class="voCatModal.isBasePO ? 'bg-amber-500' : 'bg-blue-600'">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5l7 7-7 7-5-5V3z"/>
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-white text-base">{{ voCatModal.category }}</h3>
                <p class="text-xs mt-0.5" :class="voCatModal.isBasePO ? 'text-amber-200' : 'text-blue-200'">
                  {{ voCatModal.total }} variation orders · {{ voCatModal.isBasePO ? 'Base PO' : 'VO' }} category
                </p>
              </div>
            </div>
            <button @click="voCatModal = null"
              class="w-8 h-8 flex items-center justify-center rounded-xl hover:opacity-80 transition text-white text-lg font-bold"
              :class="voCatModal.isBasePO ? 'bg-amber-500' : 'bg-blue-600'">✕</button>
          </div>
          <!-- Summary pills -->
          <div class="px-6 py-3 border-b flex items-center gap-3 flex-wrap shrink-0"
            :class="voCatModal.isBasePO ? 'bg-amber-50 border-amber-100' : 'bg-blue-50 border-blue-100'">
            <div class="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-100 rounded-xl">
              <span class="text-xs text-gray-500">Total</span>
              <span class="text-sm font-bold text-gray-800">{{ voCatModal.total }}</span>
              <span class="text-xs text-gray-400">VOs</span>
            </div>
            <div class="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-100 rounded-xl">
              <span class="w-2 h-2 rounded-full bg-green-500 shrink-0"></span>
              <span class="text-xs text-gray-500">Invoiced</span>
              <span class="text-sm font-bold text-green-700">{{ voCatModal.invoiced }}</span>
              <span class="text-xs text-gray-400">· {{ formatCompact(voCatModal.invoicedAmt) }}</span>
            </div>
            <div class="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl">
              <span class="w-2 h-2 rounded-full bg-gray-400 shrink-0"></span>
              <span class="text-xs text-gray-500">Uninvoiced</span>
              <span class="text-sm font-bold text-gray-600">{{ voCatModal.uninvoiced }}</span>
              <span class="text-xs text-gray-400">· {{ formatCompact(voCatModal.uninvoicedAmt) }}</span>
            </div>
            <div class="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
              :class="voCatModal.isBasePO ? 'bg-amber-600' : 'bg-blue-600'">
              <span class="text-xs text-white/70">Total Amt</span>
              <span class="text-sm font-bold text-white">{{ formatCompact(voCatModal.totalAmt) }}</span>
            </div>
          </div>
          <!-- Filter tabs -->
          <div class="px-6 pt-3 pb-0 flex items-center gap-2 shrink-0 border-b border-gray-100">
            <button v-for="tab in ['All', 'Invoiced', 'Uninvoiced']" :key="tab"
              @click="voCatModalTab = tab"
              :class="voCatModalTab === tab
                ? (voCatModal.isBasePO ? 'border-amber-500 text-amber-700' : 'border-blue-600 text-blue-700')
                : 'border-transparent text-gray-400 hover:text-gray-600'"
              class="px-3 pb-2.5 text-xs font-semibold border-b-2 transition">
              {{ tab }}
              <span class="ml-1 text-gray-400 font-normal">
                ({{ tab === 'All' ? voCatModal.vos.length : tab === 'Invoiced' ? voCatModal.invoiced : voCatModal.uninvoiced }})
              </span>
            </button>
          </div>
          <!-- Table -->
          <div class="flex-1 overflow-auto">
            <table class="w-full text-sm border-collapse">
              <thead class="sticky top-0 z-10">
                <tr>
                  <th class="px-5 py-3 bg-gray-100 border-b border-gray-200 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Site</th>
                  <th class="px-4 py-3 bg-gray-100 border-b border-gray-200 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">Scope</th>
                  <th class="px-4 py-3 bg-gray-100 border-b border-gray-200 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">VO Status</th>
                  <th class="px-4 py-3 bg-gray-100 border-b border-gray-200 text-right text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">Amount</th>
                  <th class="px-4 py-3 bg-gray-100 border-b border-gray-200 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">PO Number</th>
                  <th class="px-4 py-3 bg-gray-100 border-b border-gray-200 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">Invoice Status</th>
                  <th class="px-4 py-3 bg-gray-100 border-b border-gray-200 text-left text-xs font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">Invoice Date</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="vo in voCatModalFilteredVOs" :key="vo.id"
                  :class="vo.invoiceStatus === 'SIT Completed' && vo.invoiceDate ? 'bg-green-50' : 'hover:bg-gray-50'"
                  class="transition">
                  <td class="px-5 py-3">
                    <div class="flex items-center gap-2">
                      <span class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-semibold shrink-0">{{ vo.siteId || '—' }}</span>
                      <span class="font-medium text-gray-800 truncate max-w-[120px]" :title="vo.siteName">{{ vo.siteName }}</span>
                    </div>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-gray-600">{{ vo.scope || '—' }}</td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', modalStatusBadge(vo.voStatus)]">
                      {{ formatStatus(vo.voStatus) }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-right font-semibold text-gray-800 whitespace-nowrap">{{ formatCurrency(vo.voAmount) }}</td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span v-if="vo.poNumber" class="font-mono text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded">{{ vo.poNumber }}</span>
                    <span v-else class="text-gray-300 text-xs">—</span>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span v-if="vo.invoiceStatus"
                      :class="vo.invoiceStatus === 'To Be Sent to Nokia' ? 'bg-indigo-100 text-indigo-700'
                        : vo.invoiceStatus === 'SIT Completed' ? 'bg-green-100 text-green-700'
                        : vo.invoiceStatus === 'SIT Approved' ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700'"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold">
                      {{ vo.invoiceStatus }}
                    </span>
                    <span v-else class="text-gray-300 text-xs">—</span>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-gray-600">{{ vo.invoiceDate ? new Date(vo.invoiceDate).toLocaleDateString('en-AU') : '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Footer -->
          <div class="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between shrink-0">
            <span class="text-xs text-gray-500">{{ voCatModalFilteredVOs.length }} rows shown</span>
            <button @click="voCatModal = null"
              class="px-5 py-2 text-white rounded-xl text-sm font-semibold transition"
              :class="voCatModal.isBasePO ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'">Close</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ── Row 10: Recent Activity ── -->
    <div class="bg-white rounded-xl border border-blue-100 overflow-hidden">
      <div class="px-6 py-4 border-b border-blue-50 flex items-center justify-between">
        <div>
          <h3 class="font-semibold text-gray-700 text-sm">Recent Activity</h3>
          <p class="text-xs text-gray-400 mt-0.5">Last {{ recentVOs.length }} updated variation orders</p>
        </div>
        <span class="text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg">Sorted by last update</span>
      </div>
      <div v-if="recentVOs.length === 0" class="px-6 py-10 text-center text-gray-400 text-sm">No variation orders yet</div>
      <div v-else class="divide-y divide-gray-50">
        <div v-for="vo in recentVOs" :key="vo.id"
          class="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 transition">
          <div class="w-1.5 h-1.5 rounded-full bg-blue-300 shrink-0 mt-0.5"></div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600 shrink-0">{{ vo.siteId || '—' }}</span>
              <span class="text-sm font-medium text-gray-800 truncate">{{ vo.siteName }}</span>
              <span v-if="vo.jobNumber" class="text-xs font-mono text-gray-400 shrink-0">{{ vo.jobNumber }}</span>
            </div>
            <p class="text-xs text-gray-400 truncate mt-0.5">{{ vo.voDescription }}</p>
          </div>
          <div class="text-right shrink-0">
            <div class="text-sm font-semibold text-gray-800">{{ formatCompact(vo.voAmount) }}</div>
            <div class="text-xs text-gray-400 mt-0.5">{{ formatRelativeTime(vo.updatedAt) }}</div>
          </div>
          <span class="shrink-0 px-2.5 py-1 rounded-full text-xs font-medium border border-blue-100 text-blue-600 bg-blue-50 capitalize">
            {{ formatStatus(vo.voStatus) }}
          </span>
        </div>
      </div>
    </div>

  </div>

  <!-- ── Not Yet Invoiced Detail Slide-over ── -->
  <Teleport to="body">
    <div v-if="notYetInvScope" class="fixed inset-0 z-50 flex">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="notYetInvScope = null; notYetInvType = null"></div>
      <!-- Panel — wider to fit all columns comfortably -->
      <div class="relative ml-auto w-full bg-white h-full shadow-2xl flex flex-col" style="max-width: 920px;">

        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shrink-0">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="text-base font-bold text-gray-900">Not Yet Invoiced</h3>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700 shrink-0">{{ notYetInvScope.scope }}</span>
                <span v-if="notYetInvType === 'vo'"       class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">VO only</span>
                <span v-if="notYetInvType === 'service'"  class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">Service only</span>
                <span v-if="notYetInvType === '3rdParty'" class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700">3rd Party only</span>
                <span v-if="notYetInvType === 'boq'"        class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">BOQ only</span>
                <span v-if="notYetInvType === 'boqService'"  class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">BOQ Service only</span>
                <span v-if="notYetInvType === 'boq3rdParty'" class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">BOQ 3rd Party only</span>
                <span v-if="notYetInvType === 'basePO'"   class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700">Base PO only</span>
              </div>
              <div class="flex items-center gap-3 mt-0.5 flex-wrap">
                <span class="text-xs text-gray-400">{{ notYetInvItems.all.length }} items with PO not yet invoiced</span>
                <span class="text-xs font-bold text-orange-600">{{ formatCurrency(notYetInvItems.all.reduce((s,v)=>s+(v.voAmount||0),0)) }}</span>
                <!-- Section pills — shown when viewing all types -->
                <div v-if="!notYetInvType" class="flex items-center gap-1.5">
                  <span v-if="notYetInvItems.vo.length"     class="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-700">VO ×{{ notYetInvItems.vo.length }}</span>
                  <span v-if="notYetInvItems.boq.length"    class="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-700">BOQ ×{{ notYetInvItems.boq.length }}</span>
                  <span v-if="notYetInvItems.basePO.length" class="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-700">Base PO ×{{ notYetInvItems.basePO.length }}</span>
                </div>
              </div>
            </div>
          </div>
          <button @click="notYetInvScope = null; notYetInvType = null"
            class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition shrink-0 ml-4">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Scrollable body — single table with sticky section headers -->
        <div class="flex-1 overflow-y-auto">
          <div v-if="notYetInvItems.all.length === 0" class="flex items-center justify-center h-40 text-gray-400 text-sm">
            No un-invoiced items found for this scope.
          </div>

          <!-- Shared table (all sections in one scroll container with sticky dividers) -->
          <table v-else class="w-full text-xs border-collapse" style="min-width: 800px;">
            <thead class="sticky top-0 z-10">
              <tr>
                <th class="px-4 py-2.5 text-left font-semibold text-white uppercase tracking-wider whitespace-nowrap bg-gray-600 w-16">Site ID</th>
                <th class="px-4 py-2.5 text-left font-semibold text-white uppercase tracking-wider bg-gray-600">Site Name</th>
                <th class="px-4 py-2.5 text-left font-semibold text-white uppercase tracking-wider bg-gray-600 relative select-none"
                    :style="{ width: descColWidth + 'px', minWidth: '80px' }">
                  Description
                  <!-- resize handle -->
                  <div @mousedown.prevent="onDescResizeStart"
                    class="absolute right-0 top-0 h-full w-2.5 cursor-col-resize flex items-center justify-center group z-10"
                    title="Drag to resize">
                    <div class="w-0.5 h-5 bg-white/30 group-hover:bg-white/80 rounded-full transition-colors"></div>
                  </div>
                </th>
                <th class="px-4 py-2.5 text-left font-semibold text-white uppercase tracking-wider whitespace-nowrap bg-gray-600 w-24">Category</th>
                <th class="px-4 py-2.5 text-left font-semibold text-white uppercase tracking-wider whitespace-nowrap bg-gray-600 w-28">PO Number</th>
                <th class="px-4 py-2.5 text-left font-semibold text-white uppercase tracking-wider whitespace-nowrap bg-gray-600 w-40">Invoice Status</th>
                <th class="px-4 py-2.5 text-right font-semibold text-white uppercase tracking-wider whitespace-nowrap bg-gray-600 w-28">Amount</th>
              </tr>
            </thead>
            <tbody>

              <!-- ── Service VO rows ── -->
              <template v-if="notYetInvItems.service.length > 0 && notYetInvType === 'service'">
                <tr class="sticky top-[41px] z-10">
                  <td colspan="7" class="px-4 py-2 bg-blue-600 text-white font-bold text-xs uppercase tracking-wider">
                    <div class="flex items-center justify-between">
                      <span>Service VOs — {{ notYetInvItems.service.length }} items</span>
                      <span>{{ formatCurrency(notYetInvItems.service.reduce((s,v)=>s+(v.voAmount||0),0)) }}</span>
                    </div>
                  </td>
                </tr>
                <tr v-for="vo in notYetInvItems.service" :key="vo.id"
                  class="border-b border-gray-100 hover:bg-blue-50/50 transition">
                  <td class="px-4 py-2 font-bold text-gray-800 whitespace-nowrap">{{ vo.siteId || '—' }}</td>
                  <td class="px-4 py-2 text-gray-600 whitespace-nowrap">{{ vo.siteName || '—' }}</td>
                  <td class="px-4 py-2 text-gray-600 overflow-hidden" :style="{ width: descColWidth + 'px', maxWidth: descColWidth + 'px' }">
                    <div class="truncate" :title="vo.voDescription">{{ vo.voDescription || '—' }}</div>
                  </td>
                  <td class="px-4 py-2 text-gray-500 whitespace-nowrap">{{ vo.voCategory || '—' }}</td>
                  <td class="px-4 py-2 font-medium text-teal-700 whitespace-nowrap">{{ vo.poNumber || '—' }}</td>
                  <td class="px-4 py-2 whitespace-nowrap">
                    <span v-if="vo.invoiceStatus" class="px-2 py-0.5 rounded-full text-xs font-semibold"
                      :class="notYetInvStatusClass(vo.invoiceStatus)">{{ vo.invoiceStatus }}</span>
                    <span v-else class="text-gray-300">Not Set</span>
                  </td>
                  <td class="px-4 py-2 text-right font-semibold text-gray-800 whitespace-nowrap">{{ formatCurrency(vo.voAmount) }}</td>
                </tr>
                <tr class="border-b-2 border-blue-200">
                  <td colspan="6" class="px-4 py-1.5 text-right text-xs font-bold text-blue-600 bg-blue-50 uppercase tracking-wider">Service Subtotal</td>
                  <td class="px-4 py-1.5 text-right text-xs font-bold text-blue-700 bg-blue-50">{{ formatCurrency(notYetInvItems.service.reduce((s,v)=>s+(v.voAmount||0),0)) }}</td>
                </tr>
              </template>

              <!-- ── 3rd Party VO rows ── -->
              <template v-if="notYetInvItems.thirdParty.length > 0 && notYetInvType === '3rdParty'">
                <tr class="sticky top-[41px] z-10">
                  <td colspan="7" class="px-4 py-2 bg-orange-500 text-white font-bold text-xs uppercase tracking-wider">
                    <div class="flex items-center justify-between">
                      <span>3rd Party VOs — {{ notYetInvItems.thirdParty.length }} items</span>
                      <span>{{ formatCurrency(notYetInvItems.thirdParty.reduce((s,v)=>s+(v.voAmount||0),0)) }}</span>
                    </div>
                  </td>
                </tr>
                <tr v-for="vo in notYetInvItems.thirdParty" :key="vo.id"
                  class="border-b border-gray-100 hover:bg-orange-50/50 transition">
                  <td class="px-4 py-2 font-bold text-gray-800 whitespace-nowrap">{{ vo.siteId || '—' }}</td>
                  <td class="px-4 py-2 text-gray-600 whitespace-nowrap">{{ vo.siteName || '—' }}</td>
                  <td class="px-4 py-2 text-gray-600 overflow-hidden" :style="{ width: descColWidth + 'px', maxWidth: descColWidth + 'px' }">
                    <div class="truncate" :title="vo.voDescription">{{ vo.voDescription || '—' }}</div>
                  </td>
                  <td class="px-4 py-2 text-gray-500 whitespace-nowrap">{{ vo.voCategory || '—' }}</td>
                  <td class="px-4 py-2 font-medium text-teal-700 whitespace-nowrap">{{ vo.poNumber || '—' }}</td>
                  <td class="px-4 py-2 whitespace-nowrap">
                    <span v-if="vo.invoiceStatus" class="px-2 py-0.5 rounded-full text-xs font-semibold"
                      :class="notYetInvStatusClass(vo.invoiceStatus)">{{ vo.invoiceStatus }}</span>
                    <span v-else class="text-gray-300">Not Set</span>
                  </td>
                  <td class="px-4 py-2 text-right font-semibold text-gray-800 whitespace-nowrap">{{ formatCurrency(vo.voAmount) }}</td>
                </tr>
                <tr class="border-b-2 border-orange-200">
                  <td colspan="6" class="px-4 py-1.5 text-right text-xs font-bold text-orange-600 bg-orange-50 uppercase tracking-wider">3rd Party Subtotal</td>
                  <td class="px-4 py-1.5 text-right text-xs font-bold text-orange-700 bg-orange-50">{{ formatCurrency(notYetInvItems.thirdParty.reduce((s,v)=>s+(v.voAmount||0),0)) }}</td>
                </tr>
              </template>

              <!-- ── VO rows ── -->
              <template v-if="notYetInvItems.vo.length > 0 && (!notYetInvType || notYetInvType === 'vo')">
                <tr class="sticky top-[41px] z-10">
                  <td colspan="7" class="px-4 py-2 bg-blue-600 text-white font-bold text-xs uppercase tracking-wider">
                    <div class="flex items-center justify-between">
                      <span>Variation Orders (VO) — {{ notYetInvItems.vo.length }} items</span>
                      <span>{{ formatCurrency(notYetInvItems.vo.reduce((s,v)=>s+(v.voAmount||0),0)) }}</span>
                    </div>
                  </td>
                </tr>
                <tr v-for="vo in notYetInvItems.vo" :key="vo.id"
                  class="border-b border-gray-100 hover:bg-blue-50/50 transition">
                  <td class="px-4 py-2 font-bold text-gray-800 whitespace-nowrap">{{ vo.siteId || '—' }}</td>
                  <td class="px-4 py-2 text-gray-600 whitespace-nowrap">{{ vo.siteName || '—' }}</td>
                  <td class="px-4 py-2 text-gray-600 overflow-hidden" :style="{ width: descColWidth + 'px', maxWidth: descColWidth + 'px' }">
                    <div class="truncate" :title="vo.voDescription">{{ vo.voDescription || '—' }}</div>
                  </td>
                  <td class="px-4 py-2 text-gray-500 whitespace-nowrap">{{ vo.voCategory || '—' }}</td>
                  <td class="px-4 py-2 font-medium text-teal-700 whitespace-nowrap">{{ vo.poNumber || '—' }}</td>
                  <td class="px-4 py-2 whitespace-nowrap">
                    <span v-if="vo.invoiceStatus" class="px-2 py-0.5 rounded-full text-xs font-semibold"
                      :class="notYetInvStatusClass(vo.invoiceStatus)">{{ vo.invoiceStatus }}</span>
                    <span v-else class="text-gray-300">Not Set</span>
                  </td>
                  <td class="px-4 py-2 text-right font-semibold text-gray-800 whitespace-nowrap">{{ formatCurrency(vo.voAmount) }}</td>
                </tr>
                <tr class="border-b-2 border-blue-200">
                  <td colspan="6" class="px-4 py-1.5 text-right text-xs font-bold text-blue-600 bg-blue-50 uppercase tracking-wider">VO Subtotal</td>
                  <td class="px-4 py-1.5 text-right text-xs font-bold text-blue-700 bg-blue-50">{{ formatCurrency(notYetInvItems.vo.reduce((s,v)=>s+(v.voAmount||0),0)) }}</td>
                </tr>
              </template>

              <!-- ── BOQ Service rows ── -->
              <template v-if="notYetInvItems.boqService.length > 0 && notYetInvType === 'boqService'">
                <tr class="sticky top-[41px] z-10">
                  <td colspan="7" class="px-4 py-2 bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider">
                    <div class="flex items-center justify-between">
                      <span>BOQ Service — {{ notYetInvItems.boqService.length }} items</span>
                      <span>{{ formatCurrency(notYetInvItems.boqService.reduce((s,v)=>s+(v.voAmount||0),0)) }}</span>
                    </div>
                  </td>
                </tr>
                <tr v-for="vo in notYetInvItems.boqService" :key="vo.id"
                  class="border-b border-gray-100 hover:bg-emerald-50/50 transition">
                  <td class="px-4 py-2 font-bold text-gray-800 whitespace-nowrap">{{ vo.siteId || '—' }}</td>
                  <td class="px-4 py-2 text-gray-600 whitespace-nowrap">{{ vo.siteName || '—' }}</td>
                  <td class="px-4 py-2 text-gray-600 overflow-hidden" :style="{ width: descColWidth + 'px', maxWidth: descColWidth + 'px' }">
                    <div class="truncate" :title="vo.voDescription">{{ vo.voDescription || '—' }}</div>
                  </td>
                  <td class="px-4 py-2 text-gray-500 whitespace-nowrap">{{ vo.voCategory || '—' }}</td>
                  <td class="px-4 py-2 font-medium text-teal-700 whitespace-nowrap">{{ vo.poNumber || '—' }}</td>
                  <td class="px-4 py-2 whitespace-nowrap">
                    <span v-if="vo.invoiceStatus" class="px-2 py-0.5 rounded-full text-xs font-semibold"
                      :class="notYetInvStatusClass(vo.invoiceStatus)">{{ vo.invoiceStatus }}</span>
                    <span v-else class="text-gray-300">Not Set</span>
                  </td>
                  <td class="px-4 py-2 text-right font-semibold text-gray-800 whitespace-nowrap">{{ formatCurrency(vo.voAmount) }}</td>
                </tr>
                <tr class="border-b-2 border-emerald-200">
                  <td colspan="6" class="px-4 py-1.5 text-right text-xs font-bold text-emerald-600 bg-emerald-50 uppercase tracking-wider">BOQ Service Subtotal</td>
                  <td class="px-4 py-1.5 text-right text-xs font-bold text-emerald-700 bg-emerald-50">{{ formatCurrency(notYetInvItems.boqService.reduce((s,v)=>s+(v.voAmount||0),0)) }}</td>
                </tr>
              </template>

              <!-- ── BOQ 3rd Party rows ── -->
              <template v-if="notYetInvItems.boq3rdParty.length > 0 && notYetInvType === 'boq3rdParty'">
                <tr class="sticky top-[41px] z-10">
                  <td colspan="7" class="px-4 py-2 bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider">
                    <div class="flex items-center justify-between">
                      <span>BOQ 3rd Party — {{ notYetInvItems.boq3rdParty.length }} items</span>
                      <span>{{ formatCurrency(notYetInvItems.boq3rdParty.reduce((s,v)=>s+(v.voAmount||0),0)) }}</span>
                    </div>
                  </td>
                </tr>
                <tr v-for="vo in notYetInvItems.boq3rdParty" :key="vo.id"
                  class="border-b border-gray-100 hover:bg-emerald-50/50 transition">
                  <td class="px-4 py-2 font-bold text-gray-800 whitespace-nowrap">{{ vo.siteId || '—' }}</td>
                  <td class="px-4 py-2 text-gray-600 whitespace-nowrap">{{ vo.siteName || '—' }}</td>
                  <td class="px-4 py-2 text-gray-600 overflow-hidden" :style="{ width: descColWidth + 'px', maxWidth: descColWidth + 'px' }">
                    <div class="truncate" :title="vo.voDescription">{{ vo.voDescription || '—' }}</div>
                  </td>
                  <td class="px-4 py-2 text-gray-500 whitespace-nowrap">{{ vo.voCategory || '—' }}</td>
                  <td class="px-4 py-2 font-medium text-teal-700 whitespace-nowrap">{{ vo.poNumber || '—' }}</td>
                  <td class="px-4 py-2 whitespace-nowrap">
                    <span v-if="vo.invoiceStatus" class="px-2 py-0.5 rounded-full text-xs font-semibold"
                      :class="notYetInvStatusClass(vo.invoiceStatus)">{{ vo.invoiceStatus }}</span>
                    <span v-else class="text-gray-300">Not Set</span>
                  </td>
                  <td class="px-4 py-2 text-right font-semibold text-gray-800 whitespace-nowrap">{{ formatCurrency(vo.voAmount) }}</td>
                </tr>
                <tr class="border-b-2 border-emerald-200">
                  <td colspan="6" class="px-4 py-1.5 text-right text-xs font-bold text-emerald-600 bg-emerald-50 uppercase tracking-wider">BOQ 3rd Party Subtotal</td>
                  <td class="px-4 py-1.5 text-right text-xs font-bold text-emerald-700 bg-emerald-50">{{ formatCurrency(notYetInvItems.boq3rdParty.reduce((s,v)=>s+(v.voAmount||0),0)) }}</td>
                </tr>
              </template>

              <!-- ── BOQ rows ── -->
              <template v-if="notYetInvItems.boq.length > 0 && (!notYetInvType || notYetInvType === 'boq')">
                <tr class="sticky top-[41px] z-10">
                  <td colspan="7" class="px-4 py-2 bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider">
                    <div class="flex items-center justify-between">
                      <span>BOQ Related — {{ notYetInvItems.boq.length }} items</span>
                      <span>{{ formatCurrency(notYetInvItems.boq.reduce((s,v)=>s+(v.voAmount||0),0)) }}</span>
                    </div>
                  </td>
                </tr>
                <tr v-for="vo in notYetInvItems.boq" :key="vo.id"
                  class="border-b border-gray-100 hover:bg-emerald-50/50 transition">
                  <td class="px-4 py-2 font-bold text-gray-800 whitespace-nowrap">{{ vo.siteId || '—' }}</td>
                  <td class="px-4 py-2 text-gray-600 whitespace-nowrap">{{ vo.siteName || '—' }}</td>
                  <td class="px-4 py-2 text-gray-600 overflow-hidden" :style="{ width: descColWidth + 'px', maxWidth: descColWidth + 'px' }">
                    <div class="truncate" :title="vo.voDescription">{{ vo.voDescription || '—' }}</div>
                  </td>
                  <td class="px-4 py-2 text-gray-500 whitespace-nowrap">{{ vo.voCategory || '—' }}</td>
                  <td class="px-4 py-2 font-medium text-teal-700 whitespace-nowrap">{{ vo.poNumber || '—' }}</td>
                  <td class="px-4 py-2 whitespace-nowrap">
                    <span v-if="vo.invoiceStatus" class="px-2 py-0.5 rounded-full text-xs font-semibold"
                      :class="notYetInvStatusClass(vo.invoiceStatus)">{{ vo.invoiceStatus }}</span>
                    <span v-else class="text-gray-300">Not Set</span>
                  </td>
                  <td class="px-4 py-2 text-right font-semibold text-gray-800 whitespace-nowrap">{{ formatCurrency(vo.voAmount) }}</td>
                </tr>
                <tr class="border-b-2 border-emerald-200">
                  <td colspan="6" class="px-4 py-1.5 text-right text-xs font-bold text-emerald-600 bg-emerald-50 uppercase tracking-wider">BOQ Subtotal</td>
                  <td class="px-4 py-1.5 text-right text-xs font-bold text-emerald-700 bg-emerald-50">{{ formatCurrency(notYetInvItems.boq.reduce((s,v)=>s+(v.voAmount||0),0)) }}</td>
                </tr>
              </template>

              <!-- ── Base PO rows ── -->
              <template v-if="notYetInvItems.basePO.length > 0 && (!notYetInvType || notYetInvType === 'basePO')">
                <tr class="sticky top-[41px] z-10">
                  <td colspan="7" class="px-4 py-2 bg-amber-500 text-white font-bold text-xs uppercase tracking-wider">
                    <div class="flex items-center justify-between">
                      <span>Base PO — {{ notYetInvItems.basePO.length }} items</span>
                      <span>{{ formatCurrency(notYetInvItems.basePO.reduce((s,v)=>s+(v.voAmount||0),0)) }}</span>
                    </div>
                  </td>
                </tr>
                <tr v-for="vo in notYetInvItems.basePO" :key="vo.id"
                  class="border-b border-gray-100 hover:bg-amber-50/50 transition">
                  <td class="px-4 py-2 font-bold text-gray-800 whitespace-nowrap">{{ vo.siteId || '—' }}</td>
                  <td class="px-4 py-2 text-gray-600 whitespace-nowrap">{{ vo.siteName || '—' }}</td>
                  <td class="px-4 py-2 text-gray-600 overflow-hidden" :style="{ width: descColWidth + 'px', maxWidth: descColWidth + 'px' }">
                    <div class="truncate" :title="vo.voDescription">{{ vo.voDescription || '—' }}</div>
                  </td>
                  <td class="px-4 py-2 text-gray-500 whitespace-nowrap">{{ vo.voCategory || '—' }}</td>
                  <td class="px-4 py-2 font-medium text-teal-700 whitespace-nowrap">{{ vo.poNumber || '—' }}</td>
                  <td class="px-4 py-2 whitespace-nowrap">
                    <span v-if="vo.invoiceStatus" class="px-2 py-0.5 rounded-full text-xs font-semibold"
                      :class="notYetInvStatusClass(vo.invoiceStatus)">{{ vo.invoiceStatus }}</span>
                    <span v-else class="text-gray-300">Not Set</span>
                  </td>
                  <td class="px-4 py-2 text-right font-semibold text-gray-800 whitespace-nowrap">{{ formatCurrency(vo.voAmount) }}</td>
                </tr>
                <tr class="border-b-2 border-amber-200">
                  <td colspan="6" class="px-4 py-1.5 text-right text-xs font-bold text-amber-600 bg-amber-50 uppercase tracking-wider">Base PO Subtotal</td>
                  <td class="px-4 py-1.5 text-right text-xs font-bold text-amber-700 bg-amber-50">{{ formatCurrency(notYetInvItems.basePO.reduce((s,v)=>s+(v.voAmount||0),0)) }}</td>
                </tr>
              </template>

            </tbody>
          </table>
        </div>

        <!-- Footer -->
        <div class="shrink-0 border-t-2 border-gray-200 px-6 py-3 bg-gray-50 flex items-center justify-between gap-4 flex-wrap">
          <div class="flex items-center gap-3">
            <span v-if="notYetInvItems.vo.length" class="text-xs text-blue-600 font-medium">VO: {{ formatCurrency(notYetInvItems.vo.reduce((s,v)=>s+(v.voAmount||0),0)) }}</span>
            <span v-if="notYetInvItems.vo.length && (notYetInvItems.boq.length || notYetInvItems.basePO.length)" class="text-gray-300">·</span>
            <span v-if="notYetInvItems.boq.length" class="text-xs text-emerald-600 font-medium">BOQ: {{ formatCurrency(notYetInvItems.boq.reduce((s,v)=>s+(v.voAmount||0),0)) }}</span>
            <span v-if="notYetInvItems.boq.length && notYetInvItems.basePO.length" class="text-gray-300">·</span>
            <span v-if="notYetInvItems.basePO.length" class="text-xs text-amber-600 font-medium">Base PO: {{ formatCurrency(notYetInvItems.basePO.reduce((s,v)=>s+(v.voAmount||0),0)) }}</span>
          </div>
          <span class="text-sm font-bold text-orange-600">Grand Total: {{ formatCurrency(notYetInvItems.all.reduce((s,v)=>s+(v.voAmount||0),0)) }}</span>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- ── No PO Detail Slide-over ── -->
  <Teleport to="body">
    <div v-if="noPOScope" class="fixed inset-0 z-50 flex">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="noPOScope = null; noPOType = null"></div>
      <div class="relative ml-auto w-full bg-white h-full shadow-2xl flex flex-col" style="max-width: 920px;">

        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shrink-0">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="text-base font-bold text-gray-900">No PO</h3>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700 shrink-0">{{ noPOScope.scope }}</span>
                <span v-if="noPOType === 'vo'"     class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">VO only</span>
                <span v-if="noPOType === 'boq'"    class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">BOQ only</span>
                <span v-if="noPOType === 'basePO'" class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700">Base PO only</span>
              </div>
              <div class="flex items-center gap-3 mt-0.5 flex-wrap">
                <span class="text-xs text-gray-400">{{ noPOItems.all.length }} items without a PO number</span>
                <span class="text-xs font-bold text-gray-600">{{ formatCurrency(noPOItems.all.reduce((s,v)=>s+(v.voAmount||0),0)) }}</span>
                <div v-if="!noPOType" class="flex items-center gap-1.5">
                  <span v-if="noPOItems.vo.length"     class="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-700">VO ×{{ noPOItems.vo.length }}</span>
                  <span v-if="noPOItems.boq.length"    class="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-700">BOQ ×{{ noPOItems.boq.length }}</span>
                  <span v-if="noPOItems.basePO.length" class="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-700">Base PO ×{{ noPOItems.basePO.length }}</span>
                </div>
              </div>
            </div>
          </div>
          <button @click="noPOScope = null; noPOType = null"
            class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition shrink-0 ml-4">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto">
          <div v-if="noPOItems.all.length === 0" class="flex items-center justify-center h-40 text-gray-400 text-sm">
            No items without a PO found for this scope.
          </div>
          <table v-else class="w-full text-xs border-collapse" style="min-width: 700px;">
            <thead class="sticky top-0 z-10">
              <tr>
                <th class="px-4 py-2.5 text-left font-semibold text-white uppercase tracking-wider whitespace-nowrap bg-gray-600 w-16">Site ID</th>
                <th class="px-4 py-2.5 text-left font-semibold text-white uppercase tracking-wider bg-gray-600">Site Name</th>
                <th class="px-4 py-2.5 text-left font-semibold text-white uppercase tracking-wider bg-gray-600">Description</th>
                <th class="px-4 py-2.5 text-left font-semibold text-white uppercase tracking-wider whitespace-nowrap bg-gray-600 w-24">Category</th>
                <th class="px-4 py-2.5 text-left font-semibold text-white uppercase tracking-wider whitespace-nowrap bg-gray-600 w-28">Status</th>
                <th class="px-4 py-2.5 text-right font-semibold text-white uppercase tracking-wider whitespace-nowrap bg-gray-600 w-28">Amount</th>
              </tr>
            </thead>
            <tbody>

              <!-- ── VO rows ── -->
              <template v-if="noPOItems.vo.length > 0 && (!noPOType || noPOType === 'vo')">
                <tr class="sticky top-[41px] z-10">
                  <td colspan="6" class="px-4 py-2 bg-blue-600 text-white font-bold text-xs uppercase tracking-wider">
                    <div class="flex items-center justify-between">
                      <span>Variation Orders (VO) — {{ noPOItems.vo.length }} items</span>
                      <span>{{ formatCurrency(noPOItems.vo.reduce((s,v)=>s+(v.voAmount||0),0)) }}</span>
                    </div>
                  </td>
                </tr>
                <tr v-for="vo in noPOItems.vo" :key="vo.id" class="border-b border-gray-100 hover:bg-blue-50/50 transition">
                  <td class="px-4 py-2 font-bold text-gray-800 whitespace-nowrap">{{ vo.siteId || '—' }}</td>
                  <td class="px-4 py-2 text-gray-600 whitespace-nowrap">{{ vo.siteName || '—' }}</td>
                  <td class="px-4 py-2 text-gray-600 max-w-xs"><div class="truncate" :title="vo.voDescription">{{ vo.voDescription || '—' }}</div></td>
                  <td class="px-4 py-2 text-gray-500 whitespace-nowrap">{{ vo.voCategory || '—' }}</td>
                  <td class="px-4 py-2 whitespace-nowrap">
                    <span class="px-2 py-0.5 rounded-full text-xs font-semibold" :class="notYetInvStatusClass(vo.voStatus)">{{ formatStatus(vo.voStatus) }}</span>
                  </td>
                  <td class="px-4 py-2 text-right font-semibold text-gray-800 whitespace-nowrap">{{ formatCurrency(vo.voAmount) }}</td>
                </tr>
                <tr class="border-b-2 border-blue-200">
                  <td colspan="5" class="px-4 py-1.5 text-right text-xs font-bold text-blue-600 bg-blue-50 uppercase tracking-wider">VO Subtotal</td>
                  <td class="px-4 py-1.5 text-right text-xs font-bold text-blue-700 bg-blue-50">{{ formatCurrency(noPOItems.vo.reduce((s,v)=>s+(v.voAmount||0),0)) }}</td>
                </tr>
              </template>

              <!-- ── BOQ rows ── -->
              <template v-if="noPOItems.boq.length > 0 && (!noPOType || noPOType === 'boq')">
                <tr class="sticky top-[41px] z-10">
                  <td colspan="6" class="px-4 py-2 bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider">
                    <div class="flex items-center justify-between">
                      <span>BOQ Related — {{ noPOItems.boq.length }} items</span>
                      <span>{{ formatCurrency(noPOItems.boq.reduce((s,v)=>s+(v.voAmount||0),0)) }}</span>
                    </div>
                  </td>
                </tr>
                <tr v-for="vo in noPOItems.boq" :key="vo.id" class="border-b border-gray-100 hover:bg-emerald-50/50 transition">
                  <td class="px-4 py-2 font-bold text-gray-800 whitespace-nowrap">{{ vo.siteId || '—' }}</td>
                  <td class="px-4 py-2 text-gray-600 whitespace-nowrap">{{ vo.siteName || '—' }}</td>
                  <td class="px-4 py-2 text-gray-600 max-w-xs"><div class="truncate" :title="vo.voDescription">{{ vo.voDescription || '—' }}</div></td>
                  <td class="px-4 py-2 text-gray-500 whitespace-nowrap">{{ vo.voCategory || '—' }}</td>
                  <td class="px-4 py-2 whitespace-nowrap">
                    <span class="px-2 py-0.5 rounded-full text-xs font-semibold" :class="notYetInvStatusClass(vo.voStatus)">{{ formatStatus(vo.voStatus) }}</span>
                  </td>
                  <td class="px-4 py-2 text-right font-semibold text-gray-800 whitespace-nowrap">{{ formatCurrency(vo.voAmount) }}</td>
                </tr>
                <tr class="border-b-2 border-emerald-200">
                  <td colspan="5" class="px-4 py-1.5 text-right text-xs font-bold text-emerald-600 bg-emerald-50 uppercase tracking-wider">BOQ Subtotal</td>
                  <td class="px-4 py-1.5 text-right text-xs font-bold text-emerald-700 bg-emerald-50">{{ formatCurrency(noPOItems.boq.reduce((s,v)=>s+(v.voAmount||0),0)) }}</td>
                </tr>
              </template>

              <!-- ── Base PO rows ── -->
              <template v-if="noPOItems.basePO.length > 0 && (!noPOType || noPOType === 'basePO')">
                <tr class="sticky top-[41px] z-10">
                  <td colspan="6" class="px-4 py-2 bg-amber-500 text-white font-bold text-xs uppercase tracking-wider">
                    <div class="flex items-center justify-between">
                      <span>Base PO — {{ noPOItems.basePO.length }} items</span>
                      <span>{{ formatCurrency(noPOItems.basePO.reduce((s,v)=>s+(v.voAmount||0),0)) }}</span>
                    </div>
                  </td>
                </tr>
                <tr v-for="vo in noPOItems.basePO" :key="vo.id" class="border-b border-gray-100 hover:bg-amber-50/50 transition">
                  <td class="px-4 py-2 font-bold text-gray-800 whitespace-nowrap">{{ vo.siteId || '—' }}</td>
                  <td class="px-4 py-2 text-gray-600 whitespace-nowrap">{{ vo.siteName || '—' }}</td>
                  <td class="px-4 py-2 text-gray-600 max-w-xs"><div class="truncate" :title="vo.voDescription">{{ vo.voDescription || '—' }}</div></td>
                  <td class="px-4 py-2 text-gray-500 whitespace-nowrap">{{ vo.voCategory || '—' }}</td>
                  <td class="px-4 py-2 whitespace-nowrap">
                    <span class="px-2 py-0.5 rounded-full text-xs font-semibold" :class="notYetInvStatusClass(vo.voStatus)">{{ formatStatus(vo.voStatus) }}</span>
                  </td>
                  <td class="px-4 py-2 text-right font-semibold text-gray-800 whitespace-nowrap">{{ formatCurrency(vo.voAmount) }}</td>
                </tr>
                <tr class="border-b-2 border-amber-200">
                  <td colspan="5" class="px-4 py-1.5 text-right text-xs font-bold text-amber-600 bg-amber-50 uppercase tracking-wider">Base PO Subtotal</td>
                  <td class="px-4 py-1.5 text-right text-xs font-bold text-amber-700 bg-amber-50">{{ formatCurrency(noPOItems.basePO.reduce((s,v)=>s+(v.voAmount||0),0)) }}</td>
                </tr>
              </template>

            </tbody>
          </table>
        </div>

        <!-- Footer -->
        <div class="px-6 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between shrink-0 flex-wrap gap-2">
          <div class="flex items-center gap-2 flex-wrap">
            <span v-if="noPOItems.vo.length"     class="text-xs text-blue-600 font-medium">VO: {{ formatCurrency(noPOItems.vo.reduce((s,v)=>s+(v.voAmount||0),0)) }}</span>
            <span v-if="noPOItems.vo.length && (noPOItems.boq.length || noPOItems.basePO.length)" class="text-gray-300">·</span>
            <span v-if="noPOItems.boq.length"    class="text-xs text-emerald-600 font-medium">BOQ: {{ formatCurrency(noPOItems.boq.reduce((s,v)=>s+(v.voAmount||0),0)) }}</span>
            <span v-if="noPOItems.boq.length && noPOItems.basePO.length" class="text-gray-300">·</span>
            <span v-if="noPOItems.basePO.length" class="text-xs text-amber-600 font-medium">Base PO: {{ formatCurrency(noPOItems.basePO.reduce((s,v)=>s+(v.voAmount||0),0)) }}</span>
          </div>
          <span class="text-sm font-bold text-gray-700">Grand Total: {{ formatCurrency(noPOItems.all.reduce((s,v)=>s+(v.voAmount||0),0)) }}</span>
        </div>

      </div>
    </div>
  </Teleport>

</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { Doughnut, Bar, Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Filler,
  Title,
} from 'chart.js'
import { useVOStore } from '../stores/voStore'
import { formatCurrency, formatCompact } from '../utils/formatters'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Filler, Title)

const store = useVOStore()
const now = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })

// ── PO & Invoice Cost to Complete column ──
const ctcMonth = ref('')   // '' = all months, 'YYYY-MM' = one month

// Bumped whenever SiteStatusView saves, so computeds that read localStorage re-run.
const siteStatusRevision = ref(0)
function onSiteStatusUpdated() { siteStatusRevision.value++ }
onMounted(() => window.addEventListener('siteStatusUpdated', onSiteStatusUpdated))
onUnmounted(() => window.removeEventListener('siteStatusUpdated', onSiteStatusUpdated))

const ctcAllMonths = computed(() => {
  void siteStatusRevision.value  // reactive dependency
  let raw
  try { raw = JSON.parse(localStorage.getItem('siteStatusData') || '{}') } catch { raw = {} }
  const map = {}
  for (const d of Object.values(raw)) {
    for (const e of (d.costEntries || [])) {
      if (!e.date) continue
      const dt = new Date(e.date)
      if (isNaN(dt)) continue
      const key   = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`
      const label = dt.toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })
      map[key] = label
    }
  }
  return Object.entries(map).sort(([a], [b]) => a.localeCompare(b)).map(([value, label]) => ({ value, label }))
})

// Cost to complete per scope from Site Status, optionally filtered to one month.
// Sites with multiple scopes have their cost split evenly across each scope.
const costToCompleteByScope = computed(() => {
  void siteStatusRevision.value  // reactive dependency
  let raw
  try { raw = JSON.parse(localStorage.getItem('siteStatusData') || '{}') } catch { raw = {} }
  const scopeMap = {}
  for (const [key, d] of Object.entries(raw)) {
    if (filteredSiteKeys.value && !filteredSiteKeys.value.has(key)) continue
    const entries = Array.isArray(d.costEntries) ? d.costEntries : []
    const scopes  = Array.isArray(d.scopes) && d.scopes.length > 0 ? d.scopes : ['(No Scope)']
    const filtered = ctcMonth.value
      ? entries.filter(e => {
          if (!e.date) return false
          const dt = new Date(e.date)
          if (isNaN(dt)) return false
          return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}` === ctcMonth.value
        })
      : entries
    const siteCost = filtered.reduce((s, e) => s + calcEntryCostDash(e), 0)
    if (!siteCost) continue
    const costPerScope = siteCost / scopes.length
    for (const scope of scopes) scopeMap[scope] = (scopeMap[scope] || 0) + costPerScope
  }
  return scopeMap  // { scope: totalCost }
})

// ── PO & Invoice site-status filter ──
const poInvoiceSiteFilter = ref('all')  // 'all' | 'started' | 'not-started'

function getSiteStatusMap() {
  try { return JSON.parse(localStorage.getItem('siteStatusData') || '{}') } catch { return {} }
}

// Set of "siteId|jobNumber" keys that match the current site filter
const filteredSiteKeys = computed(() => {
  void siteStatusRevision.value  // reactive dependency
  if (poInvoiceSiteFilter.value === 'all') return null
  const data = getSiteStatusMap()
  const keys = new Set()
  for (const [key, entry] of Object.entries(data)) {
    if (entry.status === poInvoiceSiteFilter.value) keys.add(key)
  }
  return keys
})

function voMatchesSiteFilter(vo) {
  if (!filteredSiteKeys.value) return true
  const key = `${vo.siteId || ''}|${vo.jobNumber || ''}`
  return filteredSiteKeys.value.has(key)
}

// ── Collapsible section state ──
const poInvoiceOpen  = ref(false)  // PO & Invoice Summary collapsed by default
const basePOOpen     = ref(false)  // Base PO Summary collapsed by default
const satSitOpen     = ref(false)  // SAT&SIT Not Yet Invoiced collapsed by default
const snagCiOpen     = ref(false)  // Snag Closure & C&I Not Yet Invoiced collapsed by default
const notYetInvScope = ref(null)   // selected scope row for drill-down modal
const notYetInvType  = ref(null)   // 'vo' | 'boq' | 'basePO' | null (all)

const noPOScope = ref(null)        // selected scope row for No PO drill-down
const noPOType  = ref(null)        // 'vo' | 'boq' | 'basePO' | null (all)
const descColWidth   = ref(220)    // resizable description column width (px)

const openNotYetInvDetail = (row, type = null) => {
  notYetInvScope.value = row
  notYetInvType.value  = type
}

const openNoPODetail = (row, type = null) => {
  noPOScope.value = row
  noPOType.value  = type
}

const onDescResizeStart = (e) => {
  const startX = e.clientX
  const startW = descColWidth.value
  const onMove = (me) => {
    descColWidth.value = Math.max(80, startW + me.clientX - startX)
  }
  const onUp = () => {
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
  }
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

const notYetInvStatusClass = (status) => {
  const map = {
    'Not Yet Sent':        'bg-gray-100 text-gray-500',
    'To Be Sent to Nokia': 'bg-indigo-100 text-indigo-700',
    'Request to Nokia':    'bg-blue-100 text-blue-700',
    'SIT Approved':      'bg-yellow-100 text-yellow-700',
    'SIT Completed':       'bg-green-100 text-green-700',
  }
  return map[status] || 'bg-gray-100 text-gray-500'
}

// VOs that have a PO but are NOT yet fully invoiced (SIT Completed + invoiceDate)
const notYetInvItems = computed(() => {
  if (!notYetInvScope.value) return { vo: [], boq: [], basePO: [], service: [], thirdParty: [], boqService: [], boq3rdParty: [], all: [] }
  const targetScope = notYetInvScope.value.scope

  const isNotYetInv = (vo) =>
    !!vo.poNumber?.trim() && !(vo.invoiceStatus === 'SIT Completed' && !!vo.invoiceDate)

  const sortBySiteId = (arr) =>
    [...arr].sort((a, b) => (a.siteId || '').localeCompare(b.siteId || '', undefined, { numeric: true }))

  const scopeMatch = (vo) => (vo.scope?.trim() || '(No Scope)') === targetScope

  const allInScope = [
    ...voItems.value.filter(scopeMatch),
    ...basePOItems.value.filter(scopeMatch),
  ].filter(v => isNotYetInv(v) && voMatchesSiteFilter(v))

  const vo       = sortBySiteId(allInScope.filter(v => !isBasePO(v) && !(v.boqRelated === true || v.boqRelated === 'yes')))
  const boq      = sortBySiteId(allInScope.filter(v => !isBasePO(v) && (v.boqRelated === true || v.boqRelated === 'yes')))
  const basePO   = sortBySiteId(allInScope.filter(v => isBasePO(v)))
  const service      = sortBySiteId(vo.filter(v => v.voCategory?.trim() === 'Service'))
  const thirdParty   = sortBySiteId(vo.filter(v => v.voCategory?.trim() === 'Third Party'))
  const boqService   = sortBySiteId(boq.filter(v => v.voCategory?.trim() === 'Service'))
  const boq3rdParty  = sortBySiteId(boq.filter(v => v.voCategory?.trim() === 'Third Party'))

  // 'all' respects the type filter for header counts/totals
  const type = notYetInvType.value
  const filtered = type === 'vo' ? vo : type === 'boq' ? boq : type === 'basePO' ? basePO
    : type === 'service' ? service : type === '3rdParty' ? thirdParty
    : type === 'boqService' ? boqService : type === 'boq3rdParty' ? boq3rdParty
    : allInScope
  return { vo, boq, basePO, service, thirdParty, boqService, boq3rdParty, all: filtered }
})
// VOs that have NO PO — for drill-down modal
const noPOItems = computed(() => {
  if (!noPOScope.value) return { vo: [], boq: [], basePO: [], all: [] }
  const targetScope = noPOScope.value.scope

  const scopeMatch = (vo) => (vo.scope?.trim() || '(No Scope)') === targetScope
  const hasNoPO    = (vo) => !vo.poNumber?.trim()

  const sortBySiteId = (arr) =>
    [...arr].sort((a, b) => (a.siteId || '').localeCompare(b.siteId || '', undefined, { numeric: true }))

  const allInScope = [
    ...voItems.value.filter(scopeMatch),
    ...basePOItems.value.filter(scopeMatch),
  ].filter(v => hasNoPO(v) && voMatchesSiteFilter(v))

  const vo     = sortBySiteId(allInScope.filter(v => !isBasePO(v) && !(v.boqRelated === true || v.boqRelated === 'yes')))
  const boq    = sortBySiteId(allInScope.filter(v => !isBasePO(v) && (v.boqRelated === true || v.boqRelated === 'yes')))
  const basePO = sortBySiteId(allInScope.filter(v => isBasePO(v)))

  const type = noPOType.value
  const filtered = type === 'vo' ? vo : type === 'boq' ? boq : type === 'basePO' ? basePO : allInScope
  return { vo, boq, basePO, all: filtered }
})

const invoicePrepSummary = store.invoicePrepSummary

// ── Base PO category split ──
const BASE_PO_CATEGORIES = new Set(['Site Survey', 'WOP', 'C&I', 'SAT&SIT', 'Snag Closure'])
const isBasePO = (vo) => BASE_PO_CATEGORIES.has(vo.voCategory?.trim())
const voItems   = computed(() => (store.vos.value || []).filter(vo => !isBasePO(vo)))
const basePOItems = computed(() => (store.vos.value || []).filter(isBasePO))

const totalVOs = computed(() => voItems.value.length)

// ── Status cards (Service & Third Party, BOQ Related = No only) ──
const STATUS_CARD_CATEGORIES = new Set(['Service', 'Third Party'])
const statusCards = computed(() => {
  const counts = { draft: 0, submitted: 0, 'pending-approval': 0, approved: 0, rejected: 0 }
  for (const vo of voItems.value) {
    if (!STATUS_CARD_CATEGORIES.has(vo.voCategory?.trim())) continue
    if (vo.boqRelated === true || vo.boqRelated === 'yes') continue
    if (vo.voStatus in counts) counts[vo.voStatus]++
  }
  return [
    { label: 'Draft',     count: counts.draft,               color: 'gray'  },
    { label: 'Submitted', count: counts.submitted,            color: 'blue'  },
    { label: 'Pending',   count: counts['pending-approval'],  color: 'amber' },
    { label: 'Approved',  count: counts.approved,             color: 'green' },
    { label: 'Rejected',  count: counts.rejected,             color: 'red'   },
  ]
})

// ── Financial summary (VO only, BOQ excluded — tracked separately) ──
const nonBOQVOItems = computed(() => voItems.value.filter(vo => !(vo.boqRelated === true || vo.boqRelated === 'yes')))

const voFinancial = computed(() => {
  const res = { draft: 0, submitted: 0, pending: 0, approved: 0, rejected: 0, total: 0 }
  for (const vo of nonBOQVOItems.value) {
    const amt = vo.voAmount || 0
    res.total += amt
    if      (vo.voStatus === 'approved')          res.approved  += amt
    else if (vo.voStatus === 'pending-approval')  res.pending   += amt
    else if (vo.voStatus === 'submitted')          res.submitted += amt
    else if (vo.voStatus === 'draft')              res.draft     += amt
    else if (vo.voStatus === 'rejected')           res.rejected  += amt
  }
  return res
})

const financialCards = computed(() => {
  const fin = voFinancial.value
  const sc  = statusCards.value
  return [
    { label: 'Total Approved',  amount: fin.approved,              sub: `${sc.find(s=>s.label==='Approved')?.count||0} VOs`,  icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',                                                                                                                                                                                                                                                       color: 'green'  },
    { label: 'Total Pending',   amount: fin.pending,               sub: `${sc.find(s=>s.label==='Pending')?.count||0} VOs`,   icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',                                                                                                                                                                                                                                                        color: 'amber'  },
    { label: 'Total VO Value',  amount: fin.total,                 sub: `${nonBOQVOItems.value.length} VOs (excl. BOQ)`,      icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',                                                                                                                      color: 'blue'   },
    { label: 'Total Base PO',   amount: basePOTotals.value.total,  sub: `${basePOTotals.value.count} items`,                  icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',                                                                                                                                                                              amber: true, color: 'orange' },
    { label: 'Total Submitted', amount: fin.submitted,             sub: `${sc.find(s=>s.label==='Submitted')?.count||0} VOs`, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',                                                                                                                                                    color: 'sky'    },
    { label: 'Draft Value',     amount: fin.draft,                 sub: `${sc.find(s=>s.label==='Draft')?.count||0} VOs`,    icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',                                                                                                                                                                               color: 'slate'  },
    { label: 'BOQ Related',     amount: boqTotals.value.boqTotal,  sub: `${boqTotals.value.boqCount} VOs`,                   icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',                                                                                                                                  teal: true, color: 'teal'   },
  ]
})

// ── Base PO by Scope ──
const basePOByScope = computed(() => {
  const map = {}
  for (const vo of basePOItems.value) {
    const scope = vo.scope?.trim() || '(No Scope)'
    if (!map[scope]) map[scope] = { scope, categories: {}, total: 0, havePO: 0, noPO: 0, count: 0 }
    const cat = vo.voCategory?.trim() || '(No Category)'
    if (!map[scope].categories[cat]) map[scope].categories[cat] = { category: cat, amount: 0, havePOAmount: 0, noPOAmount: 0, count: 0 }
    const amt = vo.voAmount || 0
    map[scope].categories[cat].amount += amt
    map[scope].categories[cat].count++
    map[scope].total += amt
    map[scope].count++
    if (vo.poNumber?.trim()) { map[scope].havePO += amt; map[scope].categories[cat].havePOAmount += amt }
    else                     { map[scope].noPO   += amt; map[scope].categories[cat].noPOAmount   += amt }
  }
  return Object.values(map).map(s => ({ ...s, categories: Object.values(s.categories).sort((a,b) => b.amount - a.amount) }))
    .sort((a, b) => b.total - a.total)
})

const basePOTotals = computed(() => basePOByScope.value.reduce(
  (acc, r) => ({ total: acc.total + r.total, havePO: acc.havePO + r.havePO, noPO: acc.noPO + r.noPO, count: acc.count + r.count }),
  { total: 0, havePO: 0, noPO: 0, count: 0 }
))

// ── SAT&SIT Not Yet Invoiced ──
const satSitNotYetInvoiced = computed(() => {
  const items = basePOItems.value.filter(vo =>
    vo.voCategory?.trim() === 'SAT&SIT' &&
    !(vo.invoiceStatus === 'SIT Completed' && !!vo.invoiceDate)
  )
  const sortBySiteId = (arr) =>
    [...arr].sort((a, b) => (a.siteId || '').localeCompare(b.siteId || '', undefined, { numeric: true }))

  const scopeMap = {}
  for (const vo of items) {
    const scope = vo.scope?.trim() || '(No Scope)'
    if (!scopeMap[scope]) scopeMap[scope] = { scope, items: [], total: 0 }
    scopeMap[scope].items.push(vo)
    scopeMap[scope].total += vo.voAmount || 0
  }
  const byScope = Object.values(scopeMap)
    .sort((a, b) => a.scope.localeCompare(b.scope))
    .map(g => ({ ...g, items: sortBySiteId(g.items) }))

  return {
    byScope,
    totalCount: items.length,
    totalAmount: items.reduce((s, v) => s + (v.voAmount || 0), 0),
  }
})

// ── Snag Closure & C&I Not Yet Invoiced ──
const snagCiNotYetInvoiced = computed(() => {
  const CATS = new Set(['Snag Closure', 'C&I'])
  const sortBySiteId = (arr) =>
    [...arr].sort((a, b) => (a.siteId || '').localeCompare(b.siteId || '', undefined, { numeric: true }))

  const items = basePOItems.value.filter(vo =>
    CATS.has(vo.voCategory?.trim()) &&
    !(vo.invoiceStatus === 'SIT Completed' && !!vo.invoiceDate)
  )

  const scopeMap = {}
  for (const vo of items) {
    const scope = vo.scope?.trim() || '(No Scope)'
    if (!scopeMap[scope]) scopeMap[scope] = { scope, items: [], total: 0 }
    scopeMap[scope].items.push(vo)
    scopeMap[scope].total += vo.voAmount || 0
  }
  const byScope = Object.values(scopeMap)
    .sort((a, b) => a.scope.localeCompare(b.scope))
    .map(g => ({ ...g, items: sortBySiteId(g.items) }))

  return {
    byScope,
    totalCount: items.length,
    totalAmount: items.reduce((s, v) => s + (v.voAmount || 0), 0),
  }
})

// ── Chart: Status Doughnut ──
const statusDoughnutData = computed(() => ({
  labels: statusCards.value.map(s => s.label),
  datasets: [{
    data: statusCards.value.map(s => s.count),
    backgroundColor: ['#374151', '#2563eb', '#f59e0b', '#16a34a', '#ef4444'],
    borderColor: ['#fff','#fff','#fff','#fff','#fff'],
    borderWidth: 2,
    hoverOffset: 4,
  }]
}))

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => ` ${ctx.label}: ${ctx.parsed} VOs`
      }
    }
  }
}

// ── Chart: Amount by Status Bar ──
const amountBarData = computed(() => {
  const fin = voFinancial.value
  return {
    labels: ['Draft', 'Submitted', 'Pending', 'Approved', 'Rejected'],
    datasets: [{
      label: 'VO Amount ($)',
      data: [
        fin.draft,
        fin.submitted,
        fin.pending,
        fin.approved,
        fin.rejected,
      ],
      backgroundColor: ['#dbeafe', '#bfdbfe', '#93c5fd', '#3b82f6', '#eff6ff'],
      borderColor:     ['#bfdbfe', '#93c5fd', '#60a5fa', '#2563eb', '#dbeafe'],
      borderWidth: 1,
      borderRadius: 4,
    }]
  }
})

const amountBarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => ` $${ctx.parsed.y.toLocaleString('en-AU', { minimumFractionDigits: 0 })}`
      }
    }
  },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 11 } } },
    y: {
      grid: { color: '#f3f4f6' },
      ticks: {
        font: { size: 10 },
        callback: (v) => '$' + (v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v)
      }
    }
  }
}

// ── Combined PO & Invoice Summary by Scope ──
const poInvoiceSummary = computed(() => {
  const map = {}
  const ensure = (scope) => {
    if (!map[scope]) map[scope] = {
      scope,
      voPO: 0, boqPO: 0, basePOAmt: 0,          // have PO by type
      voNoPO: 0, boqNoPO: 0, baseNoPO: 0,        // no PO by type
      voInvoiced: 0, boqInvoiced: 0, baseInvoiced: 0, // invoiced by type
      voServicePO: 0, vo3rdPartyPO: 0,
      voServiceInvoiced: 0, vo3rdPartyInvoiced: 0,
      boqServicePO: 0, boq3rdPartyPO: 0,
      boqServiceInvoiced: 0, boq3rdPartyInvoiced: 0,
      labourCost: 0, thirdPartyCost: 0,
    }
  }

  // Standard VOs and BOQ VOs (both are in voItems)
  for (const vo of voItems.value.filter(voMatchesSiteFilter)) {
    const isBoq = vo.boqRelated === true || vo.boqRelated === 'yes'
    const scope  = vo.scope?.trim() || '(No Scope)'
    ensure(scope)
    const amt        = vo.voAmount || 0
    const hasPO      = !!vo.poNumber?.trim()
    const isInvoiced = vo.invoiceStatus === 'SIT Completed' && !!vo.invoiceDate
    if (isBoq) {
      if (hasPO) {
        map[scope].boqPO += amt
        if (isInvoiced) map[scope].boqInvoiced += amt
        const cat = vo.voCategory?.trim()
        if (cat === 'Service')     { map[scope].boqServicePO  += amt; if (isInvoiced) map[scope].boqServiceInvoiced  += amt }
        if (cat === 'Third Party') { map[scope].boq3rdPartyPO += amt; if (isInvoiced) map[scope].boq3rdPartyInvoiced += amt }
      } else {
        map[scope].boqNoPO += amt
      }
    } else {
      if (hasPO) {
        map[scope].voPO += amt
        if (isInvoiced) map[scope].voInvoiced += amt
        const cat = vo.voCategory?.trim()
        if (cat === 'Service')      { map[scope].voServicePO  += amt; if (isInvoiced) map[scope].voServiceInvoiced  += amt }
        if (cat === 'Third Party')  { map[scope].vo3rdPartyPO += amt; if (isInvoiced) map[scope].vo3rdPartyInvoiced += amt }
      } else {
        map[scope].voNoPO += amt
      }
    }
    map[scope].labourCost     += vo.labourCost     || 0
    map[scope].thirdPartyCost += vo.thirdPartyCost || 0
  }

  // Base PO items
  for (const vo of basePOItems.value.filter(voMatchesSiteFilter)) {
    const scope  = vo.scope?.trim() || '(No Scope)'
    ensure(scope)
    const amt        = vo.voAmount || 0
    const hasPO      = !!vo.poNumber?.trim()
    const isInvoiced = vo.invoiceStatus === 'SIT Completed' && !!vo.invoiceDate
    if (hasPO) { map[scope].basePOAmt += amt; if (isInvoiced) map[scope].baseInvoiced += amt }
    else         map[scope].baseNoPO   += amt
    map[scope].labourCost     += vo.labourCost     || 0
    map[scope].thirdPartyCost += vo.thirdPartyCost || 0
  }

  return Object.values(map).map(r => {
    const totalHavePO      = r.voPO + r.boqPO + r.basePOAmt
    const totalNoPO        = r.voNoPO + r.boqNoPO + r.baseNoPO
    const total            = totalHavePO + totalNoPO
    const invoiced         = r.voInvoiced + r.boqInvoiced + r.baseInvoiced
    const voNotYetInv         = r.voPO     - r.voInvoiced
    const boqNotYetInv        = r.boqPO    - r.boqInvoiced
    const baseNotYetInv       = r.basePOAmt - r.baseInvoiced
    const notYetInvoiced      = totalHavePO - invoiced
    const voServiceNotYetInv   = r.voServicePO   - r.voServiceInvoiced
    const vo3rdPartyNotYetInv  = r.vo3rdPartyPO  - r.vo3rdPartyInvoiced
    const boqServiceNotYetInv  = r.boqServicePO  - r.boqServiceInvoiced
    const boq3rdPartyNotYetInv = r.boq3rdPartyPO - r.boq3rdPartyInvoiced
    const totalNotYetInv       = voServiceNotYetInv + boqServiceNotYetInv + baseNotYetInv
    const totalCost            = r.labourCost + r.thirdPartyCost
    return { ...r, totalHavePO, totalNoPO, total, invoiced, notYetInvoiced, voNotYetInv, boqNotYetInv, baseNotYetInv, voServiceNotYetInv, vo3rdPartyNotYetInv, boqServiceNotYetInv, boq3rdPartyNotYetInv, totalNotYetInv, totalCost }
  }).sort((a, b) => b.total - a.total)
})

// ── Monthly Invoice Summary ──
const monthlyInvoiceData = computed(() => {
  const voMap = {}, basePOMap = {}, boqMap = {}
  const buildMap = (list, map, boqOnly = false, excludeBoq = false) => {
    for (const vo of list) {
      const isBoq = vo.boqRelated === true || vo.boqRelated === 'yes'
      if (boqOnly && !isBoq) continue
      if (excludeBoq && isBoq) continue
      if (vo.invoiceStatus !== 'SIT Completed' || !vo.invoiceDate) continue
      const d = new Date(vo.invoiceDate)
      if (isNaN(d)) continue
      const key   = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const label = d.toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })
      if (!map[key]) map[key] = { key, label, amount: 0, count: 0 }
      map[key].amount += vo.voAmount || 0
      map[key].count++
    }
  }
  buildMap(voItems.value, voMap, false, true)  // non-BOQ VOs only
  buildMap(basePOItems.value, basePOMap)
  buildMap(voItems.value, boqMap, true)

  // Merge all month keys
  const allKeys = [...new Set([...Object.keys(voMap), ...Object.keys(basePOMap), ...Object.keys(boqMap)])].sort()
  return allKeys.map(key => {
    const fallbackLabel = (voMap[key] || basePOMap[key] || boqMap[key])?.label || key
    const vo    = voMap[key]    || { amount: 0, count: 0 }
    const basePO = basePOMap[key] || { amount: 0, count: 0 }
    const boq    = boqMap[key]   || { amount: 0, count: 0 }
    return { key, label: fallbackLabel, voAmount: vo.amount, voCount: vo.count, basePOAmount: basePO.amount, basePOCount: basePO.count, boqAmount: boq.amount, boqCount: boq.count }
  })
})

const monthlyInvoiceChartData = computed(() => ({
  labels: monthlyInvoiceData.value.map(r => r.label),
  datasets: [
    {
      label: 'VO Invoiced',
      data: monthlyInvoiceData.value.map(r => r.voAmount),
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37,99,235,0.10)',
      borderWidth: 2,
      pointBackgroundColor: '#2563eb',
      pointRadius: 4,
      pointHoverRadius: 6,
      fill: true,
      tension: 0.35,
    },
    {
      label: 'Base PO Invoiced',
      data: monthlyInvoiceData.value.map(r => r.basePOAmount),
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245,158,11,0.08)',
      borderWidth: 2,
      pointBackgroundColor: '#f59e0b',
      pointRadius: 4,
      pointHoverRadius: 6,
      fill: true,
      tension: 0.35,
    },
    {
      label: 'BOQ Related Invoiced',
      data: monthlyInvoiceData.value.map(r => r.boqAmount),
      borderColor: '#10b981',
      backgroundColor: 'rgba(16,185,129,0.08)',
      borderWidth: 2,
      pointBackgroundColor: '#10b981',
      pointRadius: 4,
      pointHoverRadius: 6,
      fill: true,
      tension: 0.35,
    },
  ],
}))

const monthlyInvoiceChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true, position: 'top', labels: { boxWidth: 12, font: { size: 11 } } },
    tooltip: {
      callbacks: {
        label: (ctx) => ` ${ctx.dataset.label}: ${formatCompact(ctx.parsed.y)}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 11 } },
    },
    y: {
      grid: { color: '#f3f4f6' },
      ticks: {
        font: { size: 10 },
        callback: (val) => {
          if (val >= 1_000_000) return '$' + (val / 1_000_000).toFixed(1) + 'M'
          if (val >= 1_000)     return '$' + (val / 1_000).toFixed(0) + 'k'
          return '$' + val
        },
      },
    },
  },
}))

// ── Monthly Cost to Complete ──
function calcEntryCostDash(e) {
  return (parseFloat(e.qtyDays) || 0) * (parseFloat(e.qtyHours) || 0) *
         (parseFloat(e.qtyPeople) || 0) * (parseFloat(e.rate) || 0)
}

const monthlyCostToCompleteData = computed(() => {
  void siteStatusRevision.value  // reactive dependency
  let raw
  try { raw = JSON.parse(localStorage.getItem('siteStatusData') || '{}') } catch { raw = {} }

  const startedMap = {}
  const notStartedMap = {}

  for (const d of Object.values(raw)) {
    const entries = Array.isArray(d.costEntries) ? d.costEntries : []
    const isStarted = (d.status || 'not-started') === 'started'
    for (const e of entries) {
      if (!e.date) continue
      const dt = new Date(e.date)
      if (isNaN(dt)) continue
      const key   = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`
      const label = dt.toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })
      const cost  = calcEntryCostDash(e)
      const map   = isStarted ? startedMap : notStartedMap
      if (!map[key]) map[key] = { key, label, cost: 0, count: 0 }
      map[key].cost  += cost
      map[key].count += 1
    }
  }

  const allKeys = [...new Set([...Object.keys(startedMap), ...Object.keys(notStartedMap)])].sort()
  return allKeys.map(key => {
    const s  = startedMap[key]    || { cost: 0, count: 0 }
    const ns = notStartedMap[key] || { cost: 0, count: 0 }
    const label = (s.label || ns.label) ?? key
    return { key, label, startedCost: s.cost, startedCount: s.count, notStartedCost: ns.cost, notStartedCount: ns.count }
  })
})

const monthlyCostChartData = computed(() => ({
  labels: monthlyCostToCompleteData.value.map(r => r.label),
  datasets: [
    {
      label: 'Started Sites',
      data: monthlyCostToCompleteData.value.map(r => r.startedCost),
      borderColor: '#10b981',
      backgroundColor: 'rgba(16,185,129,0.10)',
      borderWidth: 2,
      pointBackgroundColor: '#10b981',
      pointRadius: 4,
      pointHoverRadius: 6,
      fill: true,
      tension: 0.35,
    },
    {
      label: 'Not Started Sites',
      data: monthlyCostToCompleteData.value.map(r => r.notStartedCost),
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245,158,11,0.08)',
      borderWidth: 2,
      pointBackgroundColor: '#f59e0b',
      pointRadius: 4,
      pointHoverRadius: 6,
      fill: true,
      tension: 0.35,
    },
  ],
}))

const monthlyCostChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true, position: 'top', labels: { boxWidth: 12, font: { size: 11 } } },
    tooltip: {
      callbacks: {
        label: (ctx) => ` ${ctx.dataset.label}: ${formatCompact(ctx.parsed.y)}`,
      },
    },
  },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 11 } } },
    y: {
      grid: { color: '#f3f4f6' },
      ticks: {
        font: { size: 10 },
        callback: (val) => {
          if (val >= 1_000_000) return '$' + (val / 1_000_000).toFixed(1) + 'M'
          if (val >= 1_000)     return '$' + (val / 1_000).toFixed(0) + 'k'
          return '$' + val
        },
      },
    },
  },
}

// ── BOQ by Scope ──
const boqByScope = computed(() => {
  const map = {}
  for (const vo of voItems.value) {
    const scope  = vo.scope?.trim() || '(No Scope)'
    const isBoq  = vo.boqRelated === true || vo.boqRelated === 'yes'
    const hasPO  = !!vo.poNumber?.trim()
    const amt    = vo.voAmount || 0
    if (!map[scope]) map[scope] = { scope, boqHavePO: 0, boqNoPO: 0, nonBoqHavePO: 0, nonBoqNoPO: 0, boqTotal: 0, nonBoqTotal: 0 }
    if (isBoq) {
      map[scope].boqTotal += amt
      if (hasPO) map[scope].boqHavePO += amt
      else       map[scope].boqNoPO   += amt
    } else {
      map[scope].nonBoqTotal += amt
      if (hasPO) map[scope].nonBoqHavePO += amt
      else       map[scope].nonBoqNoPO   += amt
    }
  }
  return Object.values(map)
    .filter(r => r.boqTotal > 0 || r.nonBoqTotal > 0)
    .sort((a, b) => (b.boqTotal + b.nonBoqTotal) - (a.boqTotal + a.nonBoqTotal))
})

const boqTotals = computed(() => {
  const base = boqByScope.value.reduce(
    (acc, r) => ({
      boqHavePO:    acc.boqHavePO    + r.boqHavePO,
      boqNoPO:      acc.boqNoPO      + r.boqNoPO,
      nonBoqHavePO: acc.nonBoqHavePO + r.nonBoqHavePO,
      nonBoqNoPO:   acc.nonBoqNoPO   + r.nonBoqNoPO,
      boqTotal:     acc.boqTotal     + r.boqTotal,
      nonBoqTotal:  acc.nonBoqTotal  + r.nonBoqTotal,
    }),
    { boqHavePO: 0, boqNoPO: 0, nonBoqHavePO: 0, nonBoqNoPO: 0, boqTotal: 0, nonBoqTotal: 0 }
  )
  base.boqCount = voItems.value.filter(vo => vo.boqRelated === true || vo.boqRelated === 'yes').length
  return base
})

// ── Recent activity ──
const recentVOs = computed(() =>
  [...voItems.value]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 8)
)

const formatStatus = (s) => ({ draft: 'Draft', submitted: 'Submitted', 'pending-approval': 'Pending', approved: 'Approved', rejected: 'Rejected' }[s] || s)
const statusDotClass  = (s) => ({ draft: 'bg-gray-400', submitted: 'bg-blue-500', 'pending-approval': 'bg-yellow-400', approved: 'bg-green-500', rejected: 'bg-red-500' }[s] || 'bg-gray-400')
const statusBadgeClass = (s) => ({ draft: 'bg-gray-100 text-gray-600', submitted: 'bg-blue-100 text-blue-700', 'pending-approval': 'bg-yellow-100 text-yellow-700', approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700' }[s] || 'bg-gray-100 text-gray-600')

const formatRelativeTime = (date) => {
  if (!date) return '—'
  const now = new Date()
  const d = new Date(date)
  const diff = Math.floor((now - d) / 1000)
  if (diff < 60)        return 'just now'
  if (diff < 3600)      return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400)     return `${Math.floor(diff / 3600)}h ago`
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
}

// ── Site summary ──
const siteSortBy  = ref('count')
const SITE_PAGE_SIZE = 15
const sitePage    = ref(1)

const siteSummary = computed(() => {
  const map = {}
  for (const vo of voItems.value) {
    const key = `${vo.siteId || ''}|${vo.siteName || ''}|${vo.jobNumber || ''}`
    if (!map[key]) map[key] = { key, siteId: vo.siteId || '—', siteName: vo.siteName || '—', jobNumber: vo.jobNumber || '', total: 0, approved: 0, pending: 0, submitted: 0, draft: 0, rejected: 0, amount: 0 }
    const r = map[key]
    r.total++; r.amount += vo.voAmount || 0
    if (vo.voStatus === 'approved')          r.approved++
    else if (vo.voStatus === 'pending-approval') r.pending++
    else if (vo.voStatus === 'submitted')    r.submitted++
    else if (vo.voStatus === 'draft')        r.draft++
    else if (vo.voStatus === 'rejected')     r.rejected++
  }
  return Object.values(map).sort((a, b) => siteSortBy.value === 'amount' ? b.amount - a.amount : b.total - a.total)
})

const siteTotalPages   = computed(() => Math.max(1, Math.ceil(siteSummary.value.length / SITE_PAGE_SIZE)))
const pagedSiteSummary = computed(() => {
  const start = (sitePage.value - 1) * SITE_PAGE_SIZE
  return siteSummary.value.slice(start, start + SITE_PAGE_SIZE)
})

// ── Invoice by Site ──
const invoiceSiteSortBy  = ref('invoiced')
const INVOICE_SITE_PAGE_SIZE = 15
const invoiceSitePage    = ref(1)
const invoiceSiteModal   = ref(null)
const invoiceSiteSearch  = ref('')

const invoiceBySite = computed(() => {
  const allVOs = store.vos.value || []
  const map = {}
  for (const vo of allVOs) {
    const key = `${vo.siteId || ''}|${vo.siteName || ''}|${vo.jobNumber || ''}`
    if (!map[key]) map[key] = {
      key, siteId: vo.siteId || '—', siteName: vo.siteName || '—', jobNumber: vo.jobNumber || '',
      total: 0, invoiced: 0, canInvoice: 0, noPO: 0,
      invoicedAmt: 0, pendingAmt: 0, totalAmt: 0, vos: []
    }
    const r = map[key]
    r.total++
    r.totalAmt += vo.voAmount || 0
    r.vos.push(vo)
    const isInvoiced = vo.invoiceStatus === 'SIT Completed' && vo.invoiceDate
    if (isInvoiced) {
      r.invoiced++
      r.invoicedAmt += vo.voAmount || 0
    } else if (vo.poNumber?.trim()) {
      r.canInvoice++
      r.pendingAmt += vo.voAmount || 0
    } else {
      r.noPO++
    }
  }
  const rows = Object.values(map)
  rows.forEach(r => r.vos.sort((a, b) => {
    const aInv = a.invoiceStatus === 'SIT Completed' && a.invoiceDate ? 0 : a.poNumber?.trim() ? 1 : 2
    const bInv = b.invoiceStatus === 'SIT Completed' && b.invoiceDate ? 0 : b.poNumber?.trim() ? 1 : 2
    return aInv - bInv || (b.voAmount || 0) - (a.voAmount || 0)
  }))
  return rows.sort((a, b) =>
    invoiceSiteSortBy.value === 'total' ? b.totalAmt - a.totalAmt : b.invoicedAmt - a.invoicedAmt || b.canInvoice - a.canInvoice
  )
})

const filteredInvoiceBySite = computed(() => {
  const q = invoiceSiteSearch.value.trim().toLowerCase()
  if (!q) return invoiceBySite.value
  return invoiceBySite.value.filter(r =>
    r.siteId.toLowerCase().includes(q) ||
    r.siteName.toLowerCase().includes(q) ||
    r.jobNumber.toLowerCase().includes(q)
  )
})

const invoiceSiteTotalPages  = computed(() => Math.max(1, Math.ceil(filteredInvoiceBySite.value.length / INVOICE_SITE_PAGE_SIZE)))
const pagedInvoiceBySite     = computed(() => {
  const start = (invoiceSitePage.value - 1) * INVOICE_SITE_PAGE_SIZE
  return filteredInvoiceBySite.value.slice(start, start + INVOICE_SITE_PAGE_SIZE)
})

const openInvoiceSiteModal = (row) => { invoiceSiteModal.value = row }

const invoiceSiteModalGroups = computed(() => {
  const groups = [
    {
      key: 'service',
      label: 'VO - Service',
      description: 'Non-BOQ variation orders with Service category',
      headerClass: 'bg-blue-50',
      borderClass: 'border-blue-100',
      titleClass: 'text-blue-700',
      items: [],
      total: 0,
      havePO: 0,
      noPO: 0,
    },
    {
      key: 'thirdParty',
      label: 'VO - Third Party',
      description: 'Non-BOQ variation orders with Third Party category',
      headerClass: 'bg-sky-50',
      borderClass: 'border-sky-100',
      titleClass: 'text-sky-700',
      items: [],
      total: 0,
      havePO: 0,
      noPO: 0,
    },
    {
      key: 'boq',
      label: 'BOQ Related',
      description: 'All records where BOQ Related is Yes',
      headerClass: 'bg-emerald-50',
      borderClass: 'border-emerald-100',
      titleClass: 'text-emerald-700',
      items: [],
      total: 0,
      havePO: 0,
      noPO: 0,
    },
    {
      key: 'basePO',
      label: 'Base PO',
      description: 'Site Survey, WOP, SAT&SIT, C&I, and Snag Closure',
      headerClass: 'bg-amber-50',
      borderClass: 'border-amber-100',
      titleClass: 'text-amber-700',
      items: [],
      total: 0,
      havePO: 0,
      noPO: 0,
    },
  ]
  const byKey = Object.fromEntries(groups.map(group => [group.key, group]))

  for (const vo of invoiceSiteModal.value?.vos || []) {
    const category = vo.voCategory?.trim() || ''
    const isBasePO = BASE_PO_CATEGORIES.has(category)
    const isBOQ = !isBasePO && (vo.boqRelated === true || vo.boqRelated === 'yes')
    const group =
      isBasePO ? byKey.basePO :
      isBOQ ? byKey.boq :
      category === 'Third Party' ? byKey.thirdParty :
      byKey.service

    group.items.push(vo)
    group.total += vo.voAmount || 0
    if (vo.poNumber?.trim()) group.havePO += vo.voAmount || 0
    else group.noPO += vo.voAmount || 0
  }

  for (const group of groups) {
    group.items.sort((a, b) => {
      const rank = v => v.invoiceStatus === 'SIT Completed' && v.invoiceDate ? 0 : v.poNumber?.trim() ? 1 : 2
      return rank(a) - rank(b) || (b.voAmount || 0) - (a.voAmount || 0)
    })
  }

  return groups
})

watch(invoiceSiteSearch, () => { invoiceSitePage.value = 1 })

// ── VO Category Summary ──
const voCatSortBy  = ref('invoiced')
const VO_CAT_PAGE_SIZE = 15
const voCatPage    = ref(1)
const voCatSearch  = ref('')
const voCatModal   = ref(null)
const voCatModalTab = ref('All')

const voCategorySummary = computed(() => {
  const allVOs = (store.vos.value || []).filter(vo => !(vo.boqRelated === true || vo.boqRelated === 'yes'))
  const map = {}
  for (const vo of allVOs) {
    const cat = vo.voCategory?.trim() || '(No Category)'
    if (!map[cat]) map[cat] = {
      category: cat,
      isBasePO: BASE_PO_CATEGORIES.has(cat),
      total: 0, invoiced: 0, uninvoiced: 0,
      invoicedAmt: 0, uninvoicedAmt: 0, totalAmt: 0,
      vos: []
    }
    const r = map[cat]
    r.total++
    r.totalAmt += vo.voAmount || 0
    r.vos.push(vo)
    if (vo.invoiceStatus === 'SIT Completed' && vo.invoiceDate) {
      r.invoiced++
      r.invoicedAmt += vo.voAmount || 0
    } else {
      r.uninvoiced++
      r.uninvoicedAmt += vo.voAmount || 0
    }
  }
  const rows = Object.values(map)
  rows.forEach(r => r.vos.sort((a, b) => {
    const rank = v => (v.invoiceStatus === 'SIT Completed' && v.invoiceDate) ? 0 : 1
    return rank(a) - rank(b) || (b.voAmount || 0) - (a.voAmount || 0)
  }))
  return rows.sort((a, b) =>
    voCatSortBy.value === 'total' ? b.totalAmt - a.totalAmt : b.invoicedAmt - a.invoicedAmt || b.uninvoicedAmt - a.uninvoicedAmt
  )
})

const filteredVOCategorySummary = computed(() => {
  const q = voCatSearch.value.trim().toLowerCase()
  if (!q) return voCategorySummary.value
  return voCategorySummary.value.filter(r => r.category.toLowerCase().includes(q))
})

const voCatTotalPages = computed(() => Math.max(1, Math.ceil(filteredVOCategorySummary.value.length / VO_CAT_PAGE_SIZE)))
const pagedVOCategorySummary = computed(() => {
  const start = (voCatPage.value - 1) * VO_CAT_PAGE_SIZE
  return filteredVOCategorySummary.value.slice(start, start + VO_CAT_PAGE_SIZE)
})

const openVOCatModal = (row) => {
  voCatModal.value = row
  voCatModalTab.value = 'All'
}

const voCatModalFilteredVOs = computed(() => {
  if (!voCatModal.value) return []
  if (voCatModalTab.value === 'Invoiced')
    return voCatModal.value.vos.filter(v => v.invoiceStatus === 'SIT Completed' && v.invoiceDate)
  if (voCatModalTab.value === 'Uninvoiced')
    return voCatModal.value.vos.filter(v => !(v.invoiceStatus === 'SIT Completed' && v.invoiceDate))
  return voCatModal.value.vos
})

watch(voCatSearch, () => { voCatPage.value = 1 })

const modalStatusBadge = (s) => ({
  draft: 'bg-gray-100 text-gray-700',
  submitted: 'bg-blue-100 text-blue-700',
  'pending-approval': 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}[s] || 'bg-gray-100 text-gray-700')

// ── Ticket breakdown ──
const ticketBreakdown = computed(() => {
  const vos = voItems.value.filter(vo => vo.voStatus !== 'draft')
  const buildGroup = (list) => {
    const scopeMap = {}
    for (const vo of list) {
      const scope = vo.scope?.trim() || '(No Scope)'
      if (!scopeMap[scope]) scopeMap[scope] = { scope, amount: 0, count: 0 }
      scopeMap[scope].amount += vo.voAmount || 0
      scopeMap[scope].count++
    }
    const scopes = Object.values(scopeMap).sort((a, b) => b.amount - a.amount)
    return { scopes, total: list.reduce((s, vo) => s + (vo.voAmount || 0), 0), count: list.length }
  }
  return {
    withTicket:    buildGroup(vos.filter(vo =>  vo.ticketNumber?.trim())),
    withoutTicket: buildGroup(vos.filter(vo => !vo.ticketNumber?.trim())),
  }
})
</script>
