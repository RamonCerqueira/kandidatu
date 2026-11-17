import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('/node_modules/')) return
          if (['react', 'react-dom', 'react-router', 'react-router-dom', 'scheduler'].some((name) => id.includes(`/node_modules/${name}/`))) return 'react-vendor'
          if (id.includes('/node_modules/framer-motion/') || id.includes('/node_modules/motion-')) return 'motion'
          if (id.includes('/node_modules/recharts/')) return 'charts'
          if (['react-hook-form', 'zod', '@hookform/resolvers'].some((name) => id.includes(`/node_modules/${name}/`))) return 'forms'
        },
      },
    },
  },
})
