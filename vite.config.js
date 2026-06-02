import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    vue(),
    nodePolyfills({
      include: ['buffer', 'process', 'string_decoder'],
      globals: {
        Buffer: true,
        global: true,
        process: true
      },
      protocolImports: true
    })
  ],
  server: {
    port: 5100,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
