/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var fs     = require('fs'),
    path   = require('path'),
    runner = require('node-runner'),
    tools  = require('node-runner/lib/tools'),
    xmljs  = require('xml-js'),
    name   = 'svg',
    log    = runner.log.wrap(name);


function importFile ( element, data ) {
    // add content
    element.elements = [{type: 'text', text: data.replace(/\s/g, '')}];

    // clear
    delete element.attributes.src;
}


function importSymbol ( element, data ) {
    // extract content
    data = xmljs.xml2js(data, {
        compact: false,
        trim: true,
        nativeType: true,
        ignoreComment: true,
        ignoreDoctype: true,
        ignoreDeclaration: true
    }).elements[0];

    // add content
    element.attributes.id = 'svg-' + path.basename(element.attributes.src, '.svg');
    element.attributes.viewBox = data.attributes.viewBox;
    element.elements = data.elements;

    // clear
    delete element.attributes.src;
}


function build ( config, done ) {
    var //util = require('util'),
        root, data;

    data = xmljs.xml2js(
        fs.readFileSync(config.source).toString(),
        {compact: false, trim: true, nativeType: true, ignoreComment: true, ignoreDoctype: true, ignoreDeclaration: true}
    );

    root = data.elements[0];
    //console.log(util.inspect(root, {colors: true, depth: 6}));

    root.elements.forEach(function ( element ) {
        var data;

        // external resource
        if ( !element.elements && element.attributes.src ) {
            // get content
            data = fs.readFileSync(path.join(config.path, element.attributes.src)).toString();

            if ( element.name === 'symbol' ) {
                importSymbol(element, data);
            } else {
                importFile(element, data);
            }
        }
    });

    // save generated result
    tools.write([{name: config.target, data: xmljs.js2xml(data, {spaces: config.spaces})}], log, done);
    //console.log(util.inspect(root, {colors: true, depth: 6}));
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
