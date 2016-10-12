/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Main application entry point.
	 */
	
	'use strict';
	
	var app   = __webpack_require__(/*! spa-app */ 1),
	    Wamp  = __webpack_require__(/*! spa-wamp */ 10),
	    nodes = __webpack_require__(/*! ./modules/nodes */ 17);
	
	
	// load and show splash page
	app.route(__webpack_require__(/*! ./pages/init */ 18));
	
	
	app.nodes = {};
	
	
	(JSON.parse(localStorage.getItem('nodes')) || []).map(function ( node ) {
	    console.log('found node: ' + node);
	    app.nodes[node] = null;
	    nodes.add(node);
	});
	
	app.nodeId = localStorage.getItem('nodeId');
	if ( !app.nodeId ) {
	    (function () {
	        var array = new Uint8Array(app.config.nodeIdSize),
	            id    = [];
	
	        window.crypto.getRandomValues(array);
	
	        array.forEach(function ( item, index ) {
	            item = item.toString(16);
	            if ( item.length === 1 ) {
	                item = '0' + item;
	            }
	            if ( index && index % 2 === 0 ) {
	                id.push(':');
	            }
	            id.push(item);
	        });
	
	        localStorage.setItem('nodeId', app.nodeId = id.join(''));
	        console.log('generate nodeId: ' + app.nodeId);
	    })();
	}
	
	app.nodeKey = localStorage.getItem('nodeKey');
	if ( !app.nodeKey ) {
	    (function () {
	        var array = new Uint8Array(app.config.nodeKeySize),
	            id    = [];
	
	        window.crypto.getRandomValues(array);
	
	        array.forEach(function ( item ) {
	            item = item.toString(16);
	            if ( item.length === 1 ) {
	                item = '0' + item;
	            }
	            id.push(item);
	        });
	
	        localStorage.setItem('nodeKey', app.nodeKey = id.join(''));
	        console.log('generate nodeKey: ' + app.nodeKey);
	    })();
	}
	
	app.nodeName = localStorage.getItem('nodeName');
	if ( !app.nodeName ) {
	    (function () {
	        var name = prompt('Please enter this node name, e.g., phone or tablet.') || 'new node';
	
	        localStorage.setItem('nodeName', app.nodeName = name);
	    })();
	}
	
	//debug.info('nodeId: ' + app.nodeId);
	//debug.info('nodeName: ' + app.nodeName);
	//window.nodeId.innerHTML = '<b>server</b>: <a>wss.fortnotes.com</a> &nbsp; <b>node id</b>: ' + app.nodeId + ' &nbsp; <b>name</b>: ' + app.nodeName;
	
	
	var time = Date.now();
	app.wamp = new Wamp(
	    'ws://' + (app.query.wampHost || location.hostname) + ':8090/' +  app.nodeId
	);
	
	app.wamp.onopen = function () {
	    console.log('%cwamp connection: open', 'color:green');
	    debug.info('wamp open ' + app.wamp.socket.url, null, {tags: ['open', 'wamp']});
	
	    // app.wamp.call('ping', {}, function ( error, result ) {
	    //     console.log('wamp ping: %s in %sms', result, Date.now() - time);
	    // });
	
	    app.wamp.call('auth', {key: app.nodeKey}, function ( error, result ) {
	        if ( !error ) {
	            // notify
	            app.emit('wamp:open');
	            console.log('wamp auth: %s in %sms', result, Date.now() - time);
	
	            if ( !result ) {
	                app.emit('wamp:auth:error');
	            }
	        }
	    });
	};
	
	app.wamp.onclose = function () {
	    // notify
	    app.emit('wamp:close');
	
	    console.log('%cwamp connection: close', 'color:red');
	    debug.info('wamp close ' + app.wamp.socket.url, null, {tags: ['close', 'wamp']});
	};
	
	
	// DOM is ready
	//app.once('dom', function () {
	
	// load pages
	// app.pages = {
	//     init: require('./pages/init'),
	//     main: require('./pages/main')
	// };
	
	// setTimeout(function () {
	//
	// }, 500);
	
	// load main page
	__webpack_require__(/*! ./pages/main */ 21);
	
	
	//});
	
	
	// everything is ready
	//app.once('load', function () {
	    // show main page
	    //app.route(app.pages.main);
	//});


/***/ },
/* 1 */
/*!*************************************************!*\
  !*** /home/dp/Projects/sdk/spasdk/app/index.js ***!
  \*************************************************/
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @license The MIT License (MIT)
	 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
	 */
	
	/* eslint no-path-concat: 0 */
	
	'use strict';
	
	var //Emitter = require('cjs-emitter'),
	    //router  = require('spa-router'),
	    //parse   = require('cjs-query').parse,
	    app    = __webpack_require__(/*! ./lib/core */ 2),
	    events = __webpack_require__(/*! ./lib/events */ 6);
	
	
	// early return
	//module.exports = app;
	
	
	// url request params
	//app.query = parse(document.location.search.substring(1));
	
	
	// activate development mechanisms and tools
	if ( true ) {
	    __webpack_require__(/*! ./lib/develop/main */ 7);
	}
	
	
	// global application configuration
	// in config.js file in js root
	//app.config = require('app:config');
	
	
	/*app.data = {
	    /!**
	     * Timestamps data.
	     *
	     * @type {Object}
	     * @property {number} init application initialization time (right now)
	     * @property {number} load document onload event
	     * @property {number} done onload event sent and processed
	     *!/
	    // time: {
	    //     init: +new Date(),
	    //     load: 0,
	    //     done: 0
	    // }
	
	    // parameters from get request
	    //query: parse(document.location.search.substring(1))
	};*/
	
	
	//app.activePage = null;
	
	
	// /**
	//  * Make the given inactive/hidden page active/visible.
	//  * Pass some data to the page and trigger the corresponding event.
	//  *
	//  * @param {Page} page item to show
	//  * @param {*} [data] data to send to page
	//  *
	//  * @return {boolean} operation status
	//  */
	// function show ( page, data ) {
	//     // page available and can be hidden
	//     if ( page && !page.active ) {
	//         // apply visibility
	//         page.$node.classList.add('active');
	//         page.active = true;
	//         app.activePage = page;
	//
	//         debug.info('show component ' + page.constructor.name + '#' + page.id, null, {
	//             tags: ['show', 'component', page.constructor.name, page.id]
	//         });
	//         //console.log('component ' + page.constructor.name + '.' + page.id + ' show', 'green');
	//
	//         // there are some listeners
	//         if ( page.events['show'] ) {
	//             // notify listeners
	//             page.emit('show', {page: page, data: data});
	//         }
	//
	//         return true;
	//     }
	//
	//     // nothing was done
	//     return false;
	// }
	//
	//
	// /**
	//  * Make the given active/visible page inactive/hidden and trigger the corresponding event.
	//  *
	//  * @param {Page} page item to hide
	//  *
	//  * @return {boolean} operation status
	//  */
	// function hide ( page ) {
	//     // page available and can be hidden
	//     if ( page && page.active ) {
	//         // apply visibility
	//         page.$node.classList.remove('active');
	//         page.active  = false;
	//         app.activePage = null;
	//
	//         debug.info('hide component ' + page.constructor.name + '#' + page.id, null, {
	//             tags: ['hide', 'component', page.constructor.name, page.id]
	//         });
	//         //console.log('component ' + page.constructor.name + '.' + page.id + ' hide', 'grey');
	//
	//         // there are some listeners
	//         if ( page.events['hide'] ) {
	//             // notify listeners
	//             page.emit('hide', {page: page});
	//         }
	//
	//         return true;
	//     }
	//
	//     // nothing was done
	//     return false;
	// }
	//
	//
	// /**
	//  * Browse to a given page.
	//  * Do nothing if the link is invalid. Otherwise hide the current, show new and update the "previous" link.
	//  *
	//  * @param {Page} pageTo instance of the page to show
	//  * @param {*} [data] options to pass to the page on show
	//  *
	//  * @return {boolean} operation status
	//  */
	// app.route = function ( pageTo, data ) {
	//     var pageFrom = app.activePage;
	//
	//     if ( DEVELOP ) {
	//         //if ( router.pages.length > 0 ) {
	//             if ( !pageTo || typeof pageTo !== 'object' ) { throw new Error(__filename + ': wrong pageTo type'); }
	//             if ( !('active' in pageTo) ) { throw new Error(__filename + ': missing field "active" in pageTo'); }
	//         //}
	//     }
	//
	//     // valid not already active page
	//     if ( pageTo && !pageTo.active ) {
	//         //debug.log('router.navigate: ' + pageTo.id, pageTo === pageFrom ? 'grey' : 'green');
	//         debug.info('app route: ' + pageTo.id, null, {tags: ['route', 'page', pageTo.id]});
	//
	//         // update url
	//         //location.hash = this.stringify(name, data);
	//
	//         // apply visibility
	//         hide(app.activePage);
	//         show(pageTo, data);
	//
	//         // there are some listeners
	//         if ( this.events['route'] ) {
	//             // notify listeners
	//             this.emit('route', {from: pageFrom, to: pageTo});
	//         }
	//
	//         // store
	//         //this.history.push(pageTo);
	//
	//         return true;
	//     }
	//
	//     debug.warn('invalid page to route: ' + pageTo.id, null, {tags: ['route', 'page', pageTo.id]});
	//     //console.log('router.navigate: ' + pageTo.id, 'red');
	//
	//     // nothing was done
	//     return false;
	// };
	
	//app.route = require('./lib/route');
	
	
	/*app.defaultEvents = {
	    DOMContentLoaded: function ( event ) {
	        //debug.event(event);
	        //console.log(event);
	
	        debug.info('app event: ' + event.type, event, {tags: [event.type, 'event']});
	
	        // there are some listeners
	        if ( app.events['dom'] ) {
	            // notify listeners
	            app.emit('dom', event);
	            //console.log('DOMContentLoaded');
	        }
	    },
	
	    /!**
	     * The load event is fired when a resource and its dependent resources have finished loading.
	     *
	     * Control flow:
	     *   1. Global handler.
	     *   2. Each page handler.
	     *   3. Application DONE event.
	     *
	     * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/load
	     *
	     * @param {Event} event generated object with event data
	     *!/
	    load: function ( event ) {
	        //var path;
	
	        //debug.event(event);
	        //console.log(event);
	
	        // time mark
	        //app.data.time.load = event.timeStamp;
	
	        debug.info('app event: ' + event.type, event, {tags: [event.type, 'event']});
	
	        // global handler
	        // there are some listeners
	        if ( app.events[event.type] ) {
	            // notify listeners
	            app.emit(event.type, event);
	        }
	
	        // local handler on each page
	        /!*router.pages.forEach(function forEachPages ( page ) {
	            debug.log('component ' + page.constructor.name + '.' + page.id + ' load', 'green');
	
	            // there are some listeners
	            if ( page.events[event.type] ) {
	                // notify listeners
	                page.emit(event.type, event);
	            }
	        });*!/
	
	        // time mark
	        //app.data.time.done = +new Date();
	
	        // everything is ready
	        // and there are some listeners
	        // if ( app.events['done'] ) {
	        //     // notify listeners
	        //     app.emit('done', event);
	        // }
	    },
	
	    /!**
	     * The unload event is fired when the document or a child resource is being unloaded.
	     *
	     * Control flow:
	     *   1. Each page handler.
	     *   2. Global handler.
	     *
	     * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/unload
	     *
	     * @param {Event} event generated object with event data
	     *!/
	    unload: function ( event ) {
	        //debug.event(event);
	        console.log(event);
	
	        debug.info('app event: ' + event.type, event, {tags: [event.type, 'event']});
	
	        // global handler
	        // there are some listeners
	        if ( app.events[event.type] ) {
	            // notify listeners
	            app.emit(event.type, event);
	        }
	
	        // local handler on each page
	        /!*router.pages.forEach(function forEachPages ( page ) {
	            debug.log('component ' + page.constructor.name + '.' + page.id + ' unload', 'red');
	
	            // there are some listeners
	            if ( page.events[event.type] ) {
	                // notify listeners
	                page.emit(event.type, event);
	            }
	        });*!/
	    },
	
	    /!**
	     * The error event is fired when a resource failed to load.
	     *
	     * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/error
	     *
	     * @param {Event} event generated object with event data
	     *!/
	    error: function ( event ) {
	        //debug.event(event);
	        //console.log(event);
	        debug.fail('app event: ' + event.message, event, {tags: [event.type, 'event']});
	    },
	
	    /!**
	     * The keydown event is fired when a key is pressed down.
	     * Set event.stop to true in order to prevent bubbling.
	     *
	     * Control flow:
	     *   1. Current active component on the active page.
	     *   2. Current active page itself.
	     *   3. Application.
	     *
	     * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/keydown
	     *
	     * @param {Event} event generated object with event data
	     *!/
	    keydown: function ( event ) {
	        var page = app.activePage,
	            activeComponent;
	
	        if ( DEVELOP ) {
	            if ( !page ) { throw new Error(__filename + ': app should have at least one page'); }
	        }
	
	        // filter phantoms
	        //if ( event.keyCode === 0 ) { return; }
	
	        // combined key code
	        //event.code = event.keyCode;
	
	        // apply key modifiers
	        //if ( event.shiftKey ) { event.code += 1000; }
	        //if ( event.altKey )   { event.code += 2000; }
	
	        //debug.event(event);
	        //console.log(event);
	        debug.info('app event: ' + event.type, event, {tags: [event.type, 'event']});
	
	        // page.activeComponent can be set to null in event handles
	        activeComponent = page.activeComponent;
	
	        // current component handler
	        if ( activeComponent && activeComponent !== page ) {
	            // component is available and not page itself
	            if ( activeComponent.events[event.type] ) {
	                // there are some listeners
	                activeComponent.emit(event.type, event);
	            }
	
	            // todo: bubble event recursively
	            // bubbling
	            /!*if (
	                !event.stop &&
	                activeComponent.propagate &&
	                activeComponent.parent &&
	                activeComponent.parent.events[event.type]
	            ) {
	                activeComponent.parent.emit(event.type, event);
	            }*!/
	        }
	
	        // page handler
	        if ( !event.stop ) {
	            // not prevented
	            if ( page.events[event.type] ) {
	                // there are some listeners
	                page.emit(event.type, event);
	            }
	
	            // global app handler
	            if ( !event.stop ) {
	                // not prevented
	                if ( app.events[event.type] ) {
	                    // there are some listeners
	                    app.emit(event.type, event);
	                }
	            }
	        }
	
	        //// suppress non-printable keys in stb device (not in your browser)
	        //if ( app.data.host && keyCodes[event.code] ) {
	        //    event.preventDefault();
	        //}
	    },
	
	    /!**
	     * The keypress event is fired when press a printable character.
	     * Delivers the event only to activeComponent at active page.
	     *
	     * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/keypress
	     *
	     * @param {Event} event generated object with event data
	     * @param {string} event.char entered character
	     *!/
	    keypress: function ( event ) {
	        var page = app.activePage;
	
	        if ( DEVELOP ) {
	            if ( page === null || page === undefined ) { throw new Error(__filename + ': app should have at least one page'); }
	        }
	
	        //debug.event(event);
	        debug.info('app event: ' + event.type, event, {tags: [event.type, 'event']});
	
	        // current component handler
	        if ( page.activeComponent && page.activeComponent !== page ) {
	            // component is available and not page itself
	            if ( page.activeComponent.events[event.type] ) {
	                // there are some listeners
	                page.activeComponent.emit(event.type, event);
	            }
	        }
	    },
	
	    /!**
	     * The click event is fired when a pointing device button (usually a mouse button) is pressed and released on a single element.
	     *
	     * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/click
	     *
	     * @param {Event} event generated object with event data
	     *!/
	    /!*click: function ( event ) {
	        //debug.event(event);
	        //console.log(event);
	        debug.info('app event: ' + event.type, event, {tags: [event.type, 'event']});
	    },*!/
	
	    /!**
	     * The contextmenu event is fired when the right button of the mouse is clicked (before the context menu is displayed),
	     * or when the context menu key is pressed (in which case the context menu is displayed at the bottom left of the focused
	     * element, unless the element is a tree, in which case the context menu is displayed at the bottom left of the current row).
	     *
	     * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/contextmenu
	     *
	     * @param {Event} event generated object with event data
	     *!/
	    /!*contextmenu: function ( event ) {
	        //var kbEvent = {}; //Object.create(document.createEvent('KeyboardEvent'));
	
	        //debug.event(event);
	        //console.log(event);
	        debug.info('app event: ' + event.type, event, {tags: [event.type, 'event']});
	
	        //kbEvent.type    = 'keydown';
	        //kbEvent.keyCode = 8;
	
	        //debug.log(kbEvent.type);
	
	        //globalEventListenerKeydown(kbEvent);
	        //var event = document.createEvent('KeyboardEvent');
	        //event.initEvent('keydown', true, true);
	
	        //document.dispatchEvent(kbEvent);
	
	        if ( !DEVELOP ) {
	            // disable right click in release mode
	            event.preventDefault();
	        }
	    },*!/
	
	    /!**
	     * The wheel event is fired when a wheel button of a pointing device (usually a mouse) is rotated.
	     *
	     * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/wheel
	     *
	     * @param {Event} event generated object with event data
	     *!/
	    mousewheel: function ( event ) {
	        var page = app.activePage;
	
	        if ( DEVELOP ) {
	            if ( page === null || page === undefined ) { throw new Error(__filename + ': app should have at least one page'); }
	        }
	
	        //debug.event(event);
	        //console.log(event);
	        debug.info('app event: ' + event.type, event, {tags: [event.type, 'event']});
	
	        // current component handler
	        if ( page.activeComponent && page.activeComponent !== page ) {
	            // component is available and not page itself
	            if ( page.activeComponent.events[event.type] ) {
	                // there are some listeners
	                page.activeComponent.emit(event.type, event);
	            }
	        }
	
	        // page handler
	        if ( !event.stop ) {
	            // not prevented
	            if ( page.events[event.type] ) {
	                // there are some listeners
	                page.emit(event.type, event);
	            }
	        }
	    }
	};*/
	
	//events = require('./lib/events');
	
	
	// apply DOM events
	Object.keys(events).forEach(function ( name ) {
	    window.addEventListener(name, events[name]);
	});
	
	
	// public
	module.exports = app;


/***/ },
/* 2 */
/*!****************************************************!*\
  !*** /home/dp/Projects/sdk/spasdk/app/lib/core.js ***!
  \****************************************************/
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__filename) {/**
	 * @license The MIT License (MIT)
	 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
	 */
	
	/* eslint no-path-concat: 0 */
	
	'use strict';
	
	var Emitter = __webpack_require__(/*! cjs-emitter */ 3),
	    parse   = __webpack_require__(/*! cjs-query */ 4).parse,
	    app     = new Emitter();
	
	
	/**
	 * Make the given inactive/hidden page active/visible.
	 * Pass some data to the page and trigger the corresponding event.
	 *
	 * @param {Page} page item to show
	 * @param {*} [data] data to send to page
	 *
	 * @return {boolean} operation status
	 */
	function showPage ( page, data ) {
	    // page available and can be hidden
	    if ( page && !page.active ) {
	        // apply visibility
	        page.$node.classList.add('active');
	        page.active = true;
	        app.activePage = page;
	
	        debug.info('show component ' + page.name + '#' + page.id, null, {
	            tags: ['show', 'component', page.name, page.id]
	        });
	        //console.log('component ' + page.name + '.' + page.id + ' show', 'green');
	
	        // there are some listeners
	        if ( page.events['show'] ) {
	            // notify listeners
	            page.emit('show', {page: page, data: data});
	        }
	
	        return true;
	    }
	
	    // nothing was done
	    return false;
	}
	
	
	/**
	 * Make the given active/visible page inactive/hidden and trigger the corresponding event.
	 *
	 * @param {Page} page item to hide
	 *
	 * @return {boolean} operation status
	 */
	function hidePage ( page ) {
	    // page available and can be hidden
	    if ( page && page.active ) {
	        // apply visibility
	        page.$node.classList.remove('active');
	        page.active  = false;
	        app.activePage = null;
	
	        debug.info('hide component ' + page.name + '#' + page.id, null, {
	            tags: ['hide', 'component', page.name, page.id]
	        });
	        //console.log('component ' + page.name + '.' + page.id + ' hide', 'grey');
	
	        // there are some listeners
	        if ( page.events['hide'] ) {
	            // notify listeners
	            page.emit('hide', {page: page});
	        }
	
	        return true;
	    }
	
	    // nothing was done
	    return false;
	}
	
	
	// url request params
	app.query = parse(document.location.search.substring(1));
	
	
	// global application configuration
	// in config.js file in js root
	app.config = __webpack_require__(/*! app:config */ 5);
	
	
	// the only visible page
	app.activePage = null;
	
	
	/**
	 * Browse to a given page.
	 * Do nothing if the link is invalid. Otherwise hide the current, show new and update the "previous" link.
	 *
	 * @param {Page} pageTo instance of the page to show
	 * @param {*} [data] options to pass to the page on show
	 *
	 * @return {boolean} operation status
	 */
	app.route = function ( pageTo, data ) {
	    var pageFrom = app.activePage;
	
	    if ( true ) {
	        //if ( router.pages.length > 0 ) {
	        if ( !pageTo || typeof pageTo !== 'object' ) { throw new Error(__filename + ': wrong pageTo type'); }
	        if ( !('active' in pageTo) ) { throw new Error(__filename + ': missing field "active" in pageTo'); }
	        //}
	    }
	
	    // valid not already active page
	    if ( pageTo && !pageTo.active ) {
	        //debug.log('router.navigate: ' + pageTo.id, pageTo === pageFrom ? 'grey' : 'green');
	        debug.info('app route: ' + pageTo.name + '#' + pageTo.id, null, {tags: ['route', pageTo.name, pageTo.id]});
	
	        // update url
	        //location.hash = this.stringify(name, data);
	
	        // apply visibility
	        hidePage(app.activePage);
	        showPage(pageTo, data);
	
	        // there are some listeners
	        if ( this.events['route'] ) {
	            // notify listeners
	            this.emit('route', {from: pageFrom, to: pageTo});
	        }
	
	        // store
	        //this.history.push(pageTo);
	
	        return true;
	    }
	
	    debug.warn('invalid page to route: ' + pageTo.id, null, {tags: ['route', 'page', pageTo.id]});
	    //console.log('router.navigate: ' + pageTo.id, 'red');
	
	    // nothing was done
	    return false;
	};
	
	
	// public
	module.exports = app;
	
	/* WEBPACK VAR INJECTION */}.call(exports, "../../sdk/spasdk/app/lib/core.js"))

/***/ },
/* 3 */
/*!*****************************************************!*\
  !*** /home/dp/Projects/sdk/cjssdk/emitter/index.js ***!
  \*****************************************************/
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__filename) {/**
	 * @license The MIT License (MIT)
	 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
	 */
	
	/* eslint no-path-concat: 0 */
	
	'use strict';
	
	
	/**
	 * Base Events Emitter implementation.
	 *
	 * @see http://nodejs.org/api/events.html
	 * @constructor
	 *
	 * @example
	 * var emitter = new Emitter();
	 */
	function Emitter () {
	    console.assert(typeof this === 'object', 'must be constructed via new');
	
	    // if ( DEVELOP ) {
	    //     if ( typeof this !== 'object' ) { throw new Error(__filename + ': must be constructed via new'); }
	    // }
	
	    /**
	     * Inner hash table for event names and linked callbacks.
	     * Manual editing should be avoided.
	     *
	     * @member {Object.<string, function[]>}
	     *
	     * @example
	     * {
	     *     click: [
	     *         function click1 () { ... },
	     *         function click2 () { ... }
	     *     ],
	     *     keydown: [
	     *         function () { ... }
	     *     ]
	     * }
	     **/
	    this.events = {};
	}
	
	
	Emitter.prototype = {
	    /**
	     * Bind an event to the given callback function.
	     * The same callback function can be added multiple times for the same event name.
	     *
	     * @param {string} name event identifier
	     * @param {function} callback function to call on this event
	     *
	     * @example
	     * emitter.addListener('click', function ( data ) { ... });
	     * // one more click handler
	     * emitter.addListener('click', function ( data ) { ... });
	     */
	    addListener: function ( name, callback ) {
	        console.assert(arguments.length === 2, 'wrong arguments number');
	        console.assert(typeof name === 'string', 'wrong name type');
	        console.assert(name.length > 0, 'empty name');
	        console.assert(typeof callback === 'function', 'callback should be a function');
	
	        // if ( DEVELOP ) {
	        //     if ( arguments.length !== 2 ) { throw new Error(__filename + ': wrong arguments number'); }
	        //     if ( typeof name !== 'string' || name.length === 0 ) { throw new Error(__filename + ': wrong or empty name'); }
	        //     if ( typeof callback !== 'function' ) { throw new Error(__filename + ': wrong callback type'); }
	        // }
	
	        // initialization may be required
	        this.events[name] = this.events[name] || [];
	        // append this new event to the list
	        this.events[name].push(callback);
	    },
	
	
	    /**
	     * Add a one time listener for the event.
	     * This listener is invoked only the next time the event is fired, after which it is removed.
	     *
	     * @param {string} name event identifier
	     * @param {function} callback function to call on this event
	     *
	     * @example
	     * emitter.once('click', function ( data ) { ... });
	     */
	    once: function ( name, callback ) {
	        // current execution context
	        var self = this;
	
	        if ( true ) {
	            if ( arguments.length !== 2 ) { throw new Error(__filename + ': wrong arguments number'); }
	            if ( typeof name !== 'string' || name.length === 0 ) { throw new Error(__filename + ': wrong or empty name'); }
	            if ( typeof callback !== 'function' ) { throw new Error(__filename + ': wrong callback type'); }
	        }
	
	        // initialization may be required
	        this.events[name] = this.events[name] || [];
	        // append this new event to the list
	        this.events[name].push(function onceWrapper () {
	            callback.apply(self, arguments);
	            self.removeListener(name, onceWrapper);
	        });
	    },
	
	
	    /**
	     * Apply multiple listeners at once.
	     *
	     * @param {Object} callbacks event names with callbacks
	     *
	     * @example
	     * emitter.addListeners({
	     *     click: function ( data ) {},
	     *     close: function ( data ) {}
	     * });
	     */
	    addListeners: function ( callbacks ) {
	        var name;
	
	        if ( true ) {
	            if ( arguments.length !== 1 ) { throw new Error(__filename + ': wrong arguments number'); }
	            if ( typeof callbacks !== 'object' ) { throw new Error(__filename + ': wrong callbacks type'); }
	            if ( Object.keys(callbacks).length === 0 ) { throw new Error(__filename + ': no callbacks given'); }
	        }
	
	        for ( name in callbacks ) {
	            if ( callbacks.hasOwnProperty(name) ) {
	                this.addListener(name, callbacks[name]);
	            }
	        }
	    },
	
	
	    /**
	     * Remove all instances of the given callback.
	     *
	     * @param {string} name event identifier
	     * @param {function} callback function to remove
	     *
	     * @example
	     * emitter.removeListener('click', func1);
	     */
	    removeListener: function ( name, callback ) {
	        if ( true ) {
	            if ( arguments.length !== 2 ) { throw new Error(__filename + ': wrong arguments number'); }
	            if ( typeof name !== 'string' || name.length === 0 ) { throw new Error(__filename + ': wrong or empty name'); }
	            if ( typeof callback !== 'function' ) { throw new Error(__filename + ': wrong callback type'); }
	            if ( this.events[name] && !Array.isArray(this.events[name]) ) { throw new Error(__filename + ': corrupted inner data'); }
	        }
	
	        // the event exists and should have some callbacks
	        if ( this.events[name] ) {
	            // rework the callback list to exclude the given one
	            this.events[name] = this.events[name].filter(function callbacksFilter ( fn ) { return fn !== callback; });
	            // event has no more callbacks so clean it
	            if ( this.events[name].length === 0 ) {
	                // as if there were no listeners at all
	                this.events[name] = undefined;
	            }
	        }
	    },
	
	
	    /**
	     * Remove all callbacks for the given event name.
	     * Without event name clears all events.
	     *
	     * @param {string} [name] event identifier
	     *
	     * @example
	     * emitter.removeAllListeners('click');
	     * emitter.removeAllListeners();
	     *
	     * @deprecated
	     */
	    /*removeAllListeners: function ( name ) {
	        if ( DEVELOP ) {
	            if ( arguments.length !== 0 && (typeof name !== 'string' || name.length === 0) ) {
	                throw new Error(__filename + ': wrong or empty name');
	            }
	        }
	
	        // check input
	        if ( arguments.length === 0 ) {
	            // no arguments so remove everything
	            this.events = {};
	        } else if ( name ) {
	            if ( DEVELOP ) {
	                if ( this.events[name] ) { throw new Error(__filename + ': event is not removed'); }
	            }
	
	            // only name is given so remove all callbacks for the given event
	            // but object structure modification should be avoided
	            this.events[name] = undefined;
	        }
	    },*/
	
	
	    /**
	     * Execute each of the listeners in the given order with the supplied arguments.
	     *
	     * @param {string} name event identifier
	     *
	     * @example
	     * emitter.emit('init');
	     * emitter.emit('click', {src: panel1, dst: panel2});
	     * emitter.emit('load', error, data);
	     *
	     * // it's a good idea to emit event only when there are some listeners
	     * if ( this.events['click'] ) {
	     *     this.emit('click', {event: event});
	     * }
	     */
	    emit: function ( name ) {
	        var event = this.events[name],
	            index;
	
	        if ( true ) {
	            if ( arguments.length < 1 ) { throw new Error(__filename + ': wrong arguments number'); }
	            if ( typeof name !== 'string' || name.length === 0 ) { throw new Error(__filename + ': wrong or empty name'); }
	        }
	
	        // the event exists and should have some callbacks
	        if ( event ) {
	            if ( true ) {
	                if ( !Array.isArray(event) ) { throw new Error(__filename + ': wrong event type'); }
	            }
	
	            for ( index = 0; index < event.length; index++ ) {
	                if ( true ) {
	                    if ( typeof event[index] !== 'function' ) { throw new Error(__filename + ': wrong event callback type'); }
	                }
	
	                // invoke the callback with parameters
	                event[index].apply(this, Array.prototype.slice.call(arguments, 1));
	            }
	        }
	    }
	};
	
	
	// correct constructor name
	Emitter.prototype.constructor = Emitter;
	
	
	// public
	module.exports = Emitter;
	
	/* WEBPACK VAR INJECTION */}.call(exports, "../../sdk/cjssdk/emitter/index.js"))

