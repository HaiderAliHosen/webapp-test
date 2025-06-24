import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import UnoCSS from 'unocss/vite'
import { presetUno, presetAttributify } from 'unocss'

export default defineConfig({
  plugins: [
    react(),
    UnoCSS({
      presets: [
        presetUno(), // Standard UnoCSS preset
        presetAttributify(), // Enable attribute mode (optional)
      ],
    })
  ],
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'date-fns',
      'axios'
    ]
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  }
})