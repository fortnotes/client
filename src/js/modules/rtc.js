/**
 * @license The MIT License (MIT)
 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
 */

'use strict';

/* eslint-disable */

var RTCPeerConnection     = window.RTCPeerConnection     || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
var RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription;
var RTCIceCandidate       = window.RTCIceCandidate       || window.mozRTCIceCandidate;

var servers = {
    iceServers: [
        {urls: 'stun:stun.services.mozilla.com'},
        {urls: 'stun:stun.l.google.com:19302'}
    ]
};

//minimal requirements for data connection
var mediaConstraints = {
    optional: [
        {DtlsSrtpKeyAgreement: true}
        //{RtpDataChannels: true}
    ]
};

var offerer, answerer;
var offererDataChannel, answererDataChannel;

function logError ( error ) {
    console.log('error');
    console.log(error);
}

var Offerer = {
    createOffer: function ( callback ) {
        var peer = new RTCPeerConnection(servers, mediaConstraints);

        offererDataChannel = peer.createDataChannel('channel', {reliable: true});
        setChannelEvents(offererDataChannel);

        peer.onsignalingstatechange = function ( event ) {
            console.log('Offerer: signaling state change - ' + peer.signalingState);
        };

        peer.oniceconnectionstatechange = function ( event ) {
            console.log('Offerer: ice connection state change - ' + peer.iceConnectionState);
        };

        /*peer.onnegotiationneeded = function ( event ) {
            console.log('Offerer: negotiation needed', event);
        };*/

        // peer.onicecandidate = function ( event ) {
        //     if ( event.candidate ) {
        //         socket.send(JSON.stringify(event.candidate));
        //         //window.iceCandidates.value += JSON.stringify(event.candidate) + '\n';
        //     }
        // };

        peer.createOffer(function ( sdp ) {
            console.log('Offerer: create offer');
            peer.setLocalDescription(sdp);
            //Send_to_Other_Peer(sdp);
            //window.offer.value = JSON.stringify(sdp);
            //socket.send(JSON.stringify(sdp));
            callback(sdp);
        }, logError);

        this.peer = peer;

        return this;
    },

    setRemoteDescription: function ( sdp ) {
        this.peer.setRemoteDescription(new RTCSessionDescription(sdp), function () {
            console.log('Offerer: accept answer');
        }, logError);
    },

    addIceCandidate: function ( candidate ) {
        this.peer.addIceCandidate(new RTCIceCandidate({
            sdpMLineIndex: candidate.sdpMLineIndex,
            candidate: candidate.candidate
        }), function () {
            console.log('Offerer: add ice candidate');
        }, logError);
    }
};

var Answerer = {
    createAnswer: function ( offerSDP, callback ) {
        var peer = new RTCPeerConnection(servers, mediaConstraints);

        peer.ondatachannel = function ( event ) {
            answererDataChannel = event.channel;
            setChannelEvents(answererDataChannel);
        };

        peer.onsignalingstatechange = function ( event ) {
            console.log('Answerer: signaling state change - ' + peer.signalingState);
        };

        peer.oniceconnectionstatechange = function ( event ) {
            console.log('Answerer: ice connection state change - ' + peer.iceConnectionState);
        };

        /*peer.onnegotiationneeded = function ( event ) {
            console.log('Answerer: negotiation needed', event);
        };*/

        // answererDataChannel = peer.createDataChannel('channel', {reliable: true});
        // setChannelEvents(answererDataChannel);

        // peer.ondatachannel = function ( event ) {
        //     answererDataChannel = event.channel;
        //     setChannelEvents(answererDataChannel);
        // };

        // peer.onicecandidate = function ( event ) {
        //     if ( event.candidate ) {
        //         //window.iceCandidates.value += JSON.stringify(event.candidate) + '\n';
        //         socket.send(JSON.stringify(event.candidate));
        //     }
        // };

        peer.setRemoteDescription(new RTCSessionDescription(offerSDP), function () {
            console.log('Answerer: accept offer');
        }, logError);

        peer.createAnswer(function ( sdp ) {
            console.log('Answerer: create answer');
            peer.setLocalDescription(sdp);
            //window.answer.value = JSON.stringify(sdp);
            //socket.send(JSON.stringify(sdp));
            callback(sdp)
        }, logError);

        this.peer = peer;

        return this;
    },

    addIceCandidate: function ( candidate ) {
        this.peer.addIceCandidate(new RTCIceCandidate({
            sdpMLineIndex: candidate.sdpMLineIndex,
            candidate: candidate.candidate
        }), function () {
            console.log('Answerer: add ice candidate');
        }, logError);
    }
};

function setChannelEvents ( channel ) {
    channel.onmessage = function ( event ) {
        var data = JSON.parse(event.data);
        console.log(data);
        window.messages.value += '<< ' + data + '\n';
    };
    channel.onopen = function () {
        console.log('data channel open');
        channel.push = channel.send;
        channel.send = function ( data ) {
            channel.push(JSON.stringify(data));
        };
    };

    channel.onerror = function ( e ) {
        console.error('channel.onerror', e);
    };

    channel.onclose = function ( e ) {
        console.warn('channel.onclose', e);
    };
}


// public
module.exports = {
    Offerer: Offerer,
    Answerer: Answerer,
    setChannelEvents: setChannelEvents
};
