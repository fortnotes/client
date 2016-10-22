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
    },

    // Web Cryptography API options
    crypto: {
        // to importKey and deriveKey
        kdfKey: {
            name: 'PBKDF2',
            hash: 'SHA-256',
            iterations: 1000
        },
        // to deriveKey and encrypt/decrypt
        aesKey: {
            name: 'AES-GCM',
            length: 256
        }
    }
};
