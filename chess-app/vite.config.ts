import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages serviert unter /S2M-Tandem-Creator/ – lokal wird '/' genutzt
  base: process.env.GITHUB_ACTIONS ? '/S2M-Tandem-Creator/' : '/',
  server: {
    port: 3000,
  },
})
