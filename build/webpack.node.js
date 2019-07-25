/**
 * @file node config
 * @author atom-yang
 */

/* eslint-env node */
const merge = require('webpack-merge');
const baseConfig = require('./webpack.common');
const {OUTPUT_PATH} = require('./utils');

const  nodeConfig = {
  mode: 'production',
  output: {
    path: OUTPUT_PATH,
    filename: 'aelf.cjs.js',
    library: 'AElf',
    libraryTarget: 'commonjs2',
    libraryExport: 'default'
  },
  resolve: {
    alias: {
      'scrypt.js$': '../scrypt-polyfill.js',
    }
  },
  target: 'node',
  optimization: {
    removeEmptyChunks: true,
    occurrenceOrder: true,
    sideEffects: true,
    minimize: false
  }
};


module.exports = merge(baseConfig, nodeConfig);
