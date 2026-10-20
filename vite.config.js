import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// GitHub Pages has no SPA fallback: serving index.html as 404.html lets /Portfolio/admin load directly.
const spaFallback = {
  name: 'spa-fallback',
  closeBundle() {
    const dist = resolve(import.meta.dirname, 'dist')
    copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'))
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), spaFallback],
  base: '/Portfolio/',
})
