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

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      <div class="bg-white border border-gray-200 rounded-xl px-4 py-3">
        <p class="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">Jobs</p>
        <p class="text-2xl font-bold text-gray-900 mt-1">{{ jobs.length }}</p>
      </div>
      <div class="bg-teal-50 border border-teal-200 rounded-xl px-4 py-3">
        <p class="text-[11px] uppercase tracking-wider text-teal-600 font-semibold">PO Entries</p>
        <p class="text-2xl font-bold text-teal-700 mt-1">{{ totalEntries }}</p>
      </div>
      <div class="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
        <p class="text-[11px] uppercase tracking-wider text-blue-600 font-semibold">Total Amount</p>
        <p class="text-2xl font-bold text-blue-700 mt-1">{{ formatCompact(totalAmount) }}</p>
        <p class="text-xs text-gray-500 mt-1">{{ formatCurrency(totalAmount) }}</p>
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
              <th class="px-4 py-3 text-right font-semibold">PO Total</th>
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
                <td class="px-4 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">{{ formatCurrency(jobTotal(job)) }}</td>
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
                <td colspan="6" class="px-4 py-4 bg-gray-50">
                  <div v-if="job.entries.length === 0" class="text-xs text-gray-500">
                    No PO breakdown entries yet for this job.
                  </div>
                  <div v-else class="overflow-x-auto">
                    <table class="min-w-full text-xs border border-gray-200 rounded-lg overflow-hidden">
                      <thead class="bg-gray-100 text-gray-700 uppercase tracking-wider">
                        <tr>
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
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Amount *</label>
            <input
              v-model.number="entryForm.amount"
              type="number"
              min="0"
              step="0.01"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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

const store = useVOStore()

const jobs = ref([])
const lastSyncedAt = ref(null)
const syncMessage = ref(null)
const searchText = ref('')
const expandedJobs = ref({})
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

function normalize(value) {
  return String(value ?? '').trim()
}

function makeJobKey({ siteId, siteName, jobNumber }) {
  return [siteId, siteName, jobNumber].map(v => normalize(v).toLowerCase()).join('|')
}

function makeId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  return `po_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

function sanitizeEntry(rawEntry) {
  return {
    id: normalize(rawEntry?.id) || makeId(),
    poNumber: normalize(rawEntry?.poNumber),
    supplier: normalize(rawEntry?.supplier),
    category: normalize(rawEntry?.category),
    amount: Number(rawEntry?.amount || 0),
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
  return {
    key: makeJobKey({ siteId, siteName, jobNumber }),
    siteId,
    siteName,
    jobNumber,
    entries: Array.isArray(rawJob?.entries) ? rawJob.entries.map(sanitizeEntry) : [],
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
    return job.entries.some(entry =>
      entry.poNumber.toLowerCase().includes(q) ||
      entry.supplier.toLowerCase().includes(q) ||
      (entry.category || '').toLowerCase().includes(q) ||
      entry.comment.toLowerCase().includes(q)
    )
  })
})

const totalEntries = computed(() => jobs.value.reduce((sum, job) => sum + job.entries.length, 0))
const totalAmount = computed(() => jobs.value.reduce((sum, job) => sum + job.entries.reduce((jobSum, entry) => jobSum + Number(entry.amount || 0), 0), 0))
const jobsWithEntries = computed(() => jobs.value.filter(job => job.entries.length > 0).length)

const entryContext = computed(() => jobs.value.find(job => job.key === entryJobKey.value) || {
  siteId: '',
  siteName: '',
  jobNumber: '',
})

function jobTotal(job) {
  return job.entries.reduce((sum, entry) => sum + Number(entry.amount || 0), 0)
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
      amount: Number(entry.amount || 0),
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
  const amount = Number(entryForm.value.amount || 0)
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
  if (!Number.isFinite(amount) || amount < 0) {
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
        ? { ...entry, poNumber, supplier: supplierMatch.name, category, amount, comment, updatedAt: now }
        : entry
    )
  } else {
    job.entries.unshift({
      id: makeId(),
      poNumber,
      supplier: supplierMatch.name,
      category,
      amount,
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
  saveStorage()
}

loadStorage()
loadCategoryOptions()
loadSupplierOptions()
</script>
