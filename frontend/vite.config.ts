import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    cors: true
    cors.origin: ['http://localhost:8080', 'http://localhost:5173']
    
  }
})
