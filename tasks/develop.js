/**
 * Runner tasks
 */

'use strict';

var path    = require('path'),
    runner  = require('node-runner'),
    tools   = require('node-runner/lib/tools'),
    webpack = require('webpack'),
    tasks   = require('spa-tasks'),
    source  = 'src',
    target  = path.join('build', 'develop');


// activate popup notifications on errors
require('node-runner/lib/notify');

// add system task "status"
// to get all tasks running state
require('node-runner/lib/status');


tasks.eslint({
    watch: [
        path.join(source, 'js', '**', '*.js'),
        path.join('tasks', '**', '*.js')
    ]
});

tasks.gettext({
    languages: ['ru'],
    source: path.join(source, 'lang'),
    target: path.join(target, 'lang'),
    jsData: path.join(target, 'main.js')
});

tasks.livereload({
    watch: [
        path.join(target, '**', '*'),
        '!' + path.join(target, '**', '*.map'),
        '!' + path.join(target, '**', '*.svg')
    ]
});

tasks.pug({
    source: path.join(source, 'pug', 'main.pug'),
    target: path.join(target, 'index.html'),
    variables: {
        develop: true,
        package: require('../package')
    }
});

tasks.repl({});

tasks.sass({
    file: path.join(source, 'sass', 'develop.scss'),
    outFile: path.join(target, 'main.css'),
    sourceMap: path.join(target, 'main.css.map')
});

tasks.static({
    open: path.join(target)
});

tasks.webpack({
    entry: path.resolve(path.join(source, 'js', 'main.js')),
    output: {
        filename: 'main.js',
        path: path.resolve(target),
        sourceMapFilename: 'main.js.map'
    },
    resolve: {
        alias: {
            'app:config': path.resolve(path.join(source, 'js', 'config.js'))
        }
    },
    devtool: 'source-map',
    plugins: [
        // global constants
        new webpack.DefinePlugin({
            DEVELOP: true,
            LIVERELOAD: {
                port: 35729
            }
        })
    ]
});

require('./svg')({
    source: path.join(source, 'img', 'svg.xml'),
    target: path.join(target, 'images.svg'),
    spaces: 4
});

runner.task('init', function ( done ) {
    tools.mkdir([target], runner.log.wrap('init'), function ( error ) {
        done(error);
    });
});

runner.task('build', runner.serial('svg:build', 'sass:build', 'webpack:build', 'pug:build'));

// eslint-disable-next-line no-unused-vars
runner.task('watch', function ( done ) {
    //runner.watch(path.join(source, 'js', '**', '*.js'), 'webpack:build');
    runner.watch([
        path.join(source, 'pug', '**', '*.pug'),
        path.join(target, 'images.svg')
        //path.join(target, 'main.css'),
        //path.join(target, 'main.js')
    ], 'pug:build');
    runner.watch(path.join(source, 'sass', '**', '*.scss'), 'sass:build');
    runner.watch(path.join(source, 'img', '**', '*.svg'), 'svg:build');
    runner.run('eslint:watch');
    runner.run('webpack:watch');
    //runner.run('livereload:watch');
});

runner.task('serve', runner.parallel('static:start', 'livereload:start', 'repl:start'));

//runner.task('default', runner.serial('build', runner.parallel('watch', 'serve')));
runner.task('default', runner.parallel('build', 'watch', 'serve'));