/***/ },
/* 4 */
/*!***************************************************!*\
  !*** /home/dp/Projects/sdk/cjssdk/query/index.js ***!
  \***************************************************/
/***/ function(module, exports) {

	/**
	 * @license The MIT License (MIT)
	 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
	 */
	
	'use strict';
	
	module.exports = {
	    /**
	     * Parse the given location search string into object.
	     *
	     * @param {string} query string to parse
	     *
	     * @return {Object.<string, string>} result data
	     */
	    parse: function ( query ) {
	        var data = {};
	
	        // parse and fill the data
	        query.split('&').forEach(function ( part ) {
	            part = part.split('=');
	            // valid number on params
	            if ( part.length === 2 ) {
	                data[part[0]] = decodeURIComponent(part[1]);
	            }
	        });
	
	        return data;
	    },
	
	
		/**
	     * Make uri query part in a string form.
	     *
	     * @param {Object} params data to stringify
	     *
	     * @return {string} query string
	     */
	    stringify: function ( params ) {
	        var data = [];
	
	        Object.keys(params).forEach(function ( name ) {
	            data.push(name + '=' + encodeURIComponent(params[name]));
	        });
	
	        return data.join('&');
	    }
	};


/***/ },
/* 5 */
/*!**************************!*\
  !*** ./src/js/config.js ***!
  \**************************/
/***/ function(module, exports) {

	/**
	 * Global application configuration.
	 * Can store run-time options, API urls, paths, execution flags and so on.
	 * Automatically loaded on application initialization and available as app.config.
	 */
	
	'use strict';
	
	// public
	module.exports = {
	    nodeIdSize: 16,
	    nodeKeySize: 32,
	
	    // RTCConfiguration
	    rtc: {
	        iceServers: [
	            {urls: 'stun:stun.services.mozilla.com'},
	            {urls: 'stun:stun.l.google.com:19302'}
	        ]
	    }
	};


/***/ },
/* 6 */
/*!******************************************************!*\
  !*** /home/dp/Projects/sdk/spasdk/app/lib/events.js ***!
  \******************************************************/
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__filename) {/**
	 * @license The MIT License (MIT)
	 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
	 */
	
	/* eslint no-path-concat: 0 */
	
	'use strict';
	
	var app = __webpack_require__(/*! ./core */ 2);
	
	
	// public
	module.exports = {
	    DOMContentLoaded: function ( event ) {
	        //debug.event(event);
	        //console.log(event);
	
	        debug.info('app event: ' + event.type, event, {tags: [event.type, 'event']});
	
	        // there are some listeners
	        if ( app.events['dom'] ) {
	            // notify listeners
	            app.emit('dom', event);
	            //console.log('DOMContentLoaded');
	        }
	    },
	
	    /**
	     * The load event is fired when a resource and its dependent resources have finished loading.
	     *
	     * Control flow:
	     *   1. Global handler.
	     *   2. Each page handler.
	     *   3. Application DONE event.
	     *
	     * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/load
	     *
	     * @param {Event} event generated object with event data
	     */
	    load: function ( event ) {
	        //var path;
	
	        //debug.event(event);
	        //console.log(event);
	
	        // time mark
	        //app.data.time.load = event.timeStamp;
	
	        debug.info('app event: ' + event.type, event, {tags: [event.type, 'event']});
	
	        // global handler
	        // there are some listeners
	        if ( app.events[event.type] ) {
	            // notify listeners
	            app.emit(event.type, event);
	        }
	
	        // local handler on each page
	        /*router.pages.forEach(function forEachPages ( page ) {
	         debug.log('component ' + page.constructor.name + '.' + page.id + ' load', 'green');
	
	         // there are some listeners
	         if ( page.events[event.type] ) {
	         // notify listeners
	         page.emit(event.type, event);
	         }
	         });*/
	
	        // time mark
	        //app.data.time.done = +new Date();
	
	        // everything is ready
	        // and there are some listeners
	        // if ( app.events['done'] ) {
	        //     // notify listeners
	        //     app.emit('done', event);
	        // }
	    },
	
	    /**
	     * The unload event is fired when the document or a child resource is being unloaded.
	     *
	     * Control flow:
	     *   1. Each page handler.
	     *   2. Global handler.
	     *
	     * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/unload
	     *
	     * @param {Event} event generated object with event data
	     */
	    unload: function ( event ) {
	        //debug.event(event);
	        //console.log(event);
	
	        debug.info('app event: ' + event.type, event, {tags: [event.type, 'event']});
	
	        // global handler
	        // there are some listeners
	        if ( app.events[event.type] ) {
	            // notify listeners
	            app.emit(event.type, event);
	        }
	
	        // local handler on each page
	        /*router.pages.forEach(function forEachPages ( page ) {
	         debug.log('component ' + page.constructor.name + '.' + page.id + ' unload', 'red');
	
	         // there are some listeners
	         if ( page.events[event.type] ) {
	         // notify listeners
	         page.emit(event.type, event);
	         }
	         });*/
	    },
	
	    /**
	     * The error event is fired when a resource failed to load.
	     *
	     * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/error
	     *
	     * @param {Event} event generated object with event data
	     */
	    error: function ( event ) {
	        //debug.event(event);
	        //console.log(event);
	        debug.fail('app event: ' + event.message, event, {tags: [event.type, 'event']});
	    },
	
	    /**
	     * The keydown event is fired when a key is pressed down.
	     * Set event.stop to true in order to prevent bubbling.
	     *
	     * Control flow:
	     *   1. Current active component on the active page.
	     *   2. Current active page itself.
	     *   3. Application.
	     *
	     * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/keydown
	     *
	     * @param {Event} event generated object with event data
	     */
	    keydown: function ( event ) {
	        var page = app.activePage,
	            eventLocal = {
	                code: event.keyCode,
	                stop: false
	            },
	            activeComponent;
	
	        if ( true ) {
	            if ( !page ) { throw new Error(__filename + ': app should have at least one page'); }
	        }
	
	        // filter phantoms
	        //if ( event.keyCode === 0 ) { return; }
	
	        // combined key code
	        //event.code = event.keyCode;
	
	        // apply key modifiers
	        if ( event.ctrlKey )  { eventLocal.code += 'c'; }
	        if ( event.altKey )   { eventLocal.code += 'a'; }
	        if ( event.shiftKey ) { eventLocal.code += 's'; }
	
	        //debug.event(event);
	        //console.log(event);
	        debug.info('app event: ' + event.type + ' - ' + eventLocal.code, event, {tags: [event.type, 'event']});
	
	        // page.activeComponent can be set to null in event handles
	        activeComponent = page.activeComponent;
	
	        // current component handler
	        if ( activeComponent && activeComponent !== page ) {
	            // component is available and not page itself
	            if ( activeComponent.events[event.type] ) {
	                // there are some listeners
	                activeComponent.emit(event.type, eventLocal, event);
	            }
	
	            // todo: bubble event recursively
	            // bubbling
	            if (
	                !eventLocal.stop &&
	                activeComponent.propagate &&
	                activeComponent.parent &&
	                activeComponent.parent.events[event.type]
	            ) {
	                activeComponent.parent.emit(event.type, eventLocal, event);
	            }
	        }
	
	        // page handler
	        if ( !eventLocal.stop ) {
	            // not prevented
	            if ( page.events[event.type] ) {
	                // there are some listeners
	                page.emit(event.type, eventLocal, event);
	            }
	
	            // global app handler
	            if ( !event.stop ) {
	                // not prevented
	                if ( app.events[event.type] ) {
	                    // there are some listeners
	                    app.emit(event.type, eventLocal, event);
	                }
	            }
	        }
	
	        //// suppress non-printable keys in stb device (not in your browser)
	        //if ( app.data.host && keyCodes[event.code] ) {
	        //    event.preventDefault();
	        //}
	    },
	
	    /**
	     * The keypress event is fired when press a printable character.
	     * Delivers the event only to activeComponent at active page.
	     *
	     * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/keypress
	     *
	     * @param {Event} event generated object with event data
	     * @param {string} event.char entered character
	     */
	    keypress: function ( event ) {
	        var page = app.activePage;
	
	        if ( true ) {
	            if ( page === null || page === undefined ) { throw new Error(__filename + ': app should have at least one page'); }
	        }
	
	        //debug.event(event);
	        console.log(event);
	        debug.info('app event: ' + event.type + ' - ' + event.key, event, {tags: [event.type, 'event']});
	
	        // current component handler
	        if ( page.activeComponent && page.activeComponent !== page ) {
	            // component is available and not page itself
	            if ( page.activeComponent.events[event.type] ) {
	                // there are some listeners
	                page.activeComponent.emit(event.type, event);
	            }
	        }
	    },
	
	    /**
	     * The click event is fired when a pointing device button (usually a mouse button) is pressed and released on a single element.
	     *
	     * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/click
	     *
	     * @param {Event} event generated object with event data
	     */
	    /*click: function ( event ) {
	     //debug.event(event);
	     //console.log(event);
	     debug.info('app event: ' + event.type, event, {tags: [event.type, 'event']});
	     },*/
	
	    /**
	     * The contextmenu event is fired when the right button of the mouse is clicked (before the context menu is displayed),
	     * or when the context menu key is pressed (in which case the context menu is displayed at the bottom left of the focused
	     * element, unless the element is a tree, in which case the context menu is displayed at the bottom left of the current row).
	     *
	     * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/contextmenu
	     *
	     * @param {Event} event generated object with event data
	     */
	    contextmenu: function ( event ) {
	        debug.info('app event: ' + event.type, event, {tags: [event.type, 'event']});
	
	        if ( false ) {
	            // disable right click in release mode
	            event.preventDefault();
	        }
	    },
	
	    /*contextmenu: function ( event ) {
	     //var kbEvent = {}; //Object.create(document.createEvent('KeyboardEvent'));
	
	     //debug.event(event);
	     //console.log(event);
	     debug.info('app event: ' + event.type, event, {tags: [event.type, 'event']});
	
	     //kbEvent.type    = 'keydown';
	     //kbEvent.keyCode = 8;
	
	     //debug.log(kbEvent.type);
	
	     //globalEventListenerKeydown(kbEvent);
	     //var event = document.createEvent('KeyboardEvent');
	     //event.initEvent('keydown', true, true);
	
	     //document.dispatchEvent(kbEvent);
	
	     if ( !DEVELOP ) {
	     // disable right click in release mode
	     event.preventDefault();
	     }
	     },*/
	
	    /**
	     * The wheel event is fired when a wheel button of a pointing device (usually a mouse) is rotated.
	     *
	     * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/wheel
	     *
	     * @param {Event} event generated object with event data
	     */
	    mousewheel: function ( event ) {
	        var page = app.activePage;
	
	        if ( true ) {
	            if ( page === null || page === undefined ) { throw new Error(__filename + ': app should have at least one page'); }
	        }
	
	        //debug.event(event);
	        //console.log(event);
	        debug.info('app event: ' + event.type, event, {tags: [event.type, 'event']});
	
	        // current component handler
	        if ( page.activeComponent && page.activeComponent !== page ) {
	            // component is available and not page itself
	            if ( page.activeComponent.events[event.type] ) {
	                // there are some listeners
	                page.activeComponent.emit(event.type, event);
	            }
	        }
	
	        // page handler
	        if ( !event.stop ) {
	            // not prevented
	            if ( page.events[event.type] ) {
	                // there are some listeners
	                page.emit(event.type, event);
	            }
	        }
	    }
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, "../../sdk/spasdk/app/lib/events.js"))

/***/ },
/* 7 */
/*!************************************************************!*\
  !*** /home/dp/Projects/sdk/spasdk/app/lib/develop/main.js ***!
  \************************************************************/
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @license The MIT License (MIT)
	 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
	 */
	
	'use strict';
	
	var app = __webpack_require__(/*! ../core */ 2);
	
	
	// public app instance
	window.app = app;
	
	// all development tools placeholder
	app.develop = {};
	
	// browser logging
	window.debug = __webpack_require__(/*! ./debug */ 8);
	
	// tools
	__webpack_require__(/*! ./wamp */ 9);
	__webpack_require__(/*! ./events */ 12);
	__webpack_require__(/*! ./hooks */ 14);
	__webpack_require__(/*! ./static */ 15);


/***/ },
/* 8 */
/*!*************************************************************!*\
  !*** /home/dp/Projects/sdk/spasdk/app/lib/develop/debug.js ***!
  \*************************************************************/
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__filename) {/**
	 * Logger.
	 *
	 * @license The MIT License (MIT)
	 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
	 */
	
	/* eslint no-path-concat: 0 */
	/* eslint new-cap: 0 */
	
	'use strict';
	
	var //host      = require('../app').data.host,
	    app       = __webpack_require__(/*! ../core */ 2),
	    //util      = require('util'),
	    timeMarks = {},  // storage for timers (debug.time, debug.timeEnd)
	    buffer    = [],
	    debug     = {},
	    links     = {},
	    linkId    = 0;
	
	
	// debug.config = {
	//     depth: 3
	// };
	
	
	/**
	 * Check condition and warn if not match.
	 *
	 * @param {boolean} condition should be true if okay
	 * @param {string} title description of the problem
	 */
	debug.assert = function ( condition, title ) {
	    if ( !condition ) {
	        console.assert(condition, title);
	    }
	};
	
	
	debug.links = links;
	
	
	function prepareConfig ( config ) {
	    config = config || {};
	
	    config.tags = config.tags || [];
	    config.tags.push('target');
	
	    return config;
	}
	
	
	function wrapData ( data ) {
	    var result = {
	        type: typeof data
	    };
	
	    if ( data && result.type === 'object' ) {
	        result.link = linkId++;
	        links[result.link] = data;
	
	        if ( data.constructor && data.constructor.name ) {
	            result.name = data.constructor.name;
	        }
	
	        if ( 'length' in data ) {
	            result.size = data.length;
	        }
	    } else {
	        result.value = data;
	    }
	
	    return result;
	}
	
	
	// todo: remove setTimeout hack
	setTimeout(function () {
	    app.develop.wamp.addListener('getLinkData', function ( params, callback ) {
	        var link = links[params.id],
	            data = {};
	
	        console.log('incoming getLinkData', params);
	        //console.log(link);
	
	        if ( link ) {
	            Object.keys(link).forEach(function ( name ) {
	                data[name] = wrapData(link[name]);
	            });
	        }
	
	        callback(null, data);
	    });
	}, 1000);
	
	
	/**
	 * Print a plain colored string.
	 *
	 * @param {*} message data to output
	 * @param {string} [color='black'] colour to set
	 */
	debug.log = function ( info, data, config ) {
	    // message = (message + '') || '(empty message)';
		//
	    // console.log('%c%s', 'color:' + (color || 'black'), message);
	
	    // sanitize
	    config = config || {};
	
	    config.info = info;
	    //config.data = data ? util.inspect(data, {depth: debug.config.depth}) : null;
	    config.data = data !== undefined ? wrapData(data) : undefined;
	    //config.data = wrapData(data);
	    config.time = Date.now();
	    config.targetId = app.query.wampTargetId;
	    //config.tags = config.tags.sort();
	
	    if ( app.develop.wamp.open ) {
	        if ( buffer.length ) {
	            buffer.forEach(function ( bufItem ) {
	                app.develop.wamp.call('sendMessage', bufItem);
	            });
	            buffer = [];
	        }
	
	        app.develop.wamp.call('sendMessage', config);
	    } else {
	        buffer.push(config);
	    }
	};
	
	
	/**
	 * Print the given var with caption.
	 *
	 * @param {*} data data to output
	 * @param {string} [title] optional caption
	 */
	debug.info = function ( info, data, config ) {
	    /*var type = Object.prototype.toString.call(data).match(/\s([a-zA-Z]+)/)[1].toLowerCase(),
	        args;
	
	    args = ['color:' + (type === 'error' ? 'red' : 'green'), type];
	    if ( title ) {
	        args.unshift('%c%s\t%c%s\t');
	        args.push('color:grey');
	        args.push(title);
	    } else {
	        args.unshift('%c%s\t');
	    }
	    args.push(data);
	    // output
	    console.log.apply(console, args);*/
	
	    config = prepareConfig(config);
	    //config.tags.push('info');
	    config.type = 'info';
	
	    debug.log(info, data, config);
	};
	
	
	debug.warn = function ( info, data, config ) {
	    config = prepareConfig(config);
	    //config.tags.push('warn');
	    config.type = 'warn';
	
	    debug.log(info, data, config);
	};
	
	
	debug.fail = function ( info, data, config ) {
	    config = prepareConfig(config);
	    //config.tags.push('fail');
	    config.type = 'fail';
	
	    debug.log(info, data, config);
	};
	
	
	/**
	 * Print the given complex var with level restriction.
	 *
	 * @param {*} data data to output
	 */
	debug.inspect = function ( data ) {
	    console.log(data);
	};
	
	
	/**
	 * Print the given event object in some special way.
	 *
	 * @param {Event} data event object
	 */
	debug.event = function ( data ) {
	    var type  = data.type.toUpperCase(),
	        color = type === 'ERROR' ? 'red' : 'green';
	
	    switch ( type ) {
	        case 'KEYDOWN':
	        case 'KEYPRESS':
	            console.log('%o\t%c%s %c%s %c%s %c%s %c%s\t%s\t%c%s', data, 'color:' + color + ';font-weight:bold', type,
	                'color:' + (data.ctrlKey  ? 'green' : 'lightgrey'), 'ctrl',
	                'color:' + (data.altKey   ? 'green' : 'lightgrey'), 'alt',
	                'color:' + (data.shiftKey ? 'green' : 'lightgrey'), 'shift',
	                'color:black', data.keyCode, data.code || '', 'color:green', data.keyIdentifier
	            );
	            break;
	        default:
	            console.log('%o\t%c%s', data, 'color:' + color + ';font-weight:bold', type);
	    }
	};
	
	
	/**
	 * Start specific timer.
	 * Use to calculate time of some actions.
	 *
	 * @param {string} [name=''] timer group name
	 * @param {string} [title=''] timer individual mark caption
	 *
	 * @example
	 * debug.time('request');
	 * // some processing...
	 * debug.time('request');
	 * // prints 'time: +20ms'
	 * // some processing...
	 * debug.time('request', 'ready');
	 * // prints 'time (ready): +40ms'
	 * // some processing...
	 * debug.time('request', 'done');
	 * // prints 'time (done): +60ms'
	 */
	debug.time = function ( name, title ) {
	    var time = Date.now();
	
	    // sanitize
	    name  = name  || '';
	    title = title || '';
	
	    // is this mark exist
	    if ( timeMarks[name] ) {
	        // already set
	        debug.log((name || 'time') + (title ? ' (' + title + ')' : '') + ': +' + (time - timeMarks[name].last) + 'ms', 'blue');
	    } else {
	        // create a new mark
	        timeMarks[name] = {init: time};
	    }
	
	    // update with the current value
	    timeMarks[name].last = time;
	};
	
	
	/**
	 * End specific timer.
	 * Use to calculate time of some actions.
	 *
	 * @param {string} [name=''] timer name
	 * @param {string} [title='total'] timer mark caption
	 *
	 * @example
	 * debug.time();
	 * // some processing...
	 * debug.timeEnd();
	 * // prints 'time (total): 934ms'
	 *
	 * @example
	 * debug.time('request');
	 * // some processing...
	 * debug.timeEnd('request', 'done');
	 * // prints 'request (done): 934ms'
	 */
	debug.timeEnd = function ( name, title ) {
	    var time = Date.now();
	
	    // sanitize
	    name  = name  || '';
	    title = title || 'total';
	
	    // is this mark exist
	    if ( timeMarks[name] ) {
	        debug.log((name || 'time') + ' (' + title + '): ' + (time - timeMarks[name].init) + 'ms', 'blue');
	
	        delete timeMarks[name];
	    } else {
	        throw new Error(__filename + ': no started timer for "' + name + '"');
	    }
	};
	
	
	// public
	module.exports = debug;
	
	/* WEBPACK VAR INJECTION */}.call(exports, "../../sdk/spasdk/app/lib/develop/debug.js"))

/***/ },
/* 9 */
/*!************************************************************!*\
  !*** /home/dp/Projects/sdk/spasdk/app/lib/develop/wamp.js ***!
  \************************************************************/
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @license The MIT License (MIT)
	 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
	 */
	
	'use strict';
	
	var app       = __webpack_require__(/*! ../core */ 2),
	    Wamp      = __webpack_require__(/*! spa-wamp */ 10),
	    stringify = __webpack_require__(/*! cjs-query */ 4).stringify;
	
	
	if ( app.query.wampPort ) {
	    // correct type
	    app.query.wampTargetId = parseInt(app.query.wampTargetId, 10);
	
	    app.develop.wamp = new Wamp(
	        'ws://' + (app.query.wampHost || location.hostname) + ':' + app.query.wampPort + '/target/' + (app.query.wampTargetId || '')
	    );
	
	    app.develop.wamp.onopen = function () {
	        //app.develop.wamp.addListener(app.develop.wamp.EVENT_OPEN, function () {
	        debug.info('wamp open ' + app.develop.wamp.socket.url, null, {tags: ['open', 'wamp']});
	
	        // get target connection id
	        app.develop.wamp.call('getConnectionInfo', {}, function ( error, data ) {
	            // check if already linked
	            if ( !error && app.query.wampTargetId !== data.id ) {
	                // disconnect
	                app.develop.wamp.socket.close();
	                // correct url
	                app.query.wampTargetId = data.id;
	                // bind to the target id
	                location.search = '?' + stringify(app.query);
	            }
	        });
	        //});
	    };
	
	    app.develop.wamp.onclose = function () {
	        debug.info('wamp close ' + app.develop.wamp.socket.url, null, {tags: ['close', 'wamp']});
	    };
	
	    app.develop.wamp.addListener('evalCode', function ( params, callback ) {
	        console.log('incoming evalCode', params);
	
	        /* eslint no-eval: 0 */
	        callback(null, {eval: eval(params.code)});
	    });
	}


/***/ },
/* 10 */
/*!**************************************************!*\
  !*** /home/dp/Projects/sdk/spasdk/wamp/index.js ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @license The MIT License (MIT)
	 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
	 */
	
	'use strict';
	
	var CjsWamp = __webpack_require__(/*! cjs-wamp */ 11);
	
	
	/**
	 * WAMP implementation wrapper.
	 *
	 * @param {string} uri socket address to connect
	 * @param {Object} [config={}] init parameters
	 * @param {number} [config.timeout] time between connection retries
	 *
	 * @constructor
	 */
	function Wamp ( uri, config ) {
	    var self = this;
	
	    function getSocket () {
	        var socket = new WebSocket(uri);
	
	        socket.onopen = function () {
	            if ( typeof self.onopen === 'function' ) {
	                self.onopen();
	            }
	
	            // there are some listeners
	            // if ( self.events[self.EVENT_OPEN] ) {
	            //     self.emit(self.EVENT_OPEN);
	            // }
	
	            // set activity flag
	            self.open = true;
	        };
	
	        // reconnect
	        socket.onclose = function () {
	            if ( typeof self.onclose === 'function' && self.open ) {
	                self.onclose();
	            }
	
	            // there are some listeners and it's the first time
	            // if ( self.events[self.EVENT_CLOSE] && self.open ) {
	            //     self.emit(self.EVENT_CLOSE);
	            // }
	
	            // mark as closed
	            self.open = false;
	
	            if ( self.timeout ) {
	                setTimeout(function () {
	                    // recreate connection
	                    self.socket = getSocket();
	                    // reroute messages
	                    self.socket.onmessage = function ( event ) {
	                        self.router(event.data);
	                    };
	                }, self.timeout);
	            }
	        };
	
	        return socket;
	    }
	
	    console.assert(typeof this === 'object', 'must be constructed via new');
	
	    // sanitize
	    config = config || {};
	
	    // connection state
	    this.open = false;
	
	    // override prototype value
	    if ( config.timeout ) {
	        this.timeout = config.timeout;
	    }
	
	    // events
	    this.onopen  = null;
	    this.onclose = null;
	
	    // parent constructor call
	    CjsWamp.call(this, getSocket());
	}
	
	
	// inheritance
	Wamp.prototype = Object.create(CjsWamp.prototype);
	Wamp.prototype.constructor = Wamp;
	
	// configuration
	Wamp.prototype.timeout = 5000;
	
	// events
	// Wamp.prototype.EVENT_OPEN  = 'wamp:connection:open';
	// Wamp.prototype.EVENT_CLOSE = 'wamp:connection:close';
	
	
	// public
	module.exports = Wamp;


/***/ },
/* 11 */
/*!**************************************************!*\
  !*** /home/dp/Projects/sdk/cjssdk/wamp/index.js ***!
  \**************************************************/
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @license The MIT License (MIT)
	 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
	 */
	
	'use strict';
	
	/** @private */
	var Emitter   = __webpack_require__(/*! cjs-emitter */ 3),
	    messageId = 0,
	    callbacks = {};
	
	
	/**
	 * Lightweight WAMP implementation based on WebSockets.
	 *
	 * @param {WebSocket} socket link to socket connection to wrap
	 *
	 * @see http://wamp-proto.org/
	 * @constructor
	 */
	function Wamp ( socket ) {
	    var self = this;
	
	    console.assert(typeof this === 'object', 'must be constructed via new');
	    
	    // parent constructor call
	    Emitter.call(this);
	
	    this.socket = socket;
	
	    if ( 'on' in socket ) {
	        // server-side
	        socket.on('message', function ( message ) {
	            self.router(message);
	        });
	    } else if ( 'onmessage' in socket ) {
	        // desktop browser
	        socket.onmessage = function ( event ) {
	            self.router(event.data);
	        };
	    }
	}
	
	
	/**
	 * Send data through the given socket.
	 *
	 * @param {WebSocket} socket pipe to send through
	 * @param {Object} message data to send
	 */
	function send ( socket, message ) {
	    // connection is open
	    if ( socket.readyState === 1 ) {
	        // protocol version
	        message.jsonrpc = '2.0';
	
	        socket.send(JSON.stringify(message));
	    }
	}
	
	
	// inheritance
	Wamp.prototype = Object.create(Emitter.prototype);
	Wamp.prototype.constructor = Wamp;
	
	
	/**
	 * Internal method to handle messages.
	 *
	 * @param {string} message request JSON data
	 *
	 * @private
	 */
	Wamp.prototype.router = function ( message ) {
	    var self = this,
	        data;
	
	    try {
	        data = JSON.parse(message);
	    } catch ( error ) {
	        send(this.socket, {
	            error: {code: -32700, message: 'Parse error'},
	            id: null
	        });
	
	        return;
	    }
	
	    if ( 'id' in data && !('method' in data) ) {
	        // incoming answer for previous request
	        if ( data.id in callbacks ) {
	            callbacks[data.id](data.error, data.result);
	            delete callbacks[data.id];
	        } else {
	            // no callback registered for this id
	        }
	    } else if ( !('id' in data) && 'method' in data ) {
	        // incoming notification
	        if ( this.events[data.method] ) {
	            this.emit(data.method, data.params);
	        }
	    } else if ( 'id' in data && 'method' in data ) {
	        // execute incoming method and report to sender
	        if ( this.events[data.method] ) {
	            this.emit(data.method, data.params, function ( error, result ) {
	                send(self.socket, {
	                    error: error,
	                    result: result,
	                    id: data.id
	                });
	            });
	        } else {
	            // wrong method
	            send(this.socket, {
	                error: {code: -32601, message: 'Method not found'},
	                id: data.id
	            });
	        }
	    } else {
	        // wrong request
	        send(this.socket, {
	            error: {code: -32600, message: 'Invalid Request'},
	            id: null
	        });
	    }
	};
	
	
	/**
	 * Send message to execute remotely or notify (without `callback` argument).
	 *
	 * @param {string} method procedure or event name
	 * @param {*} [params] procedure associated data
	 * @param {function} [callback] remote call results handler
	 */
	Wamp.prototype.call = function ( method, params, callback ) {
	    var message = {
	        method: method,
	        params: params
	    };
	
	    // execution mode with callback
	    // notification mode otherwise
	    if ( typeof callback === 'function' ) {
	        message.id = ++messageId;
	        callbacks[messageId] = callback;
	    }
	
	    send(this.socket, message);
	};
	
	
	// public
	module.exports = Wamp;


