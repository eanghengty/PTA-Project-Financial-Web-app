<template>
  <div class="space-y-5">

    <!-- ══════════════════════════════════════════
         SECTION 1 — Ticket submitted, no PO yet
         ══════════════════════════════════════════ -->

    <!-- Page header -->
    <div class="flex items-center justify-between pb-2 border-b border-gray-100">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
          <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">Follow-up Reminders</h2>
          <p class="text-xs text-gray-400 mt-0.5">Four watchlists — ticket pending PO · email awaiting Nokia reply · ticket approved no PO · BOQ pending PO</p>
        </div>
      </div>
    </div>

    <!-- Section 1 -->
    <div class="border border-blue-100 rounded-xl overflow-hidden">
    <div class="flex items-center justify-between px-4 py-3 cursor-pointer select-none transition"
      :class="section1Open ? 'bg-blue-50/40 border-b border-blue-100' : 'hover:bg-blue-50/40'"
      @click="section1Open = !section1Open">
      <div class="flex items-center gap-2.5">
        <span class="w-2 h-2 rounded-full bg-orange-400 shrink-0"></span>
        <h3 class="text-sm font-semibold text-gray-700">Ticket submitted — awaiting PO</h3>
        <span class="text-xs text-gray-400">(Non-BOQ · no ticket approval · no PO)</span>
      </div>
      <div class="flex items-center gap-2.5">
        <template v-if="enrichedVOs.length > 0">
          <span class="text-xs text-gray-500 font-medium">{{ formatCurrency(totalAmount) }}</span>
          <button @click.stop="exportSection1"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            Export
          </button>
          <span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">
            {{ enrichedVOs.length }} pending
          </span>
        </template>
        <svg class="w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ml-1" :class="section1Open ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </div>
    </div>

    <!-- Section 1 collapsible body -->
    <div v-show="section1Open" class="p-4 space-y-3">

    <!-- Section 1 KPI cards -->
    <div v-if="enrichedVOs.length > 0" class="grid grid-cols-3 gap-3">

      <div class="bg-white rounded-xl border border-red-200 px-5 py-4 flex items-start gap-4">
        <div class="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
          <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold text-red-500 uppercase tracking-wider">Overdue &gt; 30 days</p>
          <p class="text-3xl font-bold text-red-700 mt-0.5 leading-none">{{ overdueCount }}</p>
          <p class="text-xs text-red-400 mt-1.5">{{ formatCurrency(overdueAmount) }}</p>
          <div class="mt-2 h-1 rounded-full bg-red-50 overflow-hidden">
            <div class="h-full rounded-full bg-red-400 transition-all"
              :style="{ width: enrichedVOs.length ? (overdueCount / enrichedVOs.length * 100) + '%' : '0%' }"/>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-amber-200 px-5 py-4 flex items-start gap-4">
        <div class="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
          <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold text-amber-600 uppercase tracking-wider">Warning 14–30 days</p>
          <p class="text-3xl font-bold text-amber-700 mt-0.5 leading-none">{{ warningCount }}</p>
          <p class="text-xs text-amber-500 mt-1.5">{{ formatCurrency(warningAmount) }}</p>
          <div class="mt-2 h-1 rounded-full bg-amber-50 overflow-hidden">
            <div class="h-full rounded-full bg-amber-400 transition-all"
              :style="{ width: enrichedVOs.length ? (warningCount / enrichedVOs.length * 100) + '%' : '0%' }"/>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-green-200 px-5 py-4 flex items-start gap-4">
        <div class="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0 mt-0.5">
          <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold text-green-600 uppercase tracking-wider">Recent &lt; 14 days</p>
          <p class="text-3xl font-bold text-green-700 mt-0.5 leading-none">{{ recentCount }}</p>
          <p class="text-xs text-green-500 mt-1.5">{{ formatCurrency(recentAmount) }}</p>
          <div class="mt-2 h-1 rounded-full bg-green-50 overflow-hidden">
            <div class="h-full rounded-full bg-green-400 transition-all"
              :style="{ width: enrichedVOs.length ? (recentCount / enrichedVOs.length * 100) + '%' : '0%' }"/>
          </div>
        </div>
      </div>

    </div>

    <!-- Section 1 empty state -->
    <div v-if="enrichedVOs.length === 0"
      class="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-10 text-center border border-orange-100">
      <div class="w-12 h-12 mx-auto mb-3 rounded-xl bg-orange-100 flex items-center justify-center">
        <svg class="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <p class="text-sm font-semibold text-gray-700">No tickets waiting for PO</p>
      <p class="text-xs text-gray-400 mt-1">All submitted tickets have been approved or already have a PO.</p>
    </div>

    <!-- Section 1 table -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-auto" style="max-height: calc(50vh - 60px);">
        <table class="border-collapse w-full text-sm">
          <thead class="sticky top-0 z-10">
            <tr>
              <th class="bg-blue-700 border-b-2 border-blue-800 px-0 py-3 w-1.5"></th>
              <th class="bg-blue-700 border-b-2 border-blue-800 px-4 py-3 text-left text-xs font-semibold text-white tracking-wide">Site</th>
              <th class="bg-blue-700 border-b-2 border-blue-800 px-3 py-3 text-left text-xs font-semibold text-white tracking-wide">Job #</th>
              <th class="bg-blue-700 border-b-2 border-blue-800 px-4 py-3 text-left text-xs font-semibold text-white tracking-wide">Description</th>
              <th class="bg-blue-700 border-b-2 border-blue-800 px-3 py-3 text-left text-xs font-semibold text-white tracking-wide">Category</th>
              <th class="bg-blue-700 border-b-2 border-blue-800 px-3 py-3 text-left text-xs font-semibold text-white tracking-wide">Scope</th>
              <th class="bg-blue-700 border-b-2 border-blue-800 px-3 py-3 text-left text-xs font-semibold text-white tracking-wide">Ticket #</th>
              <th class="bg-blue-700 border-b-2 border-blue-800 px-3 py-3 text-left text-xs font-semibold text-white tracking-wide whitespace-nowrap">Submitted</th>
              <th class="bg-blue-700 border-b-2 border-blue-800 px-3 py-3 text-center text-xs font-semibold text-white tracking-wide whitespace-nowrap">Days Waiting</th>
              <th class="bg-blue-700 border-b-2 border-blue-800 px-4 py-3 text-right text-xs font-semibold text-white tracking-wide">Amount</th>
              <th class="bg-blue-700 border-b-2 border-blue-800 px-4 py-3 text-center text-xs font-semibold text-white tracking-wide">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="vo in enrichedVOs" :key="vo.id" class="transition-colors" :class="rowClass(vo._days)">
              <td class="py-0 pl-0 pr-0 w-1.5">
                <div class="w-1.5 h-full min-h-[44px]"
                  :class="vo._days > 30 ? 'bg-red-400' : vo._days > 14 ? 'bg-amber-400' : 'bg-green-400'"/>
              </td>
              <td class="px-4 py-3">
                <div class="font-semibold text-gray-900 text-sm leading-tight">{{ vo.siteName || '—' }}</div>
                <div class="text-xs text-indigo-600 font-medium mt-0.5">{{ vo.siteId || '' }}</div>
              </td>
              <td class="px-3 py-3 text-xs text-gray-500 whitespace-nowrap">{{ vo.jobNumber || '—' }}</td>
              <td class="px-4 py-3 max-w-xs">
                <div class="text-gray-800 text-sm line-clamp-2 leading-snug">{{ vo.voDescription || '—' }}</div>
              </td>
              <td class="px-3 py-3">
                <span class="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 whitespace-nowrap">
                  {{ vo.voCategory || '—' }}
                </span>
              </td>
              <td class="px-3 py-3 text-xs text-gray-500 whitespace-nowrap">{{ vo.scope || '—' }}</td>
              <td class="px-3 py-3">
                <span class="font-mono text-xs text-gray-700 bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded">
                  {{ vo.ticketNumber }}
                </span>
              </td>
              <td class="px-3 py-3 text-xs text-gray-500 whitespace-nowrap">{{ formatDate(vo.ticketSubmissionDate) }}</td>
              <td class="px-3 py-3 text-center">
                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border"
                  :class="daysBadgeClass(vo._days)">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {{ vo._days }}d
                </span>
              </td>
              <td class="px-4 py-3 text-right text-sm font-semibold text-gray-800 whitespace-nowrap">
                {{ formatCurrency(vo.voAmount) }}
              </td>
              <td class="px-4 py-3 text-center">
                <button @click="openEdit(vo)"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 transition shadow-sm">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
        <p class="text-xs text-gray-400">
          {{ enrichedVOs.length }} VO{{ enrichedVOs.length !== 1 ? 's' : '' }} waiting for PO · sorted by scope, then most overdue first
        </p>
        <p class="text-xs font-semibold text-gray-600">Total: {{ formatCurrency(totalAmount) }}</p>
      </div>
    </div>


    </div><!-- end section 1 collapsible -->
    </div><!-- end section 1 card -->

    <!-- ══════════════════════════════════════════
         SECTION 2 — Email sent, no Nokia reply
         ══════════════════════════════════════════ -->

    <!-- Section 2 -->
    <div class="border border-blue-100 rounded-xl overflow-hidden">
    <div class="flex items-center justify-between px-4 py-3 cursor-pointer select-none transition"
      :class="section2Open ? 'bg-blue-50/40 border-b border-blue-100' : 'hover:bg-blue-50/40'"
      @click="section2Open = !section2Open">
      <div class="flex items-center gap-2.5">
        <span class="w-2 h-2 rounded-full bg-purple-400 shrink-0"></span>
        <h3 class="text-sm font-semibold text-gray-700">Email sent — awaiting Nokia approval</h3>
        <span class="text-xs text-gray-400">(Non-BOQ · no PO · email sent · no approval email back)</span>
      </div>
      <div class="flex items-center gap-2.5">
        <template v-if="emailEnrichedVOs.length > 0">
          <span class="text-xs text-gray-500 font-medium">{{ formatCurrency(emailTotalAmount) }}</span>
          <button @click.stop="exportSection2"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            Export
          </button>
          <span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
            {{ emailEnrichedVOs.length }} pending
          </span>
        </template>
        <svg class="w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ml-1" :class="section2Open ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </div>
    </div>

    <!-- Section 2 collapsible body -->
    <div v-show="section2Open" class="p-4 space-y-3">

    <!-- Section 2 KPI cards -->
    <div v-if="emailEnrichedVOs.length > 0" class="grid grid-cols-3 gap-3">

      <div class="bg-white rounded-xl border border-red-200 px-5 py-4 flex items-start gap-4">
        <div class="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
          <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold text-red-500 uppercase tracking-wider">Overdue &gt; 30 days</p>
          <p class="text-3xl font-bold text-red-700 mt-0.5 leading-none">{{ emailOverdueCount }}</p>
          <p class="text-xs text-red-400 mt-1.5">{{ formatCurrency(emailOverdueAmount) }}</p>
          <div class="mt-2 h-1 rounded-full bg-red-50 overflow-hidden">
            <div class="h-full rounded-full bg-red-400 transition-all"
              :style="{ width: emailEnrichedVOs.length ? (emailOverdueCount / emailEnrichedVOs.length * 100) + '%' : '0%' }"/>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-amber-200 px-5 py-4 flex items-start gap-4">
        <div class="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
          <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold text-amber-600 uppercase tracking-wider">Warning 14–30 days</p>
          <p class="text-3xl font-bold text-amber-700 mt-0.5 leading-none">{{ emailWarningCount }}</p>
          <p class="text-xs text-amber-500 mt-1.5">{{ formatCurrency(emailWarningAmount) }}</p>
          <div class="mt-2 h-1 rounded-full bg-amber-50 overflow-hidden">
            <div class="h-full rounded-full bg-amber-400 transition-all"
              :style="{ width: emailEnrichedVOs.length ? (emailWarningCount / emailEnrichedVOs.length * 100) + '%' : '0%' }"/>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-green-200 px-5 py-4 flex items-start gap-4">
        <div class="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0 mt-0.5">
          <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold text-green-600 uppercase tracking-wider">Recent &lt; 14 days</p>
          <p class="text-3xl font-bold text-green-700 mt-0.5 leading-none">{{ emailRecentCount }}</p>
          <p class="text-xs text-green-500 mt-1.5">{{ formatCurrency(emailRecentAmount) }}</p>
          <div class="mt-2 h-1 rounded-full bg-green-50 overflow-hidden">
            <div class="h-full rounded-full bg-green-400 transition-all"
              :style="{ width: emailEnrichedVOs.length ? (emailRecentCount / emailEnrichedVOs.length * 100) + '%' : '0%' }"/>
          </div>
        </div>
      </div>

    </div>

    <!-- Section 2 empty state -->
    <div v-if="emailEnrichedVOs.length === 0"
      class="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-10 text-center border border-purple-100">
      <div class="w-12 h-12 mx-auto mb-3 rounded-xl bg-purple-100 flex items-center justify-center">
        <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <p class="text-sm font-semibold text-gray-700">No emails awaiting Nokia reply</p>
      <p class="text-xs text-gray-400 mt-1">All sent emails have received an approval response.</p>
    </div>

    <!-- Section 2 table -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-auto" style="max-height: calc(50vh - 60px);">
        <table class="border-collapse w-full text-sm">
          <thead class="sticky top-0 z-10">
            <tr>
              <th class="bg-purple-700 border-b-2 border-purple-800 px-0 py-3 w-1.5"></th>
              <th class="bg-purple-700 border-b-2 border-purple-800 px-4 py-3 text-left text-xs font-semibold text-white tracking-wide">Site</th>
              <th class="bg-purple-700 border-b-2 border-purple-800 px-3 py-3 text-left text-xs font-semibold text-white tracking-wide">Job #</th>
              <th class="bg-purple-700 border-b-2 border-purple-800 px-4 py-3 text-left text-xs font-semibold text-white tracking-wide">Description</th>
              <th class="bg-purple-700 border-b-2 border-purple-800 px-3 py-3 text-left text-xs font-semibold text-white tracking-wide">Category</th>
              <th class="bg-purple-700 border-b-2 border-purple-800 px-3 py-3 text-left text-xs font-semibold text-white tracking-wide">Scope</th>
              <th class="bg-purple-700 border-b-2 border-purple-800 px-3 py-3 text-left text-xs font-semibold text-white tracking-wide whitespace-nowrap">Email Sent</th>
              <th class="bg-purple-700 border-b-2 border-purple-800 px-3 py-3 text-center text-xs font-semibold text-white tracking-wide whitespace-nowrap">Days Since Email</th>
              <th class="bg-purple-700 border-b-2 border-purple-800 px-3 py-3 text-left text-xs font-semibold text-white tracking-wide">Status</th>
              <th class="bg-purple-700 border-b-2 border-purple-800 px-4 py-3 text-right text-xs font-semibold text-white tracking-wide">Amount</th>
              <th class="bg-purple-700 border-b-2 border-purple-800 px-4 py-3 text-center text-xs font-semibold text-white tracking-wide">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="vo in emailEnrichedVOs" :key="vo.id" class="transition-colors" :class="rowClass(vo._days)">
              <td class="py-0 pl-0 pr-0 w-1.5">
                <div class="w-1.5 h-full min-h-[44px]"
                  :class="vo._days > 30 ? 'bg-red-400' : vo._days > 14 ? 'bg-amber-400' : 'bg-green-400'"/>
              </td>
              <td class="px-4 py-3">
                <div class="font-semibold text-gray-900 text-sm leading-tight">{{ vo.siteName || '—' }}</div>
                <div class="text-xs text-indigo-600 font-medium mt-0.5">{{ vo.siteId || '' }}</div>
              </td>
              <td class="px-3 py-3 text-xs text-gray-500 whitespace-nowrap">{{ vo.jobNumber || '—' }}</td>
              <td class="px-4 py-3 max-w-xs">
                <div class="text-gray-800 text-sm line-clamp-2 leading-snug">{{ vo.voDescription || '—' }}</div>
              </td>
              <td class="px-3 py-3">
                <span class="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100 whitespace-nowrap">
                  {{ vo.voCategory || '—' }}
                </span>
              </td>
              <td class="px-3 py-3 text-xs text-gray-500 whitespace-nowrap">{{ vo.scope || '—' }}</td>
              <td class="px-3 py-3 text-xs text-gray-600 whitespace-nowrap font-medium">
                {{ formatDate(vo.emailSentToNokia) }}
              </td>
              <td class="px-3 py-3 text-center">
                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border"
                  :class="daysBadgeClass(vo._days)">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {{ vo._days }}d
                </span>
              </td>
              <td class="px-3 py-3">
                <span class="inline-block px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
                  :class="statusBadgeClass(vo.voStatus)">
                  {{ formatStatus(vo.voStatus) }}
                </span>
              </td>
              <td class="px-4 py-3 text-right text-sm font-semibold text-gray-800 whitespace-nowrap">
                {{ formatCurrency(vo.voAmount) }}
              </td>
              <td class="px-4 py-3 text-center">
                <button @click="openEdit(vo)"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800 transition shadow-sm">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
        <p class="text-xs text-gray-400">
          {{ emailEnrichedVOs.length }} VO{{ emailEnrichedVOs.length !== 1 ? 's' : '' }} awaiting Nokia approval email · sorted by scope, then most overdue first
        </p>
        <p class="text-xs font-semibold text-gray-600">Total: {{ formatCurrency(emailTotalAmount) }}</p>
      </div>
    </div>


    </div><!-- end section 2 collapsible -->
    </div><!-- end section 2 card -->

    <!-- ══════════════════════════════════════════
         SECTION 3 — Ticket approved, still no PO
         ══════════════════════════════════════════ -->

    <!-- Section 3 -->
    <div class="border border-blue-100 rounded-xl overflow-hidden">
    <div class="flex items-center justify-between px-4 py-3 cursor-pointer select-none transition"
      :class="section3Open ? 'bg-blue-50/40 border-b border-blue-100' : 'hover:bg-blue-50/40'"
      @click="section3Open = !section3Open">
      <div class="flex items-center gap-2.5">
        <span class="w-2 h-2 rounded-full bg-teal-400 shrink-0"></span>
        <h3 class="text-sm font-semibold text-gray-700">Ticket approved — still no PO</h3>
        <span class="text-xs text-gray-400">(Non-BOQ · ticket approved · no PO received)</span>
      </div>
      <div class="flex items-center gap-2.5">
        <template v-if="approvedEnrichedVOs.length > 0">
          <span class="text-xs text-gray-500 font-medium">{{ formatCurrency(approvedTotalAmount) }}</span>
          <button @click.stop="exportSection3"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            Export
          </button>
          <span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-teal-100 text-teal-700 border border-teal-200">
            {{ approvedEnrichedVOs.length }} pending
          </span>
        </template>
        <svg class="w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ml-1" :class="section3Open ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </div>
    </div>

    <!-- Section 3 collapsible body -->
    <div v-show="section3Open" class="p-4 space-y-3">

    <!-- Section 3 KPI cards -->
    <div v-if="approvedEnrichedVOs.length > 0" class="grid grid-cols-3 gap-3">

      <div class="bg-white rounded-xl border border-red-200 px-5 py-4 flex items-start gap-4">
        <div class="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
          <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold text-red-500 uppercase tracking-wider">Overdue &gt; 30 days</p>
          <p class="text-3xl font-bold text-red-700 mt-0.5 leading-none">{{ approvedOverdueCount }}</p>
          <p class="text-xs text-red-400 mt-1.5">{{ formatCurrency(approvedOverdueAmount) }}</p>
          <div class="mt-2 h-1 rounded-full bg-red-50 overflow-hidden">
            <div class="h-full rounded-full bg-red-400 transition-all"
              :style="{ width: approvedEnrichedVOs.length ? (approvedOverdueCount / approvedEnrichedVOs.length * 100) + '%' : '0%' }"/>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-amber-200 px-5 py-4 flex items-start gap-4">
        <div class="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
          <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold text-amber-600 uppercase tracking-wider">Warning 14–30 days</p>
          <p class="text-3xl font-bold text-amber-700 mt-0.5 leading-none">{{ approvedWarningCount }}</p>
          <p class="text-xs text-amber-500 mt-1.5">{{ formatCurrency(approvedWarningAmount) }}</p>
          <div class="mt-2 h-1 rounded-full bg-amber-50 overflow-hidden">
            <div class="h-full rounded-full bg-amber-400 transition-all"
              :style="{ width: approvedEnrichedVOs.length ? (approvedWarningCount / approvedEnrichedVOs.length * 100) + '%' : '0%' }"/>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-green-200 px-5 py-4 flex items-start gap-4">
        <div class="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0 mt-0.5">
          <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold text-green-600 uppercase tracking-wider">Recent &lt; 14 days</p>
          <p class="text-3xl font-bold text-green-700 mt-0.5 leading-none">{{ approvedRecentCount }}</p>
          <p class="text-xs text-green-500 mt-1.5">{{ formatCurrency(approvedRecentAmount) }}</p>
          <div class="mt-2 h-1 rounded-full bg-green-50 overflow-hidden">
            <div class="h-full rounded-full bg-green-400 transition-all"
              :style="{ width: approvedEnrichedVOs.length ? (approvedRecentCount / approvedEnrichedVOs.length * 100) + '%' : '0%' }"/>
          </div>
        </div>
      </div>

    </div>

    <!-- Section 3 empty state -->
    <div v-if="approvedEnrichedVOs.length === 0"
      class="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-10 text-center border border-teal-100">
      <div class="w-12 h-12 mx-auto mb-3 rounded-xl bg-teal-100 flex items-center justify-center">
        <svg class="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <p class="text-sm font-semibold text-gray-700">No approved tickets missing a PO</p>
      <p class="text-xs text-gray-400 mt-1">All ticket-approved VOs have a PO number recorded.</p>
    </div>

    <!-- Section 3 table -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-auto" style="max-height: calc(50vh - 60px);">
        <table class="border-collapse w-full text-sm">
          <thead class="sticky top-0 z-10">
            <tr>
              <th class="bg-teal-700 border-b-2 border-teal-800 px-0 py-3 w-1.5"></th>
              <th class="bg-teal-700 border-b-2 border-teal-800 px-4 py-3 text-left text-xs font-semibold text-white tracking-wide">Site</th>
              <th class="bg-teal-700 border-b-2 border-teal-800 px-3 py-3 text-left text-xs font-semibold text-white tracking-wide">Job #</th>
              <th class="bg-teal-700 border-b-2 border-teal-800 px-4 py-3 text-left text-xs font-semibold text-white tracking-wide">Description</th>
              <th class="bg-teal-700 border-b-2 border-teal-800 px-3 py-3 text-left text-xs font-semibold text-white tracking-wide">Category</th>
              <th class="bg-teal-700 border-b-2 border-teal-800 px-3 py-3 text-left text-xs font-semibold text-white tracking-wide">Scope</th>
              <th class="bg-teal-700 border-b-2 border-teal-800 px-3 py-3 text-left text-xs font-semibold text-white tracking-wide">Ticket #</th>
              <th class="bg-teal-700 border-b-2 border-teal-800 px-3 py-3 text-left text-xs font-semibold text-white tracking-wide whitespace-nowrap">Ticket Approved</th>
              <th class="bg-teal-700 border-b-2 border-teal-800 px-3 py-3 text-center text-xs font-semibold text-white tracking-wide whitespace-nowrap">Days Since Approval</th>
              <th class="bg-teal-700 border-b-2 border-teal-800 px-4 py-3 text-right text-xs font-semibold text-white tracking-wide">Amount</th>
              <th class="bg-teal-700 border-b-2 border-teal-800 px-4 py-3 text-center text-xs font-semibold text-white tracking-wide">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="vo in approvedEnrichedVOs" :key="vo.id" class="transition-colors" :class="rowClass(vo._days)">
              <td class="py-0 pl-0 pr-0 w-1.5">
                <div class="w-1.5 h-full min-h-[44px]"
                  :class="vo._days > 30 ? 'bg-red-400' : vo._days > 14 ? 'bg-amber-400' : 'bg-green-400'"/>
              </td>
              <td class="px-4 py-3">
                <div class="font-semibold text-gray-900 text-sm leading-tight">{{ vo.siteName || '—' }}</div>
                <div class="text-xs text-indigo-600 font-medium mt-0.5">{{ vo.siteId || '' }}</div>
              </td>
              <td class="px-3 py-3 text-xs text-gray-500 whitespace-nowrap">{{ vo.jobNumber || '—' }}</td>
              <td class="px-4 py-3 max-w-xs">
                <div class="text-gray-800 text-sm line-clamp-2 leading-snug">{{ vo.voDescription || '—' }}</div>
              </td>
              <td class="px-3 py-3">
                <span class="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-100 whitespace-nowrap">
                  {{ vo.voCategory || '—' }}
                </span>
              </td>
              <td class="px-3 py-3 text-xs text-gray-500 whitespace-nowrap">{{ vo.scope || '—' }}</td>
              <td class="px-3 py-3">
                <span class="font-mono text-xs text-gray-700 bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded">
                  {{ vo.ticketNumber }}
                </span>
              </td>
              <td class="px-3 py-3 text-xs text-gray-600 whitespace-nowrap font-medium">
                {{ formatDate(vo.ticketApprovalDate) }}
              </td>
              <td class="px-3 py-3 text-center">
                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border"
                  :class="daysBadgeClass(vo._days)">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {{ vo._days }}d
                </span>
              </td>
              <td class="px-4 py-3 text-right text-sm font-semibold text-gray-800 whitespace-nowrap">
                {{ formatCurrency(vo.voAmount) }}
              </td>
              <td class="px-4 py-3 text-center">
                <button @click="openEdit(vo)"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 active:bg-teal-800 transition shadow-sm">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
        <p class="text-xs text-gray-400">
          {{ approvedEnrichedVOs.length }} VO{{ approvedEnrichedVOs.length !== 1 ? 's' : '' }} ticket approved but no PO · sorted by scope, then most overdue first
        </p>
        <p class="text-xs font-semibold text-gray-600">Total: {{ formatCurrency(approvedTotalAmount) }}</p>
      </div>
    </div>


    </div><!-- end section 3 collapsible -->
    </div><!-- end section 3 card -->

    <!-- ══════════════════════════════════════════
         SECTION 4 — BOQ Related, pending PO
         ══════════════════════════════════════════ -->

    <!-- Section 4 -->
    <div class="border border-emerald-100 rounded-xl overflow-hidden">
    <div class="flex items-center justify-between px-4 py-3 cursor-pointer select-none transition"
      :class="section4Open ? 'bg-emerald-50/40 border-b border-emerald-100' : 'hover:bg-emerald-50/40'"
      @click="section4Open = !section4Open">
      <div class="flex items-center gap-2.5">
        <span class="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
        <h3 class="text-sm font-semibold text-gray-700">BOQ Related — pending PO</h3>
        <span class="text-xs text-gray-400">(BOQ · no PO received · not rejected/cancelled)</span>
      </div>
      <div class="flex items-center gap-2.5">
        <template v-if="boqEnrichedVOs.length > 0">
          <span class="text-xs text-gray-500 font-medium">{{ formatCurrency(boqTotalAmount) }}</span>
          <button @click.stop="exportSection4"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            Export
          </button>
          <span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
            {{ boqEnrichedVOs.length }} pending
          </span>
        </template>
        <svg class="w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ml-1" :class="section4Open ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </div>
    </div>

    <!-- Section 4 collapsible body -->
    <div v-show="section4Open" class="p-4 space-y-3">

    <!-- Section 4 KPI cards -->
    <div v-if="boqEnrichedVOs.length > 0" class="grid grid-cols-3 gap-3">

      <div class="bg-white rounded-xl border border-red-200 px-5 py-4 flex items-start gap-4">
        <div class="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
          <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold text-red-500 uppercase tracking-wider">Overdue &gt; 30 days</p>
          <p class="text-3xl font-bold text-red-700 mt-0.5 leading-none">{{ boqOverdueCount }}</p>
          <p class="text-xs text-red-400 mt-1.5">{{ formatCurrency(boqOverdueAmount) }}</p>
          <div class="mt-2 h-1 rounded-full bg-red-50 overflow-hidden">
            <div class="h-full rounded-full bg-red-400 transition-all"
              :style="{ width: boqEnrichedVOs.length ? (boqOverdueCount / boqEnrichedVOs.length * 100) + '%' : '0%' }"/>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-amber-200 px-5 py-4 flex items-start gap-4">
        <div class="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
          <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold text-amber-600 uppercase tracking-wider">Warning 14–30 days</p>
          <p class="text-3xl font-bold text-amber-700 mt-0.5 leading-none">{{ boqWarningCount }}</p>
          <p class="text-xs text-amber-500 mt-1.5">{{ formatCurrency(boqWarningAmount) }}</p>
          <div class="mt-2 h-1 rounded-full bg-amber-50 overflow-hidden">
            <div class="h-full rounded-full bg-amber-400 transition-all"
              :style="{ width: boqEnrichedVOs.length ? (boqWarningCount / boqEnrichedVOs.length * 100) + '%' : '0%' }"/>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-green-200 px-5 py-4 flex items-start gap-4">
        <div class="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0 mt-0.5">
          <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold text-green-600 uppercase tracking-wider">Recent &lt; 14 days</p>
          <p class="text-3xl font-bold text-green-700 mt-0.5 leading-none">{{ boqRecentCount }}</p>
          <p class="text-xs text-green-500 mt-1.5">{{ formatCurrency(boqRecentAmount) }}</p>
          <div class="mt-2 h-1 rounded-full bg-green-50 overflow-hidden">
            <div class="h-full rounded-full bg-green-400 transition-all"
              :style="{ width: boqEnrichedVOs.length ? (boqRecentCount / boqEnrichedVOs.length * 100) + '%' : '0%' }"/>
          </div>
        </div>
      </div>

    </div>

    <!-- Section 4 empty state -->
    <div v-if="boqEnrichedVOs.length === 0"
      class="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-10 text-center border border-emerald-100">
      <div class="w-12 h-12 mx-auto mb-3 rounded-xl bg-emerald-100 flex items-center justify-center">
        <svg class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <p class="text-sm font-semibold text-gray-700">No BOQ VOs missing a PO</p>
      <p class="text-xs text-gray-400 mt-1">All BOQ-related VOs have a PO number recorded.</p>
    </div>

    <!-- Section 4 table -->
    <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-auto" style="max-height: calc(50vh - 60px);">
        <table class="border-collapse w-full text-sm">
          <thead class="sticky top-0 z-10">
            <tr>
              <th class="bg-emerald-700 border-b-2 border-emerald-800 px-0 py-3 w-1.5"></th>
              <th class="bg-emerald-700 border-b-2 border-emerald-800 px-4 py-3 text-left text-xs font-semibold text-white tracking-wide">Site</th>
              <th class="bg-emerald-700 border-b-2 border-emerald-800 px-3 py-3 text-left text-xs font-semibold text-white tracking-wide">Job #</th>
              <th class="bg-emerald-700 border-b-2 border-emerald-800 px-4 py-3 text-left text-xs font-semibold text-white tracking-wide">Description</th>
              <th class="bg-emerald-700 border-b-2 border-emerald-800 px-3 py-3 text-left text-xs font-semibold text-white tracking-wide">Category</th>
              <th class="bg-emerald-700 border-b-2 border-emerald-800 px-3 py-3 text-left text-xs font-semibold text-white tracking-wide">Scope</th>
              <th class="bg-emerald-700 border-b-2 border-emerald-800 px-3 py-3 text-left text-xs font-semibold text-white tracking-wide whitespace-nowrap">Created</th>
              <th class="bg-emerald-700 border-b-2 border-emerald-800 px-3 py-3 text-center text-xs font-semibold text-white tracking-wide whitespace-nowrap">Days Waiting</th>
              <th class="bg-emerald-700 border-b-2 border-emerald-800 px-4 py-3 text-right text-xs font-semibold text-white tracking-wide">Amount</th>
              <th class="bg-emerald-700 border-b-2 border-emerald-800 px-4 py-3 text-center text-xs font-semibold text-white tracking-wide">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="vo in boqEnrichedVOs" :key="vo.id" class="transition-colors" :class="rowClass(vo._days)">
              <td class="py-0 pl-0 pr-0 w-1.5">
                <div class="w-1.5 h-full min-h-[44px]"
                  :class="vo._days > 30 ? 'bg-red-400' : vo._days > 14 ? 'bg-amber-400' : 'bg-green-400'"/>
              </td>
              <td class="px-4 py-3">
                <div class="font-semibold text-gray-900 text-sm leading-tight">{{ vo.siteName || '—' }}</div>
                <div class="text-xs text-indigo-600 font-medium mt-0.5">{{ vo.siteId || '' }}</div>
              </td>
              <td class="px-3 py-3 text-xs text-gray-500 whitespace-nowrap">{{ vo.jobNumber || '—' }}</td>
              <td class="px-4 py-3 max-w-xs">
                <div class="text-gray-800 text-sm line-clamp-2 leading-snug">{{ vo.voDescription || '—' }}</div>
              </td>
              <td class="px-3 py-3">
                <span class="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100 whitespace-nowrap">
                  {{ vo.voCategory || '—' }}
                </span>
              </td>
              <td class="px-3 py-3 text-xs text-gray-500 whitespace-nowrap">{{ vo.scope || '—' }}</td>
              <td class="px-3 py-3 text-xs text-gray-600 whitespace-nowrap font-medium">
                {{ formatDate(vo.createdAt) }}
              </td>
              <td class="px-3 py-3 text-center">
                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border"
                  :class="daysBadgeClass(vo._days)">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {{ vo._days }}d
                </span>
              </td>
              <td class="px-4 py-3 text-right text-sm font-semibold text-gray-800 whitespace-nowrap">
                {{ formatCurrency(vo.voAmount) }}
              </td>
              <td class="px-4 py-3 text-center">
                <button @click="openEdit(vo)"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 transition shadow-sm">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
        <p class="text-xs text-gray-400">
          {{ boqEnrichedVOs.length }} BOQ VO{{ boqEnrichedVOs.length !== 1 ? 's' : '' }} pending PO · sorted by scope, then most overdue first
        </p>
        <p class="text-xs font-semibold text-gray-600">Total: {{ formatCurrency(boqTotalAmount) }}</p>
      </div>
    </div>


    </div><!-- end section 4 collapsible -->
    </div><!-- end section 4 card -->

    <!-- VOForm modal -->
    <Teleport to="body">
      <VOForm v-if="editingVO" :vo="editingVO" @save="handleSave" @cancel="editingVO = null" />
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useVOStore } from '../stores/voStore'
import { formatDate, formatCurrency, formatStatus, getStatusColor } from '../utils/formatters'
import { exportToExcel } from '../utils/export'
import VOForm from './VOForm.vue'

