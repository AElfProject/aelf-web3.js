// eslint-disable-next-line import/no-unresolved
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // E2E 测试配置
    globals: true,
    environment: 'node',
    testTimeout: 30000, // E2E 测试可能需要更长时间

    // 测试文件匹配 - 只运行 E2E 测试
    include: [
      'test/e2e/**/?(*.)+(test).[jt]s?(x)'
    ],

    // 覆盖率配置 - E2E 测试不计算覆盖率
    coverage: {
      enabled: false
    },

    // 模块解析
    resolve: {
      alias: {
        '^scryptsy$': path.resolve('src/scrypt-polyfill.js')
      }
    },

    // 报告配置
    reporter: ['verbose', 'json', 'html'],
    outputFile: {
      json: './test-results/e2e-results.json',
      html: './test-results/e2e-report.html'
    }
  }
});