/***/ },
/* 12 */
/*!**************************************************************!*\
  !*** /home/dp/Projects/sdk/spasdk/app/lib/develop/events.js ***!
  \**************************************************************/
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Additional dev events.
	 *
	 * @license The MIT License (MIT)
	 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
	 */
	
	'use strict';
	
	/* eslint new-cap: 0 */
	
	var //util    = require('util'),
	    app      = __webpack_require__(/*! ../core */ 2),
	    //Wamp     = require('spa-wamp'),
	    //request  = require('spa-request'),
	    gremlins = __webpack_require__(/*! gremlins.js/gremlins.min.js */ 13),
	    events   = {};
	    //app;
	    //dom     = require('spa-dom'),
	    //grid    = require('./grid');
	
	
	events.load = function () {
	    // app instance
	    //window.app = app = require('spa-app');
	
	    /*if ( app.query.wampPort ) {
	        //console.log('connect to WAMP server');
	        app.develop.wamp = new Wamp(
	            //new WebSocket('ws://' + (app.query.wampHost || location.hostname) + ':' + app.query.wampPort + '/target')
	            'ws://' + (app.query.wampHost || location.hostname) + ':' + app.query.wampPort + '/target'
	        );
	
	        app.develop.wamp.addListener('connection:open', function () {
	            console.log('wamp open ' + app.develop.wamp.socket.url);
	        });
	
	        app.develop.wamp.addListener('connection:close', function () {
	            console.log('wamp close ' + app.develop.wamp.socket.url);
	        });
	
	        // ready
	        /!*window.app.wamp.socket.onopen = function () {
	            console.log('wamp is ready!');
	        };*!/
	    }*/
	
	    // export to globals div for develop HTML elements
	    /*window.$develop = document.body.appendChild(document.createElement('div'));
	    window.$develop.className = 'develop';/**/
	
	    // apply dev css
	    document.body.classList.add('develop');
	
	    //grid.init();
	
	    //if ( localStorage.getItem('grid.active') ) {
	    //    grid.show();
	    //}
	
	    // stress-testing
	    app.develop.horde = gremlins.createHorde();
	};
	
	
	events.keydown = function ( event ) {
	    switch ( event.keyCode ) {
	        // key b
	        case 66:
	            if ( event.altKey ) {
	                app.develop.wamp.call('runTask', {id: 'build'}, function ( error, result ) {
	                    console.log('task build executed: ', error, result);
	                });
	            }
	            break;
	        // numpad 0
	        case 96:
	            debug.info('full app reload', null, {tags: ['reload']});
	            location.hash = '';
	            location.reload();
	            break;
	
	        // numpad 5
	        //case 101:
	        //    // debug grid
	        //    if ( grid.active ) {
	        //        grid.hide();
	        //    } else {
	        //        grid.show();
	        //    }
	        //    debug.log('show grid: ' + grid.active, 'red');
	        //    localStorage.setItem('grid.active', grid.active);
	        //    break;
	
	        // numpad 6
	        case 102:
	            // stress-testing
	            app.develop.horde.unleash({nb: 500});
	            break;
	
	        // numpad 7
	        /*case 103:
	            //if ( !app.data.host ) {
	            //    debug.log('SpyJS in this mode is available only on STB devices.', 'red');
	            //} else {
	            // SpyJS enable/disable
	            if ( localStorage.getItem('spyjs.active') ) {
	                //isSpyJs = false;
	                localStorage.setItem('spyjs.active', false);
	                gSTB.ResetWebProxy();
	                debug.log('SpyJS: disable', 'red');
	                location.reload();
	            } else {
	                // try to "ping" proxy server
	                request.ajax(document.location.protocol + '//' + location.hostname + ':3546', {
	                    method: 'get',
	                    onload: function () {
	                        // proxy seems ready
	                        //isSpyJs = true;
	                        localStorage.setItem('spyjs.active', true);
	                        debug.log('SpyJS: enable', 'red');
	                        debug.log('SpyJS: set proxy to ' + location.hostname + ':' + 3546);
	
	                        gSTB.SetWebProxy(location.hostname, 3546, '', '', '');
	                        location.reload();
	                    },
	                    onerror: function () {
	                        debug.log('SpyJS: no connection (check SpyJS is started on the server)', 'red');
	                    }
	                });
	            }
	            //}
	            break;*/
	
	        //// numpad 8
	        //case 104:
	        //    // FireBug Lite
	        //    debug.log('firebug-lite activation', 'red');
	        //    document.head.appendChild(dom.tag('script', {
	        //        type: 'text/javascript',
	        //        src: 'http://getfirebug.com/firebug-lite.js#startOpened',
	        //        onload: function () {
	        //            debug.log('firebug-lite ready ...', 'green');
	        //        },
	        //        onerror: function ( error ) {
	        //            debug.inspect(error);
	        //        }
	        //    }));
	        //    break;
	
	        // numpad 9
	        case 105:
	            // outline components and inner structures
	            debug.info('toggle develop/release css layout', null, {tags: ['css', 'toggle']});
	            document.querySelectorAll('link[rel=stylesheet]').forEach(function ( link ) {
	                if ( link.href.indexOf('/release.') === -1 ) {
	                    link.href = link.href.replace('/develop.', '/release.');
	                } else {
	                    link.href = link.href.replace('/release.', '/develop.');
	                }
	            });
	            break;
	
	        // numpad .
	        case 110:
	            // CSS reload
	            debug.info('CSS reload', null, {tags: ['css', 'reload']});
	            // get through all css links
	            Array.prototype.slice.call(document.head.getElementsByTagName('link')).forEach(function forEachLink ( tag ) {
	                // get base name, modify and apply
	                tag.href = tag.href.split('?')[0] + '?' + Date.now();
	            });
	            break;
	    }
	};
	
	
	// additional top-level key handlers
	window.addEventListener('load',    events.load);
	window.addEventListener('keydown', events.keydown);
	
	
	// public
	module.exports = events;


/***/ },
/* 13 */
/*!***********************************************************!*\
  !*** /home/dp/Projects/sdk/~/gremlins.js/gremlins.min.js ***!
  \***********************************************************/
