'use strict';
/**
 *  This file contains the variables used in other gulp files
 *  which defines tasks
 *  By design, we only put there very generic config values
 *  which are used in several places to keep good readability
 *  of the tasks
 */

const gutil = require('gulp-util');

/**
 *  The main paths of your project handle these with care
 */
exports.paths = {
	src: 'src',
	dist: 'dist',
	tmp: '.tmp',
	e2e: 'e2e'
};
/**
 * All requests to the `/cocktail-db` path are proxied to `<proxyHost>/cocktail-db`
 * @type {string}
 */
exports.proxyHost = 'http://127.0.0.1:80';

/**
 *  Common implementation for an error handler of a Gulp plugin
 */
exports.errorHandler = function (title) {
	'use strict';

	return function (err) {
		gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
		this.emit('end');
	};
};