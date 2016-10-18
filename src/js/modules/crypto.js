/**
 * @license The MIT License (MIT)
 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
 */

'use strict';

var encoding = require('./encoding'),
    buf2b64  = encoding.bufferToBase64,
    b642buf  = encoding.base64ToBuffer,
    utf2buf  = encoding.utf8ToBuffer,
    buf2utf  = encoding.bufferToUtf8;


function Crypto ( config ) {
    /* @type {CryptoKey} */
    this.key = null;

    // global app options
    this.config = config;
}


// correct constructor name
Crypto.prototype.constructor = Crypto;


/**
 * Set the private pass.
 *
 * @param {string} pass password to set
 * @param {function} done callback
 */
Crypto.prototype.setPass = function ( pass, done ) {
    var self = this;

    crypto.subtle.importKey('raw', utf2buf(pass), {name: this.config.kdfKey.name}, false, ['deriveKey'])
        .then(function ( key ) {
            return crypto.subtle.deriveKey(self.config.kdfKey, key, self.config.aesKey, false, ['encrypt', 'decrypt']);
        })
        .then(function ( key ) {
            self.key = key;

            //self.emit('ready');
            done(null);

            return key;
        })
        .catch(function ( error ) {
            console.log('Key derivation failed: ' + error.message);
            done(error);
        });
};


Crypto.prototype.encrypt = function ( data, done ) {
    var self = this,
        time = Date.now(),
        iv   = new Uint8Array(16);

    crypto.getRandomValues(iv);

    crypto.subtle.encrypt({name: this.config.aesKey.name, iv: iv}, this.key, utf2buf(data))
        .then(function ( data ) {
            console.log('encrypt time: %sms', Date.now() - time);

            done(null, JSON.stringify({
                ea: self.config.aesKey.name,
                it: self.config.kdfKey.iterations,
                ks: self.config.aesKey.length,
                iv: buf2b64(iv),
                em: buf2b64(new Uint8Array(data))
            }));
        })
        .catch(function ( error ) {
            done(error);
        });
};


Crypto.prototype.decrypt = function ( data, done ) {
    var time = Date.now();

    try {
        // restore
        data = JSON.parse(data);

        // process
        crypto.subtle.decrypt({name: this.config.aesKey.name, iv: b642buf(data.iv)}, this.key, b642buf(data.em))
            .then(function ( data ) {
                console.log('decrypt time: %sms', Date.now() - time);

                done(null, buf2utf(new Uint8Array(data)));
            })
            .catch(function ( error ) {
                done(error);
            });
    } catch ( error ) {
        done(error);
    }
};


// public
module.exports = Crypto;
