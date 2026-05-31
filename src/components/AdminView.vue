<template>
  <div class="space-y-6">

    <!-- ── Page header ── -->
    <div class="flex items-center justify-between pb-2 border-b border-gray-100">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">Admin Settings</h2>
          <p class="text-xs text-gray-400 mt-0.5">Manage global data used across the app</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-xl text-xs font-semibold text-blue-700">
          <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>{{ globalData.sites.length }} Sites
        </span>
        <span class="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 rounded-xl text-xs font-semibold text-purple-700">
          <span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span>{{ globalData.voCategories.length }} Categories
        </span>
        <span class="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 rounded-xl text-xs font-semibold text-teal-700">
          <span class="w-1.5 h-1.5 rounded-full bg-teal-500"></span>{{ globalData.poSupplierCategories.length }} PO Supplier Categories
        </span>
        <span class="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 rounded-xl text-xs font-semibold text-indigo-700">
          <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>{{ globalData.poSuppliers.length }} PO Suppliers
        </span>
        <span class="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-xl text-xs font-semibold text-green-700">
          <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>{{ globalData.scopes.length }} Scopes
        </span>
      </div>
    </div>

    <!-- ── Tabs ── -->
    <div class="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
      <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
        class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition"
        :class="activeTab === tab.key
          ? 'bg-white text-gray-900 shadow-sm'
          : 'text-gray-500 hover:text-gray-700'">
        <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path :d="tab.icon"/>
        </svg>
        {{ tab.label }}
      </button>
    </div>

    <!-- ══════════════════════════════════
         SITES TAB
    ══════════════════════════════════ -->
    <div v-if="activeTab === 'sites'">
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <!-- Card header -->
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 class="font-bold text-gray-900">Sites</h3>
            <p class="text-xs text-gray-500 mt-0.5">Used for autocomplete in variation orders</p>
          </div>
          <div class="flex items-center gap-2">
            <button @click="openSyncFromVOs"
              class="inline-flex items-center gap-2 px-3 py-2 border border-indigo-200 text-indigo-600 bg-indigo-50 rounded-xl text-sm font-semibold hover:bg-indigo-100 transition">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Sync from VOs
            </button>
            <button @click="downloadSiteTemplate"
              class="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"/>
              </svg>
              Template
            </button>
            <button @click="$refs.siteFileInput.click()"
              class="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M17 8l-5-5-5 5M12 3v12"/>
              </svg>
              Import
            </button>
            <input ref="siteFileInput" type="file" accept=".xlsx,.xls,.csv" class="hidden" @change="handleSiteImport" />
            <button @click="openSiteForm()"
              class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Add Site
            </button>
          </div>
        </div>

        <!-- Import result panel -->
        <div v-if="importResult" class="px-6 py-4 border-b border-gray-100"
          :class="importResult.skipped.length > 0 ? 'bg-amber-50' : 'bg-green-50'">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <svg class="w-4 h-4 shrink-0"
                  :class="importResult.skipped.length > 0 ? 'text-amber-600' : 'text-green-600'"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="importResult.skipped.length > 0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <p class="text-sm font-bold"
                  :class="importResult.skipped.length > 0 ? 'text-amber-800' : 'text-green-800'">
                  Import complete — {{ importResult.added }} added{{ importResult.skipped.length > 0 ? `, ${importResult.skipped.length} skipped` : '' }}
                </p>
              </div>
              <div v-if="importResult.skipped.length > 0" class="mt-2 space-y-1 max-h-40 overflow-y-auto">
                <div v-for="s in importResult.skipped" :key="s.row"
                  class="flex items-start gap-2 text-xs text-amber-700">
                  <span class="px-1.5 py-0.5 bg-amber-100 rounded font-mono font-bold shrink-0">Row {{ s.row }}</span>
                  <span>{{ s.reason }}<span v-if="s.data?.jobNumber" class="font-mono"> — {{ s.data.jobNumber }}</span><span v-if="s.data?.siteName"> ({{ s.data.siteName }})</span></span>
                </div>
              </div>
            </div>
            <button @click="importResult = null"
              class="shrink-0 w-6 h-6 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-white/60 transition">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Search bar -->
        <div v-if="globalData.sites.length > 0" class="px-6 py-3 border-b border-gray-100 flex items-center gap-3">
          <div class="relative flex-1 max-w-sm">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input v-model="siteSearch" type="text" placeholder="Search by site ID, name or job number…"
              class="w-full pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
            <button v-if="siteSearch" @click="siteSearch = ''"
              class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <span class="text-xs text-gray-400">
            {{ filteredSites.length === globalData.sites.length ? globalData.sites.length + ' sites' : filteredSites.length + ' of ' + globalData.sites.length + ' sites' }}
          </span>
        </div>

        <!-- Empty state -->
        <div v-if="globalData.sites.length === 0" class="py-16 text-center">
          <div class="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
          <p class="font-semibold text-gray-700">No sites yet</p>
          <p class="text-sm text-gray-400 mt-1">Click "Add Site" to create your first site</p>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto">
          <!-- No search results -->
          <div v-if="filteredSites.length === 0" class="py-10 text-center">
            <p class="text-sm font-semibold text-gray-500">No sites match "<span class="text-gray-700">{{ siteSearch }}</span>"</p>
            <button @click="siteSearch = ''" class="mt-2 text-xs text-blue-600 hover:underline">Clear search</button>
          </div>
          <table v-else class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-100">
              <tr>
                <th class="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Site ID</th>
                <th class="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Site Name</th>
                <th class="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Job Number</th>
                <th class="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Comment</th>
                <th class="px-5 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="(site, i) in filteredSites" :key="site._origIndex" class="hover:bg-gray-50 transition group">
                <td class="px-5 py-3.5">
                  <span class="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">{{ site.siteId || '—' }}</span>
                </td>
                <td class="px-5 py-3.5 font-semibold text-gray-900">{{ site.siteName }}</td>
                <td class="px-5 py-3.5">
                  <span v-if="site.jobNumber" class="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">{{ site.jobNumber }}</span>
                  <span v-else class="text-gray-300">—</span>
                </td>
                <td class="px-5 py-3.5 text-gray-500 text-xs max-w-[220px] truncate" :title="site.comment">
                  {{ site.comment || '—' }}
                </td>
                <td class="px-5 py-3.5 text-right">
                  <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button @click="openSiteForm(site._origIndex)"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                      Edit
                    </button>
                    <button @click="removeSite(site._origIndex)"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════
         VO CATEGORIES TAB
    ══════════════════════════════════ -->
    <div v-if="activeTab === 'vo-categories'">
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 class="font-bold text-gray-900">VO Categories</h3>
            <p class="text-xs text-gray-500 mt-0.5">Used for categorising variation orders</p>
          </div>
          <button @click="openCategoryForm()"
            class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Add Category
          </button>
        </div>

        <div v-if="globalData.voCategories.length === 0" class="py-16 text-center">
          <div class="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
            </svg>
          </div>
          <p class="font-semibold text-gray-700">No categories yet</p>
          <p class="text-sm text-gray-400 mt-1">Click "Add Category" to get started</p>
        </div>

        <div v-else class="divide-y divide-gray-50">
          <div v-for="(cat, i) in globalData.voCategories" :key="i"
            class="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition group">
            <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
              <span class="text-xs font-bold text-blue-600">{{ cat.name.charAt(0).toUpperCase() }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-gray-900 text-sm">{{ cat.name }}</p>
              <p v-if="cat.comment" class="text-xs text-gray-400 mt-0.5 truncate">{{ cat.comment }}</p>
            </div>
            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
              <button @click="openCategoryForm(i)"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                Edit
              </button>
              <button @click="removeVOCategory(i)"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════
         SCOPES TAB
    ══════════════════════════════════ -->
    <div v-if="activeTab === 'po-supplier-categories'">
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 class="font-bold text-gray-900">PO Supplier Categories</h3>
            <p class="text-xs text-gray-500 mt-0.5">Used for category selection in PO Supplier Breakdown</p>
          </div>
          <button @click="openPOSupplierCategoryForm()"
            class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Add Category
          </button>
        </div>

        <div v-if="globalData.poSupplierCategories.length === 0" class="py-16 text-center">
          <div class="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
            </svg>
          </div>
          <p class="font-semibold text-gray-700">No PO supplier categories yet</p>
          <p class="text-sm text-gray-400 mt-1">Click "Add Category" to get started</p>
        </div>

        <div v-else class="divide-y divide-gray-50">
          <div v-for="(cat, i) in globalData.poSupplierCategories" :key="i"
            class="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition group">
            <div class="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
              <span class="text-xs font-bold text-teal-600">{{ cat.name.charAt(0).toUpperCase() }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-gray-900 text-sm">{{ cat.name }}</p>
              <p v-if="cat.comment" class="text-xs text-gray-400 mt-0.5 truncate">{{ cat.comment }}</p>
            </div>
            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
              <button @click="openPOSupplierCategoryForm(i)"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                Edit
              </button>
              <button @click="removePOSupplierCategory(i)"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'po-suppliers'">
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 class="font-bold text-gray-900">PO Suppliers</h3>
            <p class="text-xs text-gray-500 mt-0.5">Supplier master list used for autocomplete in PO Supplier Breakdown</p>
          </div>
          <div class="flex items-center gap-2">
            <button @click="downloadPOSupplierTemplate"
              class="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"/>
              </svg>
              Template
            </button>
            <button @click="$refs.poSupplierFileInput.click()"
              class="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M17 8l-5-5-5 5M12 3v12"/>
              </svg>
              Import
            </button>
            <input ref="poSupplierFileInput" type="file" accept=".xlsx,.xls,.csv" class="hidden" @change="handlePOSupplierImport" />
            <button @click="openPOSupplierForm()"
              class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Add Supplier
            </button>
          </div>
        </div>

        <div v-if="poSupplierImportResult" class="px-6 py-4 border-b border-gray-100"
          :class="poSupplierImportResult.skipped.length > 0 ? 'bg-amber-50' : 'bg-green-50'">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold"
                :class="poSupplierImportResult.skipped.length > 0 ? 'text-amber-800' : 'text-green-800'">
                Import complete â€” {{ poSupplierImportResult.added }} added{{ poSupplierImportResult.skipped.length ? `, ${poSupplierImportResult.skipped.length} skipped` : '' }}
              </p>
              <div v-if="poSupplierImportResult.skipped.length > 0" class="mt-2 space-y-1 max-h-36 overflow-y-auto">
                <p v-for="(line, idx) in poSupplierImportResult.skipped.slice(0, 10)" :key="idx" class="text-xs text-amber-700">
                  {{ line }}
                </p>
                <p v-if="poSupplierImportResult.skipped.length > 10" class="text-xs text-amber-600">
                  ... and {{ poSupplierImportResult.skipped.length - 10 }} more
                </p>
              </div>
            </div>
            <button @click="poSupplierImportResult = null"
              class="shrink-0 w-6 h-6 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-white/60 transition">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <div v-if="globalData.poSuppliers.length === 0" class="py-16 text-center">
          <div class="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <p class="font-semibold text-gray-700">No suppliers yet</p>
          <p class="text-sm text-gray-400 mt-1">Add suppliers manually, or import from the template.</p>
        </div>

        <div v-else class="divide-y divide-gray-50">
          <div v-for="(supplier, i) in globalData.poSuppliers" :key="i"
            class="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition group">
            <div class="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
              <span class="text-xs font-bold text-indigo-600">{{ supplier.name.charAt(0).toUpperCase() }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-gray-900 text-sm">{{ supplier.name }}</p>
            </div>
            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
              <button @click="openPOSupplierForm(i)"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                Edit
              </button>
              <button @click="removePOSupplier(i)"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'scopes'">
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 class="font-bold text-gray-900">Scopes</h3>
            <p class="text-xs text-gray-500 mt-0.5">Scope options available in variation orders</p>
          </div>
          <button @click="openScopeForm()"
            class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Add Scope
          </button>
        </div>

        <div v-if="globalData.scopes.length === 0" class="py-16 text-center">
          <div class="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
            </svg>
          </div>
          <p class="font-semibold text-gray-700">No scopes yet</p>
          <p class="text-sm text-gray-400 mt-1">Click "Add Scope" to get started</p>
        </div>

        <div v-else class="divide-y divide-gray-50">
          <div v-for="(scope, i) in globalData.scopes" :key="i"
            class="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition group">
            <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
              <span class="text-xs font-bold text-blue-600">{{ scope.name.charAt(0).toUpperCase() }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-gray-900 text-sm">{{ scope.name }}</p>
              <p v-if="scope.comment" class="text-xs text-gray-400 mt-0.5 truncate">{{ scope.comment }}</p>
            </div>
            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
              <button @click="openScopeForm(i)"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                Edit
              </button>
              <button @click="removeScope(i)"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════
         LOGS TAB
    ══════════════════════════════════ -->
    <div v-if="activeTab === 'logs'" class="space-y-4">
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 class="font-bold text-gray-900">Activity Log</h3>
            <p class="text-xs text-gray-400 mt-0.5">{{ filteredLogs.length }} of {{ logs.length }} entries</p>
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            <!-- Search -->
            <div class="relative">
              <svg class="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input v-model="logSearch" type="text" placeholder="Search site, description…"
                class="pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 w-52"/>
            </div>
            <!-- Filter pills -->
            <div class="flex gap-1">
              <button v-for="f in [{k:'all',l:'All'},{k:'created',l:'Created'},{k:'updated',l:'Edited'},{k:'deleted',l:'Deleted'}]"
                :key="f.k" @click="logFilter = f.k"
                class="px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                :class="logFilter === f.k
                  ? f.k==='created' ? 'bg-green-100 text-green-700' : f.k==='updated' ? 'bg-blue-100 text-blue-700' : f.k==='deleted' ? 'bg-red-100 text-red-700' : 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'">
                {{ f.l }}
              </button>
            </div>
            <!-- Export -->
            <button @click="exportLogs" :disabled="filteredLogs.length === 0"
              class="p-2 rounded-xl border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed" title="Export to Excel">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
            </button>
            <!-- Refresh -->
            <button @click="loadLogs"
              class="p-2 rounded-xl border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition" title="Refresh">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </button>
            <!-- Clear -->
            <button @click="handleClearLogs"
              class="px-3 py-1.5 rounded-xl border border-red-200 text-red-500 text-xs font-semibold hover:bg-red-50 transition">
              Clear All
            </button>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="filteredLogs.length === 0" class="py-16 text-center">
          <div class="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg class="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <p class="font-semibold text-gray-500">No activity logs yet</p>
          <p class="text-xs text-gray-400 mt-1">Logs are recorded when variations are created, edited, or deleted</p>
        </div>

        <!-- Log list -->
        <div v-else class="divide-y divide-gray-50">
          <div v-for="log in paginatedLogs" :key="log.id"
            class="px-6 py-4 hover:bg-gray-50 transition">
            <div class="flex items-start gap-4">

              <!-- Action icon -->
              <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                :class="log.action==='created' ? 'bg-green-100' : log.action==='updated' ? 'bg-blue-100' : 'bg-red-100'">
                <svg class="w-4 h-4" :class="log.action==='created' ? 'text-green-600' : log.action==='updated' ? 'text-blue-600' : 'text-red-500'"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="log.action==='created'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  <path v-else-if="log.action==='updated'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <!-- Action badge -->
                  <span class="px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wide"
                    :class="log.action==='created' ? 'bg-green-100 text-green-700' : log.action==='updated' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-600'">
                    {{ log.action }}
                  </span>
                  <!-- Site badge -->
                  <span class="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-md text-xs font-bold">{{ log.siteId || '—' }}</span>
                  <span class="text-sm font-semibold text-gray-900 truncate">{{ log.siteName }}</span>
                  <span v-if="log.jobNumber" class="text-xs font-mono text-gray-400">{{ log.jobNumber }}</span>
                </div>

                <!-- Description -->
                <p class="text-xs text-gray-500 mt-1 truncate">{{ log.voDescription }}</p>

                <!-- Comment (if present) -->
                <p v-if="log.comment" class="flex items-start gap-1 text-xs text-gray-400 mt-1 italic">
                  <svg class="w-3.5 h-3.5 shrink-0 mt-px" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
                  </svg>
                  {{ log.comment }}
                </p>

                <!-- Changes diff -->
                <div v-if="log.changes && log.changes.length > 0" class="mt-2 flex flex-wrap gap-1.5">
                  <div v-for="c in log.changes" :key="c.field"
                    class="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-lg text-xs text-gray-600">
                    <span class="font-semibold text-gray-700">{{ c.label }}:</span>
                    <span class="line-through text-red-400">{{ c.from }}</span>
                    <svg class="w-2.5 h-2.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                    <span class="text-green-600 font-medium">{{ c.to }}</span>
                  </div>
                </div>
              </div>

              <!-- Time -->
              <div class="text-right shrink-0">
                <div class="text-xs font-semibold text-gray-500">{{ formatRelativeTime(log.timestamp) }}</div>
                <div class="text-[10px] text-gray-300 mt-0.5">{{ formatLogTime(log.timestamp) }}</div>
              </div>

            </div>
          </div>

          <!-- Pagination footer -->
          <div v-if="filteredLogs.length > LOG_PAGE_SIZE" class="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-4">
            <span class="text-sm text-gray-500">
              Showing <span class="font-semibold text-gray-700">{{ (logPage - 1) * LOG_PAGE_SIZE + 1 }}–{{ Math.min(logPage * LOG_PAGE_SIZE, filteredLogs.length) }}</span> of <span class="font-semibold text-gray-700">{{ filteredLogs.length }}</span> entries
            </span>
            <div class="flex items-center gap-1">
              <button @click="logPage = 1" :disabled="logPage === 1"
                class="px-2 py-1 text-xs rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">«</button>
              <button @click="logPage--" :disabled="logPage === 1"
                class="px-2 py-1 text-xs rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">‹</button>
              <span class="px-3 py-1 text-xs font-semibold text-gray-700">{{ logPage }} / {{ logTotalPages }}</span>
              <button @click="logPage++" :disabled="logPage === logTotalPages"
                class="px-2 py-1 text-xs rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">›</button>
              <button @click="logPage = logTotalPages" :disabled="logPage === logTotalPages"
                class="px-2 py-1 text-xs rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">»</button>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- ══════════════════════════════════
         SETTINGS TAB
    ══════════════════════════════════ -->
    <div v-if="activeTab === 'settings'" class="space-y-4">

      <!-- Preferences -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100">
          <h3 class="font-bold text-gray-900">Preferences</h3>
          <p class="text-xs text-gray-500 mt-0.5">Application behaviour settings</p>
        </div>
        <div class="p-6 space-y-4">
          <!-- Toggle rows -->
          <div v-for="toggle in toggleSettings" :key="toggle.key"
            class="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
            <div>
              <p class="text-sm font-semibold text-gray-900">{{ toggle.label }}</p>
              <p class="text-xs text-gray-400 mt-0.5">{{ toggle.desc }}</p>
            </div>
            <button @click="globalData.settings[toggle.key] = !globalData.settings[toggle.key]; saveGlobalData()"
              class="relative inline-flex h-6 w-11 items-center rounded-full transition shrink-0"
              :class="globalData.settings[toggle.key] ? 'bg-blue-600' : 'bg-gray-200'">
              <span class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition"
                :class="globalData.settings[toggle.key] ? 'translate-x-6' : 'translate-x-1'"></span>
            </button>
          </div>

          <!-- Default status -->
          <div class="flex items-center justify-between pt-3">
            <div>
              <p class="text-sm font-semibold text-gray-900">Default VO Status</p>
              <p class="text-xs text-gray-400 mt-0.5">Status assigned to new variation orders</p>
            </div>
            <select v-model="globalData.settings.defaultVOStatus" @change="saveGlobalData"
              class="px-3 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="pending-approval">Pending Approval</option>
              <option value="approved">Approved</option>
            </select>
          </div>

          <!-- Routine backup export -->
          <div class="flex items-center justify-between pt-4 border-t border-gray-50">
            <div>
              <p class="text-sm font-semibold text-gray-900">Routine JSON Backup</p>
              <p class="text-xs text-gray-400 mt-0.5">Automatically export a full restore backup once per day while the app is open</p>
              <p class="text-xs text-gray-400 mt-0.5">Uses the same JSON snapshot as Backup &amp; Restore, including PO received dates, PO history, settings and current view state</p>
              <p class="text-xs font-semibold mt-1"
                :class="routineBackupStatusClass">
                {{ routineBackupStatusText }}
              </p>
            </div>
            <div class="flex items-center gap-3">
              <input v-model="globalData.settings.routineBackupTime" type="time"
                :disabled="!globalData.settings.routineBackupEnabled"
                @focus="routineBackupPreviousTime = globalData.settings.routineBackupTime"
                @change="handleRoutineBackupTimeChange"
                class="px-3 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed" />
              <button @click="toggleRoutineBackup"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition shrink-0"
                :class="globalData.settings.routineBackupEnabled ? 'bg-blue-600' : 'bg-gray-200'">
                <span class="inline-block h-4 w-4 transform rounded-full bg-white shadow transition"
                  :class="globalData.settings.routineBackupEnabled ? 'translate-x-6' : 'translate-x-1'"></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Danger zone -->
      <div class="bg-white rounded-xl border border-red-100 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-red-100 flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
            <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            </svg>
          </div>
          <div>
            <h3 class="font-bold text-red-700">Danger Zone</h3>
            <p class="text-xs text-red-400">Irreversible actions — proceed with caution</p>
          </div>
        </div>
        <div class="p-6">
          <div class="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-xl">
            <div>
              <p class="text-sm font-bold text-red-800">Clear All Variation Data</p>
              <p class="text-xs text-red-500 mt-0.5">Permanently deletes every variation order. This cannot be undone.</p>
            </div>
            <button @click="clearAllData"
              class="shrink-0 ml-4 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition shadow-sm">
              Clear All Data
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ══════════════════════════════════
         SYNC FROM VOs MODAL
    ══════════════════════════════════ -->
    <Teleport to="body">
      <div v-if="syncModal.show" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="syncModal.show = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
          <!-- Header -->
          <div class="flex items-center gap-3 px-6 py-4 bg-indigo-600">
            <div class="w-8 h-8 rounded-xl bg-indigo-500 flex items-center justify-center shrink-0">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-white text-base">Sync Sites from Variation Orders</h3>
              <p class="text-indigo-200 text-xs mt-0.5">Review changes before applying</p>
            </div>
          </div>

          <div class="px-6 py-5 space-y-4">
            <!-- New entries summary -->
            <div class="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-200">
              <svg class="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              <div>
                <p class="text-sm font-semibold text-green-800">{{ syncModal.newCount }} new site{{ syncModal.newCount !== 1 ? 's' : '' }} to add</p>
                <p class="text-xs text-green-600 mt-0.5">These don't exist in site management yet</p>
              </div>
            </div>

            <!-- No changes at all -->
            <div v-if="syncModal.newCount === 0 && syncModal.overrideItems.length === 0"
              class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
              <svg class="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              <p class="text-sm text-gray-500">All sites from VOs are already up to date — nothing to sync.</p>
            </div>

            <!-- Duplicate / override section -->
            <div v-if="syncModal.overrideItems.length > 0">
              <div class="flex items-center gap-2 mb-2">
                <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                </svg>
                <p class="text-sm font-semibold text-amber-700">{{ syncModal.overrideItems.length }} conflict{{ syncModal.overrideItems.length !== 1 ? 's' : '' }} — already exist with different data</p>
              </div>
              <div class="space-y-2 max-h-52 overflow-y-auto pr-1">
                <div v-for="(item, i) in syncModal.overrideItems" :key="i"
                  class="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs">
                  <div class="flex items-center gap-1.5 mb-1.5">
                    <span class="px-1.5 py-0.5 bg-amber-200 text-amber-800 rounded font-mono font-bold">{{ item.voEntry.jobNumber || item.voEntry.siteId }}</span>
                    <span class="text-amber-700 font-medium">{{ item.voEntry.siteName }}</span>
                  </div>
                  <div class="grid grid-cols-2 gap-x-3 gap-y-0.5 text-gray-500">
                    <div class="col-span-2 flex items-center gap-2">
                      <span class="w-14 shrink-0 text-gray-400">Current:</span>
                      <span class="line-through text-red-400">{{ item.existing.siteId }} · {{ item.existing.siteName }} · {{ item.existing.jobNumber || '—' }}</span>
                    </div>
                    <div class="col-span-2 flex items-center gap-2">
                      <span class="w-14 shrink-0 text-gray-400">From VO:</span>
                      <span class="text-green-700 font-medium">{{ item.voEntry.siteId }} · {{ item.voEntry.siteName }} · {{ item.voEntry.jobNumber || '—' }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <p class="text-xs text-gray-400 mt-2">Your choice below applies to <span class="font-semibold">all {{ syncModal.overrideItems.length }} conflicts</span> at once.</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 pb-5">
            <!-- When there are conflicts: two action buttons -->
            <div v-if="syncModal.overrideItems.length > 0" class="flex gap-3">
              <button @click="confirmSync(false)"
                class="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">
                Add New Only (skip conflicts)
              </button>
              <button @click="confirmSync(true)"
                class="flex-1 px-4 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 transition">
                Add New + Override All
              </button>
            </div>
            <!-- No conflicts, just new entries -->
            <div v-else-if="syncModal.newCount > 0" class="flex gap-3">
              <button @click="syncModal.show = false"
                class="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-200 transition">
                Cancel
              </button>
              <button @click="confirmSync(false)"
                class="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">
                Add {{ syncModal.newCount }} Site{{ syncModal.newCount !== 1 ? 's' : '' }}
              </button>
            </div>
            <!-- Nothing to do -->
            <div v-else>
              <button @click="syncModal.show = false"
                class="w-full px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-200 transition">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ══════════════════════════════════
         SHARED MODAL
    ══════════════════════════════════ -->
    <Teleport to="body">
      <div v-if="modal.show" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="closeModal">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md">

          <!-- Modal header -->
          <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center"
                :class="'bg-blue-100'">
                <svg class="w-4 h-4" :class="'text-blue-600'"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="modal.isEdit" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
              </div>
              <div>
                <h4 class="font-bold text-gray-900">{{ modal.title }}</h4>
                <p class="text-xs text-gray-400">{{ modal.subtitle }}</p>
              </div>
            </div>
            <button @click="closeModal" class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Modal body -->
          <div class="px-6 py-5 space-y-4">

            <!-- SITE fields -->
            <template v-if="modal.type === 'site'">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Site ID <span class="text-red-400">*</span></label>
                  <input v-model="modal.form.siteId" type="text" placeholder="e.g. R07"
                    class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder-gray-400" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Job Number</label>
                  <input v-model="modal.form.jobNumber" type="text" placeholder="e.g. JOB-001"
                    class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder-gray-400" />
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Site Name <span class="text-red-400">*</span></label>
                <input v-model="modal.form.siteName" type="text" placeholder="e.g. Glen Iris"
                  class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder-gray-400" />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Comment</label>
                <textarea v-model="modal.form.comment" rows="2" placeholder="Any notes about this site…"
                  class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder-gray-400 resize-none"></textarea>
              </div>
            </template>

            <!-- CATEGORY / SCOPE fields -->
            <template v-else>
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Name <span class="text-red-400">*</span></label>
                <input v-model="modal.form.name" type="text" :placeholder="modal.type === 'scope' ? 'e.g. Structural' : modal.type === 'po-supplier-category' ? 'e.g. Materials' : modal.type === 'po-supplier' ? 'e.g. Nokia' : 'e.g. Civil Works'"
                  class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder-gray-400" />
              </div>
              <div v-if="modal.type !== 'po-supplier'">
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Comment</label>
                <textarea v-model="modal.form.comment" rows="2" placeholder="Any notes or description…"
                  class="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder-gray-400 resize-none"></textarea>
              </div>
            </template>

            <!-- Error -->
            <div v-if="modal.error" class="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {{ modal.error }}
            </div>
          </div>

          <!-- Modal footer -->
          <div class="px-6 pb-6 flex gap-3 justify-end">
            <button @click="closeModal"
              class="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
              Cancel
            </button>
            <button @click="saveModal"
              class="px-5 py-2.5 text-white rounded-xl text-sm font-bold transition shadow-sm"
              :class="'bg-blue-600 hover:bg-blue-700'">
              {{ modal.isEdit ? 'Save Changes' : 'Add' }}
            </button>
          </div>

        </div>
      </div>
    </Teleport>

    <!-- Routine backup reschedule modal -->
    <Teleport to="body">
      <div v-if="routineBackupResetModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <div class="flex items-center gap-3 px-6 py-4 bg-blue-700">
            <div class="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="font-bold text-white text-base">Reset Routine Backup?</p>
              <p class="text-blue-100 text-xs mt-0.5">Today already has a completed or cancelled backup.</p>
            </div>
          </div>
          <div class="p-6 space-y-4">
            <p class="text-sm text-gray-600 leading-relaxed">
              You changed the routine backup time to
              <span class="font-bold text-blue-700">{{ globalData.settings.routineBackupTime || 'not set' }}</span>.
              Reset today if you want the new schedule to run today.
            </p>
            <div class="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
              <p class="text-xs font-bold text-blue-700 uppercase tracking-wider">What reset means</p>
              <p class="text-xs text-blue-600 mt-1">It clears today’s run marker. If the new time arrives while the app is open, the 15-second backup popup will show again.</p>
            </div>
            <div class="flex justify-end gap-2 pt-1">
              <button @click="finishRoutineBackupTimeChange(false)"
                class="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-200 transition">
                Wait Until Next Day
              </button>
              <button @click="finishRoutineBackupTimeChange(true)"
                class="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-sm">
                Reset Today
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import * as XLSX from 'xlsx'
import { getLogs, clearLogs, addLog, diffVOs } from '../utils/logger'
import { useVOStore } from '../stores/voStore'

const voStore = useVOStore()
const routineBackupNow = ref(new Date())
const routineBackupPreviousTime = ref('')
const routineBackupResetModal = ref(false)
let routineBackupTick = null

// ── Tabs ──
// Material Design icon path data for each tab
const tabs = [
  { key: 'sites',         label: 'Sites',        icon: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z' },
  { key: 'vo-categories', label: 'Categories',   icon: 'M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z' },
  { key: 'po-supplier-categories', label: 'PO Supplier Categories', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14a2 2 0 002 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14H7v-2h3v2zm7-4H7v-2h10v2zm0-4H7V7h10v2z' },
  { key: 'po-suppliers', label: 'PO Suppliers', icon: 'M12 7a3 3 0 110-6 3 3 0 010 6zm0 2c-3.33 0-6 1.34-6 3v2h12v-2c0-1.66-2.67-3-6-3zm-8 9h16v2H4v-2z' },
  { key: 'scopes',        label: 'Scopes',       icon: 'M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z' },
  { key: 'logs',          label: 'Activity Log', icon: 'M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z' },
  { key: 'settings',      label: 'Settings',     icon: 'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z' },
]
const VALID_TABS = tabs.map(t => t.key)
const savedTab = localStorage.getItem('admin_activeTab')
const activeTab = ref(VALID_TABS.includes(savedTab) ? savedTab : 'sites')
watch(activeTab, v => localStorage.setItem('admin_activeTab', v))

// ── Toggle settings list ──
const toggleSettings = [
  { key: 'autoSaveEnabled',      label: 'Auto-save',      desc: 'Automatically save variations as you edit' },
  { key: 'notificationsEnabled', label: 'Notifications',  desc: 'Show notifications for important actions' },
]

// ── Global data ──
const globalData = ref({
  sites: [],
  voCategories: [],
  poSupplierCategories: [],
  poSuppliers: [],
  scopes: [],
  settings: { autoSaveEnabled: true, notificationsEnabled: true, defaultVOStatus: 'draft', routineBackupEnabled: false, routineBackupTime: '' }
})

function localDateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function scheduledDateFor(time, baseDate = routineBackupNow.value) {
  const [hours, minutes] = String(time || '').split(':').map(Number)
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null
  const dt = new Date(baseDate)
  dt.setHours(hours, minutes, 0, 0)
  const alreadyDoneToday = localStorage.getItem('routineBackupLastRunDate') === localDateKey(baseDate)
  if (alreadyDoneToday || dt <= baseDate) dt.setDate(dt.getDate() + 1)
  return dt
}

function formatDuration(ms) {
  const totalMinutes = Math.max(0, Math.ceil(ms / 60000))
  const days = Math.floor(totalMinutes / 1440)
  const hours = Math.floor((totalMinutes % 1440) / 60)
  const minutes = totalMinutes % 60
  const parts = []
  if (days) parts.push(`${days}d`)
  if (hours) parts.push(`${hours}h`)
  parts.push(`${minutes}m`)
  return parts.join(' ')
}

const routineBackupStatusText = computed(() => {
  const settings = globalData.value.settings
  if (!settings.routineBackupEnabled) return 'Routine backup is off.'
  if (!settings.routineBackupTime) return 'Choose a backup time.'
  const next = scheduledDateFor(settings.routineBackupTime)
  if (!next) return 'Choose a backup time.'
  return `Next export in ${formatDuration(next - routineBackupNow.value)} (${next.toLocaleString('en-AU', { weekday: 'short', hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })})`
})

const routineBackupStatusClass = computed(() => {
  if (!globalData.value.settings.routineBackupEnabled) return 'text-gray-400'
  if (!globalData.value.settings.routineBackupTime) return 'text-amber-600'
  return 'text-blue-600'
})

function clearRoutineBackupRunMarker() {
  localStorage.removeItem('routineBackupLastRunDate')
}

function toggleRoutineBackup() {
  globalData.value.settings.routineBackupEnabled = !globalData.value.settings.routineBackupEnabled
  if (globalData.value.settings.routineBackupEnabled) clearRoutineBackupRunMarker()
  saveGlobalData()
}

function handleRoutineBackupTimeChange() {
  const alreadyDoneToday = localStorage.getItem('routineBackupLastRunDate') === localDateKey()
  if (alreadyDoneToday) {
    routineBackupResetModal.value = true
    return
  }
  routineBackupPreviousTime.value = globalData.value.settings.routineBackupTime
  saveGlobalData()
}

function finishRoutineBackupTimeChange(resetToday) {
  if (resetToday) clearRoutineBackupRunMarker()
  routineBackupPreviousTime.value = globalData.value.settings.routineBackupTime
  saveGlobalData()
  routineBackupResetModal.value = false
}

const loadGlobalData = () => {
  try {
    const saved = localStorage.getItem('globalData')
    if (!saved) return
    const data = JSON.parse(saved)
    if (data.sites?.length && typeof data.sites[0] === 'string') {
      data.sites = data.sites.map(s => ({ siteId: '', siteName: s, jobNumber: '', comment: '' }))
    }
    // Deduplicate sites by composite key on load (self-heal any pre-existing duplicates)
    const rawSites = (data.sites || []).map(s =>
      typeof s === 'string' ? { siteId: '', siteName: s, jobNumber: '', comment: '' } : s
    )
    const seen = new Set()
    const dedupedSites = rawSites.filter(s => {
      const key = `${s.siteId}|${s.siteName}|${s.jobNumber}`
      if (seen.has(key)) return false
      seen.add(key); return true
    })

    const rawSuppliers = (data.poSuppliers || []).map(s =>
      typeof s === 'string' ? { name: s } : s
    )
    const seenSuppliers = new Set()
    const dedupedSuppliers = rawSuppliers
      .map(s => ({ name: String(s?.name || '').trim() }))
      .filter(s => {
        if (!s.name) return false
        const key = s.name.toLowerCase()
        if (seenSuppliers.has(key)) return false
        seenSuppliers.add(key)
        return true
      })

    globalData.value = {
      sites:        dedupedSites,
      voCategories: data.voCategories || [],
      poSupplierCategories: data.poSupplierCategories || [],
      poSuppliers: dedupedSuppliers,
      scopes:       data.scopes       || [],
      settings:     { autoSaveEnabled: true, notificationsEnabled: true, defaultVOStatus: 'draft', routineBackupEnabled: false, routineBackupTime: '', ...(data.settings || {}) }
    }

    // Persist cleaned data back if duplicates were removed
    if (dedupedSites.length !== (data.sites || []).length || dedupedSuppliers.length !== (rawSuppliers || []).length) {
      saveGlobalData()
    }
  } catch (e) { console.error('Error loading global data', e) }
}

const saveGlobalData = () => localStorage.setItem('globalData', JSON.stringify(globalData.value))

// ── Sync from VOs ──
const syncModal = reactive({
  show: false,
  newCount: 0,
  overrideItems: [],  // [{ voEntry, existingIdx }]
  pendingNew: [],     // entries to add regardless
})

const openSyncFromVOs = () => {
  const vos = voStore.vos.value || []
  // Build unique site entries from VOs (dedupe by jobNumber or siteId+siteName if no job)
  const seen = new Set()
  const candidates = []
  for (const vo of vos) {
    const siteId   = vo.siteId?.trim()   || ''
    const siteName = vo.siteName?.trim() || ''
    const jobNumber = vo.jobNumber?.trim() || ''
    if (!siteId && !siteName) continue
    const key = jobNumber || `${siteId}|${siteName}`
    if (seen.has(key)) continue
    seen.add(key)
    candidates.push({ siteId, siteName, jobNumber, comment: '' })
  }

  const newEntries    = []
  const overrideItems = []

  for (const candidate of candidates) {
    // Check if already exists (match by jobNumber if present, else by siteId+siteName)
    const existingIdx = globalData.value.sites.findIndex(s => {
      if (candidate.jobNumber && s.jobNumber) return s.jobNumber === candidate.jobNumber
      return s.siteId === candidate.siteId && s.siteName === candidate.siteName
    })

    if (existingIdx === -1) {
      newEntries.push(candidate)
    } else {
      const existing = globalData.value.sites[existingIdx]
      // Only flag as override if something meaningful differs
      const differs = existing.siteId !== candidate.siteId ||
                      existing.siteName !== candidate.siteName ||
                      existing.jobNumber !== candidate.jobNumber
      if (differs) overrideItems.push({ voEntry: candidate, existingIdx, existing })
    }
  }

  syncModal.newCount      = newEntries.length
  syncModal.overrideItems = overrideItems
  syncModal.pendingNew    = newEntries
  syncModal.show          = true
}

const confirmSync = (doOverride) => {
  // Add all new entries
  for (const entry of syncModal.pendingNew) {
    globalData.value.sites.push(entry)
  }
  // Optionally override duplicates
  if (doOverride) {
    for (const { voEntry, existingIdx } of syncModal.overrideItems) {
      globalData.value.sites[existingIdx] = { ...globalData.value.sites[existingIdx], ...voEntry, comment: globalData.value.sites[existingIdx].comment }
    }
  }
  saveGlobalData()
  syncModal.show = false
}

// ── Activity Log ──
const logs = ref([])
const logSearch = ref('')
const logFilter = ref('all') // 'all' | 'created' | 'updated' | 'deleted'
const LOG_PAGE_SIZE = 50
const logPage = ref(1)

const loadLogs = () => { logs.value = getLogs() }

const filteredLogs = computed(() => {
  let list = logs.value
  if (logFilter.value !== 'all') list = list.filter(l => l.action === logFilter.value)
  if (logSearch.value.trim()) {
    const q = logSearch.value.toLowerCase()
    list = list.filter(l =>
      l.siteId?.toLowerCase().includes(q) ||
      l.siteName?.toLowerCase().includes(q) ||
      l.jobNumber?.toLowerCase().includes(q) ||
      l.voDescription?.toLowerCase().includes(q)
    )
  }
  return list
})

const logTotalPages = computed(() => Math.max(1, Math.ceil(filteredLogs.value.length / LOG_PAGE_SIZE)))
const paginatedLogs = computed(() => {
  const start = (logPage.value - 1) * LOG_PAGE_SIZE
  return filteredLogs.value.slice(start, start + LOG_PAGE_SIZE)
})

// Reset to page 1 when filter/search changes
watch([logFilter, logSearch], () => { logPage.value = 1 })

const handleClearLogs = () => {
  if (confirm('Clear all activity logs? This cannot be undone.')) {
    clearLogs()
    logs.value = []
  }
}

const exportLogs = () => {
  const rows = filteredLogs.value.map(log => ({
    'Timestamp':   log.timestamp ? new Date(log.timestamp).toLocaleString('en-AU') : '',
    'Action':      log.action || '',
    'Site ID':     log.siteId || '',
    'Site Name':   log.siteName || '',
    'Job Number':  log.jobNumber || '',
    'Description': log.voDescription || '',
    'Amount':      log.voAmount ?? '',
    'VO Status':   log.voStatus || '',
    'Comment':     log.comment || '',
    'Changes':     (log.changes || []).map(c => `${c.label}: "${c.from}" → "${c.to}"`).join('; '),
  }))
  const ws = XLSX.utils.json_to_sheet(rows)
  ws['!cols'] = [
    { wch: 20 }, { wch: 10 }, { wch: 10 }, { wch: 22 }, { wch: 14 },
    { wch: 40 }, { wch: 12 }, { wch: 16 }, { wch: 24 }, { wch: 50 },
  ]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Activity Log')
  const date = new Date().toISOString().slice(0, 10)
  const suffix = logFilter.value !== 'all' ? `_${logFilter.value}` : ''
  XLSX.writeFile(wb, `ActivityLog${suffix}_${date}.xlsx`)
}

const formatLogTime = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const formatRelativeTime = (iso) => {
  if (!iso) return ''
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000)
  if (diff < 60)        return 'just now'
  if (diff < 3600)      return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400)     return `${Math.floor(diff / 3600)}h ago`
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`
  return formatLogTime(iso)
}

// Reload logs when switching to the logs tab
watch(activeTab, v => { if (v === 'logs') loadLogs() })

onMounted(() => {
  loadGlobalData()
  loadLogs()
  routineBackupTick = setInterval(() => { routineBackupNow.value = new Date() }, 30000)
})

onUnmounted(() => {
  clearInterval(routineBackupTick)
})

// ══════════════════════════════════
// SHARED MODAL
// ══════════════════════════════════
const modal = reactive({
  show:     false,
  type:     'site',       // 'site' | 'category' | 'po-supplier-category' | 'po-supplier' | 'scope'
  isEdit:   false,
  editIdx:  null,
  title:    '',
  subtitle: '',
  form:     {},
  error:    '',
})

const closeModal = () => { modal.show = false; modal.error = '' }

// ── Sites ──
const siteSearch = ref('')

const filteredSites = computed(() => {
  const q = siteSearch.value.trim().toLowerCase()
  return globalData.value.sites
    .map((s, i) => ({ ...s, _origIndex: i }))
    .filter(s => !q ||
      (s.siteId   || '').toLowerCase().includes(q) ||
      (s.siteName || '').toLowerCase().includes(q) ||
      (s.jobNumber|| '').toLowerCase().includes(q)
    )
})

const openSiteForm = (index = null) => {
  modal.type     = 'site'
  modal.isEdit   = index !== null
  modal.editIdx  = index
  modal.title    = index !== null ? 'Edit Site' : 'Add New Site'
  modal.subtitle = index !== null ? `Editing ${globalData.value.sites[index]?.siteName}` : 'Fill in the details below'
  modal.form     = index !== null ? { ...globalData.value.sites[index] } : { siteId: '', siteName: '', jobNumber: '', comment: '' }
  modal.error    = ''
  modal.show     = true
}

const saveSite = () => {
  if (!modal.form.siteId?.trim())   { modal.error = 'Site ID is required.';   return }
  if (!modal.form.siteName?.trim()) { modal.error = 'Site Name is required.'; return }
  const entry = {
    siteId: modal.form.siteId.trim(), siteName: modal.form.siteName.trim(),
    jobNumber: modal.form.jobNumber?.trim() || '', comment: modal.form.comment?.trim() || ''
  }
  // Block exact duplicate (same siteId + siteName + jobNumber)
  const exactDup = globalData.value.sites.some((s, i) =>
    i !== modal.editIdx &&
    s.siteId === entry.siteId &&
    s.siteName === entry.siteName &&
    s.jobNumber === entry.jobNumber
  )
  if (exactDup) { modal.error = 'An identical site entry already exists (same Site ID, Name and Job Number).'; return }

  // Block duplicate job number (when provided)
  if (entry.jobNumber) {
    const dup = globalData.value.sites.some((s, i) => s.jobNumber && s.jobNumber === entry.jobNumber && i !== modal.editIdx)
    if (dup) { modal.error = `Job Number "${entry.jobNumber}" is already assigned to another site.`; return }
  }

  if (modal.isEdit) {
    const before = globalData.value.sites[modal.editIdx] || {}
    globalData.value.sites[modal.editIdx] = entry
    const changes = diffVOs(before, entry)
    addLog({
      action: 'updated',
      voId: '',
      siteId: entry.siteId,
      siteName: entry.siteName,
      jobNumber: entry.jobNumber || '',
      voDescription: '(Site configuration)',
      voAmount: 0,
      voStatus: '—',
      comment: entry.comment || '',
      changes
    })
  } else {
    globalData.value.sites.push(entry)
    addLog({
      action: 'created',
      voId: '',
      siteId: entry.siteId,
      siteName: entry.siteName,
      jobNumber: entry.jobNumber || '',
      voDescription: '(Site configuration)',
      voAmount: 0,
      voStatus: '—',
      comment: entry.comment || '',
      changes: []
    })
  }
  saveGlobalData(); closeModal()
}

// ── Site import / template ──
const siteFileInput = ref(null)
const importResult = ref(null)

const downloadSiteTemplate = () => {
  const headers = ['Site ID', 'Site Name', 'Job Number', 'Comment']
  const sample = [
    ['R07', 'Glen Iris', 'JOB-001', 'Example site row (delete before import)'],
  ]
  const ws = XLSX.utils.aoa_to_sheet([headers, ...sample])
  ws['!cols'] = [{ wch: 12 }, { wch: 22 }, { wch: 15 }, { wch: 30 }]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Sites')
  XLSX.writeFile(wb, 'Sites_Template.xlsx')
}

const handleSiteImport = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  try {
    const buffer = await file.arrayBuffer()
    const wb = XLSX.read(buffer, { type: 'array' })
    const ws = wb.Sheets[wb.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(ws, { defval: '' })

    const added = []
    const skipped = []
    const existingJobs = new Set(
      globalData.value.sites.map(s => (s.jobNumber || '').trim()).filter(Boolean)
    )
    const seenJobs = new Set()

    rows.forEach((r, idx) => {
      const rowNum = idx + 2 // +1 for header, +1 for 1-based
      const siteId    = String(r['Site ID']    ?? r.siteId    ?? '').trim()
      const siteName  = String(r['Site Name']  ?? r.siteName  ?? '').trim()
      const jobNumber = String(r['Job Number'] ?? r.jobNumber ?? '').trim()
      const comment   = String(r['Comment']    ?? r.comment   ?? '').trim()

      if (!siteId && !siteName && !jobNumber) return // blank row, skip silently

      if (!siteId) {
        skipped.push({ row: rowNum, reason: 'Missing Site ID', data: { siteName, jobNumber } })
        return
      }
      if (!siteName) {
        skipped.push({ row: rowNum, reason: 'Missing Site Name', data: { siteName, jobNumber } })
        return
      }
      if (jobNumber && existingJobs.has(jobNumber)) {
        skipped.push({ row: rowNum, reason: 'Duplicate Job Number (already exists)', data: { siteName, jobNumber } })
        return
      }
      if (jobNumber && seenJobs.has(jobNumber)) {
        skipped.push({ row: rowNum, reason: 'Duplicate Job Number within file', data: { siteName, jobNumber } })
        return
      }

      added.push({ siteId, siteName, jobNumber, comment })
      if (jobNumber) seenJobs.add(jobNumber)
    })

    if (added.length > 0) {
      globalData.value.sites.push(...added)
      saveGlobalData()

      // Log each added site
      added.forEach(s => {
        addLog({
          action: 'created',
          voId: '',
          siteId: s.siteId,
          siteName: s.siteName,
          jobNumber: s.jobNumber || '',
          voDescription: '(Imported from Excel)',
          voAmount: 0,
          voStatus: '—',
          comment: s.comment || '',
          changes: []
        })
      })
    }

    // Log skipped items as a summary
    if (skipped.length > 0) {
      const skipSummary = skipped.map(s => `Row ${s.row}: ${s.reason}`).join('; ')
      addLog({
        action: 'updated',
        voId: '',
        siteId: '(Import)',
        siteName: '(Import summary)',
        jobNumber: '',
        voDescription: `Skipped ${skipped.length} row(s) during import: ${skipSummary}`,
        voAmount: 0,
        voStatus: '—',
        comment: '',
        changes: []
      })
    }

    importResult.value = { added: added.length, skipped }
  } catch (err) {
    console.error('Site import error', err)
    addLog({
      action: 'updated',
      voId: '',
      siteId: '(Import)',
      siteName: '(Import error)',
      jobNumber: '',
      voDescription: `Site import failed: ${err.message}`,
      voAmount: 0,
      voStatus: '—',
      comment: '',
      changes: []
    })
    importResult.value = { added: 0, skipped: [{ row: '—', reason: `File parse error: ${err.message}`, data: {} }] }
  } finally {
    event.target.value = '' // allow re-importing same file
  }
}

const removeSite = (i) => {
  if (confirm(`Delete site "${globalData.value.sites[i].siteName}"?`)) {
    const site = globalData.value.sites[i]
    globalData.value.sites.splice(i, 1)
    saveGlobalData()
    addLog({
      action: 'deleted',
      voId: '',
      siteId: site.siteId,
      siteName: site.siteName,
      jobNumber: site.jobNumber || '',
      voDescription: '(Site configuration)',
      voAmount: 0,
      voStatus: '—',
      comment: '',
      changes: []
    })
  }
}

// ── Categories ──
// PO Suppliers import / template
const poSupplierFileInput = ref(null)
const poSupplierImportResult = ref(null)

const normalizeSupplierName = (value) => String(value || '').trim()

const downloadPOSupplierTemplate = () => {
  const headers = ['Supplier Name']
  const sample = [['Example Supplier Pty Ltd']]
  const ws = XLSX.utils.aoa_to_sheet([headers, ...sample])
  ws['!cols'] = [{ wch: 32 }]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'PO Suppliers')
  XLSX.writeFile(wb, 'PO_Suppliers_Template.xlsx')
}

const handlePOSupplierImport = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  try {
    const buffer = await file.arrayBuffer()
    const wb = XLSX.read(buffer, { type: 'array' })
    const ws = wb.Sheets[wb.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(ws, { defval: '' })

    const existing = new Set((globalData.value.poSuppliers || []).map(s => normalizeSupplierName(s.name).toLowerCase()).filter(Boolean))
    const inFile = new Set()
    const added = []
    const skipped = []

    rows.forEach((row, idx) => {
      const rowNo = idx + 2
      const rawName = row['Supplier Name'] ?? row['supplierName'] ?? row['Supplier'] ?? row['supplier'] ?? ''
      const name = normalizeSupplierName(rawName)
      if (!name) return
      const key = name.toLowerCase()
      if (existing.has(key)) {
        skipped.push(`Row ${rowNo}: "${name}" already exists`)
        return
      }
      if (inFile.has(key)) {
        skipped.push(`Row ${rowNo}: "${name}" duplicated in file`)
        return
      }
      inFile.add(key)
      added.push({ name })
    })

    if (added.length > 0) {
      globalData.value.poSuppliers.push(...added)
      saveGlobalData()
    }

    poSupplierImportResult.value = { added: added.length, skipped }
  } catch (err) {
    poSupplierImportResult.value = { added: 0, skipped: [`Import failed: ${err.message}`] }
  } finally {
    event.target.value = ''
  }
}

const openCategoryForm = (index = null) => {
  modal.type     = 'category'
  modal.isEdit   = index !== null
  modal.editIdx  = index
  modal.title    = index !== null ? 'Edit Category' : 'Add Category'
  modal.subtitle = index !== null ? `Editing ${globalData.value.voCategories[index]?.name}` : 'Fill in the details below'
  modal.form     = index !== null ? { ...globalData.value.voCategories[index] } : { name: '', comment: '' }
  modal.error    = ''
  modal.show     = true
}

const saveCategory = () => {
  if (!modal.form.name?.trim()) { modal.error = 'Category name is required.'; return }
  const entry = { name: modal.form.name.trim(), comment: modal.form.comment?.trim() || '' }
  if (!modal.isEdit && globalData.value.voCategories.some(c => c.name === entry.name)) {
    modal.error = 'This category already exists.'; return
  }
  if (modal.isEdit) globalData.value.voCategories[modal.editIdx] = entry
  else              globalData.value.voCategories.push(entry)
  saveGlobalData(); closeModal()
}

const removeVOCategory = (i) => { globalData.value.voCategories.splice(i, 1); saveGlobalData() }

// â”€â”€ PO Supplier Categories â”€â”€
const openPOSupplierCategoryForm = (index = null) => {
  modal.type     = 'po-supplier-category'
  modal.isEdit   = index !== null
  modal.editIdx  = index
  modal.title    = index !== null ? 'Edit PO Supplier Category' : 'Add PO Supplier Category'
  modal.subtitle = index !== null ? `Editing ${globalData.value.poSupplierCategories[index]?.name}` : 'Fill in the details below'
  modal.form     = index !== null ? { ...globalData.value.poSupplierCategories[index] } : { name: '', comment: '' }
  modal.error    = ''
  modal.show     = true
}

const savePOSupplierCategory = () => {
  if (!modal.form.name?.trim()) { modal.error = 'Category name is required.'; return }
  const entry = { name: modal.form.name.trim(), comment: modal.form.comment?.trim() || '' }
  if (!modal.isEdit && globalData.value.poSupplierCategories.some(c => c.name === entry.name)) {
    modal.error = 'This category already exists.'; return
  }
  if (modal.isEdit) globalData.value.poSupplierCategories[modal.editIdx] = entry
  else              globalData.value.poSupplierCategories.push(entry)
  saveGlobalData(); closeModal()
}

const removePOSupplierCategory = (i) => { globalData.value.poSupplierCategories.splice(i, 1); saveGlobalData() }

// ── Scopes ──
// PO Suppliers
const openPOSupplierForm = (index = null) => {
  modal.type     = 'po-supplier'
  modal.isEdit   = index !== null
  modal.editIdx  = index
  modal.title    = index !== null ? 'Edit PO Supplier' : 'Add PO Supplier'
  modal.subtitle = index !== null ? `Editing ${globalData.value.poSuppliers[index]?.name}` : 'Supplier name only'
  modal.form     = index !== null ? { ...globalData.value.poSuppliers[index] } : { name: '' }
  modal.error    = ''
  modal.show     = true
}

const savePOSupplier = () => {
  const name = normalizeSupplierName(modal.form.name)
  if (!name) { modal.error = 'Supplier name is required.'; return }
  const duplicate = globalData.value.poSuppliers.some((s, i) =>
    i !== modal.editIdx && normalizeSupplierName(s.name).toLowerCase() === name.toLowerCase()
  )
  if (duplicate) { modal.error = 'This supplier already exists.'; return }
  const entry = { name }
  if (modal.isEdit) globalData.value.poSuppliers[modal.editIdx] = entry
  else              globalData.value.poSuppliers.push(entry)
  saveGlobalData(); closeModal()
}

const removePOSupplier = (i) => { globalData.value.poSuppliers.splice(i, 1); saveGlobalData() }

const openScopeForm = (index = null) => {
  modal.type     = 'scope'
  modal.isEdit   = index !== null
  modal.editIdx  = index
  modal.title    = index !== null ? 'Edit Scope' : 'Add Scope'
  modal.subtitle = index !== null ? `Editing ${globalData.value.scopes[index]?.name}` : 'Fill in the details below'
  modal.form     = index !== null ? { ...globalData.value.scopes[index] } : { name: '', comment: '' }
  modal.error    = ''
  modal.show     = true
}

const saveScope = () => {
  if (!modal.form.name?.trim()) { modal.error = 'Scope name is required.'; return }
  const entry = { name: modal.form.name.trim(), comment: modal.form.comment?.trim() || '' }
  if (!modal.isEdit && globalData.value.scopes.some(s => s.name === entry.name)) {
    modal.error = 'This scope already exists.'; return
  }
  if (modal.isEdit) globalData.value.scopes[modal.editIdx] = entry
  else              globalData.value.scopes.push(entry)
  saveGlobalData(); closeModal()
}

const removeScope = (i) => { globalData.value.scopes.splice(i, 1); saveGlobalData() }

// ── Unified save dispatcher ──
const saveModal = () => {
  if (modal.type === 'site')     saveSite()
  else if (modal.type === 'category') saveCategory()
  else if (modal.type === 'po-supplier-category') savePOSupplierCategory()
  else if (modal.type === 'po-supplier') savePOSupplier()
  else                           saveScope()
}

// ── Clear all data ──
const clearAllData = () => {
  if (!confirm('Are you absolutely sure? This will delete ALL variations and cannot be undone!')) return
  if (!confirm('Click OK one more time to confirm.')) return
  localStorage.clear()
  alert('All data has been cleared.')
  window.location.reload()
}
</script>
