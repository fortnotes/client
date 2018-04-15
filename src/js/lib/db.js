/**
 * @license The MIT License (MIT)
 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
 */

'use strict';

// public
module.exports = function ( config, callback ) {
    var request = indexedDB.open(config.name, config.version);

    request.onupgradeneeded = function ( event ) {
        var db = request.result,
            store;

        console.log('db:onupgradeneeded', event);

        if ( event.oldVersion < 1 ) {
            // version 1 is the first initial version of the database

            //db.createObjectStore('options', {keyPath: 'name'});
            //db.createObjectStore('options', {keyPath: 'id', autoIncrement: true});
            store = db.createObjectStore('options', {keyPath: 'id', autoIncrement: true});
            //store.createIndex('hash', 'hash');

            // id, keyId, iv, em
            //db.createObjectStore('data', {keyPath: 'id', autoIncrement: true});

            // id, nodeId, dataId, name, config
            store = db.createObjectStore('users', {keyPath: 'id', autoIncrement: true});
            //store.createIndex('name', 'name', {unique: true});

            // id, dataId
            store = db.createObjectStore('devices', {keyPath: 'id', autoIncrement: true});
            //store.createIndex('userId', 'userId');

            //store = db.createObjectStore('profiles', {keyPath: 'id', autoIncrement: true});
            //store.createIndex('name', 'name', {unique: true});

            // id, userId, dataId
            store = db.createObjectStore('notes', {keyPath: 'id', autoIncrement: true});
            //store.createIndex('userId', 'userId');

            // id, userId, dataId
            //store = db.createObjectStore('keys', {keyPath: 'id', autoIncrement: true});
            // store.createIndex('userId', 'userId');

            // for ( i = 0; i < n; i++ ) {
            //     store.add({hash: 'X+zrZv/IbzjZUnhsbWlsecLbwjndTpG0ZynXOif7V+k' + i, time: new Date(), index: i, algo: 'SHA-256 base64'});
            // //     window.crypto.subtle.digest({name: 'SHA-256'}, encoding.utf8ToBuffer(i)).then(function ( hash ) {
            // //         store.add({hash: encoding.bufferToBase64(new Uint8Array(hash)), time: new Date(), index: i, algo: 'SHA-256 base64'});
            // //     });
            // }
        }
    };

    request.onerror = function () {
        //app.emit('error', request);
        callback(request);
    };

    request.onsuccess = function () {
        var db = request.result;

        callback(null, {
            handle: db,

            getById: function ( store, id, callback ) {
                var request = db.transaction(store).objectStore(store).get(id);

                request.onerror = function ( event ) {
                    callback(event);
                };

                request.onsuccess = function ( event ) {
                    callback(null, event.target.result);
                };
            },

            getAll: function ( store, callback ) {
                var cursor = db.transaction(store).objectStore(store).openCursor(),
                    data   = [];

                cursor.onerror = callback;

                cursor.onsuccess = function ( event ) {
                    var cursor = event.target.result;

                    if ( cursor ) {
                        data.push(cursor.value);
                        cursor.continue();
                    } else {
                        callback(null, data);
                    }
                };
            }
        });
    };
};
