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


runner.task('init', function ( done ) {
    tools.mkdir([target], runner.log.wrap('init'), function ( error ) {
        done(error);
    });
});

runner.task('svg:build', function () {
    var fs    = require('fs'),
        util  = require('util'),
        xmljs = require('xml-js'),
        root, data;

    function load ( element ) {
        var data = xmljs.xml2js(
            fs.readFileSync(path.join(source, 'img', element.attributes.src)).toString(),
            {compact: false, trim: true, nativeType: true, ignoreComment: true, ignoreDoctype: true, ignoreDeclaration: true}
        ).elements[0];

        delete element.attributes.src;

        element.attributes.id      = data.attributes.id;
        element.attributes.viewBox = data.attributes.viewBox;
        element.elements = data.elements;
        //console.log(util.inspect(data, {colors: true, depth: 6}));
    }

    data = xmljs.xml2js(
        fs.readFileSync(path.join(source, 'img', 'main.svg')).toString(),
        {compact: false, trim: true, nativeType: true, ignoreComment: true, ignoreDoctype: true, ignoreDeclaration: true}
    );

    root = data.elements[0];
    //console.log(util.inspect(root, {colors: true, depth: 6}));

    root.elements.forEach(function ( element ) {
        if ( element.name === 'style' ) {
            element.elements[0].text = element.elements[0].text.replace(/\s/g, '');
        }
        // symbol without content
        if ( element.name === 'symbol' && !element.elements && element.attributes.src ) {
            load(element);
        }
    });

    //console.log(xmljs.js2xml(data, {spaces: 4}));
    fs.writeFileSync(path.join(target, 'images.svg'), xmljs.js2xml(data, {spaces: 4}));
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
