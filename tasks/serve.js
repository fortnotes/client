/**
 * Main entry point.
 * Rebuild everything, start all watchers and servers.
 *
 * @author DarkPark
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var gulp = require('gulp');


// start all services
gulp.task('serve', ['static', 'watch', 'repl']);


// entry point
gulp.task('default', ['build', 'serve']);