const BASE_PO_CATEGORIES = new Set(['Site Survey', 'WOP', 'C&I', 'SAT&SIT', 'Snag Closure'])

const store = useVOStore()
const editingVO = ref(null)

const section1Open = ref(true)
const section2Open = ref(false)
const section3Open = ref(false)
const section4Open = ref(false)

const daysSince = (dateStr) =>
  Math.floor((Date.now() - new Date(dateStr)) / 86_400_000)

// ── Section 1: Non-BOQ ticket submitted, no PO / approval ──────────────────
const enrichedVOs = computed(() =>
  (store.vos.value || [])
    .filter(vo => {
      if (BASE_PO_CATEGORIES.has(vo.voCategory)) return false
      if (vo.boqRelated === true || vo.boqRelated === 'yes') return false
      if (vo.voStatus === 'approved' || vo.voStatus === 'rejected' || vo.voStatus === 'cancelled') return false
      if (!vo.ticketNumber || !vo.ticketSubmissionDate) return false
      if (vo.ticketApprovalDate || vo.poNumber) return false
      return true
    })
    .map(vo => ({ ...vo, _days: daysSince(vo.ticketSubmissionDate) }))
    .sort((a, b) => {
      const sa = (a.scope || '').toLowerCase(), sb = (b.scope || '').toLowerCase()
      return sa !== sb ? sa.localeCompare(sb) : b._days - a._days
    })
)

