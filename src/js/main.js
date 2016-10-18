/**
 * Main application entry point.
 */

'use strict';

var app      = require('spa-app'),
    Wamp     = require('spa-wamp'),
    Crypto   = require('./modules/crypto'),
    encoding = require('./modules/encoding'),
    nodes    = require('./modules/nodes');


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

app.wssHost = localStorage.getItem('wssHost');
if ( !app.wssHost ) {
    (function () {
        localStorage.setItem('wssHost', app.wssHost = app.query.wampHost || location.hostname);
    })();
}

app.wssPort = localStorage.getItem('wssPort');
if ( !app.wssPort ) {
    (function () {
        localStorage.setItem('wssPort', app.wssPort = 9090);
    })();
}

app.pass = localStorage.getItem('pass');
if ( !app.pass ) {
    (function () {
        var pass = prompt('Please enter master password to store. DEVELOPMENT ONLY!') || 'qwerty';

        localStorage.setItem('pass', app.pass = pass);
    })();
}

app.passSalt = localStorage.getItem('passSalt');
if ( app.passSalt ) {
    app.passSalt = encoding.base64ToBuffer(app.passSalt);
} else {
    (function () {
        var array = new Uint8Array(32);

        window.crypto.getRandomValues(array);
        app.passSalt = array;

        localStorage.setItem('passSalt', encoding.bufferToBase64(array));
        //console.log('generate passSalt: ' + app.passSalt);
    })();
}

app.config.crypto.kdfKey.salt = app.passSalt;

app.crypto = new Crypto({
    //pass: app.pass,
    kdfKey: app.config.crypto.kdfKey,
    aesKey: app.config.crypto.aesKey
});

app.crypto.setPass(app.pass, function () {
    app.emit('crypto:open');

    app.crypto.encrypt('I♥☢𝄢. I\'m a ☢ ☃ that plays 𝄢 guitar and spea̧͈͖ks Ar̽̾̈́͒͑ ̶̧̨̱̹̭̯ͧ̾ͬC̷̙̲̝͖ͭ̏ͥͮ͟Oͮ͏̮̪̝͍M̲̖͊̒ͪͩͬ̚̚͜!', function ( error, data ) {
        console.log(error, data);
    });
});

// app.crypto.decrypt('{"ea":"AES-CBC","it":1000,"ks":256,"iv":"LDeGpkSn2KwsGNqSyrFG0g==","em":"fTeck53p7x+dK5csONxicQ=="}', function ( e, d ) {
//     console.log(e, d);
// });

//debug.info('nodeId: ' + app.nodeId);
//debug.info('nodeName: ' + app.nodeName);
//window.nodeId.innerHTML = '<b>server</b>: <a>wss.fortnotes.com</a> &nbsp; <b>node id</b>: ' + app.nodeId + ' &nbsp; <b>name</b>: ' + app.nodeName;


var time = Date.now();
app.wamp = new Wamp(
    'ws://' + app.wssHost + ':' + app.wssPort + '/' +  app.nodeId
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
