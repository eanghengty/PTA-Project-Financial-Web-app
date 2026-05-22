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
          <p class="text-xs text-gray-400 mt-0.5">Track site progress, status, and cost to complete</p>
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

    <!-- Edit Site modal -->
    <teleport to="body">
      <div v-if="editingKey" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" @mousedown.self="cancelEdit">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
          <!-- Header -->
          <div class="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-emerald-700 rounded-t-2xl">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-white/20 text-white">
                  {{ editingRow?.siteId }}
                </span>
                <span class="text-white font-semibold text-sm truncate">{{ editingRow?.siteName }}</span>
              </div>
              <p class="text-emerald-200 text-xs mt-0.5">Edit site cost to complete</p>
            </div>
            <button @click="cancelEdit" class="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <!-- Body -->
          <div class="px-5 py-4 space-y-4 max-h-[75vh] overflow-y-auto">

            <!-- Copy-from-last-site banner -->
            <div v-if="showCopyBanner" class="flex items-start gap-3 px-3 py-2.5 rounded-xl bg-blue-50 border border-blue-200">
              <svg class="w-4 h-4 text-blue-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-semibold text-blue-700 mb-1">
                  Copy latest entry from
                  <span class="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800 mx-0.5">{{ lastSavedInfo.siteId }}</span>?
                </p>
                <div class="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-blue-600">
                  <span v-if="lastSavedInfo.entry.label" class="font-medium">{{ lastSavedInfo.entry.label }} ·</span>
                  <span>{{ lastSavedInfo.entry.qtyDays }}d × {{ lastSavedInfo.entry.qtyHours }}h × {{ lastSavedInfo.entry.qtyPeople }}p × {{ formatCurrency(lastSavedInfo.entry.rate) }}/hr</span>
                  <span class="font-bold text-blue-700">= {{ formatCurrency(calcEntryCost(lastSavedInfo.entry)) }}</span>
                </div>
              </div>
              <div class="flex items-center gap-1.5 shrink-0">
                <button @click="copySuggestedEntry"
                  class="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition">
                  Copy
                </button>
                <button @click="copyBannerDismissed = true"
                  class="p-1 rounded text-blue-400 hover:text-blue-600 transition">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Existing cost entries -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cost Entries</span>
                <span class="text-xs text-gray-400">{{ editEntries.length }} entr{{ editEntries.length === 1 ? 'y' : 'ies' }}</span>
              </div>

              <div v-if="editEntries.length === 0" class="py-4 text-center text-xs text-gray-400 border border-dashed border-gray-200 rounded-xl">
                No entries yet — add one below
              </div>

              <div v-else class="space-y-2">
                <div v-for="(entry, idx) in editEntries" :key="entry.id"
                  class="flex items-start gap-2 p-3 rounded-xl border transition"
                  :class="editingEntryId === entry.id
                    ? 'bg-amber-50 border-amber-300 ring-1 ring-amber-300'
                    : 'bg-emerald-50 border-emerald-100'">
                  <div class="flex-1 min-w-0">
                    <!-- Label + date -->
                    <div class="flex items-center gap-2 mb-1.5">
                      <span class="inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-[10px] font-bold shrink-0 transition"
                        :class="editingEntryId === entry.id ? 'bg-amber-500' : 'bg-emerald-600'">{{ idx + 1 }}</span>
                      <span v-if="entry.label" class="text-xs font-semibold truncate"
                        :class="editingEntryId === entry.id ? 'text-amber-800' : 'text-emerald-800'">{{ entry.label }}</span>
                      <span v-else class="text-xs text-gray-400 italic">No label</span>
                      <span v-if="editingEntryId === entry.id" class="ml-1 text-[10px] font-semibold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-full">editing</span>
                      <span v-if="entry.date" class="ml-auto text-[10px] text-gray-400 shrink-0">{{ formatDate(entry.date) }}</span>
                    </div>
                    <!-- Fields row -->
                    <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-600 ml-7">
                      <span><span class="font-medium text-gray-800">{{ entry.qtyDays }}</span> days</span>
                      <span class="text-gray-300">×</span>
                      <span><span class="font-medium text-gray-800">{{ entry.qtyHours }}</span> hrs</span>
                      <span class="text-gray-300">×</span>
                      <span><span class="font-medium text-gray-800">{{ entry.qtyPeople }}</span> people</span>
                      <span class="text-gray-300">×</span>
                      <span><span class="font-medium text-gray-800">{{ formatCurrency(entry.rate) }}</span>/hr</span>
                      <span class="text-gray-300">=</span>
                      <span class="font-bold text-emerald-700">{{ formatCurrency(calcEntryCost(entry)) }}</span>
                    </div>
                  </div>
                  <!-- Edit button -->
                  <button @click="startEditEntry(entry)"
                    class="p-1 rounded-lg transition shrink-0 mt-0.5"
                    :class="editingEntryId === entry.id ? 'text-amber-500 bg-amber-100' : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50'"
                    title="Edit this entry">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <!-- Delete button -->
                  <button @click="removeCostEntry(entry.id)"
                    class="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition shrink-0 mt-0.5"
                    title="Delete this entry">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Total bar -->
            <div class="flex items-center justify-between px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200">
              <span class="text-xs font-semibold text-gray-600">Total Cost to Complete</span>
              <span class="text-sm font-bold text-emerald-700">{{ formatCurrency(editTotalCost) }}</span>
            </div>

            <!-- Add / Edit entry form -->
            <div class="rounded-xl p-3 space-y-3 bg-white transition"
              :class="editingEntryId ? 'border border-amber-300 ring-1 ring-amber-200' : 'border border-dashed border-emerald-300'">
              <div class="flex items-center justify-between">
                <p class="text-xs font-semibold" :class="editingEntryId ? 'text-amber-600' : 'text-emerald-700'">
                  {{ editingEntryId ? 'Edit Entry' : 'Add Entry' }}
                </p>
                <button v-if="editingEntryId" @click="cancelEntryEdit"
                  class="text-[10px] text-gray-400 hover:text-gray-600 underline transition">
                  Cancel edit
                </button>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-gray-500 mb-1">Label <span class="text-gray-300 font-normal">(optional)</span></label>
                  <input v-model="newEntry.label" type="text" placeholder="e.g. Civil works…"
                    class="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"/>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-500 mb-1">Date <span class="text-gray-300 font-normal">(optional)</span></label>
                  <input v-model="newEntry.date" type="date"
                    class="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"/>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-gray-500 mb-1">Days</label>
                  <input v-model="newEntry.qtyDays" type="number" min="0" placeholder="0"
                    class="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"/>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-500 mb-1">Hours / Day</label>
                  <input v-model="newEntry.qtyHours" type="number" min="0" placeholder="0"
                    class="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"/>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-500 mb-1">People</label>
                  <input v-model="newEntry.qtyPeople" type="number" min="0" placeholder="0"
                    class="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"/>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-500 mb-1">Rate (AUD / hr)</label>
                  <input v-model="newEntry.rate" type="text" placeholder="0.00"
                    class="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    @blur="formatRateInput" @focus="rawRateInput"/>
                </div>
              </div>
              <!-- Entry cost preview + Add / Update button -->
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-2 text-xs text-gray-500">
                  <span>Entry cost:</span>
                  <span class="font-bold text-emerald-700">{{ formatCurrency(newEntryCost) }}</span>
                </div>
                <button v-if="!editingEntryId" @click="addCostEntry"
                  :disabled="!newEntryCost"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition disabled:opacity-40 disabled:cursor-not-allowed">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                  Add Entry
                </button>
                <button v-else @click="updateCostEntry"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-semibold hover:bg-amber-600 transition">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  Update Entry
                </button>
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-500 mb-1.5">Status</label>
              <div class="relative">
                <select v-model="editStatus"
                  class="w-full py-2 pr-9 text-sm border rounded-xl focus:outline-none focus:ring-2 appearance-none cursor-pointer"
                  :class="getSiteStatusSelectClass(editStatus)">
                  <option v-for="option in SITE_STATUS_OPTIONS" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
                <svg class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  :class="getSiteStatusMeta(editStatus).valueClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </div>

            <div v-if="editingRow?.isTunnelEligible" class="rounded-xl border border-gray-200 bg-gray-50 px-3 py-3">
              <label class="block text-xs font-semibold text-gray-500 mb-1.5">Visible Site Qty</label>
              <div class="flex items-start gap-3">
                <input v-model="editVisibleSiteQty" type="number" min="1" step="1"
                  class="w-24 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"/>
                <p class="text-xs text-gray-500 leading-5">
                  Tunnel rows can count as more than 1 visible site. Example: one tunnel row can be counted as 2, 3, or more sites in the Site Status summary cards.
                </p>
              </div>
            </div>

            <!-- Comment -->
            <div>
              <label class="block text-xs font-semibold text-gray-500 mb-1.5">Comment</label>
              <input v-model="editComment" type="text" placeholder="Add a comment…"
                class="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                @keydown.enter="saveEditModal"/>
            </div>
          </div>
          <!-- Footer -->
          <div class="flex gap-2 justify-end px-5 py-4 border-t border-gray-100">
            <button @click="cancelEdit"
              class="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition">
              Cancel
            </button>
            <button @click="saveEditModal"
              class="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition">
              Save
            </button>
          </div>
        </div>
      </div>
    </teleport>

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
              <span v-if="voDrawerRow?.hasLinkedJobs"
                class="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700"
                :title="voDrawerRow.linkedJobLabel">
                Linked Jobs: {{ voDrawerRow.linkedJobNumbers.length }}
              </span>
              <span v-if="voDrawerRow?.hasDetailSiteSurvey"
                class="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                Detail Survey
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
              <span class="font-semibold line-through" :class="getSiteStatusMeta(entry.prevStatus).valueClass">{{ getSiteStatusLabel(entry.prevStatus) }}</span>
              →
              <span class="font-semibold" :class="getSiteStatusMeta(entry.newStatus).valueClass">
                {{ getSiteStatusLabel(entry.newStatus) }}
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
    <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4">
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
          {{ isFiltered ? 'Visible Sites' : 'Total Sites' }}
        </p>
        <p class="text-2xl font-bold text-gray-900">{{ visibleSiteQtyTotal }}</p>
        <p class="text-xs text-gray-400 mt-1">
          {{ isFiltered ? `${trackedSiteQtyTotal} tracked overall` : 'unique sites tracked' }}
        </p>
      </div>
      <div v-for="card in statusCards" :key="card.value"
        class="bg-white rounded-xl shadow-sm px-5 py-4 border"
        :class="card.borderClass">
        <p class="text-xs font-semibold uppercase tracking-wider mb-1" :class="card.labelClass">{{ card.label }}</p>
        <p class="text-2xl font-bold" :class="card.valueClass">{{ card.count }}</p>
        <p class="text-xs text-gray-400 mt-1">{{ formatCurrency(card.costToComplete) }} to complete</p>
      </div>
      <div class="bg-white rounded-xl border border-blue-200 shadow-sm px-5 py-4">
        <p class="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1">
          {{ isFiltered ? 'Visible Cost to Complete' : 'Total Cost to Complete' }}
        </p>
        <p class="text-2xl font-bold text-blue-700">{{ formatCurrency(filteredTotalCostToComplete) }}</p>
        <p class="text-xs text-gray-400 mt-1">
          {{ isFiltered ? 'across visible sites' : 'across all sites' }}
        </p>
      </div>
    </div>

    <!-- Month active banner -->
    <div v-if="monthFilter" class="flex items-center gap-3 px-4 py-2.5 rounded-xl border bg-violet-50 border-violet-200">
      <svg class="w-4 h-4 text-violet-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>
      <p class="text-sm text-violet-700 font-medium flex-1">
        Showing cost entries for <strong>{{ allEntryMonths.find(m => m.value === monthFilter)?.label ?? monthFilter }}</strong> only. All amounts and KPI cards reflect this month's accumulation.
      </p>
      <button @click="monthFilter = ''" class="text-violet-400 hover:text-violet-600 transition">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
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
        <button v-for="option in SITE_STATUS_OPTIONS" :key="option.value" @click="statusFilter = option.value"
          class="px-3 py-1.5 rounded-lg text-xs font-semibold transition"
          :class="statusFilter === option.value ? option.filterActiveClass : 'text-gray-500 hover:bg-gray-100'">
          {{ option.label }}
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
      <!-- Month filter -->
      <div class="relative">
        <svg class="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" :class="monthFilter ? 'text-violet-500' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        <select v-model="monthFilter"
          class="pl-8 pr-8 py-2 text-xs font-semibold border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 appearance-none cursor-pointer"
          :class="monthFilter ? 'text-violet-700 border-violet-300 bg-violet-50' : 'text-gray-600 border-gray-200'">
          <option value="">All Months</option>
          <option v-for="m in allEntryMonths" :key="m.value" :value="m.value">{{ m.label }}</option>
        </select>
        <svg class="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </div>
      <p class="text-xs text-gray-400">{{ visibleSiteQtyTotal }} of {{ trackedSiteQtyTotal }} sites</p>
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
            <td colspan="11" class="px-4 py-2.5">
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
                    :class="[getSiteStatusMeta(statusFilter).pillClass, getSiteStatusMeta(statusFilter).pillHoverClass]">
                    {{ getSiteStatusLabel(statusFilter) }}
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
                  <button v-if="monthFilter"
                    @click="monthFilter = ''"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-700 hover:bg-violet-200 transition">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    {{ allEntryMonths.find(m => m.value === monthFilter)?.label ?? monthFilter }}
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                  <button @click="statusFilter = 'all'; scopeFilter = 'all'; search = ''; monthFilter = ''"
                    class="text-xs text-gray-400 hover:text-gray-600 underline transition ml-1">
                    Clear all
                  </button>
                </div>
                <!-- Stats for the filtered result set -->
                <div class="flex items-center gap-3 text-xs shrink-0">
                  <span class="font-semibold text-gray-700">
                    {{ filterSummary.count }} <span class="font-normal text-gray-400">of {{ filterSummary.total }} sites</span>
                  </span>
                  <template v-for="status in SITE_STATUS_OPTIONS" :key="status.value">
                    <span class="w-px h-3.5 bg-gray-200"></span>
                    <span class="flex items-center gap-1">
                      <span class="w-2 h-2 rounded-full" :class="status.dotClass"></span>
                      <span class="font-semibold" :class="status.valueClass">{{ filterSummary.statusCounts[status.value] || 0 }}</span>
                      <span class="text-gray-400">{{ status.label.toLowerCase() }}</span>
                    </span>
                  </template>
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
            <th class="px-4 py-3 text-center font-semibold">Entries</th>
            <th class="px-4 py-3 text-right font-semibold">Total Hours</th>
            <th class="px-4 py-3 text-center font-semibold">VO Qty</th>
            <th class="px-4 py-3 text-right font-semibold">Cost to Complete</th>
            <th class="px-4 py-3 text-left font-semibold">Comment</th>
            <th class="px-4 py-3 text-center font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredRows.length === 0">
            <td colspan="11" class="px-4 py-8 text-center text-sm text-gray-400">No sites match your filter.</td>
          </tr>
          <tr v-for="row in filteredRows" :key="row.key"
            class="border-t border-gray-100 hover:bg-gray-50 transition"
            :class="getSiteStatusMeta(row.status).rowBorderClass">
            <td class="px-4 py-3">
              <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-indigo-100 text-indigo-700">
                {{ row.siteId }}
              </span>
            </td>
            <td class="px-4 py-3 text-gray-800 font-medium">{{ row.siteName }}</td>
            <td class="px-4 py-3 text-gray-600">
              <div class="flex flex-col gap-1">
                <span>{{ row.jobNumber || '—' }}</span>
                <div class="flex flex-wrap gap-1">
                  <span v-if="row.isTunnelEligible && row.visibleSiteQty > 1"
                    class="inline-flex w-fit px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-wider border border-gray-200">
                    Counts as {{ row.visibleSiteQty }} Sites
                  </span>
                  <span v-if="row.hasLinkedJobs"
                    class="inline-flex w-fit px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider border border-blue-200"
                    :title="row.linkedJobLabel">
                    +{{ row.linkedJobNumbers.length }} Linked Job{{ row.linkedJobNumbers.length !== 1 ? 's' : '' }}
                  </span>
                  <span v-if="row.hasDetailSiteSurvey"
                    class="inline-flex w-fit px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider border border-amber-200">
                    Detail Survey
                  </span>
                </div>
                <span v-if="row.hasLinkedJobs" class="text-[10px] text-gray-400 leading-4">
                  {{ row.linkedJobLabel }}
                </span>
              </div>
            </td>
            <td class="px-4 py-3 text-center">
              <div class="relative inline-flex">
                <select :value="row.status" @change="updateRowStatus(row, $event.target.value)"
                  class="py-1 pr-9 rounded-full text-xs font-bold border appearance-none cursor-pointer transition"
                  :class="getSiteStatusSelectClass(row.status)">
                  <option v-for="option in SITE_STATUS_OPTIONS" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
                <span class="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                  :class="getSiteStatusMeta(row.status).dotClass"></span>
                <svg class="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  :class="getSiteStatusMeta(row.status).valueClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
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
            <td class="px-4 py-3 text-center">
              <button @click="startEdit(row)"
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition"
                :class="row.costEntries.length > 0
                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'">
                {{ row.costEntries.length }}
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>
            </td>
            <td class="px-4 py-3 text-right">
              <span class="text-gray-800 font-medium">
                {{ row.totalHours ? formatHours(row.totalHours) : '—' }}
              </span>
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
            <td class="px-4 py-3 text-gray-600 text-xs line-clamp-2 max-w-xs">{{ row.comment || '—' }}</td>
            <td class="px-4 py-3 text-center">
              <div class="flex items-center justify-center gap-1">
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
            </td>
          </tr>
        </tbody>
        <!-- Footer totals -->
        <tfoot>
          <tr class="bg-gray-50 border-t-2 border-gray-200 text-xs font-semibold text-gray-600">
            <td colspan="7" class="px-4 py-3">
              {{ visibleSiteQtyTotal }} site{{ visibleSiteQtyTotal !== 1 ? 's' : '' }}
              <span v-if="isFiltered" class="text-gray-400 font-normal"> (filtered)</span>
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
import { ref, computed, watch } from 'vue'
import { useVOStore } from '../stores/voStore'
import { formatCurrency, formatStatus, formatDate } from '../utils/formatters'
import * as XLSX from 'xlsx'

