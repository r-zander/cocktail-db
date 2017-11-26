'use strict';

const gulp = require('gulp');
const gutil = require('gulp-util');
const rename = require("gulp-rename");
const tar = require("gulp-tar");
const gzip = require("gulp-gzip");

const q = require('q');


gulp.task('default', ['build'], function () {
});

gulp.task('build', ['other', 'webpack'], function () {
});


gulp.task('prod', ['other', 'webpack'], function () { // create tarball

	let archiveName = ['ocs-v2'];
	archiveName = archiveName.join('_') + '.tar';

	return gulp.src('./dist/**/*')
		.pipe(rename(function (path) {
			path.dirname = '' + gittag + '/' + path.dirname;
		}))
		.pipe(tar(archiveName))
		.pipe(gzip())
		.pipe(gulp.dest('./bin/'));
});


function gitFnCall(fname) {
	let d = q.defer();

	let args = [];

	args.unshift(function (err, branches) {
		if (err) {
			d.reject(err);
		}
		d.resolve(branches);
	});

	for (let i = 1; i < arguments.length; i++) {
		args.unshift(arguments[i])
	}

	git[fname].apply(git, args);
	return d.promise;
}
