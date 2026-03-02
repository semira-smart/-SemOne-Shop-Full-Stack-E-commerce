import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      '/products': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      '/orders': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      '/admin': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
})
