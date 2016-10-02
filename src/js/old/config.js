/**
 * Global application configuration.
 * Can store run-time options, API urls, paths, execution flags and so on.
 * Automatically loaded on application initialization and available as app.config.
 */

'use strict';

// public export
module.exports = {
    // app work mode
    debug: Boolean(localStorage.getItem('debug')),

    // all api requests address
    apiUrl: '/api/v1/',

    // base64 encoded 64 bytes string issued on session creation
    apiKey: localStorage.getItem('config.auth.key'),

    // default encrypt/decrypt parameters (rewritten by user individual options)
    sjcl: JSON.parse(localStorage.getItem('config.sjcl')) || {
        v:      1,
        iter:   1000,
        ks:     256,
        ts:     128,
        mode:   'ccm',
        adata:  '',
        cipher: 'aes'
    }
};
