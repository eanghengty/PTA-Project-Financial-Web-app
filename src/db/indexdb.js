import { v4 as uuidv4 } from 'uuid'

const DB_NAME = 'VariationTrackerDB'
const DB_VERSION = 3
const STORE_NAME = 'variations'

let db = null

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
      const oldVersion = event.oldVersion

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        // Fresh install — create store with all indexes
        const store = database.createObjectStore(STORE_NAME, { keyPath: 'id' })
        store.createIndex('siteId', 'siteId', { unique: false })
        store.createIndex('voStatus', 'voStatus', { unique: false })
        store.createIndex('voCategory', 'voCategory', { unique: false })
        store.createIndex('voAmount', 'voAmount', { unique: false })
        store.createIndex('emailApprovedFromNokia', 'emailApprovedFromNokia', { unique: false })
        store.createIndex('siteName', 'siteName', { unique: false })
        store.createIndex('ticketNumber', 'ticketNumber', { unique: false })
        store.createIndex('createdAt', 'createdAt', { unique: false })
        store.createIndex('jobNumber', 'jobNumber', { unique: false })
      } else {
        const store = event.target.transaction.objectStore(STORE_NAME)
        if (oldVersion < 2 && !store.indexNames.contains('jobNumber')) {
          store.createIndex('jobNumber', 'jobNumber', { unique: false })
        }
        if (oldVersion < 3) {
          if (!store.indexNames.contains('poNumber'))       store.createIndex('poNumber',       'poNumber',       { unique: false })
          if (!store.indexNames.contains('invoiceStatus'))  store.createIndex('invoiceStatus',  'invoiceStatus',  { unique: false })
          if (!store.indexNames.contains('invoiceDate'))    store.createIndex('invoiceDate',    'invoiceDate',    { unique: false })
          if (!store.indexNames.contains('amountChangeFlag')) store.createIndex('amountChangeFlag', 'amountChangeFlag', { unique: false })
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

      const updatedVO = JSON.parse(JSON.stringify({
        ...vo,
        ...voData,
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
