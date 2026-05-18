import { ref, computed, unref } from 'vue'
import { addLog, diffVOs } from '../utils/logger'
import {
  addVO,
  updateVO,
  deleteVO,
  getVO,
  getAllVOs,
  getVOsByStatus,
  getVOsByCategory,
  getVOsBySite,
  getUniqueStatuses,
  getUniqueCategories,
  getUniqueSites,
  bulkInsertVOs,
  clearAllData,
  addIssueLog,
  updateIssueLog,
  deleteIssueLog,
  getAllIssueLogs
} from '../db/indexdb'

// State
const vos = ref([])
const issueLogs = ref([])
const loading = ref(false)
const error = ref(null)

// Invoice prep list — persisted as array of VO ids
const _loadInvoicePrepIds = () => {
  try { return new Set(JSON.parse(localStorage.getItem('invoicePrepIds') || '[]')) } catch { return new Set() }
}
const invoicePrepIds = ref(_loadInvoicePrepIds())
const _saveInvoicePrepIds = () => localStorage.setItem('invoicePrepIds', JSON.stringify([...invoicePrepIds.value]))

// Flagged VOs — persisted as array of VO ids
const _loadFlaggedIds = () => {
  try { return new Set(JSON.parse(localStorage.getItem('flaggedVOIds') || '[]')) } catch { return new Set() }
}
const flaggedIds = ref(_loadFlaggedIds())
const _saveFlaggedIds = () => localStorage.setItem('flaggedVOIds', JSON.stringify([...flaggedIds.value]))

// Flagged VO notes — { [voId]: string }
const _loadFlaggedNotes = () => {
  try { return JSON.parse(localStorage.getItem('flaggedVONotes') || '{}') } catch { return {} }
}
const flaggedNotes = ref(_loadFlaggedNotes())
const _saveFlaggedNotes = () => localStorage.setItem('flaggedVONotes', JSON.stringify(flaggedNotes.value))
const selectedFilters = ref({
  status: null,
  category: null,
  site: null,
  searchText: '',
  dateRangeStart: null,
  dateRangeEnd: null,
  boqRelated: null
})

// Computed
const filteredVOs = computed(() => {
  let result = [...vos.value]

  if (selectedFilters.value.status) {
    result = result.filter(vo => vo.voStatus === selectedFilters.value.status)
  }

  if (selectedFilters.value.category) {
    result = result.filter(vo => vo.voCategory === selectedFilters.value.category)
  }

  if (selectedFilters.value.site) {
    result = result.filter(vo => vo.siteName === selectedFilters.value.site)
  }

  if (selectedFilters.value.boqRelated !== null) {
    result = result.filter(vo => vo.boqRelated === selectedFilters.value.boqRelated)
  }

  if (selectedFilters.value.searchText) {
    const searchLower = selectedFilters.value.searchText.toLowerCase()
    result = result.filter(vo =>
      vo.siteName?.toLowerCase().includes(searchLower) ||
      vo.siteId?.toLowerCase().includes(searchLower) ||
      vo.voDescription?.toLowerCase().includes(searchLower) ||
      vo.ticketNumber?.toLowerCase().includes(searchLower)
    )
  }

  if (selectedFilters.value.dateRangeStart && selectedFilters.value.dateRangeEnd) {
    const start = new Date(selectedFilters.value.dateRangeStart)
    const end = new Date(selectedFilters.value.dateRangeEnd)
    result = result.filter(vo => {
      if (vo.emailApprovedFromNokia) {
        const date = new Date(vo.emailApprovedFromNokia)
        return date >= start && date <= end
      }
      return false
    })
  }

  return result
})

const statusSummary = computed(() => {
  const summary = {
    draft: 0,
    submitted: 0,
    'pending-approval': 0,
    approved: 0,
    rejected: 0
  }

  vos.value.forEach(vo => {
    if (summary.hasOwnProperty(vo.voStatus)) {
      summary[vo.voStatus]++
    }
  })

  return summary
})