const STORAGE_KEY = 'siteStatusData'
const PRIORITY_SITE_STATUS_CATEGORIES = ['Site Survey', 'WOP', 'SAT&SIT', 'C&I', 'Snag Closure']
const PRIORITY_SITE_STATUS_CATEGORY_KEYS = new Set(PRIORITY_SITE_STATUS_CATEGORIES.map(normaliseCategory))
const SITE_STATUS_OPTIONS = [
  {
    value: 'started',
    label: 'Started',
    borderClass: 'border-emerald-200',
    labelClass: 'text-emerald-600',
    valueClass: 'text-emerald-700',
    pillClass: 'bg-emerald-100 text-emerald-700',
    pillHoverClass: 'hover:bg-emerald-200',
    dotClass: 'bg-emerald-500',
    rowBorderClass: 'border-l-4 border-l-emerald-400',
    filterActiveClass: 'bg-emerald-600 text-white',
    selectClass: 'pl-7 border-emerald-200 bg-emerald-50 text-emerald-700 focus:ring-emerald-400',
  },
  {
    value: 'not-started',
    label: 'Not Started',
    borderClass: 'border-amber-200',
    labelClass: 'text-amber-600',
    valueClass: 'text-amber-700',
    pillClass: 'bg-amber-100 text-amber-700',
    pillHoverClass: 'hover:bg-amber-200',
    dotClass: 'bg-amber-500',
    rowBorderClass: 'border-l-4 border-l-amber-300',
    filterActiveClass: 'bg-amber-500 text-white',
    selectClass: 'pl-7 border-amber-200 bg-amber-50 text-amber-700 focus:ring-amber-400',
  },
  {
    value: 'cancel',
    label: 'Cancel',
    borderClass: 'border-slate-200',
    labelClass: 'text-slate-600',
    valueClass: 'text-slate-700',
    pillClass: 'bg-slate-100 text-slate-700',
    pillHoverClass: 'hover:bg-slate-200',
    dotClass: 'bg-slate-500',
    rowBorderClass: 'border-l-4 border-l-slate-300',
    filterActiveClass: 'bg-slate-600 text-white',
    selectClass: 'pl-7 border-slate-200 bg-slate-50 text-slate-700 focus:ring-slate-400',
  },
  {
    value: 'other',
    label: 'Other',
    borderClass: 'border-blue-200',
    labelClass: 'text-blue-600',
    valueClass: 'text-blue-700',
    pillClass: 'bg-blue-100 text-blue-700',
    pillHoverClass: 'hover:bg-blue-200',
    dotClass: 'bg-blue-500',
    rowBorderClass: 'border-l-4 border-l-blue-300',
    filterActiveClass: 'bg-blue-600 text-white',
    selectClass: 'pl-7 border-blue-200 bg-blue-50 text-blue-700 focus:ring-blue-400',
  },
]
const SITE_STATUS_META = Object.fromEntries(SITE_STATUS_OPTIONS.map(option => [option.value, option]))

