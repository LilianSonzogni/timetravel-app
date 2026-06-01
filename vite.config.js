import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  build: {
    // Raise warning threshold — framer-motion is intentionally large
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // Split vendor chunks for better long-term caching (function form for Rolldown/Vite 8+)
        manualChunks(id) {
          if (id.includes('framer-motion')) return 'motion-vendor'
          if (id.includes('react-dom') || id.includes('react/')) return 'react-vendor'
        },
      },
    },

    // Target modern browsers (drops legacy polyfills, smaller output)
    target: 'es2020',
  },

  // Proxy /api/* to the local API server (scripts/local-api.js on port 3001)
  // This mirrors Vercel's routing in production without needing vercel dev.
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },

  // Allow Vite preview to serve on the network (useful for local testing before deploy)
  preview: {
    host: true,
    port: 4173,
  },
})