const financialSummary = computed(() => {
  const approved = vos.value
    .filter(vo => vo.voStatus === 'approved')
    .reduce((sum, vo) => sum + (vo.voAmount || 0), 0)

  const pending = vos.value
    .filter(vo => vo.voStatus === 'pending-approval')
    .reduce((sum, vo) => sum + (vo.voAmount || 0), 0)

  const draft = vos.value
    .filter(vo => vo.voStatus === 'draft')
    .reduce((sum, vo) => sum + (vo.voAmount || 0), 0)

  const submitted = vos.value
    .filter(vo => vo.voStatus === 'submitted')
    .reduce((sum, vo) => sum + (vo.voAmount || 0), 0)

  const total = vos.value.reduce((sum, vo) => sum + (vo.voAmount || 0), 0)

  return { approved, pending, draft, submitted, total }
})

const categoryDistribution = computed(() => {
  const distribution = {}
  const voList = vos.value || []
  voList.forEach(vo => {
    const category = vo.voCategory || 'Uncategorized'
    distribution[category] = (distribution[category] || 0) + 1
  })
  // Return a plain object
  return Object.freeze({...distribution})
})

// Computed property to ensure vos is always reactive
const reactiveVOs = computed(() => vos.value)

const invoicePrepItems = computed(() =>
  vos.value.filter(vo => invoicePrepIds.value.has(vo.id))
)

const invoicePrepSummary = computed(() => ({
  count: invoicePrepIds.value.size,
  total: invoicePrepItems.value.reduce((sum, vo) => sum + (vo.voAmount || 0), 0)
}))

const timelineMetrics = computed(() => {
  // Avg days: emailApprovedFromNokia → ticketApprovalDate, only VOs with both dates
  const vosBothDates = vos.value.filter(vo => vo.emailApprovedFromNokia && vo.ticketApprovalDate)
  let averageDaysToApproval = 0
  if (vosBothDates.length > 0) {
    const totalDays = vosBothDates.reduce((sum, vo) => {
      const emailApproved = new Date(vo.emailApprovedFromNokia)
      const ticketApproved = new Date(vo.ticketApprovalDate)
      return sum + Math.max(0, Math.floor((ticketApproved - emailApproved) / (1000 * 60 * 60 * 24)))
    }, 0)
    averageDaysToApproval = Math.round(totalDays / vosBothDates.length)
  }

  const pendingVOs = vos.value.filter(vo => vo.voStatus === 'pending-approval')
  const overduePending = pendingVOs.filter(vo => {
    if (!vo.emailSentToNokia) return false
    const sent = new Date(vo.emailSentToNokia)
    const today = new Date()
    const daysPending = Math.floor((today - sent) / (1000 * 60 * 60 * 24))
    return daysPending > 30
  }).length

  // Approval rate: has ticketApprovalDate / (has ticketApprovalDate + has ticketNumber but no ticketApprovalDate)
  const withTicketApproval = vos.value.filter(vo => vo.ticketApprovalDate).length
  const withTicketNoApproval = vos.value.filter(vo => vo.ticketNumber && !vo.ticketApprovalDate).length
  const approvalRate = (withTicketApproval + withTicketNoApproval) > 0
    ? Math.round((withTicketApproval / (withTicketApproval + withTicketNoApproval)) * 100)
    : 0

  return {
    averageDaysToApproval,
    overduePending,
    approvalRate
  }
})

const issueLogSummary = computed(() => {
  const total = issueLogs.value.length
  const open = issueLogs.value.filter(i => i.status === 'open').length
  const clear = issueLogs.value.filter(i => i.status === 'clear').length
  const amount = issueLogs.value.reduce((sum, i) => sum + Number(i.amount || 0), 0)
  return { total, open, clear, amount }
})

// Initialize store on first use
let initialized = false

const initStore = async () => {
  if (!initialized) {
    initialized = true
    try {
      const loadedVOs = await getAllVOs()
      vos.value = loadedVOs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      console.log('Store initialized with', vos.value.length, 'VOs')
    } catch (err) {
      console.error('Error initializing store:', err)
    }
  }
}

