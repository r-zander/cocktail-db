'use strict';

let path = require('path');
let gulp = require('gulp');
let conf = require('./conf');

let $ = require('gulp-load-plugins')();


// moves all files in the source tree with unknown ending to the dist folder
gulp.task('other', function () {
	const fileFilter = $.filter(function (file) {
		return file.stat.isFile();
	});

	return gulp.src([
		path.join(conf.paths.src, '/**/*'),
		path.join('!' + conf.paths.src, '/**/*.{html,css,js,ejs}')
	])
		.pipe(fileFilter)
		.pipe(gulp.dest(path.join(conf.paths.dist, '/')));
});