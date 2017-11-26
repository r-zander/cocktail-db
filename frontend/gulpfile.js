'use strict';
/**
 *  Welcome to your gulpfile!
 *  The gulp tasks are split into several files in the gulp directory
 *  because putting it all here was too long
 */

const gulp = require('gulp');
const gutil = require('gulp-util');
const klawSync = require('klaw-sync');
const path = require('path')

/**
 *  This will load all js or coffee files in the gulp directory
 *  in order to load all gulp tasks
 */
const filterFn = item => (/\.(js|coffee)$/i).test(item.path)
const paths = klawSync('./gulp', {filter: filterFn})

for (let p of paths) {
	gutil.log("Loading: " + path.basename(p.path))
	require(p.path);
}

/**
 *  Default task clean temporaries directories and launch the
 *  main optimization build task
 */
gulp.task('default', ['clean'], function () {
	gulp.start('build');
});