// Actions
export function useVOStore() {
  // Ensure store is initialized
  initStore()

  const loadAllVOs = async () => {
    loading.value = true
    error.value = null
    try {
      vos.value = await getAllVOs()

      // Auto-correct status based on ticket fields, PO number, and BOQ flag for existing data
      const BASE_PO_CATS = new Set(['Site Survey', 'WOP', 'C&I', 'SAT&SIT', 'Snag Closure'])
      const fixes = []
      for (const vo of vos.value) {
        if (vo.voStatus === 'rejected' || vo.voStatus === 'cancelled') continue
        const isBasePO = BASE_PO_CATS.has(vo.voCategory?.trim())
        const isBOQ    = !isBasePO && (vo.boqRelated === true || vo.boqRelated === 'yes')
        const hasPO    = !!vo.poNumber?.trim()
        if (isBOQ) {
          // BOQ VOs: PO → approved, no PO → pending-approval
          const expected = hasPO ? 'approved' : 'pending-approval'
          if (vo.voStatus !== expected) fixes.push({ vo, newStatus: expected })
        } else {
          // Standard logic
          if ((hasPO || vo.ticketApprovalDate) && vo.voStatus !== 'approved')
            fixes.push({ vo, newStatus: 'approved' })
          else if (vo.ticketNumber?.trim() && vo.ticketSubmissionDate && (vo.voStatus === 'draft' || vo.voStatus === 'pending-approval'))
            fixes.push({ vo, newStatus: 'submitted' })
        }
      }
      for (const { vo, newStatus } of fixes) {
        await updateVO(vo.id, { ...vo, voStatus: newStatus, updatedAt: new Date() })
        vo.voStatus = newStatus
      }

      // Sort by creation date (newest first)
      vos.value.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      console.log('Loaded VOs:', vos.value.length)
    } catch (err) {
      error.value = err.message
      console.error('Error loading VOs:', err)
    } finally {
      loading.value = false
    }
  }

  const createVO = async (voData) => {
    loading.value = true
    error.value = null
    try {
      const newVO = await addVO(voData)
      vos.value.unshift(newVO)
      addLog({
        action: 'created',
        voId: newVO.id,
        siteId: newVO.siteId,
        siteName: newVO.siteName,
        jobNumber: newVO.jobNumber || '',
        voDescription: newVO.voDescription,
        voAmount: newVO.voAmount,
        voStatus: newVO.voStatus,
        comment: newVO.comment || '',
        changes: [],
      })
      return newVO
    } catch (err) {
      error.value = err.message
      console.error('Error creating VO:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const editVO = async (id, voData, options = {}) => {
    const { suppressActivityLog = false, suppressLoadingToggle = false } = options
    if (!suppressLoadingToggle) loading.value = true
    error.value = null
    try {
      const before = vos.value.find(vo => vo.id === id) || {}
      const updatedVO = await updateVO(id, voData)
      const index = vos.value.findIndex(vo => vo.id === id)
      if (index !== -1) vos.value[index] = updatedVO

      // If invoice status cleared or set to Not Yet Sent, remove from prep list
      if (!updatedVO.invoiceStatus || updatedVO.invoiceStatus === 'Not Yet Sent') {
        const updated = new Set(invoicePrepIds.value)
        updated.delete(id)
        invoicePrepIds.value = updated
        _saveInvoicePrepIds()
      }
      const changes = diffVOs(before, updatedVO)

      // When a VO is cancelled, append a note listing exactly what was wiped
      if (before.voStatus !== 'cancelled' && updatedVO.voStatus === 'cancelled') {
        const removed = []
        if (before.voAmount)               removed.push(`Amount (was ${before.voAmount})`)
        if (before.ticketNumber)            removed.push(`Ticket # (was ${before.ticketNumber})`)
        if (before.ticketSubmissionDate)    removed.push(`Ticket Submission Date`)
        if (before.ticketApprovalDate)      removed.push(`Ticket Approval Date`)
        if (before.emailSentToNokia)        removed.push(`Email Sent to Nokia`)
        if (before.emailApprovedFromNokia)  removed.push(`Email Approved from Nokia`)
        if (removed.length) {
          changes.push({
            field: '_cancellation',
            label: 'Cancelled — fields removed',
            from: '—',
            to: removed.join(', '),
          })
        }
      }

      if (!suppressActivityLog) {
        addLog({
          action: 'updated',
          voId: updatedVO.id,
          siteId: updatedVO.siteId,
          siteName: updatedVO.siteName,
          jobNumber: updatedVO.jobNumber || '',
          voDescription: updatedVO.voDescription,
          voAmount: updatedVO.voAmount,
          voStatus: updatedVO.voStatus,
          comment: updatedVO.comment || '',
          changes,
        })
      }
      return updatedVO
    } catch (err) {
      error.value = err.message
      console.error('Error updating VO:', err)
      throw err
    } finally {
      if (!suppressLoadingToggle) loading.value = false
    }
  }

  const removeVO = async (id) => {
    loading.value = true
    error.value = null
    try {
      const target = vos.value.find(vo => vo.id === id)
      await deleteVO(id)
      vos.value = vos.value.filter(vo => vo.id !== id)
      if (target) {
        addLog({
          action: 'deleted',
          voId: id,
          siteId: target.siteId,
          siteName: target.siteName,
          jobNumber: target.jobNumber || '',
          voDescription: target.voDescription,
          voAmount: target.voAmount,
          voStatus: target.voStatus,
          comment: '',
          changes: [],
        })
      }
    } catch (err) {
      error.value = err.message
      console.error('Error deleting VO:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const importVOs = async (voList) => {
    loading.value = true
    error.value = null
    try {
      const inserted = await bulkInsertVOs(voList)
      await loadAllVOs() // Reload to ensure consistency
      return inserted
    } catch (err) {
      error.value = err.message
      console.error('Error importing VOs:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateFilters = (newFilters) => {
    selectedFilters.value = { ...selectedFilters.value, ...newFilters }
  }

  const clearFilters = () => {
    selectedFilters.value = {
      status: null,
      category: null,
      site: null,
      searchText: '',
      dateRangeStart: null,
      dateRangeEnd: null,
      boqRelated: null
    }
  }

  const bulkUpdateInvoiceStatus = async (ids, invoiceStatus, invoiceDate) => {
    const logEntry = { status: invoiceStatus, date: invoiceDate, loggedAt: new Date().toISOString() }
    for (const id of ids) {
      const vo = vos.value.find(v => v.id === id)
      if (!vo) continue
      const invoiceLog = [...(vo.invoiceLog || []), logEntry]
      const updated = await updateVO(id, { invoiceStatus, invoiceDate, invoiceLog })
      const idx = vos.value.findIndex(v => v.id === id)
      if (idx !== -1) vos.value[idx] = updated
    }
    addToInvoicePrep(ids)
  }

  const addToInvoicePrep = (ids) => {
    const eligible = ids.filter(id => {
      const vo = vos.value.find(v => v.id === id)
      return vo && vo.poNumber?.trim()
    })
    if (eligible.length === 0) return
    const updated = new Set(invoicePrepIds.value)
    eligible.forEach(id => updated.add(id))
    invoicePrepIds.value = updated
    _saveInvoicePrepIds()
  }

  const removeFromInvoicePrep = (id) => {
    const updated = new Set(invoicePrepIds.value)
    updated.delete(id)
    invoicePrepIds.value = updated
    _saveInvoicePrepIds()
  }

  const clearInvoicePrep = () => {
    invoicePrepIds.value = new Set()
    _saveInvoicePrepIds()
  }

  const reloadInvoicePrepIds = () => {
    invoicePrepIds.value = _loadInvoicePrepIds()
  }

  const addCostImportSummaryLog = ({ status, filename, rowsTotal = 0, rowsProcessed = 0, updatedCount = 0, revertedCount = 0, message = '' } = {}) => {
    addLog({
      action: 'cost-import',
      voId: null,
      siteId: '(Import)',
      siteName: '(Cost to Date)',
      jobNumber: '',
      voDescription: `Cost import ${status || 'unknown'}${filename ? `: ${filename}` : ''}`,
      voAmount: 0,
      voStatus: 'draft',
      comment: message || '',
      changes: [
        { field: 'status', label: 'Status', from: '—', to: status || 'unknown' },
        { field: 'rowsTotal', label: 'Rows Total', from: '—', to: String(rowsTotal) },
        { field: 'rowsProcessed', label: 'Rows Processed', from: '—', to: String(rowsProcessed) },
        { field: 'updatedCount', label: 'VOs Updated', from: '—', to: String(updatedCount) },
        { field: 'revertedCount', label: 'VOs Reverted', from: '—', to: String(revertedCount) },
      ],
    })
  }

  const loadAllIssueLogs = async () => {
    loading.value = true
    error.value = null
    try {
      issueLogs.value = await getAllIssueLogs()
      issueLogs.value.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } catch (err) {
      error.value = err.message
      console.error('Error loading issue logs:', err)
    } finally {
      loading.value = false
    }
  }

  const createIssueLog = async (issueData) => {
    loading.value = true
    error.value = null
    try {
      const newIssue = await addIssueLog(issueData)
      issueLogs.value.unshift(newIssue)
      return newIssue
    } catch (err) {
      error.value = err.message
      console.error('Error creating issue log:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const editIssueLog = async (id, issueData) => {
    loading.value = true
    error.value = null
    try {
      const updatedIssue = await updateIssueLog(id, issueData)
      const index = issueLogs.value.findIndex(i => i.id === id)
      if (index !== -1) issueLogs.value[index] = updatedIssue
      return updatedIssue
    } catch (err) {
      error.value = err.message
      console.error('Error updating issue log:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const removeIssueLog = async (id) => {
    loading.value = true
    error.value = null
    try {
      await deleteIssueLog(id)
      issueLogs.value = issueLogs.value.filter(i => i.id !== id)
    } catch (err) {
      error.value = err.message
      console.error('Error deleting issue log:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const reloadFlaggedData = () => {
    flaggedIds.value = _loadFlaggedIds()
    flaggedNotes.value = _loadFlaggedNotes()
  }

  const setFlag = (id, description) => {
    const updated = new Set(flaggedIds.value)
    updated.add(id)
    flaggedIds.value = updated
    flaggedNotes.value = { ...flaggedNotes.value, [id]: description || '' }
    _saveFlaggedIds()
    _saveFlaggedNotes()
  }

  const removeFlag = (id) => {
    const updated = new Set(flaggedIds.value)
    updated.delete(id)
    flaggedIds.value = updated
    const notes = { ...flaggedNotes.value }
    delete notes[id]
    flaggedNotes.value = notes
    _saveFlaggedIds()
    _saveFlaggedNotes()
  }

  const toggleFlag = (id) => {
    if (flaggedIds.value.has(id)) removeFlag(id)
  }

  const clearAllFlags = () => {
    flaggedIds.value = new Set()
    flaggedNotes.value = {}
    _saveFlaggedIds()
    _saveFlaggedNotes()
  }

  const returnObj = {
    // State (use computed property for vos to ensure it's reactive)
    vos: reactiveVOs,
    issueLogs,
    loading,
    error,
    selectedFilters,

    // Computed
    filteredVOs,
    statusSummary,
    financialSummary,
    categoryDistribution,
    timelineMetrics,
    issueLogSummary,
    invoicePrepIds,
    invoicePrepItems,
    invoicePrepSummary,
    flaggedIds,
    flaggedNotes,

    // Actions
    loadAllVOs,
    loadAllIssueLogs,
    createVO,
    createIssueLog,
    editVO,
    editIssueLog,
    removeVO,
    removeIssueLog,
    addCostImportSummaryLog,
    importVOs,
    updateFilters,
    clearFilters,
    bulkUpdateInvoiceStatus,
    addToInvoicePrep,
    removeFromInvoicePrep,
    clearInvoicePrep,
    reloadInvoicePrepIds,
    reloadFlaggedData,
    toggleFlag,
    setFlag,
    removeFlag,
    clearAllFlags
  }

  return returnObj
}
