/* eslint-env node */
import path from 'path';
import webpack from 'webpack';
import { ROOT } from './utils.js';
const pkg = await import(path.resolve(ROOT, './package.json'), {
  assert: { type: 'json' }
});
const { version, name } = pkg;

const banner = `${name}.js v${version} \n(c) 2019-${new Date().getFullYear()} AElf \nReleased under MIT License`;

const baseConfig = {
  entry: path.resolve(ROOT, 'src/index.js'),
  devtool: 'source-map',
  resolve: {
    modules: [path.resolve(ROOT, 'src'), 'node_modules'],
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/wordlists\/(?!english)/,
      contextRegExp: /bip39\/src$/
    }),
    new webpack.DefinePlugin({
      'process.env.RUNTIME_ENV': JSON.stringify(process.env.RUNTIME_ENV || 'browser'),
      'process.env.SDK_VERSION': JSON.stringify(version)
    }),
    new webpack.BannerPlugin(banner)
  ],
  stats: {
    chunkRelations: true
  }
};

export default baseConfig;
