/**
 * Open the default web browser with the given page.
 *
 * @author DarkPark
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var util = require('util'),
	path = require('path'),
	gulp = require('gulp'),
	open = require('open'),
	port = require(path.join(global.paths.config, 'static')).port;


// develop index page
gulp.task('open:develop', function () {
	open(util.format('http://localhost:%s/develop.html', port));
});


// release index page
gulp.task('open:release', function () {
	open(util.format('http://localhost:%s/index.html', port));
});


// default entry point
gulp.task('open', ['open:develop']);
