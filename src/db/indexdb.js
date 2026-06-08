import { v4 as uuidv4 } from 'uuid'

const DB_NAME = 'VariationTrackerDB'
const DB_VERSION = 5
const STORE_NAME = 'variations'
const ISSUE_STORE_NAME = 'issueLogs'

let db = null

function normalizeIssueAttachments(attachments = []) {
  return (Array.isArray(attachments) ? attachments : [])
    .map((attachment) => {
      const blob = attachment?.blob instanceof Blob
        ? attachment.blob
        : (attachment?.file instanceof Blob ? attachment.file : null)

      if (!(blob instanceof Blob)) return null

      return {
        id: attachment?.id || uuidv4(),
        name: attachment?.name || 'Attachment',
        type: attachment?.type || blob.type || '',
        size: Number(attachment?.size ?? blob.size ?? 0),
        lastModified: Number(attachment?.lastModified ?? Date.now()),
        blob
      }
    })
    .filter(Boolean)
}

/**
 * Initialize IndexedDB database
 */
export function initDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      db = request.result
      console.log('Database initialized successfully')
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const database = event.target.result
      const store = database.objectStoreNames.contains(STORE_NAME)
        ? event.target.transaction.objectStore(STORE_NAME)
        : database.createObjectStore(STORE_NAME, { keyPath: 'id' })

      const variationIndexes = [
        ['siteId', 'siteId'],
        ['voStatus', 'voStatus'],
        ['voCategory', 'voCategory'],
        ['voAmount', 'voAmount'],
        ['emailApprovedFromNokia', 'emailApprovedFromNokia'],
        ['siteName', 'siteName'],
        ['ticketNumber', 'ticketNumber'],
        ['createdAt', 'createdAt'],
        ['jobNumber', 'jobNumber'],
        ['poNumber', 'poNumber'],
        ['invoiceStatus', 'invoiceStatus'],
        ['invoiceDate', 'invoiceDate'],
        ['amountChangeFlag', 'amountChangeFlag'],
        ['poSupplierCategory', 'poSupplierCategory'],
      ]

      for (const [name, keyPath] of variationIndexes) {
        if (!store.indexNames.contains(name)) {
          store.createIndex(name, keyPath, { unique: false })
        }
      }

      const issueStore = database.objectStoreNames.contains(ISSUE_STORE_NAME)
        ? event.target.transaction.objectStore(ISSUE_STORE_NAME)
        : database.createObjectStore(ISSUE_STORE_NAME, { keyPath: 'id' })

      const issueIndexes = [
        ['siteId', 'siteId'],
        ['siteName', 'siteName'],
        ['status', 'status'],
        ['registerLog', 'registerLog'],
        ['createdAt', 'createdAt'],
      ]

      for (const [name, keyPath] of issueIndexes) {
        if (!issueStore.indexNames.contains(name)) {
          issueStore.createIndex(name, keyPath, { unique: false })
        }
      }
    }
  })
}

/**
 * Get database instance
 */
function getDB() {
  if (!db) {
    throw new Error('Database not initialized')
  }
  return db
}

/**
 * Add a new VO
 */
