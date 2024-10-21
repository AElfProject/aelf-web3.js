/**
 * @file browser config
 * @author atom-yang
 */

import { merge } from 'webpack-merge';
import webpack from 'webpack';
import baseConfig from './webpack.common.js';
import { OUTPUT_PATH } from './utils.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

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
    new webpack.ProvidePlugin({
      process: 'process/browser'
    })
  ]
};

export default merge(baseConfig, browserConfig);
