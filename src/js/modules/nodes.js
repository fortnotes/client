/**
 * @license The MIT License (MIT)
 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
 */

'use strict';

var Emitter = require('cjs-emitter'),
    Wamp    = require('cjs-wamp'),
    manager = new Emitter(),
    RTCPeerConnection     = window.RTCPeerConnection     || window.mozRTCPeerConnection || window.webkitRTCPeerConnection,
    RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription,
    RTCIceCandidate       = window.RTCIceCandidate       || window.mozRTCIceCandidate;


function errorHandler ( error ) {
    console.log('rtc error', error);
}


manager.init = function ( config ) {
    this.wamp = config.wamp;
};

manager.add = function ( id ) {

};


// public
module.exports = manager;
