export const BACKUP_VERSION = 3

export const BACKUP_LOCAL_STORAGE_KEYS = [
  'invoicePrepIds',
  'flaggedVOIds',
  'flaggedVONotes',
  'voActivityLog',
  'globalData',
  'siteStatusData',
  'ctdImportHistory',
  'manualInvoiceEntries',
  'currentView',
  'admin_activeTab',
  'routineBackupLastRunDate',
  'tv_searchText',
  'tv_filters',
  'tv_visibleColumns',
  'tv_sortColumn',
  'tv_sortDir',
]

export const readBackupJSON = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export const collectLocalStorageData = () => {
  const data = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key) data[key] = localStorage.getItem(key)
  }
  return data
}

export function createFullBackupPayload(vos = [], invoicePrepIds = []) {
  const adminData = readBackupJSON('globalData', null)
  const activityLog = readBackupJSON('voActivityLog', [])
  const siteStatusData = readBackupJSON('siteStatusData', {})
  const flaggedVOIds = readBackupJSON('flaggedVOIds', [])
  const flaggedVONotes = readBackupJSON('flaggedVONotes', {})
  const costImportHistory = readBackupJSON('ctdImportHistory', [])
  const manualInvoiceEntries = readBackupJSON('manualInvoiceEntries', {})
  const invoicePrepIdArray = Array.isArray(invoicePrepIds) ? invoicePrepIds : [...invoicePrepIds]

  const localStorageData = {
    ...collectLocalStorageData(),
    globalData: JSON.stringify(adminData),
    voActivityLog: JSON.stringify(activityLog),
    siteStatusData: JSON.stringify(siteStatusData),
    flaggedVOIds: JSON.stringify(flaggedVOIds),
    flaggedVONotes: JSON.stringify(flaggedVONotes),
    ctdImportHistory: JSON.stringify(costImportHistory),
    manualInvoiceEntries: JSON.stringify(manualInvoiceEntries),
    invoicePrepIds: JSON.stringify(invoicePrepIdArray),
  }

  return {
    _version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    vos,
    invoicePrepIds: invoicePrepIdArray,
    adminData,
    activityLog,
    siteStatusData,
    flaggedVOIds,
    flaggedVONotes,
    costImportHistory,
    manualInvoiceEntries,
    localStorageData,
  }
}

export function downloadBackupPayload(payload, filename = null) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const date = new Date().toISOString().slice(0, 10)
  a.href = url
  a.download = filename || `VariationTracker_Backup_${date}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function downloadFullBackup(vos = [], invoicePrepIds = [], filename = null) {
  const payload = createFullBackupPayload(vos, invoicePrepIds)
  downloadBackupPayload(payload, filename)
  return payload
}