/***/ function(module, exports) {

	!function(e,n){if("object"==typeof exports&&"object"==typeof module)module.exports=n();else if("function"==typeof define&&define.amd)define(n);else{var t=n();for(var a in t)("object"==typeof exports?exports:e)[a]=t[a]}}(this,function(){return function(e){function n(a){if(t[a])return t[a].exports;var r=t[a]={exports:{},id:a,loaded:!1};return e[a].call(r.exports,r,r.exports,n),r.loaded=!0,r.exports}var t={};return n.m=e,n.c=t,n.p="http://localhost:8080/",n(0)}([function(e,n,t){e.exports=t(6)},function(e,n,t){var a;a=function(e){"use strict";function n(e,n){for(var t in n)!function(t){e[t]=function(a){return arguments.length?(n[t]=a,e):n[t]}}(t)}return n}.call(n,t,n,e),!(void 0!==a&&(e.exports=a))},function(e,n,t){var a;!function(){function r(e,n){if(e||(e={}),!n)return e;for(var t in n)"undefined"==typeof e[t]&&(e[t]=n[t]);return e}function i(e,n){if(e)throw new RangeError(n)}var o=9007199254740992,s=-o,l="0123456789",u="abcdefghijklmnopqrstuvwxyz",c=u.toUpperCase(),m=l+"abcdef",h=function(e){void 0!==e&&("function"==typeof e?this.random=e:this.seed=e),"undefined"==typeof this.random&&(this.mt=this.mersenne_twister(e),this.random=function(){return this.mt.random(this.seed)})};h.prototype.bool=function(e){return e=r(e,{likelihood:50}),i(e.likelihood<0||e.likelihood>100,"Chance: Likelihood accepts values from 0 to 100."),100*this.random()<e.likelihood},h.prototype.character=function(e){e=r(e);var n,t,a="!@#$%^&*()[]";return i(e.alpha&&e.symbols,"Chance: Cannot specify both alpha and symbols."),n="lower"===e.casing?u:"upper"===e.casing?c:u+c,t=e.pool?e.pool:e.alpha?n:e.symbols?a:n+l+a,t.charAt(this.natural({max:t.length-1}))},h.prototype.floating=function(e){var n;e=r(e,{fixed:4});var t=Math.pow(10,e.fixed);i(e.fixed&&e.precision,"Chance: Cannot specify both fixed and precision.");var a=o/t,s=-a;i(e.min&&e.fixed&&e.min<s,"Chance: Min specified is out of range with fixed. Min should be, at least, "+s),i(e.max&&e.fixed&&e.max>a,"Chance: Max specified is out of range with fixed. Max should be, at most, "+a),e=r(e,{min:s,max:a}),n=this.integer({min:e.min*t,max:e.max*t});var l=(n/t).toFixed(e.fixed);return parseFloat(l)},h.prototype.integer=function(e){var n,t;e=r(e,{min:s,max:o}),t=Math.max(Math.abs(e.min),Math.abs(e.max));do n=this.natural({max:t}),n=this.bool()?n:-1*n;while(n<e.min||n>e.max);return n},h.prototype.natural=function(e){return e=r(e,{min:0,max:o}),i(e.min>e.max,"Chance: Min cannot be greater than Max."),Math.floor(this.random()*(e.max-e.min+1)+e.min)},h.prototype.normal=function(e){e=r(e,{mean:0,dev:1});var n,t,a,i,o=e.mean,s=e.dev;do t=2*this.random()-1,a=2*this.random()-1,n=t*t+a*a;while(n>=1);return i=t*Math.sqrt(-2*Math.log(n)/n),s*i+o},h.prototype.string=function(e){e=r(e);for(var n=e.length||this.natural({min:5,max:20}),t="",a=e.pool,i=0;n>i;i++)t+=this.character({pool:a});return t},h.prototype.capitalize=function(e){return e.charAt(0).toUpperCase()+e.substr(1)},h.prototype.mixin=function(e){for(var n in e)h.prototype[n]=e[n];return this},h.prototype.pick=function(e,n){return n&&1!==n?this.shuffle(e).slice(0,n):e[this.natural({max:e.length-1})]},h.prototype.shuffle=function(e){for(var n=e.slice(0),t=[],a=0,r=Number(n.length),i=0;r>i;i++)a=this.natural({max:n.length-1}),t[i]=n[a],n.splice(a,1);return t},h.prototype.paragraph=function(e){e=r(e);for(var n=e.sentences||this.natural({min:3,max:7}),t=[],a=0;n>a;a++)t.push(this.sentence());return t.join(" ")},h.prototype.sentence=function(e){e=r(e);for(var n,t=e.words||this.natural({min:12,max:18}),a=[],i=0;t>i;i++)a.push(this.word());return n=a.join(" "),n=this.capitalize(n)+"."},h.prototype.syllable=function(e){e=r(e);for(var n,t=e.length||this.natural({min:2,max:3}),a="bcdfghjklmnprstvwz",i="aeiou",o=a+i,s="",l=0;t>l;l++)n=this.character(0===l?{pool:o}:-1===a.indexOf(n)?{pool:a}:{pool:i}),s+=n;return s},h.prototype.word=function(e){e=r(e),i(e.syllables&&e.length,"Chance: Cannot specify both syllables AND length.");var n=e.syllables||this.natural({min:1,max:3}),t="";if(e.length){do t+=this.syllable();while(t.length<e.length);t=t.substring(0,e.length)}else for(var a=0;n>a;a++)t+=this.syllable();return t},h.prototype.age=function(e){e=r(e);var n;switch(e.type){case"child":n=this.natural({min:1,max:12});break;case"teen":n=this.natural({min:13,max:19});break;case"adult":n=this.natural({min:18,max:120});break;case"senior":n=this.natural({min:65,max:120});break;default:n=this.natural({min:1,max:120})}return n},h.prototype.birthday=function(e){return e=r(e,{year:(new Date).getFullYear()-this.age(e)}),this.date(e)};var d=["Sophia","Emma","Isabella","Jacob","Mason","Ethan","Noah","Olivia","William","Liam","Jayden","Michael","Ava","Alexander","Aiden","Daniel","Matthew","Elijah","Emily","James","Anthony","Benjamin","Abigail","Joshua","Andrew","David","Joseph","Logan","Jackson","Mia","Christopher","Gabriel","Madison","Samuel","Ryan","Lucas","John","Nathan","Isaac","Dylan","Caleb","Elizabeth","Chloe","Christian","Landon","Jonathan","Carter","Ella","Luke","Owen","Brayden","Avery","Gavin","Wyatt","Addison","Isaiah","Aubrey","Henry","Eli","Hunter","Lily","Jack","Natalie","Evan","Sofia","Jordan","Nicholas","Tyler","Aaron","Charlotte","Zoey","Jeremiah","Julian","Cameron","Grace","Hannah","Amelia","Harper","Levi","Lillian","Brandon","Angel","Austin","Connor","Adrian","Robert","Samantha","Charles","Evelyn","Victoria","Thomas","Brooklyn","Sebastian","Zoe","Colton","Jaxon","Layla","Kevin","Zachary","Ayden","Dominic","Blake","Jose","Hailey","Oliver","Justin","Bentley","Leah","Jason","Chase","Ian","Kaylee","Anna","Aaliyah","Gabriella","Josiah","Allison","Parker","Xavier","Nevaeh","Alexis","Adam","Audrey","Cooper","Savannah","Sarah","Alyssa","Claire","Taylor","Riley","Camila","Nathaniel","Arianna","Ashley","Grayson","Jace","Brianna","Carson","Sophie","Peyton","Nolan","Tristan","Luis","Brody","Bella","Khloe","Genesis","Alexa","Juan","Hudson","Serenity","Kylie","Aubree","Scarlett","Bryson","Carlos","Stella","Maya","Easton","Katherine","Julia","Damian","Alex","Kayden","Ryder","Lucy","Madelyn","Jesus","Cole","Autumn","Makayla","Kayla","Mackenzie","Micah","Vincent","Max","Lauren","Jaxson","Gianna","Eric","Ariana","Asher","Hayden","Faith","Alexandra","Melanie","Sydney","Bailey","Caroline","Naomi","Morgan","Kennedy","Ellie","Jasmine","Eva","Skylar","Diego","Kimberly","Violet","Molly","Miles","Steven","Aria","Ivan","Jocelyn","Trinity","Elias","Aidan","Maxwell","London","Bryce","Lydia","Madeline","Antonio","Giovanni","Reagan","Timothy","Bryan","Piper","Andrea","Santiago","Annabelle","Maria","Colin","Richard","Braxton","Kaleb","Brooke","Kyle","Kaden","Preston","Payton","Miguel","Jonah","Paisley","Paige","Lincoln","Ruby","Nora","Riley","Mariah","Leo","Victor","Brady","Jeremy","Mateo","Brian","Jaden","Ashton","Patrick","Rylee","Declan","Lilly","Brielle","Sean","Joel","Gael","Sawyer","Alejandro","Jade","Marcus","Destiny","Leonardo","Jesse","Caden","Jake","Kaiden","Nicole","Mila","Wesley","Kendall","Liliana","Camden","Kaitlyn","Natalia","Sadie","Edward","Brantley","Jordyn","Roman","Vanessa","Mary","Mya","Penelope","Isabelle","Alice","Axel","Silas","Jude","Grant","Reese","Gabrielle","Hadley","Katelyn","Angelina","Rachel","Isabel","Eleanor","Cayden","Emmanuel","George","Clara","Brooklynn","Jessica","Maddox","Malachi","Bradley","Alan","Weston","Elena","Gage","Aliyah","Vivian","Laila","Sara","Amy","Devin","Eliana","Greyson","Lyla","Juliana","Kenneth","Mark","Oscar","Tanner","Rylan","Valeria","Adriana","Nicolas","Makenzie","Harrison","Elise","Mckenzie","Derek","Quinn","Delilah","Peyton","Ezra","Cora","Kylee","Tucker","Emmett","Avery","Cody","Rebecca","Gracie","Izabella","Calvin","Andres","Jorge","Abel","Paul","Abraham","Kai","Josephine","Alaina","Michelle","Jennifer","Collin","Theodore","Ezekiel","Eden","Omar","Jayce","Valentina","Conner","Bennett","Aurora","Catherine","Stephanie","Trevor","Valerie","Eduardo","Peter","Maximus","Jayla","Jaiden","Willow","Jameson","Seth","Daisy","Alana","Melody","Hazel","Kingston","Summer","Melissa","Javier","Margaret","Travis","Kinsley","Kinley","Garrett","Everett","Ariel","Lila","Graham","Giselle","Ryleigh","Xander","Haley","Julianna","Ivy","Alivia","Cristian","Brynn","Damien","Ryker","Griffin","Keira","Daniela","Aniyah","Angela","Kate","Londyn","Corbin","Myles","Hayden","Harmony","Adalyn","Luca","Zane","Francisco","Ricardo","Alexis","Stephen","Zayden","Megan","Allie","Gabriela","Iker","Drake","Alayna","Lukas","Presley","Charlie","Spencer","Zion","Erick","Jenna","Josue","Alexandria","Ashlyn","Adrianna","Jada","Jeffrey","Trenton","Fiona","Chance","Norah","Paxton","Elliot","Emery","Fernando","Maci","Miranda","Keegan","Landen","Ximena","Amaya","Manuel","Amir","Shane","Cecilia","Raymond","Andre","Ana","Shelby","Katie","Hope","Callie","Jordan","Luna","Leilani","Eliza","Mckenna","Angel","Genevieve","Makenna","Isla","Lola","Danielle","Chelsea","Leila","Tessa","Adelyn","Camille","Mikayla","Adeline","Adalynn","Sienna","Esther","Jacqueline","Emerson","Arabella","Maggie","Athena","Lucia","Lexi","Ayla"];h.prototype.first=function(){return this.pick(d)},h.prototype.gender=function(){return this.pick(["Male","Female"])};var p=["Smith","Johnson","Williams","Jones","Brown","Davis","Miller","Wilson","Moore","Taylor","Anderson","Thomas","Jackson","White","Harris","Martin","Thompson","Garcia","Martinez","Robinson","Clark","Rodriguez","Lewis","Lee","Walker","Hall","Allen","Young","Hernandez","King","Wright","Lopez","Hill","Scott","Green","Adams","Baker","Gonzalez","Nelson","Carter","Mitchell","Perez","Roberts","Turner","Phillips","Campbell","Parker","Evans","Edwards","Collins","Stewart","Sanchez","Morris","Rogers","Reed","Cook","Morgan","Bell","Murphy","Bailey","Rivera","Cooper","Richardson","Cox","Howard","Ward","Torres","Peterson","Gray","Ramirez","James","Watson","Brooks","Kelly","Sanders","Price","Bennett","Wood","Barnes","Ross","Henderson","Coleman","Jenkins","Perry","Powell","Long","Patterson","Hughes","Flores","Washington","Butler","Simmons","Foster","Gonzales","Bryant","Alexander","Russell","Griffin","Diaz","Hayes","Myers","Ford","Hamilton","Graham","Sullivan","Wallace","Woods","Cole","West","Jordan","Owens","Reynolds","Fisher","Ellis","Harrison","Gibson","McDonald","Cruz","Marshall","Ortiz","Gomez","Murray","Freeman","Wells","Webb","Simpson","Stevens","Tucker","Porter","Hunter","Hicks","Crawford","Henry","Boyd","Mason","Morales","Kennedy","Warren","Dixon","Ramos","Reyes","Burns","Gordon","Shaw","Holmes","Rice","Robertson","Hunt","Black","Daniels","Palmer","Mills","Nichols","Grant","Knight","Ferguson","Rose","Stone","Hawkins","Dunn","Perkins","Hudson","Spencer","Gardner","Stephens","Payne","Pierce","Berry","Matthews","Arnold","Wagner","Willis","Ray","Watkins","Olson","Carroll","Duncan","Snyder","Hart","Cunningham","Bradley","Lane","Andrews","Ruiz","Harper","Fox","Riley","Armstrong","Carpenter","Weaver","Greene","Lawrence","Elliott","Chavez","Sims","Austin","Peters","Kelley","Franklin","Lawson","Fields","Gutierrez","Ryan","Schmidt","Carr","Vasquez","Castillo","Wheeler","Chapman","Oliver","Montgomery","Richards","Williamson","Johnston","Banks","Meyer","Bishop","McCoy","Howell","Alvarez","Morrison","Hansen","Fernandez","Garza","Harvey","Little","Burton","Stanley","Nguyen","George","Jacobs","Reid","Kim","Fuller","Lynch","Dean","Gilbert","Garrett","Romero","Welch","Larson","Frazier","Burke","Hanson","Day","Mendoza","Moreno","Bowman","Medina","Fowler","Brewer","Hoffman","Carlson","Silva","Pearson","Holland","Douglas","Fleming","Jensen","Vargas","Byrd","Davidson","Hopkins","May","Terry","Herrera","Wade","Soto","Walters","Curtis","Neal","Caldwell","Lowe","Jennings","Barnett","Graves","Jimenez","Horton","Shelton","Barrett","Obrien","Castro","Sutton","Gregory","McKinney","Lucas","Miles","Craig","Rodriquez","Chambers","Holt","Lambert","Fletcher","Watts","Bates","Hale","Rhodes","Pena","Beck","Newman","Haynes","McDaniel","Mendez","Bush","Vaughn","Parks","Dawson","Santiago","Norris","Hardy","Love","Steele","Curry","Powers","Schultz","Barker","Guzman","Page","Munoz","Ball","Keller","Chandler","Weber","Leonard","Walsh","Lyons","Ramsey","Wolfe","Schneider","Mullins","Benson","Sharp","Bowen","Daniel","Barber","Cummings","Hines","Baldwin","Griffith","Valdez","Hubbard","Salazar","Reeves","Warner","Stevenson","Burgess","Santos","Tate","Cross","Garner","Mann","Mack","Moss","Thornton","Dennis","McGee","Farmer","Delgado","Aguilar","Vega","Glover","Manning","Cohen","Harmon","Rodgers","Robbins","Newton","Todd","Blair","Higgins","Ingram","Reese","Cannon","Strickland","Townsend","Potter","Goodwin","Walton","Rowe","Hampton","Ortega","Patton","Swanson","Joseph","Francis","Goodman","Maldonado","Yates","Becker","Erickson","Hodges","Rios","Conner","Adkins","Webster","Norman","Malone","Hammond","Flowers","Cobb","Moody","Quinn","Blake","Maxwell","Pope","Floyd","Osborne","Paul","McCarthy","Guerrero","Lindsey","Estrada","Sandoval","Gibbs","Tyler","Gross","Fitzgerald","Stokes","Doyle","Sherman","Saunders","Wise","Colon","Gill","Alvarado","Greer","Padilla","Simon","Waters","Nunez","Ballard","Schwartz","McBride","Houston","Christensen","Klein","Pratt","Briggs","Parsons","McLaughlin","Zimmerman","French","Buchanan","Moran","Copeland","Roy","Pittman","Brady","McCormick","Holloway","Brock","Poole","Frank","Logan","Owen","Bass","Marsh","Drake","Wong","Jefferson","Park","Morton","Abbott","Sparks","Patrick","Norton","Huff","Clayton","Massey","Lloyd","Figueroa","Carson","Bowers","Roberson","Barton","Tran","Lamb","Harrington","Casey","Boone","Cortez","Clarke","Mathis","Singleton","Wilkins","Cain","Bryan","Underwood","Hogan","McKenzie","Collier","Luna","Phelps","McGuire","Allison","Bridges","Wilkerson","Nash","Summers","Atkins"];h.prototype.last=function(){return this.pick(p)},h.prototype.name=function(e){e=r(e);var n,t=this.first(),a=this.last();return n=e.middle?t+" "+this.first()+" "+a:e.middle_initial?t+" "+this.character({alpha:!0,casing:"upper"})+". "+a:t+" "+a,e.prefix&&(n=this.prefix()+" "+n),n},h.prototype.name_prefixes=function(){return[{name:"Doctor",abbreviation:"Dr."},{name:"Miss",abbreviation:"Miss"},{name:"Misses",abbreviation:"Mrs."},{name:"Mister",abbreviation:"Mr."}]},h.prototype.prefix=function(e){return this.name_prefix(e)},h.prototype.name_prefix=function(e){return e=r(e),e.full?this.pick(this.name_prefixes()).name:this.pick(this.name_prefixes()).abbreviation},h.prototype.color=function(e){function n(e,n){return[e,e,e].join(n||"")}e=r(e,{format:this.pick(["hex","shorthex","rgb"]),grayscale:!1});var t=e.grayscale;if("hex"===e.format)return"#"+(t?n(this.hash({length:2})):this.hash({length:6}));if("shorthex"===e.format)return"#"+(t?n(this.hash({length:1})):this.hash({length:3}));if("rgb"===e.format)return t?"rgb("+n(this.natural({max:255}),",")+")":"rgb("+this.natural({max:255})+","+this.natural({max:255})+","+this.natural({max:255})+")";throw new Error('Invalid format provided. Please provide one of "hex", "shorthex", or "rgb"')},h.prototype.domain=function(e){return e=r(e),this.word()+"."+(e.tld||this.tld())},h.prototype.email=function(e){return e=r(e),this.word()+"@"+(e.domain||this.domain())},h.prototype.fbid=function(){return parseInt("10000"+this.natural({max:1e11}),10)},h.prototype.hashtag=function(){return"#"+this.word()},h.prototype.ip=function(){return this.natural({max:255})+"."+this.natural({max:255})+"."+this.natural({max:255})+"."+this.natural({max:255})},h.prototype.ipv6=function(){for(var e="",n=0;8>n;n++)e+=this.hash({length:4})+":";return e.substr(0,e.length-1)},h.prototype.klout=function(){return this.natural({min:1,max:99})},h.prototype.tlds=function(){return["com","org","edu","gov","co.uk","net","io"]},h.prototype.tld=function(){return this.pick(this.tlds())},h.prototype.twitter=function(){return"@"+this.word()},h.prototype.address=function(e){return e=r(e),this.natural({min:5,max:2e3})+" "+this.street(e)},h.prototype.areacode=function(e){e=r(e,{parens:!0});var n=this.natural({min:2,max:9}).toString()+this.natural({min:0,max:8}).toString()+this.natural({min:0,max:9}).toString();return e.parens?"("+n+")":n},h.prototype.city=function(){return this.capitalize(this.word({syllables:3}))},h.prototype.coordinates=function(e){return e=r(e),this.latitude(e)+", "+this.longitude(e)},h.prototype.latitude=function(e){return e=r(e,{fixed:5}),this.floating({min:-90,max:90,fixed:e.fixed})},h.prototype.longitude=function(e){return e=r(e,{fixed:5}),this.floating({min:0,max:180,fixed:e.fixed})},h.prototype.phone=function(e){e=r(e,{formatted:!0}),e.formatted||(e.parens=!1);var n=this.areacode(e).toString(),t=this.natural({min:2,max:9}).toString()+this.natural({min:0,max:9}).toString()+this.natural({min:0,max:9}).toString(),a=this.natural({min:1e3,max:9999}).toString();return e.formatted?n+" "+t+"-"+a:n+t+a},h.prototype.postal=function(){var e=this.character({pool:"XVTSRPNKLMHJGECBA"}),n=e+this.natural({max:9})+this.character({alpha:!0,casing:"upper"}),t=this.natural({max:9})+this.character({alpha:!0,casing:"upper"})+this.natural({max:9});return n+" "+t},h.prototype.provinces=function(){return[{name:"Alberta",abbreviation:"AB"},{name:"British Columbia",abbreviation:"BC"},{name:"Manitoba",abbreviation:"MB"},{name:"New Brunswick",abbreviation:"NB"},{name:"Newfoundland and Labrador",abbreviation:"NL"},{name:"Nova Scotia",abbreviation:"NS"},{name:"Ontario",abbreviation:"ON"},{name:"Prince Edward Island",abbreviation:"PE"},{name:"Quebec",abbreviation:"QC"},{name:"Saskatchewan",abbreviation:"SK"},{name:"Northwest Territories",abbreviation:"NT"},{name:"Nunavut",abbreviation:"NU"},{name:"Yukon",abbreviation:"YT"}]},h.prototype.province=function(e){return e&&e.full?this.pick(this.provinces()).name:this.pick(this.provinces()).abbreviation},h.prototype.radio=function(e){e=r(e,{side:"?"});var n="";switch(e.side.toLowerCase()){case"east":case"e":n="W";break;case"west":case"w":n="K";break;default:n=this.character({pool:"KW"})}return n+this.character({alpha:!0,casing:"upper"})+this.character({alpha:!0,casing:"upper"})+this.character({alpha:!0,casing:"upper"})},h.prototype.state=function(e){return e&&e.full?this.pick(this.states()).name:this.pick(this.states()).abbreviation},h.prototype.states=function(){return[{name:"Alabama",abbreviation:"AL"},{name:"Alaska",abbreviation:"AK"},{name:"American Samoa",abbreviation:"AS"},{name:"Arizona",abbreviation:"AZ"},{name:"Arkansas",abbreviation:"AR"},{name:"Armed Forces Europe",abbreviation:"AE"},{name:"Armed Forces Pacific",abbreviation:"AP"},{name:"Armed Forces the Americas",abbreviation:"AA"},{name:"California",abbreviation:"CA"},{name:"Colorado",abbreviation:"CO"},{name:"Connecticut",abbreviation:"CT"},{name:"Delaware",abbreviation:"DE"},{name:"District of Columbia",abbreviation:"DC"},{name:"Federated States of Micronesia",abbreviation:"FM"},{name:"Florida",abbreviation:"FL"},{name:"Georgia",abbreviation:"GA"},{name:"Guam",abbreviation:"GU"},{name:"Hawaii",abbreviation:"HI"},{name:"Idaho",abbreviation:"ID"},{name:"Illinois",abbreviation:"IL"},{name:"Indiana",abbreviation:"IN"},{name:"Iowa",abbreviation:"IA"},{name:"Kansas",abbreviation:"KS"},{name:"Kentucky",abbreviation:"KY"},{name:"Louisiana",abbreviation:"LA"},{name:"Maine",abbreviation:"ME"},{name:"Marshall Islands",abbreviation:"MH"},{name:"Maryland",abbreviation:"MD"},{name:"Massachusetts",abbreviation:"MA"},{name:"Michigan",abbreviation:"MI"},{name:"Minnesota",abbreviation:"MN"},{name:"Mississippi",abbreviation:"MS"},{name:"Missouri",abbreviation:"MO"},{name:"Montana",abbreviation:"MT"},{name:"Nebraska",abbreviation:"NE"},{name:"Nevada",abbreviation:"NV"},{name:"New Hampshire",abbreviation:"NH"},{name:"New Jersey",abbreviation:"NJ"},{name:"New Mexico",abbreviation:"NM"},{name:"New York",abbreviation:"NY"},{name:"North Carolina",abbreviation:"NC"},{name:"North Dakota",abbreviation:"ND"},{name:"Northern Mariana Islands",abbreviation:"MP"},{name:"Ohio",abbreviation:"OH"},{name:"Oklahoma",abbreviation:"OK"},{name:"Oregon",abbreviation:"OR"},{name:"Pennsylvania",abbreviation:"PA"},{name:"Puerto Rico",abbreviation:"PR"},{name:"Rhode Island",abbreviation:"RI"},{name:"South Carolina",abbreviation:"SC"},{name:"South Dakota",abbreviation:"SD"},{name:"Tennessee",abbreviation:"TN"},{name:"Texas",abbreviation:"TX"},{name:"Utah",abbreviation:"UT"},{name:"Vermont",abbreviation:"VT"},{name:"Virgin Islands, U.S.",abbreviation:"VI"},{name:"Virginia",abbreviation:"VA"},{name:"Washington",abbreviation:"WA"},{name:"West Virginia",abbreviation:"WV"},{name:"Wisconsin",abbreviation:"WI"},{name:"Wyoming",abbreviation:"WY"}]},h.prototype.street=function(e){e=r(e);var n=this.word({syllables:2});return n=this.capitalize(n),n+=" ",n+=e.short_suffix?this.street_suffix().abbreviation:this.street_suffix().name},h.prototype.street_suffix=function(){return this.pick(this.street_suffixes())},h.prototype.street_suffixes=function(){return[{name:"Avenue",abbreviation:"Ave"},{name:"Boulevard",abbreviation:"Blvd"},{name:"Center",abbreviation:"Ctr"},{name:"Circle",abbreviation:"Cir"},{name:"Court",abbreviation:"Ct"},{name:"Drive",abbreviation:"Dr"},{name:"Extension",abbreviation:"Ext"},{name:"Glen",abbreviation:"Gln"},{name:"Grove",abbreviation:"Grv"},{name:"Heights",abbreviation:"Hts"},{name:"Highway",abbreviation:"Hwy"},{name:"Junction",abbreviation:"Jct"},{name:"Key",abbreviation:"Key"},{name:"Lane",abbreviation:"Ln"},{name:"Loop",abbreviation:"Loop"},{name:"Manor",abbreviation:"Mnr"},{name:"Mill",abbreviation:"Mill"},{name:"Park",abbreviation:"Park"},{name:"Parkway",abbreviation:"Pkwy"},{name:"Pass",abbreviation:"Pass"},{name:"Path",abbreviation:"Path"},{name:"Pike",abbreviation:"Pike"},{name:"Place",abbreviation:"Pl"},{name:"Plaza",abbreviation:"Plz"},{name:"Point",abbreviation:"Pt"},{name:"Ridge",abbreviation:"Rdg"},{name:"River",abbreviation:"Riv"},{name:"Road",abbreviation:"Rd"},{name:"Square",abbreviation:"Sq"},{name:"Street",abbreviation:"St"},{name:"Terrace",abbreviation:"Ter"},{name:"Trail",abbreviation:"Trl"},{name:"Turnpike",abbreviation:"Tpke"},{name:"View",abbreviation:"Vw"},{name:"Way",abbreviation:"Way"}]},h.prototype.tv=function(e){return this.radio(e)},h.prototype.zip=function(e){for(var n="",t=0;5>t;t++)n+=this.natural({max:9}).toString();if(e&&e.plusfour===!0)for(n+="-",t=0;4>t;t++)n+=this.natural({max:9}).toString();return n},h.prototype.ampm=function(){return this.bool()?"am":"pm"},h.prototype.date=function(e){var n,t=this.month({raw:!0});e=r(e,{year:parseInt(this.year(),10),month:t.numeric-1,day:this.natural({min:1,max:t.days}),hour:this.hour(),minute:this.minute(),second:this.second(),millisecond:this.millisecond(),american:!0,string:!1});var a=new Date(e.year,e.month,e.day,e.hour,e.minute,e.second,e.millisecond);return n=e.american?a.getMonth()+1+"/"+a.getDate()+"/"+a.getFullYear():a.getDate()+"/"+(a.getMonth()+1)+"/"+a.getFullYear(),e.string?n:a},h.prototype.hammertime=function(e){return this.date(e).getTime()},h.prototype.hour=function(e){e=r(e);var n=e.twentyfour?24:12;return this.natural({min:1,max:n})},h.prototype.millisecond=function(){return this.natural({max:999})},h.prototype.minute=h.prototype.second=function(){return this.natural({max:59})},h.prototype.month=function(e){e=r(e);var n=this.pick(this.months());return e.raw?n:n.name},h.prototype.months=function(){return[{name:"January",short_name:"Jan",numeric:"01",days:31},{name:"February",short_name:"Feb",numeric:"02",days:28},{name:"March",short_name:"Mar",numeric:"03",days:31},{name:"April",short_name:"Apr",numeric:"04",days:30},{name:"May",short_name:"May",numeric:"05",days:31},{name:"June",short_name:"Jun",numeric:"06",days:30},{name:"July",short_name:"Jul",numeric:"07",days:31},{name:"August",short_name:"Aug",numeric:"08",days:31},{name:"September",short_name:"Sep",numeric:"09",days:30},{name:"October",short_name:"Oct",numeric:"10",days:31},{name:"November",short_name:"Nov",numeric:"11",days:30},{name:"December",short_name:"Dec",numeric:"12",days:31}]},h.prototype.second=function(){return this.natural({max:59})},h.prototype.timestamp=function(){return this.natural({min:1,max:parseInt((new Date).getTime()/1e3,10)})},h.prototype.year=function(e){return e=r(e,{min:(new Date).getFullYear()}),e.max="undefined"!=typeof e.max?e.max:e.min+100,this.natural(e).toString()},h.prototype.cc=function(e){e=r(e);var n,t,a;n=this.cc_type(e.type?{name:e.type,raw:!0}:{raw:!0}),t=n.prefix.split(""),a=n.length-n.prefix.length-1;for(var i=0;a>i;i++)t.push(this.integer({min:0,max:9}));return t.push(this.luhn_calculate(t.join(""))),t.join("")},h.prototype.cc_types=function(){return[{name:"American Express",short_name:"amex",prefix:"34",length:15},{name:"Bankcard",short_name:"bankcard",prefix:"5610",length:16},{name:"China UnionPay",short_name:"chinaunion",prefix:"62",length:16},{name:"Diners Club Carte Blanche",short_name:"dccarte",prefix:"300",length:14},{name:"Diners Club enRoute",short_name:"dcenroute",prefix:"2014",length:15},{name:"Diners Club International",short_name:"dcintl",prefix:"36",length:14},{name:"Diners Club United States & Canada",short_name:"dcusc",prefix:"54",length:16},{name:"Discover Card",short_name:"discover",prefix:"6011",length:16},{name:"InstaPayment",short_name:"instapay",prefix:"637",length:16},{name:"JCB",short_name:"jcb",prefix:"3528",length:16},{name:"Laser",short_name:"laser",prefix:"6304",length:16},{name:"Maestro",short_name:"maestro",prefix:"5018",length:16},{name:"Mastercard",short_name:"mc",prefix:"51",length:16},{name:"Solo",short_name:"solo",prefix:"6334",length:16},{name:"Switch",short_name:"switch",prefix:"4903",length:16},{name:"Visa",short_name:"visa",prefix:"4",length:16},{name:"Visa Electron",short_name:"electron",prefix:"4026",length:16}]},h.prototype.cc_type=function(e){e=r(e);var n=this.cc_types(),t=null;if(e.name){for(var a=0;a<n.length;a++)if(n[a].name===e.name||n[a].short_name===e.name){t=n[a];break}if(null===t)throw new Error("Credit card type '"+e.name+"'' is not suppoted")}else t=this.pick(n);return e.raw?t:t.name},h.prototype.dollar=function(e){e=r(e,{max:1e4,min:0});var n=this.floating({min:e.min,max:e.max,fixed:2}).toString(),t=n.split(".")[1];return void 0===t?n+=".00":t.length<2&&(n+="0"),0>n?"-$"+n.replace("-",""):"$"+n},h.prototype.exp=function(e){e=r(e);var n={};return n.year=this.exp_year(),n.year===(new Date).getFullYear()?n.month=this.exp_month({future:!0}):n.month=this.exp_month(),e.raw?n:n.month+"/"+n.year},h.prototype.exp_month=function(e){e=r(e);var n,t;if(e.future){do n=this.month({raw:!0}).numeric,t=parseInt(n,10);while(t<(new Date).getMonth())}else n=this.month({raw:!0}).numeric;return n},h.prototype.exp_year=function(){return this.year({max:(new Date).getFullYear()+10})},h.prototype.d4=function(){return this.natural({min:1,max:4})},h.prototype.d6=function(){return this.natural({min:1,max:6})},h.prototype.d8=function(){return this.natural({min:1,max:8})},h.prototype.d10=function(){return this.natural({min:1,max:10})},h.prototype.d12=function(){return this.natural({min:1,max:12})},h.prototype.d20=function(){return this.natural({min:1,max:20})},h.prototype.d30=function(){return this.natural({min:1,max:30})},h.prototype.d100=function(){return this.natural({min:1,max:100})},h.prototype.rpg=function(e,n){if(n=r(n),null===e)throw new Error("A type of die roll must be included");var t=e.toLowerCase().split("d"),a=[];if(2!==t.length||!parseInt(t[0],10)||!parseInt(t[1],10))throw new Error("Invalid format provided. Please provide #d# where the first # is the number of dice to roll, the second # is the max of each die");for(var i=t[0];i>0;i--)a[i-1]=this.natural({min:1,max:t[1]});return"undefined"!=typeof n.sum&&n.sum?a.reduce(function(e,n){return e+n}):a},h.prototype.guid=function(e){e=e||{version:5};var n="ABCDEF1234567890",t="AB89",a=this.string({pool:n,length:8})+"-"+this.string({pool:n,length:4})+"-"+e.version+this.string({pool:n,length:3})+"-"+this.string({pool:t,length:1})+this.string({pool:n,length:3})+"-"+this.string({pool:n,length:12});return a},h.prototype.hash=function(e){e=r(e,{length:40,casing:"lower"});var n="upper"===e.casing?m.toUpperCase():m;return this.string({pool:n,length:e.length})},h.prototype.luhn_check=function(e){var n=e.toString(),t=+n.substring(n.length-1);return t===this.luhn_calculate(+n.substring(0,n.length-1))},h.prototype.luhn_calculate=function(e){for(var n=e.toString().split("").reverse(),t=0,a=0,r=n.length;r>a;++a){var i=+n[a];a%2===0&&(i*=2,i>9&&(i-=9)),t+=i}return 9*t%10},h.prototype.mersenne_twister=function(e){return new f(e)},h.prototype.VERSION="0.5.4";var f=function(e){void 0===e&&(e=(new Date).getTime()),this.N=624,this.M=397,this.MATRIX_A=2567483615,this.UPPER_MASK=2147483648,this.LOWER_MASK=2147483647,this.mt=new Array(this.N),this.mti=this.N+1,this.init_genrand(e)};f.prototype.init_genrand=function(e){for(this.mt[0]=e>>>0,this.mti=1;this.mti<this.N;this.mti++)e=this.mt[this.mti-1]^this.mt[this.mti-1]>>>30,this.mt[this.mti]=(1812433253*((4294901760&e)>>>16)<<16)+1812433253*(65535&e)+this.mti,this.mt[this.mti]>>>=0},f.prototype.init_by_array=function(e,n){var t,a,r=1,i=0;for(this.init_genrand(19650218),t=this.N>n?this.N:n;t;t--)a=this.mt[r-1]^this.mt[r-1]>>>30,this.mt[r]=(this.mt[r]^(1664525*((4294901760&a)>>>16)<<16)+1664525*(65535&a))+e[i]+i,this.mt[r]>>>=0,r++,i++,r>=this.N&&(this.mt[0]=this.mt[this.N-1],r=1),i>=n&&(i=0);for(t=this.N-1;t;t--)a=this.mt[r-1]^this.mt[r-1]>>>30,this.mt[r]=(this.mt[r]^(1566083941*((4294901760&a)>>>16)<<16)+1566083941*(65535&a))-r,this.mt[r]>>>=0,r++,r>=this.N&&(this.mt[0]=this.mt[this.N-1],r=1);this.mt[0]=2147483648},f.prototype.genrand_int32=function(){var e,n=new Array(0,this.MATRIX_A);if(this.mti>=this.N){var t;for(this.mti===this.N+1&&this.init_genrand(5489),t=0;t<this.N-this.M;t++)e=this.mt[t]&this.UPPER_MASK|this.mt[t+1]&this.LOWER_MASK,this.mt[t]=this.mt[t+this.M]^e>>>1^n[1&e];for(;t<this.N-1;t++)e=this.mt[t]&this.UPPER_MASK|this.mt[t+1]&this.LOWER_MASK,this.mt[t]=this.mt[t+(this.M-this.N)]^e>>>1^n[1&e];e=this.mt[this.N-1]&this.UPPER_MASK|this.mt[0]&this.LOWER_MASK,this.mt[this.N-1]=this.mt[this.M-1]^e>>>1^n[1&e],this.mti=0}return e=this.mt[this.mti++],e^=e>>>11,e^=e<<7&2636928640,e^=e<<15&4022730752,e^=e>>>18,e>>>0},f.prototype.genrand_int31=function(){return this.genrand_int32()>>>1},f.prototype.genrand_real1=function(){return this.genrand_int32()*(1/4294967295)},f.prototype.random=function(){return this.genrand_int32()*(1/4294967296)},f.prototype.genrand_real3=function(){return(this.genrand_int32()+.5)*(1/4294967296)},f.prototype.genrand_res53=function(){var e=this.genrand_int32()>>>5,n=this.genrand_int32()>>>6;return(67108864*e+n)*(1/9007199254740992)},"undefined"!=typeof e&&e.exports&&(n=e.exports=h),n.Chance=h,a=function(){return h}.call(n,t,n,e),!(void 0!==a&&(e.exports=a)),"object"==typeof window&&"object"==typeof window.document&&(window.Chance=h,window.chance=new h)}()},function(e,n,t){var a;a=function(e){"use strict";function n(){this.message="This gremlin requires a randomizer to run. Please call randomizer(randomizerObject) before executing the gremlin",this.toString=function(){return this.message}}return n}.call(n,t,n,e),!(void 0!==a&&(e.exports=a))},function(e,n,t){var a;a=function(e){"use strict";function n(e,n,t,a){var r=n.length;e=e.slice(0);var i=function(e,n){if(!e.length)return"function"==typeof a?a():!0;var o=e.shift();o.apply(t,n),o.length===r&&i(e,n,a)};n.push(function(){i(e,n,a)}),i(e,n,a)}return n}.call(n,t,n,e),!(void 0!==a&&(e.exports=a))},function(e,n,t){var a;a=function(e){"use strict";function n(){this.message="This mogwai requires a logger to run. Please call logger(loggerObject) before executing the mogwai",this.toString=function(){return this.message}}return n}.call(n,t,n,e),!(void 0!==a&&(e.exports=a))},function(e,n,t){var a;a=function(e){"use strict";function n(e,n){for(var t=0,a=n.length;a>t;t++)for(var r in e)"function"!=typeof n[t][r]||n[t][r]()||n[t][r](e[r])}var a=t(2),r={species:{clicker:t(10),toucher:t(13),formFiller:t(11),scroller:t(12),typer:t(14)},mogwais:{alert:t(7),fps:t(8),gizmo:t(9)},strategies:{allTogether:t(15),bySpecies:t(16),distribution:t(17)}},i=t(4),o=function(){this._gremlins=[],
	this._mogwais=[],this._strategies=[],this._beforeCallbacks=[],this._afterCallbacks=[],this._logger=console,this._randomizer=new a};return o.prototype.gremlin=function(e){return this._gremlins.push(e),this},o.prototype.allGremlins=function(){for(var e in r.species)this.gremlin(r.species[e]());return this},o.prototype.mogwai=function(e){return this._mogwais.push(e),this},o.prototype.allMogwais=function(){for(var e in r.mogwais)this.mogwai(r.mogwais[e]());return this},o.prototype.strategy=function(e){return this._strategies.push(e),this},o.prototype.before=function(e){return this._beforeCallbacks.push(e),this},o.prototype.after=function(e){return this._afterCallbacks.push(e),this},o.prototype.logger=function(e){return arguments.length?(this._logger=e,this):this._logger},o.prototype.log=function(e){this._logger.log(e)},o.prototype.randomizer=function(e){return arguments.length?(this._randomizer=e,this):this._randomizer},o.prototype.seed=function(e){return this._randomizer=new a(e),this},o.prototype.unleash=function(e,t){0===this._gremlins.length&&this.allGremlins(),0===this._mogwais.length&&this.allMogwais(),0===this._strategies.length&&this.strategy(r.strategies.distribution());var a=[].concat(this._gremlins,this._mogwais),o=a.concat(this._strategies,this._beforeCallbacks,this._afterCallbacks);n({logger:this._logger,randomizer:this._randomizer},o);var s=this._beforeCallbacks;s=s.concat(this._mogwais);for(var l=this._afterCallbacks,u=0,c=a.length;c>u;u++)"function"==typeof a[u].cleanUp&&l.push(a[u].cleanUp);var m=this;i(s,[],m,function(){i(m._strategies,[m._gremlins,e],m,function(){i(l,[],m,function(){"function"==typeof t&&t()})})})},o.prototype.stop=function(){for(var e=this._strategies,n=0,t=e.length;t>n;n++)e[n].stop()},r.createHorde=function(){return new o},window&&(window.gremlins=r),r}.call(n,t,n,e),!(void 0!==a&&(e.exports=a))},function(e,n,t){var a;a=function(e){"use strict";var n=t(1),a=(t(2),t(5));return function(){function e(){return o.randomizer.bool()}function t(){return o.randomizer.sentence()}function r(){if(!o.logger)throw new a;-1!==o.watchEvents.indexOf("alert")&&(window.alert=function(e){o.logger.warn("mogwai ","alert     ",e,"alert")}),-1!==o.watchEvents.indexOf("confirm")&&(window.confirm=function(e){o.confirmResponse(),o.logger.warn("mogwai ","alert     ",e,"confirm")}),-1!==o.watchEvents.indexOf("prompt")&&(window.prompt=function(e){o.promptResponse(),o.logger.warn("mogwai ","alert     ",e,"prompt")})}var i=["alert","confirm","prompt"],o={watchEvents:i,confirmResponse:e,promptResponse:t,logger:null,randomizer:null},s=window.alert,l=window.confirm,u=window.prompt;return r.cleanUp=function(){return window.alert=s,window.confirm=l,window.prompt=u,r},n(r,o),r}}.call(n,t,n,e),!(void 0!==a&&(e.exports=a))},function(e,n,t){var a;a=function(e){"use strict";var n=t(1),a=t(5);return function(){function e(e){return 10>e?"error":20>e?"warn":"log"}function t(e){e-l>s.delay&&(r(e),l=e),o&&window.requestAnimationFrame(t)}function r(){function e(e){t=e,window.requestAnimationFrame(n)}function n(e){var n=16>e-t?60:1e3/(e-t),a=s.levelSelector(n);s.logger[a]("mogwai ","fps       ",n)}var t;window.requestAnimationFrame(e)}function i(){if(!s.logger)throw new a;o=!0,window.requestAnimationFrame(t)}window.requestAnimationFrame||(window.requestAnimationFrame=window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame||function(e){window.setTimeout(e,1e3/60)});var o,s={delay:500,levelSelector:e,logger:null},l=-(1/0);return i.cleanUp=function(){return o=!1,i},n(i,s),i}}.call(n,t,n,e),!(void 0!==a&&(e.exports=a))},function(e,n,t){var a;a=function(e){"use strict";var n=t(1);return function(){function e(){function e(){if(n++,n==r.maxErrors){if(i.stop(),!r.logger)return;window.setTimeout(function(){r.logger.warn("mogwai ","gizmo     ","stopped test execution after ",r.maxErrors,"errors")},4)}}var n=0,i=this;t=window.onerror,window.onerror=function(n,a,r){return e(),t?t(n,a,r):!1},a=console.error,console.error=function(){e(),a.apply(console,arguments)}}var t,a,r={maxErrors:10,logger:null};return e.cleanUp=function(){return window.onerror=t,console.error=a.bind(console),e},n(e,r),e}}.call(n,t,n,e),!(void 0!==a&&(e.exports=a))},function(e,n,t){var a;a=function(e){"use strict";var n=t(1),a=(t(2),t(3));return function(){function e(){return[u.randomizer.natural({max:o.documentElement.clientWidth-1}),u.randomizer.natural({max:o.documentElement.clientHeight-1})]}function t(e,n){var t=o.createElement("div");t.style.zIndex=2e3,t.style.border="3px solid red",t.style["border-radius"]="50%",t.style.borderRadius="50%",t.style.width="40px",t.style.height="40px",t.style["box-sizing"]="border-box",t.style.position="absolute",t.style.webkitTransition="opacity 1s ease-out",t.style.mozTransition="opacity 1s ease-out",t.style.transition="opacity 1s ease-out",t.style.left=e-20+"px",t.style.top=n-20+"px";var a=s.appendChild(t);setTimeout(function(){s.removeChild(a)},1e3),setTimeout(function(){a.style.opacity=0},50)}function r(){return!0}function i(){if(!u.randomizer)throw new a;var e,n,t,r,i=0;do if(e=u.positionSelector(),n=e[0],t=e[1],r=o.elementFromPoint(n,t),i++,i>u.maxNbTries)return!1;while(!r||!u.canClick(r));var s=o.createEvent("MouseEvents"),l=u.randomizer.pick(u.clickTypes);s.initMouseEvent(l,!0,!0,window,0,0,0,n,t,!1,!1,!1,!1,0,null),r.dispatchEvent(s),"function"==typeof u.showAction&&u.showAction(n,t,l),u.logger&&"function"==typeof u.logger.log&&u.logger.log("gremlin","clicker   ",l,"at",n,t)}var o=window.document,s=o.body,l=["click","click","click","click","click","click","dblclick","dblclick","mousedown","mouseup","mouseover","mouseover","mouseover","mousemove","mouseout"],u={clickTypes:l,positionSelector:e,showAction:t,canClick:r,maxNbTries:10,logger:null,randomizer:null};return n(i,u),i}}.call(n,t,n,e),!(void 0!==a&&(e.exports=a))},function(e,n,t){var a;a=function(e){"use strict";var n=t(1),a=(t(2),t(3));return function(){function e(e){"undefined"==typeof e.attributes["data-old-border"]&&(e.attributes["data-old-border"]=e.style.border);var n=e.attributes["data-old-border"];e.style.border="1px solid red",setTimeout(function(){e.style.border=n},500)}function t(){return!0}function r(){if(!p.randomizer)throw new a;var e=[];for(var n in p.elementMapTypes)p.elementMapTypes.hasOwnProperty(n)&&e.push(n);var t,r=0;do{var i=h.querySelectorAll(e.join(","));if(0===i.length)return!1;if(t=p.randomizer.pick(i),r++,r>p.maxNbTries)return!1}while(!t||!p.canFillElement(t));var o=null;for(var s in p.elementMapTypes)if(m(t,s)){o=s;break}var l=p.elementMapTypes[o](t);"function"==typeof p.showAction&&p.showAction(t),p.logger&&"function"==typeof p.logger.log&&p.logger.log("gremlin","formFiller","input",l,"in",t)}function i(e){var n=p.randomizer.character();return e.value+=n,n}function o(e){var n=p.randomizer.character({pool:"0123456789"});return e.value+=n,n}function s(e){var n=e.querySelectorAll("option");if(0!==n.length){for(var t=p.randomizer.pick(n),a=0,r=n.length;r>a;a++){var i=n[a];i.selected=i.value==t.value}return t.value}}function l(e){var n=h.createEvent("MouseEvents");return n.initMouseEvent("click",!0,!0,window,0,0,0,0,0,!1,!1,!1,!1,0,null),e.dispatchEvent(n),e.value}function u(e){var n=h.createEvent("MouseEvents");return n.initMouseEvent("click",!0,!0,window,0,0,0,0,0,!1,!1,!1,!1,0,null),e.dispatchEvent(n),e.value}function c(e){var n=p.randomizer.email();return e.value=n,n}function m(e,n){if(e.webkitMatchesSelector)m=function(e,n){return e.webkitMatchesSelector(n)};else if(e.mozMatchesSelector)m=function(e,n){return e.mozMatchesSelector(n)};else if(e.msMatchesSelector)m=function(e,n){return e.msMatchesSelector(n)};else{if(!e.oMatchesSelector)throw new Error("Unsupported browser");m=function(e,n){return e.oMatchesSelector(n)}}return m(e,n)}var h=window.document,d={textarea:i,'input[type="text"]':i,'input[type="password"]':i,'input[type="number"]':o,select:s,'input[type="radio"]':l,'input[type="checkbox"]':u,'input[type="email"]':c,"input:not([type])":i},p={elementMapTypes:d,showAction:e,canFillElement:t,maxNbTries:10,logger:null,randomizer:null};return n(r,p),r}}.call(n,t,n,e),!(void 0!==a&&(e.exports=a))},function(e,n,t){var a;a=function(e){"use strict";var n=t(1),a=(t(2),t(3));return function(){function e(){var e=Math.max(s.scrollWidth,s.offsetWidth,o.scrollWidth,o.offsetWidth,o.clientWidth),n=Math.max(s.scrollHeight,s.offsetHeight,o.scrollHeight,o.offsetHeight,o.clientHeight);return[l.randomizer.natural({max:e-o.clientWidth}),l.randomizer.natural({max:n-o.clientHeight})]}function t(e,n){var t=i.createElement("div");t.style.zIndex=2e3,t.style.border="3px solid red",t.style.width=o.clientWidth-25+"px",t.style.height=o.clientHeight-25+"px",t.style.position="absolute",t.style.webkitTransition="opacity 1s ease-out",t.style.mozTransition="opacity 1s ease-out",t.style.transition="opacity 1s ease-out",t.style.left=e+10+"px",t.style.top=n+10+"px";var a=s.appendChild(t);setTimeout(function(){s.removeChild(a)},1e3),setTimeout(function(){a.style.opacity=0},50)}function r(){if(!l.randomizer)throw new a;var e=l.positionSelector(),n=e[0],t=e[1];window.scrollTo(n,t),"function"==typeof l.showAction&&l.showAction(n,t),"function"==typeof l.logger.log&&l.logger.log("gremlin","scroller  ","scroll to",n,t)}var i=window.document,o=i.documentElement,s=i.body,l={positionSelector:e,showAction:t,logger:null,randomizer:null};return n(r,l),r}}.call(n,t,n,e),!(void 0!==a&&(e.exports=a))},function(e,n,t){var a;a=function(e){"use strict";var n=t(1),a=(t(2),t(3));return function(){function e(){return[h.randomizer.natural({max:u.documentElement.clientWidth-1}),h.randomizer.natural({max:u.documentElement.clientHeight-1})]}function t(e){var n=u.createDocumentFragment();e.forEach(function(e){var t=u.createElement("div");t.style.zIndex=2e3,t.style.background="red",t.style["border-radius"]="50%",t.style.borderRadius="50%",t.style.width="20px",t.style.height="20px",t.style.position="absolute",t.style.webkitTransition="opacity .5s ease-out",t.style.mozTransition="opacity .5s ease-out",t.style.transition="opacity .5s ease-out",t.style.left=e.x-10+"px",t.style.top=e.y-10+"px";var a=n.appendChild(t);setTimeout(function(){c.removeChild(a)},500),setTimeout(function(){a.style.opacity=0},50)}),u.body.appendChild(n)}function r(){return!0}function i(e,n,t,a){var r,i,o,s=e[0],l=e[1],u=[];if(1===n)return[{x:s,y:l}];for(t=t||100,a=null!==a?a*Math.PI/180:0,r=2*Math.PI/n,i=0;n>i;i++)o=r*i+a,u.push({x:s+t*Math.cos(o),y:l+t*Math.sin(o)});return u}function o(e,n,t){var a=[],r=u.createEvent("Event");r.initEvent("touch"+t,!0,!0),a.identifiedTouch=a.item=function(e){return this[e]||{}},e.forEach(function(e,t){var r=Math.round(e.x),i=Math.round(e.y);a.push({pageX:r,pageY:i,clientX:r,clientY:i,screenX:r,screenY:i,target:n,identifier:t})}),r.touches="end"==t?[]:a,r.targetTouches="end"==t?[]:a,r.changedTouches=a,n.dispatchEvent(r),h.showAction(e)}function s(e,n,t,a,r){function s(){var m=a.radius;1!==a.scale&&(m=a.radius-a.radius*(1-a.scale)*(1/u)*c);var h=n[0]+a.distanceX/u*c,d=n[1]+a.distanceY/u*c,p="number"==typeof a.rotation?a.rotation/u*c:null,f=i([h,d],t.length,m,p),y=1==c,b=c==u;if(y)o(f,e,"start");else{if(b)return o(f,e,"end"),r(f);o(f,e,"move")}setTimeout(s,l),c++}var l=10,u=Math.ceil(a.duration/l),c=1;s()}function l(e){function n(n,t){"function"==typeof h.showAction&&h.showAction(n),h.logger&&"function"==typeof h.logger.log&&h.logger.log("gremlin","toucher   ",l,"at",r,i,t),e()}if(!h.randomizer)throw new a;var t,r,i,o,s=0;do if(t=h.positionSelector(),r=t[0],i=t[1],o=u.elementFromPoint(r,i),s++,s>h.maxNbTries)return;while(!o||!h.canTouch(o));var l=h.randomizer.pick(h.touchTypes);d[l](t,o,n)}var u=window.document,c=u.body,m=["tap","tap","tap","doubletap","gesture","gesture","gesture","multitouch","multitouch"],h={touchTypes:m,positionSelector:e,showAction:t,canTouch:r,maxNbTries:10,logger:null,randomizer:null,maxTouches:2},d={tap:function(e,n,t){var a=i(e,1),r={duration:h.randomizer.integer({min:20,max:700})};o(a,n,"start"),setTimeout(function(){o(a,n,"end"),t(a,r)},r.duration)},doubletap:function(e,n,t){d.tap(e,n,function(){setTimeout(function(){d.tap(e,n,t)},30)})},gesture:function p(e,n,t){var p={distanceX:h.randomizer.integer({min:-100,max:200}),distanceY:h.randomizer.integer({min:-100,max:200}),duration:h.randomizer.integer({min:20,max:500})},a=i(e,1,p.radius);s(n,e,a,p,function(e){t(e,p)})},multitouch:function(e,n,t){var a=h.randomizer.integer({min:2,max:h.maxTouches}),r={scale:h.randomizer.floating({min:0,max:2}),rotation:h.randomizer.natural({min:-100,max:100}),radius:h.randomizer.integer({min:50,max:200}),distanceX:h.randomizer.integer({min:-20,max:20}),distanceY:h.randomizer.integer({min:-20,max:20}),duration:h.randomizer.integer({min:100,max:1500})},o=i(e,a,r.radius);s(n,e,o,r,function(e){t(e,r)})}};return n(l,h),l}}.call(n,t,n,e),!(void 0!==a&&(e.exports=a))},function(e,n,t){var a;a=function(e){"use strict";var n=t(1),a=(t(2),t(3));return function(){function e(){return c.randomizer.natural({min:3,max:254})}function t(e,n){return o.elementFromPoint(e,n)}function r(e,n,t,a){var r=o.createElement("div");r.style.zIndex=2e3,r.style.border="3px solid orange",r.style["border-radius"]="50%",r.style.borderRadius="50%",r.style.width="40px",r.style.height="40px",r.style["box-sizing"]="border-box",r.style.position="absolute",r.style.webkitTransition="opacity 1s ease-out",r.style.mozTransition="opacity 1s ease-out",r.style.transition="opacity 1s ease-out",r.style.left=n+"px",r.style.top=t+"px",r.style.textAlign="center",r.style.paddingTop="7px",r.innerHTML=String.fromCharCode(a);var i=l.appendChild(r);setTimeout(function(){l.removeChild(i)},1e3),setTimeout(function(){i.style.opacity=0},50)}function i(){if(!c.randomizer)throw new a;var e=o.createEventObject?o.createEventObject():o.createEvent("Events"),n=c.randomizer.pick(c.eventTypes),t=c.keyGenerator(),r=c.randomizer.natural({max:s.clientWidth-1}),i=c.randomizer.natural({max:s.clientHeight-1}),l=c.targetElement(r,i);e.initEvent&&e.initEvent(n,!0,!0),e.keyCode=t,e.which=t,e.keyCodeVal=t,l.dispatchEvent?l.dispatchEvent(e):l.fireEvent("on"+n,e),"function"==typeof c.showAction&&c.showAction(l,r,i,t),c.logger&&"function"==typeof c.logger.log&&c.logger.log("gremlin","typer       type",String.fromCharCode(t),"at",r,i)}var o=window.document,s=o.documentElement,l=o.body,u=["keypress","keyup","keydown"],c={eventTypes:u,showAction:r,keyGenerator:e,targetElement:t,logger:null,randomizer:null};return n(i,c),i}}.call(n,t,n,e),!(void 0!==a&&(e.exports=a))},function(e,n,t){var a;a=function(e){"use strict";var n=t(4),a=t(1);return function(){function e(e,a,s){function l(t){n(e,[],m,t)}function u(e){return r?void 0:e>=c?t():void l(function(){setTimeout(function(){u(++e)},o.delay)})}var c=a&&a.nb?a.nb:o.nb,m=this;r=!1,i=s,u(0)}function t(){"function"==typeof i&&i(),i=null}var r,i,o={delay:10,nb:100};return e.stop=function(){r=!0,setTimeout(t,4)},a(e,o),e}}.call(n,t,n,e),!(void 0!==a&&(e.exports=a))},function(e,n,t){var a;a=function(e){"use strict";var n=t(4),a=t(1);return function(){function e(e,a,s){function l(e,t,a){return r?void 0:t>=c?a():void n([e],[],m,function(){setTimeout(function(){l(e,++t,a)},o.delay)})}function u(){return r?void 0:0===e.length?t():void l(e.shift(),0,u)}var c=a&&a.nb?a.nb:o.nb,e=e.slice(0),m=this;r=!1,i=s,u()}function t(){"function"==typeof i&&i(),i=null}var r,i,o={delay:10,nb:200};return e.stop=function(){r=!0,setTimeout(t,4)},a(e,o),e}}.call(n,t,n,e),!(void 0!==a&&(e.exports=a))},function(e,n,t){var a;a=function(e){"use strict";var n=t(4),a=t(1),r=t(2);return function(){function e(e,a,r){function c(t,a,r){return s?void 0:a>=m?o():void n([t],[],d,function(){setTimeout(function(){c(i(e,h),++a,r)},u.delay)})}var m=a&&a.nb?a.nb:u.nb,e=e.slice(0),h=0===u.distribution.length?t(e):u.distribution,d=this;return 0===m?r():(s=!1,l=r,void c(i(e,h),0,c))}function t(e){var n=e.length;if(0===n)return[];for(var t=[],a=1/n,r=0;n>r;r++)t.push(a);return t}function i(e,n){for(var t=0,a=u.randomizer.floating({min:0,max:1}),r=0,i=e.length;i>r;r++)if(t+=n[r],t>=a)return e[r];return function(){}}function o(){"function"==typeof l&&l(),l=null}var s,l,u={distribution:[],delay:10,nb:1e3,randomizer:new r};return e.stop=function(){s=!0,setTimeout(o,4)},a(e,u),e}}.call(n,t,n,e),!(void 0!==a&&(e.exports=a))}])});

/***/ },
/* 14 */
/*!*************************************************************!*\
  !*** /home/dp/Projects/sdk/spasdk/app/lib/develop/hooks.js ***!
  \*************************************************************/
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(__filename) {/**
	 * @license The MIT License (MIT)
	 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
	 */
	
	/* eslint no-path-concat: 0 */
	
	'use strict';
	
	var getElementById = document.getElementById,
	    querySelector  = document.querySelector;
	
	
	document.getElementById = function ( id ) {
	    var el = getElementById.call(document, id);
	
	    if ( !el ) {
	        throw new Error(__filename + ': no element with id ' + id);
	    }
	
	    return el;
	};
	
	
	document.querySelector = function ( selector ) {
	    var el = querySelector.call(document, selector);
	
	    if ( !el ) {
	        throw new Error(__filename + ': no element with selector: ' + selector);
	    }
	
	    return el;
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, "../../sdk/spasdk/app/lib/develop/hooks.js"))

