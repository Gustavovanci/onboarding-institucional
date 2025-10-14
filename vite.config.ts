// Arquivo: vite.config.ts

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Importe o 'path' do Node.js

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    headers: {
      // CORREÇÃO: Adicionado para permitir o popup do Google Auth em desenvolvimento
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
  },
})