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
        <!-- hidden file input for status import -->
        <input ref="importFileInput" type="file" accept=".xlsx,.xls,.csv" class="hidden" @change="handleImportFile"/>
        <button @click="downloadImportTemplate"
          class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Template
        </button>
        <button @click="importFileInput.click()"
          class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 text-blue-700 rounded-xl text-sm font-semibold hover:bg-blue-50 transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0l4 4m-4-4v12"/>
          </svg>
          Import Status
        </button>
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

    <!-- VO Detail slide-over -->
    <teleport to="body">
      <transition name="drawer">
        <div v-if="voDrawerOpen" class="fixed inset-0 z-50 flex justify-end">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/30 backdrop-blur-sm" @click="voDrawerOpen = false"/>
          <!-- Panel -->
          <div class="relative w-full max-w-lg bg-white shadow-2xl flex flex-col h-full">
            <!-- Header -->
            <div class="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-emerald-700">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-white/20 text-white">
                    {{ voDrawerRow?.siteId }}
                  </span>
                  <span class="text-white font-semibold text-sm truncate">{{ voDrawerRow?.siteName }}</span>
                </div>
                <p class="text-emerald-200 text-xs mt-0.5">
                  {{ voDrawerItems.length }} variation order{{ voDrawerItems.length !== 1 ? 's' : '' }}
                  <span v-if="voDrawerRow?.jobNumber"> · Job {{ voDrawerRow.jobNumber }}</span>
                </p>
              </div>
              <button @click="voDrawerOpen = false"
                class="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition shrink-0">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <!-- Summary pills -->
            <div class="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-emerald-50 flex-wrap">
              <span class="text-xs font-semibold text-gray-500">Total:</span>
              <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                {{ formatCurrency(voDrawerItems.reduce((s, v) => s + (v.voAmount || 0), 0)) }}
              </span>
              <template v-for="(count, status) in voDrawerStatusCounts" :key="status">
                <span class="px-2.5 py-1 rounded-full text-xs font-semibold"
                  :class="{
                    'bg-green-100 text-green-700': status === 'approved',
                    'bg-yellow-100 text-yellow-700': status === 'pending-approval',
                    'bg-blue-100 text-blue-700': status === 'submitted',
                    'bg-gray-100 text-gray-600': status === 'draft',
                    'bg-red-100 text-red-700': status === 'rejected',
                    'bg-slate-100 text-slate-600': status === 'cancelled',
                  }">
                  {{ formatStatus(status) }}: {{ count }}
                </span>
              </template>
            </div>
            <!-- VO List -->
            <div class="flex-1 overflow-y-auto divide-y divide-gray-100">
              <div v-if="voDrawerItems.length === 0" class="py-16 text-center text-sm text-gray-400">
                No VOs found for this site.
              </div>
              <div v-for="vo in voDrawerItems" :key="vo.id"
                class="px-5 py-3.5 hover:bg-gray-50 transition">
                <div class="flex items-start justify-between gap-3">
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">{{ vo.voDescription }}</p>
                    <div class="flex items-center gap-2 mt-1 flex-wrap">
                      <span v-if="vo.voCategory" class="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                        {{ vo.voCategory }}
                      </span>
                      <span v-if="vo.scope" class="text-xs text-gray-500">{{ vo.scope }}</span>
                      <span v-if="vo.poNumber" class="text-xs text-teal-600 font-medium">PO: {{ vo.poNumber }}</span>
                      <span v-if="vo.ticketNumber" class="text-xs text-gray-400">Ticket: {{ vo.ticketNumber }}</span>
                    </div>
                  </div>
                  <div class="flex flex-col items-end gap-1.5 shrink-0">
                    <span class="text-sm font-bold"
                      :class="vo.voStatus === 'cancelled' ? 'text-slate-400 line-through' : 'text-gray-900'">
                      {{ formatCurrency(vo.voAmount) }}
                    </span>
                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
                      :class="{
                        'bg-green-100 text-green-700': vo.voStatus === 'approved',
                        'bg-yellow-100 text-yellow-700': vo.voStatus === 'pending-approval',
                        'bg-blue-100 text-blue-700': vo.voStatus === 'submitted',
                        'bg-gray-100 text-gray-600': vo.voStatus === 'draft',
                        'bg-red-100 text-red-700': vo.voStatus === 'rejected',
                        'bg-slate-100 text-slate-500': vo.voStatus === 'cancelled',
                      }">
                      {{ formatStatus(vo.voStatus) }}
                    </span>
                  </div>
                </div>
                <div v-if="vo.invoiceStatus && vo.invoiceStatus !== 'Not Yet Sent'" class="mt-1.5">
                  <span class="text-xs text-indigo-600 font-medium">{{ vo.invoiceStatus }}</span>
                  <span v-if="vo.invoiceDate" class="text-xs text-gray-400 ml-1">· {{ formatDate(vo.invoiceDate) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
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

    <!-- Import result log -->
    <div v-if="importLog.length > 0" class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div class="flex items-center gap-3">
          <span class="text-sm font-bold text-gray-800">Import Result</span>
          <span v-if="importUpdated > 0" class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            {{ importUpdated }} updated
          </span>
          <span v-if="importNotFound > 0" class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            {{ importNotFound }} not found
          </span>
          <span v-if="importSkipped > 0" class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
            {{ importSkipped }} skipped (invalid status)
          </span>
        </div>
        <button @click="importLog = []" class="text-gray-400 hover:text-gray-600 p-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      <div class="divide-y divide-gray-100 max-h-64 overflow-y-auto">
        <div v-for="(entry, i) in importLog" :key="i"
          class="flex items-center gap-3 px-4 py-2.5"
          :class="{
            'bg-emerald-50': entry.result === 'updated',
            'bg-red-50':     entry.result === 'not-found',
            'bg-amber-50':   entry.result === 'skipped',
          }">
          <!-- Icon -->
          <div class="shrink-0">
            <svg v-if="entry.result === 'updated'" class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <svg v-else-if="entry.result === 'not-found'" class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            <svg v-else class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01"/>
            </svg>
          </div>
          <!-- Site ID -->
          <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-indigo-100 text-indigo-700 shrink-0">
            {{ entry.siteId }}
          </span>
          <!-- Message -->
          <span class="text-xs text-gray-700 flex-1">
            <template v-if="entry.result === 'updated'">
              Status updated:
              <span class="font-semibold text-gray-500 line-through">{{ entry.prevStatus === 'started' ? 'Started' : 'Not Started' }}</span>
              →
              <span class="font-semibold" :class="entry.newStatus === 'started' ? 'text-emerald-700' : 'text-amber-700'">
                {{ entry.newStatus === 'started' ? 'Started' : 'Not Started' }}
              </span>
            </template>
            <template v-else-if="entry.result === 'not-found'">
              Site ID not found in Site Status
            </template>
            <template v-else>
              Invalid status value <span class="font-mono bg-amber-100 px-1 rounded">"{{ entry.rawStatus }}"</span> — use "Started" or "Not Started"
            </template>
          </span>
          <!-- Row number -->
          <span class="text-xs text-gray-400 shrink-0">row {{ entry.row }}</span>
        </div>
      </div>
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
        <p class="text-xs text-gray-400 mt-1">{{ formatCurrency(startedCostToComplete) }} to complete</p>
      </div>
      <div class="bg-white rounded-xl border border-amber-200 shadow-sm px-5 py-4">
        <p class="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">Not Started</p>
        <p class="text-2xl font-bold text-amber-700">{{ notStartedRows.length }}</p>
        <p class="text-xs text-gray-400 mt-1">{{ formatCurrency(notStartedCostToComplete) }} to complete</p>
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
      <!-- Scope filter -->
      <div class="relative">
        <svg class="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/>
        </svg>
        <select v-model="scopeFilter"
          class="pl-8 pr-8 py-2 text-xs font-semibold border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400 appearance-none cursor-pointer"
          :class="scopeFilter !== 'all' ? 'text-emerald-700 border-emerald-300 bg-emerald-50' : 'text-gray-600'">
          <option value="all">All Scopes</option>
          <option v-for="scope in allScopes" :key="scope" :value="scope">{{ scope }}</option>
        </select>
        <svg class="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
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
          <!-- Filter summary row — shown whenever any filter is active -->
          <tr v-if="isFiltered" class="bg-emerald-50 border-b border-emerald-100">
            <td colspan="13" class="px-4 py-2.5">
              <div class="flex items-center justify-between gap-4 flex-wrap">
                <!-- Active filter chips -->
                <div class="flex items-center gap-1.5 flex-wrap">
                  <svg class="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/>
                  </svg>
                  <span class="text-xs font-semibold text-emerald-700">Filters:</span>
                  <button v-if="statusFilter !== 'all'"
                    @click="statusFilter = 'all'"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold transition"
                    :class="statusFilter === 'started'
                      ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                      : 'bg-amber-100 text-amber-700 hover:bg-amber-200'">
                    {{ statusFilter === 'started' ? 'Started' : 'Not Started' }}
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                  <button v-if="scopeFilter !== 'all'"
                    @click="scopeFilter = 'all'"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200 transition">
                    {{ scopeFilter }}
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                  <button v-if="search.trim()"
                    @click="search = ''"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition">
                    "{{ search }}"
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                  <button @click="statusFilter = 'all'; scopeFilter = 'all'; search = ''"
                    class="text-xs text-gray-400 hover:text-gray-600 underline transition ml-1">
                    Clear all
                  </button>
                </div>
                <!-- Stats for the filtered result set -->
                <div class="flex items-center gap-3 text-xs shrink-0">
                  <span class="font-semibold text-gray-700">
                    {{ filterSummary.count }} <span class="font-normal text-gray-400">of {{ filterSummary.total }} sites</span>
                  </span>
                  <span class="w-px h-3.5 bg-gray-200"></span>
                  <span class="flex items-center gap-1">
                    <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span class="font-semibold text-emerald-700">{{ filterSummary.started }}</span>
                    <span class="text-gray-400">started</span>
                  </span>
                  <span class="flex items-center gap-1">
                    <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span class="font-semibold text-amber-700">{{ filterSummary.notStarted }}</span>
                    <span class="text-gray-400">not started</span>
                  </span>
                  <span class="w-px h-3.5 bg-gray-200"></span>
                  <span class="font-semibold text-blue-700">{{ formatCurrency(filterSummary.costToComplete) }}</span>
                  <span class="text-gray-400">cost to complete</span>
                </div>
              </div>
            </td>
          </tr>
          <tr class="bg-emerald-700 text-white text-xs uppercase tracking-wider">
            <th class="px-4 py-3 text-left font-semibold">Site ID</th>
            <th class="px-4 py-3 text-left font-semibold">Site Name</th>
            <th class="px-4 py-3 text-left font-semibold">Job #</th>
            <th class="px-4 py-3 text-center font-semibold">Status</th>
            <th class="px-4 py-3 text-left font-semibold">Scope</th>
            <th class="px-4 py-3 text-right font-semibold">Days</th>
            <th class="px-4 py-3 text-right font-semibold">Hours</th>
            <th class="px-4 py-3 text-right font-semibold">People</th>
            <th class="px-4 py-3 text-right font-semibold">Rate</th>
            <th class="px-4 py-3 text-center font-semibold">VO Qty</th>
            <th class="px-4 py-3 text-right font-semibold">Cost to Complete</th>
            <th class="px-4 py-3 text-left font-semibold">Comment</th>
            <th class="px-4 py-3 text-center font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredRows.length === 0">
            <td colspan="13" class="px-4 py-8 text-center text-sm text-gray-400">No sites match your filter.</td>
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
            <td class="px-4 py-3">
              <div v-if="row.scopes.length" class="flex flex-wrap gap-1">
                <span v-for="scope in row.scopes" :key="scope"
                  class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {{ scope }}
                </span>
              </div>
              <span v-else class="text-gray-300 text-xs">—</span>
            </td>
            <td class="px-4 py-3 text-right">
              <span v-if="editingKey !== row.key" class="text-gray-800 font-medium cursor-pointer hover:text-emerald-700"
                @click="startEdit(row)">
                {{ row.qtyDays || '—' }}
              </span>
              <input v-else
                v-model="editForm.qtyDays"
                type="number"
                class="w-20 text-right border border-emerald-400 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                @keydown.enter="saveEdit(row)"
                @keydown.escape="cancelEdit" />
            </td>
            <td class="px-4 py-3 text-right">
              <span v-if="editingKey !== row.key" class="text-gray-800 font-medium cursor-pointer hover:text-emerald-700"
                @click="startEdit(row)">
                {{ row.qtyHours || '—' }}
              </span>
              <input v-else
                v-model="editForm.qtyHours"
                type="number"
                class="w-20 text-right border border-emerald-400 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                @keydown.enter="saveEdit(row)"
                @keydown.escape="cancelEdit" />
            </td>
            <td class="px-4 py-3 text-right">
              <span v-if="editingKey !== row.key" class="text-gray-800 font-medium cursor-pointer hover:text-emerald-700"
                @click="startEdit(row)">
                {{ row.qtyPeople || '—' }}
              </span>
              <input v-else
                v-model="editForm.qtyPeople"
                type="number"
                class="w-20 text-right border border-emerald-400 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                @keydown.enter="saveEdit(row)"
                @keydown.escape="cancelEdit" />
            </td>
            <td class="px-4 py-3 text-right">
              <span v-if="editingKey !== row.key" class="text-gray-800 font-medium cursor-pointer hover:text-emerald-700"
                @click="startEdit(row)">
                {{ row.rate ? formatCurrency(row.rate) : '—' }}
              </span>
              <input v-else
                v-model="editForm.rate"
                type="text"
                placeholder="0.00"
                class="w-24 text-right border border-emerald-400 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                @blur="formatRateInput"
                @focus="rawRateInput"
                @keydown.enter="saveEdit(row)"
                @keydown.escape="cancelEdit" />
            </td>
            <td class="px-4 py-3 text-center">
              <button @click="openVODrawer(row)"
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition"
                :class="voCountFor(row) > 0
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer'
                  : 'bg-gray-100 text-gray-400 cursor-default'"
                :disabled="voCountFor(row) === 0">
                {{ voCountFor(row) }}
                <svg v-if="voCountFor(row) > 0" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </td>
            <td class="px-4 py-3 text-right">
              <span class="text-gray-800 font-medium">
                {{ row.costToComplete ? formatCurrency(row.costToComplete) : '—' }}
              </span>
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
            <td colspan="10" class="px-4 py-3">
              {{ filteredRows.length }} site{{ filteredRows.length !== 1 ? 's' : '' }}
              <span v-if="statusFilter !== 'all' || scopeFilter !== 'all'" class="text-gray-400 font-normal"> (filtered)</span>
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
import { formatCurrency, formatStatus, formatDate } from '../utils/formatters'
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
const scopeFilter  = ref('all')
const syncMessage = ref('')
const syncing = ref(false)
const showDeleteConfirm = ref(false)
const editingKey = ref(null)
const editForm = ref({ qtyDays: '', qtyHours: '', qtyPeople: '', rate: '', comment: '' })
const voDrawerOpen = ref(false)
const voDrawerRow  = ref(null)
const importFileInput = ref(null)
const importLog = ref([])

const importUpdated  = computed(() => importLog.value.filter(e => e.result === 'updated').length)
const importNotFound = computed(() => importLog.value.filter(e => e.result === 'not-found').length)
const importSkipped  = computed(() => importLog.value.filter(e => e.result === 'skipped').length)

// ── Rows ─────────────────────────────────────────────────────────────────────
const rows = computed(() => {
  return Object.entries(siteData.value).map(([key, d]) => {
    const qtyDays = parseFloat(d.qtyDays) || 0
    const qtyHours = parseFloat(d.qtyHours) || 0
    const qtyPeople = parseFloat(d.qtyPeople) || 0
    const rate = parseFloat(d.rate) || 0
    const costToComplete = qtyDays * qtyHours * qtyPeople * rate
    return {
      key,
      siteId:        d.siteId,
      siteName:      d.siteName,
      jobNumber:     d.jobNumber,
      status:        d.status || 'not-started',
      scopes:        Array.isArray(d.scopes) ? d.scopes : [],
      qtyDays:       d.qtyDays || 0,
      qtyHours:      d.qtyHours || 0,
      qtyPeople:     d.qtyPeople || 0,
      rate:          d.rate || 0,
      costToComplete,
      comment:       d.comment || '',
    }
  }).sort((a, b) => (a.siteId || '').localeCompare(b.siteId || ''))
})

const allScopes = computed(() => {
  const set = new Set()
  rows.value.forEach(r => r.scopes.forEach(s => set.add(s)))
  return [...set].sort()
})

const filteredRows = computed(() => {
  let list = rows.value
  if (statusFilter.value !== 'all') list = list.filter(r => r.status === statusFilter.value)
  if (scopeFilter.value  !== 'all') list = list.filter(r => r.scopes.includes(scopeFilter.value))
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

const isFiltered = computed(() =>
  statusFilter.value !== 'all' || scopeFilter.value !== 'all' || search.value.trim() !== ''
)

const filterSummary = computed(() => {
  const list = filteredRows.value
  return {
    count:         list.length,
    total:         rows.value.length,
    started:       list.filter(r => r.status === 'started').length,
    notStarted:    list.filter(r => r.status === 'not-started').length,
    costToComplete: list.reduce((s, r) => s + (r.costToComplete || 0), 0),
  }
})

const startedRows    = computed(() => rows.value.filter(r => r.status === 'started'))
const notStartedRows = computed(() => rows.value.filter(r => r.status === 'not-started'))
const startedCostToComplete    = computed(() => startedRows.value.reduce((s, r) => s + (r.costToComplete || 0), 0))
const notStartedCostToComplete = computed(() => notStartedRows.value.reduce((s, r) => s + (r.costToComplete || 0), 0))
const totalCostToComplete      = computed(() => rows.value.reduce((s, r) => s + (r.costToComplete || 0), 0))

// ── VO Drawer ────────────────────────────────────────────────────────────────
function voItemsFor(row) {
  if (!row) return []
  const vos = store.vos.value || []
  if (row.siteId === 'Downtime') {
    return vos.filter(v => v.siteId === 'Downtime')
  }
  return vos.filter(v => v.siteId === row.siteId && v.jobNumber === row.jobNumber)
}

function voCountFor(row) {
  return voItemsFor(row).length
}

const voDrawerItems = computed(() => voItemsFor(voDrawerRow.value))

const voDrawerStatusCounts = computed(() => {
  const counts = {}
  voDrawerItems.value.forEach(v => {
    const s = v.voStatus || 'draft'
    counts[s] = (counts[s] || 0) + 1
  })
  return counts
})

function openVODrawer(row) {
  voDrawerRow.value = row
  voDrawerOpen.value = true
}

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

  // Collect all "Downtime" VOs and other VOs separately
  const downtimeVOs = []
  const otherVOs = []

  vos.forEach(vo => {
    // Skip Detail Site Survey category
    if ((vo.voCategory || '').trim().toLowerCase() === 'detail site survey') return
    // Skip rows where site ID or job number is NA / blank (except Downtime)
    if (vo.siteId !== 'Downtime' && (isNA(vo.siteId) || isNA(vo.jobNumber))) return

    if (vo.siteId === 'Downtime') {
      downtimeVOs.push(vo)
    } else {
      otherVOs.push(vo)
    }
  })

  // Build scope map: key → sorted unique scopes for other VOs
  const scopeMap = {}
  otherVOs.forEach(vo => {
    const key = rowKey(vo.siteId, vo.jobNumber)
    if (!scopeMap[key]) scopeMap[key] = new Set()
    if (vo.scope) scopeMap[key].add(vo.scope)
  })

  // Handle Downtime VOs: create only ONE row for all of them
  if (downtimeVOs.length > 0) {
    const downtimeKey = 'Downtime|'
    const downtimeScopes = [...new Set(downtimeVOs.map(v => v.scope).filter(Boolean))].sort()
    if (!siteData.value[downtimeKey]) {
      siteData.value[downtimeKey] = {
        siteId:    'Downtime',
        siteName:  'Downtime',
        jobNumber: '',
        status:    'not-started',
        scopes:    downtimeScopes,
        qtyDays:   0,
        qtyHours:  0,
        qtyPeople: 0,
        rate:      0,
        comment:   '',
      }
      added++
    } else {
      // Always refresh scopes from VOs
      siteData.value[downtimeKey].scopes = downtimeScopes
    }
  }

  // Handle other VOs: one row per siteId + jobNumber
  otherVOs.forEach(vo => {
    const key = rowKey(vo.siteId, vo.jobNumber)
    if (seen.has(key)) return
    seen.add(key)
    const scopes = scopeMap[key] ? [...scopeMap[key]].sort() : []
    if (!siteData.value[key]) {
      siteData.value[key] = {
        siteId:    vo.siteId,
        siteName:  vo.siteName,
        jobNumber: vo.jobNumber,
        status:    'not-started',
        scopes,
        qtyDays:   0,
        qtyHours:  0,
        qtyPeople: 0,
        rate:      0,
        comment:   '',
      }
      added++
    } else {
      // Update site name / job / scopes (scopes always come from VOs)
      siteData.value[key].siteId    = vo.siteId
      siteData.value[key].siteName  = vo.siteName
      siteData.value[key].jobNumber = vo.jobNumber
      siteData.value[key].scopes    = scopes
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
    qtyDays:   row.qtyDays ? String(row.qtyDays) : '',
    qtyHours:  row.qtyHours ? String(row.qtyHours) : '',
    qtyPeople: row.qtyPeople ? String(row.qtyPeople) : '',
    rate:      row.rate ? String(row.rate) : '',
    comment:   row.comment || '',
  }
}

function cancelEdit() {
  editingKey.value = null
}

function saveEdit(row) {
  const d = siteData.value[row.key]
  if (!d) return
  d.qtyDays   = parseFloat(editForm.value.qtyDays) || 0
  d.qtyHours  = parseFloat(editForm.value.qtyHours) || 0
  d.qtyPeople = parseFloat(editForm.value.qtyPeople) || 0
  const rateRaw = String(editForm.value.rate).replace(/[^0-9.]/g, '')
  d.rate      = parseFloat(rateRaw) || 0
  d.comment   = editForm.value.comment.trim()
  save(siteData.value)
  editingKey.value = null
}

function deleteRow(row) {
  delete siteData.value[row.key]
  save(siteData.value)
}

function formatRateInput(e) {
  const raw = String(e.target.value).replace(/[^0-9.]/g, '')
  const num = parseFloat(raw) || 0
  editForm.value.rate = num ? num.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''
}

function rawRateInput(e) {
  const raw = String(editForm.value.rate).replace(/[^0-9.]/g, '')
  editForm.value.rate = raw
  e.target.select()
}

function downloadImportTemplate() {
  const data = rows.value.map(r => ({
    'Site ID': r.siteId,
    'Status':  r.status === 'started' ? 'Started' : 'Not Started',
  }))
  // If no rows yet, ship a blank example
  if (data.length === 0) {
    data.push({ 'Site ID': 'EXAMPLE-001', 'Status': 'Started' })
    data.push({ 'Site ID': 'EXAMPLE-002', 'Status': 'Not Started' })
  }
  const ws = XLSX.utils.json_to_sheet(data)
  // Column widths
  ws['!cols'] = [{ wch: 20 }, { wch: 16 }]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Site Status Import')
  XLSX.writeFile(wb, 'Site_Status_Import_Template.xlsx')
}

function handleImportFile(event) {
  const file = event.target.files?.[0]
  if (!file) return
  // reset input so same file can be re-imported
  event.target.value = ''

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const wb = XLSX.read(e.target.result, { type: 'array' })
      const ws = wb.Sheets[wb.SheetNames[0]]
      const raw = XLSX.utils.sheet_to_json(ws, { defval: '' })

      // Build a lookup: siteId (lowercase) → storage key
      const siteIndex = {}
      Object.entries(siteData.value).forEach(([key, d]) => {
        if (d.siteId) siteIndex[(d.siteId + '').trim().toLowerCase()] = key
      })

      const log = []

      raw.forEach((row, idx) => {
        const rowNum = idx + 2  // 1-based + header
        const rawId     = String(row['Site ID'] || row['site id'] || row['SITE ID'] || '').trim()
        const rawStatus = String(row['Status']  || row['status']  || row['STATUS']  || '').trim()

        if (!rawId) return  // skip blank rows silently

        // Normalise status value
        const lower = rawStatus.toLowerCase()
        let normalised = null
        if (['started', 'yes', '1', 'true', 'start'].includes(lower))          normalised = 'started'
        else if (['not started', 'not-started', 'no', '0', 'false'].includes(lower)) normalised = 'not-started'

        if (!normalised) {
          log.push({ row: rowNum, siteId: rawId, result: 'skipped', rawStatus })
          return
        }

        const key = siteIndex[rawId.toLowerCase()]
        if (!key) {
          log.push({ row: rowNum, siteId: rawId, result: 'not-found' })
          return
        }

        const prev = siteData.value[key].status || 'not-started'
        siteData.value[key].status = normalised
        log.push({ row: rowNum, siteId: rawId, result: 'updated', prevStatus: prev, newStatus: normalised })
      })

      save(siteData.value)
      importLog.value = log
    } catch {
      importLog.value = [{ row: '—', siteId: '—', result: 'skipped', rawStatus: 'Could not parse file' }]
    }
  }
  reader.readAsArrayBuffer(file)
}

function exportToExcel() {
  const data = filteredRows.value.map(r => ({
    'Site ID':          r.siteId,
    'Site Name':        r.siteName,
    'Job Number':       r.jobNumber || '',
    'Status':           r.status === 'started' ? 'Started' : 'Not Started',
    'Days':             r.qtyDays || 0,
    'Hours':            r.qtyHours || 0,
    'People':           r.qtyPeople || 0,
    'Rate':             r.rate || 0,
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

<style scoped>
.drawer-enter-active,
.drawer-leave-active { transition: opacity 0.2s ease; }
.drawer-enter-active .relative,
.drawer-leave-active .relative { transition: transform 0.25s ease; }
.drawer-enter-from,
.drawer-leave-to { opacity: 0; }
.drawer-enter-from .relative,
.drawer-leave-to .relative { transform: translateX(100%); }
</style>
