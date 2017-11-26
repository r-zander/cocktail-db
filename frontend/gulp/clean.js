'use strict';

/**
 * @file Gulp task to clean up build directories
 */

const path = require('path');
const gulp = require('gulp');
const conf = require('./conf');

const $ = require('gulp-load-plugins')();

// clears the entire dist folder
gulp.task('clean', () => {
	return gulp.src(path.join(conf.paths.dist, '/*'))
		.pipe($.rimraf());
});

gulp.task('clean:js', () => {
	return cleanExt('js');
});

gulp.task('clean:css', () => {
	return cleanExt('css');
});

function cleanExt(ext) {
	const glob = '/**/*.' + ext;
	return gulp.src([
		path.join(conf.paths.dist, glob),
		path.join(conf.paths.dist, glob + '.map'),
	])
		.pipe($.rimraf());
}