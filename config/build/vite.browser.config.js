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
      formats: ['umd'],
      fileName: (format) => 'aelf.umd.js'
    },
    rollupOptions: {
      external: ['xmlhttprequest', 'xhr2-cookies'],
      output: {
        banner,
        globals: {
          xmlhttprequest: 'xmlhttprequest',
          'xhr2-cookies': 'xmlhttprequest'
        }
      }
    },
    sourcemap: true,
    minify: false,
    target: 'es2015'
  },
  define: {
    'process.env.RUNTIME_ENV': JSON.stringify('browser'),
    'process.env.SDK_VERSION': JSON.stringify(version),
    global: 'globalThis'
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
    exclude: ['xmlhttprequest', 'xhr2-cookies'],
    include: ['buffer', 'process/browser', 'minimalistic-assert', 'stream-browserify']
  }
});
