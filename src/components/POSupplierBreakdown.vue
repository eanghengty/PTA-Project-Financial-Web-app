<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between pb-2 border-b border-gray-100 gap-4 flex-wrap">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center">
          <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">PO to Supplier Breakdown</h2>
          <p class="text-xs text-gray-400 mt-0.5">Sync jobs from Variations and track supplier-level PO splits by job</p>
        </div>
      </div>

      <div class="flex items-center gap-2 flex-wrap">
        <span v-if="lastSyncedAt" class="text-xs text-gray-500 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg">
          Last sync: {{ formatDate(lastSyncedAt) }}
        </span>
        <button
          @click="syncJobsFromVariations"
          class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9M20 20v-5h-.581m0 0a8.003 8.003 0 01-15.357-2M20 15H15" />
          </svg>
          Sync Jobs from Variations
        </button>
      </div>
    </div>

    <div v-if="syncMessage" class="px-4 py-3 rounded-xl border text-sm"
      :class="syncMessage.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700'">
      {{ syncMessage.text }}
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-3">
      <div class="bg-white border border-gray-200 rounded-xl px-4 py-3">
        <p class="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">Jobs</p>
        <p class="text-2xl font-bold text-gray-900 mt-1">{{ jobs.length }}</p>
      </div>
      <div class="bg-teal-50 border border-teal-200 rounded-xl px-4 py-3">
        <p class="text-[11px] uppercase tracking-wider text-teal-600 font-semibold">PO Entries</p>
        <p class="text-2xl font-bold text-teal-700 mt-1">{{ totalEntries }}</p>
      </div>
      <div class="bg-teal-50 border border-teal-200 rounded-xl px-4 py-3">
        <p class="text-[11px] uppercase tracking-wider text-teal-600 font-semibold">Supplier PO Total</p>
        <p class="text-2xl font-bold text-teal-700 mt-1">{{ formatCompact(totalAmount) }}</p>
        <p class="text-xs text-gray-500 mt-1">{{ formatCurrency(totalAmount) }}</p>
      </div>
      <div class="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
        <p class="text-[11px] uppercase tracking-wider text-blue-600 font-semibold">3rd Party VO Total</p>
        <p class="text-2xl font-bold text-blue-700 mt-1">{{ formatCompact(totalThirdPartyVOAmount) }}</p>
        <p class="text-xs text-gray-500 mt-1">{{ formatCurrency(totalThirdPartyVOAmount) }}</p>
      </div>
      <div class="rounded-xl px-4 py-3 border" :class="criticalGapCardClass(totalCriticalGap)">
        <p class="text-[11px] uppercase tracking-wider font-semibold">Critical Gap (PO &gt; VO)</p>
        <p class="text-2xl font-bold mt-1">{{ formatCurrency(totalCriticalGap) }}</p>
        <p class="text-xs mt-1">
          <span v-if="criticalJobsCount > 0">{{ criticalJobsCount }} job{{ criticalJobsCount === 1 ? '' : 's' }} need extra claim from customer.</span>
          <span v-else>No critical shortfall.</span>
        </p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl px-4 py-3">
        <p class="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">With Breakdown</p>
        <p class="text-2xl font-bold text-gray-900 mt-1">{{ jobsWithEntries }}</p>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-4 py-3 border-b border-gray-200 flex items-center gap-3">
        <input
          v-model.trim="searchText"
          type="text"
          placeholder="Search by Site ID, Site Name, Job #, PO number, supplier, category, or comment..."
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span class="text-xs text-gray-500 font-medium whitespace-nowrap">{{ filteredJobs.length }} result{{ filteredJobs.length === 1 ? '' : 's' }}</span>
      </div>

      <div v-if="jobs.length === 0" class="px-6 py-12 text-center">
        <div class="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p class="text-sm font-semibold text-gray-700">No jobs synced yet</p>
        <p class="text-xs text-gray-500 mt-1">Click "Sync Jobs from Variations" to import Job #, Site ID, and Site Name.</p>
      </div>

      <div v-else-if="filteredJobs.length === 0" class="px-6 py-12 text-center">
        <p class="text-sm text-gray-500">No jobs match your search.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="bg-teal-700 text-white">
              <th class="px-4 py-3 text-left font-semibold">Site ID</th>
              <th class="px-4 py-3 text-left font-semibold">Site Name</th>
              <th class="px-4 py-3 text-left font-semibold">Job #</th>
              <th class="px-4 py-3 text-center font-semibold">PO Entries</th>
              <th class="px-4 py-3 text-right font-semibold">3rd Party VO</th>
              <th class="px-4 py-3 text-right font-semibold">Supplier PO</th>
              <th class="px-4 py-3 text-right font-semibold">Critical Gap</th>
              <th class="px-4 py-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <template v-for="job in filteredJobs" :key="job.key">
              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{{ job.siteId || '-' }}</td>
                <td class="px-4 py-3 text-gray-800 whitespace-nowrap">{{ job.siteName || '-' }}</td>
                <td class="px-4 py-3 text-gray-700 whitespace-nowrap">{{ job.jobNumber || '-' }}</td>
                <td class="px-4 py-3 text-center">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-700">
                    {{ job.entries.length }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right font-semibold text-blue-700 whitespace-nowrap">{{ formatCurrency(jobVOThirdPartyTotal(job)) }}</td>
                <td class="px-4 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">{{ formatCurrency(jobTotal(job)) }}</td>
                <td class="px-4 py-3 text-right whitespace-nowrap">
                  <template v-if="jobCriticalGap(job) > 0">
                    <span class="font-semibold text-red-700">{{ formatCurrency(jobCriticalGap(job)) }}</span>
                    <div class="text-[10px] font-semibold text-red-600 uppercase tracking-wider">Critical</div>
                  </template>
                  <span v-else class="text-gray-400">-</span>
                </td>
                <td class="px-4 py-3 text-center whitespace-nowrap">
                  <button
                    @click="openEntryModal(job)"
                    class="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold mr-2"
                  >
                    Add PO Breakdown
                  </button>
                  <button
                    @click="toggleExpanded(job.key)"
                    class="px-3 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold"
                  >
                    {{ expandedJobs[job.key] ? 'Hide' : 'View' }}
                  </button>
                </td>
              </tr>

              <tr v-if="expandedJobs[job.key]">
                <td colspan="8" class="px-4 py-4 bg-gray-50">
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    <div class="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2">
                      <p class="text-[10px] uppercase tracking-wider text-blue-600 font-semibold">3rd Party VO</p>
                      <p class="text-sm font-bold text-blue-700 mt-0.5">{{ formatCurrency(jobVOThirdPartyTotal(job)) }}</p>
                    </div>
                    <div class="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2">
                      <p class="text-[10px] uppercase tracking-wider text-teal-600 font-semibold">Supplier PO</p>
                      <p class="text-sm font-bold text-teal-700 mt-0.5">{{ formatCurrency(jobTotal(job)) }}</p>
                    </div>
                    <div class="rounded-lg border px-3 py-2" :class="criticalGapPanelClass(jobCriticalGap(job))">
                      <p class="text-[10px] uppercase tracking-wider font-semibold">Critical Gap (PO &gt; VO)</p>
                      <p class="text-sm font-bold mt-0.5">{{ formatCurrency(jobCriticalGap(job)) }}</p>
                    </div>
                  </div>

                  <div v-if="jobCategoryComparisons(job).length > 0" class="mb-4 overflow-x-auto">
                    <table class="min-w-full text-xs border border-gray-200 rounded-lg overflow-hidden">
                      <thead class="bg-blue-50 text-blue-700 uppercase tracking-wider">
                        <tr>
                          <th class="px-3 py-2 text-left font-semibold">PO Supplier Category</th>
                          <th class="px-3 py-2 text-right font-semibold">3rd Party VO</th>
                          <th class="px-3 py-2 text-right font-semibold">Supplier PO</th>
                          <th class="px-3 py-2 text-right font-semibold">Critical Gap</th>
                          <th class="px-3 py-2 text-left font-semibold">Summary Comment</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-200 bg-white">
                        <tr v-for="row in jobCategoryComparisons(job)" :key="`${job.key}-${row.category}`" class="hover:bg-gray-50">
                          <td class="px-3 py-2 text-gray-800">{{ row.category }}</td>
                          <td class="px-3 py-2 text-right font-semibold text-blue-700 whitespace-nowrap">{{ formatCurrency(row.voAmount) }}</td>
                          <td class="px-3 py-2 text-right font-semibold text-gray-900 whitespace-nowrap">{{ formatCurrency(row.supplierAmount) }}</td>
                          <td class="px-3 py-2 text-right whitespace-nowrap">
                            <span
                              class="font-semibold"
                              :class="criticalGapTextClass(rowCriticalGap(row))"
                            >
                              {{ rowCriticalGap(row) > 0 ? formatCurrency(rowCriticalGap(row)) : '-' }}
                            </span>
                          </td>
                          <td class="px-3 py-2 text-gray-700 min-w-[220px]">
                            <input
                              type="text"
                              :value="getCategorySummaryComment(job, row.category)"
                              @change="setCategorySummaryComment(job.key, row.category, $event.target.value)"
                              placeholder="Add category comment..."
                              class="w-full px-2.5 py-1.5 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div v-if="job.entries.length === 0" class="text-xs text-gray-500">
                    No PO breakdown entries yet for this job.
                  </div>
                  <div v-else class="space-y-3">
                    <div class="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
                      <div class="text-xs text-gray-600">
                        Selected: <span class="font-semibold text-gray-900">{{ selectedEntryCount(job) }}</span>
                        <span class="mx-1 text-gray-300">|</span>
                        Subtotal:
                        <span class="font-semibold text-blue-700">{{ formatCurrency(selectedEntrySubtotal(job)) }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <button
                          @click="selectAllEntriesForJob(job)"
                          class="px-2.5 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold"
                        >
                          Select All
                        </button>
                        <button
                          @click="clearSelectedEntriesForJob(job.key)"
                          :disabled="selectedEntryCount(job) === 0"
                          class="px-2.5 py-1 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    <div class="overflow-x-auto">
                      <table class="min-w-full text-xs border border-gray-200 rounded-lg overflow-hidden">
                        <thead class="bg-gray-100 text-gray-700 uppercase tracking-wider">
                          <tr>
                            <th class="px-3 py-2 text-center font-semibold w-10">
                              <input
                                type="checkbox"
                                :checked="areAllEntriesSelected(job)"
                                @change="toggleSelectAllEntriesForJob(job)"
                                class="w-4 h-4 rounded border-gray-300 cursor-pointer accent-blue-600"
                                title="Select all rows"
                              />
                            </th>
                            <th class="px-3 py-2 text-left font-semibold">PO Number</th>
                            <th class="px-3 py-2 text-left font-semibold">Supplier</th>
                            <th class="px-3 py-2 text-left font-semibold">Category</th>
                            <th class="px-3 py-2 text-right font-semibold">Amount</th>
                            <th class="px-3 py-2 text-left font-semibold">Comment</th>
                            <th class="px-3 py-2 text-left font-semibold">Updated</th>
                            <th class="px-3 py-2 text-center font-semibold w-32">Actions</th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 bg-white">
                          <tr v-for="entry in job.entries" :key="entry.id" class="hover:bg-gray-50">
                            <td class="px-3 py-2 text-center">
                              <input
                                type="checkbox"
                                :checked="isEntrySelected(job.key, entry.id)"
                                @change="toggleEntrySelection(job.key, entry.id)"
                                class="w-4 h-4 rounded border-gray-300 cursor-pointer accent-blue-600"
                              />
                            </td>
                            <td class="px-3 py-2 font-mono text-gray-800 whitespace-nowrap">{{ entry.poNumber }}</td>
                            <td class="px-3 py-2 text-gray-800 whitespace-nowrap">{{ entry.supplier }}</td>
                            <td class="px-3 py-2 text-gray-700 whitespace-nowrap">{{ entry.category || '-' }}</td>
                            <td class="px-3 py-2 text-right font-semibold text-gray-900 whitespace-nowrap">{{ formatCurrency(entry.amount) }}</td>
                            <td class="px-3 py-2 text-gray-600 max-w-sm">
                              <div class="truncate" :title="entry.comment || ''">{{ entry.comment || '-' }}</div>
                            </td>
                            <td class="px-3 py-2 text-gray-500 whitespace-nowrap">{{ formatDate(entry.updatedAt || entry.createdAt) }}</td>
                            <td class="px-3 py-2 text-center whitespace-nowrap">
                              <button @click="openEntryModal(job, entry)" class="px-2 py-1 rounded text-blue-600 hover:bg-blue-50 font-semibold">Edit</button>
                              <button @click="removeEntry(job.key, entry.id)" class="px-2 py-1 rounded text-red-600 hover:bg-red-50 font-semibold">Delete</button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showEntryModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="closeEntryModal">
      <div class="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div class="px-6 py-4 bg-blue-700 flex items-center justify-between">
          <div>
            <h3 class="text-white font-bold text-base">{{ editingEntryId ? 'Edit PO Breakdown' : 'Add PO Breakdown' }}</h3>
            <p class="text-xs text-blue-100 mt-0.5">
              {{ entryContext.siteId || '-' }} | {{ entryContext.siteName || '-' }} | {{ entryContext.jobNumber || '-' }}
            </p>
          </div>
          <button @click="closeEntryModal" class="w-8 h-8 rounded-lg text-blue-100 hover:bg-blue-600 hover:text-white">
            <svg class="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveEntry" class="p-6 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">PO Number *</label>
              <input
                v-model.trim="entryForm.poNumber"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Supplier *</label>
              <input
                v-model.trim="entryForm.supplier"
                type="text"
                required
                list="po-supplier-options"
                placeholder="Select supplier..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <datalist id="po-supplier-options">
                <option v-for="supplier in supplierOptions" :key="supplier.name" :value="supplier.name"></option>
              </datalist>
              <p class="text-[11px] text-gray-400 mt-1">Suppliers come from Admin > PO Suppliers.</p>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Category *</label>
              <select
                v-model="entryForm.category"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="" disabled>{{ categoryOptions.length ? 'Select category...' : 'No categories in Admin' }}</option>
                <option v-for="cat in categoryOptions" :key="cat.name" :value="cat.name">
                  {{ cat.name }}
                </option>
              </select>
              <p class="text-[11px] text-gray-400 mt-1">Categories come from Admin > PO Supplier Categories.</p>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Amount (Base) *</label>
            <input
              v-model.number="entryForm.amount"
              type="number"
              min="0"
              step="0.01"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p class="text-[11px] text-gray-400 mt-1">
              PO amount with 10% markup: <span class="font-semibold text-teal-700">{{ formatCurrency(entryMarkedUpAmount) }}</span>
            </p>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Comment</label>
            <textarea
              v-model.trim="entryForm.comment"
              rows="4"
              placeholder="Optional note"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            ></textarea>
          </div>

          <div v-if="modalError" class="px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {{ modalError }}
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button type="button" @click="closeEntryModal" class="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" class="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700">
              {{ editingEntryId ? 'Save Changes' : 'Add Breakdown' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useVOStore } from '../stores/voStore'
import { formatCompact, formatCurrency, formatDate } from '../utils/formatters'

const STORAGE_KEY = 'poSupplierBreakdownData'
const THIRD_PARTY_CATEGORY_KEY = 'third party'
const UNASSIGNED_CATEGORY = 'Unassigned'
const PO_MARKUP_RATE = 0.1

const store = useVOStore()

const jobs = ref([])
const lastSyncedAt = ref(null)
const syncMessage = ref(null)
const searchText = ref('')
const expandedJobs = ref({})
const selectedEntryIdsByJob = ref({})
const categoryOptions = ref([])
const supplierOptions = ref([])

const showEntryModal = ref(false)
const editingEntryId = ref(null)
const entryJobKey = ref('')
const modalError = ref('')
const entryForm = ref({
  poNumber: '',
  supplier: '',
  category: '',
  amount: 0,
  comment: '',
})

const entryMarkedUpAmount = computed(() => applyPOMarkup(entryForm.value.amount))

function normalize(value) {
  return String(value ?? '').trim()
}

function toAmount(value) {
  const amount = Number(value)
  return Number.isFinite(amount) ? amount : 0
}

function applyPOMarkup(baseAmount) {
  const markedUp = toAmount(baseAmount) * (1 + PO_MARKUP_RATE)
  return Math.round((markedUp + Number.EPSILON) * 100) / 100
}

function normalizeCategory(value) {
  return normalize(value) || UNASSIGNED_CATEGORY
}

function isThirdPartyVO(vo) {
  return normalize(vo?.voCategory).toLowerCase() === THIRD_PARTY_CATEGORY_KEY
}

function makeJobKey({ siteId, siteName, jobNumber }) {
  return [siteId, siteName, jobNumber].map(v => normalize(v).toLowerCase()).join('|')
}

function makeId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  return `po_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

function sanitizeEntry(rawEntry) {
  const legacyAmount = toAmount(rawEntry?.amount)
  const rawAmount = rawEntry?.rawAmount !== undefined && rawEntry?.rawAmount !== null && rawEntry?.rawAmount !== ''
    ? toAmount(rawEntry.rawAmount)
    : legacyAmount
  const alreadyMarkedUp = rawEntry?.markupApplied === true
  const finalAmount = alreadyMarkedUp ? legacyAmount : applyPOMarkup(rawAmount)

  return {
    id: normalize(rawEntry?.id) || makeId(),
    poNumber: normalize(rawEntry?.poNumber),
    supplier: normalize(rawEntry?.supplier),
    category: normalize(rawEntry?.category),
    rawAmount,
    amount: finalAmount,
    markupApplied: true,
    comment: normalize(rawEntry?.comment),
    createdAt: rawEntry?.createdAt || new Date().toISOString(),
    updatedAt: rawEntry?.updatedAt || rawEntry?.createdAt || new Date().toISOString(),
  }
}

function loadCategoryOptions() {
  try {
    const data = JSON.parse(localStorage.getItem('globalData') || '{}')
    const raw = Array.isArray(data.poSupplierCategories) ? data.poSupplierCategories : []
    const mapped = raw.map(item => {
      if (typeof item === 'string') return { name: normalize(item), comment: '' }
      return {
        name: normalize(item?.name),
        comment: normalize(item?.comment),
      }
    })
    categoryOptions.value = mapped
      .filter(item => item.name)
      .sort((a, b) => a.name.localeCompare(b.name))
  } catch {
    categoryOptions.value = []
  }
}

function loadSupplierOptions() {
  try {
    const data = JSON.parse(localStorage.getItem('globalData') || '{}')
    const raw = Array.isArray(data.poSuppliers) ? data.poSuppliers : []
    const mapped = raw.map(item => {
      if (typeof item === 'string') return { name: normalize(item) }
      return { name: normalize(item?.name) }
    })
    const seen = new Set()
    supplierOptions.value = mapped
      .filter(item => item.name)
      .filter(item => {
        const key = item.name.toLowerCase()
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      .sort((a, b) => a.name.localeCompare(b.name))
  } catch {
    supplierOptions.value = []
  }
}

function sanitizeJob(rawJob) {
  const siteId = normalize(rawJob?.siteId)
  const siteName = normalize(rawJob?.siteName)
  const jobNumber = normalize(rawJob?.jobNumber)
  const categorySummaryComments = {}
  const rawComments = rawJob?.categorySummaryComments && typeof rawJob.categorySummaryComments === 'object'
    ? rawJob.categorySummaryComments
    : {}
  for (const [key, value] of Object.entries(rawComments)) {
    const k = normalize(key)
    const v = normalize(value)
    if (k && v) categorySummaryComments[k] = v
  }
  return {
    key: makeJobKey({ siteId, siteName, jobNumber }),
    siteId,
    siteName,
    jobNumber,
    entries: Array.isArray(rawJob?.entries) ? rawJob.entries.map(sanitizeEntry) : [],
    categorySummaryComments,
    createdAt: rawJob?.createdAt || new Date().toISOString(),
    updatedAt: rawJob?.updatedAt || rawJob?.createdAt || new Date().toISOString(),
  }
}

function loadStorage() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    const rawJobs = Array.isArray(parsed) ? parsed : (Array.isArray(parsed.jobs) ? parsed.jobs : [])
    jobs.value = rawJobs
      .map(sanitizeJob)
      .filter(job => job.siteId || job.siteName || job.jobNumber)
      .sort(sortJobs)
    lastSyncedAt.value = Array.isArray(parsed) ? null : parsed.lastSyncedAt || null
  } catch {
    jobs.value = []
    lastSyncedAt.value = null
  }
}

function saveStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    jobs: jobs.value,
    lastSyncedAt: lastSyncedAt.value,
  }))
}

function sortJobs(a, b) {
  const siteCmp = (a.siteName || a.siteId || '').localeCompare(b.siteName || b.siteId || '')
  if (siteCmp !== 0) return siteCmp
  return (a.jobNumber || '').localeCompare(b.jobNumber || '')
}

function syncJobsFromVariations() {
  const incoming = new Map()

  for (const vo of (store.vos.value || [])) {
    const siteId = normalize(vo.siteId)
    const siteName = normalize(vo.siteName)
    const jobNumber = normalize(vo.jobNumber)
    if (!siteId && !siteName && !jobNumber) continue

    const key = makeJobKey({ siteId, siteName, jobNumber })
    if (!incoming.has(key)) incoming.set(key, { key, siteId, siteName, jobNumber })
  }

  if (incoming.size === 0) {
    syncMessage.value = { type: 'warning', text: 'No jobs were found in Variation records to sync.' }
    return
  }

  const now = new Date().toISOString()
  const existingByKey = new Map(jobs.value.map(job => [job.key, job]))
  const nextJobs = [...jobs.value]
  let added = 0
  let updated = 0

  for (const synced of incoming.values()) {
    const existing = existingByKey.get(synced.key)
    if (!existing) {
      nextJobs.push({
        key: synced.key,
        siteId: synced.siteId,
        siteName: synced.siteName,
        jobNumber: synced.jobNumber,
        entries: [],
        createdAt: now,
        updatedAt: now,
      })
      added += 1
      continue
    }

    if (existing.siteId !== synced.siteId || existing.siteName !== synced.siteName || existing.jobNumber !== synced.jobNumber) {
      existing.siteId = synced.siteId
      existing.siteName = synced.siteName
      existing.jobNumber = synced.jobNumber
      existing.updatedAt = now
      updated += 1
    }
  }

  jobs.value = nextJobs.sort(sortJobs)
  lastSyncedAt.value = now
  saveStorage()

  syncMessage.value = {
    type: 'success',
    text: `Sync complete: ${added} new job${added !== 1 ? 's' : ''} added, ${updated} updated.`,
  }
}

const filteredJobs = computed(() => {
  const q = searchText.value.toLowerCase()
  if (!q) return jobs.value
  return jobs.value.filter(job => {
    const jobHit =
      job.siteId.toLowerCase().includes(q) ||
      job.siteName.toLowerCase().includes(q) ||
      job.jobNumber.toLowerCase().includes(q)
    if (jobHit) return true
    if (job.entries.some(entry =>
      entry.poNumber.toLowerCase().includes(q) ||
      entry.supplier.toLowerCase().includes(q) ||
      (entry.category || '').toLowerCase().includes(q) ||
      entry.comment.toLowerCase().includes(q)
    )) return true
    return jobCategoryComparisons(job).some(row => row.category.toLowerCase().includes(q))
  })
})

const totalEntries = computed(() => jobs.value.reduce((sum, job) => sum + job.entries.length, 0))
const totalAmount = computed(() => jobs.value.reduce((sum, job) => sum + job.entries.reduce((jobSum, entry) => jobSum + toAmount(entry.amount), 0), 0))
const jobsWithEntries = computed(() => jobs.value.filter(job => job.entries.length > 0).length)

const thirdPartyVOSummaryByJob = computed(() => {
  const summary = new Map()
  for (const vo of (store.vos.value || [])) {
    if (!isThirdPartyVO(vo)) continue
    const key = makeJobKey({
      siteId: normalize(vo.siteId),
      siteName: normalize(vo.siteName),
      jobNumber: normalize(vo.jobNumber),
    })
    const voAmount = toAmount(vo.voAmount)
    const category = normalizeCategory(vo.poSupplierCategory)
    if (!summary.has(key)) {
      summary.set(key, { total: 0, byCategory: {} })
    }
    const jobSummary = summary.get(key)
    jobSummary.total += voAmount
    jobSummary.byCategory[category] = (jobSummary.byCategory[category] || 0) + voAmount
  }
  return summary
})

const totalThirdPartyVOAmount = computed(() =>
  [...thirdPartyVOSummaryByJob.value.values()].reduce((sum, item) => sum + item.total, 0)
)

const totalCriticalGap = computed(() =>
  jobs.value.reduce((sum, job) => sum + jobCriticalGap(job), 0)
)

const criticalJobsCount = computed(() =>
  jobs.value.filter(job => jobCriticalGap(job) > 0).length
)

const entryContext = computed(() => jobs.value.find(job => job.key === entryJobKey.value) || {
  siteId: '',
  siteName: '',
  jobNumber: '',
})

function jobTotal(job) {
  return job.entries.reduce((sum, entry) => sum + toAmount(entry.amount), 0)
}

function jobThirdPartyVOSummary(job) {
  return thirdPartyVOSummaryByJob.value.get(job.key) || { total: 0, byCategory: {} }
}

function jobVOThirdPartyTotal(job) {
  return jobThirdPartyVOSummary(job).total
}

function calculateCriticalGap(supplierAmount, voAmount) {
  const diff = toAmount(supplierAmount) - toAmount(voAmount)
  return diff > 0 ? diff : 0
}

function jobCriticalGap(job) {
  return jobCategoryComparisons(job).reduce((sum, row) => sum + rowCriticalGap(row), 0)
}

function rowCriticalGap(row) {
  return calculateCriticalGap(row.supplierAmount, row.voAmount)
}

function criticalGapTextClass(amount) {
  return amount > 0 ? 'text-red-700' : 'text-gray-400'
}

function criticalGapPanelClass(amount) {
  if (amount > 0) return 'border-red-200 bg-red-50 text-red-700'
  return 'border-green-200 bg-green-50 text-green-700'
}

function criticalGapCardClass(amount) {
  if (amount > 0) return 'border-red-200 bg-red-50 text-red-700'
  return 'border-green-200 bg-green-50 text-green-700'
}

function supplierTotalsByCategory(job) {
  const totals = {}
  for (const entry of (job.entries || [])) {
    const category = normalizeCategory(entry.category)
    totals[category] = (totals[category] || 0) + toAmount(entry.amount)
  }
  return totals
}

function jobCategoryComparisons(job) {
  const voByCategory = jobThirdPartyVOSummary(job).byCategory || {}
  const supplierByCategory = supplierTotalsByCategory(job)
  const categories = new Set([
    ...Object.keys(voByCategory),
    ...Object.keys(supplierByCategory),
  ])
  return [...categories]
    .sort((a, b) => a.localeCompare(b))
    .map(category => {
      const voAmount = toAmount(voByCategory[category])
      const supplierAmount = toAmount(supplierByCategory[category])
      return {
        category,
        voAmount,
        supplierAmount,
        variance: supplierAmount - voAmount,
      }
    })
}

function getCategorySummaryComment(job, category) {
  const key = normalizeCategory(category)
  return normalize(job?.categorySummaryComments?.[key] || '')
}

function setCategorySummaryComment(jobKey, category, value) {
  const jobIdx = jobs.value.findIndex(job => job.key === jobKey)
  if (jobIdx === -1) return

  const key = normalizeCategory(category)
  const nextComment = normalize(value)
  const job = jobs.value[jobIdx]
  const nextComments = { ...(job.categorySummaryComments || {}) }

  if (nextComment) nextComments[key] = nextComment
  else delete nextComments[key]

  job.categorySummaryComments = nextComments
  job.updatedAt = new Date().toISOString()
  jobs.value = [...jobs.value]
  saveStorage()
}

function getSelectedEntryIds(jobKey) {
  return selectedEntryIdsByJob.value[jobKey] || []
}

function selectedEntriesForJob(job) {
  const selectedIds = new Set(getSelectedEntryIds(job.key))
  return (job.entries || []).filter(entry => selectedIds.has(entry.id))
}

function selectedEntryCount(job) {
  return selectedEntriesForJob(job).length
}

function selectedEntrySubtotal(job) {
  return selectedEntriesForJob(job).reduce((sum, entry) => sum + toAmount(entry.amount), 0)
}

function isEntrySelected(jobKey, entryId) {
  return getSelectedEntryIds(jobKey).includes(entryId)
}

function toggleEntrySelection(jobKey, entryId) {
  const selected = new Set(getSelectedEntryIds(jobKey))
  if (selected.has(entryId)) selected.delete(entryId)
  else selected.add(entryId)
  selectedEntryIdsByJob.value = { ...selectedEntryIdsByJob.value, [jobKey]: [...selected] }
}

function clearSelectedEntriesForJob(jobKey) {
  if (!(jobKey in selectedEntryIdsByJob.value)) return
  const next = { ...selectedEntryIdsByJob.value }
  delete next[jobKey]
  selectedEntryIdsByJob.value = next
}

function selectAllEntriesForJob(job) {
  selectedEntryIdsByJob.value = {
    ...selectedEntryIdsByJob.value,
    [job.key]: (job.entries || []).map(entry => entry.id),
  }
}

function areAllEntriesSelected(job) {
  const entries = job.entries || []
  return entries.length > 0 && selectedEntryCount(job) === entries.length
}

function toggleSelectAllEntriesForJob(job) {
  if (areAllEntriesSelected(job)) clearSelectedEntriesForJob(job.key)
  else selectAllEntriesForJob(job)
}

function toggleExpanded(key) {
  expandedJobs.value = { ...expandedJobs.value, [key]: !expandedJobs.value[key] }
}

function resetEntryForm() {
  entryForm.value = {
    poNumber: '',
    supplier: '',
    category: '',
    amount: 0,
    comment: '',
  }
  editingEntryId.value = null
  modalError.value = ''
}

function openEntryModal(job, entry = null) {
  loadCategoryOptions()
  loadSupplierOptions()
  entryJobKey.value = job.key
  expandedJobs.value = { ...expandedJobs.value, [job.key]: true }
  modalError.value = ''

  if (entry) {
    editingEntryId.value = entry.id
    entryForm.value = {
      poNumber: entry.poNumber,
      supplier: entry.supplier,
      category: entry.category || '',
      amount: Number(entry.rawAmount ?? entry.amount ?? 0),
      comment: entry.comment || '',
    }
  } else {
    resetEntryForm()
  }

  showEntryModal.value = true
}

function closeEntryModal() {
  showEntryModal.value = false
  entryJobKey.value = ''
  resetEntryForm()
}

function saveEntry() {
  loadCategoryOptions()
  loadSupplierOptions()
  const poNumber = normalize(entryForm.value.poNumber)
  const supplier = normalize(entryForm.value.supplier)
  const category = normalize(entryForm.value.category)
  const baseAmount = Number(entryForm.value.amount || 0)
  const markedUpAmount = applyPOMarkup(baseAmount)
  const comment = normalize(entryForm.value.comment)

  if (!poNumber || !supplier) {
    modalError.value = 'PO Number and Supplier are required.'
    return
  }
  const supplierMatch = supplierOptions.value.find(item => item.name.toLowerCase() === supplier.toLowerCase())
  if (!supplierMatch) {
    modalError.value = supplierOptions.value.length === 0
      ? 'No suppliers found in Admin. Please add suppliers in Admin > PO Suppliers first.'
      : 'Supplier must be selected from Admin > PO Suppliers.'
    return
  }
  const categoryValid = categoryOptions.value.some(item => item.name === category)
  if (!category || !categoryValid) {
    modalError.value = categoryOptions.value.length === 0
      ? 'No categories found in Admin. Please add categories in Admin > PO Supplier Categories first.'
      : 'Category must be selected from Admin > PO Supplier Categories.'
    return
  }
  if (!Number.isFinite(baseAmount) || baseAmount < 0) {
    modalError.value = 'Amount must be a valid number (0 or more).'
    return
  }

  const jobIdx = jobs.value.findIndex(job => job.key === entryJobKey.value)
  if (jobIdx === -1) {
    modalError.value = 'Selected job was not found. Please try again.'
    return
  }

  const now = new Date().toISOString()
  const job = jobs.value[jobIdx]

  if (editingEntryId.value) {
    job.entries = job.entries.map(entry =>
      entry.id === editingEntryId.value
        ? {
            ...entry,
            poNumber,
            supplier: supplierMatch.name,
            category,
            rawAmount: baseAmount,
            amount: markedUpAmount,
            markupApplied: true,
            comment,
            updatedAt: now
          }
        : entry
    )
  } else {
    job.entries.unshift({
      id: makeId(),
      poNumber,
      supplier: supplierMatch.name,
      category,
      rawAmount: baseAmount,
      amount: markedUpAmount,
      markupApplied: true,
      comment,
      createdAt: now,
      updatedAt: now,
    })
  }

  job.updatedAt = now
  jobs.value = [...jobs.value].sort(sortJobs)
  saveStorage()
  closeEntryModal()
}

function removeEntry(jobKey, entryId) {
  const jobIdx = jobs.value.findIndex(job => job.key === jobKey)
  if (jobIdx === -1) return
  if (!confirm('Delete this PO breakdown entry?')) return

  const beforeCount = jobs.value[jobIdx].entries.length
  jobs.value[jobIdx].entries = jobs.value[jobIdx].entries.filter(entry => entry.id !== entryId)
  if (jobs.value[jobIdx].entries.length === beforeCount) return

  jobs.value[jobIdx].updatedAt = new Date().toISOString()
  jobs.value = [...jobs.value]
  if (isEntrySelected(jobKey, entryId)) {
    const selected = new Set(getSelectedEntryIds(jobKey))
    selected.delete(entryId)
    if (selected.size === 0) clearSelectedEntriesForJob(jobKey)
    else selectedEntryIdsByJob.value = { ...selectedEntryIdsByJob.value, [jobKey]: [...selected] }
  }
  saveStorage()
}

loadStorage()
loadCategoryOptions()
loadSupplierOptions()
</script>
