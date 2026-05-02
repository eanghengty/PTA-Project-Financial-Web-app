import * as XLSX from 'xlsx'

const COLUMN_HEADERS = [
  'Site ID',
  'Site Name',
  'VO Description',
  'VO Amount',
  'VO Category',
  'Scope',
  'BOQ Related',
  'Email Sent to Nokia',
  'Email Approved from Nokia',
  'Ticket Submission Date',
  'Ticket Number',
  'Ticket Approval Date',
  'VO Status',
  'PO Status',
  'PO Number',
  'PO Received Date',
  'Invoice Status',
  'Invoice Date',
  'Amount Change Flag',
  'Comment'
]

const FIELD_MAPPING = [
  'siteId',
  'siteName',
  'voDescription',
  'voAmount',
  'voCategory',
  'scope',
  'boqRelated',
  'emailSentToNokia',
  'emailApprovedFromNokia',
  'ticketSubmissionDate',
  'ticketNumber',
  'ticketApprovalDate',
  'voStatus',
  '_poStatus',   // computed
  'poNumber',
  'poReceivedDate',
  'invoiceStatus',
  'invoiceDate',
  'amountChangeFlag',
  'comment'
]

/**
 * Format date for export
 */
function formatDate(date) {
  if (!date) return ''
  const d = new Date(date)
  return d.toISOString().split('T')[0] // YYYY-MM-DD
}

/**
 * Convert VOs to sheet data
 */
function convertVOsToSheetData(vos) {
  const data = [COLUMN_HEADERS]

  vos.forEach(vo => {
    const row = FIELD_MAPPING.map(field => {
      if (field === '_poStatus') return vo.poNumber?.trim() ? 'Have PO' : 'No PO'
      const value = vo[field]
      if (field.includes('Date') || field === 'emailSentToNokia' || field === 'emailApprovedFromNokia' || field === 'poReceivedDate') {
        return formatDate(value)
      }
      if (field === 'boqRelated' || field === 'amountChangeFlag') {
        return value ? 'Yes' : 'No'
      }
      if (field === 'voAmount') {
        return value || 0
      }
      return value || ''
    })
    data.push(row)
  })

  return data
}

/**
 * Export VOs to Excel
 */
export function exportToExcel(vos, filename = null) {
  try {
    const data = convertVOsToSheetData(vos)
    const ws = XLSX.utils.aoa_to_sheet(data)

    // Set column widths
    ws['!cols'] = [
      { wch: 12 },  // Site ID
      { wch: 15 },  // Site Name
      { wch: 20 },  // VO Description
      { wch: 12 },  // VO Amount
      { wch: 15 },  // VO Category
      { wch: 15 },  // Scope
      { wch: 12 },  // BOQ Related
      { wch: 18 },  // Email Sent
      { wch: 18 },  // Email Approved
      { wch: 18 },  // Ticket Submission
      { wch: 15 },  // Ticket Number
      { wch: 18 },  // Ticket Approval
      { wch: 15 },  // Status
      { wch: 12 },  // PO Status
      { wch: 15 },  // PO Number
      { wch: 18 },  // PO Received Date
      { wch: 18 },  // Invoice Status
      { wch: 15 },  // Invoice Date
      { wch: 18 },  // Amount Change Flag
      { wch: 40 },  // Comment
    ]

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Variations')

    const filenameWithTimestamp = filename || `Variations_${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(wb, filenameWithTimestamp)

    return true
  } catch (err) {
    console.error('Error exporting to Excel:', err)
    throw err
  }
}

/**
 * Export VOs to CSV
 */
export function exportToCSV(vos, filename = null) {
  try {
    const data = convertVOsToSheetData(vos)

    // Convert to CSV format
    const csv = data
      .map(row =>
        row.map(cell => {
          const str = String(cell || '')
          // Escape quotes and wrap in quotes if contains comma or quotes
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`
          }
          return str
        }).join(',')
      )
      .join('\n')

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    const filenameWithTimestamp = filename || `Variations_${new Date().toISOString().split('T')[0]}.csv`

    link.setAttribute('href', url)
    link.setAttribute('download', filenameWithTimestamp)
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    return true
  } catch (err) {
    console.error('Error exporting to CSV:', err)
    throw err
  }
}