const overdueVOs = computed(() => enrichedVOs.value.filter(v => v._days > 30))
const warningVOs = computed(() => enrichedVOs.value.filter(v => v._days > 14 && v._days <= 30))
const recentVOs  = computed(() => enrichedVOs.value.filter(v => v._days <= 14))

const overdueCount  = computed(() => overdueVOs.value.length)
const warningCount  = computed(() => warningVOs.value.length)
const recentCount   = computed(() => recentVOs.value.length)

const sum = arr => arr.reduce((t, v) => t + (Number(v.voAmount) || 0), 0)
const overdueAmount = computed(() => sum(overdueVOs.value))
const warningAmount = computed(() => sum(warningVOs.value))
const recentAmount  = computed(() => sum(recentVOs.value))
const totalAmount   = computed(() => sum(enrichedVOs.value))

// ── Section 2: No PO, email sent to Nokia, no approval email back ──────────
const emailEnrichedVOs = computed(() =>
  (store.vos.value || [])
    .filter(vo => {
      if (vo.boqRelated === true || vo.boqRelated === 'yes') return false
      if (vo.voStatus === 'rejected' || vo.voStatus === 'cancelled') return false
      if (vo.poNumber) return false
      if (!vo.emailSentToNokia) return false
      if (vo.emailApprovedFromNokia) return false
      return true
    })
    .map(vo => ({ ...vo, _days: daysSince(vo.emailSentToNokia) }))
    .sort((a, b) => {
      const sa = (a.scope || '').toLowerCase(), sb = (b.scope || '').toLowerCase()
      return sa !== sb ? sa.localeCompare(sb) : b._days - a._days
    })
)

