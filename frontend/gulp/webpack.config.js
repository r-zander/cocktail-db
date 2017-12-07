'use strict';

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SimpleProgressPlugin = require('webpack-simple-progress-plugin');

module.exports = {
	devtool: 'source-map', //alternatively during development: 'inline-source-map'
	output: {
		filename: "[name].[chunkhash:8].js"
	},
	module: {
		rules: [
			{
				// transpile ngAnntotations
				test: /\.js$/,
				use: [
					{
						loader: 'ng-annotate-loader'
					}
				],
			}, {
				// transpile javascript
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015']
				}
			}, {
				// transpile sass
				test: /\.scss$/,
				exclude: /(node_modules|bower_components)/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					//resolve-url-loader may be chained before sass-loader if necessary
					use: ['css-loader', 'resolve-url-loader', 'sass-loader']
				})
			}, {
				// bundle all stylesheets
				test: /\.css$/,
				// ExtractTextPlugin puts all the css in one bundle
				loader: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader', 'resolve-url-loader']
				})
			}, {
				// put fonts in `font/<file>`
				test: /\.(eot|svg|ttf|woff|woff2?)$/,
				use: 'file-loader?name=fonts/[name].[ext]'
			}, {
				// put html in `/<file>`
				test: /\.html$/,
				use: 'file-loader?context=./src&name=./[path]/[name].[ext]'
			}, {
				// move other files
				test: /\.(jpe?g|gif|png|mp3|svg|json)$/,
				use: 'file-loader?context=./src&name=./[path]/[name].[ext]'
			}
		]
	},
	plugins: [
		new SimpleProgressPlugin(),
		new ExtractTextPlugin('styles.[chunkhash:8].css'),
		new HtmlWebpackPlugin({
            template: 'src/index.ejs',
            baseUrl: '/cocktail-db/'
		})
	]
};
