/**
 * Main application entry point.
 */

'use strict';

var app     = require('spa-app'),
    gettext = require('spa-gettext'),
    parse   = require('cjs-query').parse;


// setup environment
app.language = localStorage.getItem('language') || 'en';

// url request params
app.query = parse(document.location.search.substring(1));

app.users = [];

// load localization
gettext.load({name: app.language}, function () {
    // load all pages
    var pages = app.pages = {
        profile: require('./pages/profile/'),
        user:    require('./pages/user/'),
        main:    require('./pages/main'),
        report:  require('./pages/report')
    };

    pages.profile.addListeners({
        switch: function () {
            // a profile should be selected
            pages.profile.show();
        },
        ready: function ( profile ) {
            // profile is loaded
            app.profile = profile;
            // navigate
            pages.user.show(profile);
        }
    });

    pages.user.addListeners({
        ready: function () {
            // fill main page
            pages.main.init(function () {
                // navigate
                pages.main.show();
            });
        }
    });

    // add to DOM
    document.body.appendChild(pages.profile.$node);
    document.body.appendChild(pages.user.$node);
    document.body.appendChild(pages.main.$node);
    document.body.appendChild(pages.report.$node);

    // global events
    app.addListeners({
        // show send error report page
        error: function ( data ) {
            console.log('app:error', data);
            pages.report.show(data);
        }
    });

    pages.profile.init();

    document.body.classList.remove('loading');
});
