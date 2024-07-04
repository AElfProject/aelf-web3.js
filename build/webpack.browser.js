/**
 * @file browser config
 * @author atom-yang
 */

/* eslint-env node */
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.common');
const { OUTPUT_PATH } = require('./utils');

const browserConfig = {
  mode: 'production',
  output: {
    path: OUTPUT_PATH,
    filename: 'aelf.umd.js',
    library: {
      name: 'AElf',
      type: 'umd'
    },
    libraryExport: 'default',
    globalObject: 'globalThis',
    umdNamedDefine: true
  },
  resolve: {
    alias: {},
    fallback: {
      assert: require.resolve('assert'),
      buffer: require.resolve('buffer'),
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      fs: false,
      http: false,
      https: false,
      child_process: false
    }
  },
  externals: {
    xmlhttprequest: {
      commonjs2: 'xmlhttprequest',
      commonjs: 'xmlhttprequest',
      umd: 'xmlhttprequest',
      root: 'xmlhttprequest'
    },
    'xhr2-cookies': {
      commonjs2: 'xmlhttprequest',
      commonjs: 'xmlhttprequest',
      umd: 'xmlhttprequest',
      root: 'xmlhttprequest'
    }
  },
  target: 'web',
  optimization: {
    removeEmptyChunks: true,
    chunkIds: 'total-size',
    moduleIds: 'size',
    sideEffects: true,
    minimize: false
  }
};

module.exports = merge(baseConfig, browserConfig);
