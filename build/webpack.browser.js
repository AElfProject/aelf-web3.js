/**
 * @file browser config
 * @author atom-yang
 */

/* eslint-env node */
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const baseConfig = require('./webpack.common');
const { OUTPUT_PATH } = require('./utils');

const browserConfig = {
  mode: 'production',
  output: {
    path: OUTPUT_PATH,
    filename: 'aelf.umd.js',
    library: 'AElf',
    libraryTarget: 'umd',
    libraryExport: 'default',
    globalObject: 'globalThis',
    umdNamedDefine: true
  },
  resolve: {
    alias: {},
    fallback: {
      process: false,
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
  node: {
    global: true
  },
  optimization: {
    removeEmptyChunks: true,
    chunkIds: 'total-size',
    moduleIds: 'size',
    sideEffects: true,
    minimize: false
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer']
    }),
    // fix "process is not defined" error:
    new webpack.ProvidePlugin({
      process: 'process/browser'
    })
  ]
};

module.exports = merge(baseConfig, browserConfig);