const emailOverdueVOs = computed(() => emailEnrichedVOs.value.filter(v => v._days > 30))
const emailWarningVOs = computed(() => emailEnrichedVOs.value.filter(v => v._days > 14 && v._days <= 30))
const emailRecentVOs  = computed(() => emailEnrichedVOs.value.filter(v => v._days <= 14))

const emailOverdueCount  = computed(() => emailOverdueVOs.value.length)
const emailWarningCount  = computed(() => emailWarningVOs.value.length)
const emailRecentCount   = computed(() => emailRecentVOs.value.length)

const emailOverdueAmount = computed(() => sum(emailOverdueVOs.value))
const emailWarningAmount = computed(() => sum(emailWarningVOs.value))
const emailRecentAmount  = computed(() => sum(emailRecentVOs.value))
const emailTotalAmount   = computed(() => sum(emailEnrichedVOs.value))

// ── Section 3: Non-BOQ ticket approved, no PO received ────────────────────
const approvedEnrichedVOs = computed(() =>
  (store.vos.value || [])
    .filter(vo => {
      if (BASE_PO_CATEGORIES.has(vo.voCategory)) return false
      if (vo.boqRelated === true || vo.boqRelated === 'yes') return false
      if (vo.voStatus === 'rejected' || vo.voStatus === 'cancelled') return false
      if (!vo.ticketApprovalDate) return false
      if (vo.poNumber) return false
      return true
    })
    .map(vo => ({ ...vo, _days: daysSince(vo.ticketApprovalDate) }))
    .sort((a, b) => {
      const sa = (a.scope || '').toLowerCase(), sb = (b.scope || '').toLowerCase()
      return sa !== sb ? sa.localeCompare(sb) : b._days - a._days
    })
)

