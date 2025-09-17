import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    open: true
  },
  define: {
    global: 'globalThis',
  },
  // optimizeDeps: {
  //   include: ['buffer', 'encoding']
  // },
  resolve: {
    alias: {
      // buffer: 'buffer',
      // process: 'process/browser',
      // util: 'util',
      // stream: 'stream-browserify',
      // // crypto: 'crypto-browserify',
      // vm: 'vm-browserify',
      // path: 'path-browserify',
      // os: 'os-browserify/browser',
      // encoding: 'encoding',
      // fs: false,
      // net: false,
      // tls: false,
      // child_process: false
    }
  }
})
