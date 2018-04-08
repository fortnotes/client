/**
 * @license The MIT License (MIT)
 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
 */

'use strict';

var Emitter  = require('cjs-emitter');


const NAME_SIZE = 12;


/**
 *
 *
 * @constructor
 * @extends Emitter
 *
 * @param {string} [id] db storage name
 * @param {Object} [data] profile information
 * @param {string} [data.name] profile general name
 * @param {string} [data.time] profile creation time
 *
 * @fires Profile#ready
 */
function Profile ( id, data ) {
    var self = this;

    // parent constructor call
    Emitter.call(this);

    // sanitize
    data = data || {};

    this.id = id || btoa(String.fromCharCode.apply(null, crypto.getRandomValues(new Uint8Array(NAME_SIZE))));
    this.name = data.name || 'default';
    this.time = data.time || Date.now();

    require('./db')({name: this.id}, function ( error, db ) {
        error && console.error(error);

        self.db = db;

        /**
         * @event Profile#ready
         */
        self.emit('ready');
    });
}


// inheritance
Profile.prototype = Object.create(Emitter.prototype);
Profile.prototype.constructor = Profile;


// public
module.exports = Profile;
