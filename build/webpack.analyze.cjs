/**
 * @file webpack bundle analyze 分析包大小
 * @author yangmutong
 */

/* eslint-env node */

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const DeadCodePlugin = require('webpack-deadcode-plugin');
const { merge } = require('webpack-merge');
const nodeConfig = require('./webpack.node.js');
const browserConfig = require('./webpack.browser');

const unusedAnalyzeConfig = {
  patterns: ['src/**/*.*'],
  globOptions: {
    ignore: ['**/*.md', 'node_modules/**/*']
  }
};

module.exports = merge(process.env.RUNTIME_ENV === 'node' ? nodeConfig : browserConfig, {
  plugins: [
    new BundleAnalyzerPlugin({ analyzerMode: 'static', generateStatsFile: true }),
    new DeadCodePlugin(unusedAnalyzeConfig)
  ]
});
