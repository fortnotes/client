/**
 * @license The MIT License (MIT)
 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
 */

'use strict';

var encoding  = require('./encoding'),
    buf2b64   = encoding.bufferToBase64,
    b642buf   = encoding.base64ToBuffer,
    utf2buf   = encoding.utf8ToBuffer,
    buf2utf   = encoding.bufferToUtf8,
    aesParams = {
        name: 'AES-GCM',
        length: 256
    };


function Aes () {
    var rootKey, userKey;


    // {salt: 'kCRvxYAc4AwhC0k9', iterations: 100000}
    // salt and iterations are optional (will be generated if not provided)
    this.setPass = function ( pass, config, callback ) {
        var iterations = 1000000,
            kdfParams  = {
                name: 'PBKDF2',
                hash: {
                    name: 'SHA-384'
                }
            };

        if ( config.salt ) {
            // salt provided
            kdfParams.salt = b642buf(config.salt);
        } else {
            // salt generated and exported as base64
            kdfParams.salt = window.crypto.getRandomValues(new Uint8Array(16));
            config.salt = buf2b64(kdfParams.salt);
        }

        if ( config.iterations ) {
            // provided
            kdfParams.iterations = config.iterations;
        } else {
            // generated and exported
            kdfParams.iterations = config.iterations = iterations + Math.floor(Math.random() * iterations / 10);
        }

        crypto.subtle.importKey(
            'raw',
            utf2buf(pass),
            {name: kdfParams.name},
            false,
            ['deriveKey']
        ).then(function ( key ) {
            return crypto.subtle.deriveKey(
                kdfParams,
                key,
                aesParams,
                false,
                ['encrypt', 'decrypt']
            );
        }).then(function ( key ) {
            //console.log('userKey', userKey);
            userKey = key;
            callback(null, config);
        }).catch(callback);
    };


    // new key
    this.generateKey = function ( callback ) {
        crypto.subtle.generateKey(
            aesParams,
            true,
            ['encrypt', 'decrypt']
        ).then(function ( key ) {
            //console.log('rootKey', rootKey);
            rootKey = key;
            callback(null);
        }).catch(callback);
    };


    // export rootKey and encrypt it by userKey
    this.exportKey = function ( callback ) {
        crypto.subtle.exportKey('raw', rootKey).then(function ( key ) {
            //console.log('export key', key);
            Aes.prototype.encrypt(userKey, key, callback);
        }).catch(callback);
    };


    // apply encrypted rootKey
    this.importKey = function ( data, callback ) {
        // get raw key data
        Aes.prototype.decrypt(userKey, data, function ( error, data ) {
            error && console.error(error);

            crypto.subtle.importKey(
                'raw',
                data,
                aesParams,
                false,
                ['encrypt', 'decrypt']
            ).then(function ( key ) {
                console.log(key);
                rootKey = key;
                callback(null);
            }).catch(callback);
        });
    };


    this.encrypt = function ( data, callback ) {
        Aes.prototype.encrypt(rootKey, data, callback);
    };


    this.decrypt = function ( data, callback ) {
        Aes.prototype.decrypt(rootKey, data, callback);
    };


    this.encryptString = function ( data, callback ) {
        Aes.prototype.encrypt(rootKey, utf2buf(data), callback);
    };


    this.decryptString = function ( data, callback ) {
        Aes.prototype.decrypt(rootKey, data, function ( error, data ) {
            callback(error, data && buf2utf(data));
        });
    };


    this.encryptObject = function ( data, callback ) {
        Aes.prototype.encrypt(rootKey, utf2buf(JSON.stringify(data)), callback);
    };


    this.decryptObject = function ( data, callback ) {
        Aes.prototype.decrypt(rootKey, data, function ( error, data ) {
            callback(error, data && JSON.parse(buf2utf(data)));
        });
    };
}


// correct constructor name
Aes.prototype.constructor = Aes;


Aes.prototype.encrypt = function ( key, data, callback ) {
    var iv = crypto.getRandomValues(new Uint8Array(12));

    crypto.subtle.encrypt(
        {name: aesParams.name, iv: iv},
        key,
        data
    ).then(function ( data ) {
        callback(null, {
            iv: buf2b64(iv),
            em: buf2b64(new Uint8Array(data))
        });
    }).catch(callback);
};


Aes.prototype.decrypt = function ( key, data, callback ) {
    crypto.subtle.decrypt(
        {name: aesParams.name, iv: b642buf(data.iv)},
        key,
        b642buf(data.em)
    ).then(function ( data ) {
        callback(null, data);
    }).catch(callback);
};


// public
module.exports = Aes;
