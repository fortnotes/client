/**
 * Main application entry point.
 */

'use strict';

var app  = require('spa-app'),
    Wamp = require('spa-wamp');

app.nodes = JSON.parse(localStorage.getItem('nodes')) || [];

app.nodeId = localStorage.getItem('nodeId');
if ( !app.nodeId ) {
    (function () {
        var array = new Uint8Array(32),
            id    = [];

        window.crypto.getRandomValues(array);

        console.log(array);
        array.forEach(function ( item ) {
            item = item.toString(16);
            if ( item.length === 1 ) {
                item = '0' + item;
            }
            id.push(item);
        });

        console.log('generate nodeId');
        localStorage.setItem('nodeId', app.nodeId = id.join(''));
    })();
}
debug.info('nodeId: ' + app.nodeId);
window.nodeId.innerText = 'nodeId: ' + app.nodeId;

app.wamp = new Wamp(
    'ws://' + (app.query.wampHost || location.hostname) + ':8090/' +  app.nodeId
);

app.wamp.onopen = function () {
    var time = Date.now();

    debug.info('wamp open ' + app.wamp.socket.url, null, {tags: ['open', 'wamp']});

    window.nodeId.classList.add('online');

    app.wamp.call('ping', {}, function ( error, result ) {
        console.log(error, result, Date.now() - time);
    });
};

app.wamp.onclose = function () {
    debug.info('wamp close ' + app.wamp.socket.url, null, {tags: ['close', 'wamp']});

    window.nodeId.classList.remove('online');
};


// DOM is ready
//app.once('dom', function () {

// load pages
app.pages = {
    //init: require('./pages/init'),
    main: require('./pages/main')
};

// show splash screen
app.route(app.pages.main);

//});


// everything is ready
app.once('load', function () {
    // show main page
    //app.route(app.pages.main);
});
