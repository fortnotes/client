/**
 * Compile all Less files into a set of css files with maps.
 *
 * @author DarkPark
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var gulp = require('gulp'),
	less = require('gulp-less'),
	del  = require('del'),
	sourceMaps = require('gulp-sourcemaps'),
	minifyCSS  = require('gulp-minify-css');


gulp.task('less:clean', function ( done ) {
	del(['./build/css'], done);
});


gulp.task('less:develop', function () {
	return gulp.src('./less/develop.less')
		.pipe(sourceMaps.init())
		.pipe(less())
		.pipe(sourceMaps.write('./'))
		.pipe(gulp.dest('./build/css'));
});


gulp.task('less:release', function () {
	return gulp.src('./less/release.less')
		.pipe(less())
		.pipe(minifyCSS())
		.pipe(gulp.dest('./build/css'));
});


gulp.task('less', ['less:develop', 'less:release']);
