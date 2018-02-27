var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, '');
var APP_DIR = path.resolve(__dirname, 'js');

var config = {
  entry: APP_DIR + '/index.js',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module: {
		rules: [{
			test: /\.json$/,
			loader: 'json'
		},{
			test: /\.jsx?$/,
			exclude: /node_modules/,
			loader: 'babel',
			query: {
				presets: ['es2015', 'react']
			}
		}, {
	    	test: /\.css$/,
			loader: 'style!css?modules',
			include: /flexboxgrid/
	    }]
	},
  resolveLoader: {
    moduleExtensions: ['-loader']
  },
	watch: true
};

module.exports = config;
