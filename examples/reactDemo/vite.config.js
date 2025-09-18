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
  resolve: {
    alias: {
      'process': 'process/browser',
      'buffer': 'buffer',
      'assert': 'minimalistic-assert',
      'stream': 'stream-browserify'
    }
  },
  optimizeDeps: {
    include: ['buffer', 'process/browser', 'minimalistic-assert', 'stream-browserify']
  }
  // resolve: {
  //   alias: {
  //     // buffer: 'buffer',
  //     // process: 'process/browser',
  //     // util: 'util',
  //     // stream: 'stream-browserify',
  //     // // crypto: 'crypto-browserify',
  //     // vm: 'vm-browserify',
  //     // path: 'path-browserify',
  //     // os: 'os-browserify/browser',
  //     // encoding: 'encoding',
  //     // fs: false,
  //     // net: false,
  //     // tls: false,
  //     // child_process: false
  //   }
  // }
})
