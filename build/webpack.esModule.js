/**
 * @file node config
 * @author atom-yang
 */

/* eslint-env node */
import { merge } from 'webpack-merge';
import baseConfig from './webpack.common.js';
import { OUTPUT_PATH } from './utils.js';

const nodeConfig = {
  mode: 'production',
  output: {
    path: OUTPUT_PATH,
    filename: 'aelf.esm.js',
    libraryTarget: 'module'
  },
  experiments: {
    outputModule: true
  },
  resolve: {
    alias: {},
    fallback: {
      crypto: 'crypto-browserify',
      stream: 'stream-browserify'
    }
  }
};

export default merge(baseConfig, nodeConfig);