const approvedOverdueVOs = computed(() => approvedEnrichedVOs.value.filter(v => v._days > 30))
const approvedWarningVOs = computed(() => approvedEnrichedVOs.value.filter(v => v._days > 14 && v._days <= 30))
const approvedRecentVOs  = computed(() => approvedEnrichedVOs.value.filter(v => v._days <= 14))

const approvedOverdueCount  = computed(() => approvedOverdueVOs.value.length)
const approvedWarningCount  = computed(() => approvedWarningVOs.value.length)
const approvedRecentCount   = computed(() => approvedRecentVOs.value.length)

const approvedOverdueAmount = computed(() => sum(approvedOverdueVOs.value))
const approvedWarningAmount = computed(() => sum(approvedWarningVOs.value))
const approvedRecentAmount  = computed(() => sum(approvedRecentVOs.value))
const approvedTotalAmount   = computed(() => sum(approvedEnrichedVOs.value))

// ── Section 4: BOQ Related, no PO received ────────────────────────────────
const boqEnrichedVOs = computed(() =>
  (store.vos.value || [])
    .filter(vo => {
      if (!(vo.boqRelated === true || vo.boqRelated === 'yes')) return false
      if (vo.voStatus === 'rejected' || vo.voStatus === 'cancelled') return false
      if (vo.poNumber) return false
      return true
    })
    .map(vo => ({ ...vo, _days: daysSince(vo.createdAt) }))
    .sort((a, b) => {
      const sa = (a.scope || '').toLowerCase(), sb = (b.scope || '').toLowerCase()
      return sa !== sb ? sa.localeCompare(sb) : b._days - a._days
    })
)

