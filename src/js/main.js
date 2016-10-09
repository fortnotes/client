/**
 * Main application entry point.
 */

'use strict';

var app   = require('spa-app'),
    Wamp  = require('spa-wamp'),
    nodes = require('./modules/nodes');


// load and show splash page
app.route(require('./pages/init'));


app.nodes = {};


(JSON.parse(localStorage.getItem('nodes')) || []).map(function ( node ) {
    console.log('found node: ' + node);
    app.nodes[node] = null;
    nodes.add(node);
});

app.nodeId = localStorage.getItem('nodeId');
if ( !app.nodeId ) {
    (function () {
        var array = new Uint8Array(app.config.nodeIdSize),
            id    = [];

        window.crypto.getRandomValues(array);

        array.forEach(function ( item, index ) {
            item = item.toString(16);
            if ( item.length === 1 ) {
                item = '0' + item;
            }
            if ( index && index % 2 === 0 ) {
                id.push(':');
            }
            id.push(item);
        });

        localStorage.setItem('nodeId', app.nodeId = id.join(''));
        console.log('generate nodeId: ' + app.nodeId);
    })();
}

app.nodeKey = localStorage.getItem('nodeKey');
if ( !app.nodeKey ) {
    (function () {
        var array = new Uint8Array(app.config.nodeKeySize),
            id    = [];

        window.crypto.getRandomValues(array);

        array.forEach(function ( item ) {
            item = item.toString(16);
            if ( item.length === 1 ) {
                item = '0' + item;
            }
            id.push(item);
        });

        localStorage.setItem('nodeKey', app.nodeKey = id.join(''));
        console.log('generate nodeKey: ' + app.nodeKey);
    })();
}

app.nodeName = localStorage.getItem('nodeName');
if ( !app.nodeName ) {
    (function () {
        var name = prompt('Please enter this node name, e.g., phone or tablet.') || 'new node';

        localStorage.setItem('nodeName', app.nodeName = name);
    })();
}

//debug.info('nodeId: ' + app.nodeId);
//debug.info('nodeName: ' + app.nodeName);
//window.nodeId.innerHTML = '<b>server</b>: <a>wss.fortnotes.com</a> &nbsp; <b>node id</b>: ' + app.nodeId + ' &nbsp; <b>name</b>: ' + app.nodeName;


var time = Date.now();
app.wamp = new Wamp(
    'ws://' + (app.query.wampHost || location.hostname) + ':8090/' +  app.nodeId
);

app.wamp.onopen = function () {
    console.log('%cwamp connection: open', 'color:green');
    debug.info('wamp open ' + app.wamp.socket.url, null, {tags: ['open', 'wamp']});

    // app.wamp.call('ping', {}, function ( error, result ) {
    //     console.log('wamp ping: %s in %sms', result, Date.now() - time);
    // });

    app.wamp.call('auth', {key: app.nodeKey}, function ( error, result ) {
        if ( !error ) {
            // notify
            app.emit('wamp:open');
            console.log('wamp auth: %s in %sms', result, Date.now() - time);

            if ( !result ) {
                app.emit('wamp:auth:error');
            }
        }
    });
};

app.wamp.onclose = function () {
    // notify
    app.emit('wamp:close');

    console.log('%cwamp connection: close', 'color:red');
    debug.info('wamp close ' + app.wamp.socket.url, null, {tags: ['close', 'wamp']});
};


// DOM is ready
//app.once('dom', function () {

// load pages
// app.pages = {
//     init: require('./pages/init'),
//     main: require('./pages/main')
// };

// setTimeout(function () {
//
// }, 500);

// load main page
require('./pages/main');


//});


// everything is ready
//app.once('load', function () {
    // show main page
    //app.route(app.pages.main);
//});
