/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var fs     = require('fs'),
    path   = require('path'),
    runner = require('node-runner'),
    tools  = require('node-runner/lib/tools'),
    name   = 'svg',
    log    = runner.log.wrap(name);


function build ( config, done ) {
    var //util  = require('util'),
        xmljs = require('xml-js'),
        root, data;

    function load ( element ) {
        var data = xmljs.xml2js(
            fs.readFileSync(path.join(config.path, element.attributes.src)).toString(),
            {compact: false, trim: true, nativeType: true, ignoreComment: true, ignoreDoctype: true, ignoreDeclaration: true}
        ).elements[0];


        element.attributes.id      = 'svg-' + path.basename(element.attributes.src, '.svg');
        element.attributes.viewBox = data.attributes.viewBox;
        element.elements = data.elements;

        delete element.attributes.src;
        //console.log(util.inspect(data, {colors: true, depth: 6}));
    }

    data = xmljs.xml2js(
        fs.readFileSync(config.source).toString(),
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

    // save generated result
    tools.write([{name: config.target, data: xmljs.js2xml(data, {spaces: config.spaces})}], log, done);
}


function generator ( config, options ) {
    // sanitize
    config = Object.assign({
        path: path.dirname(config.source || '')
    }, config || {});
    options = Object.assign(generator.options, options || {});

    runner.task(options.prefix + 'config' + options.suffix, function () {
        log.inspect(config, log);
    });

    runner.task(options.prefix + 'build' + options.suffix, function ( done ) {
        build(config, done);
    });

    runner.task(options.prefix + 'clear' + options.suffix, function ( done ) {
        tools.unlink([config.target], log, done);
    });
}


// defaults
generator.options = {
    prefix: name + ':',
    suffix: ''
};


// export main actions
generator.methods = {
    build: build
};


// public
module.exports = generator;