const store = useVOStore()

function getSiteStatusMeta(status) {
  return SITE_STATUS_META[status] || SITE_STATUS_META['not-started']
}

function getSiteStatusLabel(status) {
  return getSiteStatusMeta(status).label
}

function getSiteStatusSelectClass(status) {
  return getSiteStatusMeta(status).selectClass
}

function normaliseSiteStatus(value) {
  const lower = String(value || '').trim().toLowerCase()
  if (['started', 'yes', '1', 'true', 'start'].includes(lower)) return 'started'
  if (['not started', 'not-started', 'not start', 'no', '0', 'false'].includes(lower)) return 'not-started'
  if (['cancel', 'cancelled', 'canceled'].includes(lower)) return 'cancel'
  if (lower === 'other') return 'other'
  return null
}

// ── Persist helpers ──────────────────────────────────────────────────────────
function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} }
}
function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  window.dispatchEvent(new Event('siteStatusUpdated'))
}

// Migrate old single-field records to costEntries array
function migrate(data) {
  for (const d of Object.values(data)) {
    if (!Array.isArray(d.costEntries)) {
      const days    = parseFloat(d.qtyDays)   || 0
      const hours   = parseFloat(d.qtyHours)  || 0
      const people  = parseFloat(d.qtyPeople) || 0
      const rate    = parseFloat(d.rate)       || 0
      d.costEntries = (days || hours || people || rate)
        ? [{ id: Date.now(), label: '', qtyDays: days, qtyHours: hours, qtyPeople: people, rate }]
        : []
      delete d.qtyDays; delete d.qtyHours; delete d.qtyPeople; delete d.rate
    }
  }
  return data
}

