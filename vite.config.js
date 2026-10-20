import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const base = command === 'build' ? '/royal-rumble/' : '/'

  return {
    plugins: [react(), tailwindcss()],
    base: base,
    build: {
      outDir: 'dist',
    },
  }
})
