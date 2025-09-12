/**
 * @file node config
 * @author atom-yang
 */

/* eslint-env node */
import { merge } from 'webpack-merge';
import webpack from 'webpack';
import baseConfig from './webpack.common.js';
import { OUTPUT_PATH } from './utils.js';
import FunctionReplacerPlugin from './webpack.function-replacer.js';

const nodeConfig = {
  mode: 'production',
  output: {
    path: OUTPUT_PATH,
    filename: 'aelf.esm.js',
    libraryTarget: 'module',
    globalObject: 'globalThis'
  },
  experiments: {
    outputModule: true
  },
  resolve: {
    alias: {},
    fallback: {
      buffer: 'buffer',
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      assert: false,
      vm: false,
      path: false,
      zlib: false,
      https: false,
      http: false,
      child_process: false,
      fs: false,
      url: false
    }
  },
  optimization: {
    usedExports: true,
    sideEffects: false,
    minimize: true,
    innerGraph: false,
    mangleExports: false
  },
  target: 'es2020',
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer']
    }),
    new webpack.DefinePlugin({
      'typeof window': JSON.stringify('undefined'),
      'typeof global': JSON.stringify('object'),
      'typeof globalThis': JSON.stringify('object'),
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.BannerPlugin({
      banner: '/* eslint-disable */',
      raw: true
    }),
    new FunctionReplacerPlugin()
  ]
};

export default merge(baseConfig, nodeConfig);
