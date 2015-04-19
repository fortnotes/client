/**
 * Gulp main entry point.
 *
 * @author DarkPark
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var path = require('path'),
	gulp = require('gulp'),
	glr  = require('gulp-livereload'),
	log  = require('./tasks/utils').log;


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
gulp.task('default', ['lint', 'img', 'jade', 'webpack', 'static'], function () {
	//gulp.watch(['./server/**/*.js'], ['apidoc']);

	// serve livereload
	glr.listen({quiet: true});

	// reload event
	gulp.watch(['./build/**/*.{html,js,css}']).on('change', function ( file ) {
		// report
		log('watch   '.bgCyan.black, 'reload ' + ('./' + path.relative(path.join(__dirname, '..'), file.path)).bold);
		// reload
		glr.changed(file);
	});
});