function calcEntryCost(e) {
  return (parseFloat(e.qtyDays) || 0) * (parseFloat(e.qtyHours) || 0) *
         (parseFloat(e.qtyPeople) || 0) * (parseFloat(e.rate) || 0)
}

function calcEntryHours(e) {
  return (parseFloat(e.qtyDays) || 0) * (parseFloat(e.qtyHours) || 0) *
         (parseFloat(e.qtyPeople) || 0)
}

function formatHours(value) {
  return `${(Number(value) || 0).toLocaleString('en-AU', { maximumFractionDigits: 2 })}h`
}

// ── State ────────────────────────────────────────────────────────────────────
const siteData = ref(migrate(load()))
const search = ref('')
const statusFilter = ref('all')
const scopeFilter  = ref('all')
const monthFilter  = ref('')   // 'YYYY-MM' or '' for all
const syncMessage = ref('')
const syncing = ref(false)
const showDeleteConfirm = ref(false)

// ── Edit modal state ─────────────────────────────────────────────────────────
const editingKey     = ref(null)
const editingRow     = ref(null)
const editEntries    = ref([])   // working copy of costEntries
const editComment    = ref('')
const editStatus     = ref('not-started')
const editVisibleSiteQty = ref('1')
const editingEntryId = ref(null) // id of the entry currently being edited (null = add mode)
const newEntry       = ref({ label: '', date: '', qtyDays: '', qtyHours: '', qtyPeople: '', rate: '' })

// ── Copy-from-last-site suggestion ───────────────────────────────────────────
const lastSavedInfo       = ref(null) // { siteKey, siteId, siteName, entry } — set on save
const copyBannerDismissed = ref(false)

const showCopyBanner = computed(() =>
  lastSavedInfo.value !== null &&
  editingKey.value !== null &&
  editingKey.value !== lastSavedInfo.value.siteKey &&
  !copyBannerDismissed.value
)

const newEntryCost = computed(() => {
  const d = parseFloat(newEntry.value.qtyDays)  || 0
  const h = parseFloat(newEntry.value.qtyHours) || 0
  const p = parseFloat(newEntry.value.qtyPeople)|| 0
  const r = parseFloat(String(newEntry.value.rate).replace(/[^0-9.]/g, '')) || 0
  return d * h * p * r
})

const editTotalCost = computed(() =>
  editEntries.value.reduce((s, e) => s + calcEntryCost(e), 0)
)

const voDrawerOpen = ref(false)
const voDrawerRow  = ref(null)
const importFileInput = ref(null)
const importLog = ref([])

const importUpdated  = computed(() => importLog.value.filter(e => e.result === 'updated').length)
const importNotFound = computed(() => importLog.value.filter(e => e.result === 'not-found').length)
const importSkipped  = computed(() => importLog.value.filter(e => e.result === 'skipped').length)

// ── Rows ─────────────────────────────────────────────────────────────────────
const rows = computed(() => {
  const grouped = new Map()
  Object.entries(siteData.value).forEach(([key, row]) => {
    const siteKey = normaliseMatchValue(row.siteId)
    if (!grouped.has(siteKey)) grouped.set(siteKey, [])
    grouped.get(siteKey).push([key, row])
  })

  return [...grouped.values()]
    .map(buildGroupedSiteRow)
    .sort((a, b) => (a.siteId || '').localeCompare(b.siteId || ''))
})

function normaliseCategory(value) {
  return String(value ?? '').trim().toLowerCase()
}

function isDetailSiteSurveyVO(vo) {
  return normaliseCategory(vo?.voCategory) === 'detail site survey'
}

function isPrioritySiteStatusVO(vo) {
  return PRIORITY_SITE_STATUS_CATEGORY_KEYS.has(normaliseCategory(vo?.voCategory))
}

function normaliseMatchValue(value) {
  return String(value ?? '').trim().toLowerCase()
}

