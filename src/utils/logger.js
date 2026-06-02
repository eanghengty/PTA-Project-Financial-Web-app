import { v4 as uuidv4 } from 'uuid'

const LOG_KEY = 'voActivityLog'

// Fields shown in change diffs (label → field key)
export const TRACKED_FIELDS = {
  siteId:                 'Site ID',
  siteName:               'Site Name',
  jobNumber:              'Job Number',
  voDescription:          'Description',
  voAmount:               'Amount',
  voCategory:             'Category',
  poSupplierCategory:     'PO Supplier Category',
  scope:                  'Scope',
  boqRelated:             'BOQ Related',
  voStatus:               'Status',
  emailSentToNokia:       'Email Sent to Nokia',
  emailApprovedFromNokia: 'Email Approved from Nokia',
  ticketSubmissionDate:   'Ticket Submission Date',
  ticketNumber:           'Ticket Number',
  ticketApprovalDate:     'Ticket Approval Date',
  comment:                'Comment',
  poNumber:               'PO Number',
  invoiceStatus:          'Invoice Status',
  invoiceDate:            'Invoice Date',
  amountChangeFlag:       'Amount Change Flag',
  isDuplicate:            'Duplicate',
}

function formatValue(field, value) {
  if (value === null || value === undefined || value === '') return '—'
  if (field === 'boqRelated' || field === 'amountChangeFlag' || field === 'isDuplicate') return value ? 'Yes' : 'No'
  if (field === 'voAmount')   return `$${Number(value).toLocaleString('en-AU', { minimumFractionDigits: 2 })}`
  if (field.toLowerCase().includes('date') || field.toLowerCase().includes('nokia')) {
    const d = new Date(value)
    return isNaN(d) ? String(value) : d.toLocaleDateString('en-AU')
  }
  return String(value)
}

export function diffVOs(before, after) {
  const changes = []
  for (const [field, label] of Object.entries(TRACKED_FIELDS)) {
    const a = before[field]
    const b = after[field]
    const aStr = formatValue(field, a)
    const bStr = formatValue(field, b)
    if (aStr !== bStr) {
      changes.push({ field, label, from: aStr, to: bStr })
    }
  }
  return changes
}

export function getLogs() {
  try {
    const raw = localStorage.getItem(LOG_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function addLog(entry) {
  const logs = getLogs()
  logs.unshift({ id: uuidv4(), timestamp: new Date().toISOString(), ...entry })
  localStorage.setItem(LOG_KEY, JSON.stringify(logs))
}

export function clearLogs() {
  localStorage.removeItem(LOG_KEY)
}