/***/ },
/* 15 */
/*!**************************************************************!*\
  !*** /home/dp/Projects/sdk/spasdk/app/lib/develop/static.js ***!
  \**************************************************************/
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Static files reload on change.
	 *
	 * @license The MIT License (MIT)
	 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
	 */
	
	'use strict';
	
	//var tag = require('spa-dom').tag;
	
	
	//window.LiveReloadOptions = {port: LIVERELOAD.port};
	window.LiveReloadOptions = {
	    host: location.hostname,
	    port: (0) || 35729
	};
	//console.log(require('spa-gulp-livereload/config').default.tinylr);
	//console.log(LIVERELOAD);
	
	__webpack_require__(/*! livereload-js/dist/livereload.js */ 16);
	
	// livereload activation
	//if ( config.livereload ) {
	    // load external script
	//document.head.appendChild(tag('script', {
	//    type: 'text/javascript',
	//    src: '/node_modules/livereload-js/dist/livereload.js?host=' + location.hostname + '&port=' + LIVERELOAD.port
	//}));
	//}


/***/ },
/* 16 */
/*!****************************************************************!*\
  !*** /home/dp/Projects/sdk/~/livereload-js/dist/livereload.js ***!
  \****************************************************************/
/***/ function(module, exports) {

	(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
	(function() {
	  var Connector, PROTOCOL_6, PROTOCOL_7, Parser, Version, _ref;
	
	  _ref = require('./protocol'), Parser = _ref.Parser, PROTOCOL_6 = _ref.PROTOCOL_6, PROTOCOL_7 = _ref.PROTOCOL_7;
	
	  Version = '2.2.2';
	
	  exports.Connector = Connector = (function() {
	    function Connector(options, WebSocket, Timer, handlers) {
	      this.options = options;
	      this.WebSocket = WebSocket;
	      this.Timer = Timer;
	      this.handlers = handlers;
	      this._uri = "ws" + (this.options.https ? "s" : "") + "://" + this.options.host + ":" + this.options.port + "/livereload";
	      this._nextDelay = this.options.mindelay;
	      this._connectionDesired = false;
	      this.protocol = 0;
	      this.protocolParser = new Parser({
	        connected: (function(_this) {
	          return function(protocol) {
	            _this.protocol = protocol;
	            _this._handshakeTimeout.stop();
	            _this._nextDelay = _this.options.mindelay;
	            _this._disconnectionReason = 'broken';
	            return _this.handlers.connected(protocol);
	          };
	        })(this),
	        error: (function(_this) {
	          return function(e) {
	            _this.handlers.error(e);
	            return _this._closeOnError();
	          };
	        })(this),
	        message: (function(_this) {
	          return function(message) {
	            return _this.handlers.message(message);
	          };
	        })(this)
	      });
	      this._handshakeTimeout = new Timer((function(_this) {
	        return function() {
	          if (!_this._isSocketConnected()) {
	            return;
	          }
	          _this._disconnectionReason = 'handshake-timeout';
	          return _this.socket.close();
	        };
	      })(this));
	      this._reconnectTimer = new Timer((function(_this) {
	        return function() {
	          if (!_this._connectionDesired) {
	            return;
	          }
	          return _this.connect();
	        };
	      })(this));
	      this.connect();
	    }
	
	    Connector.prototype._isSocketConnected = function() {
	      return this.socket && this.socket.readyState === this.WebSocket.OPEN;
	    };
	
	    Connector.prototype.connect = function() {
	      this._connectionDesired = true;
	      if (this._isSocketConnected()) {
	        return;
	      }
	      this._reconnectTimer.stop();
	      this._disconnectionReason = 'cannot-connect';
	      this.protocolParser.reset();
	      this.handlers.connecting();
	      this.socket = new this.WebSocket(this._uri);
	      this.socket.onopen = (function(_this) {
	        return function(e) {
	          return _this._onopen(e);
	        };
	      })(this);
	      this.socket.onclose = (function(_this) {
	        return function(e) {
	          return _this._onclose(e);
	        };
	      })(this);
	      this.socket.onmessage = (function(_this) {
	        return function(e) {
	          return _this._onmessage(e);
	        };
	      })(this);
	      return this.socket.onerror = (function(_this) {
	        return function(e) {
	          return _this._onerror(e);
	        };
	      })(this);
	    };
	
	    Connector.prototype.disconnect = function() {
	      this._connectionDesired = false;
	      this._reconnectTimer.stop();
	      if (!this._isSocketConnected()) {
	        return;
	      }
	      this._disconnectionReason = 'manual';
	      return this.socket.close();
	    };
	
	    Connector.prototype._scheduleReconnection = function() {
	      if (!this._connectionDesired) {
	        return;
	      }
	      if (!this._reconnectTimer.running) {
	        this._reconnectTimer.start(this._nextDelay);
	        return this._nextDelay = Math.min(this.options.maxdelay, this._nextDelay * 2);
	      }
	    };
	
	    Connector.prototype.sendCommand = function(command) {
	      if (this.protocol == null) {
	        return;
	      }
	      return this._sendCommand(command);
	    };
	
	    Connector.prototype._sendCommand = function(command) {
	      return this.socket.send(JSON.stringify(command));
	    };
	
	    Connector.prototype._closeOnError = function() {
	      this._handshakeTimeout.stop();
	      this._disconnectionReason = 'error';
	      return this.socket.close();
	    };
	
	    Connector.prototype._onopen = function(e) {
	      var hello;
	      this.handlers.socketConnected();
	      this._disconnectionReason = 'handshake-failed';
	      hello = {
	        command: 'hello',
	        protocols: [PROTOCOL_6, PROTOCOL_7]
	      };
	      hello.ver = Version;
	      if (this.options.ext) {
	        hello.ext = this.options.ext;
	      }
	      if (this.options.extver) {
	        hello.extver = this.options.extver;
	      }
	      if (this.options.snipver) {
	        hello.snipver = this.options.snipver;
	      }
	      this._sendCommand(hello);
	      return this._handshakeTimeout.start(this.options.handshake_timeout);
	    };
	
	    Connector.prototype._onclose = function(e) {
	      this.protocol = 0;
	      this.handlers.disconnected(this._disconnectionReason, this._nextDelay);
	      return this._scheduleReconnection();
	    };
	
	    Connector.prototype._onerror = function(e) {};
	
	    Connector.prototype._onmessage = function(e) {
	      return this.protocolParser.process(e.data);
	    };
	
	    return Connector;
	
	  })();
	
	}).call(this);
	
	},{"./protocol":6}],2:[function(require,module,exports){
	(function() {
	  var CustomEvents;
	
	  CustomEvents = {
	    bind: function(element, eventName, handler) {
	      if (element.addEventListener) {
	        return element.addEventListener(eventName, handler, false);
	      } else if (element.attachEvent) {
	        element[eventName] = 1;
	        return element.attachEvent('onpropertychange', function(event) {
	          if (event.propertyName === eventName) {
	            return handler();
	          }
	        });
	      } else {
	        throw new Error("Attempt to attach custom event " + eventName + " to something which isn't a DOMElement");
	      }
	    },
	    fire: function(element, eventName) {
	      var event;
	      if (element.addEventListener) {
	        event = document.createEvent('HTMLEvents');
	        event.initEvent(eventName, true, true);
	        return document.dispatchEvent(event);
	      } else if (element.attachEvent) {
	        if (element[eventName]) {
	          return element[eventName]++;
	        }
	      } else {
	        throw new Error("Attempt to fire custom event " + eventName + " on something which isn't a DOMElement");
	      }
	    }
	  };
	
	  exports.bind = CustomEvents.bind;
	
	  exports.fire = CustomEvents.fire;
	
	}).call(this);
	
	},{}],3:[function(require,module,exports){
	(function() {
	  var LessPlugin;
	
	  module.exports = LessPlugin = (function() {
	    LessPlugin.identifier = 'less';
	
	    LessPlugin.version = '1.0';
	
	    function LessPlugin(window, host) {
	      this.window = window;
	      this.host = host;
	    }
	
	    LessPlugin.prototype.reload = function(path, options) {
	      if (this.window.less && this.window.less.refresh) {
	        if (path.match(/\.less$/i)) {
	          return this.reloadLess(path);
	        }
	        if (options.originalPath.match(/\.less$/i)) {
	          return this.reloadLess(options.originalPath);
	        }
	      }
	      return false;
	    };
	
	    LessPlugin.prototype.reloadLess = function(path) {
	      var link, links, _i, _len;
	      links = (function() {
	        var _i, _len, _ref, _results;
	        _ref = document.getElementsByTagName('link');
	        _results = [];
	        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	          link = _ref[_i];
	          if (link.href && link.rel.match(/^stylesheet\/less$/i) || (link.rel.match(/stylesheet/i) && link.type.match(/^text\/(x-)?less$/i))) {
	            _results.push(link);
	          }
	        }
	        return _results;
	      })();
	      if (links.length === 0) {
	        return false;
	      }
	      for (_i = 0, _len = links.length; _i < _len; _i++) {
	        link = links[_i];
	        link.href = this.host.generateCacheBustUrl(link.href);
	      }
	      this.host.console.log("LiveReload is asking LESS to recompile all stylesheets");
	      this.window.less.refresh(true);
	      return true;
	    };
	
	    LessPlugin.prototype.analyze = function() {
	      return {
	        disable: !!(this.window.less && this.window.less.refresh)
	      };
	    };
	
	    return LessPlugin;
	
	  })();
	
	}).call(this);
	
	},{}],4:[function(require,module,exports){
	(function() {
	  var Connector, LiveReload, Options, Reloader, Timer,
	    __hasProp = {}.hasOwnProperty;
	
	  Connector = require('./connector').Connector;
	
	  Timer = require('./timer').Timer;
	
	  Options = require('./options').Options;
	
	  Reloader = require('./reloader').Reloader;
	
	  exports.LiveReload = LiveReload = (function() {
	    function LiveReload(window) {
	      var k, v, _ref;
	      this.window = window;
	      this.listeners = {};
	      this.plugins = [];
	      this.pluginIdentifiers = {};
	      this.console = this.window.console && this.window.console.log && this.window.console.error ? this.window.location.href.match(/LR-verbose/) ? this.window.console : {
	        log: function() {},
	        error: this.window.console.error.bind(this.window.console)
	      } : {
	        log: function() {},
	        error: function() {}
	      };
	      if (!(this.WebSocket = this.window.WebSocket || this.window.MozWebSocket)) {
	        this.console.error("LiveReload disabled because the browser does not seem to support web sockets");
	        return;
	      }
	      if ('LiveReloadOptions' in window) {
	        this.options = new Options();
	        _ref = window['LiveReloadOptions'];
	        for (k in _ref) {
	          if (!__hasProp.call(_ref, k)) continue;
	          v = _ref[k];
	          this.options.set(k, v);
	        }
	      } else {
	        this.options = Options.extract(this.window.document);
	        if (!this.options) {
	          this.console.error("LiveReload disabled because it could not find its own <SCRIPT> tag");
	          return;
	        }
	      }
	      this.reloader = new Reloader(this.window, this.console, Timer);
	      this.connector = new Connector(this.options, this.WebSocket, Timer, {
	        connecting: (function(_this) {
	          return function() {};
	        })(this),
	        socketConnected: (function(_this) {
	          return function() {};
	        })(this),
	        connected: (function(_this) {
	          return function(protocol) {
	            var _base;
	            if (typeof (_base = _this.listeners).connect === "function") {
	              _base.connect();
	            }
	            _this.log("LiveReload is connected to " + _this.options.host + ":" + _this.options.port + " (protocol v" + protocol + ").");
	            return _this.analyze();
	          };
	        })(this),
	        error: (function(_this) {
	          return function(e) {
	            if (e instanceof ProtocolError) {
	              if (typeof console !== "undefined" && console !== null) {
	                return console.log("" + e.message + ".");
	              }
	            } else {
	              if (typeof console !== "undefined" && console !== null) {
	                return console.log("LiveReload internal error: " + e.message);
	              }
	            }
	          };
	        })(this),
	        disconnected: (function(_this) {
	          return function(reason, nextDelay) {
	            var _base;
	            if (typeof (_base = _this.listeners).disconnect === "function") {
	              _base.disconnect();
	            }
	            switch (reason) {
	              case 'cannot-connect':
	                return _this.log("LiveReload cannot connect to " + _this.options.host + ":" + _this.options.port + ", will retry in " + nextDelay + " sec.");
	              case 'broken':
	                return _this.log("LiveReload disconnected from " + _this.options.host + ":" + _this.options.port + ", reconnecting in " + nextDelay + " sec.");
	              case 'handshake-timeout':
	                return _this.log("LiveReload cannot connect to " + _this.options.host + ":" + _this.options.port + " (handshake timeout), will retry in " + nextDelay + " sec.");
	              case 'handshake-failed':
	                return _this.log("LiveReload cannot connect to " + _this.options.host + ":" + _this.options.port + " (handshake failed), will retry in " + nextDelay + " sec.");
	              case 'manual':
	                break;
	              case 'error':
	                break;
	              default:
	                return _this.log("LiveReload disconnected from " + _this.options.host + ":" + _this.options.port + " (" + reason + "), reconnecting in " + nextDelay + " sec.");
	            }
	          };
	        })(this),
	        message: (function(_this) {
	          return function(message) {
	            switch (message.command) {
	              case 'reload':
	                return _this.performReload(message);
	              case 'alert':
	                return _this.performAlert(message);
	            }
	          };
	        })(this)
	      });
	      this.initialized = true;
	    }
	
	    LiveReload.prototype.on = function(eventName, handler) {
	      return this.listeners[eventName] = handler;
	    };
	
	    LiveReload.prototype.log = function(message) {
	      return this.console.log("" + message);
	    };
	
	    LiveReload.prototype.performReload = function(message) {
	      var _ref, _ref1;
	      this.log("LiveReload received reload request: " + (JSON.stringify(message, null, 2)));
	      return this.reloader.reload(message.path, {
	        liveCSS: (_ref = message.liveCSS) != null ? _ref : true,
	        liveImg: (_ref1 = message.liveImg) != null ? _ref1 : true,
	        originalPath: message.originalPath || '',
	        overrideURL: message.overrideURL || '',
	        serverURL: "http://" + this.options.host + ":" + this.options.port
	      });
	    };
	
	    LiveReload.prototype.performAlert = function(message) {
	      return alert(message.message);
	    };
	
	    LiveReload.prototype.shutDown = function() {
	      var _base;
	      if (!this.initialized) {
	        return;
	      }
	      this.connector.disconnect();
	      this.log("LiveReload disconnected.");
	      return typeof (_base = this.listeners).shutdown === "function" ? _base.shutdown() : void 0;
	    };
	
	    LiveReload.prototype.hasPlugin = function(identifier) {
	      return !!this.pluginIdentifiers[identifier];
	    };
	
	    LiveReload.prototype.addPlugin = function(pluginClass) {
	      var plugin;
	      if (!this.initialized) {
	        return;
	      }
	      if (this.hasPlugin(pluginClass.identifier)) {
	        return;
	      }
	      this.pluginIdentifiers[pluginClass.identifier] = true;
	      plugin = new pluginClass(this.window, {
	        _livereload: this,
	        _reloader: this.reloader,
	        _connector: this.connector,
	        console: this.console,
	        Timer: Timer,
	        generateCacheBustUrl: (function(_this) {
	          return function(url) {
	            return _this.reloader.generateCacheBustUrl(url);
	          };
	        })(this)
	      });
	      this.plugins.push(plugin);
	      this.reloader.addPlugin(plugin);
	    };
	
	    LiveReload.prototype.analyze = function() {
	      var plugin, pluginData, pluginsData, _i, _len, _ref;
	      if (!this.initialized) {
	        return;
	      }
	      if (!(this.connector.protocol >= 7)) {
	        return;
	      }
	      pluginsData = {};
	      _ref = this.plugins;
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        plugin = _ref[_i];
	        pluginsData[plugin.constructor.identifier] = pluginData = (typeof plugin.analyze === "function" ? plugin.analyze() : void 0) || {};
	        pluginData.version = plugin.constructor.version;
	      }
	      this.connector.sendCommand({
	        command: 'info',
	        plugins: pluginsData,
	        url: this.window.location.href
	      });
	    };
	
	    return LiveReload;
	
	  })();
	
	}).call(this);
	
	},{"./connector":1,"./options":5,"./reloader":7,"./timer":9}],5:[function(require,module,exports){
	(function() {
	  var Options;
	
	  exports.Options = Options = (function() {
	    function Options() {
	      this.https = false;
	      this.host = null;
	      this.port = 35729;
	      this.snipver = null;
	      this.ext = null;
	      this.extver = null;
	      this.mindelay = 1000;
	      this.maxdelay = 60000;
	      this.handshake_timeout = 5000;
	    }
	
	    Options.prototype.set = function(name, value) {
	      if (typeof value === 'undefined') {
	        return;
	      }
	      if (!isNaN(+value)) {
	        value = +value;
	      }
	      return this[name] = value;
	    };
	
	    return Options;
	
	  })();
	
	  Options.extract = function(document) {
	    var element, keyAndValue, m, mm, options, pair, src, _i, _j, _len, _len1, _ref, _ref1;
	    _ref = document.getElementsByTagName('script');
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      element = _ref[_i];
	      if ((src = element.src) && (m = src.match(/^[^:]+:\/\/(.*)\/z?livereload\.js(?:\?(.*))?$/))) {
	        options = new Options();
	        options.https = src.indexOf("https") === 0;
	        if (mm = m[1].match(/^([^\/:]+)(?::(\d+))?$/)) {
	          options.host = mm[1];
	          if (mm[2]) {
	            options.port = parseInt(mm[2], 10);
	          }
	        }
	        if (m[2]) {
	          _ref1 = m[2].split('&');
	          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
	            pair = _ref1[_j];
	            if ((keyAndValue = pair.split('=')).length > 1) {
	              options.set(keyAndValue[0].replace(/-/g, '_'), keyAndValue.slice(1).join('='));
	            }
	          }
	        }
	        return options;
	      }
	    }
	    return null;
	  };
	
	}).call(this);
	
	},{}],6:[function(require,module,exports){
	(function() {
	  var PROTOCOL_6, PROTOCOL_7, Parser, ProtocolError,
	    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
	
	  exports.PROTOCOL_6 = PROTOCOL_6 = 'http://livereload.com/protocols/official-6';
	
	  exports.PROTOCOL_7 = PROTOCOL_7 = 'http://livereload.com/protocols/official-7';
	
	  exports.ProtocolError = ProtocolError = (function() {
	    function ProtocolError(reason, data) {
	      this.message = "LiveReload protocol error (" + reason + ") after receiving data: \"" + data + "\".";
	    }
	
	    return ProtocolError;
	
	  })();
	
	  exports.Parser = Parser = (function() {
	    function Parser(handlers) {
	      this.handlers = handlers;
	      this.reset();
	    }
	
	    Parser.prototype.reset = function() {
	      return this.protocol = null;
	    };
	
	    Parser.prototype.process = function(data) {
	      var command, e, message, options, _ref;
	      try {
	        if (this.protocol == null) {
	          if (data.match(/^!!ver:([\d.]+)$/)) {
	            this.protocol = 6;
	          } else if (message = this._parseMessage(data, ['hello'])) {
	            if (!message.protocols.length) {
	              throw new ProtocolError("no protocols specified in handshake message");
	            } else if (__indexOf.call(message.protocols, PROTOCOL_7) >= 0) {
	              this.protocol = 7;
	            } else if (__indexOf.call(message.protocols, PROTOCOL_6) >= 0) {
	              this.protocol = 6;
	            } else {
	              throw new ProtocolError("no supported protocols found");
	            }
	          }
	          return this.handlers.connected(this.protocol);
	        } else if (this.protocol === 6) {
	          message = JSON.parse(data);
	          if (!message.length) {
	            throw new ProtocolError("protocol 6 messages must be arrays");
	          }
	          command = message[0], options = message[1];
	          if (command !== 'refresh') {
	            throw new ProtocolError("unknown protocol 6 command");
	          }
	          return this.handlers.message({
	            command: 'reload',
	            path: options.path,
	            liveCSS: (_ref = options.apply_css_live) != null ? _ref : true
	          });
	        } else {
	          message = this._parseMessage(data, ['reload', 'alert']);
	          return this.handlers.message(message);
	        }
	      } catch (_error) {
	        e = _error;
	        if (e instanceof ProtocolError) {
	          return this.handlers.error(e);
	        } else {
	          throw e;
	        }
	      }
	    };
	
	    Parser.prototype._parseMessage = function(data, validCommands) {
	      var e, message, _ref;
	      try {
	        message = JSON.parse(data);
	      } catch (_error) {
	        e = _error;
	        throw new ProtocolError('unparsable JSON', data);
	      }
	      if (!message.command) {
	        throw new ProtocolError('missing "command" key', data);
	      }
	      if (_ref = message.command, __indexOf.call(validCommands, _ref) < 0) {
	        throw new ProtocolError("invalid command '" + message.command + "', only valid commands are: " + (validCommands.join(', ')) + ")", data);
	      }
	      return message;
	    };
	
	    return Parser;
	
	  })();
	
	}).call(this);
	
	},{}],7:[function(require,module,exports){
	(function() {
	  var IMAGE_STYLES, Reloader, numberOfMatchingSegments, pathFromUrl, pathsMatch, pickBestMatch, splitUrl;
	
	  splitUrl = function(url) {
	    var hash, index, params;
	    if ((index = url.indexOf('#')) >= 0) {
	      hash = url.slice(index);
	      url = url.slice(0, index);
	    } else {
	      hash = '';
	    }
	    if ((index = url.indexOf('?')) >= 0) {
	      params = url.slice(index);
	      url = url.slice(0, index);
	    } else {
	      params = '';
	    }
	    return {
	      url: url,
	      params: params,
	      hash: hash
	    };
	  };
	
	  pathFromUrl = function(url) {
	    var path;
	    url = splitUrl(url).url;
	    if (url.indexOf('file://') === 0) {
	      path = url.replace(/^file:\/\/(localhost)?/, '');
	    } else {
	      path = url.replace(/^([^:]+:)?\/\/([^:\/]+)(:\d*)?\//, '/');
	    }
	    return decodeURIComponent(path);
	  };
	
	  pickBestMatch = function(path, objects, pathFunc) {
	    var bestMatch, object, score, _i, _len;
	    bestMatch = {
	      score: 0
	    };
	    for (_i = 0, _len = objects.length; _i < _len; _i++) {
	      object = objects[_i];
	      score = numberOfMatchingSegments(path, pathFunc(object));
	      if (score > bestMatch.score) {
	        bestMatch = {
	          object: object,
	          score: score
	        };
	      }
	    }
	    if (bestMatch.score > 0) {
	      return bestMatch;
	    } else {
	      return null;
	    }
	  };
	
	  numberOfMatchingSegments = function(path1, path2) {
	    var comps1, comps2, eqCount, len;
	    path1 = path1.replace(/^\/+/, '').toLowerCase();
	    path2 = path2.replace(/^\/+/, '').toLowerCase();
	    if (path1 === path2) {
	      return 10000;
	    }
	    comps1 = path1.split('/').reverse();
	    comps2 = path2.split('/').reverse();
	    len = Math.min(comps1.length, comps2.length);
	    eqCount = 0;
	    while (eqCount < len && comps1[eqCount] === comps2[eqCount]) {
	      ++eqCount;
	    }
	    return eqCount;
	  };
	
	  pathsMatch = function(path1, path2) {
	    return numberOfMatchingSegments(path1, path2) > 0;
	  };
	
	  IMAGE_STYLES = [
	    {
	      selector: 'background',
	      styleNames: ['backgroundImage']
	    }, {
	      selector: 'border',
	      styleNames: ['borderImage', 'webkitBorderImage', 'MozBorderImage']
	    }
	  ];
	
	  exports.Reloader = Reloader = (function() {
	    function Reloader(window, console, Timer) {
	      this.window = window;
	      this.console = console;
	      this.Timer = Timer;
	      this.document = this.window.document;
	      this.importCacheWaitPeriod = 200;
	      this.plugins = [];
	    }
	
	    Reloader.prototype.addPlugin = function(plugin) {
	      return this.plugins.push(plugin);
	    };
	
	    Reloader.prototype.analyze = function(callback) {
	      return results;
	    };
	
	    Reloader.prototype.reload = function(path, options) {
	      var plugin, _base, _i, _len, _ref;
	      this.options = options;
	      if ((_base = this.options).stylesheetReloadTimeout == null) {
	        _base.stylesheetReloadTimeout = 15000;
	      }
	      _ref = this.plugins;
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        plugin = _ref[_i];
	        if (plugin.reload && plugin.reload(path, options)) {
	          return;
	        }
	      }
	      if (options.liveCSS) {
	        if (path.match(/\.css$/i)) {
	          if (this.reloadStylesheet(path)) {
	            return;
	          }
	        }
	      }
	      if (options.liveImg) {
	        if (path.match(/\.(jpe?g|png|gif)$/i)) {
	          this.reloadImages(path);
	          return;
	        }
	      }
	      return this.reloadPage();
	    };
	
	    Reloader.prototype.reloadPage = function() {
	      return this.window.document.location.reload();
	    };
	
	    Reloader.prototype.reloadImages = function(path) {
	      var expando, img, selector, styleNames, styleSheet, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3, _results;
	      expando = this.generateUniqueString();
	      _ref = this.document.images;
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        img = _ref[_i];
	        if (pathsMatch(path, pathFromUrl(img.src))) {
	          img.src = this.generateCacheBustUrl(img.src, expando);
	        }
	      }
	      if (this.document.querySelectorAll) {
	        for (_j = 0, _len1 = IMAGE_STYLES.length; _j < _len1; _j++) {
	          _ref1 = IMAGE_STYLES[_j], selector = _ref1.selector, styleNames = _ref1.styleNames;
	          _ref2 = this.document.querySelectorAll("[style*=" + selector + "]");
	          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
	            img = _ref2[_k];
	            this.reloadStyleImages(img.style, styleNames, path, expando);
	          }
	        }
	      }
	      if (this.document.styleSheets) {
	        _ref3 = this.document.styleSheets;
	        _results = [];
	        for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
	          styleSheet = _ref3[_l];
	          _results.push(this.reloadStylesheetImages(styleSheet, path, expando));
	        }
	        return _results;
	      }
	    };
	
	    Reloader.prototype.reloadStylesheetImages = function(styleSheet, path, expando) {
	      var e, rule, rules, styleNames, _i, _j, _len, _len1;
	      try {
	        rules = styleSheet != null ? styleSheet.cssRules : void 0;
	      } catch (_error) {
	        e = _error;
	      }
	      if (!rules) {
	        return;
	      }
	      for (_i = 0, _len = rules.length; _i < _len; _i++) {
	        rule = rules[_i];
	        switch (rule.type) {
	          case CSSRule.IMPORT_RULE:
	            this.reloadStylesheetImages(rule.styleSheet, path, expando);
	            break;
	          case CSSRule.STYLE_RULE:
	            for (_j = 0, _len1 = IMAGE_STYLES.length; _j < _len1; _j++) {
	              styleNames = IMAGE_STYLES[_j].styleNames;
	              this.reloadStyleImages(rule.style, styleNames, path, expando);
	            }
	            break;
	          case CSSRule.MEDIA_RULE:
	            this.reloadStylesheetImages(rule, path, expando);
	        }
	      }
	    };
	
	    Reloader.prototype.reloadStyleImages = function(style, styleNames, path, expando) {
	      var newValue, styleName, value, _i, _len;
	      for (_i = 0, _len = styleNames.length; _i < _len; _i++) {
	        styleName = styleNames[_i];
	        value = style[styleName];
	        if (typeof value === 'string') {
	          newValue = value.replace(/\burl\s*\(([^)]*)\)/, (function(_this) {
	            return function(match, src) {
	              if (pathsMatch(path, pathFromUrl(src))) {
	                return "url(" + (_this.generateCacheBustUrl(src, expando)) + ")";
	              } else {
	                return match;
	              }
	            };
	          })(this));
	          if (newValue !== value) {
	            style[styleName] = newValue;
	          }
	        }
	      }
	    };
	
	    Reloader.prototype.reloadStylesheet = function(path) {
	      var imported, link, links, match, style, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1;
	      links = (function() {
	        var _i, _len, _ref, _results;
	        _ref = this.document.getElementsByTagName('link');
	        _results = [];
	        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	          link = _ref[_i];
	          if (link.rel.match(/^stylesheet$/i) && !link.__LiveReload_pendingRemoval) {
	            _results.push(link);
	          }
	        }
	        return _results;
	      }).call(this);
	      imported = [];
	      _ref = this.document.getElementsByTagName('style');
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        style = _ref[_i];
	        if (style.sheet) {
	          this.collectImportedStylesheets(style, style.sheet, imported);
	        }
	      }
	      for (_j = 0, _len1 = links.length; _j < _len1; _j++) {
	        link = links[_j];
	        this.collectImportedStylesheets(link, link.sheet, imported);
	      }
	      if (this.window.StyleFix && this.document.querySelectorAll) {
	        _ref1 = this.document.querySelectorAll('style[data-href]');
	        for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
	          style = _ref1[_k];
	          links.push(style);
	        }
	      }
	      this.console.log("LiveReload found " + links.length + " LINKed stylesheets, " + imported.length + " @imported stylesheets");
	      match = pickBestMatch(path, links.concat(imported), (function(_this) {
	        return function(l) {
	          return pathFromUrl(_this.linkHref(l));
	        };
	      })(this));
	      if (match) {
	        if (match.object.rule) {
	          this.console.log("LiveReload is reloading imported stylesheet: " + match.object.href);
	          this.reattachImportedRule(match.object);
	        } else {
	          this.console.log("LiveReload is reloading stylesheet: " + (this.linkHref(match.object)));
	          this.reattachStylesheetLink(match.object);
	        }
	      } else {
	        this.console.log("LiveReload will reload all stylesheets because path '" + path + "' did not match any specific one");
	        for (_l = 0, _len3 = links.length; _l < _len3; _l++) {
	          link = links[_l];
	          this.reattachStylesheetLink(link);
	        }
	      }
	      return true;
	    };
	
	    Reloader.prototype.collectImportedStylesheets = function(link, styleSheet, result) {
	      var e, index, rule, rules, _i, _len;
	      try {
	        rules = styleSheet != null ? styleSheet.cssRules : void 0;
	      } catch (_error) {
	        e = _error;
	      }
	      if (rules && rules.length) {
	        for (index = _i = 0, _len = rules.length; _i < _len; index = ++_i) {
	          rule = rules[index];
	          switch (rule.type) {
	            case CSSRule.CHARSET_RULE:
	              continue;
	            case CSSRule.IMPORT_RULE:
	              result.push({
	                link: link,
	                rule: rule,
	                index: index,
	                href: rule.href
	              });
	              this.collectImportedStylesheets(link, rule.styleSheet, result);
	              break;
	            default:
	              break;
	          }
	        }
	      }
	    };
	
	    Reloader.prototype.waitUntilCssLoads = function(clone, func) {
	      var callbackExecuted, executeCallback, poll;
	      callbackExecuted = false;
	      executeCallback = (function(_this) {
	        return function() {
	          if (callbackExecuted) {
	            return;
	          }
	          callbackExecuted = true;
	          return func();
	        };
	      })(this);
	      clone.onload = (function(_this) {
	        return function() {
	          _this.console.log("LiveReload: the new stylesheet has finished loading");
	          _this.knownToSupportCssOnLoad = true;
	          return executeCallback();
	        };
	      })(this);
	      if (!this.knownToSupportCssOnLoad) {
	        (poll = (function(_this) {
	          return function() {
	            if (clone.sheet) {
	              _this.console.log("LiveReload is polling until the new CSS finishes loading...");
	              return executeCallback();
	            } else {
	              return _this.Timer.start(50, poll);
	            }
	          };
	        })(this))();
	      }
	      return this.Timer.start(this.options.stylesheetReloadTimeout, executeCallback);
	    };
	
	    Reloader.prototype.linkHref = function(link) {
	      return link.href || link.getAttribute('data-href');
	    };
	
	    Reloader.prototype.reattachStylesheetLink = function(link) {
	      var clone, parent;
	      if (link.__LiveReload_pendingRemoval) {
	        return;
	      }
	      link.__LiveReload_pendingRemoval = true;
	      if (link.tagName === 'STYLE') {
	        clone = this.document.createElement('link');
	        clone.rel = 'stylesheet';
	        clone.media = link.media;
	        clone.disabled = link.disabled;
	      } else {
	        clone = link.cloneNode(false);
	      }
	      clone.href = this.generateCacheBustUrl(this.linkHref(link));
	      parent = link.parentNode;
	      if (parent.lastChild === link) {
	        parent.appendChild(clone);
	      } else {
	        parent.insertBefore(clone, link.nextSibling);
	      }
	      return this.waitUntilCssLoads(clone, (function(_this) {
	        return function() {
	          var additionalWaitingTime;
	          if (/AppleWebKit/.test(navigator.userAgent)) {
	            additionalWaitingTime = 5;
	          } else {
	            additionalWaitingTime = 200;
	          }
	          return _this.Timer.start(additionalWaitingTime, function() {
	            var _ref;
	            if (!link.parentNode) {
	              return;
	            }
	            link.parentNode.removeChild(link);
	            clone.onreadystatechange = null;
	            return (_ref = _this.window.StyleFix) != null ? _ref.link(clone) : void 0;
	          });
	        };
	      })(this));
	    };
	
	    Reloader.prototype.reattachImportedRule = function(_arg) {
	      var href, index, link, media, newRule, parent, rule, tempLink;
	      rule = _arg.rule, index = _arg.index, link = _arg.link;
	      parent = rule.parentStyleSheet;
	      href = this.generateCacheBustUrl(rule.href);
	      media = rule.media.length ? [].join.call(rule.media, ', ') : '';
	      newRule = "@import url(\"" + href + "\") " + media + ";";
	      rule.__LiveReload_newHref = href;
	      tempLink = this.document.createElement("link");
	      tempLink.rel = 'stylesheet';
	      tempLink.href = href;
	      tempLink.__LiveReload_pendingRemoval = true;
	      if (link.parentNode) {
	        link.parentNode.insertBefore(tempLink, link);
	      }
	      return this.Timer.start(this.importCacheWaitPeriod, (function(_this) {
	        return function() {
	          if (tempLink.parentNode) {
	            tempLink.parentNode.removeChild(tempLink);
	          }
	          if (rule.__LiveReload_newHref !== href) {
	            return;
	          }
	          parent.insertRule(newRule, index);
	          parent.deleteRule(index + 1);
	          rule = parent.cssRules[index];
	          rule.__LiveReload_newHref = href;
	          return _this.Timer.start(_this.importCacheWaitPeriod, function() {
	            if (rule.__LiveReload_newHref !== href) {
	              return;
	            }
	            parent.insertRule(newRule, index);
	            return parent.deleteRule(index + 1);
	          });
	        };
	      })(this));
	    };
	
	    Reloader.prototype.generateUniqueString = function() {
	      return 'livereload=' + Date.now();
	    };
	
	    Reloader.prototype.generateCacheBustUrl = function(url, expando) {
	      var hash, oldParams, originalUrl, params, _ref;
	      if (expando == null) {
	        expando = this.generateUniqueString();
	      }
	      _ref = splitUrl(url), url = _ref.url, hash = _ref.hash, oldParams = _ref.params;
	      if (this.options.overrideURL) {
	        if (url.indexOf(this.options.serverURL) < 0) {
	          originalUrl = url;
	          url = this.options.serverURL + this.options.overrideURL + "?url=" + encodeURIComponent(url);
	          this.console.log("LiveReload is overriding source URL " + originalUrl + " with " + url);
	        }
	      }
	      params = oldParams.replace(/(\?|&)livereload=(\d+)/, function(match, sep) {
	        return "" + sep + expando;
	      });
	      if (params === oldParams) {
	        if (oldParams.length === 0) {
	          params = "?" + expando;
	        } else {
	          params = "" + oldParams + "&" + expando;
	        }
	      }
	      return url + params + hash;
	    };
	
	    return Reloader;
	
	  })();
	
	}).call(this);
	
	},{}],8:[function(require,module,exports){
	(function() {
	  var CustomEvents, LiveReload, k;
	
	  CustomEvents = require('./customevents');
	
	  LiveReload = window.LiveReload = new (require('./livereload').LiveReload)(window);
	
	  for (k in window) {
	    if (k.match(/^LiveReloadPlugin/)) {
	      LiveReload.addPlugin(window[k]);
	    }
	  }
	
	  LiveReload.addPlugin(require('./less'));
	
	  LiveReload.on('shutdown', function() {
	    return delete window.LiveReload;
	  });
	
	  LiveReload.on('connect', function() {
	    return CustomEvents.fire(document, 'LiveReloadConnect');
	  });
	
	  LiveReload.on('disconnect', function() {
	    return CustomEvents.fire(document, 'LiveReloadDisconnect');
	  });
	
	  CustomEvents.bind(document, 'LiveReloadShutDown', function() {
	    return LiveReload.shutDown();
	  });
	
	}).call(this);
	
	},{"./customevents":2,"./less":3,"./livereload":4}],9:[function(require,module,exports){
	(function() {
	  var Timer;
	
	  exports.Timer = Timer = (function() {
	    function Timer(func) {
	      this.func = func;
	      this.running = false;
	      this.id = null;
	      this._handler = (function(_this) {
	        return function() {
	          _this.running = false;
	          _this.id = null;
	          return _this.func();
	        };
	      })(this);
	    }
	
	    Timer.prototype.start = function(timeout) {
	      if (this.running) {
	        clearTimeout(this.id);
	      }
	      this.id = setTimeout(this._handler, timeout);
	      return this.running = true;
	    };
	
	    Timer.prototype.stop = function() {
	      if (this.running) {
	        clearTimeout(this.id);
	        this.running = false;
	        return this.id = null;
	      }
	    };
	
	    return Timer;
	
	  })();
	
	  Timer.start = function(timeout, func) {
	    return setTimeout(func, timeout);
	  };
	
	}).call(this);
	
	},{}]},{},[8]);


