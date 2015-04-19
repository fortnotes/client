/**
 * Main module to setup development environment.
 *
 * @module stb/develop/main
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var dom = require('./lib/dom');

//var app     = require('../app'),
//	storage = require('./storage'),
//	metrics = require('cfg/metrics');
//
//
//// export to globals for easy debugging
//window.app    = app;
//window.router = require('../router');
//
//// set global mode
//app.data.debug = true;
//
//// additional dev modules
//require('./static');
//require('./events');
//require('./debug');

// livereload activation
// load external script
document.head.appendChild(dom.tag('script', {
	type: 'text/javascript',
	src: '//' + location.hostname + ':35729/livereload.js'
}));

// the application itself
require('./main');
