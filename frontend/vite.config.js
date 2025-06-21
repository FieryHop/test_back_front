import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' // Добавьте эту строку

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Добавьте этот алиас
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false
      }
    }
  }
})