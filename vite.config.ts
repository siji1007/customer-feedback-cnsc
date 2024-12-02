import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  server: {
    port: 80, // Set the port to 80
    hmr: {
      overlay: false, // Disable the HMR error overlay
    },
  },
})
