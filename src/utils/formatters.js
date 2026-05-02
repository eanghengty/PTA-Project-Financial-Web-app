/**
 * Format date to readable string (DD/MM/YYYY)
 */
export function formatDate(date) {
  if (!date) return '-'
  // Parse YYYY-MM-DD strings directly to avoid UTC→local timezone shift
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}/.test(date)) {
    const [year, month, day] = date.slice(0, 10).split('-')
    return `${day}/${month}/${year}`
  }
  const d = new Date(date)
  if (isNaN(d.getTime())) return '-'
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

/**
 * Format currency
 */
export function formatCurrency(amount) {
  if (!amount && amount !== 0) return '-'
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

/**
 * Format currency in compact form: $1.23M, $456.7K, $999
 * Used for dashboard KPIs and charts.
 */
export function formatCompact(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '-'
  const abs = Math.abs(amount)
  const sign = amount < 0 ? '-' : ''
  if (abs >= 1_000_000) {
    const val = abs / 1_000_000
    return `${sign}$${val % 1 === 0 ? val.toFixed(0) : val.toFixed(val >= 10 ? 1 : 2)}M`
  }
  if (abs >= 1_000) {
    const val = abs / 1_000
    return `${sign}$${val % 1 === 0 ? val.toFixed(0) : val.toFixed(val >= 10 ? 1 : 2)}K`
  }
  return `${sign}$${abs.toFixed(2)}`
}

/**
 * Format boolean as Yes/No
 */
export function formatBoolean(value) {
  return value ? 'Yes' : 'No'
}

/**
 * Format status with color
 */
export function getStatusColor(status) {
  const colors = {
    'draft': 'gray',
    'submitted': 'blue',
    'pending-approval': 'yellow',
    'approved': 'green',
    'rejected': 'red',
    'cancelled': 'slate'
  }
  return colors[status] || 'gray'
}

/**
 * Format status display text
 */
export function formatStatus(status) {
  const display = {
    'draft': 'Draft',
    'submitted': 'Submitted',
    'pending-approval': 'Pending Approval',
    'approved': 'Approved',
    'rejected': 'Rejected',
    'cancelled': 'Cancelled'
  }
  return display[status] || status
}

/**
 * Calculate days between two dates
 */
export function daysBetween(date1, date2) {
  if (!date1 || !date2) return null
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffMs = Math.abs(d2 - d1)
  return Math.floor(diffMs / (1000 * 60 * 60 * 24))
}

/**
 * Format file size
 */
export function formatFileSize(bytes) {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
