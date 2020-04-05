
var webpack = require('webpack');
var config = require('./webpack.config');
var CompressionPlugin = require("compression-webpack-plugin");
var BrotliPlugin = require('brotli-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

config.plugins.pop();
config.plugins.push(new webpack.DefinePlugin({
    DEBUG: false,
    ENDPOINT: '"https://api.vidimake.com"',
    'typeof global': JSON.stringify('undefined')
}));

config.plugins.push(
	new CompressionPlugin({
		test: /\.(js|html|png|svg|eot)/
	})
);

config.plugins.push(
	new BrotliPlugin({
		asset: '[path].br[query]',
		test: /\.(js|html|png|svg|eot)/
	})
);

config.plugins.push(
  new CopyWebpackPlugin([{
    from: 'robots.txt',
    to: 'robots.txt'
  }])
);

delete config.devtool;
config.mode = "production";

module.exports = config;