function sameSiteId(a, b) {
  return normaliseMatchValue(a) === normaliseMatchValue(b)
}

function sameJobNumber(a, b) {
  return normaliseMatchValue(a) === normaliseMatchValue(b)
}

function isNonActualSiteId(siteId) {
  return /^not\s+site\b/i.test(String(siteId ?? '').trim())
}

function countsAsActualSite(row) {
  return !isNonActualSiteId(row?.siteId)
}

function parseVisibleSiteQty(value) {
  const qty = Math.floor(Number(value) || 0)
  return qty > 0 ? qty : 1
}

function isTunnelScope(scope) {
  return /\btunnel\b/i.test(String(scope ?? '').trim())
}

function visibleSiteCountForRow(row) {
  if (!countsAsActualSite(row)) return 0
  if (!row?.isTunnelEligible) return 1
  return parseVisibleSiteQty(row.visibleSiteQty)
}

function uniqueTextList(values) {
  const seen = new Set()
  const result = []
  values.forEach(value => {
    const text = String(value ?? '').trim()
    if (!text) return
    const key = text.toLowerCase()
    if (seen.has(key)) return
    seen.add(key)
    result.push(text)
  })
  return result
}

function getSiteEntries(siteId) {
  return Object.entries(siteData.value).filter(([, row]) => sameSiteId(row.siteId, siteId))
}

function priorityJobNumbersForSite(siteId) {
  const vos = (store.vos.value || []).filter(vo =>
    sameSiteId(vo.siteId, siteId) &&
    isPrioritySiteStatusVO(vo)
  )
  const jobs = []
  PRIORITY_SITE_STATUS_CATEGORIES.forEach(category => {
    uniqueTextList(
      vos
        .filter(vo => normaliseCategory(vo.voCategory) === normaliseCategory(category))
        .map(vo => vo.jobNumber)
    ).forEach(job => jobs.push(job))
  })
  return jobs
}

function pickPrimarySiteEntry(entries) {
  const orderedEntries = [...entries].sort((a, b) => {
    const aJob = String(a[1]?.jobNumber || '')
    const bJob = String(b[1]?.jobNumber || '')
    if (!!aJob !== !!bJob) return aJob ? -1 : 1
    return aJob.localeCompare(bJob) || String(a[0] || '').localeCompare(String(b[0] || ''))
  })

  const siteId = orderedEntries[0]?.[1]?.siteId
  const priorityJobs = priorityJobNumbersForSite(siteId)
  for (const job of priorityJobs) {
    const match = orderedEntries.find(([, row]) => sameJobNumber(row.jobNumber, job))
    if (match) return match
  }

  return orderedEntries[0]
}

function resolveGroupedStatus(primaryRow, entries) {
  const primaryStatus = normaliseSiteStatus(primaryRow?.status) || 'not-started'
  if (primaryStatus !== 'not-started') return primaryStatus
  const linkedStatus = entries
    .map(([, row]) => normaliseSiteStatus(row?.status) || 'not-started')
    .find(status => status !== 'not-started')
  return linkedStatus || primaryStatus
}

function buildGroupedSiteRow(entries) {
  const [primaryKey, primaryRow] = pickPrimarySiteEntry(entries)
  const linkedKeys = entries.map(([key]) => key)
  const jobNumbers = uniqueTextList(entries.map(([, row]) => row.jobNumber))
  const linkedJobNumbers = jobNumbers.filter(job => !sameJobNumber(job, primaryRow?.jobNumber))
  const commentParts = uniqueTextList(entries.map(([, row]) => row.comment))
  const costEntries = entries.flatMap(([, row]) =>
    Array.isArray(row.costEntries) ? row.costEntries.map(entry => ({ ...entry })) : []
  )
  const scopes = new Set()
  entries.forEach(([, row]) => {
    mergedScopesFor(row).forEach(scope => scopes.add(scope))
  })
  const scopeList = [...scopes].sort()
  const isTunnelEligible = scopeList.some(isTunnelScope)
  const visibleSiteQty = isTunnelEligible
    ? Math.max(...entries.map(([, row]) => parseVisibleSiteQty(row?.visibleSiteQty)))
    : 1

  return {
    key: primaryKey,
    linkedKeys,
    linkedJobNumbers,
    hasLinkedJobs: linkedJobNumbers.length > 0,
    linkedJobLabel: linkedJobNumbers.join(', '),
    siteId: primaryRow?.siteId,
    siteName: uniqueTextList(entries.map(([, row]) => row.siteName))[0] || '',
    jobNumber: primaryRow?.jobNumber,
    hasDetailSiteSurvey: hasDetailSiteSurveyFor(primaryRow),
    status: resolveGroupedStatus(primaryRow, entries),
    scopes: scopeList,
    isTunnelEligible,
    visibleSiteQty,
    costEntries,
    totalHours: costEntries.reduce((sum, entry) => sum + calcEntryHours(entry), 0),
    costToComplete: costEntries.reduce((sum, entry) => sum + calcEntryCost(entry), 0),
    comment: commentParts.join('; '),
    searchJobText: jobNumbers.join(' '),
  }
}

function hasDetailSiteSurveyFor(row) {
  if (!row || row.siteId === 'Downtime') return false
  return (store.vos.value || []).some(vo =>
    sameSiteId(vo.siteId, row.siteId) &&
    isDetailSiteSurveyVO(vo)
  )
}

function detailSiteSurveyVOsFor(row) {
  if (!row || row.siteId === 'Downtime') return []
  return (store.vos.value || []).filter(vo =>
    sameSiteId(vo.siteId, row.siteId) &&
    isDetailSiteSurveyVO(vo)
  )
}

function isDetailSurveyOnlyRow(row) {
  if (!row || row.siteId === 'Downtime') return false
  if (!hasDetailSiteSurveyFor(row)) return false
  return !(store.vos.value || []).some(vo =>
    sameSiteId(vo.siteId, row.siteId) &&
    sameJobNumber(vo.jobNumber, row.jobNumber) &&
    !isDetailSiteSurveyVO(vo)
  )
}

function mergedScopesFor(row) {
  const scopes = new Set(Array.isArray(row.scopes) ? row.scopes : [])
  detailSiteSurveyVOsFor(row).forEach(vo => {
    if (vo.scope) scopes.add(vo.scope)
  })
  return [...scopes].sort()
}

const allScopes = computed(() => {
  const set = new Set()
  rows.value.forEach(r => r.scopes.forEach(s => set.add(s)))
  return [...set].sort()
})

