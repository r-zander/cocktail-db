'use strict';

const path = require('path');
const gulp = require('gulp');
const gutil = require('gulp-util');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const WebpackDevServer = require("webpack-dev-server");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const _ = require('lodash');
const glob = require("glob");

const conf = require('./conf');
const webpackConf = require('./webpack.config');

// packs all javascript files into one and puts them in the dist folder
gulp.task('webpack', ['clean'], () => {

	const sources = [
		path.join(conf.paths.src, '/index.module.js'),
		path.join(conf.paths.src, '/**/*.css'),
		path.join(conf.paths.src, '/**/*.html')
	];


	let wbConf = _.extend(webpackConf);
	wbConf.plugins = wbConf.plugins.concat([
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: true
		}),
		new OptimizeCssAssetsPlugin({
			cssProcessorOptions: {discardComments: {removeAll: true}}
		})
	]);

	return gulp.src(sources) //TODO better entrance
		.pipe(webpackStream(webpackConf, webpack))
		.pipe(gulp.dest(conf.paths.dist));
});

gulp.task("serve", function (callback) {
	// modify some webpack config options
	let devConf = _.extend(webpackConf);
	devConf.devtool = "inline-sourcemap";
	devConf.stats = devConf.stats || {};
	devConf.stats.errorDetails = true;

	//---- entries
	let sources = [
		path.join(conf.paths.src, '/index.module.js'),
		path.join(conf.paths.src, '/**/*.css'),
		path.join(conf.paths.src, '/**/*.svg'),
		path.join(conf.paths.src, '/**/*.png'),
		path.join(conf.paths.src, '/**/*.json'),
		path.join(conf.paths.src, '/**/*.html')
	];
	sources = sources.map((f) => glob.sync(f));
	sources = [].concat.apply([], sources);
	sources = sources.map(f => './' + f);
	for (let s of sources) {
		console.log(s);
	}
	devConf.entry = sources; //"./src/app/index.module.js";

	let port = 4000;
	devConf.entry.unshift('webpack-dev-server/client?http://localhost:' + port + '/');

	//---- boot server
	// Start a webpack-dev-server
	new WebpackDevServer(webpack(devConf), {
		stats: {
			colors: true
		},
		clientLogLevel: "warning",
		contentBase: path.join(__dirname, "dist"),
		port: port,
		disableHostCheck: true,
		watchContentBase: true,
		proxy: {
			'/cocktail-db/**': {
				target: conf.proxyHost,
				secure: false,
				changeOrigin: true,
			},
		},
	}).listen(port, "0.0.0.0", function (err) {
		if (err) {
			throw new gutil.PluginError("webpack-dev-server", err);
		}
		gutil.log("[webpack-dev-server]", "http://localhost:" + port);
	});
});