<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between pb-2 border-b border-gray-100">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center">
          <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 6h10M8 10h10M8 14h6M6 6h.01M6 10h.01M6 14h.01M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"/>
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">Issue Log</h2>
          <p class="text-xs text-gray-400 mt-0.5">Track open and cleared site issues</p>
        </div>
      </div>
      <button @click="openCreate"
        class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-sm">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        New Issue
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
      <div class="bg-white border border-gray-200 rounded-xl px-4 py-3">
        <p class="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">Total Issues</p>
        <p class="text-2xl font-bold text-gray-900 mt-1">{{ summary.total }}</p>
      </div>
      <div class="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
        <p class="text-[11px] uppercase tracking-wider text-orange-600 font-semibold">Open</p>
        <p class="text-2xl font-bold text-orange-700 mt-1">{{ summary.open }}</p>
      </div>
      <div class="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
        <p class="text-[11px] uppercase tracking-wider text-emerald-600 font-semibold">Clear</p>
        <p class="text-2xl font-bold text-emerald-700 mt-1">{{ summary.clear }}</p>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl px-4 py-3">
        <p class="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">Total Amount</p>
        <p class="text-2xl font-bold text-gray-900 mt-1">{{ formatCurrency(summary.amount) }}</p>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-4 py-3 border-b border-gray-200 flex items-center gap-3">
        <input
          v-model="searchText"
          type="text"
          placeholder="Search by site, job description, scope, or comment..."
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span class="text-xs text-gray-500 font-medium whitespace-nowrap">{{ filteredIssues.length }} result{{ filteredIssues.length === 1 ? '' : 's' }}</span>
      </div>

      <div v-if="filteredIssues.length === 0" class="px-6 py-12 text-center">
        <div class="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 6h10M8 10h10M8 14h6M6 6h.01M6 10h.01M6 14h.01M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"/>
          </svg>
        </div>
        <p class="text-sm text-gray-500">No issue log records found.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="bg-blue-700 text-white">
              <th class="px-4 py-3 text-left font-semibold">Site ID</th>
              <th class="px-4 py-3 text-left font-semibold">Site Name</th>
              <th class="px-4 py-3 text-left font-semibold">Job Description</th>
              <th class="px-4 py-3 text-left font-semibold">Register Log</th>
              <th class="px-4 py-3 text-left font-semibold">Scope</th>
              <th class="px-4 py-3 text-right font-semibold">Amount</th>
              <th class="px-4 py-3 text-left font-semibold">Status</th>
              <th class="px-4 py-3 text-left font-semibold">Comment</th>
              <th class="px-4 py-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="issue in filteredIssues" :key="issue.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{{ issue.siteId }}</td>
              <td class="px-4 py-3 text-gray-800 whitespace-nowrap">{{ issue.siteName }}</td>
              <td class="px-4 py-3 text-gray-700">{{ issue.jobDescription }}</td>
              <td class="px-4 py-3 text-gray-700 whitespace-nowrap">{{ formatDate(issue.registerLog) }}</td>
              <td class="px-4 py-3 text-gray-700">{{ issue.scope }}</td>
              <td class="px-4 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">{{ formatCurrency(issue.amount) }}</td>
              <td class="px-4 py-3">
                <span class="px-2 py-1 rounded-full text-xs font-semibold"
                  :class="issue.status === 'clear' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'">
                  {{ issue.status === 'clear' ? 'Clear' : 'Open' }}
                </span>
              </td>
              <td class="px-4 py-3 text-gray-700">
                <div class="max-w-xs truncate" :title="issue.comment || ''">
                  {{ issue.comment || '-' }}
                </div>
              </td>
              <td class="px-4 py-3 text-center whitespace-nowrap">
                <button @click="openEdit(issue)" class="px-3 py-1 rounded-md text-blue-600 hover:bg-blue-50 font-medium">Edit</button>
                <button @click="deleteIssue(issue.id)" class="px-3 py-1 rounded-md text-red-600 hover:bg-red-50 font-medium">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="closeModal">
      <div class="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div class="px-6 py-4 bg-blue-700 flex items-center justify-between">
          <h3 class="text-white font-bold text-base">{{ editingId ? 'Edit Issue Log' : 'New Issue Log' }}</h3>
          <button @click="closeModal" class="w-8 h-8 rounded-lg text-blue-100 hover:bg-blue-600 hover:text-white">
            <svg class="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <form @submit.prevent="saveIssue" class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Site (Admin) *</label>
            <div class="relative">
              <input
                v-model="siteSearch"
                type="text"
                required
                placeholder="Search Site ID, Site Name, or Job Number..."
                @focus="showSiteDropdown = true"
                @blur="hideSiteDropdown"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div v-if="showSiteDropdown" class="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-56 overflow-y-auto">
                <button
                  v-for="(site, idx) in filteredSites"
                  :key="`${site.siteId}|${site.siteName}|${site.jobNumber}|${idx}`"
                  type="button"
                  @mousedown.prevent="selectSite(site)"
                  class="w-full text-left px-3 py-2 hover:bg-blue-50 border-b border-gray-50 last:border-0"
                >
                  <div class="flex items-center gap-2">
                    <span class="px-1.5 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-700 shrink-0">{{ site.siteId || '—' }}</span>
                    <span class="text-sm text-gray-800 truncate">{{ site.siteName || '—' }}</span>
                    <span v-if="site.jobNumber" class="text-xs text-gray-400 font-mono shrink-0">{{ site.jobNumber }}</span>
                  </div>
                  <p v-if="site.comment" class="text-[11px] text-gray-400 truncate mt-0.5">{{ site.comment }}</p>
                </button>
                <div v-if="filteredSites.length === 0" class="px-4 py-3 text-sm text-gray-400 text-center">
                  No matching sites in Admin
                </div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2 mt-2">
              <input :value="form.siteId" disabled class="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 text-sm" />
              <input :value="form.siteName" disabled class="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 text-sm" />
            </div>
            <p class="text-[11px] text-gray-400 mt-1">Site ID and Site Name are locked to Admin selection.</p>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">ISSUE Description *</label>
            <textarea v-model.trim="form.jobDescription" required rows="2" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Register Log *</label>
              <input v-model="form.registerLog" type="date" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Scope *</label>
              <div class="relative">
                <input
                  v-model="scopeSearch"
                  type="text"
                  required
                  placeholder="Select scope from Admin..."
                  @focus="showScopeDropdown = true"
                  @blur="hideScopeDropdown"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div v-if="showScopeDropdown" class="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-52 overflow-y-auto">
                  <button
                    v-for="(scope, idx) in filteredScopes"
                    :key="`${scope.name}|${idx}`"
                    type="button"
                    @mousedown.prevent="selectScope(scope)"
                    class="w-full text-left px-3 py-2 hover:bg-blue-50 border-b border-gray-50 last:border-0 text-sm text-gray-800"
                  >
                    {{ scope.name }}
                    <span v-if="scope.comment" class="text-xs text-gray-400"> — {{ scope.comment }}</span>
                  </button>
                  <div v-if="filteredScopes.length === 0" class="px-4 py-3 text-sm text-gray-400 text-center">
                    No matching scopes in Admin
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Status *</label>
              <select v-model="form.status" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="open">Open</option>
                <option value="clear">Clear</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Amount</label>
            <input v-model.number="form.amount" type="number" step="0.01" min="0" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Comment</label>
            <textarea
              v-model="form.comment"
              rows="5"
              placeholder="Add notes, updates, or follow-ups. Press Enter for a new line."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[128px]"
            ></textarea>
          </div>

          <div v-if="validationError" class="px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {{ validationError }}
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button type="button" @click="closeModal" class="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" class="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700">{{ editingId ? 'Save Changes' : 'Create Issue' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useVOStore } from '../stores/voStore'
import { formatDate, formatCurrency } from '../utils/formatters'

const store = useVOStore()

const showModal = ref(false)
const editingId = ref(null)
const searchText = ref('')
const validationError = ref('')

const globalData = ref({ sites: [], scopes: [] })
const siteSearch = ref('')
const showSiteDropdown = ref(false)
const selectedSiteKey = ref('')
const scopeSearch = ref('')
const showScopeDropdown = ref(false)
const selectedScopeName = ref('')

const form = ref({
  siteId: '',
  siteName: '',
  jobDescription: '',
  registerLog: '',
  scope: '',
  amount: 0,
  status: 'open',
  comment: ''
})

function loadGlobalData() {
  try {
    const saved = localStorage.getItem('globalData')
    if (!saved) {
      globalData.value = { sites: [], scopes: [] }
      return
    }
    const data = JSON.parse(saved)
    const rawSites = (data.sites || []).map(s =>
      typeof s === 'string' ? { siteId: '', siteName: s, jobNumber: '', comment: '' } : s
    )
    const seen = new Set()
    const sites = rawSites.filter(s => {
      const key = `${s.siteId || ''}|${s.siteName || ''}|${s.jobNumber || ''}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    globalData.value = {
      sites,
      scopes: data.scopes || []
    }
  } catch {
    globalData.value = { sites: [], scopes: [] }
  }
}

const filteredSites = computed(() => {
  const q = siteSearch.value.trim().toLowerCase()
  if (!q) return globalData.value.sites
  return globalData.value.sites.filter(s =>
    (s.siteId || '').toLowerCase().includes(q) ||
    (s.siteName || '').toLowerCase().includes(q) ||
    (s.jobNumber || '').toLowerCase().includes(q) ||
    (s.comment || '').toLowerCase().includes(q)
  )
})

const filteredScopes = computed(() => {
  const q = scopeSearch.value.trim().toLowerCase()
  if (!q) return globalData.value.scopes
  return globalData.value.scopes.filter(s => (s.name || '').toLowerCase().includes(q))
})

function siteKey(siteId, siteName) {
  return `${siteId || ''}|${siteName || ''}`
}

function selectSite(site) {
  form.value.siteId = site.siteId || ''
  form.value.siteName = site.siteName || ''
  selectedSiteKey.value = siteKey(site.siteId, site.siteName)
  siteSearch.value = `${site.siteId || '—'} — ${site.siteName || ''}`.trim()
  showSiteDropdown.value = false
  validationError.value = ''
}

function selectScope(scope) {
  form.value.scope = scope.name || ''
  selectedScopeName.value = scope.name || ''
  scopeSearch.value = scope.name || ''
  showScopeDropdown.value = false
  validationError.value = ''
}

watch(siteSearch, (val) => {
  const expected = `${form.value.siteId || '—'} — ${form.value.siteName || ''}`.trim()
  if (val !== expected) {
    selectedSiteKey.value = ''
    form.value.siteId = ''
    form.value.siteName = ''
  }
})

watch(scopeSearch, (val) => {
  if (val !== form.value.scope) {
    selectedScopeName.value = ''
    form.value.scope = ''
  }
})

function hideSiteDropdown() {
  setTimeout(() => { showSiteDropdown.value = false }, 120)
}

function hideScopeDropdown() {
  setTimeout(() => { showScopeDropdown.value = false }, 120)
}

const summary = computed(() => store.issueLogSummary.value)

const filteredIssues = computed(() => {
  const q = searchText.value.trim().toLowerCase()
  let rows = [...(store.issueLogs.value || [])]
  if (!q) return rows
  return rows.filter(issue =>
    issue.siteId?.toLowerCase().includes(q) ||
    issue.siteName?.toLowerCase().includes(q) ||
    issue.jobDescription?.toLowerCase().includes(q) ||
    issue.scope?.toLowerCase().includes(q) ||
    issue.comment?.toLowerCase().includes(q)
  )
})

function resetForm() {
  form.value = {
    siteId: '',
    siteName: '',
    jobDescription: '',
    registerLog: '',
    scope: '',
    amount: 0,
    status: 'open',
    comment: ''
  }
  validationError.value = ''
  siteSearch.value = ''
  showSiteDropdown.value = false
  selectedSiteKey.value = ''
  scopeSearch.value = ''
  showScopeDropdown.value = false
  selectedScopeName.value = ''
}

function openCreate() {
  loadGlobalData()
  editingId.value = null
  resetForm()
  showModal.value = true
}

function openEdit(issue) {
  loadGlobalData()
  editingId.value = issue.id
  form.value = {
    siteId: issue.siteId || '',
    siteName: issue.siteName || '',
    jobDescription: issue.jobDescription || '',
    registerLog: issue.registerLog ? String(issue.registerLog).slice(0, 10) : '',
    scope: issue.scope || '',
    amount: Number(issue.amount || 0),
    status: issue.status === 'clear' ? 'clear' : 'open',
    comment: issue.comment || ''
  }

  const matchedSite = globalData.value.sites.find(s =>
    siteKey(s.siteId, s.siteName) === siteKey(form.value.siteId, form.value.siteName)
  )
  if (matchedSite) {
    selectedSiteKey.value = siteKey(matchedSite.siteId, matchedSite.siteName)
    siteSearch.value = `${matchedSite.siteId || '—'} — ${matchedSite.siteName || ''}`.trim()
  } else {
    selectedSiteKey.value = ''
    siteSearch.value = `${form.value.siteId || '—'} — ${form.value.siteName || ''}`.trim()
  }

  const matchedScope = globalData.value.scopes.find(s => (s.name || '') === form.value.scope)
  if (matchedScope) {
    selectedScopeName.value = matchedScope.name || ''
    scopeSearch.value = matchedScope.name || ''
  } else {
    selectedScopeName.value = ''
    scopeSearch.value = form.value.scope || ''
  }

  validationError.value = ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingId.value = null
  resetForm()
}

async function saveIssue() {
  loadGlobalData()

  const matchedSite = globalData.value.sites.find(s =>
    siteKey(s.siteId, s.siteName) === selectedSiteKey.value &&
    siteKey(s.siteId, s.siteName) === siteKey(form.value.siteId, form.value.siteName)
  )
  const matchedScope = globalData.value.scopes.find(s =>
    (s.name || '') === selectedScopeName.value &&
    (s.name || '') === form.value.scope
  )

  if (!matchedSite) {
    validationError.value = 'Site must be selected from Admin Sites. Please re-select a valid site.'
    return
  }
  if (!matchedScope) {
    validationError.value = 'Scope must be selected from Admin Scopes. Please re-select a valid scope.'
    return
  }

  const payload = {
    siteId: form.value.siteId,
    siteName: form.value.siteName,
    jobDescription: form.value.jobDescription,
    registerLog: form.value.registerLog,
    scope: form.value.scope,
    amount: Number(form.value.amount || 0),
    status: form.value.status,
    comment: form.value.comment
  }

  if (editingId.value) {
    await store.editIssueLog(editingId.value, payload)
  } else {
    await store.createIssueLog(payload)
  }

  closeModal()
}

async function deleteIssue(id) {
  if (!confirm('Delete this issue log record?')) return
  await store.removeIssueLog(id)
}

onMounted(async () => {
  loadGlobalData()
  if (!store.issueLogs.value.length) {
    await store.loadAllIssueLogs()
  }
})
</script>
