/**
 * Analyse JavaScript code for potential errors and problems.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var gulp    = require('gulp'),
	plumber = require('gulp-plumber'),
	eslint  = require('gulp-eslint'),
	log     = require('./utils').log;


gulp.task('lint', function () {
	return gulp
		.src([
			//'./js/**/*.js',
			'./tasks/**/*.js'
		])
		.pipe(plumber())
		.pipe(eslint())
		.pipe(eslint.format('stylish', function ( result ) {
			// make nice output
			result.split('\n').forEach(function ( line ) {
				log('eslint  '.bgRed, line + ''.reset);
			});
		}));
});