/***/ },
/* 17 */
/*!*********************************!*\
  !*** ./src/js/modules/nodes.js ***!
  \*********************************/
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @license The MIT License (MIT)
	 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
	 */
	
	'use strict';
	
	var Emitter = __webpack_require__(/*! cjs-emitter */ 3),
	    Wamp    = __webpack_require__(/*! cjs-wamp */ 11),
	    manager = new Emitter(),
	    RTCPeerConnection     = window.RTCPeerConnection     || window.mozRTCPeerConnection || window.webkitRTCPeerConnection,
	    RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription,
	    RTCIceCandidate       = window.RTCIceCandidate       || window.mozRTCIceCandidate;
	
	
	function errorHandler ( error ) {
	    console.log('rtc error', error);
	}
	
	
	manager.init = function ( config ) {
	    this.wamp = config.wamp;
	};
	
	manager.add = function ( id ) {
	
	};
	
	
	// public
	module.exports = manager;


/***/ },
/* 18 */
/*!******************************!*\
  !*** ./src/js/pages/init.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Loading page implementation.
	 */
	
	'use strict';
	
	var Page = __webpack_require__(/*! spa-component-page */ 19),
	    page = new Page({$node: window.pageInit});
	
	
	// public
	module.exports = page;


/***/ },
/* 19 */
/*!************************************************************!*\
  !*** /home/dp/Projects/sdk/spasdk/component-page/index.js ***!
  \************************************************************/
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__filename) {/**
	 * @license The MIT License (MIT)
	 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
	 */
	
	/* eslint no-path-concat: 0 */
	
	'use strict';
	
	var Component = __webpack_require__(/*! spa-component */ 20);
	
	
	/**
	 * Base page implementation.
	 *
	 * A full-screen top-level layer that can operate as an independent separate entity.
	 * It is added to the document body on creation if not already linked.
	 *
	 * @constructor
	 * @extends Component
	 *
	 * @param {Object} [config={}] init parameters (all inherited from the parent)
	 *
	 * @example
	 * var Page = require('stb/ui/page'),
	 *     page = new Page({
	 *         $node: document.getElementById(id)
	 *     });
	 *
	 * page.addListener('show', function show () {
	 *     // page is visible now
	 * });
	 */
	function Page ( config ) {
	    // sanitize
	    config = config || {};
	
	    console.assert(typeof this === 'object', 'must be constructed via new');
	
	    if ( true ) {
	        if ( typeof config !== 'object' ) { throw new Error(__filename + ': wrong config type'); }
	        // init parameters checks
	        if ( config.className && typeof config.className !== 'string' ) { throw new Error(__filename + ': wrong or empty config.className'); }
	    }
	
	    /**
	     * Page visibility/active state flag.
	     *
	     * @readonly
	     * @type {boolean}
	     */
	    this.active = false;
	
	    /**
	     * Link to the currently active component with focus.
	     *
	     * @readonly
	     * @type {Component}
	     */
	    this.activeComponent = null;
	
	    // set default className if classList property empty or undefined
	    //config.className = 'page ' + (config.className || '');
	
	    // parent constructor call
	    Component.call(this, config);
	
	    // state flag
	    this.active = this.$node.classList.contains('active');
	
	    // correct DOM parent/child connection if necessary
	    if ( this.$node.parentNode === null ) {
	        document.body.appendChild(this.$node);
	    }
	
	    // always itself
	    this.page = this;
	}
	
	
	// inheritance
	Page.prototype = Object.create(Component.prototype);
	Page.prototype.constructor = Page;
	
	// set component name
	Page.prototype.name = 'spa-component-page';
	
	
	// public
	module.exports = Page;
	
	/* WEBPACK VAR INJECTION */}.call(exports, "../../sdk/spasdk/component-page/index.js"))

/***/ },
/* 20 */
/*!*******************************************************!*\
  !*** /home/dp/Projects/sdk/spasdk/component/index.js ***!
  \*******************************************************/
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__filename) {/**
	 * @license The MIT License (MIT)
	 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
	 */
	
	/* eslint no-path-concat: 0 */
	
	'use strict';
	
	var app     = __webpack_require__(/*! spa-app/lib/core */ 2),
	    Emitter = __webpack_require__(/*! cjs-emitter */ 3),
	    counter = 0;
	
	
	/**
	 * Base component implementation.
	 *
	 * Visual element that can handle sub-components.
	 * Each component has a DOM element container $node with a set of classes:
	 * "component" and some specific component class names depending on the hierarchy, for example "page".
	 * Each component has a unique ID given either from $node.id or from data.id. If not given will generate automatically.
	 *
	 * @constructor
	 * @extends Emitter
	 *
	 * @param {Object} [config={}] init parameters
	 * @param {Element} [config.id] component unique identifier (generated if not set)
	 * @param {string} [config.className] space-separated list of classes for "className" property of this.$node
	 * @param {Element} [config.$node] DOM element/fragment to be a component outer container
	 * @param {Element} [config.$body] DOM element/fragment to be a component inner container (by default is the same as $node)
	 * @param {Component} [config.parent] link to the parent component which has this component as a child
	 * @param {Array.<Component>} [config.children=[]] list of components in this component
	 * @param {Object.<string, function>} [config.events={}] list of event callbacks
	 * @param {boolean} [config.visible=true] component initial visibility state flag
	 * @param {boolean} [config.focusable=true] component can accept focus or not
	 * @param {boolean} [config.propagate=false] allow to emit events to the parent component
	 *
	 * @fires module:stb/component~Component#click
	 *
	 * @example
	 * var component = new Component({
	 *     $node: document.getElementById(id),
	 *     className: 'bootstrap responsive',
	 *     events: {
	 *         click: function () { ... }
	 *     }
	 * });
	 * component.add( ... );
	 * component.focus();
	 */
	function Component ( config ) {
	    // current execution context
	    var self = this,
	        name;
	
	    // sanitize
	    config = config || {};
	
	    console.assert(typeof this === 'object', 'must be constructed via new');
	
	    if ( true ) {
	        if ( typeof config !== 'object' ) { throw new Error(__filename + ': wrong config type'); }
	        // init parameters checks
	        if ( config.id        && typeof config.id !== 'string'         ) { throw new Error(__filename + ': wrong or empty config.id'); }
	        if ( config.className && typeof config.className !== 'string'  ) { throw new Error(__filename + ': wrong or empty config.className'); }
	        if ( config.$node     && !(config.$node instanceof Element)    ) { throw new Error(__filename + ': wrong config.$node type'); }
	        if ( config.$body     && !(config.$body instanceof Element)    ) { throw new Error(__filename + ': wrong config.$body type'); }
	        if ( config.parent    && !(config.parent instanceof Component) ) { throw new Error(__filename + ': wrong config.parent type'); }
	        if ( config.children  && !Array.isArray(config.children)       ) { throw new Error(__filename + ': wrong config.children type'); }
	    }
	
	    /**
	     * Component visibility state flag.
	     *
	     * @readonly
	     * @type {boolean}
	     */
	    this.visible = true;
	
	    /**
	     * Component can accept focus or not.
	     *
	     * @type {boolean}
	     */
	    this.focusable = true;
	
	    /**
	     * DOM outer handle.
	     *
	     * @type {Element}
	     */
	    this.$node = null;
	
	    /**
	     * DOM inner handle.
	     * In simple cases is the same as $node.
	     *
	     * @type {Element}
	     */
	    this.$body = null;
	
	    /**
	     * Link to the parent component which has this component as a child.
	     *
	     * @type {Component}
	     */
	    this.parent = null;
	
	    /**
	     * List of all children components.
	     *
	     * @type {Component[]}
	     */
	    this.children = [];
	
	    /**
	     * allow to emit events to the parent component
	     *
	     * @readonly
	     * @type {boolean}
	     */
	    this.propagate = !!config.propagate;
	
	    // parent constructor call
	    Emitter.call(this);
	
	    // outer handle - empty div in case nothing is given
	    this.$node = config.$node || document.createElement('div');
	
	    // inner handle - the same as outer handler in case nothing is given
	    this.$body = config.$body || this.$node;
	
	    // set CSS class names
	    //this.$node.className += ' component ' + (config.className || '');
	    this.$node.className = this.name + ' ' + (config.className || '');
	
	    // apply component id if given, generate otherwise
	    this.id = config.id || this.$node.id || 'cid' + counter++;
	
	    // apply hierarchy
	    if ( config.parent ) {
	        // add to parent component
	        config.parent.add(this);
	    }
	
	    // apply given visibility
	    if ( config.visible === false ) {
	        // default state is visible
	        this.hide();
	    }
	
	    // apply focus handling method
	    if ( config.focusable === false ) {
	        // can't accept focus
	        this.focusable = false;
	    }
	
	    // a descendant defined own events
	    if ( this.defaultEvents ) {
	        // sanitize
	        config.events = config.events || {};
	
	        if ( true ) {
	            if ( typeof config.events !== 'object' ) { throw new Error(__filename + ': wrong config.events type'); }
	            if ( typeof this.defaultEvents !== 'object' ) { throw new Error(__filename + ': wrong this.defaultEvents type'); }
	        }
	
	        for ( name in this.defaultEvents ) {
	            // overwrite default events with user-defined
	            config.events[name] = config.events[name] || this.defaultEvents[name];
	        }
	    }
	
	    if ( config.events ) {
	        // apply all given events
	        Object.keys(config.events).forEach(function ( name ) {
	            self.addListener(name, config.events[name]);
	        });
	    }
	
	    // apply the given children components
	    if ( config.children ) {
	        // apply
	        this.add.apply(this, config.children);
	    }
	
	    // component activation by mouse
	    this.$node.addEventListener('click', function ( event ) {
	        // left mouse button
	        //if ( event.button === 0 ) {
	        // activate if possible
	        self.focus();
	
	        // there are some listeners
	        if ( self.events['click'] ) {
	            /**
	             * Mouse click event.
	             *
	             * @event module:stb/component~Component#click
	             *
	             * @type {Object}
	             * @property {Event} event click event data
	             */
	            self.emit('click', event);
	        }
	        //}
	
	        if ( true ) {
	            // middle mouse button
	            if ( event.button === 1 ) {
	                //debug.inspect(self, 0);
	                debug.info('"window.link" or "' + self.id + '.component"', 'this component is now available in global scope');
	                window.link = self;
	                self.$node.classList.toggle('wired');
	            }
	        }
	
	        event.stopPropagation();
	    });
	
	    if ( true ) {
	        // expose inner ID to global scope
	        window[self.id] = self.$node;
	
	        // expose a link
	        this.$node.component = this.$body.component = this;
	        this.$node.title = this.name + '#' + this.id + ' (outer)';
	        this.$body.title = this.name + '#' + this.id + ' (inner)';
	    }
	
	    debug.info('create component ' + this.name + '#' + this.id, null, {
	        tags: ['create', 'component', this.name, this.id]
	    });
	}
	
	
	// inheritance
	Component.prototype = Object.create(Emitter.prototype);
	Component.prototype.constructor = Component;
	
	
	/**
	 * List of all default event callbacks.
	 *
	 * @type {Object.<string, function>}
	 */
	Component.prototype.defaultEvents = null;
	
	
	/**
	 * Add a new component as a child.
	 *
	 * @param {...Component} [child] variable number of elements to append
	 *
	 * @files Component#add
	 *
	 * @example
	 * panel.add(
	 *     new Button( ... ),
	 *     new Button( ... )
	 * );
	 */
	Component.prototype.add = function ( child ) {
	    var index;
	
	    // walk through all the given elements
	    for ( index = 0; index < arguments.length; index++ ) {
	        child = arguments[index];
	
	        if ( true ) {
	            if ( !(child instanceof Component) ) { throw new Error(__filename + ': wrong child type'); }
	        }
	
	        // apply
	        this.children.push(child);
	        child.parent = this;
	
	        // correct DOM parent/child connection if necessary
	        if ( child.$node && child.$node.parentNode === null ) {
	            this.$body.appendChild(child.$node);
	        }
	
	        debug.info('add component ' + child.name + '#' + child.id + ' to ' + this.name + '#' + this.id, null, {
	            tags: ['add', 'component', this.name, this.id, child.name, child.id]
	        });
	
	        // there are some listeners
	        if ( this.events['add'] ) {
	            /**
	             * A child component is added.
	             *
	             * @event module:stb/component~Component#add
	             *
	             * @type {Object}
	             * @property {Component} item new component added
	             */
	            this.emit('add', {item: child});
	        }
	
	        //debug.log('component ' + this.name + '#' + this.id + ' new child: ' + child.name + '#' + child.id);
	    }
	};
	
	
	/* @todo: consider activation in future */
	///**
	// * Insert component into the specific position.
	// *
	// * @param {Component} child component instance to insert
	// * @param {number} index insertion position
	// */
	//Component.prototype.insert = function ( child, index ) {
	//    var prevIndex = this.children.indexOf(child);
	//
	//    if ( DEVELOP ) {
	//        if ( arguments.length !== 2 ) { throw new Error(__filename + ': wrong arguments number'); }
	//        if ( !(child instanceof Component) ) { throw new Error(__filename + ': wrong child type'); }
	//    }
	//
	//    if ( prevIndex !== -1 ) {
	//        this.children.splice(prevIndex, 1);
	//        this.$body.removeChild(child.$node);
	//    }
	//
	//    if ( index === this.children.length ) {
	//        this.$body.appendChild(child.$node);
	//    } else {
	//        this.$body.insertBefore(child.$node, this.$body.children[index]);
	//    }
	//    this.children.splice(index, 0, child);
	//
	//    if ( !child.parent ) {
	//        child.parent = this;
	//    }
	//};
	
	
	/**
	 * Delete this component and clear all associated events.
	 *
	 * @fires module:stb/component~Component#remove
	 */
	Component.prototype.remove = function () {
	    // really inserted somewhere
	    if ( this.parent ) {
	        if ( true ) {
	            if ( !(this.parent instanceof Component) ) { throw new Error(__filename + ': wrong this.parent type'); }
	        }
	
	        // active at the moment
	        if ( app.activePage.activeComponent === this ) {
	            this.blur();
	            this.parent.focus();
	        }
	        this.parent.children.splice(this.parent.children.indexOf(this), 1);
	    }
	
	    // remove all children
	    this.children.forEach(function ( child ) {
	        if ( true ) {
	            if ( !(child instanceof Component) ) { throw new Error(__filename + ': wrong child type'); }
	        }
	
	        child.remove();
	    });
	
	    // remove all listeners
	    this.events = {};
	
	    this.$node.parentNode.removeChild(this.$node);
	
	    // there are some listeners
	    if ( this.events['remove'] ) {
	        /**
	         * Delete this component.
	         *
	         * @event module:stb/component~Component#remove
	         */
	        this.emit('remove');
	    }
	
	    //debug.log('component ' + this.name + '#' + this.id + ' remove', 'red');
	    debug.info('remove component ' + this.name + '#' + this.id, null, {
	        tags: ['remove', 'component', this.name, this.id]
	    });
	};
	
	
	/**
	 * Activate the component.
	 * Notify the owner-page and apply CSS class.
	 *
	 * @param {Object} [data] custom data which passed into handlers
	 *
	 * @return {boolean} operation status
	 *
	 * @fires module:stb/component~Component#focus
	 */
	Component.prototype.focus = function ( data ) {
	    var activePage = app.activePage,
	        activeItem = activePage.activeComponent;
	
	    // this is a visual component on a page
	    // not already focused and can accept focus
	    if ( this.focusable && this !== activeItem ) {
	        // notify the current active component
	        if ( activeItem ) { activeItem.blur(); }
	
	        /* eslint consistent-this: 0 */
	
	        // apply
	        activePage.activeComponent = activeItem = this;
	        activeItem.$node.classList.add('focus');
	
	        //debug.log('component ' + this.name + '#' + this.id + ' focus');
	        debug.info('focus component ' + this.name + '#' + this.id, null, {
	            tags: ['focus', 'component', this.name, this.id]
	        });
	
	        // there are some listeners
	        if ( activeItem.events['focus'] ) {
	            /**
	             * Make this component focused.
	             *
	             * @event module:stb/component~Component#focus
	             */
	            activeItem.emit('focus', data);
	        }
	
	        return true;
	    }
	
	    // nothing was done
	    return false;
	};
	
	
	/**
	 * Remove focus.
	 * Change page.activeComponent and notify subscribers.
	 *
	 * @return {boolean} operation status
	 *
	 * @fires module:stb/component~Component#blur
	 */
	Component.prototype.blur = function () {
	    var activePage = app.activePage,
	        activeItem = activePage.activeComponent;
	
	    // apply visuals anyway
	    this.$node.classList.remove('focus');
	
	    // this is the active component
	    if ( this === activeItem ) {
	        activePage.activeComponent = null;
	
	        //debug.log('component ' + this.name + '#' + this.id + ' blur', 'grey');
	        debug.info('blur component ' + this.name + '#' + this.id, null, {
	            tags: ['blur', 'component', this.name, this.id]
	        });
	
	        // there are some listeners
	        if ( this.events['blur'] ) {
	            /**
	             * Remove focus from this component.
	             *
	             * @event module:stb/component~Component#blur
	             */
	            this.emit('blur');
	        }
	
	        return true;
	    }
	
	    debug.warn('component ' + this.name + '#' + this.id + ' attempt to blur without link to a page', null, {
	        tags: ['blur', 'component', this.name, this.id]
	    });
	
	    // nothing was done
	    return false;
	};
	
	
	/**
	 * Make the component visible and notify subscribers.
	 *
	 * @param {Object} [data] custom data which passed into handlers
	 *
	 * @return {boolean} operation status
	 *
	 * @fires module:stb/component~Component#show
	 */
	Component.prototype.show = function ( data ) {
	    // is it hidden
	    if ( !this.visible ) {
	        // correct style
	        this.$node.classList.remove('hidden');
	        // flag
	        this.visible = true;
	
	        debug.info('show component ' + this.name + '#' + this.id, null, {
	            tags: ['show', 'component', this.name, this.id]
	        });
	
	        // there are some listeners
	        if ( this.events['show'] ) {
	            /**
	             * Make the component visible.
	             *
	             * @event module:stb/component~Component#show
	             */
	            this.emit('show', data);
	        }
	
	        return true;
	    }
	
	    // nothing was done
	    return true;
	};
	
	
	/**
	 * Make the component hidden and notify subscribers.
	 *
	 * @return {boolean} operation status
	 *
	 * @fires module:stb/component~Component#hide
	 */
	Component.prototype.hide = function () {
	    // is it visible
	    if ( this.visible ) {
	        // correct style
	        this.$node.classList.add('hidden');
	        // flag
	        this.visible = false;
	
	        debug.info('hide component ' + this.name + '#' + this.id, null, {
	            tags: ['hide', 'component', this.name, this.id]
	        });
	
	        // there are some listeners
	        if ( this.events['hide'] ) {
	            /**
	             * Make the component hidden.
	             *
	             * @event module:stb/component~Component#hide
	             */
	            this.emit('hide');
	        }
	
	        return true;
	    }
	
	    // nothing was done
	    return true;
	};
	
	
	// public
	module.exports = Component;
	
	/* WEBPACK VAR INJECTION */}.call(exports, "../../sdk/spasdk/component/index.js"))

