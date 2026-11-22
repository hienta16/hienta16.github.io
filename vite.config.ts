import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// User site (hienta16.github.io) is served from the domain root.
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: { host: '127.0.0.1', port: 5173, strictPort: false },
  preview: { host: '127.0.0.1', port: 4173 },
})
