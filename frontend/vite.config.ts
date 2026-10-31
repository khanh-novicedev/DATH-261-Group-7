import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_PROXY_TARGET ?? 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@shared': '/src/Shared',
      '@student': '/src/Features Student',
      '@teacher': '/src/Features Teacher',
      '@admin': '/src/Features Admin',
      '@common': '/src/Common Pages',
      '@routes': '/src/Routes',
    },
  },
})