const boqOverdueVOs = computed(() => boqEnrichedVOs.value.filter(v => v._days > 30))
const boqWarningVOs = computed(() => boqEnrichedVOs.value.filter(v => v._days > 14 && v._days <= 30))
const boqRecentVOs  = computed(() => boqEnrichedVOs.value.filter(v => v._days <= 14))

const boqOverdueCount  = computed(() => boqOverdueVOs.value.length)
const boqWarningCount  = computed(() => boqWarningVOs.value.length)
const boqRecentCount   = computed(() => boqRecentVOs.value.length)

const boqOverdueAmount = computed(() => sum(boqOverdueVOs.value))
const boqWarningAmount = computed(() => sum(boqWarningVOs.value))
const boqRecentAmount  = computed(() => sum(boqRecentVOs.value))
const boqTotalAmount   = computed(() => sum(boqEnrichedVOs.value))

// ── Shared helpers ─────────────────────────────────────────────────────────
const rowClass = (days) => {
  if (days > 30) return 'bg-red-50/60 hover:bg-red-50'
  if (days > 14) return 'bg-amber-50/60 hover:bg-amber-50'
  return 'hover:bg-gray-50'
}

const daysBadgeClass = (days) => {
  if (days > 30) return 'bg-red-50 text-red-700 border-red-200'
  if (days > 14) return 'bg-amber-50 text-amber-700 border-amber-200'
  return 'bg-green-50 text-green-700 border-green-200'
}

