import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

const fromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        index: fromRoot('./index.html'),
        popup: fromRoot('./popup.html'),
        content: fromRoot('./src/extension/content.ts'),
        background: fromRoot('./src/extension/background.ts'),
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === 'content') {
            return 'content.js'
          }
          if (chunk.name === 'background') {
            return 'background.js'
          }
          return 'assets/[name].js'
        },
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
})
