/******/ (function(modules) { // webpackBootstrap
/******/     // The module cache
/******/     var installedModules = {};
/******/
/******/     // The require function
/******/     function __webpack_require__(moduleId) {
/******/
/******/         // Check if module is in cache
/******/         if(installedModules[moduleId])
/******/             return installedModules[moduleId].exports;
/******/
/******/         // Create a new module (and put it into the cache)
/******/         var module = installedModules[moduleId] = {
/******/             exports: {},
/******/             id: moduleId,
/******/             loaded: false
/******/         };
/******/
/******/         // Execute the module function
/******/         modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/         // Flag the module as loaded
/******/         module.loaded = true;
/******/
/******/         // Return the exports of the module
/******/         return module.exports;
/******/     }
/******/
/******/
/******/     // expose the modules object (__webpack_modules__)
/******/     __webpack_require__.m = modules;
/******/
/******/     // expose the module cache
/******/     __webpack_require__.c = installedModules;
/******/
/******/     // __webpack_public_path__
/******/     __webpack_require__.p = "";
/******/
/******/     // Load entry module and return exports
/******/     return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!***********************!*\
  !*** ./js/develop.js ***!
  \***********************/
/***/ function(module, exports, __webpack_require__) {

            /**
             * Main module to setup development environment.
             *
             * @author DarkPark
             * @license GNU GENERAL PUBLIC LICENSE Version 3
             */
            
            'use strict';
            
            var dom = __webpack_require__(/*! ./lib/dom */ 6);
            
            //var app     = require('../app'),
            //    storage = require('./storage'),
            //    metrics = require('cfg/metrics');
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
            __webpack_require__(/*! ./main */ 10);


/***/ },
/* 1 */
/*!*****************************!*\
  !*** ./js/lib/component.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

            /**
             * @module stb/component
             * @author DarkPark
             * @license GNU GENERAL PUBLIC LICENSE Version 3
             */
            
            'use strict';
            
            var Emitter = __webpack_require__(/*! ./emitter */ 2),
                router  = __webpack_require__(/*! ./router */ 3),
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
             * @param {Element} [config.$node] DOM element/fragment to be a component outer container
             * @param {Element} [config.$body] DOM element/fragment to be a component inner container (by default is the same as $node)
             * @param {Element} [config.$content] DOM element/fragment to be appended to the $body
             * @param {Component} [config.parent] link to the parent component which has this component as a child
             * @param {Array.<Component>} [config.children=[]] list of components in this component
             * @param {Object.<string, function>} [config.events={}] list of event callbacks
             * @param {boolean} [config.visible=true] component initial visibility state flag
             * @param {boolean} [config.focusable=true] component can accept focus or not
             *
             * @fires module:stb/component~Component#click
             *
             * @example
             * var component = new Component({
             *     $node: document.getElementById(id),
             *     events: {
             *         click: function () { ... }
             *     }
             * });
             * component.add( ... );
             * component.focus();
             */
            function Component ( config ) {
                // current execution context
                var self = this;
            
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
            
                if ( true ) {
                    /**
                     * Link to the page owner component.
                     * It can differ from the direct parent.
                     * Should be used only in debug.
                     *
                     * @type {Page}
                     */
                    //this.page = null;
                }
            
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
            
            
                // sanitize
                config = config || {};
            
                if ( true ) {
                    if ( typeof config !== 'object' ) { throw 'wrong config type'; }
                }
            
                // parent init
                Emitter.call(this, config.data);
            
                // outer handle
                if ( config.$node !== undefined ) {
                    if ( true ) {
                        if ( !(config.$node instanceof Element) ) { throw 'wrong config.$node type'; }
                    }
                    // apply
                    this.$node = config.$node;
                } else {
                    // empty div in case nothing is given
                    this.$node = document.createElement('div');
                }
            
                // inner handle
                if ( config.$body !== undefined ) {
                    if ( true ) {
                        if ( !(config.$body instanceof Element) ) { throw 'wrong config.$body type'; }
                    }
                    // apply
                    this.$body = config.$body;
                } else {
                    // inner and outer handlers are identical
                    this.$body = this.$node;
                }
            
                // inject given content into inner component part
                if ( config.$content !== undefined ) {
                    if ( true ) {
                        if ( !(config.$content instanceof Element) ) { throw 'wrong config.$content type'; }
                    }
                    // apply
                    this.$body.appendChild(config.$content);
                }
            
                // correct CSS class names
                this.$node.classList.add('component');
            
                // apply hierarchy
                if ( config.parent !== undefined ) {
                    if ( true ) {
                        if ( !(config.parent instanceof Component) ) { throw 'wrong config.parent type'; }
                    }
                    // apply
                    config.parent.add(this);
                }
            
                // set link to the page owner component
                //if ( config.page !== undefined ) {
                //    if ( DEBUG ) {
                //        if ( !(config.page instanceof Component) ) { throw 'wrong config.page type'; }
                //    }
                //    // apply
                //    this.page = config.page;
                //}
            
                // apply given visibility
                if ( config.visible === false ) {
                    // default state is visible
                    this.hide();
                }
            
                // can't accept focus
                if ( config.focusable === false ) {
                    this.focusable = false;
                }
            
                // apply given events
                if ( config.events !== undefined ) {
                    // no need in assert here (it is done inside the addListeners)
                    this.addListeners(config.events);
                }
            
                // apply component id if given, generate otherwise
                this.id = config.id || this.$node.id || 'id' + counter++;
            
                // apply the given children components
                if ( config.children ) {
                    if ( true ) {
                        if ( !Array.isArray(config.children) ) { throw 'wrong config.children type'; }
                    }
                    // apply
                    this.add.apply(this, config.children);
                }
            
                // component activation by mouse
                this.$node.addEventListener('click', function ( event ) {
                    // left mouse button
                    if ( event.button === 0 ) {
                        // activate if possible
                        self.focus();
            
                        // there are some listeners
                        if ( self.events['click'] !== undefined ) {
                            /**
                             * Mouse click event.
                             *
                             * @event module:stb/component~Component#click
                             *
                             * @type {Object}
                             * @property {Event} event click event data
                             */
                            self.emit('click', {event: event});
                        }
            
                        // not prevented
                        //if ( !event.stop ) {
                        //    // activate if possible
                        //    self.focus();
                        //}
                    }
            
                    if ( true ) {
                        // middle mouse button
                        if ( event.button === 1 ) {
                            console.log(self);
                            console.log('this component is now available by window.link');
                            window.link = self;
                        }
                    }
            
                    event.stopPropagation();
                });
            
                if ( true ) {
                    // expose a link
                    this.$node.component = this.$body.component = this;
                    this.$node.title = 'component ' + this.constructor.name + '.' + this.id + ' (outer)';
                    this.$body.title = 'component ' + this.constructor.name + '.' + this.id + ' (inner)';
                }
            
                // @todo remove or implement
                // navigation by keyboard
                //this.addListener('keydown', this.navigateDefault);
            }
            
            
            // inheritance
            Component.prototype = Object.create(Emitter.prototype);
            Component.prototype.constructor = Component;
            
            
            /**
             * Default method to move focus according to pressed keys.
             *
             * @todo remove or implement
             *
             * @param {Event} event generated event source of movement
             */
            /*Component.prototype.navigateDefault = function ( event ) {
                switch ( event.code ) {
                    case keys.up:
                    case keys.down:
                    case keys.right:
                    case keys.left:
                        // notify listeners
                        this.emit('overflow');
                        break;
                }
            };*/
            
            
            /**
             * Current active method to move focus according to pressed keys.
             * Can be redefined to provide custom navigation.
             *
             * @todo remove or implement
             *
             * @type {function}
             */
            /*Component.prototype.navigate = Component.prototype.navigateDefault;*/
            
            
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
                var i;
            
                // walk through all the given elements
                for ( i = 0; i < arguments.length; i++ ) {
                    child = arguments[i];
            
                    if ( true ) {
                        if ( !(child instanceof Component) ) { throw 'wrong child type'; }
                    }
            
                    // apply
                    this.children.push(child);
                    child.parent = this;
            
                    //if ( DEBUG ) {
                    //    // apply page for this and all children recursively
                    //    child.setPage(this.page);
                    //}
            
                    // correct DOM parent/child connection if necessary
                    if ( child.$node !== undefined && child.$node.parentNode === null ) {
                        this.$body.appendChild(child.$node);
                    }
            
                    // there are some listeners
                    if ( this.events['add'] !== undefined ) {
                        /**
                         * A child component is added.
                         *
                         * @event module:stb/component~Component#add
                         *
                         * @type {Object}
                         * @property {Component} child new component added
                         */
                        this.emit('add', {item: child});
                    }
            
                    console.log('component ' + this.constructor.name + '.' + this.id + ' new child: ' + child.constructor.name + '.' + child.id);
                }
            };
            
            
            //if ( DEBUG ) {
            //    Component.prototype.setPage = function ( page ) {
            //        this.page = page;
            //
            //        this.children.forEach(function ( child ) {
            //            child.setPage(page);
            //        });
            //    };
            //}
            
            
            /**
             * Delete this component and clear all associated events.
             *
             * @fires module:stb/component~Component#remove
             */
            Component.prototype.remove = function () {
                var page = router.current;
            
                // really inserted somewhere
                if ( this.parent ) {
                    if ( true ) {
                        if ( !(this.parent instanceof Component) ) { throw 'wrong this.parent type'; }
                    }
            
                    // active at the moment
                    if ( page.activeComponent === this ) {
                        this.blur();
                        this.parent.focus();
                    }
                    this.parent.children.splice(this.parent.children.indexOf(this), 1);
                }
            
                // remove all children
                this.children.forEach(function ( child ) {
                    if ( true ) {
                        if ( !(child instanceof Component) ) { throw 'wrong child type'; }
                    }
            
                    child.remove();
                });
            
                this.removeAllListeners();
                this.$node.parentNode.removeChild(this.$node);
            
                // there are some listeners
                if ( this.events['remove'] !== undefined ) {
                    /**
                     * Delete this component.
                     *
                     * @event module:stb/component~Component#remove
                     */
                    this.emit('remove');
                }
            
                console.log('component ' + this.constructor.name + '.' + this.id + ' remove', 'red');
            };
            
            
            /**
             * Activate the component.
             * Notify the owner-page and apply CSS class.
             *
             * @return {boolean} operation status
             *
             * @fires module:stb/component~Component#focus
             */
            Component.prototype.focus = function () {
                var activePage = router.current,
                    activeItem = activePage.activeComponent;
            
                //if ( DEBUG ) {
                //    if ( this.page !== activePage ) {
                //        console.log(this, this.page, activePage);
                //        throw 'attempt to focus an invisible component';
                //    }
                //}
            
                // this is a visual component on a page
                // not already focused and can accept focus
                if ( this.focusable && this !== activeItem ) {
                    // notify the current active component
                    if ( activeItem ) { activeItem.blur(); }
            
                    // apply
                    activePage.activeComponent = activeItem = this;
                    activeItem.$node.classList.add('focus');
            
                    // there are some listeners
                    if ( activeItem.events['focus'] !== undefined ) {
                        /**
                         * Make this component focused.
                         *
                         * @event module:stb/component~Component#focus
                         */
                        activeItem.emit('focus');
                    }
            
                    console.log('component ' + this.constructor.name + '.' + this.id + ' focus');
            
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
                var activePage = router.current,
                    activeItem = activePage.activeComponent;
            
                // this is the active component
                if ( this === activeItem ) {
                    this.$node.classList.remove('focus');
                    activePage.activeComponent = null;
            
                    // there are some listeners
                    if ( this.events['blur'] !== undefined ) {
                        /**
                         * Remove focus from this component.
                         *
                         * @event module:stb/component~Component#blur
                         */
                        this.emit('blur');
                    }
            
                    console.log('component ' + this.constructor.name + '.' + this.id + ' blur', 'grey');
            
                    return true;
                }
            
                // nothing was done
                return false;
            };
            
            
            /**
             * Make the component visible and notify subscribers.
             *
             * @return {boolean} operation status
             *
             * @fires module:stb/component~Component#show
             */
            Component.prototype.show = function () {
                // is it hidden
                if ( !this.visible ) {
                    // correct style
                    this.$node.classList.remove('hidden');
                    // flag
                    this.visible = true;
            
                    // there are some listeners
                    if ( this.events['show'] !== undefined ) {
                        /**
                         * Make the component visible.
                         *
                         * @event module:stb/component~Component#show
                         */
                        this.emit('show');
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
            
                    // there are some listeners
                    if ( this.events['hide'] !== undefined ) {
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


/***/ },
/* 2 */
/*!***************************!*\
  !*** ./js/lib/emitter.js ***!
  \***************************/
/***/ function(module, exports, __webpack_require__) {

            /**
             * @author DarkPark
             * @license GNU GENERAL PUBLIC LICENSE Version 3
             */
            
            'use strict';
            
            
            /**
             * Base Events Emitter implementation.
             *
             * @see http://nodejs.org/api/events.html
             * @constructor
             */
            function Emitter () {
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
                 * var obj = new Emitter();
                 * obj.addListener('click', function ( data ) { ... });
                 * // one more click handler
                 * obj.addListener('click', function ( data ) { ... });
                 */
                addListener: function ( name, callback ) {
                    if ( true ) {
                        if ( arguments.length !== 2 ) { throw 'wrong arguments number'; }
                        if ( typeof name !== 'string' || name.length === 0 ) { throw 'wrong or empty name'; }
                        if ( typeof callback !== 'function' ) { throw 'wrong callback type'; }
                    }
            
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
                 */
                once: function ( name, callback ) {
                    // current execution context
                    var self = this;
            
                    if ( true ) {
                        if ( arguments.length !== 2 ) { throw 'wrong arguments number'; }
                        if ( typeof name !== 'string' || name.length === 0 ) { throw 'wrong or empty name'; }
                        if ( typeof callback !== 'function' ) { throw 'wrong callback type'; }
                    }
            
                    // initialization may be required
                    this.events[name] = this.events[name] || [];
                    // append this new event to the list
                    this.events[name].push(function onceWrapper ( data ) {
                        callback(data);
                        self.removeListener(name, onceWrapper);
                    });
                },
            
            
                /**
                 * Apply multiple listeners at once.
                 *
                 * @param {Object} callbacks event names with callbacks
                 *
                 * @example
                 * var obj = new Emitter();
                 * obj.addListeners({click: function ( data ) {}, close: function ( data ) {}});
                 */
                addListeners: function ( callbacks ) {
                    var name;
            
                    if ( true ) {
                        if ( arguments.length !== 1 ) { throw 'wrong arguments number'; }
                        if ( typeof callbacks !== 'object' ) { throw 'wrong callbacks type'; }
                        if ( Object.keys(callbacks).length === 0 ) { throw 'no callbacks given'; }
                    }
            
                    // valid input
                    if ( typeof callbacks === 'object' ) {
                        for ( name in callbacks ) {
                            if ( callbacks.hasOwnProperty(name) ) {
                                this.addListener(name, callbacks[name]);
                            }
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
                 * obj.removeListener('click', func1);
                 */
                removeListener: function ( name, callback ) {
                    if ( true ) {
                        if ( arguments.length !== 2 ) { throw 'wrong arguments number'; }
                        if ( typeof name !== 'string' || name.length === 0 ) { throw 'wrong or empty name'; }
                        if ( typeof callback !== 'function' ) { throw 'wrong callback type'; }
                        if ( this.events[name] && !Array.isArray(this.events[name]) ) { throw 'corrupted inner data'; }
                    }
            
                    // the event exists and should have some callbacks
                    if ( this.events[name] !== undefined ) {
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
                 * obj.removeAllListeners('click');
                 * obj.removeAllListeners();
                 */
                removeAllListeners: function ( name ) {
                    if ( true ) {
                        if ( arguments.length !== 0 && (typeof name !== 'string' || name.length === 0) ) { throw 'wrong or empty name'; }
                    }
            
                    // check input
                    if ( arguments.length === 0 ) {
                        // no arguments so remove everything
                        this.events = {};
                    } else if ( name ) {
                        if ( true ) {
                            if ( this.events[name] !== undefined ) { throw 'event is not removed'; }
                        }
            
                        // only name is given so remove all callbacks for the given event
                        // but object structure modification should be avoided
                        this.events[name] = undefined;
                    }
                },
            
            
                /**
                 * Execute each of the listeners in the given order with the supplied arguments.
                 *
                 * @param {string} name event identifier
                 * @param {Object} [data] options to send
                 *
                 * @todo consider use context
                 *
                 * @example
                 * obj.emit('init');
                 * obj.emit('click', {src:panel1, dst:panel2});
                 *
                 * // it's a good idea to emit event only when there are some listeners
                 * if ( this.events['click'] !== undefined ) {
                 *     this.emit('click', {event: event});
                 * }
                 */
                emit: function ( name, data ) {
                    var event = this.events[name],
                        i;
            
                    if ( true ) {
                        if ( arguments.length < 1 ) { throw 'wrong arguments number'; }
                        if ( typeof name !== 'string' || name.length === 0 ) { throw 'wrong or empty name'; }
                    }
            
                    // the event exists and should have some callbacks
                    if ( event !== undefined ) {
                        if ( true ) {
                            if ( !Array.isArray(event) ) { throw 'wrong event type'; }
                        }
            
                        for ( i = 0; i < event.length; i++ ) {
                            if ( true ) {
                                if ( typeof event[i] !== 'function' ) { throw 'wrong event callback type'; }
                            }
            
                            // invoke the callback with parameters
                            // http://jsperf.com/function-calls-direct-vs-apply-vs-call-vs-bind/6
                            event[i].call(this, data);
                        }
                    }
                }
            };
            
            
            // public
            module.exports = Emitter;


/***/ },
/* 3 */
/*!**************************!*\
  !*** ./js/lib/router.js ***!
  \**************************/
/***/ function(module, exports, __webpack_require__) {

            /**
             * Singleton for page navigation with history.
             *
             * All page modules should be in the directory `app/js/pages`.
             * Page module name and the corresponding file name should be the same.
             *
             * Include module to start working:
             *
             * ```js
             * var router = require('./lib/router');
             * ```
             *
             * Init with page modules:
             *
             * ```js
             * router.data([
             *     require('./pages/init'),
             *     require('./pages/main'),
             *     require('./pages/help')
             * ]);
             * ```
             *
             * Each page has its ID. The same ID should be used in HTML.
             *
             * Make some page active/visible by its ID:
             *
             * ```js
             * router.navigate('pageMain');
             * ```
             *
             * This will hide the current page, activate the `pageMain` page and put it in the tail of the history list.
             *
             * All subscribers of the current and `pageMain` page will be notified with `show/hide` events.
             *
             * Also the router emits `navigate` event to all subscribers.
             *
             *
             * To get to the previous active page use:
             *
             * ```js
             * router.back();
             * ```
             *
             * The module also has methods to parse location hash address and serialize it back:
             *
             * ```js
             * router.parse('#pageMain/some/additional/data');
             * router.stringify('pageMain', ['some', 'additional', 'data']);
             * ```
             *
             * Direct modification of the URL address should be avoided.
             * The methods `router.navigate` and `router.back` should be used instead.
             *
             * @author DarkPark
             * @license GNU GENERAL PUBLIC LICENSE Version 3
             */
            
            'use strict';
            
            var Emitter = __webpack_require__(/*! ./emitter */ 2),
                router;
            
            
            /**
             * @instance
             * @type {Emitter}
             */
            router = new Emitter();
            
            
            /**
             * Current active/visible page.
             *
             * @readonly
             * @type {Page}
             */
            router.current = null;
            
            
            /**
             * List of all visited pages.
             *
             * @readonly
             * @type {Page[]}
             */
            router.history = [];
            
            
            /**
             * List of all stored pages.
             *
             * @readonly
             * @type {Page[]}
             */
            router.pages = [];
            
            
            /**
             * Hash table of all pages ids with links to pages.
             *
             * @readonly
             * @type {Object.<string, Page>}
             */
            router.ids = {};
            
            
            /**
             * Clear and fill the router with the given list of pages.
             *
             * @param {Page[]} pages list of pages to add
             * @return {boolean} operation status
             *
             * @fires router#init
             */
            router.init = function ( pages ) {
                var i, l, item;
            
                if ( pages !== undefined ) {
                    if ( true ) {
                        if ( !Array.isArray(pages) ) { throw 'wrong pages type'; }
                    }
            
                    // reset page list
                    this.pages = [];
            
                    // apply list
                    this.pages = pages;
            
                    // extract ids
                    for ( i = 0, l = pages.length; i < l; i++ ) {
                        item = pages[i];
                        this.ids[item.id] = item;
            
                        // find the currently active page
                        if ( item.active ) {
                            this.current = item;
                        }
                    }
            
                    // there are some listeners
                    if ( this.events['init'] !== undefined ) {
                        // notify listeners
                        this.emit('init', {pages: pages});
                    }
            
                    return true;
                }
            
                return false;
            };
            
            
            /**
             * Extract the page name and data from url hash.
             *
             * @param {string} hash address hash part to parse
             *
             * @return {{name: string, data: string[]}} parsed data
             *
             * @example
             * router.parse('#main/some/additional/data');
             * // execution result
             * {name: 'main', data: ['some', 'additional', 'data']}
             */
            router.parse = function ( hash ) {
                var page = {
                        name : '',
                        data : []
                    };
            
                // get and decode all parts
                page.data = hash.split('/').map(decodeURIComponent);
                // the first part is a page id
                // everything else is optional path
                page.name = page.data.shift().slice(1);
            
                return page;
            };
            
            
            /**
             * Convert the given page name and its data to url hash.
             *
             * @param {string} name page name
             * @param {string[]} [data=[]] page additional parameters
             *
             * @return {string} url hash
             *
             * @example
             * router.stringify('main', ['some', 'additional', 'data']);
             * // execution result
             * '#main/some/additional/data'
             */
            router.stringify = function ( name, data ) {
                // validation
                data = Array.isArray(data) ? data : [];
            
                // encode all parts
                name = encodeURIComponent(name);
                data = data.map(encodeURIComponent);
                // add encoded name to the beginning
                data.unshift(name);
            
                // build an uri
                return data.join('/');
            };
            
            
            /**
             * Make the given inactive/hidden page active/visible.
             * Pass some data to the page and trigger the corresponding event.
             *
             * @param {Page} page item to show
             * @param {*} [data] data to send to page
             *
             * @return {boolean} operation status
             */
            router.show = function ( page, data ) {
                // page available and can be hidden
                if ( page && !page.active ) {
                    // apply visibility
                    page.$node.classList.add('active');
                    page.active  = true;
                    this.current = page;
            
                    // there are some listeners
                    if ( page.events['show'] !== undefined ) {
                        // notify listeners
                        page.emit('show', {page: page, data: data});
                    }
            
                    console.log('component ' + page.constructor.name + '.' + page.id + ' show', 'green');
            
                    return true;
                }
            
                // nothing was done
                return false;
            };
            
            
            /**
             * Make the given active/visible page inactive/hidden and trigger the corresponding event.
             *
             * @param {Page} page item to hide
             *
             * @return {boolean} operation status
             */
            router.hide = function ( page ) {
                // page available and can be hidden
                if ( page && page.active ) {
                    // apply visibility
                    page.$node.classList.remove('active');
                    page.active  = false;
                    this.current = null;
            
                    // there are some listeners
                    if ( page.events['hide'] !== undefined ) {
                        // notify listeners
                        page.emit('hide', {page: page});
                    }
            
                    console.log('component ' + page.constructor.name + '.' + page.id + ' hide', 'grey');
            
                    return true;
                }
            
                // nothing was done
                return false;
            };
            
            
            /**
             * Browse to a page with the given name.
             * Do nothing if the name is invalid. Otherwise hide the current, show new and update history.
             *
             * @param {string} name page id
             * @param {Array} [data] options to pass to the page on show
             *
             * @return {boolean} operation status
             */
            router.navigate = function ( name, data ) {
                var pageFrom = this.current,
                    pageTo   = this.ids[name];
            
                if ( true ) {
                    if ( router.pages.length > 0 ) {
                        if ( !pageTo || typeof pageTo !== 'object' ) { throw 'wrong pageTo type'; }
                        if ( !('active' in pageTo) ) { throw 'missing field "active" in pageTo'; }
                    }
                }
            
                // valid not already active page
                if ( pageTo && !pageTo.active ) {
                    console.log('router.navigate: ' + name, pageTo === pageFrom ? 'grey' : 'green');
            
                    // update url
                    location.hash = this.stringify(name, data);
            
                    // apply visibility
                    this.hide(this.current);
                    this.show(pageTo, data);
            
                    // there are some listeners
                    if ( this.events['navigate'] !== undefined ) {
                        // notify listeners
                        this.emit('navigate', {from: pageFrom, to: pageTo});
                    }
            
                    // store
                    this.history.push(pageTo);
            
                    return true;
                }
            
                console.log('router.navigate: ' + name, 'red');
            
                // nothing was done
                return false;
            };
            
            
            /**
             * Go back one step in the history.
             * If there is no previous page, does nothing.
             *
             * @return {boolean} operation status
             */
            router.back = function () {
                var pageFrom, pageTo;
            
                console.log('router.back', this.history.length > 1 ? 'green' : 'red');
            
                // there are some pages in the history
                if ( this.history.length > 1 ) {
                    // remove the current
                    pageFrom = this.history.pop();
            
                    // new tail
                    pageTo = this.history[this.history.length - 1];
            
                    // valid not already active page
                    if ( pageTo && !pageTo.active ) {
                        // update url
                        location.hash = pageTo.id;
            
                        // apply visibility
                        this.hide(this.current);
                        this.show(pageTo);
            
                        // there are some listeners
                        if ( this.events['navigate'] !== undefined ) {
                            // notify listeners
                            this.emit('navigate', {from: pageFrom, to: pageTo});
                        }
            
                        return true;
                    }
                }
            
                // nothing was done
                return false;
            };
            
            
            // public
            module.exports = router;


/***/ },
/* 4 */
/*!***************************!*\
  !*** ./js/lib/ui/page.js ***!
  \***************************/
/***/ function(module, exports, __webpack_require__) {

            /**
             * Page is the main component to build user interface.
             * Page is an area filling the whole screen.
             * There can be only one active page visible at the same time.
             *
             * Active/visible state of a page is managed by the `router` module.
             *
             * A page can contain other components.
             *
             * @author DarkPark
             * @license GNU GENERAL PUBLIC LICENSE Version 3
             */
            
            'use strict';
            
            var Component = __webpack_require__(/*! ../component */ 1);
            
            
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
            
                // sanitize
                config = config || {};
            
                // can't accept focus
                config.focusable = config.focusable || false;
            
                // parent init
                Component.call(this, config);
            
                // correct CSS class names
                this.$node.classList.add('page');
            
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
            
            
            // public
            module.exports = Page;


/***/ },
/* 5 */
/*!***********************!*\
  !*** ./js/lib/app.js ***!
  \***********************/
/***/ function(module, exports, __webpack_require__) {

            /**
             * @author DarkPark
             * @license GNU GENERAL PUBLIC LICENSE Version 3
             */
            
            'use strict';
            
            var Model    = __webpack_require__(/*! ./model */ 7),
                router   = __webpack_require__(/*! ./router */ 3),
                keyCodes = {},
                app, key;
            
            
            /**
             * @instance
             * @type {Model}
             */
            app = new Model({
                /**
                 * Enable logging and debugging flag set by debug module at runtime.
                 *
                 * @type {boolean}
                 */
                debug: false,
            
                /**
                 * Timestamps data.
                 *
                 * @type {Object}
                 * @property {number} init application initialization time (right now)
                 * @property {number} load document onload event
                 * @property {number} done onload event sent and processed
                 */
                time: {
                    init: +new Date(),
                    load: 0,
                    done: 0
                }
            });
            
            
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
            window.addEventListener('load', function globalEventListenerLoad ( event ) {
                var path;
            
                console.log(event);
            
                // time mark
                app.data.time.load = event.timeStamp;
            
                // global handler
                // there are some listeners
                if ( app.events[event.type] !== undefined ) {
                    // notify listeners
                    app.emit(event.type, event);
                }
            
                // local handler on each page
                router.pages.forEach(function forEachPages ( page ) {
                    console.log('component ' + page.constructor.name + '.' + page.id + ' load', 'green');
            
                    // there are some listeners
                    if ( page.events[event.type] !== undefined ) {
                        // notify listeners
                        page.emit(event.type, event);
                    }
                });
            
                // go to the given page if set
                if ( location.hash ) {
                    path = router.parse(location.hash);
                    router.navigate(path.name, path.data);
                }
            
                // time mark
                app.data.time.done = +new Date();
            
                // everything is ready
                // and there are some listeners
                if ( app.events['done'] !== undefined ) {
                    // notify listeners
                    app.emit('done', event);
                }
            });
            
            
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
            window.addEventListener('unload', function globalEventListenerUnload ( event ) {
                console.log(event);
            
                // global handler
                // there are some listeners
                if ( app.events[event.type] !== undefined ) {
                    // notify listeners
                    app.emit(event.type, event);
                }
            
                // local handler on each page
                router.pages.forEach(function forEachPages ( page ) {
                    // there are some listeners
                    if ( page.events[event.type] !== undefined ) {
                        // notify listeners
                        page.emit(event.type, event);
                    }
                });
            });
            
            
            ///**
            // * The hashchange event is fired when the fragment identifier of the URL has changed (the part of the URL that follows the # symbol, including the # symbol).
            // * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/hashchange
            // */
            //window.addEventListener('hashchange', function globalEventListenerHashChange ( event ) {
            //    //var page, data;
            //
            //    console.log(event);
            //    router.emit('change');
            //
            //    //debug.event(event);
            //    //debug.inspect(event);
            //    //
            //    //app.emit(event.type, event);
            //
            //    //app.parseHash();
            //
            ////    data = document.location.hash.split('/');
            ////
            ////    // the page is given
            ////    if ( data.length > 0 && (page = decodeURIComponent(data.shift().slice(1))) ) {
            ////        // the page params are given
            ////        if ( data.length > 0 ) {
            ////            data = data.map(decodeURIComponent);
            ////        }
            ////
            ////        app.emit(event.type, {page: page, data: data});
            ////    }
            //});
            
            
            /**
             * The error event is fired when a resource failed to load.
             *
             * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/error
             *
             * @param {Event} event generated object with event data
             */
            window.addEventListener('error', function globalEventListenerError ( event ) {
                console.log(event);
            });
            
            
            function globalEventListenerKeydown ( event ) {
                var page = router.current;
            
                if ( true ) {
                    if ( page === null || page === undefined ) { throw 'app should have at least one page'; }
                }
            
                // filter phantoms
                if ( event.keyCode === 0 ) { return; }
            
                // combined key code
                event.code = event.keyCode;
            
                // apply key modifiers
                if ( event.shiftKey ) { event.code += 1000; }
                if ( event.altKey )   { event.code += 2000; }
            
                console.log(event);
            
                // current component handler
                if ( page.activeComponent && page.activeComponent !== page ) {
                    // component is available and not page itself
                    if ( page.activeComponent.events[event.type] !== undefined ) {
                        // there are some listeners
                        page.activeComponent.emit(event.type, event);
                    }
                }
            
                // page handler
                if ( !event.stop ) {
                    // not prevented
                    if ( page.events[event.type] !== undefined ) {
                        // there are some listeners
                        page.emit(event.type, event);
                    }
                }
            
                // global app handler
                if ( !event.stop ) {
                    // not prevented
                    if ( app.events[event.type] !== undefined ) {
                        // there are some listeners
                        app.emit(event.type, event);
                    }
                }
            
                // suppress non-printable keys in stb device (not in your browser)
                if ( app.data.host && keyCodes[event.code] && event.preventDefault ) {
                    event.preventDefault();
                }
            }
            
            
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
            window.addEventListener('keydown', globalEventListenerKeydown);
            
            
            /**
             * The keypress event is fired when press a printable character.
             * Delivers the event only to activeComponent at active page.
             *
             * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/keypress
             *
             * @param {Event} event generated object with event data
             * @param {string} event.char entered character
             */
            window.addEventListener('keypress', function ( event ) {
                var page = router.current;
            
                if ( true ) {
                    if ( page === null || page === undefined ) { throw 'app should have at least one page'; }
                }
            
                //debug.event(event);
            
                // current component handler
                if ( page.activeComponent && page.activeComponent !== page ) {
                    // component is available and not page itself
                    if ( page.activeComponent.events[event.type] !== undefined ) {
                        // there are some listeners
                        page.activeComponent.emit(event.type, event);
                    }
                }
            });
            
            
            /**
             * The click event is fired when a pointing device button (usually a mouse button) is pressed and released on a single element.
             *
             * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/click
             *
             * @param {Event} event generated object with event data
             */
            window.addEventListener('click', function globalEventListenerClick ( event ) {
                console.log(event);
            });
            
            
            /**
             * The contextmenu event is fired when the right button of the mouse is clicked (before the context menu is displayed),
             * or when the context menu key is pressed (in which case the context menu is displayed at the bottom left of the focused
             * element, unless the element is a tree, in which case the context menu is displayed at the bottom left of the current row).
             *
             * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/contextmenu
             *
             * @param {Event} event generated object with event data
             */
            window.addEventListener('contextmenu', function globalEventListenerContextmenu ( event ) {
                var kbEvent = {}; //Object.create(document.createEvent('KeyboardEvent'));
            
                console.log(event);
            
                kbEvent.type    = 'keydown';
                kbEvent.keyCode = 8;
            
                //debug.log(kbEvent.type);
            
                globalEventListenerKeydown(kbEvent);
                //var event = document.createEvent('KeyboardEvent');
                //event.initEvent('keydown', true, true);
            
                //document.dispatchEvent(kbEvent);
            
                //if ( !DEBUG ) {
                // disable right click in release mode
                event.preventDefault();
                //}
            });
            
            
            ///**
            // * The wheel event is fired when a wheel button of a pointing device (usually a mouse) is rotated.
            // * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/wheel
            // */
            //window.addEventListener('wheel', function globalEventListenerWheel ( event ) {
            //    var page = router.current;
            //
            //    debug.event(event);
            //
            //    event.preventDefault();
            //    event.stopPropagation();
            //
            //    // local handler
            //    if ( page ) {
            //        if ( page.activeComponent && page.activeComponent !== page ) {
            //            page.activeComponent.emit(event.type, event);
            //        }
            //
            //        if ( !event.stop ) {
            //            // not prevented
            //            page.emit(event.type, event);
            //        }
            //    }
            //});
            
            
            // public
            module.exports = app;


/***/ },
/* 6 */
/*!***********************!*\
  !*** ./js/lib/dom.js ***!
  \***********************/
/***/ function(module, exports) {

            /**
             * @author DarkPark
             * @license GNU GENERAL PUBLIC LICENSE Version 3
             */
            
            'use strict';
            
            /**
             * DOM manipulation module
             */
            var dom = {};
            
            
            /**
             * Create a new HTML element.
             *
             * @param {string} tagName mandatory tag name
             * @param {Object|null} [attrList] element attributes
             * @param {...*} [content] element content (primitive value/values or other nodes)
             * @return {Node|null} HTML element or null on failure
             *
             * @example
             * dom.tag('table');
             * dom.tag('div', {}, 'some text');
             * dom.tag('div', {className:'top'}, dom.tag('span'), dom.tag('br'));
             * dom.tag('link', {rel:'stylesheet', type:'text/css', href:'http://some.url/'});
             */
            dom.tag = function ( tagName, attrList, content ) {
                var node = null,
                    i, name;
            
                // minimal param is given
                if ( tagName ) {
                    // empty element
                    node = document.createElement(tagName);
            
                    // optional attribute list is given
                    if ( attrList && typeof attrList === 'object' ) {
                        for ( name in attrList ) {
                            // extend a new node with the given attributes
                            node[name] = attrList[name];
                        }
                    }
            
                    // content (arguments except the first two)
                    for ( i = 2; i < arguments.length; i++ ) {
                        // some data is given
                        if ( arguments[i] ) {
                            // regular HTML tag or plain data
                            node.appendChild(
                                typeof arguments[i] === 'object' ?
                                    arguments[i] :
                                    document.createTextNode(arguments[i])
                            );
                        }
                    }
            
                }
            
                return node;
            };
            
            
            /**
             * Create a new DocumentFragment filled with the given non-empty elements if any.
             *
             * @param {...*} [node] fragment content (primitive value/values or other nodes)
             * @return {DocumentFragment} new placeholder
             *
             * @example
             * // gives an empty fragment element
             * dom.fragment();
             * // gives a fragment element with 3 div element inside
             * dom.fragment(dom.tag('div'), div2, div3);
             * // mixed case
             * dom.fragment('some text', 123, div3);
             */
            dom.fragment = function ( node ) {
                // prepare placeholder
                var i, fragment = document.createDocumentFragment();
            
                // walk through all the given elements
                for ( i = 0; i < arguments.length; i++ ) {
                    node = arguments[i];
                    // some data is given
                    if ( node ) {
                        // regular HTML tag or plain data
                        fragment.appendChild(typeof node === 'object' ? node : document.createTextNode(node));
                    }
                }
            
                return fragment;
            };
            
            
            /**
             * Add the given non-empty data (HTML element/text or list) to the destination element.
             *
             * @param {Node} tagDst element to receive children
             * @param {...*} [content] element content (primitive value/values or other nodes)
             * @return {Node|null} the destination element - owner of all added data
             *
             * @example
             * // simple text value
             * add(some_div, 'Hello world');
             * // single DOM Element
             * add(some_div, some_other_div);
             * // DOM Element list
             * add(some_div, div1, div2, div3);
             * // mixed case
             * add(some_div, div1, 'hello', 'world');
             */
            dom.add = function ( tagDst, content ) {
                var i;
            
                // valid HTML tag as the destination
                if ( tagDst instanceof Node ) {
                    // append all except the first one
                    for ( i = 1; i < arguments.length; i++ ) {
                        // some data is given
                        if ( arguments[i] ) {
                            // regular HTML tag or plain data
                            tagDst.appendChild(
                                typeof arguments[i] === 'object' ?
                                    arguments[i] :
                                    document.createTextNode(arguments[i])
                            );
                        }
                    }
                    return tagDst;
                }
            
                return null;
            };
            
            
            /**
             * Remove the given elements from the DOM.
             *
             * @param {...Node} [nodes] element to be removed
             * @return {boolean} operation status (true - all given elements removed)
             *
             * @example
             * dom.remove(document.querySelector('div.test'));
             * dom.remove(div1, div2, div3);
             */
            dom.remove = function ( nodes ) {
                var count = 0,  // amount of successfully removed nodes
                    i;
            
                // walk through all the given elements
                for ( i = 0; i < arguments.length; i++ ) {
                    // valid non-empty tag
                    if ( arguments[i] && arguments[i].parentNode ) {
                        if ( arguments[i].parentNode.removeChild(arguments[i]) === arguments[i] ) {
                            count++;
                        }
                    }
                }
            
                return arguments.length > 0 && count === arguments.length;
            };
            
            
            // public
            module.exports = dom;


/***/ },
/* 7 */
/*!*************************!*\
  !*** ./js/lib/model.js ***!
  \*************************/
/***/ function(module, exports, __webpack_require__) {

            /**
             * @author DarkPark
             * @license GNU GENERAL PUBLIC LICENSE Version 3
             */
            
            'use strict';
            
            var Emitter = __webpack_require__(/*! ./emitter */ 2);
            
            
            /**
             * Base model implementation.
             *
             * Represents domain-specific data or information that an application will be working with.
             * A typical example is a user account (e.g name, avatar, e-mail) or a music track (e.g title, year, album).
             * Holds information, but don’t handle behaviour and don’t format information or influence how data appears.
             *
             * @constructor
             * @extends Emitter
             *
             * @param {Object} [data={}] init attributes
             */
            function Model ( data ) {
                if ( true ) {
                    if ( data !== undefined && typeof data !== 'object' ) { throw 'wrong data type'; }
                }
            
                // parent init
                Emitter.call(this);
            
                /**
                 * Model attributes with given data or empty hash table.
                 *
                 * @member {Object.<string, *>}
                 **/
                this.data = data || {};
            }
            
            
            // inheritance
            Model.prototype = Object.create(Emitter.prototype);
            Model.prototype.constructor = Model;
            
            
            // which of data fields is primary
            Model.prototype.idName = 'id';
            
            
            /**
             * Remove all attributes from the model.
             *
             * @return {boolean} operation status
             *
             * @fires Model#clear
             */
            Model.prototype.clear = function () {
                var data = this.data;
            
                if ( true ) {
                    if ( typeof data !== 'object' ) { throw 'wrong data type'; }
                }
            
                // is there any data?
                if ( Object.keys(data).length > 0 ) {
                    // reset
                    this.data = {};
            
                    // there are some listeners
                    if ( this.events['clear'] !== undefined ) {
                        // notify listeners
                        this.emit('clear', {data: data});
                    }
            
                    return true;
                }
            
                return false;
            };
            
            
            /**
             * Clear and set model data.
             *
             * @param {Object} data attributes
             * @return {boolean} operation status
             *
             * @fires Model#clear
             * @fires Model#init
             */
            Model.prototype.init = function ( data ) {
                if ( true ) {
                    if ( typeof data !== 'object' ) { throw 'wrong data type'; }
                }
            
                // valid input
                if ( data ) {
                    // reset data
                    this.clear();
            
                    // init with given data
                    this.data = data;
            
                    // there are some listeners
                    if ( this.events['init'] !== undefined ) {
                        // notify listeners
                        this.emit('init', {data: data});
                    }
            
                    return true;
                }
            
                return false;
            };
            
            
            /**
             * Check an attribute existence.
             *
             * @param {string} name attribute
             *
             * @return {boolean} attribute exists or not
             */
            Model.prototype.has = function ( name ) {
                if ( true ) {
                    if ( typeof this.data !== 'object' ) { throw 'wrong this.data type'; }
                }
            
                // hasOwnProperty method is not available directly in case of Object.create(null)
                //return Object.hasOwnProperty.call(this.data, name);
                return this.data.hasOwnProperty(name);
            };
            
            /**
             * Get the model attribute by name.
             *
             * @param {string} name attribute
             *
             * @return {*} associated value
             */
            Model.prototype.get = function ( name ) {
                if ( true ) {
                    if ( typeof this.data !== 'object' ) { throw 'wrong this.data type'; }
                }
            
                return this.data[name];
            };
            
            
            /**
             * Update or create a model attribute.
             *
             * @param {string} name attribute
             * @param {*} value associated value
             * @return {boolean} operation status (true - attribute value was changed/created)
             *
             * @fires Model#change
             */
            Model.prototype.set = function ( name, value ) {
                var isAttrSet = name in this.data,
                    emitData  = {name: name, curr: value};
            
                if ( true ) {
                    if ( typeof this.data !== 'object' ) { throw 'wrong this.data type'; }
                }
            
                if ( isAttrSet ) {
                    // update
                    emitData.prev = this.data[name];
                    // only if values are different
                    if ( value !== emitData.prev ) {
                        this.data[name] = value;
            
                        // there are some listeners
                        if ( this.events['change'] !== undefined ) {
                            // notify listeners
                            this.emit('change', emitData);
                        }
            
                        return true;
                    }
                } else {
                    // create
                    this.data[name] = value;
            
                    // there are some listeners
                    if ( this.events['change'] !== undefined ) {
                        // notify listeners
                        this.emit('change', emitData);
                    }
            
                    return true;
                }
            
                return false;
            };
            
            
            /**
             * Delete the given attribute by name.
             *
             * @param {string} name attribute
             * @return {boolean} operation status (true - attribute was deleted)
             *
             * @fires Model#change
             */
            Model.prototype.unset = function ( name ) {
                var isAttrSet = name in this.data,
                    emitData;
            
                if ( true ) {
                    if ( typeof this.data !== 'object' ) { throw 'wrong this.data type'; }
                }
            
                if ( isAttrSet ) {
                    emitData = {name: name, prev: this.data[name]};
                    delete this.data[name];
            
                    // there are some listeners
                    if ( this.events['change'] !== undefined ) {
                        // notify listeners
                        this.emit('change', emitData);
                    }
            
                    return true;
                }
            
                return false;
            };
            
            
            ///**
            // * Prepare all data for sending to a server
            // * @return {Object}
            // */
            //Model.prototype.pack = function () {
            //    return this._data;
            //};
            //
            //
            ///**
            // * Restores the received data from a server to a model data
            // * @param {Object} data
            // * @return {Object}
            // */
            //Model.prototype.unpack = function ( data ) {
            //    return data;
            //};
            //
            //
            ///**
            // * Sync model to a server
            // */
            //Model.prototype.save = function () {
            //    var self = this;
            //
            //    if ( this.url ) {
            //        // collect data
            //        io.ajax(this.url, {
            //            // request params
            //            method: self._data[self.idName] ? 'put' : 'post',
            //            data  : self.pack(),
            //            onload: function( data ) {
            //                data = self.unpack(self.parse(data));
            //                self.attributes(data);
            //                console.log(data);
            //                self.emit('save', true);
            //            },
            //            // error handlers
            //            onerror:   this.saveFailure,
            //            ontimeout: this.saveFailure
            //        });
            //    }
            //};
            //
            //
            ///**
            // * Error handler while model data fetch
            // */
            //Model.prototype.saveFailure = function () {
            //    this.emit('save', false);
            //};
            //
            //
            ///**
            // * Converts received data from a server to a model attributes
            // * @param {String} response
            // * @return {Object}
            // */
            //Model.prototype.parse = function ( response ) {
            //    var data = {};
            //
            //    try {
            //        data = JSON.parse(response).data;
            //    } catch(e){ console.log(e); }
            //    return data;
            //};
            
            
            // public export
            module.exports = Model;


/***/ },
/* 8 */
/*!*****************************!*\
  !*** ./js/lib/ui/button.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

            /**
             * @module stb/ui/button
             * @author DarkPark
             * @license GNU GENERAL PUBLIC LICENSE Version 3
             */
            
            'use strict';
            
            var Component = __webpack_require__(/*! ../component */ 1);
            
            
            /**
             * Base button implementation.
             *
             * @constructor
             * @extends Component
             *
             * @param {Object} [config={}] init parameters (all inherited from the parent)
             * @param {string} [config.value] button caption text (generated if not set)
             * @param {string} [config.icon=false] button icon name
             *
             * @example
             * var Button = require('stb/ui/button'),
             *     button = new Button({
             *         $node: document.getElementById(id),
             *         icon: 'menu'
             *         value: 'Apply changes'
             *     });
             */
            function Button ( config ) {
                // current execution context
                var self = this;
            
                // sanitize
                config = config || {};
            
                // parent init
                Component.call(this, config);
            
                // correct CSS class names
                this.$node.classList.add('button');
            
                // not a custom content
                if ( this.$node === this.$body ) {
                    // so everything should be prepared here
            
                    if ( config.icon ) {
                        if ( true ) {
                            if ( typeof config.icon !== 'string' || config.icon.length === 0 ) { throw 'wrong or empty config.icon'; }
                        }
            
                        // insert icon
                        this.$icon = this.$node.appendChild(document.createElement('div'));
                        this.$icon.className = 'icon ' + config.icon;
                    }
            
                    if ( config.value !== undefined ) {
                        if ( true ) {
                            if ( typeof config.value !== 'string' || config.value.length === 0 ) { throw 'wrong or empty config.value'; }
                        }
            
                        // insert caption placeholder
                        this.$body = this.$node.appendChild(document.createElement('div'));
                        this.$body.classList.add('text');
                        // fill it
                        this.$body.innerText = config.value;
                    }
                }
            
                this.addListener('keydown', function ( event ) {
                    if ( event.code === 13 ) {
                        // there are some listeners
                        if ( self.events['click'] !== undefined ) {
                            /**
                             * Mouse click event emulation.
                             *
                             * @event module:stb/ui/button~Button#click
                             *
                             * @type {Object}
                             * @property {Event} event click event data
                             */
                            self.emit('click', {event: event});
                        }
                    }
                });
            
                this.addListener('click', function () {
                    //console.log(this);
                    self.$node.classList.add('click');
                    setTimeout(function () {
                        self.$node.classList.remove('click');
                    }, 200);
                });
            }
            
            
            // inheritance
            Button.prototype = Object.create(Component.prototype);
            Button.prototype.constructor = Button;
            
            
            // public
            module.exports = Button;


/***/ },
/* 9 */
/*!****************************!*\
  !*** ./js/lib/ui/panel.js ***!
  \****************************/
/***/ function(module, exports, __webpack_require__) {

            /**
             * @module stb/ui/panel
             * @author DarkPark
             * @license GNU GENERAL PUBLIC LICENSE Version 3
             */
            
            'use strict';
            
            var Component = __webpack_require__(/*! ../component */ 1);
            
            
            /**
             * Base panel implementation.
             *
             * @constructor
             * @extends Component
             *
             * @param {Object} [config={}] init parameters (all inherited from the parent)
             *
             * @example
             * var Panel = require('stb/ui/panel'),
             *     panel = new Panel({
             *         $node: document.getElementById('someId'),
             *         children: [
             *             new Panel({
             *                 $node: document.getElementById('anotherId')
             *             })
             *         ]
             *     });
             *
             * panel.add(
             *     new Button(),
             *     new Button(),
             *     new Button()
             * );
             *
             * page.add(panel);
             */
            function Panel ( config ) {
                // sanitize
                config = config || {};
            
                // can't accept focus
                config.focusable = config.focusable || false;
            
                // parent init
                Component.call(this, config);
            
                // correct CSS class names
                this.$node.classList.add('panel');
            }
            
            
            // inheritance
            Panel.prototype = Object.create(Component.prototype);
            Panel.prototype.constructor = Panel;
            
            
            // public
            module.exports = Panel;


/***/ },
/* 10 */
/*!********************!*\
  !*** ./js/main.js ***!
  \********************/
/***/ function(module, exports, __webpack_require__) {

            /**
             * Main application entry point.
             *
             * @author DarkPark
             * @license GNU GENERAL PUBLIC LICENSE Version 3
             */
            
            'use strict';
            
            var app    = __webpack_require__(/*! ./lib/app */ 5),
                router = __webpack_require__(/*! ./lib/router */ 3);
            
            
            app.addListeners({
                // all resources are loaded
                load: function load () {
                    // set pages
                    router.init([
                        __webpack_require__(/*! ./pages/init */ 12),
                        __webpack_require__(/*! ./pages/account */ 11),
                        __webpack_require__(/*! ./pages/main */ 13)
                        //require('./pages/help')
                    ]);
                },
            
                // everything is ready
                done: function done () {
                    // go to the main page
                    router.navigate('pageAccount');
                },
            
                // event
                keydown: function keydown ( event ) {
                    if ( event.code === keys.back ) {
                        router.back();
                    }
                }
            });
            
            
            //var aes    = require('./aes'),
            //    api    = require('./api'),
            //    config = require('./config'),
            //    pages  = require('./pages'),
            //    Notes  = require('./collection.notes.js');
            //
            //
            //// authenticated?
            //if ( config.apiKey ) {
            //    // it appears the user is logged in but validation is required
            //    api.put('sessions/' + config.apiKey, function(err, response){
            //        var pass;
            //        // session is valid
            //        if ( response.code === 1 ) {
            //            console.log('%c%s %o', 'color:green', 'session is valid, last access time:', new Date(response.atime));
            //            pages.list.show();
            //
            //            // apply saved pass salt and hash
            //            aes.salt = localStorage.getItem('config.pass.salt');
            //            aes.hash = localStorage.getItem('config.pass.hash');
            //
            //            // ask a user pass and check it
            //            pass = window.prompt('Provide your password to unlock data', '');
            //            if ( pass && aes.checkPass(pass) ) {
            //                aes.setPass(pass);
            //                console.log('%c%s', 'color:blue', 'pass is valid');
            //
            //                // collect all sessions info
            //                api.get('sessions', function ( err, response ) {
            //                    if ( response.code === 1 ) {
            //                        response.data.forEach(function ( session ) {
            //                            console.log('session', new Date(session.atime), session._id, JSON.parse(aes.decrypt(session.data)));
            //                        });
            //                    }
            //                });
            //
            //                var notes = new Notes();
            //                notes.addListener('fetch', function(status){
            //                    console.log('notes fetch', status);
            //                });
            //                notes.fetch();
            //                console.log(notes);
            //            } else {
            //                console.log('%c%s', 'color:red', 'pass is invalid');
            //                return;
            //            }
            //        } else {
            //            // authentication has expired
            //            pages.auth.show();
            //            console.log('%c%s', 'color:red', 'session is invalid, need to login');
            //            localStorage.clear();
            //            return;
            //        }
            //    });
            //
            //
            //
            //    /*
            //    api.get('sessions/' + config.apiKey, function(err, response){
            //    console.log('current session', response);
            //    console.log('current session data', JSON.parse(aes.decrypt(response.data.data)));
            //    });/**/
            //} else {
            //    pages.auth.show();
            //}
            //
            //localStorage.setItem('debug', 1);
            
            //app.init();
            
            // test data
            //aes.salt = '0fb449e1ae2dc62c11f64a415e66610fa7945ce62033866788db5cc0e2ffb0da';
            //aes.setPass('qwerty');
            


/***/ },
/* 11 */
/*!*****************************!*\
  !*** ./js/pages/account.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

            /**
             * Page to add new user account.
             *
             * @author DarkPark
             * @license GNU GENERAL PUBLIC LICENSE Version 3
             */
            
            'use strict';
            
            var id     = 'pageAccount',
                Page   = __webpack_require__(/*! ../lib/ui/page */ 4),
                Panel  = __webpack_require__(/*! ../lib/ui/panel */ 9),
                Button = __webpack_require__(/*! ../lib/ui/button */ 8),
                page   = new Page({$node: document.getElementById(id)}),
                //wizard = new Panel({
                //    $node: document.getElementById('pageAccountWizard')
                //    //visible: false
                //}),
                step1  = new Panel({
                    $node: document.getElementById('pageAccountStep1'),
                    //visible: false
                    children: [
                        new Button({
                            $node: document.getElementById('pageAccountStep1Next'),
                            //icon: 'menu',
                            value: 'Continue'
                        })
                    ]
                }),
                step2  = new Panel({
                    $node: document.getElementById('pageAccountStep2'),
                    visible: false
                }),
                step3  = new Panel({
                    $node: document.getElementById('pageAccountStep3'),
                    visible: false
                });
            
            
            page.addListener('load', function load () {
                //console.log(wizard);
            });
            
            
            page.addListener('show', function show () {
                // initial active component
                if ( !page.activeComponent ) {
                    //page.menu.focus();
                }
            });
            
            
            // public
            module.exports = page;


/***/ },
/* 12 */
/*!**************************!*\
  !*** ./js/pages/init.js ***!
  \**************************/
/***/ function(module, exports, __webpack_require__) {

            /**
             * Loading page.
             *
             * @author DarkPark
             * @license GNU GENERAL PUBLIC LICENSE Version 3
             */
            
            'use strict';
            
            var id   = 'pageInit',
                Page = __webpack_require__(/*! ../lib/ui/page */ 4),
                page = new Page({$node: document.getElementById(id)});
            
            
            // public
            module.exports = page;


/***/ },
/* 13 */
/*!**************************!*\
  !*** ./js/pages/main.js ***!
  \**************************/
/***/ function(module, exports, __webpack_require__) {

            /**
             * Main page.
             *
             * @author DarkPark
             * @license GNU GENERAL PUBLIC LICENSE Version 3
             */
            
            'use strict';
            
            var id   = 'pageMain',
                //List = require('stb/ui/list'),
                Page = __webpack_require__(/*! ../lib/ui/page */ 4),
                page = new Page({$node: document.getElementById(id)});
            
            
            page.addListener('load', function load () {
                //var menuData = [
                //        {
                //            value: 'Panel',
                //            panel: require('../tabs/main.panel')
                //        },
                //        {
                //            value: 'Button',
                //            panel: require('../tabs/main.button')
                //        },
                //        {
                //            value: 'Input',
                //            panel: require('../tabs/main.input')
                //        },
                //        {
                //            value: 'CheckBox',
                //            panel: require('../tabs/main.check.box')
                //        },
                //        {
                //            value: 'Grid',
                //            panel: require('../tabs/main.grid')
                //        },
                //        {
                //            value: 'List',
                //            panel: require('../tabs/main.list')
                //        },
                //        {
                //            value: 'ProgressBar',
                //            panel: require('../tabs/main.progress.bar')
                //        },
                //        {
                //            value: 'Page',
                //            panel: require('../tabs/main.page')
                //        },
                //        {
                //            value: 'Modal',
                //            panel: require('../tabs/main.modal')
                //        },
                //        {
                //            value: 'Widget',
                //            panel: require('../tabs/main.widget')
                //        }
                //    ];
                //
                //// attach to page
                //menuData.forEach(function ( item ) {
                //    page.add(item.panel);
                //});
                //
                //page.add(
                //    page.menu = new List({
                //        $node: document.getElementById('pageMainMenu'),
                //        data: menuData,
                //        focusIndex: 0,
                //        size: 10,
                //        cycle: true,
                //        render: function ( $item, data ) {
                //            $item.textContent = data.value;
                //        },
                //        events: {
                //            /*click: function ( data ) {
                //                //console.log('click');
                //                //data.event.stop = true;
                //                //debug.inspect(data, 1);
                //            },
                //            focus: function ( data ) {
                //                //console.log('focus');
                //                //debug.inspect(data, 1);
                //            },
                //            'click:item': function ( data ) {
                //                //console.log('click:item');
                //                //debug.inspect(data, 1);
                //            },*/
                //            'focus:item': function ( data ) {
                //                //console.log('focus:item');
                //                //debug.inspect(data, 1);
                //                if ( data.$prev ) {
                //                    data.$prev.data.panel.hide();
                //                }
                //                data.$curr.data.panel.show();
                //            }
                //            /*'blur:item': function ( data ) {
                //                //console.log('blur:item');
                //                //debug.inspect(data, 1);
                //            }*/
                //        }
                //    })
                //    //page.body = new Panel({$node: document.getElementById('pageMainBody')})
                //);
                //
                //page.focusable = false;
                //page.addListener('click', function ( data ) {
                //    data.event.stop = true;
                //});
            });
            
            
            page.addListener('show', function show () {
                // initial active component
                if ( !page.activeComponent ) {
                    //page.menu.focus();
                }
            });
            
            
            // public
            module.exports = page;


/***/ }
/******/ ]);
//# sourceMappingURL=develop.js.map
