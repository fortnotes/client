/**
 * Gulp main entry point.
 *
 * @author DarkPark
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var gulp = require('gulp');

// enable colors in console
require('tty-colors');

// load tasks
require('./tasks/img');
require('./tasks/jade');
//require('./tasks/less');
require('./tasks/lint');
//require('./tasks/serve');
require('./tasks/static');
require('./tasks/webpack');


// entry point
gulp.task('default', [], function () {
	//gulp.watch(['./server/**/*.js'], ['apidoc']);
});
