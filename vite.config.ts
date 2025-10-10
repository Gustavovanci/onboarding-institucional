// Arquivo: vite.config.ts

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Importe o 'path' do Node.js

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // O alias '@' aponta para a pasta 'src'
      '@': path.resolve(__dirname, './src'),
    },
  },
  // A seção 'server' foi removida, pois a configuração padrão do Vite
  // é suficiente e não causará o conflito com o popup do Google.
  // As configurações de segurança para produção já estão no seu 'vercel.json'.
})