// All months that appear in any cost entry (with a date), sorted chronologically
const allEntryMonths = computed(() => {
  const map = {}
  for (const d of Object.values(siteData.value)) {
    for (const e of (d.costEntries || [])) {
      if (!e.date) continue
      const dt = new Date(e.date)
      if (isNaN(dt)) continue
      const key   = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`
      const label = dt.toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })
      map[key] = label
    }
  }
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([value, label]) => ({ value, label }))
})

// Helper: filter entries to the selected month, or return all if no month selected
function entriesForMonth(entries) {
  if (!monthFilter.value) return entries
  return entries.filter(e => {
    if (!e.date) return false
    const dt = new Date(e.date)
    if (isNaN(dt)) return false
    const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`
    return key === monthFilter.value
  })
}

const filteredRows = computed(() => {
  let list = rows.value

  // Apply site-level filters first
  if (statusFilter.value !== 'all') list = list.filter(r => r.status === statusFilter.value)
  if (scopeFilter.value  !== 'all') list = list.filter(r => r.scopes.includes(scopeFilter.value))
  if (search.value.trim()) {
    const q = search.value.trim().toLowerCase()
    list = list.filter(r =>
      r.siteId?.toLowerCase().includes(q) ||
      r.siteName?.toLowerCase().includes(q) ||
      r.jobNumber?.toLowerCase().includes(q) ||
      r.searchJobText?.toLowerCase().includes(q)
    )
  }

  // If a month is selected, remap costEntries and costToComplete to that month only
  if (!monthFilter.value) return list
  return list.map(r => {
    const monthEntries = entriesForMonth(r.costEntries)
    const costToComplete = monthEntries.reduce((s, e) => s + calcEntryCost(e), 0)
    const totalHours = monthEntries.reduce((s, e) => s + calcEntryHours(e), 0)
    return { ...r, costEntries: monthEntries, totalHours, costToComplete }
  })
})

const visibleSiteRows = computed(() => filteredRows.value.filter(countsAsActualSite))
const trackedSiteRows = computed(() => rows.value.filter(countsAsActualSite))
const visibleSiteQtyTotal = computed(() =>
  visibleSiteRows.value.reduce((sum, row) => sum + visibleSiteCountForRow(row), 0)
)
const trackedSiteQtyTotal = computed(() =>
  trackedSiteRows.value.reduce((sum, row) => sum + visibleSiteCountForRow(row), 0)
)

const isFiltered = computed(() =>
  statusFilter.value !== 'all' || scopeFilter.value !== 'all' ||
  search.value.trim() !== '' || monthFilter.value !== ''
)

const filterSummary = computed(() => {
  const list = visibleSiteRows.value
  const statusCounts = Object.fromEntries(SITE_STATUS_OPTIONS.map(option => [option.value, 0]))
  list.forEach(row => {
    if (Object.prototype.hasOwnProperty.call(statusCounts, row.status)) {
      statusCounts[row.status] += visibleSiteCountForRow(row)
    }
  })
  return {
    count:         list.reduce((sum, row) => sum + visibleSiteCountForRow(row), 0),
    total:         trackedSiteRows.value.reduce((sum, row) => sum + visibleSiteCountForRow(row), 0),
    statusCounts,
    costToComplete: filteredRows.value.reduce((s, r) => s + (r.costToComplete || 0), 0),
  }
})

const statusCards = computed(() => {
  return SITE_STATUS_OPTIONS.map(option => {
    const countItems = visibleSiteRows.value.filter(row => row.status === option.value)
    const amountItems = filteredRows.value.filter(row => row.status === option.value)
    return {
      ...option,
      count: countItems.reduce((sum, row) => sum + visibleSiteCountForRow(row), 0),
      costToComplete: amountItems.reduce((sum, row) => sum + (row.costToComplete || 0), 0),
    }
  })
})

const filteredTotalCostToComplete = computed(() =>
  filteredRows.value.reduce((sum, row) => sum + (row.costToComplete || 0), 0)
)

// ── VO Drawer ────────────────────────────────────────────────────────────────
function voItemsFor(row) {
  if (!row) return []
  const vos = store.vos.value || []
  if (row.siteId === 'Downtime') {
    return vos.filter(v => v.siteId === 'Downtime')
  }
  const items = vos.filter(v => sameSiteId(v.siteId, row.siteId))
  return [...new Map(items.map(vo => [vo.id, vo])).values()]
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

function mergeRowData(target, source) {
  const targetEntries = Array.isArray(target.costEntries) ? target.costEntries : []
  const sourceEntries = Array.isArray(source.costEntries) ? source.costEntries : []
  target.costEntries = [...targetEntries, ...sourceEntries.map(e => ({ ...e }))]
  target.scopes = [...new Set([
    ...(Array.isArray(target.scopes) ? target.scopes : []),
    ...(Array.isArray(source.scopes) ? source.scopes : []),
  ].filter(Boolean))].sort()
  const sourceStatus = normaliseSiteStatus(source.status) || 'not-started'
  const targetStatus = normaliseSiteStatus(target.status) || 'not-started'
  if (targetStatus === 'not-started' && sourceStatus !== 'not-started') target.status = sourceStatus
  if (source.comment && !target.comment) {
    target.comment = source.comment
  } else if (source.comment && target.comment && !target.comment.includes(source.comment)) {
    target.comment = `${target.comment}; ${source.comment}`
  }
}

function mergeDetailSurveyRowsIntoSiteRows() {
  let merged = 0
  for (const [key, row] of Object.entries(siteData.value)) {
    if (!siteData.value[key] || !isDetailSurveyOnlyRow(row)) continue

    const sameSiteRows = Object.entries(siteData.value).filter(([otherKey, other]) =>
      otherKey !== key && sameSiteId(other.siteId, row.siteId)
    )
    const primary = sameSiteRows.find(([, other]) => !isDetailSurveyOnlyRow(other))
    const canonicalKey = rowKey(row.siteId, '')
    const canonical = key !== canonicalKey ? siteData.value[canonicalKey] : null
    const targetKey = primary?.[0] || (canonical ? canonicalKey : null)
    if (!targetKey) continue

    mergeRowData(siteData.value[targetKey], row)
    delete siteData.value[key]
    merged++
  }
  return merged
}

function linkedKeysForRow(row) {
  if (Array.isArray(row?.linkedKeys) && row.linkedKeys.length) {
    return row.linkedKeys.filter(key => siteData.value[key])
  }
  if (row?.key && siteData.value[row.key]?.siteId) {
    return getSiteEntries(siteData.value[row.key].siteId).map(([key]) => key)
  }
  return row?.key && siteData.value[row.key] ? [row.key] : []
}

function normaliseGroupedSiteStatuses() {
  let changed = 0
  rows.value.forEach(row => {
    const safeStatus = normaliseSiteStatus(row.status) || 'not-started'
    linkedKeysForRow(row).forEach(key => {
      if (!siteData.value[key]) return
      const currentStatus = normaliseSiteStatus(siteData.value[key].status) || 'not-started'
      if (currentStatus === safeStatus) return
      siteData.value[key].status = safeStatus
      changed++
    })
  })
  return changed
}

watch(
  () => store.vos.value?.length || 0,
  () => {
    const merged = mergeDetailSurveyRowsIntoSiteRows()
    const normalised = normaliseGroupedSiteStatuses()
    if (merged > 0 || normalised > 0) save(siteData.value)
  },
  { immediate: true }
)

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
  const existingSiteIds = new Set(Object.values(siteData.value).map(row => normaliseMatchValue(row.siteId)))
  const addedSiteIds = new Set()

  function markSiteAdded(siteId) {
    const siteKey = normaliseMatchValue(siteId)
    if (!siteKey || existingSiteIds.has(siteKey) || addedSiteIds.has(siteKey)) return
    addedSiteIds.add(siteKey)
    added++
  }

  // Collect special rows separately. Detail Site Survey follows the site row
  // and should not create its own Site Status line when a normal site row exists.
  const downtimeVOs = []
  const detailSurveyVOs = []
  const otherVOs = []

  vos.forEach(vo => {
    // Normal VOs need site + job. Detail Site Survey can attach by site only.
    if (vo.siteId !== 'Downtime' && isNA(vo.siteId)) return
    if (vo.siteId !== 'Downtime' && !isDetailSiteSurveyVO(vo) && isNA(vo.jobNumber)) return

    if (vo.siteId === 'Downtime') {
      downtimeVOs.push(vo)
    } else if (isDetailSiteSurveyVO(vo)) {
      detailSurveyVOs.push(vo)
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
        siteId:       'Downtime',
        siteName:     'Downtime',
        jobNumber:    '',
        status:       'not-started',
        scopes:       downtimeScopes,
        costEntries:  [],
        comment:      '',
      }
      markSiteAdded('Downtime')
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
        siteId:      vo.siteId,
        siteName:    vo.siteName,
        jobNumber:   vo.jobNumber,
        status:      'not-started',
        scopes,
        costEntries: [],
        comment:     '',
      }
      markSiteAdded(vo.siteId)
    } else {
      // Update site name / job / scopes (scopes always come from VOs)
      siteData.value[key].siteId    = vo.siteId
      siteData.value[key].siteName  = vo.siteName
      siteData.value[key].jobNumber = vo.jobNumber
      siteData.value[key].scopes    = scopes
    }
  })

  // If a site only has Detail Site Survey records, keep one site-level row so it
  // can still be tracked. Once a normal VO exists for that site, the merge below
  // folds this row into the normal site line.
  const sitesWithNormalRows = new Set(otherVOs.map(vo => normaliseMatchValue(vo.siteId)))
  const detailSurveyFallbacks = new Map()
  detailSurveyVOs.forEach(vo => {
    const siteKey = normaliseMatchValue(vo.siteId)
    if (sitesWithNormalRows.has(siteKey) || detailSurveyFallbacks.has(siteKey)) return
    detailSurveyFallbacks.set(siteKey, vo)
  })

  detailSurveyFallbacks.forEach(vo => {
    const key = rowKey(vo.siteId, '')
    const scopes = [...new Set(detailSurveyVOs
      .filter(v => sameSiteId(v.siteId, vo.siteId))
      .map(v => v.scope)
      .filter(Boolean))].sort()
    if (!siteData.value[key]) {
      siteData.value[key] = {
        siteId:      vo.siteId,
        siteName:    vo.siteName,
        jobNumber:   '',
        status:      'not-started',
        scopes,
        costEntries: [],
        comment:     '',
      }
      markSiteAdded(vo.siteId)
    } else {
      siteData.value[key].siteId    = vo.siteId
      siteData.value[key].siteName  = vo.siteName
      siteData.value[key].jobNumber = ''
      siteData.value[key].scopes    = scopes
    }
  })

  const merged = mergeDetailSurveyRowsIntoSiteRows()
  const normalised = normaliseGroupedSiteStatuses()

  save(siteData.value)
  syncing.value = false
  syncMessage.value = added > 0
    ? `Synced ${added} new site${added !== 1 ? 's' : ''} from Variations${merged ? ` and merged ${merged} Detail Survey row${merged !== 1 ? 's' : ''}` : ''}${normalised ? ` and aligned ${normalised} linked row status${normalised !== 1 ? 'es' : ''}` : ''}.`
    : merged > 0 || normalised > 0
      ? `${merged ? `Merged ${merged} Detail Survey row${merged !== 1 ? 's' : ''} into the main site line.` : ''}${merged && normalised ? ' ' : ''}${normalised ? `Aligned ${normalised} linked row status${normalised !== 1 ? 'es' : ''}.` : ''}`
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

