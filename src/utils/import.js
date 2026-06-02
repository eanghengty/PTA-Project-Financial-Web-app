import * as XLSX from 'xlsx'

// Columns that MUST be present for a valid import
const REQUIRED_COLUMNS = ['Site ID', 'VO Description', 'VO Amount']

// All recognised columns and their field mappings
const FIELD_MAPPING = {
  'Site ID':                    'siteId',
  'Site Name':                  'siteName',
  'Job Number':                 'jobNumber',
  'VO Description':             'voDescription',
  'VO Amount':                  'voAmount',
  'VO Category':                'voCategory',
  'PO Supplier Category':       'poSupplierCategory',
  'Scope':                      'scope',
  'BOQ Related':                'boqRelated',
  'Email Sent to Nokia':        'emailSentToNokia',
  'Email Approved from Nokia':  'emailApprovedFromNokia',
  'Ticket Submission Date':     'ticketSubmissionDate',
  'Ticket Number':              'ticketNumber',
  'Ticket Approval Date':       'ticketApprovalDate',
  'VO Status':                  'voStatus',
  'Comment':                    'comment',
  'PO Number':                  'poNumber',
  'PO Received Date':           'poReceivedDate',
  'Invoice Status':             'invoiceStatus',
  'Invoice Date':               'invoiceDate',
  'Amount Change Flag':         'amountChangeFlag',
}

function parseDate(value) {
  if (!value && value !== 0) return null
  // SheetJS can return a serial number for dates
  if (typeof value === 'number') {
    const d = XLSX.SSF.parse_date_code(value)
    if (d) return new Date(d.y, d.m - 1, d.d)
  }
  const d = new Date(value)
  return isNaN(d.getTime()) ? null : d
}

function parseBoolean(value) {
  if (value === null || value === undefined || value === '') return false
  return ['yes', 'true', '1'].includes(String(value).toLowerCase().trim())
}

function parseNumber(value) {
  const num = Number(value)
  return isNaN(num) ? 0 : num
}

const DATE_FIELDS = new Set([
  'emailSentToNokia', 'emailApprovedFromNokia',
  'ticketSubmissionDate', 'ticketApprovalDate',
  'poReceivedDate',
  'invoiceDate',
])

function convertRowToVO(row, columnIndexMap) {
  const vo = {}
  for (const [header, field] of Object.entries(FIELD_MAPPING)) {
    const idx = columnIndexMap[header]
    if (idx === undefined) continue
    const raw = row[idx]
    if (field === 'boqRelated' || field === 'amountChangeFlag') vo[field] = parseBoolean(raw)
    else if (field === 'voAmount')    vo[field] = parseNumber(raw)
    else if (DATE_FIELDS.has(field))  vo[field] = parseDate(raw)
    else if (field === 'voStatus')    vo[field] = raw ? String(raw).toLowerCase().trim() : 'draft'
    else if (field === 'invoiceStatus') {
      // Accept the three valid options (case-insensitive), blank otherwise
      const val = raw ? String(raw).trim() : ''
      const valid = ['Request to Nokia', 'SIT Approved', 'SIT Completed']
      vo[field] = valid.find(v => v.toLowerCase() === val.toLowerCase()) || ''
    }
    else                              vo[field] = raw != null ? String(raw).trim() : ''
  }
  // Ensure required fields have at least empty defaults
  vo.siteId             = vo.siteId             ?? ''
  vo.siteName           = vo.siteName           ?? ''
  vo.jobNumber          = vo.jobNumber          ?? ''
  vo.voCategory         = vo.voCategory         ?? ''
  vo.poSupplierCategory = vo.poSupplierCategory ?? ''
  vo.scope              = vo.scope              ?? ''
  vo.ticketNumber       = vo.ticketNumber       ?? ''
  vo.comment            = vo.comment            ?? ''
  vo.voStatus           = vo.voStatus           || 'draft'
  vo.boqRelated         = vo.boqRelated         ?? false
  vo.poNumber           = vo.poNumber           ?? ''
  vo.poReceivedDate     = vo.poReceivedDate     ?? null
  vo.invoiceStatus      = vo.invoiceStatus      ?? ''
  vo.invoiceDate        = vo.invoiceDate        ?? null
  vo.amountChangeFlag   = vo.amountChangeFlag   ?? false
  return vo
}

