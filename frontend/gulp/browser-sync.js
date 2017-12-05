'use strict';

const path = require('path');
const gulp = require('gulp');
const _ = require('lodash');
const browserSync = require('browser-sync');
const proxyMiddleware = require('http-proxy-middleware');

const conf = require('./conf');

module.exports.start = function (bsConfig) {
	let bs = browserSync.create();
	bsConfig = bsConfig || {};
	/* Proxy API to backend. */
	const server = {
		middleware: proxyMiddleware('/cocktail-db', {
			target: conf.proxyHost,
			// changeOrigin: true
		}),
		baseDir: conf.paths.dist
	};

	const defaultConf = {
		server: server
	};

	bsConfig = _.extend(defaultConf, bsConfig);

	bs.init(bsConfig);
	return bs;
};
