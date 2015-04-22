/**
 * All the tasks to remove and copy all images.
 *
 * @author DarkPark
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var gulp    = require('gulp'),
	plumber = require('gulp-plumber'),
	del     = require('del');


gulp.task('img:clean', function ( done ) {
	del(['./build/img/**'], done);
});


gulp.task('img', ['img:clean'], function () {
	return gulp
		.src(['./img/**'])
		.pipe(plumber())
		.pipe(gulp.dest('./build/img/'));
});
