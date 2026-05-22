import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import { initDatabase, getAllVOs } from './db/indexdb'
import router from './router'

// Initialize database and load initial data
async function initApp() {
  try {
    await initDatabase()
    console.log('Database initialized')

    // Pre-load VOs into the store
    const vos = await getAllVOs()
    console.log('Pre-loaded VOs:', vos.length)

    const app = createApp(App)
    app.use(router)
    app.mount('#app')
  } catch (err) {
    console.error('Initialization error:', err?.message ? String(err.message) : 'Unknown error')
    const app = createApp(App)
    app.use(router)
    app.mount('#app')
  }
}

initApp()