function processRows(rows, existingVOs = []) {
  if (rows.length < 2) throw new Error('File has no data rows')

  const headers = rows[0].map(h => String(h ?? '').trim())
  const columnIndexMap = {}
  headers.forEach((h, i) => { if (FIELD_MAPPING[h] !== undefined) columnIndexMap[h] = i })

  const missing = REQUIRED_COLUMNS.filter(c => !(c in columnIndexMap))
  if (missing.length > 0) {
    throw new Error(`Missing required column(s): ${missing.join(', ')}`)
  }

  // Build lookup sets from existing DB records
  const existingTickets = new Set(existingVOs.map(v => v.ticketNumber?.trim().toLowerCase()).filter(Boolean))
  const existingPOs     = new Set(existingVOs.map(v => v.poNumber?.trim().toLowerCase()).filter(Boolean))
  // For description: map desc → Set of PO numbers (lowercased) that already use it
  const existingDescToPOs = {}
  for (const v of existingVOs) {
    const d = v.voDescription?.trim().toLowerCase()
    if (!d) continue
    if (!existingDescToPOs[d]) existingDescToPOs[d] = new Set()
    if (v.poNumber?.trim()) existingDescToPOs[d].add(v.poNumber.trim().toLowerCase())
  }

  // Also track values seen within this import file to catch intra-file duplicates
  const seenDescToPOs = {}  // desc → Set of POs seen so far in this import
  const seenTickets   = new Set()
  const seenPOs       = new Set()

  const vos = []
  const warnings = []

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i]
    if (!row || row.every(c => c == null || c === '')) continue
    try {
      const vo = convertRowToVO(row, columnIndexMap)
      const dupeFields = []

      const desc = vo.voDescription?.trim().toLowerCase()
      const po   = vo.poNumber?.trim().toLowerCase()

      if (desc) {
        const existingPOsForDesc = existingDescToPOs[desc]
        const seenPOsForDesc     = seenDescToPOs[desc]
        if (po) {
          // Same description + has PO: only a duplicate if the PO itself is already used for this description
          if ((existingPOsForDesc?.has(po)) || (seenPOsForDesc?.has(po))) {
            dupeFields.push('VO Description + PO Number')
          } else {
            if (!seenDescToPOs[desc]) seenDescToPOs[desc] = new Set()
            seenDescToPOs[desc].add(po)
          }
        } else {
          // Same description + no PO: always a duplicate if description exists anywhere
          if (existingPOsForDesc !== undefined || seenPOsForDesc !== undefined) {
            dupeFields.push('VO Description (no PO)')
          } else {
            seenDescToPOs[desc] = new Set()
          }
        }
      }

      const ticket = vo.ticketNumber?.trim().toLowerCase()
      if (ticket) {
        if (existingTickets.has(ticket) || seenTickets.has(ticket)) dupeFields.push('Ticket Number')
        else seenTickets.add(ticket)
      }

      if (po) {
        if (existingPOs.has(po) || seenPOs.has(po)) {
          if (!dupeFields.includes('VO Description + PO Number')) dupeFields.push('PO Number')
        } else {
          seenPOs.add(po)
        }
      }

      if (dupeFields.length > 0) {
        warnings.push({ row: i + 1, error: `Duplicate ${dupeFields.join(', ')} — row skipped` })
      } else {
        vos.push(vo)
      }
    } catch (err) {
      warnings.push({ row: i + 1, error: err.message })
    }
  }

  if (vos.length === 0 && warnings.length > 0) throw new Error('All rows were skipped due to duplicates or errors')
  if (vos.length === 0) throw new Error('No valid data rows found in the file')
  return { vos, warnings }
}

export function importFromExcel(file, existingVOs = []) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(new Uint8Array(e.target.result), { type: 'array', cellDates: false })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: true, defval: null })
        resolve(processRows(rows, existingVOs))
      } catch (err) {
        reject(new Error(err.message || 'Error parsing Excel file'))
      }
    }
    reader.onerror = () => reject(new Error('Error reading file'))
    reader.readAsArrayBuffer(file)
  })
}

export function importFromCSV(file, existingVOs = []) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'string' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: true, defval: null })
        resolve(processRows(rows, existingVOs))
      } catch (err) {
        reject(new Error(err.message || 'Error parsing CSV file'))
      }
    }
    reader.onerror = () => reject(new Error('Error reading file'))
    reader.readAsText(file)
  })
}

export function importFromFile(file, existingVOs = []) {
  const name = file.name.toLowerCase()
  if (name.endsWith('.xlsx') || name.endsWith('.xls')) return importFromExcel(file, existingVOs)
  if (name.endsWith('.csv'))                            return importFromCSV(file, existingVOs)
  return Promise.reject(new Error('Unsupported format — use .xlsx, .xls, or .csv'))
}
