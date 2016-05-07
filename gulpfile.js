/**
 * Gulp main entry point.
 *
 * @author DarkPark
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var path = require('path');


// enable colors in console
require('tty-colors');


// general app paths
global.paths = {
    root:   __dirname,
    tasks:  path.join(__dirname, 'tasks'),
    app:    __dirname,
    build:  path.join(__dirname, 'build'),
    config: path.join(__dirname, 'config')
};


// load tasks
require('./tasks/build');
require('./tasks/img');
require('./tasks/jade');
require('./tasks/lang');
require('./tasks/less');
require('./tasks/lint');
require('./tasks/open');
require('./tasks/repl');
require('./tasks/serve');
require('./tasks/static');
require('./tasks/watch');
require('./tasks/webpack');

//
//// main entry point
//gulp.task('default', ['lint', 'img', 'jade', 'less', 'webpack', 'static'], function () {
//    // rebuild files on modification
//    gulp.watch(['./js/**/*.js'], ['webpack:develop']);
//    gulp.watch(['./jade/**/*.jade'], ['jade:develop']);
//    gulp.watch(['./less/**/*.less'], ['less:develop']);
//
//    // serve livereload
//    glr.listen({quiet: true});
//
//    // reload event
//    gulp.watch(['./build/**/*.{html,js,css}']).on('change', function ( file ) {
//        // report
//        log('watch   '.bgCyan.black, 'reload ' + ('./' + path.relative(path.join(__dirname, '..'), file.path)).bold);
//        // reload
//        glr.changed(file);
//    });
//});
