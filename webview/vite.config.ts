import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../out/webview',
    rollupOptions: {
      output: {
        entryFileNames: 'index.js',
        chunkFileNames: 'chunk.js',
        assetFileNames: 'index.css'
      }
    }
  }
})
