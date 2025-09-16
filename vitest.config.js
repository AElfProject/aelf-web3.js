// eslint-disable-next-line import/no-unresolved
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // 基础配置
    globals: true,
    environment: 'node',
    testTimeout: 20000,

    // 测试文件匹配
    include: [
      'test/unit/**/?(*.)+(test).[jt]s?(x)',
      'test/unit/util/httpProvider.node-test.js',
      'test/unit/util/httpProvider.fetch.node-test.js'
    ],

    // 覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'html'],
      reportsDirectory: 'coverage',
      include: [
        'src/chain/*.js',
        'src/contract/*.js',
        'src/util/*.js',
        'src/wallet/*.js',
        'src/index.js'
      ],
      exclude: [
        'src/types/*.js',
        'node_modules/**',
        'examples/**',
        'dist/**',
        'scripts/**',
        'build/**',
        'src/scrypt-polyfill.js'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    },

    // 模块解析
    resolve: {
      alias: {
        '^scryptsy$': path.resolve('src/scrypt-polyfill.js')
      }
    }
  }
});
