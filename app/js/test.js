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
/*!********************!*\
  !*** ./js/test.js ***!
  \********************/
/***/ function(module, exports, __webpack_require__) {

            'use strict';
            
            //var Emitter = require('emitter');
            var Model = __webpack_require__(/*! model */ 2);


/***/ },
/* 1 */
/*!****************************!*\
  !*** ./~/emitter/index.js ***!
  \****************************/
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
/* 2 */
/*!**************************!*\
  !*** ./~/model/index.js ***!
  \**************************/
/***/ function(module, exports, __webpack_require__) {

            /**
             * @author DarkPark
             * @license GNU GENERAL PUBLIC LICENSE Version 3
             */
            
            'use strict';
            
            var Emitter = __webpack_require__(/*! emitter */ 1);
            
            
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


/***/ }
/******/ ]);
//# sourceMappingURL=test.js.map
