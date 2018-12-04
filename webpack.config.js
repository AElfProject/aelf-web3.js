const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	mode: 'production',
	// mode: 'development',
	entry: './lib/aelf.js',
	output: {
		path: path.resolve(__dirname, 'output'), // equal to __diname + '/build'
        filename: 'aelf.web.js'
	},
	optimization: {
		minimizer: [new UglifyJsPlugin()]
	}
}