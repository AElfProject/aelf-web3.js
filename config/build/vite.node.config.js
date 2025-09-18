import { defineConfig } from 'vite';
import { resolve } from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pkg = require('../../package.json');
const { version, name } = pkg;

const banner = `/*! ${name}.js v${version} \n(c) 2019-${new Date().getFullYear()} AElf \nReleased under MIT License */`;

export default defineConfig({
  build: {
    outDir: '../../dist',
    lib: {
      entry: resolve(__dirname, '../../src/index.js'),
      name: 'AElf',
      formats: ['cjs'],
      fileName: (format) => 'aelf.cjs'
    },
    rollupOptions: {
      external: (id) => {
        // Externalize Node.js built-in modules
        return ['fs', 'path', 'crypto', 'stream', 'util', 'buffer', 'events', 'http', 'https', 'url', 'zlib', 'querystring', 'os', 'child_process'].includes(id);
      },
      output: {
        banner,
        exports: 'default'
      }
    },
    sourcemap: true,
    minify: false,
    target: 'node14'
  },
  define: {
    'process.env.RUNTIME_ENV': JSON.stringify('node'),
    'process.env.SDK_VERSION': JSON.stringify(version)
  },
  resolve: {
    alias: {}
  }
});