function applyStatusToLinkedRows(row, nextStatus) {
  const safeStatus = normaliseSiteStatus(nextStatus) || 'not-started'
  linkedKeysForRow(row).forEach(key => {
    if (siteData.value[key]) siteData.value[key].status = safeStatus
  })
}

function updateRowStatus(row, nextStatus) {
  applyStatusToLinkedRows(row, nextStatus)
  save(siteData.value)
}

function startEdit(row) {
  editingKey.value     = row.key
  editingRow.value     = row
  editEntries.value    = row.costEntries.map(e => ({ ...e }))  // deep copy
  editComment.value    = row.comment || ''
  editStatus.value     = normaliseSiteStatus(row.status) || 'not-started'
  editVisibleSiteQty.value = String(parseVisibleSiteQty(row.visibleSiteQty))
  editingEntryId.value = null
  newEntry.value       = { label: '', date: '', qtyDays: '', qtyHours: '', qtyPeople: '', rate: '' }
  copyBannerDismissed.value = false
}

function cancelEdit() {
  editingKey.value = null
  editingRow.value = null
  editStatus.value = 'not-started'
  editVisibleSiteQty.value = '1'
}

function addCostEntry() {
  const d = parseFloat(newEntry.value.qtyDays)  || 0
  const h = parseFloat(newEntry.value.qtyHours) || 0
  const p = parseFloat(newEntry.value.qtyPeople)|| 0
  const r = parseFloat(String(newEntry.value.rate).replace(/[^0-9.]/g, '')) || 0
  if (!d && !h && !p && !r) return
  editEntries.value.push({ id: Date.now(), label: newEntry.value.label.trim(), date: newEntry.value.date || '', qtyDays: d, qtyHours: h, qtyPeople: p, rate: r })
  newEntry.value = { label: '', date: '', qtyDays: '', qtyHours: '', qtyPeople: '', rate: '' }
}

function removeCostEntry(id) {
  editEntries.value = editEntries.value.filter(e => e.id !== id)
  if (editingEntryId.value === id) cancelEntryEdit()
}