/***/ },
/* 21 */
/*!******************************!*\
  !*** ./src/js/pages/main.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Main page implementation.
	 */
	
	'use strict';
	
	var app    = __webpack_require__(/*! spa-app */ 1),
	    Button = __webpack_require__(/*! spa-component-button */ 22),
	    List   = __webpack_require__(/*! spa-component-list */ 24),
	    Page   = __webpack_require__(/*! spa-component-page */ 19),
	    rtc    = __webpack_require__(/*! ../modules/rtc */ 25),
	    Node   = __webpack_require__(/*! ../modules/node */ 26),
	    NodeList = __webpack_require__(/*! ./../modules/node.list */ 27),
	    page   = new Page({$node: window.pageMain}),
	    peer;
	
	
	function addNodeId ( id, peer ) {
	    //app.nodes[id] = app.nodes[id] || {};
	    app.nodes[id] = {peer: peer};
	
	    //if ( id && !app.nodes[id] ) {
	    localStorage.setItem('nodes', JSON.stringify(Object.keys(app.nodes)));
	    //}
	}
	
	
	function onNodeOpen ( event ) {
	    console.log('data channel open');
	}
	
	
	function connectNode ( id ) {
	    var node = new Node({
	        id: id,
	        rtp: app.config.rtp
	    });
	
	    // send any ice candidates to the other peer
	    node.pc.onicecandidate = function ( event ) {
	        if ( event.candidate ) {
	            //console.log(event.candidate);
	            //socket.send(JSON.stringify(event.candidate));
	            console.log('%s: send ice candidate', node.id);
	            app.wamp.call('ice', {id: id, candidate: event.candidate});
	        }
	    };
	
	    node.createOffer(function ( sdp ) {
	        app.wamp.call('connect', {id: id, sdp: sdp}, function ( error, result ) {
	            //console.log(error, result);
	            if ( error ) {
	                console.log('%s: no connection', id);
	            } else {
	                //console.log('got answer');
	                node.acceptAnswer(result);
	                //peer.setRemoteDescription(result);
	                //addNodeId(id, peer);
	
	
	            }
	        });
	    });
	
	    node.addListener('open', function () {
	        console.log('data channel open');
	
	        // node.wamp.addListener('onNodeName', function ( event ) {
	        //     console.log(event);
	        // });
	
	        setTimeout(function () {
	            node.wamp.call('onNodeName', {name: app.nodeName});
	        }, 1000);
	    });
	
	    app.nodes[id] = node;
	
	    // var peer = rtc.Offerer.createOffer(function ( sdp ) {
	    //     app.wamp.call('connect', {id: id, sdp: sdp}, function ( error, result ) {
	    //         //console.log(error, result);
	    //         if ( error ) {
	    //             console.log('was not able to connect to ', id);
	    //         } else {
	    //             peer.setRemoteDescription(result);
	    //             addNodeId(id, peer);
	    //         }
	    //     });
	    // });
		//
	    // peer.peer.onicecandidate = function ( event ) {
	    //     if ( event.candidate ) {
	    //         //socket.send(JSON.stringify(event.candidate));
	    //         app.wamp.call('ice', {id: id, candidate: event.candidate});
	    //     }
	    // };
	}
	
	
	app.wamp.addListener('connect', function ( params, callback ) {
	    var node = new Node({
	        id: params.id,
	        rtp: app.config.rtp
	    });
	
	    if ( params.id in app.nodes || confirm('Do you want to add new node with id ' + params.id) ) {
	        // send any ice candidates to the other peer
	        node.pc.onicecandidate = function ( event ) {
	            if ( event.candidate ) {
	                console.log('%s: send ice candidate', node.id);
	                app.wamp.call('ice', {id: params.id, candidate: event.candidate});
	            }
	        };
	
	        node.createAnswer(params.sdp, function ( sdp ) {
	            // send back results to the sender
	            callback(null, sdp);
	
	            //addNodeId(params.id, peer);
	        });
	
	        node.addListener('open', function () {
	            console.log('data channel open');
	
	            node.wamp.addListener('onNodeName', function ( event ) {
	                console.log(event);
	            });
	
	            //node.wamp.call('onNodeName', {name: app.nodeName});
	            node.wamp.socket.onmessage = function ( event ) {
	                console.log(event);
	            };
	        });
	
	        app.nodes[params.id] = node;
	
	        //if ( !(params.id in app.nodes) ) {
	        localStorage.setItem('nodes', JSON.stringify(Object.keys(app.nodes)));
	        //}
	    }
	
	    // var peer;
		//
	    // if ( app.nodes[params.id] || confirm('Do you want to add new node with id ' + params.id) ) {
	    //     peer = rtc.Answerer.createAnswer(params.sdp, function ( sdp ) {
	    //         // send back results to the sender
	    //         callback(null, sdp);
		//
	    //         addNodeId(params.id, peer);
		//
	    //         peer.peer.onicecandidate = function ( event ) {
	    //             if ( event.candidate ) {
	    //                 //socket.send(JSON.stringify(event.candidate));
	    //                 app.wamp.call('ice', {id: params.id, candidate: event.candidate});
	    //             }
	    //         };
	    //     });
	    // }
	});
	
	app.wamp.addListener('ice', function ( params ) {
	    //console.log(params);
	    if ( app.nodes[params.id] /*&& app.nodes[params.id].peer*/ ) {
	        app.nodes[params.id].addIceCandidate(params.candidate);
	    }
	});
	
	// page.add(
	//     page.nodeList = new List({
	//         $node: window.pmNodeList,
	//         data: app.nodes.slice()
	//         //parent: this,
	//         //wamp: this.wamp
	//     })
	// );
	
	page.add(new Button({
	    $node: window.pmBtnDisconnect,
	    value: 'Disconnect',
	    events: {
	        click: function () {
	            window.serverAddressValue.parentNode.classList.remove('online');
	            app.wamp.socket.onclose = null;
	            app.wamp.socket.close();
	        }
	    }
	}));
	
	page.add(new Button({
	    $node: window.pmBtnRemoveNodes,
	    value: 'Remove nodes',
	    events: {
	        click: function () {
	            localStorage.setItem('nodes', '[]');
	            console.log('all nodes are removed!');
	        }
	    }
	}));
	
	page.add(new Button({
	    $node: window.pmBtnAddNode,
	    value: 'Add node',
	    events: {
	        click: function () {
	            var id = prompt('Please enter the node id to link with.');
	
	            if ( id ) {
	                connectNode(id);
	                localStorage.setItem('nodes', JSON.stringify(Object.keys(app.nodes)));
	            }
	        }
	    }
	}));
	
	
	app.addListener('wamp:open', function () {
	    window.serverAddressValue.parentNode.classList.add('online');
	
	    //setTimeout(function () {
	    Object.keys(app.nodes).forEach(function ( id ) {
	        //page.nodeList.add({data: id});
	        connectNode(id);
	    });
	    //}, Math.floor(Math.random() * 1000));
	
	    // remove loading gif
	    document.body.classList.remove('loading');
	
	    // show this page
	    app.route(page);
	});
	
	
	app.addListener('wamp:close', function () {
	    window.serverAddressValue.parentNode.classList.remove('online');
	});
	
	
	app.addListener('wamp:auth:error', function () {
	    alert('Fatal authentication error.');
	});
	
	
	window.serverAddressValue.innerText = 'wss.fortnotes.com';
	window.serverAddressValue.href = 'https://wss.fortnotes.com/';
	window.nodeIdValue.innerText = app.nodeId;
	window.nodeNameValue.innerText = app.nodeName;
	
	
	// public
	module.exports = page;


/***/ },
/* 22 */
/*!**************************************************************!*\
  !*** /home/dp/Projects/sdk/spasdk/component-button/index.js ***!
  \**************************************************************/
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__filename) {/**
	 * @license The MIT License (MIT)
	 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
	 */
	
	/* eslint no-path-concat: 0 */
	
	'use strict';
	
	var Component = __webpack_require__(/*! spa-component */ 20),
	    keys      = __webpack_require__(/*! spa-keys */ 23);
	
	
	/**
	 * Base button implementation.
	 *
	 * Has global options:
	 *     Button.prototype.clickDuration - time to apply "click" class, does not apply if 0
	 *
	 * @constructor
	 * @extends Component
	 *
	 * @param {Object} [config={}] init parameters (all inherited from the parent)
	 * @param {string} [config.value] button caption text (generated if not set)
	 * @param {string} [config.icon] button icon name
	 *
	 * @example
	 * var Button = require('stb/ui/button'),
	 *     btnSimple, btnIcon, btnDetached;
	 *
	 * btnSimple = new Button({
	 *     $node: document.getElementById('btnSimple'),
	 *     value: 'Simple button'
	 * });
	 *
	 * btnIcon = new Button({
	 *     $node: document.getElementById('btnIcon'),
	 *     icon: 'menu'
	 *     value: 'Button with icon'
	 * });
	 *
	 * btnDetached = new Button({
	 *     value: 'Button not added to the page',
	 *     className: 'wide'
	 * });
	 */
	function Button ( config ) {
	    // current execution context
	    //var self = this;
	
	    // sanitize
	    config = config || {};
	
	    console.assert(typeof this === 'object', 'must be constructed via new');
	
	    if ( true ) {
	        if ( typeof config !== 'object' ) { throw new Error(__filename + ': wrong config type'); }
	        // init parameters checks
	        if ( config.className && typeof config.className !== 'string' ) { throw new Error(__filename + ': wrong or empty config.className'); }
	        if ( config.icon      && typeof config.icon      !== 'string' ) { throw new Error(__filename + ': wrong or empty config.icon'); }
	        if ( config.value     && typeof config.value     !== 'string' ) { throw new Error(__filename + ': wrong or empty config.value'); }
	    }
	
	    //config.name = 'spa-component-button' + (config.className || '');
	
	    // set default className if classList property empty or undefined
	    //config.className = this.name + ' ' + (config.className || '');
	
	    // parent constructor call
	    Component.call(this, config);
	
	    // optional dom
	    if ( config.icon ) {
	        // insert icon
	        this.$icon = this.$body.appendChild(document.createElement('div'));
	        this.$icon.className = 'icon ' + config.icon;
	    }
	
	    // insert caption placeholder
	    this.$text = this.$body.appendChild(document.createElement('div'));
	    this.$text.classList.add('text');
	
	    if ( config.value ) {
	        // fill it
	        this.$text.innerText = config.value;
	    }
	}
	
	
	// inheritance
	Button.prototype = Object.create(Component.prototype);
	Button.prototype.constructor = Button;
	
	// set component name
	Button.prototype.name = 'spa-component-button';
	
	
	// time to apply "click" class, does not apply if 0
	Button.prototype.clickDuration = 200;
	
	
	/**
	 * List of all default event callbacks.
	 *
	 * @type {Object.<string, function>}
	 */
	Button.prototype.defaultEvents = {
	    /**
	     * Default method to handle mouse click events.
	     */
	    click: function () {
	        // current execution context
	        var self = this;
	
	        this.$node.classList.add('click');
	
	        setTimeout(function () {
	            self.$node.classList.remove('click');
	        }, this.clickDuration);
	    },
	
	    /**
	     * Default method to handle keyboard keydown events.
	     *
	     * @param {Object} event generated event
	     */
	    keydown: function ( event ) {
	        if ( event.code === keys.enter ) {
	            // emulate click
	            // there are some listeners
	            if ( this.events['click'] ) {
	                /**
	                 * Mouse click event emulation.
	                 *
	                 * @event module:stb/ui/button~Button#click
	                 *
	                 * @type {Object}
	                 * @property {Event} event click event data
	                 */
	                this.emit('click', {event: event});
	            }
	        }
	    }
	};
	
	
	// public
	module.exports = Button;
	
	/* WEBPACK VAR INJECTION */}.call(exports, "../../sdk/spasdk/component-button/index.js"))

/***/ },
/* 23 */
/*!**************************************************!*\
  !*** /home/dp/Projects/sdk/spasdk/keys/index.js ***!
  \**************************************************/
/***/ function(module, exports) {

	/**
	 * Global list of non-printable control key codes.
	 *
	 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
	 * @license GNU GENERAL PUBLIC LICENSE Version 3
	 */
	
	'use strict';
	
	/* eslint quote-props: 0 */
	
	// public
	module.exports = {
	    backspace: 8,
	    tab:       9,
	    enter:     13,
	    escape:    27,
	    pageUp:    33,
	    pageDown:  34,
	    end:       35,
	    home:      36,
	    left:      37,
	    up:        38,
	    right:     39,
	    down:      40,
	    insert:    45,
	    'delete':  46
	};


/***/ },
/* 24 */
/*!************************************************************!*\
  !*** /home/dp/Projects/sdk/spasdk/component-list/index.js ***!
  \************************************************************/
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__filename) {/**
	 * @license The MIT License (MIT)
	 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
	 */
	
	/* eslint-disable */
	
	'use strict';
	
	var Component = __webpack_require__(/*! spa-component */ 20),
	    keys      = __webpack_require__(/*! spa-keys */ 23);
	
	
	/**
	 * Mouse click event.
	 *
	 * @event module:stb/ui/list~List#click:item
	 *
	 * @type {Object}
	 * @property {Element} $item clicked HTML item
	 * @property {Event} event click event data
	 */
	
	
	/**
	 * Base list implementation.
	 *
	 * Each data item can be either a primitive value or an object with these fields:
	 *
	 *  Name    | Description
	 * ---------|-------------
	 *  value   | actual cell value to render
	 *  mark    | is it necessary or not to render this cell as marked
	 *
	 * @constructor
	 * @extends Component
	 *
	 * @param {Object}   [config={}]          init parameters (all inherited from the parent)
	 * @param {Array}    [config.data=[]]     component data to visualize
	 * @param {function} [config.render]      method to build each grid cell content
	 * @param {function} [config.navigate]    method to move focus according to pressed keys
	 * @param {number}   [config.size=5]      amount of visible items on a page
	 * @param {number}   [config.viewIndex=0] move view window to this position on init
	 * @param {number}   [config.focusIndex]  list item index to make item focused (move view window to this position)
	 * @param {boolean}  [config.cycle=true]  allow or not to jump to the opposite side of a list when there is nowhere to go next
	 * @param {boolean}  [config.scroll=null] associated ScrollBar component link
	 * @param {Object}   [config.provider]      data provider
	 *
	 * @fires module:stb/ui/list~List#click:item
	 */
	function List ( config ) {
	    // current execution context
	    //var self = this;
	
	    // sanitize
	    config = config || {};
	
	    console.assert(typeof this === 'object', 'must be constructed via new');
	
	    if ( true ) {
	        if ( typeof config !== 'object' ) { throw new Error(__filename + ': wrong config type'); }
	        // init parameters checks
	        if ( config.className && typeof config.className !== 'string' ) { throw new Error(__filename + ': wrong or empty config.className'); }
	        if ( config.type      && Number(config.type) !== config.type  ) { throw new Error(__filename + ': config.type must be a number'); }
	    }
	
	    /**
	     * Link to the currently focused DOM element.
	     *
	     * @type {Element}
	     */
	    this.$focusItem = null;
	
	    /**
	     * Position of the visible window to render.
	     *
	     * @type {number}
	     */
	    this.viewIndex = null;
	
	    /**
	     * Component data to visualize.
	     *
	     * @type {Array}
	     */
	    this.data = [];
	
	    /**
	     * Component orientation.
	     *
	     * @type {number}
	     */
	    this.type = this.TYPE_VERTICAL;
	
	    /**
	     * Amount of visible items on a page.
	     *
	     * @type {number}
	     */
	    this.size = 5;
	
	    /**
	     * Allow or not to jump to the opposite side of a list when there is nowhere to go next.
	     *
	     * @type {boolean}
	     */
	    this.cycle = false;
	
	    /**
	     * Associated ScrollBar component link.
	     *
	     * @type {ScrollBar}
	     */
	    this.scroll = null;
	
	    // horizontal or vertical
	    if ( config.type ) {
	        // apply
	        this.type = config.type;
	    }
	
	    /**
	     * Associated data provider
	     *
	     * @type {Provider}
	     */
	    this.provider = null;
	
	
	    // set default className if classList property empty or undefined
	    //config.className = 'list ' + (config.className || '');
	
	    if ( this.type === this.TYPE_HORIZONTAL ) {
	        config.className += ' horizontal';
	    }
	
	    // parent constructor call
	    Component.call(this, config);
	
	    // component setup
	    this.init(config);
	}
	
	
	// inheritance
	List.prototype = Object.create(Component.prototype);
	List.prototype.constructor = List;
	
	// set component name
	List.prototype.name = 'spa-component-list';
	
	List.prototype.TYPE_VERTICAL   = 1;
	List.prototype.TYPE_HORIZONTAL = 2;
	
	
	/**
	 * Fill the given item with data.
	 *
	 * @param {Element} $item item DOM link
	 * @param {*} data associated with this item data
	 */
	List.prototype.renderItemDefault = function ( $item, data ) {
	    $item.innerText = data.value;
	};
	
	
	/**
	 * Method to build each list item content.
	 * Can be redefined to provide custom rendering.
	 *
	 * @type {function}
	 */
	List.prototype.renderItem = List.prototype.renderItemDefault;
	
	
	/**
	 * List of all default event callbacks.
	 *
	 * @type {Object.<string, function>}
	 */
	List.prototype.defaultEvents = {
	    /**
	     * Default method to handle mouse wheel events.
	     *
	     * @param {Event} event generated event
	     */
	    mousewheel: function ( event ) {
	        // scrolling by Y axis
	        if ( this.type === this.TYPE_VERTICAL && event.wheelDeltaY ) {
	            this.move(event.wheelDeltaY > 0 ? keys.up : keys.down);
	        }
	
	        // scrolling by X axis
	        if ( this.type === this.TYPE_HORIZONTAL && event.wheelDeltaX ) {
	            this.move(event.wheelDeltaX > 0 ? keys.left : keys.right);
	        }
	    },
	
	    /**
	     * Default method to handle keyboard keydown events.
	     *
	     * @param {Object} event generated event
	     */
	    keydown: function ( event ) {
	        switch ( event.code ) {
	            case keys.up:
	            case keys.down:
	            case keys.right:
	            case keys.left:
	            case keys.pageUp:
	            case keys.pageDown:
	            case keys.home:
	            case keys.end:
	                // cursor move only on arrow keys
	                this.move(event.code);
	                break;
	            case keys.enter:
	                // there are some listeners
	                if ( this.events['click:item'] && this.$focusItem ) {
	                    // notify listeners
	                    this.emit('click:item', {$item: this.$focusItem, event: event});
	                }
	                break;
	        }
	    }
	};
	
	
	/**
	 * Make all the data items identical.
	 * Wrap to objects if necessary.
	 *
	 * @param {Array} data incoming array
	 * @return {Array} reworked incoming data
	 */
	function normalize ( data ) {
	    var i, item;
	
	    if ( true ) {
	        if ( arguments.length !== 1 ) { throw new Error(__filename + ': wrong arguments number'); }
	        if ( !Array.isArray(data) ) { throw new Error(__filename + ': wrong data type'); }
	    }
	
	    // rows
	    for ( i = 0; i < data.length; i++ ) {
	        // cell value
	        item = data[i];
	        // primitive value
	        if ( typeof item !== 'object' ) {
	            // wrap with defaults
	            item = data[i] = {
	                value: data[i]
	            };
	        }
	
	        if ( true ) {
	            //if ( !('value' in item) ) { throw new Error(__filename + ': field "value" is missing'); }
	            if ( ('mark' in item) && Boolean(item.mark) !== item.mark ) { throw new Error(__filename + ': item.mark must be boolean'); }
	        }
	    }
	
	    return data;
	}
	
	
	/**
	 * Init or re-init of the component inner structures and HTML.
	 *
	 * @param {Object} config init parameters (subset of constructor config params)
	 */
	List.prototype.init = function ( config ) {
	    var self     = this,
	        currSize = this.$body.children.length,
	        /**
	         * Item mouse click handler.
	         *
	         * @param {Event} event click event data
	         *
	         * @this Element
	         *
	         * @fires module:stb/ui/list~List#click:item
	         */
	        onClick = function ( event ) {
	            if ( this.data ) {
	                self.focusItem(this);
	
	                // there are some listeners
	                if ( self.events['click:item'] ) {
	                    // notify listeners
	                    self.emit('click:item', {$item: this, event: event});
	                }
	            }
	        },
	        item, i;
	
	    if ( true ) {
	        if ( arguments.length !== 1 ) { throw new Error(__filename + ': wrong arguments number'); }
	        if ( typeof config !== 'object' ) { throw new Error(__filename + ': wrong config type'); }
	    }
	
	    // apply cycle behaviour
	    if ( config.cycle !== undefined ) { this.cycle = config.cycle; }
	
	    // apply ScrollBar link
	    if ( config.scroll ) { this.scroll = config.scroll; }
	
	    // apply data provider
	    if ( config.provider ) { this.provider = config.provider; }
	
	
	    // custom render method
	    if ( config.render ) {
	        if ( true ) {
	            if ( typeof config.render !== 'function' ) { throw new Error(__filename + ': wrong config.render type'); }
	        }
	        // apply
	        this.renderItem = config.render;
	    }
	
	    // list items amount on page
	    if ( config.size ) {
	        if ( true ) {
	            if ( Number(config.size) !== config.size ) { throw new Error(__filename + ': config.size must be a number'); }
	            if ( config.size <= 0 ) { throw new Error(__filename + ': config.size should be positive'); }
	        }
	        // apply
	        this.size = config.size;
	    }
	
	    // geometry has changed or initial draw
	    if ( this.size !== currSize ) {
	        // non-empty list
	        if ( currSize > 0 ) {
	            // clear old items
	            this.$body.innerText = null;
	        }
	
	        // create new items
	        for ( i = 0; i < this.size; i++ ) {
	            item = document.createElement('div');
	            item.index = i;
	            item.className = 'item';
	
	            item.addEventListener('click', onClick);
	            this.$body.appendChild(item);
	        }
	    }
	
	    if ( this.provider ) {
	        this.provider.get( null, function ( error, data ) {
	            if ( error ) {
	                if ( self.events['data:error'] ) {
	                    /**
	                     * Provider get error while take new data
	                     *
	                     * @event module:stb/ui/list~List#data:error
	                     */
	                    self.emit('data:error', error);
	                }
	            } else {
	                if ( data ) {
	                    config.data = data;
	                    self.setData(config);
	                    if ( self.scroll ) {
	                        self.scroll.init({
	                            realSize: self.provider.maxCount,
	                            viewSize: self.provider.size,
	                            value: self.provider.head + self.provider.pos
	                        });
	                    }
	                }
	                if ( self.events['data:get'] ) {
	                    /**
	                     * Provider request new data
	                     *
	                     * @event module:stb/ui/list~List#data:get
	                     *
	                     * @type {Object}
	                     */
	                    self.emit('data:get');
	                }
	            }
	        });
	    } else if ( config.data ) {
	        this.setData(config);
	    }
	
	};
	
	/**
	 * Set data and render inner structures and HTML.
	 *
	 * @param {Object} config init parameters (subset of constructor config params)
	 */
	List.prototype.setData = function ( config ) {
	    // apply list of items
	
	    if ( config.data ) {
	        if ( true ) {
	            if ( !Array.isArray(config.data) ) { throw new Error(__filename + ': wrong config.data type'); }
	        }
	        // prepare user data
	        this.data = normalize(config.data);
	    }
	
	    // view window position
	    if ( true ) {
	        if ( config.viewIndex !== undefined ) {
	            if ( Number(config.viewIndex) !== config.viewIndex ) { throw new Error(__filename + ': config.viewIndex must be a number'); }
	            if ( config.viewIndex < 0 ) { throw new Error(__filename + ': config.viewIndex should be positive'); }
	        }
	    }
	    // reset current view window position
	    this.viewIndex = null;
	
	    if ( this.$focusItem ) {
	        this.blurItem(this.$focusItem);
	    }
	
	    if ( this.scroll ) {
	        if ( this.provider ) {
	            if ( this.scroll.realSize !== this.provider.maxCount ) {
	                this.scroll.init({
	                    realSize: this.provider.maxCount,
	                    viewSize: this.provider.size,
	                    value: this.provider.head + this.provider.pos
	                });
	            }
	        } else {
	            this.scroll.init({
	                realSize: this.data.length,
	                viewSize: this.size,
	                value: config.viewIndex || 0
	            });
	        }
	    }
	
	    // set focus item
	    if ( config.focusIndex !== undefined && this.data.length ) {
	        if ( true ) {
	            if ( Number(config.focusIndex) !== config.focusIndex ) { throw new Error(__filename + ': config.focusIndex must be a number'); }
	            if ( config.focusIndex < 0 ) { throw new Error(__filename + ': config.focusIndex should be positive'); }
	//             if ( config.focusIndex > this.data.length - 1 ) { throw new Error(__filename + ': config.focusIndex should be less than data size'); }
	        }
	
	        // jump to the necessary item
	        this.focusIndex(config.focusIndex);
	    } else {
	        // go to the first page
	        this.renderView(config.viewIndex || 0);
	    }
	};
	
	
	/**
	 * Shift the visible view window event.
	 *
	 * @event module:stb/ui/list~List#move:view
	 *
	 * @type {Object}
	 * @property {number} prevIndex previous view window position
	 * @property {number} currIndex current view window position
	 */
	
	
	/**
	 * Draw the visible window.
	 *
	 * @param {number} index start position to render
	 *
	 * @return {boolean} operation status
	 *
	 * @fires module:stb/ui/list~List#move:view
	 */
	List.prototype.renderView = function ( index ) {
	    var $item, i, itemData, prevIndex, currIndex;
	
	    if ( true ) {
	        if ( arguments.length !== 1 ) { throw new Error(__filename + ': wrong arguments number'); }
	        if ( Number(index) !== index ) { throw new Error(__filename + ': index must be a number'); }
	        if ( index < 0 ) { throw new Error(__filename + ': index should be more than zero'); }
	//         if ( index >= this.data.length ) { throw new Error(__filename + ': index should be less than data size'); }
	    }
	
	    // has the view window position changed
	    if ( this.viewIndex !== index ) {
	        // save for emit
	        prevIndex = this.viewIndex;
	        // sync global pointer
	        this.viewIndex = currIndex = index;
	
	        // rebuild all visible items
	        for ( i = 0; i < this.size; i++ ) {
	            // shortcuts
	            $item    = this.$body.children[i];
	            itemData = this.data[index];
	
	            // real item or stub
	            if ( itemData ) {
	                // correct inner data/index and render
	                $item.data  = itemData;
	                $item.index = index;
	                this.renderItem($item, itemData);
	
	                // apply CSS
	                if ( itemData.mark ) {
	                    $item.classList.add('mark');
	                } else {
	                    $item.classList.remove('mark');
	                }
	            } else {
	                // nothing to render
	                $item.data = $item.index = undefined;
	                $item.innerHTML = '&nbsp;';
	                $item.ready = false;
	            }
	            index++;
	        }
	
	        // there are some listeners
	        if ( this.events['move:view'] ) {
	            // notify listeners
	            this.emit('move:view', {prevIndex: prevIndex, currIndex: currIndex});
	        }
	
	        // there are some listeners
	        if ( this.events['select:item'] ) {
	            this.emit('select:item', {$item: $item});
	        }
	
	        // update a linked scroll component
	        if ( this.scroll ) {
	            this.scroll.scrollTo(this.provider ? this.provider.head + this.provider.pos : this.viewIndex);
	        }
	
	        // full rebuild
	        return true;
	    }
	
	    // nothing was done
	    return false;
	};
	
	
	/**
	 * Jump to the opposite side.
	 *
	 * @event module:stb/ui/list~List#cycle
	 *
	 * @type {Object}
	 * @property {number} direction key code initiator of movement
	 */
	
	
	/**
	 * Attempt to go beyond the edge of the list.
	 *
	 * @event module:stb/ui/list~List#overflow
	 *
	 * @type {Object}
	 * @property {number} direction key code initiator of movement
	 */
	
	
	/**
	 * Move focus to the given direction.
	 *
	 * @param {number} direction arrow key code
	 *
	 * @fires module:stb/ui/list~List#cycle
	 * @fires module:stb/ui/list~List#overflow
	 */
	List.prototype.move = function ( direction ) {
	    var self = this,
	        force = false;
	
	
	    if ( true ) {
	        if ( arguments.length !== 1 ) { throw new Error(__filename + ': wrong arguments number'); }
	        if ( Number(direction) !== direction ) { throw new Error(__filename + ': direction must be a number'); }
	    }
	
	    // empty list
	    if ( !this.data.length ) {
	        return;
	    }
	    switch ( direction ) {
	        case keys.left:
	            if ( this.type === this.TYPE_HORIZONTAL ) {
	                force = true;
	            } else {
	                break;
	            }
	        case keys.up:
	            if ( force || this.type === this.TYPE_VERTICAL ) {
	                if ( this.$focusItem && this.$focusItem.index > 0 ) {
	                    if ( this.$focusItem === this.$body.firstChild ) {
	                        this.renderView(this.viewIndex - 1);
	                    } else {
	                        this.focusItem(this.$focusItem.previousSibling);
	                    }
	                } else {
	                    if ( this.provider ) {
	                        this.provider.get(direction, function ( error, data, pos ) {
	                            if ( error ) {
	                                if ( self.events['data:error'] ) {
	                                    /**
	                                     * Provider get error while take new data
	                                     *
	                                     * @event module:stb/ui/list~List#data:error
	                                     */
	                                    self.emit('data:error', error);
	                                }
	                            } else {
	                                if ( data ) {
	                                    self.setData({data: data, focusIndex: pos || pos === 0 ? pos : self.$focusItem.index});
	                                }
	                            }
	                        });
	                    } else {
	                        // already at the beginning
	                        if ( this.cycle ) {
	                            // jump to the end of the list
	                            this.move(keys.end);
	                        }
	                        if ( this.events['overflow'] ) {
	                            // notify listeners
	                            this.emit('overflow', {direction: direction, cycle: this.cycle});
	                        }
	                    }
	                }
	            }
	            break;
	        case keys.right:
	            if ( this.type === this.TYPE_HORIZONTAL ) {
	                force = true;
	            } else {
	                break;
	            }
	        case keys.down:
	            if ( force || this.type === this.TYPE_VERTICAL ) {
	                if ( this.$focusItem && this.$focusItem.index < this.data.length - 1 ) {
	                    if ( this.$focusItem === this.$body.lastChild ) {
	                        this.renderView(this.viewIndex + 1);
	                    } else {
	                        this.focusItem(this.$focusItem.nextSibling);
	                    }
	                } else {
	                    if ( this.provider ) {
	                        this.provider.get(direction, function ( error, data, pos ) {
	                            if ( error ) {
	                                if ( self.events['data:error'] ) {
	                                    /**
	                                     * Provider get error while take new data
	                                     *
	                                     * @event module:stb/ui/list~List#data:error
	                                     */
	                                    self.emit('data:error', error);
	                                }
	                            } else {
	                                if ( data ) {
	                                    self.setData({data: data, focusIndex: pos || pos === 0 ? pos : self.$focusItem.index});
	                                }
	                            }
	                        });
	                    } else {
	                        // already at the beginning
	                        if ( this.cycle ) {
	                            // jump to the beginning of the list
	                            this.move(keys.home);
	                        }
	                        if ( this.events['overflow'] ) {
	                            // notify listeners
	                            this.emit('overflow', {direction: direction, cycle: this.cycle});
	                        }
	                    }
	                }
	            }
	            break;
	        case keys.pageUp:
	            if ( this.provider ) {
	                this.provider.get(direction, function ( error, data, pos ) {
	                    if ( error ) {
	                        if ( self.events['data:error'] ) {
	                            /**
	                             * Provider get error while take new data
	                             *
	                             * @event module:stb/ui/list~List#data:error
	                             */
	                            self.emit('data:error', error);
	                        }
	                    } else {
	                        if ( data ) {
	                            self.setData({data: data, focusIndex: pos ? pos : 0});
	                        }
	                    }
	                });
	                return;
	            }
	            if ( this.viewIndex < this.size ) {
	                // first page
	                this.renderView(0);
	            } else {
	                // second page and further
	                this.renderView(this.viewIndex - this.size + 1);
	            }
	
	            this.focusItem(this.$body.firstChild);
	            break;
	        case keys.pageDown:
	            if ( this.provider ) {
	                this.provider.get(direction, function ( error, data, pos ) {
	                    if ( error ) {
	                        if ( self.events['data:error'] ) {
	                            /**
	                             * Provider get error while take new data
	                             *
	                             * @event module:stb/ui/list~List#data:error
	                             */
	                            self.emit('data:error', error);
	                        }
	                    } else {
	                        if ( data ) {
	                            self.setData({
	                                data: data,
	                                focusIndex: pos || pos === 0 ? pos : data.length < self.size ?  data.length - 1 : self.size - 1
	                            });
	                        }
	                    }
	                });
	                break;
	            }
	            // data is bigger then one page
	            if ( this.data.length > this.size ) {
	                // determine jump size
	                if ( this.viewIndex > this.data.length - this.size * 2 ) {
	                    // last page
	                    this.renderView(this.data.length - this.size);
	                } else {
	                    // before the last page
	                    this.renderView(this.viewIndex + this.size - 1);
	                }
	                this.focusItem(this.$body.lastChild);
	            } else {
	                // not the last item on the page
	                this.focusItem(this.$body.children[this.data.length - 1]);
	            }
	            break;
	        case keys.home:
	            if ( this.provider ) {
	                this.provider.get(direction, function ( error, data, pos ) {
	                    if ( error ) {
	                        if ( self.events['data:error'] ) {
	                            /**
	                             * Provider get error while take new data
	                             *
	                             * @event module:stb/ui/list~List#data:error
	                             */
	                            self.emit('data:error', error);
	                        }
	                    } else {
	                        if ( data ) {
	                            self.setData({data: data, focusIndex: pos ? pos : 0});
	                        }
	                    }
	                });
	                break;
	            }
	            this.renderView(0);
	            this.focusItem(this.$body.firstChild);
	            break;
	        case keys.end:
	            if ( this.provider ) {
	                this.provider.get(direction, function ( error, data, pos ) {
	                    if ( error ) {
	                        if ( self.events['data:error'] ) {
	                            /**
	                             * Provider get error while take new data
	                             *
	                             * @event module:stb/ui/list~List#data:error
	                             */
	                            self.emit('data:error', error);
	                        }
	                    } else {
	                        if ( data ) {
	                            self.setData({
	                                data: data,
	                                focusIndex: pos || pos === 0 ? pos : data.length < self.size ?  data.length - 1 : self.size - 1
	                            });
	                        }
	                    }
	                });
	                break;
	            }
	            if ( this.data.length > this.size ) {
	                this.renderView(this.data.length - this.size);
	                this.focusItem(this.$body.lastChild);
	            } else {
	                // not the last item on the page
	                this.focusItem(this.$body.children[this.data.length - 1]);
	            }
	            break;
	    }
	};
	
	
	/**
	 * Highlight the given DOM element as focused.
	 * Remove focus from the previously focused item and generate associated event.
	 *
	 * @param {Node|Element} $item element to focus
	 *
	 * @return {boolean} operation status
	 *
	 * @fires module:stb/ui/list~List#focus:item
	 * @fires module:stb/ui/list~List#blur:item
	 */
	List.prototype.focusItem = function ( $item ) {
	    var $prev = this.$focusItem;
	
	    if ( true ) {
	        if ( arguments.length !== 1 ) { throw new Error(__filename + ': wrong arguments number'); }
	    }
	
	    // different element
	    if ( $item && $prev !== $item ) {
	        if ( true ) {
	            if ( !($item instanceof Element) ) { throw new Error(__filename + ': wrong $item type'); }
	            if ( $item.parentNode !== this.$body ) { throw new Error(__filename + ': wrong $item parent element'); }
	        }
	
	        // some item is focused already
	        if ( $prev !== null ) {
	            if ( true ) {
	                if ( !($prev instanceof Element) ) { throw new Error(__filename + ': wrong $prev type'); }
	            }
	
	            // style
	            $prev.classList.remove('focus');
	
	            // there are some listeners
	            if ( this.events['blur:item'] ) {
	                /**
	                 * Remove focus from an element.
	                 *
	                 * @event module:stb/ui/list~List#blur:item
	                 *
	                 * @type {Object}
	                 * @property {Element} $item previously focused HTML element
	                 */
	                this.emit('blur:item', {$item: $prev});
	            }
	        }
	        // reassign
	        this.$focusItem = $item;
	
	        this.$focusItem.data = this.data[this.$focusItem.index];
	
	        // correct CSS
	        $item.classList.add('focus');
	
	        // there are some listeners
	        if ( this.events['focus:item'] ) {
	            /**
	             * Set focus to a DOM element.
	             *
	             * @event module:stb/ui/list~List#focus:item
	             *
	             * @type {Object}
	             * @property {Element} $prev old/previous focused HTML element
	             * @property {Element} $curr new/current focused HTML element
	             */
	            this.emit('focus:item', {$prev: $prev, $curr: $item});
	        }
	
	        // there are some listeners
	        if ( this.events['select:item'] ) {
	            /**
	             * Set focus to a list item.
	             *
	             * @event module:stb/ui/list~List#select:item
	             *
	             * @type {Object}
	             * @property {Element} $item new/current focused item
	             */
	            this.emit('select:item', {$item: $item});
	        }
	
	        return true;
	    }
	
	    // nothing was done
	    return false;
	};
	
	/**
	 * Highlight the given DOM element as blur.
	 * Remove focus from the item and generate associated event.
	 *
	 * @param {Node|Element} $item element to focus
	 *
	 * @return {boolean} operation status
	 *
	 * @fires module:stb/ui/list~List#focus:item
	 * @fires module:stb/ui/list~List#blur:item
	 */
	List.prototype.blurItem = function ( $item ) {
	    if ( true ) {
	        if ( arguments.length !== 1 ) { throw new Error(__filename + ': wrong arguments number'); }
	    }
	
	    // different element
	    if ( $item ) {
	        if ( $item === this.$focusItem ) {
	            this.$focusItem = null;
	        }
	
	        $item.classList.remove('focus');
	
	        // there are some listeners
	        if ( this.events['blur:item'] ) {
	            /**
	             * Remove focus from an element.
	             *
	             * @event module:stb/ui/list~List#blur:item
	             *
	             * @type {Object}
	             * @property {Element} $item previously focused HTML element
	             */
	            this.emit('blur:item', {$item: $item});
	        }
	        return true;
	    }
	
	    // nothing was done
	    return false;
	};
	
	/**
	 * Set the given item focused by item index.
	 *
	 * @param {number} index item data index
	 */
	List.prototype.focusIndex = function ( index ) {
	    var viewIndex = this.viewIndex || 0;
	
	    if ( true ) {
	        if ( Number(index) !== index ) { throw new Error(__filename + ': index must be a number'); }
	        if ( index < 0 ) { throw new Error(__filename + ': index should be positive'); }
	//         if ( index > this.data.length - 1 ) { throw new Error(__filename + ': index should be less than data size'); }
	    }
	
	    // determine direction
	    if ( index >= viewIndex + this.size ) {
	        // check range
	        index = index < this.data.length - 1 ? index : this.data.length - 1;
	        // move down
	        this.renderView(index - this.size + 1);
	        this.focusItem(this.$body.lastChild);
	    } else if ( index < viewIndex ) {
	        // check range
	        index = index > 0 ? index : 0;
	        // move up
	        this.renderView(index);
	        this.focusItem(this.$body.firstChild);
	    } else {
	        // no move
	        if ( this.viewIndex === null ) {
	            // first attempt
	            this.renderView(0);
	        }
	        this.focusItem(this.$body.children[index - viewIndex]);
	    }
	};
	
	
	/**
	 * Set item state and appearance as marked.
	 *
	 * @param {Node|Element} $item element to focus
	 * @param {boolean} state true - marked, false - not marked
	 */
	List.prototype.markItem = function ( $item, state ) {
	    if ( true ) {
	        if ( arguments.length !== 2 ) { throw new Error(__filename + ': wrong arguments number'); }
	        if ( !($item instanceof Element) ) { throw new Error(__filename + ': wrong $item type'); }
	        if ( $item.parentNode !== this.$body ) { throw new Error(__filename + ': wrong $item parent element'); }
	        if ( Boolean(state) !== state ) { throw new Error(__filename + ': state must be boolean'); }
	    }
	
	    // correct CSS
	    if ( state ) {
	        $item.classList.add('mark');
	    } else {
	        $item.classList.remove('mark');
	    }
	
	    // apply flag
	    $item.data.mark = state;
	};
	
	
	// public
	module.exports = List;
	
	/* WEBPACK VAR INJECTION */}.call(exports, "../../sdk/spasdk/component-list/index.js"))

