/**
 * @file webpack.config.js
 * @author hzz780
 */

const path = require('path');

module.exports = {
    entry: './tokenTransfer.js',
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'tokenTransfer.bundle.js'
    }
};
