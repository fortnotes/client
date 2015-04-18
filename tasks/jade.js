/**
 * Compile HTML files from Jade sources.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var gulp    = require('gulp'),
	jade    = require('gulp-jade'),
	plumber = require('gulp-plumber'),
	rename  = require('gulp-rename'),
	del     = require('del'),
	pkgInfo = require('../package.json');


gulp.task('jade:clean:develop', function ( done ) {
	del('./build/debug.html', done);
});


gulp.task('jade:clean:release', function ( done ) {
	del('./build/index.html', done);
});


gulp.task('jade:clean', ['jade:clean:develop', 'jade:clean:release']);


gulp.task('jade:develop', function () {
	return gulp
		.src('./jade/main.jade')
		.pipe(plumber())
		.pipe(jade({
			pretty: '\t',
			locals: {
				debug:   true,
				title:   'FortNotes Web Client (development build)',
				version: pkgInfo.version
			}
		}))
		.pipe(rename('debug.html'))
		.pipe(gulp.dest('./build/'));
});


gulp.task('jade:release', function () {
	return gulp
		.src('./jade/main.jade')
		.pipe(plumber())
		.pipe(jade({
			pretty: '\t',
			locals: {
				debug:   false,
				title:   'FortNotes Web Client',
				version: pkgInfo.version
			}
		}))
		.pipe(rename('index.html'))
		.pipe(gulp.dest('./build/'));
});


gulp.task('jade', ['jade:develop', 'jade:release']);
