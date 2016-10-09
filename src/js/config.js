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
