import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// Proxy config mirrors Render exactly — all Flask routes forwarded to local Flask (port 5000)
// This file is dev-only. Render never uses it. Safe to change freely.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // API routes
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      // Auth & user pages
      '/login': { target: 'http://127.0.0.1:5000', changeOrigin: true },
      '/register': { target: 'http://127.0.0.1:5000', changeOrigin: true },
      '/logout': { target: 'http://127.0.0.1:5000', changeOrigin: true },
      '/profile': { target: 'http://127.0.0.1:5000', changeOrigin: true },
      // Google OAuth
      '/auth': { target: 'http://127.0.0.1:5000', changeOrigin: true },
      // Page routes served by Flask
      '/dashboard': { target: 'http://127.0.0.1:5000', changeOrigin: true },
      '/map': { target: 'http://127.0.0.1:5000', changeOrigin: true },
      '/change-analysis': { target: 'http://127.0.0.1:5000', changeOrigin: true },
      '/geo-images': { target: 'http://127.0.0.1:5000', changeOrigin: true },
      '/satellite': { target: 'http://127.0.0.1:5000', changeOrigin: true },
      '/satellite-analysis': { target: 'http://127.0.0.1:5000', changeOrigin: true },
      '/interventions': { target: 'http://127.0.0.1:5000', changeOrigin: true },
      '/analytics': { target: 'http://127.0.0.1:5000', changeOrigin: true },
      '/reports': { target: 'http://127.0.0.1:5000', changeOrigin: true },
      // Static assets served by Flask
      '/data': { target: 'http://127.0.0.1:5000', changeOrigin: true },
      '/watersight-logo.png': { target: 'http://127.0.0.1:5000', changeOrigin: true },
    }
  }
})

