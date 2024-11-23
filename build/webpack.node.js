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
  }
};

export default merge(baseConfig, nodeConfig);