/***/ },
/* 25 */
/*!*******************************!*\
  !*** ./src/js/modules/rtc.js ***!
  \*******************************/
/***/ function(module, exports) {

	/**
	 * @license The MIT License (MIT)
	 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
	 */
	
	'use strict';
	
	/* eslint-disable */
	
	var RTCPeerConnection     = window.RTCPeerConnection     || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
	var RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription;
	var RTCIceCandidate       = window.RTCIceCandidate       || window.mozRTCIceCandidate;
	
	var servers = {
	    iceServers: [
	        {urls: 'stun:stun.services.mozilla.com'},
	        {urls: 'stun:stun.l.google.com:19302'}
	    ]
	};
	
	//minimal requirements for data connection
	var mediaConstraints = {
	    optional: [
	        {DtlsSrtpKeyAgreement: true}
	        //{RtpDataChannels: true}
	    ]
	};
	
	var offerer, answerer;
	var offererDataChannel, answererDataChannel;
	
	function logError ( error ) {
	    console.log('error');
	    console.log(error);
	}
	
	var Offerer = {
	    createOffer: function ( callback ) {
	        var peer = new RTCPeerConnection(servers, mediaConstraints);
	
	        this.dc = peer.createDataChannel('channel', {reliable: true});
	        setChannelEvents(this.dc);
	
	        peer.onsignalingstatechange = function ( event ) {
	            console.log('Offerer: signaling state change - ' + peer.signalingState);
	        };
	
	        peer.oniceconnectionstatechange = function ( event ) {
	            console.log('Offerer: ice connection state change - ' + peer.iceConnectionState);
	        };
	
	        /*peer.onnegotiationneeded = function ( event ) {
	            console.log('Offerer: negotiation needed', event);
	        };*/
	
	        // peer.onicecandidate = function ( event ) {
	        //     if ( event.candidate ) {
	        //         socket.send(JSON.stringify(event.candidate));
	        //         //window.iceCandidates.value += JSON.stringify(event.candidate) + '\n';
	        //     }
	        // };
	
	        peer.createOffer(function ( sdp ) {
	            console.log('Offerer: create offer');
	            peer.setLocalDescription(sdp);
	            //Send_to_Other_Peer(sdp);
	            //window.offer.value = JSON.stringify(sdp);
	            //socket.send(JSON.stringify(sdp));
	            callback(sdp);
	        }, logError);
	
	        this.peer = peer;
	
	        return this;
	    },
	
	    setRemoteDescription: function ( sdp ) {
	        this.peer.setRemoteDescription(new RTCSessionDescription(sdp), function () {
	            console.log('Offerer: accept answer');
	        }, logError);
	    },
	
	    addIceCandidate: function ( candidate ) {
	        this.peer.addIceCandidate(new RTCIceCandidate({
	            sdpMLineIndex: candidate.sdpMLineIndex,
	            candidate: candidate.candidate
	        }), function () {
	            console.log('Offerer: add ice candidate');
	        }, logError);
	    }
	};
	
	var Answerer = {
	    createAnswer: function ( offerSDP, callback ) {
	        var peer = new RTCPeerConnection(servers, mediaConstraints),
	            self = this;
	
	        peer.ondatachannel = function ( event ) {
	            self.dc = event.channel;
	            setChannelEvents(self.dc);
	
	        };
	
	        peer.onsignalingstatechange = function ( event ) {
	            console.log('Answerer: signaling state change - ' + peer.signalingState);
	        };
	
	        peer.oniceconnectionstatechange = function ( event ) {
	            console.log('Answerer: ice connection state change - ' + peer.iceConnectionState);
	        };
	
	        /*peer.onnegotiationneeded = function ( event ) {
	            console.log('Answerer: negotiation needed', event);
	        };*/
	
	        // answererDataChannel = peer.createDataChannel('channel', {reliable: true});
	        // setChannelEvents(answererDataChannel);
	
	        // peer.ondatachannel = function ( event ) {
	        //     answererDataChannel = event.channel;
	        //     setChannelEvents(answererDataChannel);
	        // };
	
	        // peer.onicecandidate = function ( event ) {
	        //     if ( event.candidate ) {
	        //         //window.iceCandidates.value += JSON.stringify(event.candidate) + '\n';
	        //         socket.send(JSON.stringify(event.candidate));
	        //     }
	        // };
	
	        peer.setRemoteDescription(new RTCSessionDescription(offerSDP), function () {
	            console.log('Answerer: accept offer');
	        }, logError);
	
	        peer.createAnswer(function ( sdp ) {
	            console.log('Answerer: create answer');
	            peer.setLocalDescription(sdp);
	            //window.answer.value = JSON.stringify(sdp);
	            //socket.send(JSON.stringify(sdp));
	            callback(sdp)
	        }, logError);
	
	        this.peer = peer;
	
	        return this;
	    },
	
	    addIceCandidate: function ( candidate ) {
	        this.peer.addIceCandidate(new RTCIceCandidate({
	            sdpMLineIndex: candidate.sdpMLineIndex,
	            candidate: candidate.candidate
	        }), function () {
	            console.log('Answerer: add ice candidate');
	        }, logError);
	    }
	};
	
	function setChannelEvents ( channel ) {
	    channel.onmessage = function ( event ) {
	        var data = JSON.parse(event.data);
	        console.log(data);
	        //window.messages.value += '<< ' + data + '\n';
	    };
	    channel.onopen = function () {
	        console.log('data channel open');
	        channel.push = channel.send;
	        channel.send = function ( data ) {
	            channel.push(JSON.stringify(data));
	        };
	    };
	
	    channel.onerror = function ( e ) {
	        console.error('channel.onerror', e);
	    };
	
	    channel.onclose = function ( e ) {
	        console.warn('channel.onclose', e);
	    };
	}
	
	
	// public
	module.exports = {
	    Offerer: Offerer,
	    Answerer: Answerer,
	    setChannelEvents: setChannelEvents
	};


/***/ },
/* 26 */
/*!********************************!*\
  !*** ./src/js/modules/node.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @license The MIT License (MIT)
	 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
	 */
	
	'use strict';
	
	var Emitter = __webpack_require__(/*! cjs-emitter */ 3),
	    Wamp    = __webpack_require__(/*! cjs-wamp */ 11),
	    RTCPeerConnection     = window.RTCPeerConnection     || window.mozRTCPeerConnection || window.webkitRTCPeerConnection,
	    RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription,
	    RTCIceCandidate       = window.RTCIceCandidate       || window.mozRTCIceCandidate;
	
	
	function errorHandler ( error ) {
	    console.log('error');
	    console.log(error);
	}
	
	
	/**
	 * @param {Object} [config={}] init parameters
	 * @param {number} config.id node id
	 * @param {RTCConfiguration} config.rtp connection config
	 *
	 * @constructor
	 */
	function Node ( config ) {
	    config = config || {};
	
	    // parent constructor call
	    Emitter.call(this);
	
	    this.id = config.id;
	
	    this.pc = new RTCPeerConnection(config.rtp);
	}
	
	
	// inheritance
	Node.prototype = Object.create(Emitter.prototype);
	Node.prototype.constructor = Node;
	
	
	Node.prototype.createOffer = function ( callback ) {
	    var self = this;
	
	    this.pc.onsignalingstatechange = function () {
	        console.log('%s: signaling state change - %s', self.id, self.pc.signalingState);
	    };
	
	    this.pc.oniceconnectionstatechange = function () {
	        console.log('%s: ice connection state change - %s', self.id, self.pc.iceConnectionState);
	    };
	
	    /*this.pc.onconnectionstatechange = function () {
	        console.log('%s: offer connection state change - %s', self.id, self.pc.connectionState);
	    };*/
	
	    // let the event trigger offer generation
	    this.pc.onnegotiationneeded = function () {
	        console.log('negotiation needed');
	
	        self.pc.createOffer()
	            .then(function ( sdp ) {
	                console.log('%s: create offer', self.id);
	
	                return self.pc.setLocalDescription(sdp);
	            })
	            .then(function () {
	                // send the offer to the other peer
	                callback(self.pc.localDescription);
	            })
	            .catch(errorHandler);
	
	        // self.pc.createOffer(function ( sdp ) {
	        //     console.log('%s: create offer', self.id);
	        //     self.pc.setLocalDescription(sdp);
	        //     callback(sdp);
	        // }, errorHandler);
	    };
	
	    this.dc   = this.pc.createDataChannel('main');
	    this.wamp = self.setDataChannel(this.dc);
	
	    // peer.onicecandidate = function ( event ) {
	    //     if ( event.candidate ) {
	    //         socket.send(JSON.stringify(event.candidate));
	    //         //window.iceCandidates.value += JSON.stringify(event.candidate) + '\n';
	    //     }
	    // };
	};
	
	
	Node.prototype.createAnswer = function ( sdp, callback ) {
	    var self = this;
	
	    this.pc.ondatachannel = function ( event ) {
	        self.dc   = event.channel;
	        self.wamp = self.setDataChannel(self.dc);
	    };
	
	    this.pc.onsignalingstatechange = function () {
	        console.log('%s: signaling state change - %s', self.id, self.pc.signalingState);
	    };
	
	    this.pc.oniceconnectionstatechange = function () {
	        console.log('%s: ice connection state change - %s', self.id, self.pc.iceConnectionState);
	    };
	
	    /*this.pc.onnegotiationneeded = function ( event ) {
	     console.log('Answerer: negotiation needed', event);
	     };*/
	
	    // answererDataChannel = this.pc.createDataChannel('channel', {reliable: true});
	    // setChannelEvents(answererDataChannel);
	
	    // this.pc.ondatachannel = function ( event ) {
	    //     answererDataChannel = event.channel;
	    //     setChannelEvents(answererDataChannel);
	    // };
	
	    // this.pc.onicecandidate = function ( event ) {
	    //     if ( event.candidate ) {
	    //         //window.iceCandidates.value += JSON.stringify(event.candidate) + '\n';
	    //         socket.send(JSON.stringify(event.candidate));
	    //     }
	    // };
	
	    this.pc.setRemoteDescription(new RTCSessionDescription(sdp), function () {
	        console.log('%s: accept offer', self.id);
	    }, errorHandler);
	
	    this.pc.createAnswer(function ( sdp ) {
	        console.log('%s: create answer', self.id);
	        self.pc.setLocalDescription(sdp);
	        //window.answer.value = JSON.stringify(sdp);
	        //socket.send(JSON.stringify(sdp));
	        callback(sdp);
	    }, errorHandler);
	};
	
	
	Node.prototype.acceptAnswer = function ( sdp ) {
	    var self = this;
	
	    this.pc.setRemoteDescription(new RTCSessionDescription(sdp), function () {
	        console.log('%s: accept answer', self.id);
	    }, errorHandler);
	};
	
	
	Node.prototype.addIceCandidate = function ( candidate ) {
	    var self = this;
	
	    this.pc.addIceCandidate(new RTCIceCandidate({
	        sdpMLineIndex: candidate.sdpMLineIndex,
	        candidate: candidate.candidate
	    }), function () {
	        console.log('%s: add ice candidate', self.id);
	    }, errorHandler);
	};
	
	
	Node.prototype.setDataChannel = function ( channel ) {
	    var self = this;
	
	    // channel.onmessage = function ( event ) {
	    //     var data = JSON.parse(event.data);
		//
	    //     console.log('data channel message (length:%s): %s', data.length, data);
	    //     //window.messages.value += '<< ' + data + '\n';
	    // };
	
	    channel.onopen = function () {
	        //console.log('data channel open');
	        self.emit('open');
	        // channel.push = channel.send;
	        // channel.send = function ( data ) {
	        //     channel.push(JSON.stringify(data));
	        // };
	        //
	        // channel.send('ping');
	    };
	
	    channel.onerror = function ( error ) {
	        console.error('channel.onerror', error);
	    };
	
	    channel.onclose = function ( error ) {
	        console.warn('channel.onclose', error);
	    };
	
	    return new Wamp(channel);
	};
	
	
	// public
	module.exports = Node;


/***/ },
/* 27 */
/*!*************************************!*\
  !*** ./src/js/modules/node.list.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__filename) {/**
	 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
	 * @license GNU GENERAL PUBLIC LICENSE Version 3
	 */
	
	/* eslint no-path-concat: 0 */
	
	'use strict';
	
	var Component = __webpack_require__(/*! spa-component */ 20);
	
	
	/**
	 * Development node list implementation.
	 *
	 * @constructor
	 * @extends Component
	 *
	 * @param {Object} config={}        init parameters (all inherited from the parent)
	 * @param {Object} config.wamp      link to the server connection
	 * @param {Array}  [config.data=[]] component data to visualize
	 */
	function NodeList ( config ) {
	    // current execution context
	    var self = this;
	
	    // sanitize
	    config = config || {};
	
	    console.assert(typeof this === 'object', 'must be constructed via new');
	
	    if ( true ) {
	        if ( typeof config !== 'object' ) { throw new Error(__filename + ': wrong config type'); }
	        // init parameters checks
	        if ( config.className && typeof config.className !== 'string' ) { throw new Error(__filename + ': wrong or empty config.className'); }
	        //if ( !config.wamp ) { throw new Error(__filename + ': config.wamp must be given'); }
	    }
	
	    // set default className if classList property empty or undefined
	    //config.className = 'taskList ' + (config.className || '');
	
	    // parent constructor call
	    Component.call(this, config);
	
	    this.filterText = '';
	    //this.wamp = config.wamp;
	
	    // component setup
	    this.init(config);
	
	    // forward click to the specific item
	    this.addListener('click', function ( event ) {
	        // there are some listeners
	        /*if ( self.events['click:item'] ) {
	            // notify listeners
	            self.emit('click:item', {$item: event.target});
	        }*/
	
	        //console.log(event.$item);
	        // self.wamp.call('runTask', {id: event.target.taskId}, function ( error, data ) {
	        //     console.log('run task', error, data);
	        // });
	    });
	
	    // this.wamp.addListener('eventTaskStart', function ( event ) {
	    //     console.log('task start', event);
	    //     //window[event.id].classList.add('running');
	    //     console.log(self);
	    //     self.data[event.id].$node.classList.add('running');
	    // });
		//
	    // this.wamp.addListener('eventTaskFinish', function ( event ) {
	    //     console.log('task finish', event);
	    //     //window[event.id].classList.remove('running');
	    //     self.data[event.id].$node.classList.remove('running');
	    //     self.data[event.id].$node.classList.add('ok');
	    // });
	}
	
	
	// inheritance
	NodeList.prototype = Object.create(Component.prototype);
	NodeList.prototype.constructor = NodeList;
	
	
	// set component name
	NodeList.prototype.name = 'app-component-node-list';
	
	
	/**
	 * List of all default event callbacks.
	 *
	 * @type {Object.<string, function>}
	 */
	NodeList.prototype.defaultEvents = {
	
	};
	
	
	/**
	 * Init or re-init of the component inner structures and HTML.
	 *
	 * @param {Object} config init parameters (subset of constructor config params)
	 */
	NodeList.prototype.init = function ( config ) {
	    var self = this;
	
	    if ( true ) {
	        if ( arguments.length !== 1 ) { throw new Error(__filename + ': wrong arguments number'); }
	        if ( typeof config !== 'object' ) { throw new Error(__filename + ': wrong config type'); }
	    }
	
	    // save
	    this.data = config.data || {};
	
	    // apply
	    Object.keys(this.data).forEach(function ( id ) {
	        var item = document.createElement('div'),
	            data = self.data[id];
	
	        item.innerText = item.taskId = id;
	        item.className = 'item' + (data.running ? ' running' : '');
	
	        data.$node = item;
	
	        self.$node.appendChild(item);
	    });
	};
	
	
	NodeList.prototype.matchFilter = function ( node ) {
	    return !(this.filterText && node.innerText.indexOf(this.filterText) === -1);
	};
	
	
	NodeList.prototype.applyFilter = function () {
	    var nodes = this.$body.children,
	        length, item;
	
	    // prepare
	    length = nodes.length;
	    // check
	    while ( length-- ) {
	        item = nodes[length];
	
	        item.style.display = this.matchFilter(item) ? 'block' : 'none';
	    }
	};
	
	
	NodeList.prototype.add = function ( data ) {
	    var self = this,
	        item = document.createElement('div'),
	        info = document.createElement('div');
	
	    item.className = 'item';
	
	    data.tags = data.tags || [];
	    data.tags.push(data.type);
	    data.tags.forEach(function ( tag ) {
	        var div = document.createElement('div');
	
	        div.className = 'tag';
	        div.innerText = tag;
	
	        //item.appendChild(div);
	
	        // if ( ['info', 'warn', 'fail'].indexOf(tag) !== -1 ) {
	        //     item.classList.add(tag);
	        // }
	
	        div.addEventListener('click', function ( event ) {
	            if ( event.ctrlKey ) {
	                self.excludeTags.push(tag);
	                window.pageMainTagsExclude.value = window.pageMainTagsExclude.value + (window.pageMainTagsExclude.value ? ' ' : '') + tag;
	            } else {
	                self.includeTags.push(tag);
	                window.pageMainTagsInclude.value = window.pageMainTagsInclude.value + (window.pageMainTagsInclude.value ? ' ' : '') + tag;
	            }
	
	            self.applyFilter();
	
	            /*var length = window.pageMainTabTargetList.children.length,
	             index, node;
	
	             console.log(tag);
	
	             for ( index = 0; index < length; index++ ) {
	             node = window.pageMainTabTargetList.children[index];
	             //console.log(index, node);
	             node.style.display = node.tags.indexOf(tag) === -1 ? 'none' : 'block';
	             }*/
	        });
	    });
	    item.classList.add(data.type);
	    item.tags = data.tags;
	
	    info.className = 'info';
	    console.log(data.data);
	    info.innerText = data.data; // && 'link' in  data.data ? '+ ' : '- ') +
	        //getTime(data.time) + ' :: ' + data.info/*+ (data.data ? ' :: ' + data.data : '')*/;
	
	    item.addEventListener('click', function () {
	        //console.log(data.data.link);
	        app.wamp.call('getLinkData', {targetId: 128, linkId: data.data.link}, function ( error, data ) {
	            console.log(error, data);
	        });
	    });
	
	    item.appendChild(info);
	
	    //console.log('target message', data);
	
	    if ( !this.matchFilter(item) ) {
	        item.style.display = 'none';
	    }
	
	    this.$body.appendChild(item);
	};
	
	
	// public
	module.exports = NodeList;
	
	/* WEBPACK VAR INJECTION */}.call(exports, "src/js/modules/node.list.js"))

/***/ }
/******/ ]);
//# sourceMappingURL=develop.map