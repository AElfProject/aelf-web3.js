// eslint-disable-next-line import/no-unresolved
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // 基础配置
    globals: true,
    environment: 'node',
    testTimeout: 10000,

    // 测试文件匹配 - 只运行compatibility测试
    include: [
      'test/compatibility/**/?(*.)+(test).[jt]s?(x)'
    ],

    // 覆盖率配置 - 不收集compatibility测试的覆盖率
    coverage: {
      enabled: false
    },

    // 模块解析 - compatibility测试不需要alias，直接使用原始模块
    resolve: {
      alias: {}
    }
  }
});
