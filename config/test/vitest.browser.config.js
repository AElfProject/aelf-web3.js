// eslint-disable-next-line import/no-unresolved
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // 浏览器环境配置
    globals: true,
    environment: 'jsdom',
    testTimeout: 5000,

    // 设置环境变量
    env: {
      RUNTIME_ENV: 'browser'
    },

    // 设置全局变量
    setupFiles: [],

    // 测试文件匹配
    include: [
      'test/unit/**/?(*.)+(test).[jt]s?(x)',
      'test/unit/util/httpProvider.browser-test.js'
    ],

    // 覆盖率配置
    coverage: {
      provider: 'v8',
      enabled: true,
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
        'build/**'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      },
      reportOnFailure: true,
    },

    // 模块解析
    resolve: {
      alias: {
        '^randombytes$': path.resolve('node_modules/randombytes/index.js')
      }
    }
  }
});
