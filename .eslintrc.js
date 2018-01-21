/**
 * Eslint config.
 */

'use strict';

// public
module.exports = {
    // base rules
    extends: require.resolve('spa-eslint-config/.eslintrc.js'),

    env: {
        browser: true,
        es6: true,
        node: true
    },

    globals: {
        _: false
    }
};