const statusBadgeClass = (status) => {
  const map = {
    approved: 'bg-green-100 text-green-700',
    submitted: 'bg-blue-100 text-blue-700',
    'pending-approval': 'bg-yellow-100 text-yellow-700',
    draft: 'bg-gray-100 text-gray-600',
    rejected: 'bg-red-100 text-red-700',
    cancelled: 'bg-slate-100 text-slate-600',
  }
  return map[status] || 'bg-gray-100 text-gray-600'
}

const today = new Date().toISOString().split('T')[0]
const exportSection1 = () => exportToExcel(enrichedVOs.value, `Reminders_Ticket_Pending_PO_${today}.xlsx`)
const exportSection2 = () => exportToExcel(emailEnrichedVOs.value, `Reminders_Awaiting_Nokia_Email_${today}.xlsx`)
const exportSection3 = () => exportToExcel(approvedEnrichedVOs.value, `Reminders_Approved_No_PO_${today}.xlsx`)
const exportSection4 = () => exportToExcel(boqEnrichedVOs.value, `Reminders_BOQ_Pending_PO_${today}.xlsx`)

const openEdit = (vo) => { editingVO.value = vo }

const handleSave = async (voData) => {
  if (editingVO.value) await store.editVO(editingVO.value.id, voData)
  editingVO.value = null
}
</script>
