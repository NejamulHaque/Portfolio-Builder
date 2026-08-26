import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Any request starting with /api will be forwarded to IRUS AI
      '/api': {
        target: 'https://irus-ai.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path, // Keeps /api/v1/chat as /api/v1/chat
      },
    },
  },
})