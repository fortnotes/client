/**
 * Main page implementation.
 */

'use strict';

var app    = require('spa-app'),
    Button = require('spa-component-button'),
    List   = require('spa-component-list'),
    Page   = require('spa-component-page'),
    rtc    = require('../modules/rtc'),
    NodeList = require('./../modules/node.list'),
    page   = new Page({$node: window.pageMain}),
    peer;


function addNodeId ( id, peer ) {
    app.nodes[id] = app.nodes[id] || {};
    app.nodes[id] = {peer: peer};

    //if ( id && !app.nodes[id] ) {
    localStorage.setItem('nodes', JSON.stringify(Object.keys(app.nodes)));
    //}
}

function connectNode ( id ) {
    var peer = rtc.Offerer.createOffer(function ( sdp ) {
        app.wamp.call('connect', {id: id, sdp: sdp}, function ( error, result ) {
            //console.log(error, result);
            if ( error ) {
                console.log('was not able to connect to ', id);
            } else {
                peer.setRemoteDescription(result);
                addNodeId(id, peer);
            }
        });
    });

    peer.peer.onicecandidate = function ( event ) {
        if ( event.candidate ) {
            //socket.send(JSON.stringify(event.candidate));
            app.wamp.call('ice', {id: id, candidate: event.candidate});
        }
    };
}


app.wamp.addListener('connect', function ( params, callback ) {
    var peer;

    if ( app.nodes[params.id] || confirm('Do you want to add new node with id ' + params.id) ) {
        peer = rtc.Answerer.createAnswer(params.sdp, function ( sdp ) {
            // send back results to the sender
            callback(null, sdp);

            addNodeId(params.id, peer);

            peer.peer.onicecandidate = function ( event ) {
                if ( event.candidate ) {
                    //socket.send(JSON.stringify(event.candidate));
                    app.wamp.call('ice', {id: params.id, candidate: event.candidate});
                }
            };
        });
    }
});

app.wamp.addListener('ice', function ( params ) {
    //console.log(params);
    if ( app.nodes[params.id] && app.nodes[params.id].peer ) {
        app.nodes[params.id].peer.addIceCandidate(params.candidate);
    }
});

// page.add(
//     page.nodeList = new List({
//         $node: window.pmNodeList,
//         data: app.nodes.slice()
//         //parent: this,
//         //wamp: this.wamp
//     })
// );

page.add(new Button({
    $node: window.pmBtnDisconnect,
    value: 'Disconnect',
    events: {
        click: function () {
            window.nodeId.classList.remove('online');
            app.wamp.socket.onclose = null;
            app.wamp.socket.close();
        }
    }
}));

page.add(new Button({
    $node: window.pmBtnRemoveNodes,
    value: 'Remove nodes',
    events: {
        click: function () {
            localStorage.setItem('nodes', '[]');
            console.log('all nodes are removed!');
        }
    }
}));

page.add(new Button({
    $node: window.pmBtnAddNode,
    value: 'Add node',
    events: {
        click: function () {
            var id = prompt('Please enter the node id to link with.');

            if ( id ) {
                connectNode(id);
            }
        }
    }
}));


setTimeout(function () {
    Object.keys(app.nodes).forEach(function ( id ) {
        //page.nodeList.add({data: id});
        connectNode(id);
    });
}, Math.floor(Math.random() * 1000));


// public
module.exports = page;
