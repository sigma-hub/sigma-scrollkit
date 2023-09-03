import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(), 
    cssInjectedByJsPlugin(),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'sigma-scrollkit',
      fileName: 'sigma-scrollkit'
    },
    minify: false,
    rollupOptions: {
      external: ['vue'],
      output: {
        // Global vars for UMD build
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
