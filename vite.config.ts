// vite.config.ts

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'url' // <-- 1. Importe as ferramentas de URL do Node.js

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 2. Use o método moderno com 'import.meta.url' para criar o caminho correto
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})