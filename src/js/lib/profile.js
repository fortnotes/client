/**
 * @license The MIT License (MIT)
 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
 */

'use strict';

var Emitter = require('cjs-emitter'),
    Aes     = require('./aes');


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
    this.options = {};

    require('./db')({name: this.id}, function ( error, db ) {
        error && console.error(error);

        self.db = db;

        db.getAll('options', function ( error, options ) {
            error && console.error(error);

            options.forEach(function ( option ) {
                self.options[option.id] = option;
            });

            /**
             * @event Profile#ready
             */
            self.emit('ready');
        });
    });
}


// inheritance
Profile.prototype = Object.create(Emitter.prototype);
Profile.prototype.constructor = Profile;


Profile.prototype.addUser = function ( config, callback ) {
    var self = this,
        aes  = new Aes();

    // expose
    this.aes = aes;

    aes.setPass(config.pass, {}, function ( error, kdfData ) {
        error && console.error(error);

        aes.generateKey(function ( error ) {
            error && console.error(error);

            aes.exportKey(function ( error, key ) {
                error && console.error(error);
                console.log(key);

                aes.encryptObject({name: config.user}, function ( error, userData ) {
                    error && console.error(error);

                    (function () {
                        var tx      = self.db.handle.transaction(['users', 'options'], 'readwrite'),
                            users   = tx.objectStore('users'),
                            options = tx.objectStore('options'),
                            time    = Date.now(),
                            user    = {
                                time: time,
                                key: {
                                    kdf: kdfData,
                                    data: key
                                },
                                data: userData
                            },
                            option  = {id: 'userId', time: time};

                        users.add(user).onsuccess = function ( event ) {
                            //console.log(event);
                            option.value = event.target.result;
                            options.put(self.options[option.id] = option);
                        };

                        tx.oncomplete = function () {
                            callback(null);
                        };
                    })();
                });
            });
        });
    });
};


Profile.prototype.unlockUser = function ( pass, callback ) {
    var self = this,
        aes  = new Aes();

    this.db.getById('users', this.options.userId.value, function ( error, user ) {
        error && console.error(error);

        console.log(user);
        self.user = user;
        self.aes  = aes;

        aes.setPass(pass, user.key.kdf, function ( error ) {
            error && console.error(error);

            aes.importKey(user.key.data, function ( error ) {
                error && console.error(error);

                aes.decryptObject(user.data, function ( error, userData ) {
                    error && console.error(error);

                    user.data = userData;

                    callback(error);
                });
            });
        });
    });
};


// public
module.exports = Profile;
