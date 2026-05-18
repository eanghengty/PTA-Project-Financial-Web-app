<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between pb-2 border-b border-gray-100 gap-4 flex-wrap">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
          <svg class="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-7 8h6m-6 4h6" />
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">PO Received Summary</h2>
          <p class="text-xs text-gray-400 mt-0.5">Daily grouped summary of received POs from the variation records</p>
        </div>
      </div>

      <div class="w-full sm:w-80">
        <input
          v-model="searchText"
          type="text"
          placeholder="Search by site, PO number, description, or scope..."
          class="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-4">
      <div class="bg-white border border-teal-100 rounded-xl p-4">
        <p class="text-xs font-bold text-teal-500 uppercase tracking-wider mb-1">Have PO</p>
        <p class="text-2xl font-bold text-teal-700">{{ poItems.length }}</p>
        <p class="text-xs text-gray-400 mt-1">Records with a PO number</p>
      </div>
      <div class="bg-white border border-blue-100 rounded-xl p-4">
        <p class="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">Date Groups</p>
        <p class="text-2xl font-bold text-blue-700">{{ datedGroupCount }}</p>
        <p class="text-xs text-gray-400 mt-1">Unique PO received dates</p>
      </div>
      <div class="bg-white border border-emerald-100 rounded-xl p-4">
        <p class="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-1">PO Value</p>
        <p class="text-2xl font-bold text-emerald-700">{{ formatCompact(totalAmount) }}</p>
        <p class="text-xs text-gray-400 mt-1">{{ formatCurrency(totalAmount) }}</p>
      </div>
      <div class="bg-white border border-amber-100 rounded-xl p-4">
        <p class="text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">Missing Date</p>
        <p class="text-2xl font-bold text-amber-700">{{ missingDateCount }}</p>
        <p class="text-xs text-gray-400 mt-1">PO rows without a received date</p>
      </div>
    </div>

    <div v-if="poItems.length === 0" class="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-12 text-center border border-teal-100">
      <div class="w-14 h-14 mx-auto mb-4 rounded-2xl bg-teal-100 flex items-center justify-center">
        <svg class="w-7 h-7 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <h3 class="text-lg font-bold text-gray-900">No PO records yet</h3>
      <p class="text-sm text-gray-500 mt-1">Once variations have a PO number, they will be grouped here by PO received date.</p>
    </div>

    <div v-else-if="groups.length === 0" class="bg-gradient-to-br from-gray-50 to-teal-50 rounded-xl p-12 text-center border border-gray-200">
      <div class="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white border border-gray-200 flex items-center justify-center">
        <svg class="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-8 7h6m-6 4h6" />
        </svg>
      </div>
      <h3 class="text-lg font-bold text-gray-900">No matches for this search</h3>
      <p class="text-sm text-gray-500 mt-1">Try a different site, PO number, description, or scope.</p>
    </div>

    <div v-else class="space-y-4">
      <div v-for="group in groups" :key="group.key" class="border rounded-xl overflow-hidden"
        :class="group.isMissing ? 'border-amber-200' : 'border-teal-100'">
        <div
          class="flex items-center justify-between px-4 py-3 cursor-pointer select-none transition"
          :class="groupOpen[group.key]
            ? (group.isMissing ? 'bg-amber-50 border-b border-amber-200' : 'bg-teal-50/60 border-b border-teal-100')
            : (group.isMissing ? 'hover:bg-amber-50/70' : 'hover:bg-teal-50/40')"
          @click="toggleGroup(group.key)"
        >
          <div class="flex items-center gap-3 min-w-0">
            <span class="w-2 h-2 rounded-full shrink-0" :class="group.isMissing ? 'bg-amber-400' : 'bg-teal-400'"></span>
            <div class="min-w-0">
              <h3 class="text-sm font-semibold text-gray-800 truncate">{{ group.label }}</h3>
              <p class="text-xs text-gray-400 mt-0.5">
                {{ group.count }} record{{ group.count !== 1 ? 's' : '' }}
                <span class="mx-1">|</span>
                {{ formatCurrency(group.totalAmount) }}
                <span v-if="group.fallbackCount > 0" class="mx-1">|</span>
                <span v-if="group.fallbackCount > 0" class="text-amber-600">{{ group.fallbackCount }} from PO log fallback</span>
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2.5 shrink-0">
            <span v-if="group.totalPages > 1" class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-gray-200 text-gray-500">
              {{ groupPages[group.key] || 1 }} / {{ group.totalPages }}
            </span>
            <span class="px-2.5 py-1 rounded-lg text-xs font-bold border"
              :class="group.isMissing ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-teal-100 text-teal-700 border-teal-200'">
              {{ formatCompact(group.totalAmount) }}
            </span>
            <svg class="w-4 h-4 text-gray-400 transition-transform duration-200" :class="groupOpen[group.key] ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div v-show="groupOpen[group.key]" class="bg-white">
          <div class="overflow-auto">
            <table class="w-full text-sm min-w-[1100px]">
              <thead>
                <tr class="text-white text-xs uppercase tracking-wider" :class="group.isMissing ? 'bg-amber-600' : 'bg-teal-700'">
                  <th class="px-4 py-3 text-left font-semibold">Site</th>
                  <th class="px-3 py-3 text-left font-semibold">Job #</th>
                  <th class="px-4 py-3 text-left font-semibold">Description</th>
                  <th class="px-3 py-3 text-left font-semibold">Category</th>
                  <th class="px-3 py-3 text-left font-semibold">Scope</th>
                  <th class="px-3 py-3 text-left font-semibold">PO Number</th>
                  <th class="px-3 py-3 text-left font-semibold">Status</th>
                  <th class="px-3 py-3 text-left font-semibold">Source</th>
                  <th class="px-4 py-3 text-right font-semibold">Amount</th>
                  <th class="px-4 py-3 text-center font-semibold w-24">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="vo in paginatedItems(group)" :key="vo.id" class="hover:bg-gray-50 transition-colors">
                  <td class="px-4 py-3">
                    <div class="font-semibold text-gray-900 text-sm leading-tight">{{ vo.siteName || '-' }}</div>
                    <div class="text-xs text-indigo-600 font-medium mt-0.5">{{ vo.siteId || '-' }}</div>
                  </td>
                  <td class="px-3 py-3 text-xs text-gray-500 whitespace-nowrap">{{ vo.jobNumber || '-' }}</td>
                  <td class="px-4 py-3 max-w-sm">
                    <div class="text-gray-800 text-sm line-clamp-2 leading-snug">{{ vo.voDescription || '-' }}</div>
                  </td>
                  <td class="px-3 py-3">
                    <span class="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 whitespace-nowrap">
                      {{ vo.voCategory || '-' }}
                    </span>
                  </td>
                  <td class="px-3 py-3 text-xs text-gray-500 whitespace-nowrap">{{ vo.scope || '-' }}</td>
                  <td class="px-3 py-3">
                    <span class="font-mono text-xs text-gray-700 bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded">
                      {{ vo.poNumber || '-' }}
                    </span>
                  </td>
                  <td class="px-3 py-3 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                      :class="statusBadgeClass(vo.voStatus)">
                      {{ formatStatus(vo.voStatus) }}
                    </span>
                  </td>
                  <td class="px-3 py-3 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                      :class="vo._poReceivedSource === 'poLog'
                        ? 'bg-amber-100 text-amber-700 border border-amber-200'
                        : vo._poReceivedSource === 'missing'
                          ? 'bg-gray-100 text-gray-600 border border-gray-200'
                          : 'bg-teal-100 text-teal-700 border border-teal-200'">
                      {{ vo._poReceivedSourceLabel }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-right text-sm font-semibold text-gray-800 whitespace-nowrap">
                    {{ formatCurrency(vo.voAmount || 0) }}
                  </td>
                  <td class="px-4 py-3 text-center">
                    <button @click="openEdit(vo)"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 transition shadow-sm">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="px-4 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-4 flex-wrap">
            <p class="text-xs text-gray-500">
              Showing {{ pageStart(group) }}-{{ pageEnd(group) }} of {{ group.count }}
            </p>

            <div v-if="group.totalPages > 1" class="flex items-center gap-1">
              <button @click="setGroupPage(group.key, 1)" :disabled="(groupPages[group.key] || 1) === 1"
                class="px-2 py-1 text-xs rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">&lt;&lt;</button>
              <button @click="setGroupPage(group.key, (groupPages[group.key] || 1) - 1)" :disabled="(groupPages[group.key] || 1) === 1"
                class="px-2 py-1 text-xs rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">&lt;</button>
              <span class="px-3 py-1 text-xs font-semibold text-gray-700">{{ groupPages[group.key] || 1 }} / {{ group.totalPages }}</span>
              <button @click="setGroupPage(group.key, (groupPages[group.key] || 1) + 1)" :disabled="(groupPages[group.key] || 1) === group.totalPages"
                class="px-2 py-1 text-xs rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">&gt;</button>
              <button @click="setGroupPage(group.key, group.totalPages)" :disabled="(groupPages[group.key] || 1) === group.totalPages"
                class="px-2 py-1 text-xs rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">&gt;&gt;</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <VOForm
      v-if="showForm"
      :vo="editingVO"
      @save="saveVO"
      @cancel="closeForm"
    />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import VOForm from './VOForm.vue'
import { useVOStore } from '../stores/voStore'
import { formatCompact, formatCurrency, formatStatus } from '../utils/formatters'

const PAGE_SIZE = 10

const store = useVOStore()

const searchText = ref('')
const groupOpen = ref({})
const groupPages = ref({})

function normalizeDateKey(value) {
  if (!value) return ''
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10)
  const dt = new Date(value)
  if (Number.isNaN(dt.getTime())) return ''
  const year = dt.getFullYear()
  const month = String(dt.getMonth() + 1).padStart(2, '0')
  const day = String(dt.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDateLabel(key) {
  if (!key) return 'Missing PO Received Date'
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-AU', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function getFallbackPODate(vo) {
  const logs = Array.isArray(vo?.poLog) ? [...vo.poLog] : []
  const latestWithPO = logs.reverse().find(entry => entry?.to?.trim() && normalizeDateKey(entry.loggedAt))
  if (!latestWithPO) return null
  const key = normalizeDateKey(latestWithPO.loggedAt)
  if (!key) return null
  return {
    key,
    source: 'poLog',
    label: 'From PO Log',
  }
}

function getPOReceivedMeta(vo) {
  const directKey = normalizeDateKey(vo.poReceivedDate)
  if (directKey) {
    return { key: directKey, source: 'field', label: 'PO Received Date' }
  }
  const fallback = getFallbackPODate(vo)
  if (fallback) return fallback
  return { key: '', source: 'missing', label: 'Missing Date' }
}

const poItems = computed(() =>
  (store.vos.value || [])
    .filter(vo => vo.poNumber?.trim())
    .map(vo => {
      const meta = getPOReceivedMeta(vo)
      return {
        ...vo,
        _poReceivedKey: meta.key,
        _poReceivedSource: meta.source,
        _poReceivedSourceLabel: meta.label,
      }
    })
)

const filteredItems = computed(() => {
  const q = searchText.value.trim().toLowerCase()
  if (!q) return poItems.value
  return poItems.value.filter(vo =>
    vo.siteId?.toLowerCase().includes(q) ||
    vo.siteName?.toLowerCase().includes(q) ||
    vo.jobNumber?.toLowerCase().includes(q) ||
    vo.voDescription?.toLowerCase().includes(q) ||
    vo.poNumber?.toLowerCase().includes(q) ||
    vo.scope?.toLowerCase().includes(q)
  )
})

const groups = computed(() => {
  const mapped = new Map()
  for (const vo of filteredItems.value) {
    const key = vo._poReceivedKey || 'missing'
    if (!mapped.has(key)) {
      mapped.set(key, {
        key,
        label: key === 'missing' ? 'Missing PO Received Date' : formatDateLabel(key),
        isMissing: key === 'missing',
        items: [],
        totalAmount: 0,
        fallbackCount: 0,
      })
    }
    const group = mapped.get(key)
    group.items.push(vo)
    group.totalAmount += Number(vo.voAmount || 0)
    if (vo._poReceivedSource === 'poLog') group.fallbackCount++
  }

  return [...mapped.values()]
    .map(group => {
      group.items.sort((a, b) => {
        const siteCmp = (a.siteName || a.siteId || '').localeCompare(b.siteName || b.siteId || '')
        if (siteCmp !== 0) return siteCmp
        return (a.voDescription || '').localeCompare(b.voDescription || '')
      })
      group.count = group.items.length
      group.totalPages = Math.max(1, Math.ceil(group.count / PAGE_SIZE))
      return group
    })
    .sort((a, b) => {
      if (a.isMissing) return 1
      if (b.isMissing) return -1
      return b.key.localeCompare(a.key)
    })
})

const datedGroupCount = computed(() => groups.value.filter(group => !group.isMissing).length)
const totalAmount = computed(() => poItems.value.reduce((sum, vo) => sum + Number(vo.voAmount || 0), 0))
const missingDateCount = computed(() => poItems.value.filter(vo => !vo._poReceivedKey).length)

watch(groups, (nextGroups) => {
  const nextOpen = {}
  const nextPages = {}
  for (const [index, group] of nextGroups.entries()) {
    nextOpen[group.key] = groupOpen.value[group.key] ?? (index === 0)
    const page = groupPages.value[group.key] || 1
    nextPages[group.key] = Math.min(Math.max(page, 1), group.totalPages)
  }
  groupOpen.value = nextOpen
  groupPages.value = nextPages
}, { immediate: true })

watch(searchText, () => {
  const resetPages = {}
  for (const group of groups.value) resetPages[group.key] = 1
  groupPages.value = { ...groupPages.value, ...resetPages }
})

function toggleGroup(key) {
  groupOpen.value = { ...groupOpen.value, [key]: !groupOpen.value[key] }
}

function setGroupPage(key, page) {
  const group = groups.value.find(item => item.key === key)
  if (!group) return
  const safePage = Math.min(Math.max(page, 1), group.totalPages)
  groupPages.value = { ...groupPages.value, [key]: safePage }
}

function paginatedItems(group) {
  const page = groupPages.value[group.key] || 1
  const start = (page - 1) * PAGE_SIZE
  return group.items.slice(start, start + PAGE_SIZE)
}

function pageStart(group) {
  if (!group.count) return 0
  return ((groupPages.value[group.key] || 1) - 1) * PAGE_SIZE + 1
}

function pageEnd(group) {
  return Math.min((groupPages.value[group.key] || 1) * PAGE_SIZE, group.count)
}

function statusBadgeClass(status) {
  const classes = {
    draft: 'bg-gray-100 text-gray-700',
    submitted: 'bg-blue-100 text-blue-700',
    'pending-approval': 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    cancelled: 'bg-slate-100 text-slate-600',
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

const editingVO = ref(null)
const showForm = ref(false)

function openEdit(vo) {
  editingVO.value = vo
  showForm.value = true
}

function closeForm() {
  editingVO.value = null
  showForm.value = false
}

async function saveVO(voData) {
  try {
    await store.editVO(editingVO.value.id, voData)
    closeForm()
  } catch (err) {
    console.error('Error saving VO:', err)
    alert('Error saving VO: ' + (err.message || err))
  }
}
</script>
