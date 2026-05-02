<template>
  <div class="space-y-6">

    <!-- Page header -->
    <div class="flex items-center justify-between pb-2 border-b border-gray-100">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">Import / Export</h2>
          <p class="text-xs text-gray-400 mt-0.5">Manage your variation order data</p>
        </div>
      </div>
      <div class="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-xl font-semibold">
        <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"/>
        </svg>
        {{ store.vos.value?.length || 0 }} records in database
      </div>
    </div>

    <!-- ── Top row: Export+Import + Template ── -->
    <div class="grid grid-cols-2 gap-4 items-start">

      <!-- Export + Import combined card -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

        <!-- Export section -->
        <div class="p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-gray-900">Export Data</h3>
              <p class="text-xs text-gray-500">Download all {{ store.vos.value?.length || 0 }} records</p>
            </div>
          </div>

          <div class="flex gap-3">
            <button @click="exportExcel"
              class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Excel (.xlsx)
            </button>
            <button @click="exportCSV"
              class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
              CSV
            </button>
          </div>

          <!-- Export feedback -->
          <transition name="fade">
            <div v-if="exportMessage"
              class="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
              :class="exportMessageType === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
              <svg v-if="exportMessageType === 'success'" class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              {{ exportMessage }}
            </div>
          </transition>
        </div>

        <!-- Divider -->
        <div class="border-t border-gray-100 mx-6"></div>

        <!-- Import section -->
        <div class="p-6 space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-gray-900">Import Data</h3>
              <p class="text-xs text-gray-500">Records will be <span class="font-semibold text-blue-600">appended</span> — nothing is overwritten</p>
            </div>
          </div>

          <!-- Step 1: Drop zone -->
          <div>
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold mr-1.5">1</span>
              Select File
            </p>
            <label
              class="flex flex-col items-center justify-center gap-3 w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition"
              :class="dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'"
              @dragover.prevent="dragOver = true"
              @dragleave="dragOver = false"
              @drop.prevent="onDrop">
              <svg class="w-7 h-7" :class="dragOver ? 'text-blue-500' : 'text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
              <div class="text-center">
                <span class="text-sm font-semibold text-gray-700">Drop file here or <span class="text-blue-600">browse</span></span>
                <p class="text-xs text-gray-400 mt-0.5">Supports .xlsx, .xls, .csv</p>
              </div>
              <input type="file" class="hidden" accept=".xlsx,.xls,.csv" @change="handleFileSelect" ref="fileInput" />
            </label>

            <!-- Selected file chip -->
            <div v-if="selectedFileName && !importError" class="mt-3 flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg">
              <svg class="w-4 h-4 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <span class="text-sm font-medium text-blue-700 flex-1 truncate">{{ selectedFileName }}</span>
              <button @click="clearFile" class="text-blue-400 hover:text-blue-600 transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Error -->
          <div v-if="importError" class="flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
            <svg class="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div>
              <p class="text-sm font-semibold text-red-700">Import failed</p>
              <p class="text-xs text-red-600 mt-0.5">{{ importError }}</p>
            </div>
          </div>

          <!-- Step 2: Preview -->
          <div v-if="previewData && previewData.vos.length > 0">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold mr-1.5">2</span>
              Preview — {{ previewData.vos.length }} records detected
            </p>

            <div class="rounded-xl border border-gray-200 overflow-hidden">
              <div class="overflow-x-auto">
                <table class="min-w-full text-sm">
                  <thead class="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th class="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                      <th class="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Site ID</th>
                      <th class="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Site Name</th>
                      <th class="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                      <th class="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                      <th class="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    <tr v-for="(vo, idx) in previewData.vos.slice(0, 8)" :key="idx" class="hover:bg-gray-50">
                      <td class="px-4 py-2.5 text-xs text-gray-400">{{ idx + 1 }}</td>
                      <td class="px-4 py-2.5">
                        <span class="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-xs font-bold">{{ vo.siteId || '—' }}</span>
                      </td>
                      <td class="px-4 py-2.5 text-sm text-gray-800 max-w-[120px] truncate">{{ vo.siteName || '—' }}</td>
                      <td class="px-4 py-2.5 text-sm text-gray-600 max-w-[160px] truncate">{{ vo.voDescription }}</td>
                      <td class="px-4 py-2.5 text-sm font-semibold text-gray-900 text-right">{{ formatCurrency(vo.voAmount) }}</td>
                      <td class="px-4 py-2.5">
                        <span class="px-2 py-0.5 rounded-full text-xs font-semibold capitalize"
                          :class="statusClass(vo.voStatus)">{{ vo.voStatus }}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-if="previewData.vos.length > 8"
                class="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 text-center">
                + {{ previewData.vos.length - 8 }} more records not shown
              </div>
            </div>

            <!-- Warnings -->
            <div v-if="previewData.warnings?.length > 0"
              class="mt-3 flex items-start gap-3 px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-xl">
              <svg class="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              </svg>
              <div>
                <p class="text-xs font-semibold text-yellow-800">{{ previewData.warnings.length }} row(s) skipped due to errors</p>
                <ul class="mt-1 space-y-0.5">
                  <li v-for="(w, i) in previewData.warnings.slice(0, 3)" :key="i" class="text-xs text-yellow-700">
                    Row {{ w.row }}: {{ w.error }}
                  </li>
                  <li v-if="previewData.warnings.length > 3" class="text-xs text-yellow-600">
                    … and {{ previewData.warnings.length - 3 }} more
                  </li>
                </ul>
              </div>
            </div>

            <!-- Step 3: Confirm -->
            <div class="mt-4">
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold mr-1.5">3</span>
                Confirm Import
              </p>

              <div class="flex items-center gap-3 px-4 py-3 bg-blue-50 rounded-xl border border-blue-100 mb-3">
                <svg class="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p class="text-sm text-blue-700">
                  <span class="font-bold">{{ previewData.vos.length }} records</span> will be
                  <span class="font-bold">appended</span> to your existing
                  <span class="font-bold">{{ store.vos.value?.length || 0 }} records</span>.
                  No existing data will be deleted.
                </p>
              </div>

              <button @click="importData" :disabled="importing"
                class="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                <svg v-if="!importing" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                </svg>
                <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                {{ importing ? 'Importing…' : `Import ${previewData.vos.length} Records` }}
              </button>
            </div>
          </div>

          <!-- Success -->
          <transition name="fade">
            <div v-if="importSuccess"
              class="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-xl">
              <svg class="w-5 h-5 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <div>
                <p class="text-sm font-bold text-green-700">Import successful!</p>
                <p class="text-xs text-green-600 mt-0.5">{{ importSuccess }}</p>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <!-- Template Download -->
      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <div>
            <h3 class="font-bold text-gray-900">Import Template</h3>
            <p class="text-xs text-gray-500">Download the blank template to fill in</p>
          </div>
        </div>

        <button @click="downloadTemplate"
          class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Download Excel Template
        </button>

        <!-- Column hint -->
        <div class="mt-4 pt-4 border-t border-gray-50">
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Required columns</p>
          <div class="flex flex-wrap gap-1.5">
            <span v-for="col in requiredCols" :key="col"
              class="px-2 py-0.5 bg-red-50 text-red-600 rounded-md text-xs font-medium">{{ col }}</span>
          </div>
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-3 mb-2">Optional columns</p>
          <div class="flex flex-wrap gap-1.5">
            <span v-for="col in optionalCols" :key="col"
              class="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md text-xs">{{ col }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Invoice Status Import ── -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <div>
            <h3 class="font-bold text-gray-900">Invoice Status Import</h3>
            <p class="text-xs text-gray-500">Bulk-update invoice statuses by importing a PO / Invoice Status file — only changed rows will be shown for review</p>
          </div>
        </div>
        <button @click="downloadInvoiceTemplate"
          class="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition shadow-sm shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Download Template
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 space-y-4">

        <!-- Drop zone -->
        <label
          class="flex flex-col items-center justify-center gap-3 w-full h-24 border-2 border-dashed rounded-xl cursor-pointer transition"
          :class="invDragOver ? 'border-teal-400 bg-teal-50' : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'"
          @dragover.prevent="invDragOver = true"
          @dragleave="invDragOver = false"
          @drop.prevent="onInvoiceDrop">
          <svg class="w-6 h-6" :class="invDragOver ? 'text-teal-500' : 'text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
          </svg>
          <div class="text-center">
            <span class="text-sm font-semibold text-gray-700">Drop file here or <span class="text-teal-600">browse</span></span>
            <p class="text-xs text-gray-400 mt-0.5">Supports .xlsx, .xls, .csv · Columns: PO Number, VO Amount, Invoice Status</p>
          </div>
          <input type="file" class="hidden" accept=".xlsx,.xls,.csv" @change="handleInvoiceFileSelect" ref="invFileInput" />
        </label>

        <!-- Selected file chip -->
        <div v-if="invFileName && !invError" class="flex items-center gap-2 px-3 py-2 bg-teal-50 rounded-lg">
          <svg class="w-4 h-4 text-teal-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <span class="text-sm font-medium text-teal-700 flex-1 truncate">{{ invFileName }}</span>
          <button @click="clearInvoiceImport" class="text-teal-400 hover:text-teal-600 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Error -->
        <div v-if="invError" class="flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
          <svg class="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div>
            <p class="text-sm font-semibold text-red-700">Parse failed</p>
            <p class="text-xs text-red-600 mt-0.5">{{ invError }}</p>
          </div>
        </div>

        <!-- No differences -->
        <div v-if="invNoDiffs" class="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-xl">
          <svg class="w-5 h-5 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <p class="text-sm font-semibold text-green-700">All imported rows already match existing invoice statuses — no updates needed.</p>
        </div>

        <!-- Diff table -->
        <div v-if="invDiffs.length > 0">

          <!-- Table toolbar -->
          <div class="flex items-center justify-between gap-3 mb-3 flex-wrap">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-sm font-semibold text-gray-700">{{ invDiffs.length }} difference{{ invDiffs.length !== 1 ? 's' : '' }} found</span>
              <span v-if="invDiffs.filter(d => d.amountMismatch).length > 0"
                class="px-2 py-0.5 rounded-md text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200">
                {{ invDiffs.filter(d => d.amountMismatch).length }} with amount change
              </span>
              <span class="text-xs text-gray-400">— select rows you want to update</span>
            </div>
            <div class="flex items-center gap-2">
              <button @click="invDiffs.forEach(d => d.selected = true)"
                class="text-xs px-2.5 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition font-medium">Select All</button>
              <button @click="invDiffs.forEach(d => d.selected = false)"
                class="text-xs px-2.5 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition font-medium">Clear</button>
              <button @click="applyInvoiceUpdates" :disabled="invSelectedCount === 0 || invApplying"
                :class="invSelectedCount > 0 && !invApplying
                  ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
                class="inline-flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-lg transition font-semibold">
                <svg v-if="invApplying" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                {{ invApplying ? 'Applying…' : `Apply ${invSelectedCount} Update${invSelectedCount !== 1 ? 's' : ''}` }}
              </button>
            </div>
          </div>

          <!-- Table -->
          <div class="rounded-xl border border-gray-200 overflow-hidden">
            <table class="min-w-full text-sm">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-4 py-2.5 w-10">
                    <input type="checkbox"
                      :checked="invSelectedCount === invDiffs.length && invDiffs.length > 0"
                      :indeterminate="invSelectedCount > 0 && invSelectedCount < invDiffs.length"
                      @change="e => invDiffs.forEach(d => d.selected = e.target.checked)"
                      class="w-4 h-4 rounded accent-teal-600 cursor-pointer" />
                  </th>
                  <th class="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Site ID</th>
                  <th class="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">PO Number</th>
                  <th class="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">VO Description</th>
                  <th class="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th class="px-4 py-2.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Status</th>
                  <th class="px-4 py-2.5 w-6"></th>
                  <th class="px-4 py-2.5 text-center text-xs font-semibold text-teal-600 uppercase tracking-wider">New Status</th>
                  <th class="px-4 py-2.5 text-center text-xs font-semibold text-teal-600 uppercase tracking-wider">Invoice Date</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="diff in invDiffs" :key="diff.voId"
                  @click="diff.selected = !diff.selected"
                  class="cursor-pointer transition"
                  :class="diff.selected
                    ? (diff.amountMismatch ? 'bg-orange-50 hover:bg-orange-100' : 'bg-teal-50 hover:bg-teal-100')
                    : 'hover:bg-gray-50'">
                  <td class="px-4 py-3 text-center" @click.stop>
                    <input type="checkbox" v-model="diff.selected"
                      class="w-4 h-4 rounded accent-teal-600 cursor-pointer" />
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span class="text-xs font-semibold text-indigo-600">{{ diff.siteId || '—' }}</span>
                  </td>
                  <td class="px-4 py-3">
                    <span class="px-2 py-0.5 rounded-md bg-teal-100 text-teal-700 text-xs font-bold">{{ diff.poNumber }}</span>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-700 max-w-xs">
                    <div class="truncate" :title="diff.voDescription">{{ diff.voDescription || '—' }}</div>
                  </td>
                  <td class="px-4 py-3 text-right whitespace-nowrap">
                    <template v-if="diff.amountMismatch">
                      <div class="text-xs text-gray-400 line-through">{{ formatCurrency(diff.voAmount) }}</div>
                      <div class="text-sm font-semibold text-orange-600">{{ formatCurrency(diff.importedAmount) }}</div>
                    </template>
                    <span v-else class="text-sm font-semibold text-gray-900">{{ formatCurrency(diff.voAmount) }}</span>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                      :class="invStatusClass(diff.currentStatus)">
                      {{ diff.currentStatus || 'Not Set' }}
                    </span>
                  </td>
                  <td class="px-2 py-3 text-center text-gray-400 font-bold text-base">→</td>
                  <td class="px-4 py-3 text-center">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                      :class="invStatusClass(diff.newStatus)">
                      {{ diff.newStatus || 'Not Set' }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-center" @click.stop>
                    <input v-if="diff.newStatus && diff.newStatus !== 'Not Yet Sent'"
                      type="date" v-model="diff.invoiceDate"
                      class="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-700 focus:outline-none focus:ring-1 focus:ring-teal-400 focus:border-teal-400" />
                    <span v-else class="text-xs text-gray-400">—</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Success -->
        <transition name="fade">
          <div v-if="invSuccess" class="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-xl">
            <svg class="w-5 h-5 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <p class="text-sm font-bold text-green-700">{{ invSuccess }}</p>
          </div>
        </transition>

      </div>
    </div>

    <!-- ── Amount Change Import ── -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <h3 class="font-bold text-gray-900">Amount Change Import</h3>
            <p class="text-xs text-gray-500">Bulk-update VO amounts by importing a PO / Amount file — only changed rows will be shown for review</p>
          </div>
        </div>
        <button @click="downloadAmountTemplate"
          class="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-xl text-sm font-semibold hover:bg-amber-700 transition shadow-sm shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Download Template
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 space-y-4">

        <!-- Drop zone -->
        <label
          class="flex flex-col items-center justify-center gap-3 w-full h-24 border-2 border-dashed rounded-xl cursor-pointer transition"
          :class="amtDragOver ? 'border-amber-400 bg-amber-50' : 'border-gray-200 hover:border-amber-300 hover:bg-gray-50'"
          @dragover.prevent="amtDragOver = true"
          @dragleave="amtDragOver = false"
          @drop.prevent="onAmountDrop">
          <svg class="w-6 h-6" :class="amtDragOver ? 'text-amber-500' : 'text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
          </svg>
          <div class="text-center">
            <span class="text-sm font-semibold text-gray-700">Drop file here or <span class="text-amber-600">browse</span></span>
            <p class="text-xs text-gray-400 mt-0.5">Supports .xlsx, .xls, .csv · Columns: PO Number, Initial VO Amount, Final VO Amount</p>
          </div>
          <input type="file" class="hidden" accept=".xlsx,.xls,.csv" @change="handleAmountFileSelect" ref="amtFileInput" />
        </label>

        <!-- Selected file chip -->
        <div v-if="amtFileName && !amtError" class="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-lg">
          <svg class="w-4 h-4 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <span class="text-sm font-medium text-amber-700 flex-1 truncate">{{ amtFileName }}</span>
          <button @click="clearAmountImport" class="text-amber-400 hover:text-amber-600 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Error -->
        <div v-if="amtError" class="flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
          <svg class="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div>
            <p class="text-sm font-semibold text-red-700">Parse failed</p>
            <p class="text-xs text-red-600 mt-0.5">{{ amtError }}</p>
          </div>
        </div>

        <!-- No differences -->
        <div v-if="amtNoDiffs" class="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-xl">
          <svg class="w-5 h-5 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <p class="text-sm font-semibold text-green-700">All imported rows already match existing VO amounts — no updates needed.</p>
        </div>

        <!-- Diff table -->
        <div v-if="amtDiffs.length > 0">
          <div class="flex items-center justify-between gap-3 mb-3 flex-wrap">
            <div class="flex items-center gap-2">
              <span class="text-sm font-semibold text-gray-700">{{ amtDiffs.length }} difference{{ amtDiffs.length !== 1 ? 's' : '' }} found</span>
              <span class="text-xs text-gray-400">— select rows you want to update</span>
            </div>
            <div class="flex items-center gap-2">
              <button @click="amtDiffs.forEach(d => d.selected = true)"
                class="text-xs px-2.5 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition font-medium">Select All</button>
              <button @click="amtDiffs.forEach(d => d.selected = false)"
                class="text-xs px-2.5 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition font-medium">Clear</button>
              <button @click="applyAmountUpdates" :disabled="amtSelectedCount === 0 || amtApplying"
                :class="amtSelectedCount > 0 && !amtApplying
                  ? 'bg-amber-600 text-white hover:bg-amber-700 shadow-sm'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'"
                class="inline-flex items-center gap-1.5 text-sm px-4 py-1.5 rounded-lg transition font-semibold">
                <svg v-if="amtApplying" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                {{ amtApplying ? 'Applying…' : `Apply ${amtSelectedCount} Update${amtSelectedCount !== 1 ? 's' : ''}` }}
              </button>
            </div>
          </div>

          <div class="rounded-xl border border-gray-200 overflow-hidden">
            <table class="min-w-full text-sm">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-4 py-2.5 w-10">
                    <input type="checkbox"
                      :checked="amtSelectedCount === amtDiffs.length && amtDiffs.length > 0"
                      :indeterminate="amtSelectedCount > 0 && amtSelectedCount < amtDiffs.length"
                      @change="e => amtDiffs.forEach(d => d.selected = e.target.checked)"
                      class="w-4 h-4 rounded accent-amber-600 cursor-pointer" />
                  </th>
                  <th class="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">PO Number</th>
                  <th class="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">VO Description</th>
                  <th class="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Amount</th>
                  <th class="px-4 py-2.5 w-6"></th>
                  <th class="px-4 py-2.5 text-right text-xs font-semibold text-amber-600 uppercase tracking-wider">New Amount</th>
                  <th class="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Difference</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="diff in amtDiffs" :key="diff.voId"
                  @click="diff.selected = !diff.selected"
                  class="cursor-pointer transition"
                  :class="diff.selected ? 'bg-amber-50 hover:bg-amber-100' : 'hover:bg-gray-50'">
                  <td class="px-4 py-3 text-center" @click.stop>
                    <input type="checkbox" v-model="diff.selected"
                      class="w-4 h-4 rounded accent-amber-600 cursor-pointer" />
                  </td>
                  <td class="px-4 py-3">
                    <span class="px-2 py-0.5 rounded-md bg-teal-100 text-teal-700 text-xs font-bold">{{ diff.poNumber }}</span>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-700 max-w-xs">
                    <div class="truncate" :title="diff.voDescription">{{ diff.voDescription || '—' }}</div>
                  </td>
                  <td class="px-4 py-3 text-sm font-semibold text-gray-500 text-right whitespace-nowrap">{{ formatCurrency(diff.currentAmount) }}</td>
                  <td class="px-2 py-3 text-center text-gray-400 font-bold text-base">→</td>
                  <td class="px-4 py-3 text-sm font-bold text-amber-700 text-right whitespace-nowrap">{{ formatCurrency(diff.newAmount) }}</td>
                  <td class="px-4 py-3 text-sm text-right whitespace-nowrap font-semibold"
                    :class="diff.newAmount > diff.currentAmount ? 'text-green-600' : 'text-red-500'">
                    {{ diff.newAmount > diff.currentAmount ? '+' : '' }}{{ formatCurrency(diff.newAmount - diff.currentAmount) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Success -->
        <transition name="fade">
          <div v-if="amtSuccess" class="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-xl">
            <svg class="w-5 h-5 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <p class="text-sm font-bold text-green-700">{{ amtSuccess }}</p>
          </div>
        </transition>

      </div>
    </div>

    <!-- ── Backup & Restore Section ── -->
    <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1-4l-3 3m0 0l-3-3m3 3V2"/>
          </svg>
        </div>
        <div>
          <h3 class="font-bold text-gray-900">Backup &amp; Restore</h3>
          <p class="text-xs text-gray-500">Full snapshot of all variations, invoice prep list, admin data &amp; activity log — saved as a <span class="font-semibold text-blue-600">.json</span> file</p>
        </div>
      </div>

      <div class="grid grid-cols-2 divide-x divide-gray-100">

        <!-- LEFT: Export backup -->
        <div class="p-6 space-y-4">
          <div>
            <p class="text-sm font-bold text-gray-900">Export Backup</p>
            <p class="text-xs text-gray-500 mt-0.5">Downloads a complete snapshot you can restore later</p>
          </div>
          <!-- What's included -->
          <ul class="space-y-1.5">
            <li v-for="item in backupContents" :key="item.label"
              class="flex items-center gap-2 text-xs text-gray-600">
              <svg class="w-3.5 h-3.5 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
              </svg>
              <span class="font-semibold text-gray-700">{{ item.label }}</span>
              <span class="text-gray-400">{{ item.desc }}</span>
            </li>
          </ul>
          <button @click="exportBackup"
            class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            Download Backup (.json)
          </button>
          <transition name="fade">
            <div v-if="backupMessage"
              class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
              :class="backupMessageType === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
              {{ backupMessage }}
            </div>
          </transition>
        </div>

        <!-- RIGHT: Restore backup -->
        <div class="p-6 space-y-4">
          <div>
            <p class="text-sm font-bold text-gray-900">Restore Backup</p>
            <p class="text-xs text-gray-500 mt-0.5">Upload a <span class="font-semibold">.json</span> backup file to fully restore your data</p>
            <div class="mt-2 flex items-center gap-1.5 text-xs text-amber-700 font-semibold">
              <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              </svg>
              Replaces all current data — cannot be undone
            </div>
          </div>

          <!-- Drop zone -->
          <label
            class="flex flex-col items-center justify-center gap-2 w-full h-24 border-2 border-dashed rounded-xl cursor-pointer transition"
            :class="restoreDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'"
            @dragover.prevent="restoreDragOver = true"
            @dragleave="restoreDragOver = false"
            @drop.prevent="onRestoreDrop">
            <svg class="w-6 h-6" :class="restoreDragOver ? 'text-blue-500' : 'text-gray-300'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
            <span class="text-xs font-semibold text-gray-600">Drop <span class="text-blue-600">.json</span> here or <span class="text-blue-600">browse</span></span>
            <input type="file" class="hidden" accept=".json" @change="handleRestoreSelect" ref="restoreFileInput" />
          </label>

          <!-- Restore preview -->
          <div v-if="restorePreview" class="rounded-xl border border-blue-100 bg-blue-50 p-4 space-y-2">
            <p class="text-xs font-bold text-blue-700 uppercase tracking-wider">Snapshot summary</p>
            <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <span class="text-gray-500">Variations</span>
              <span class="font-bold text-gray-900">{{ restorePreview.voCount }}</span>
              <span class="text-gray-500">Invoice Prep IDs</span>
              <span class="font-bold text-gray-900">{{ restorePreview.prepCount }}</span>
              <span class="text-gray-500">Sites</span>
              <span class="font-bold text-gray-900">{{ restorePreview.siteCount }}</span>
              <span class="text-gray-500">Categories</span>
              <span class="font-bold text-gray-900">{{ restorePreview.categoryCount }}</span>
              <span class="text-gray-500">Scopes</span>
              <span class="font-bold text-gray-900">{{ restorePreview.scopeCount }}</span>
              <span class="text-gray-500">Activity Logs</span>
              <span class="font-bold text-gray-900">{{ restorePreview.logCount }}</span>
              <span class="text-gray-500">Exported at</span>
              <span class="font-bold text-gray-900">{{ restorePreview.exportedAt }}</span>
            </div>
            <div class="pt-2 border-t border-blue-200 flex items-start gap-2">
              <svg class="w-3.5 h-3.5 text-yellow-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              </svg>
              <p class="text-xs text-yellow-700 font-medium">This will <span class="font-bold">replace</span> all current data. This cannot be undone.</p>
            </div>
            <button @click="confirmRestore" :disabled="restoring"
              class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-xl text-sm font-bold hover:bg-amber-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
              <svg v-if="!restoring" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              {{ restoring ? 'Restoring…' : 'Restore This Backup' }}
            </button>
          </div>

          <!-- Restore error -->
          <div v-if="restoreError" class="flex items-start gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
            <svg class="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {{ restoreError }}
          </div>

          <!-- Restore success -->
          <transition name="fade">
            <div v-if="restoreSuccess"
              class="flex items-center gap-2 px-3 py-2.5 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700 font-semibold">
              <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              {{ restoreSuccess }}
            </div>
          </transition>
        </div>

      </div>
    </div>


  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useVOStore } from '../stores/voStore'
import { exportToExcel, exportToCSV } from '../utils/export'
import { importFromFile } from '../utils/import'
import { formatCurrency } from '../utils/formatters'
import { clearAllData, bulkInsertVOs } from '../db/indexdb'
import * as XLSX from 'xlsx'

const store = useVOStore()

const BACKUP_VERSION = 2

// ── backup meta ──
const backupContents = computed(() => [
  { label: 'Variations',     desc: `${store.vos.value?.length || 0} records (all fields, IDs, invoice log & PO log preserved)` },
  { label: 'Invoice Prep',   desc: 'which VOs are queued for invoicing' },
  { label: 'Admin Data',     desc: 'sites, categories, scopes & settings' },
  { label: 'Activity Log',   desc: 'full audit trail' },
])

// ── backup state ──
const backupMessage     = ref(null)
const backupMessageType = ref(null)
const restoreDragOver   = ref(false)
const restoreFileInput  = ref(null)
const restorePreview    = ref(null)
const restorePayload    = ref(null)
const restoreError      = ref(null)
const restoreSuccess    = ref(null)
const restoring         = ref(false)

// ── export backup ──
const exportBackup = () => {
  try {
    const payload = {
      _version:       BACKUP_VERSION,
      exportedAt:     new Date().toISOString(),
      vos:            store.vos.value || [],
      invoicePrepIds: [...(store.invoicePrepIds?.value || [])],
      adminData:      (() => { try { return JSON.parse(localStorage.getItem('globalData') || 'null') } catch { return null } })(),
      activityLog:    (() => { try { return JSON.parse(localStorage.getItem('voActivityLog') || '[]') } catch { return [] } })(),
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    const date = new Date().toISOString().slice(0, 10)
    a.href     = url
    a.download = `VariationTracker_Backup_${date}.json`
    a.click()
    URL.revokeObjectURL(url)
    backupMessage.value     = `Backup downloaded — ${payload.vos.length} variations included`
    backupMessageType.value = 'success'
    setTimeout(() => { backupMessage.value = null }, 4000)
  } catch (e) {
    backupMessage.value     = 'Backup failed: ' + e.message
    backupMessageType.value = 'error'
  }
}

// ── restore helpers ──
const parseRestoreFile = async (file) => {
  restorePreview.value = null
  restorePayload.value = null
  restoreError.value   = null
  restoreSuccess.value = null
  try {
    const text = await file.text()
    const data = JSON.parse(text)
    if (!data._version || !Array.isArray(data.vos)) throw new Error('Not a valid backup file')
    if (!Number.isInteger(data._version) || data._version < 1) throw new Error('Invalid backup file: missing or corrupt version field')
    if (data._version > BACKUP_VERSION) throw new Error(`Backup version ${data._version} is newer than this app supports (v${BACKUP_VERSION}) — please update the app`)
    restorePayload.value = data
    const d = new Date(data.exportedAt)
    restorePreview.value = {
      voCount:       data.vos.length,
      prepCount:     (data.invoicePrepIds || []).length,
      siteCount:     data.adminData?.sites?.length      ?? 0,
      categoryCount: data.adminData?.voCategories?.length ?? 0,
      scopeCount:    data.adminData?.scopes?.length     ?? 0,
      logCount:      (data.activityLog || []).length,
      exportedAt:    isNaN(d) ? data.exportedAt : d.toLocaleString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    }
  } catch (e) {
    restoreError.value = e.message.startsWith('Not a valid') ? e.message : 'Could not read file: ' + e.message
  }
}

const handleRestoreSelect = (e) => {
  const file = e.target.files?.[0]
  if (file) parseRestoreFile(file)
}

const onRestoreDrop = (e) => {
  restoreDragOver.value = false
  const file = e.dataTransfer.files?.[0]
  if (file) parseRestoreFile(file)
}

// ── confirm restore ──
const confirmRestore = async () => {
  if (!restorePayload.value) return
  // Deep-clone through JSON to strip Vue reactive Proxy wrappers — IndexedDB's
  // structured clone algorithm cannot serialize Proxy objects and will throw.
  const data = JSON.parse(JSON.stringify(restorePayload.value))

  if (!confirm(`This will replace ALL current data with the backup (${data.vos.length} variations). Continue?`)) return
  restoring.value      = true
  restoreError.value   = null
  restoreSuccess.value = null
  try {
    // 1. Clear IndexedDB
    await clearAllData()

    // 2. Re-insert all VOs (preserve original IDs, createdAt)
    if (data.vos.length > 0) await bulkInsertVOs(data.vos)

    // 3. Restore localStorage — invoice prep IDs
    localStorage.setItem('invoicePrepIds', JSON.stringify(data.invoicePrepIds || []))

    // 4. Restore admin data
    if (data.adminData) localStorage.setItem('globalData', JSON.stringify(data.adminData))

    // 5. Restore activity log
    if (data.activityLog) localStorage.setItem('voActivityLog', JSON.stringify(data.activityLog))

    // 6. Reload store — VOs first, then sync the invoicePrepIds ref from localStorage
    await store.loadAllVOs()
    store.reloadInvoicePrepIds()

    restoreSuccess.value = `Restore complete — ${data.vos.length} variations, ${(data.invoicePrepIds || []).length} invoice prep items, and admin data restored.`
    restorePreview.value = null
    restorePayload.value = null
    if (restoreFileInput.value) restoreFileInput.value.value = ''
  } catch (e) {
    restoreError.value = 'Restore failed: ' + e.message
  } finally {
    restoring.value = false
  }
}

// ── column meta ──
const requiredCols = ['Site ID', 'VO Description', 'VO Amount']
const optionalCols = [
  'Site Name', 'Job Number', 'VO Category', 'Scope', 'BOQ Related',
  'Email Sent to Nokia', 'Email Approved from Nokia',
  'Ticket Submission Date', 'Ticket Number', 'Ticket Approval Date',
  'VO Status', 'Comment',
  'PO Number', 'PO Received Date',
]

// ── state ──
const previewData     = ref(null)
const importing       = ref(false)
const importError     = ref(null)
const importSuccess   = ref(null)
const exportMessage   = ref(null)
const exportMessageType = ref(null)
const selectedFileName = ref(null)
const dragOver        = ref(false)
const fileInput       = ref(null)

// ── helpers ──
const statusClass = (status) => {
  const map = {
    approved:         'bg-blue-100 text-green-700',
    rejected:         'bg-red-100 text-red-700',
    'pending-approval': 'bg-yellow-100 text-yellow-700',
    submitted:        'bg-blue-100 text-blue-700',
    draft:            'bg-gray-100 text-gray-600',
  }
  return map[status] || 'bg-gray-100 text-gray-600'
}

const clearFile = () => {
  previewData.value = null
  importError.value = null
  importSuccess.value = null
  selectedFileName.value = null
  if (fileInput.value) fileInput.value.value = ''
}

const processFile = async (file) => {
  clearFile()
  selectedFileName.value = file.name
  try {
    previewData.value = await importFromFile(file, store.vos.value || [])
  } catch (err) {
    importError.value = err.message
  }
}

const handleFileSelect = (e) => {
  const file = e.target.files?.[0]
  if (file) processFile(file)
}

const onDrop = (e) => {
  dragOver.value = false
  const file = e.dataTransfer.files?.[0]
  if (file) processFile(file)
}

// ── import ──
const importData = async () => {
  if (!previewData.value) return
  importing.value = true
  importError.value = null
  importSuccess.value = null
  try {
    await store.importVOs(previewData.value.vos)
    const count = previewData.value.vos.length
    importSuccess.value = `${count} record${count !== 1 ? 's' : ''} added. Database now has ${store.vos.value?.length || 0} total records.`
    previewData.value = null
    selectedFileName.value = null
    if (fileInput.value) fileInput.value.value = ''
  } catch (err) {
    importError.value = err.message
  } finally {
    importing.value = false
  }
}

// ── export ──
const showExportMsg = (msg, type) => {
  exportMessage.value = msg
  exportMessageType.value = type
  setTimeout(() => { exportMessage.value = null }, 3000)
}

const exportExcel = () => {
  try   { exportToExcel(store.vos.value || []); showExportMsg('Excel file downloaded successfully', 'success') }
  catch (e) { showExportMsg('Export failed: ' + e.message, 'error') }
}

const exportCSV = () => {
  try   { exportToCSV(store.vos.value || []); showExportMsg('CSV file downloaded successfully', 'success') }
  catch (e) { showExportMsg('Export failed: ' + e.message, 'error') }
}

// ── Invoice Status Import ──
const invFileInput  = ref(null)
const invDragOver   = ref(false)
const invFileName   = ref(null)
const invError      = ref(null)
const invDiffs      = ref([])   // [{ voId, poNumber, voDescription, voAmount, currentStatus, newStatus, invoiceDate, selected }]
const invNoDiffs    = ref(false)
const invApplying   = ref(false)
const invSuccess    = ref(null)

const invSelectedCount = computed(() => invDiffs.value.filter(d => d.selected).length)

const invStatusClass = (status) => {
  if (!status) return 'bg-gray-100 text-gray-400'
  const map = {
    'Not Yet Sent':        'bg-gray-100 text-gray-500',
    'To Be Sent to Nokia': 'bg-indigo-100 text-indigo-700',
    'Request to Nokia':    'bg-blue-100 text-blue-700',
    'SIT Approved':        'bg-yellow-100 text-yellow-700',
    'SIT Completed':       'bg-green-100 text-green-700',
  }
  return map[status] || 'bg-gray-100 text-gray-500'
}

const clearInvoiceImport = () => {
  invFileName.value  = null
  invError.value     = null
  invDiffs.value     = []
  invNoDiffs.value   = false
  invSuccess.value   = null
  if (invFileInput.value) invFileInput.value.value = ''
}

const parseInvoiceImportFile = async (file) => {
  clearInvoiceImport()
  invFileName.value = file.name
  try {
    const data = await file.arrayBuffer()
    const wb   = XLSX.read(data)
    const ws   = wb.Sheets[wb.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(ws, { defval: '' })
    if (rows.length === 0) throw new Error('No data rows found in the file')

    // Flexible column name resolver
    const getVal = (row, candidates) => {
      for (const name of candidates) {
        const key = Object.keys(row).find(k =>
          k.trim().toLowerCase().replace(/\s+/g, '') === name.toLowerCase().replace(/\s+/g, ''))
        if (key !== undefined && row[key] !== '') return String(row[key]).trim()
      }
      return null
    }

    // Validate required columns exist
    const first = rows[0]
    const hasPO     = !!getVal(first, ['PO Number', 'ponumber', 'po'])
    const hasStatus = getVal(first, ['Invoice Status', 'invoicestatus']) !== null ||
                      Object.keys(first).some(k => k.trim().toLowerCase().includes('invoice') && k.trim().toLowerCase().includes('status'))
    if (!hasPO && !hasStatus) throw new Error('File must contain at least a "PO Number" column')

    const diffs = []
    for (const row of rows) {
      const poNumber  = getVal(row, ['PO Number', 'ponumber', 'po'])
      const newStatus = getVal(row, ['Invoice Status', 'invoicestatus'])
      const rawAmt    = getVal(row, ['VO Amount', 'voamount', 'amount'])
      const voAmount  = rawAmt ? parseFloat(rawAmt) : null

      if (!poNumber) continue  // skip rows with no PO number

      // Match existing VOs by PO number only (amount mismatch shown as warning, not excluded)
      const matches = (store.vos.value || []).filter(vo => {
        const voPO = vo.poNumber?.toString().trim()
        return voPO && voPO.toLowerCase() === poNumber.toLowerCase()
      })

      for (const vo of matches) {
        const currentStatus   = vo.invoiceStatus || ''
        const incoming        = newStatus || ''
        const amountMismatch  = voAmount !== null && !isNaN(voAmount) && Math.abs((vo.voAmount || 0) - voAmount) > 0.01
        const statusChanged   = currentStatus !== incoming
        if (!statusChanged && !amountMismatch) continue  // truly no change
        // Avoid duplicate entries (same voId may appear if import has repeated rows)
        if (diffs.some(d => d.voId === vo.id)) continue
        const today = new Date().toISOString().slice(0, 10)
        diffs.push({
          voId:           vo.id,
          siteId:         vo.siteId || '',
          poNumber,
          voDescription:  vo.voDescription || '',
          voAmount:       vo.voAmount || 0,
          importedAmount: amountMismatch ? voAmount : null,
          amountMismatch,
          currentStatus,
          newStatus:      incoming,
          invoiceDate:    incoming && incoming !== 'Not Yet Sent' ? (vo.invoiceDate ? (typeof vo.invoiceDate === 'string' ? vo.invoiceDate.slice(0, 10) : new Date(vo.invoiceDate).toISOString().slice(0, 10)) : today) : '',
          selected:       true,
        })
      }
    }

    if (diffs.length === 0) {
      invNoDiffs.value = true
    } else {
      invDiffs.value = diffs
    }
  } catch (err) {
    invError.value = err.message
    invFileName.value = null
  }
}

const handleInvoiceFileSelect = (e) => {
  const file = e.target.files?.[0]
  if (file) parseInvoiceImportFile(file)
}

const onInvoiceDrop = (e) => {
  invDragOver.value = false
  const file = e.dataTransfer.files?.[0]
  if (file) parseInvoiceImportFile(file)
}

const applyInvoiceUpdates = async () => {
  const toUpdate = invDiffs.value.filter(d => d.selected)
  if (toUpdate.length === 0) return
  invApplying.value = true
  invSuccess.value  = null
  try {
    const now = new Date().toISOString()
    for (const diff of toUpdate) {
      const vo = (store.vos.value || []).find(v => v.id === diff.voId)
      if (!vo) continue
      const logEntry   = { status: diff.newStatus, date: diff.invoiceDate || null, loggedAt: now, source: 'import' }
      const invoiceLog = [...(vo.invoiceLog || []), logEntry]
      const patch = { invoiceStatus: diff.newStatus || null, invoiceLog }
      if (diff.newStatus && diff.newStatus !== 'Not Yet Sent') patch.invoiceDate = diff.invoiceDate || null
      else patch.invoiceDate = null
      if (diff.amountMismatch && diff.importedAmount !== null) patch.voAmount = diff.importedAmount
      await store.editVO(diff.voId, { ...vo, ...patch })
    }
    const amtUpdated = toUpdate.filter(d => d.amountMismatch).length
    invSuccess.value = `${toUpdate.length} row${toUpdate.length !== 1 ? 's' : ''} updated successfully${amtUpdated ? ` (${amtUpdated} amount${amtUpdated !== 1 ? 's' : ''} also updated)` : ''}.`
    invDiffs.value   = []
    invNoDiffs.value = false
    invFileName.value = null
    if (invFileInput.value) invFileInput.value.value = ''
    setTimeout(() => { invSuccess.value = null }, 5000)
  } catch (err) {
    invError.value = 'Update failed: ' + err.message
  } finally {
    invApplying.value = false
  }
}

// ── Amount Change Import ──
const amtFileInput = ref(null)
const amtDragOver  = ref(false)
const amtFileName  = ref(null)
const amtError     = ref(null)
const amtDiffs     = ref([])   // [{ voId, poNumber, voDescription, currentAmount, newAmount, selected }]
const amtNoDiffs   = ref(false)
const amtApplying  = ref(false)
const amtSuccess   = ref(null)

const amtSelectedCount = computed(() => amtDiffs.value.filter(d => d.selected).length)

const clearAmountImport = () => {
  amtFileName.value = null
  amtError.value    = null
  amtDiffs.value    = []
  amtNoDiffs.value  = false
  amtSuccess.value  = null
  if (amtFileInput.value) amtFileInput.value.value = ''
}

const parseAmountImportFile = async (file) => {
  clearAmountImport()
  amtFileName.value = file.name
  try {
    const data = await file.arrayBuffer()
    const wb   = XLSX.read(data)
    const ws   = wb.Sheets[wb.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(ws, { defval: '' })
    if (rows.length === 0) throw new Error('No data rows found in the file')

    const getVal = (row, candidates) => {
      for (const name of candidates) {
        const key = Object.keys(row).find(k =>
          k.trim().toLowerCase().replace(/\s+/g, '') === name.toLowerCase().replace(/\s+/g, ''))
        if (key !== undefined && row[key] !== '') return String(row[key]).trim()
      }
      return null
    }

    const first = rows[0]
    const hasPO = !!getVal(first, ['PO Number', 'ponumber', 'po'])
    if (!hasPO) throw new Error('File must contain a "PO Number" column')

    const diffs = []
    for (const row of rows) {
      const poNumber  = getVal(row, ['PO Number', 'ponumber', 'po'])
      const finalRaw  = getVal(row, ['Final VO Amount', 'finalvoamount', 'finalamount', 'new amount', 'newamount'])
      if (!poNumber || finalRaw === null) continue

      const newAmount = parseFloat(finalRaw)
      if (isNaN(newAmount)) continue

      const matches = (store.vos.value || []).filter(vo => {
        const voPO = vo.poNumber?.toString().trim()
        return voPO && voPO.toLowerCase() === poNumber.toLowerCase()
      })

      for (const vo of matches) {
        const currentAmount = vo.voAmount || 0
        if (Math.abs(currentAmount - newAmount) < 0.01) continue
        if (diffs.some(d => d.voId === vo.id)) continue
        diffs.push({
          voId:          vo.id,
          poNumber,
          voDescription: vo.voDescription || '',
          currentAmount,
          newAmount,
          selected:      true,
        })
      }
    }

    if (diffs.length === 0) amtNoDiffs.value = true
    else amtDiffs.value = diffs
  } catch (err) {
    amtError.value    = err.message
    amtFileName.value = null
  }
}

const handleAmountFileSelect = (e) => {
  const file = e.target.files?.[0]
  if (file) parseAmountImportFile(file)
}

const onAmountDrop = (e) => {
  amtDragOver.value = false
  const file = e.dataTransfer.files?.[0]
  if (file) parseAmountImportFile(file)
}

const applyAmountUpdates = async () => {
  const toUpdate = amtDiffs.value.filter(d => d.selected)
  if (toUpdate.length === 0) return
  amtApplying.value = true
  amtSuccess.value  = null
  try {
    for (const diff of toUpdate) {
      const vo = (store.vos.value || []).find(v => v.id === diff.voId)
      if (!vo) continue
      // Use same amountLog structure as InvoiceList final-value change
      const initialAmt = vo.amountLog?.length ? vo.amountLog[0].from : (vo.voAmount || 0)
      const delta      = diff.newAmount - initialAmt
      const amountLog  = [...(vo.amountLog || []), {
        from:     initialAmt,
        to:       diff.newAmount,
        delta,
        loggedAt: new Date().toISOString(),
        source:   'amount-import',
      }]
      await store.editVO(diff.voId, { ...vo, voAmount: diff.newAmount, amountChangeFlag: true, amountLog })
    }
    amtSuccess.value = `${toUpdate.length} VO amount${toUpdate.length !== 1 ? 's' : ''} updated successfully.`
    amtDiffs.value    = []
    amtNoDiffs.value  = false
    amtFileName.value = null
    if (amtFileInput.value) amtFileInput.value.value = ''
    setTimeout(() => { amtSuccess.value = null }, 5000)
  } catch (err) {
    amtError.value = 'Update failed: ' + err.message
  } finally {
    amtApplying.value = false
  }
}

const downloadAmountTemplate = () => {
  const headers = ['PO Number', 'Initial VO Amount', 'Final VO Amount']
  const sample  = ['PO-98765', '5000', '7500']
  const note    = ['', 'Current amount (for reference)', 'New amount to apply']
  const ws = XLSX.utils.aoa_to_sheet([headers, sample, note])
  ws['!cols'] = [{ wch: 20 }, { wch: 20 }, { wch: 20 }]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Amount Change Import')
  XLSX.writeFile(wb, 'Amount_Change_Import_Template.xlsx')
}

const downloadInvoiceTemplate = () => {
  const headers = ['PO Number', 'VO Amount', 'Invoice Status']
  const sample  = ['PO-98765', '5000', 'SIT Approved']
  const note    = ['', '', 'Valid values: To Be Sent to Nokia | Request to Nokia | SIT Approved | SIT Completed']
  const ws = XLSX.utils.aoa_to_sheet([headers, sample, note])
  ws['!cols'] = [{ wch: 20 }, { wch: 14 }, { wch: 34 }]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Invoice Status Import')
  XLSX.writeFile(wb, 'Invoice_Status_Import_Template.xlsx')
}

// ── template ──
const downloadTemplate = () => {
  const headers = [
    'Site ID', 'Site Name', 'Job Number',
    'VO Description', 'VO Amount', 'VO Category', 'Scope', 'BOQ Related',
    'Email Sent to Nokia', 'Email Approved from Nokia',
    'Ticket Submission Date', 'Ticket Number', 'Ticket Approval Date',
    'VO Status', 'Comment',
    'PO Number', 'PO Received Date', 'Invoice Status', 'Invoice Date', 'Amount Change Flag',
  ]
  // Sample row with hints for each column
  const sample = [
    'R07', 'Glen Iris', 'JOB-001',
    'Example VO description', '5000', 'Civil Works', 'Structural', 'No',
    '2024-01-15', '2024-02-20',
    '2024-01-10', 'TK-12345', '2024-02-25',
    'draft', 'Optional notes here',
    'PO-98765', '2024-02-28', 'SIT Approved', '2024-03-01', 'No',
  ]
  const ws = XLSX.utils.aoa_to_sheet([headers, sample])
  ws['!cols'] = headers.map(h => ({ wch: Math.max(h.length + 4, 16) }))
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Variation Orders')
  XLSX.writeFile(wb, 'VO_Import_Template.xlsx')
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s }
.fade-enter-from, .fade-leave-to { opacity: 0 }
</style>
