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
    filename: 'aelf.cjs',
    library: {
      type: 'commonjs2'
    },
    libraryExport: 'default'
  },
  target: 'node',
  optimization: {
    removeEmptyChunks: true,
    chunkIds: 'total-size',
    moduleIds: 'size',
    sideEffects: true,
    minimize: false
  },
  plugins: [
    new FunctionReplacerPlugin()
  ]
};

export default merge(baseConfig, nodeConfig);