export function addVO(voData) {
  return new Promise((resolve, reject) => {
    const transaction = getDB().transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    const vo = {
      id: uuidv4(),
      ...voData,
      isDuplicate: voData.isDuplicate === true,
      poSupplierCategory: typeof voData.poSupplierCategory === 'string' ? voData.poSupplierCategory.trim() : '',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const request = store.add(vo)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(vo)
  })
}

/**
 * Update an existing VO
 */
export function updateVO(id, voData) {
  return new Promise((resolve, reject) => {
    const transaction = getDB().transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    const getRequest = store.get(id)
    getRequest.onerror = () => reject(getRequest.error)
    getRequest.onsuccess = () => {
      const vo = getRequest.result
      if (!vo) {
        reject(new Error('VO not found'))
        return
      }

      const hasPoSupplierCategory = Object.prototype.hasOwnProperty.call(voData, 'poSupplierCategory')
      const normalizedPoSupplierCategory = hasPoSupplierCategory
        ? (typeof voData.poSupplierCategory === 'string' ? voData.poSupplierCategory.trim() : '')
        : (typeof vo.poSupplierCategory === 'string' ? vo.poSupplierCategory : '')

      const updatedVO = JSON.parse(JSON.stringify({
        ...vo,
        ...voData,
        poSupplierCategory: normalizedPoSupplierCategory,
        id: vo.id,
        createdAt: vo.createdAt,
        updatedAt: new Date()
      }))

      const updateRequest = store.put(updatedVO)
      updateRequest.onerror = () => reject(updateRequest.error)
      updateRequest.onsuccess = () => resolve(updatedVO)
    }
  })
}

/**
 * Delete a VO
 */
export function deleteVO(id) {
  return new Promise((resolve, reject) => {
    const transaction = getDB().transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    const request = store.delete(id)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(true)
  })
}

/**
 * Get a single VO by ID
 */
export function getVO(id) {
  return new Promise((resolve, reject) => {
    const transaction = getDB().transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)

    const request = store.get(id)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result || null)
  })
}

/**
 * Get all VOs
 */
