/**
 * @license The MIT License (MIT)
 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
 */

'use strict';

var Emitter = require('cjs-emitter'),
    Wamp    = require('cjs-wamp'),
    RTCPeerConnection     = window.RTCPeerConnection     || window.mozRTCPeerConnection || window.webkitRTCPeerConnection,
    RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription,
    RTCIceCandidate       = window.RTCIceCandidate       || window.mozRTCIceCandidate;


function errorHandler ( error ) {
    console.log('error');
    console.log(error);
}


/**
 * @param {Object} [config={}] init parameters
 * @param {number} config.id node id
 * @param {RTCConfiguration} config.rtp connection config
 *
 * @constructor
 */
function Node ( config ) {
    config = config || {};

    // parent constructor call
    Emitter.call(this);

    this.id = config.id;

    this.pc = new RTCPeerConnection(config.rtp);
}


// inheritance
Node.prototype = Object.create(Emitter.prototype);
Node.prototype.constructor = Node;


Node.prototype.createOffer = function ( callback ) {
    var self = this;

    this.pc.onsignalingstatechange = function () {
        console.log('%s: signaling state change - %s', self.id, self.pc.signalingState);
    };

    this.pc.oniceconnectionstatechange = function () {
        console.log('%s: ice connection state change - %s', self.id, self.pc.iceConnectionState);
    };

    /*this.pc.onconnectionstatechange = function () {
        console.log('%s: offer connection state change - %s', self.id, self.pc.connectionState);
    };*/

    // let the event trigger offer generation
    this.pc.onnegotiationneeded = function () {
        console.log('negotiation needed');

        self.pc.createOffer()
            .then(function ( sdp ) {
                console.log('%s: create offer', self.id);

                return self.pc.setLocalDescription(sdp);
            })
            .then(function () {
                // send the offer to the other peer
                callback(self.pc.localDescription);
            })
            .catch(errorHandler);

        // self.pc.createOffer(function ( sdp ) {
        //     console.log('%s: create offer', self.id);
        //     self.pc.setLocalDescription(sdp);
        //     callback(sdp);
        // }, errorHandler);
    };

    this.dc   = this.pc.createDataChannel('main');
    this.wamp = self.setDataChannel(this.dc);

    // peer.onicecandidate = function ( event ) {
    //     if ( event.candidate ) {
    //         socket.send(JSON.stringify(event.candidate));
    //         //window.iceCandidates.value += JSON.stringify(event.candidate) + '\n';
    //     }
    // };
};


Node.prototype.createAnswer = function ( sdp, callback ) {
    var self = this;

    this.pc.ondatachannel = function ( event ) {
        self.dc   = event.channel;
        self.wamp = self.setDataChannel(self.dc);
    };

    this.pc.onsignalingstatechange = function () {
        console.log('%s: signaling state change - %s', self.id, self.pc.signalingState);
    };

    this.pc.oniceconnectionstatechange = function () {
        console.log('%s: ice connection state change - %s', self.id, self.pc.iceConnectionState);
    };

    /*this.pc.onnegotiationneeded = function ( event ) {
     console.log('Answerer: negotiation needed', event);
     };*/

    // answererDataChannel = this.pc.createDataChannel('channel', {reliable: true});
    // setChannelEvents(answererDataChannel);

    // this.pc.ondatachannel = function ( event ) {
    //     answererDataChannel = event.channel;
    //     setChannelEvents(answererDataChannel);
    // };

    // this.pc.onicecandidate = function ( event ) {
    //     if ( event.candidate ) {
    //         //window.iceCandidates.value += JSON.stringify(event.candidate) + '\n';
    //         socket.send(JSON.stringify(event.candidate));
    //     }
    // };

    this.pc.setRemoteDescription(new RTCSessionDescription(sdp), function () {
        console.log('%s: accept offer', self.id);
    }, errorHandler);

    this.pc.createAnswer(function ( sdp ) {
        console.log('%s: create answer', self.id);
        self.pc.setLocalDescription(sdp);
        //window.answer.value = JSON.stringify(sdp);
        //socket.send(JSON.stringify(sdp));
        callback(sdp);
    }, errorHandler);
};


Node.prototype.acceptAnswer = function ( sdp ) {
    var self = this;

    this.pc.setRemoteDescription(new RTCSessionDescription(sdp), function () {
        console.log('%s: accept answer', self.id);
    }, errorHandler);
};


Node.prototype.addIceCandidate = function ( candidate ) {
    var self = this;

    this.pc.addIceCandidate(new RTCIceCandidate({
        sdpMLineIndex: candidate.sdpMLineIndex,
        candidate: candidate.candidate
    }), function () {
        console.log('%s: add ice candidate', self.id);
    }, errorHandler);
};


Node.prototype.setDataChannel = function ( channel ) {
    var self = this;

    // channel.onmessage = function ( event ) {
    //     var data = JSON.parse(event.data);
	//
    //     console.log('data channel message (length:%s): %s', data.length, data);
    //     //window.messages.value += '<< ' + data + '\n';
    // };

    channel.onopen = function () {
        //console.log('data channel open');
        self.emit('open');
        // channel.push = channel.send;
        // channel.send = function ( data ) {
        //     channel.push(JSON.stringify(data));
        // };
        //
        // channel.send('ping');
    };

    channel.onerror = function ( error ) {
        console.error('channel.onerror', error);
    };

    channel.onclose = function ( error ) {
        console.warn('channel.onclose', error);
    };

    return new Wamp(channel);
};


// public
module.exports = Node;
