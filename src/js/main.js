/**
 * Main application entry point.
 */

'use strict';

var app = require('spa-app');


// DOM is ready
app.once('dom', function () {
    // load pages
    app.pages = {
        init: require('./pages/init'),
        main: require('./pages/main')
    };

    // show splash screen
    app.route(app.pages.init);
});


// everything is ready
app.once('load', function () {
    // show main page
    app.route(app.pages.main);
});