export function getAllVOs() {
  return new Promise((resolve, reject) => {
    const transaction = getDB().transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)

    const request = store.getAll()
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

/**
 * Get VOs by status
 */
export function getVOsByStatus(status) {
  return new Promise((resolve, reject) => {
    const transaction = getDB().transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const index = store.index('voStatus')

    const request = index.getAll(status)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

/**
 * Get VOs by category
 */
export function getVOsByCategory(category) {
  return new Promise((resolve, reject) => {
    const transaction = getDB().transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const index = store.index('voCategory')

    const request = index.getAll(category)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

/**
 * Get VOs by site ID
 */
export function getVOsBySite(siteId) {
  return new Promise((resolve, reject) => {
    const transaction = getDB().transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const index = store.index('siteId')

    const request = index.getAll(siteId)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

/**
 * Get all unique statuses
 */
export function getUniqueStatuses() {
  return getAllVOs().then(vos => {
    const statuses = new Set(vos.map(vo => vo.voStatus))
    return Array.from(statuses).sort()
  })
}

/**
 * Get all unique categories
 */
export function getUniqueCategories() {
  return getAllVOs().then(vos => {
    const categories = new Set(vos.map(vo => vo.voCategory))
    return Array.from(categories).sort()
  })
}

/**
 * Get all unique site names
 */
export function getUniqueSites() {
  return getAllVOs().then(vos => {
    const sites = new Set(vos.map(vo => vo.siteName))
    return Array.from(sites).sort()
  })
}

/**
 * Bulk insert VOs (for import)
 */
export function bulkInsertVOs(vos) {
  return new Promise((resolve, reject) => {
    const transaction = getDB().transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    const insertedVOs = []
    let completed = 0
    let hasError = false

    vos.forEach((voData, index) => {
      const vo = {
        id: voData.id || uuidv4(),
        ...voData,
        isDuplicate: voData.isDuplicate === true,
        poSupplierCategory: typeof voData.poSupplierCategory === 'string' ? voData.poSupplierCategory.trim() : '',
        createdAt: voData.createdAt || new Date(),
        updatedAt: new Date()
      }

      const request = store.add(vo)
      request.onerror = () => {
        hasError = true
        reject(request.error)
      }
      request.onsuccess = () => {
        insertedVOs[index] = vo
        completed++
        if (completed === vos.length && !hasError) {
          resolve(insertedVOs.filter(Boolean))
        }
      }
    })

    // Handle empty array
    if (vos.length === 0) {
      resolve([])
    }
  })
}

/**
 * Bulk update existing VOs in one transaction
 */
export function bulkPutVOs(vos) {
  return new Promise((resolve, reject) => {
    const transaction = getDB().transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    const updatedVOs = []
    let completed = 0
    let hasError = false

    if (!Array.isArray(vos) || vos.length === 0) {
      resolve([])
      return
    }

    vos.forEach((voData, index) => {
      const vo = JSON.parse(JSON.stringify({
        ...voData,
        isDuplicate: voData.isDuplicate === true,
        poSupplierCategory: typeof voData.poSupplierCategory === 'string' ? voData.poSupplierCategory.trim() : '',
        id: voData.id,
        createdAt: voData.createdAt || new Date(),
        updatedAt: new Date()
      }))

      const request = store.put(vo)
      request.onerror = () => {
        if (hasError) return
        hasError = true
        reject(request.error)
      }
      request.onsuccess = () => {
        updatedVOs[index] = vo
        completed++
        if (completed === vos.length && !hasError) {
          resolve(updatedVOs.filter(Boolean))
        }
      }
    })
  })
}

/**
 * Clear all data
 */
export function clearAllData() {
  return new Promise((resolve, reject) => {
    const transaction = getDB().transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    const request = store.clear()
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(true)
  })
}

/**
 * Add a new issue log record
 */
export function addIssueLog(issueData) {
  return new Promise((resolve, reject) => {
    const transaction = getDB().transaction([ISSUE_STORE_NAME], 'readwrite')
    const store = transaction.objectStore(ISSUE_STORE_NAME)

    const issue = {
      id: uuidv4(),
      siteId: issueData.siteId || '',
      siteName: issueData.siteName || '',
      jobDescription: issueData.jobDescription || '',
      registerLog: issueData.registerLog || null,
      scope: issueData.scope || '',
      amount: Number(issueData.amount || 0),
      status: issueData.status || 'open',
      comment: issueData.comment || '',
      attachments: normalizeIssueAttachments(issueData.attachments),
      createdAt: issueData.createdAt || new Date(),
      updatedAt: new Date()
    }

    const request = store.add(issue)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(issue)
  })
}

/**
 * Update an existing issue log record
 */
export function updateIssueLog(id, issueData) {
  return new Promise((resolve, reject) => {
    const transaction = getDB().transaction([ISSUE_STORE_NAME], 'readwrite')
    const store = transaction.objectStore(ISSUE_STORE_NAME)

    const getRequest = store.get(id)
    getRequest.onerror = () => reject(getRequest.error)
    getRequest.onsuccess = () => {
      const issue = getRequest.result
      if (!issue) {
        reject(new Error('Issue log not found'))
        return
      }

      const hasAttachments = Object.prototype.hasOwnProperty.call(issueData, 'attachments')

      const updatedIssue = {
        ...issue,
        ...issueData,
        id: issue.id,
        amount: Number(issueData.amount ?? issue.amount ?? 0),
        attachments: hasAttachments ? normalizeIssueAttachments(issueData.attachments) : normalizeIssueAttachments(issue.attachments),
        createdAt: issue.createdAt,
        updatedAt: new Date()
      }

      const updateRequest = store.put(updatedIssue)
      updateRequest.onerror = () => reject(updateRequest.error)
      updateRequest.onsuccess = () => resolve(updatedIssue)
    }
  })
}

/**
 * Delete an issue log record
 */
export function deleteIssueLog(id) {
  return new Promise((resolve, reject) => {
    const transaction = getDB().transaction([ISSUE_STORE_NAME], 'readwrite')
    const store = transaction.objectStore(ISSUE_STORE_NAME)

    const request = store.delete(id)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(true)
  })
}

/**
 * Get all issue logs
 */
export function getAllIssueLogs() {
  return new Promise((resolve, reject) => {
    const transaction = getDB().transaction([ISSUE_STORE_NAME], 'readonly')
    const store = transaction.objectStore(ISSUE_STORE_NAME)

    const request = store.getAll()
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}