function startEditEntry(entry) {
  editingEntryId.value = entry.id
  newEntry.value = {
    label:     entry.label || '',
    date:      entry.date  || '',
    qtyDays:   entry.qtyDays   !== undefined ? String(entry.qtyDays)   : '',
    qtyHours:  entry.qtyHours  !== undefined ? String(entry.qtyHours)  : '',
    qtyPeople: entry.qtyPeople !== undefined ? String(entry.qtyPeople) : '',
    rate:      entry.rate ? entry.rate.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '',
  }
}

function cancelEntryEdit() {
  editingEntryId.value = null
  newEntry.value = { label: '', date: '', qtyDays: '', qtyHours: '', qtyPeople: '', rate: '' }
}

function updateCostEntry() {
  const d = parseFloat(newEntry.value.qtyDays)   || 0
  const h = parseFloat(newEntry.value.qtyHours)  || 0
  const p = parseFloat(newEntry.value.qtyPeople) || 0
  const r = parseFloat(String(newEntry.value.rate).replace(/[^0-9.]/g, '')) || 0
  const idx = editEntries.value.findIndex(e => e.id === editingEntryId.value)
  if (idx === -1) return
  editEntries.value[idx] = {
    id:        editingEntryId.value,
    label:     newEntry.value.label.trim(),
    date:      newEntry.value.date || '',
    qtyDays:   d,
    qtyHours:  h,
    qtyPeople: p,
    rate:      r,
  }
  cancelEntryEdit()
}

function saveEditModal() {
  const key = editingKey.value
  if (!key) return
  const row = editingRow.value
  const linkedKeys = linkedKeysForRow(row)
  const d = siteData.value[key]
  if (!d || !linkedKeys.length) return
  const visibleSiteQty = parseVisibleSiteQty(editVisibleSiteQty.value)
  const mappedEntries = editEntries.value.map(e => ({
    id: e.id,
    label: e.label || '',
    date:  e.date  || '',
    qtyDays:   parseFloat(e.qtyDays)  || 0,
    qtyHours:  parseFloat(e.qtyHours) || 0,
    qtyPeople: parseFloat(e.qtyPeople)|| 0,
    rate:      parseFloat(String(e.rate).replace(/[^0-9.]/g, '')) || 0,
  }))
  d.costEntries = mappedEntries
  d.comment = editComment.value.trim()
  if (row?.isTunnelEligible) d.visibleSiteQty = visibleSiteQty
  linkedKeys
    .filter(linkedKey => linkedKey !== key)
    .forEach(linkedKey => {
      if (!siteData.value[linkedKey]) return
      siteData.value[linkedKey].costEntries = []
      siteData.value[linkedKey].comment = ''
      if (row?.isTunnelEligible) siteData.value[linkedKey].visibleSiteQty = visibleSiteQty
    })
  applyStatusToLinkedRows(row || { key }, editStatus.value)
  save(siteData.value)
  // Track last saved entry so the next site modal can offer a copy
  if (d.costEntries.length > 0) {
    lastSavedInfo.value = {
      siteKey:  key,
      siteId:   d.siteId,
      siteName: d.siteName,
      entry:    { ...d.costEntries[d.costEntries.length - 1] },
    }
  }
  cancelEdit()
}

function copySuggestedEntry() {
  const e = lastSavedInfo.value?.entry
  if (!e) return
  editEntries.value.push({
    ...e,
    id:   Date.now(),
    date: '',  // date is site-specific — let the user fill it in
  })
  copyBannerDismissed.value = true
}

function deleteRow(row) {
  linkedKeysForRow(row).forEach(key => {
    delete siteData.value[key]
  })
  save(siteData.value)
}

function formatRateInput(e) {
  const raw = String(e.target.value).replace(/[^0-9.]/g, '')
  const num = parseFloat(raw) || 0
  newEntry.value.rate = num ? num.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''
}

function rawRateInput(e) {
  const raw = String(newEntry.value.rate).replace(/[^0-9.]/g, '')
  newEntry.value.rate = raw
  e.target.select()
}

function downloadImportTemplate() {
  const data = rows.value.map(r => ({
    'Site ID': r.siteId,
    'Status':  getSiteStatusLabel(r.status),
  }))
  // If no rows yet, ship a blank example
  if (data.length === 0) {
    data.push({ 'Site ID': 'EXAMPLE-001', 'Status': 'Started' })
    data.push({ 'Site ID': 'EXAMPLE-002', 'Status': 'Not Started' })
    data.push({ 'Site ID': 'EXAMPLE-003', 'Status': 'Cancel' })
    data.push({ 'Site ID': 'EXAMPLE-004', 'Status': 'Other' })
  }
  const ws = XLSX.utils.json_to_sheet(data)
  // Column widths
  ws['!cols'] = [{ wch: 20 }, { wch: 18 }]
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
      rows.value.forEach(row => {
        if (!row.siteId) return
        siteIndex[normaliseMatchValue(row.siteId)] = row
      })

      const log = []

      raw.forEach((row, idx) => {
        const rowNum = idx + 2  // 1-based + header
        const rawId     = String(row['Site ID'] || row['site id'] || row['SITE ID'] || '').trim()
        const rawStatus = String(row['Status']  || row['status']  || row['STATUS']  || '').trim()

        if (!rawId) return  // skip blank rows silently

        // Normalise status value
        const normalised = normaliseSiteStatus(rawStatus)

        if (!normalised) {
          log.push({ row: rowNum, siteId: rawId, result: 'skipped', rawStatus })
          return
        }

        const targetRow = siteIndex[normaliseMatchValue(rawId)]
        if (!targetRow) {
          log.push({ row: rowNum, siteId: rawId, result: 'not-found' })
          return
        }

        const prev = normaliseSiteStatus(targetRow.status) || 'not-started'
        applyStatusToLinkedRows(targetRow, normalised)
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
    'Linked Jobs':      r.linkedJobLabel || '',
    'Visible Site Qty': r.isTunnelEligible ? parseVisibleSiteQty(r.visibleSiteQty) : 1,
    'Detail Site Survey': r.hasDetailSiteSurvey ? 'Yes' : '',
    'Status':           getSiteStatusLabel(r.status),
    'Scope':            r.scopes.length ? r.scopes.join(', ') : '',
    'Cost Entries':     r.costEntries.length,
    'Total Hours':      r.totalHours || 0,
    'VO Qty':           voCountFor(r),
    'Cost to Complete': r.costToComplete || 0,
    'Comment':          r.comment || '',
  }))
  const ws = XLSX.utils.json_to_sheet(data)
  ws['!cols'] = [
    { wch: 18 },
    { wch: 28 },
    { wch: 16 },
    { wch: 22 },
    { wch: 16 },
    { wch: 20 },
    { wch: 14 },
    { wch: 28 },
    { wch: 14 },
    { wch: 14 },
    { wch: 10 },
    { wch: 18 },
    { wch: 36 },
  ]
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
