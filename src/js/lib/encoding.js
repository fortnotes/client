/**
 * Base64, TypedArrays, and UTF-8/Unicode conversions in browser.
 *
 * @see https://github.com/coolaj86/unibabel-js
 */

'use strict';

var methods = {},
    encoder, decoder;


function utf8ToBinaryString ( str ) {
    // replaces any uri escape sequence, such as %0A, with binary escape, such as 0x0A
    return encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function ( match, p1 ) {
        return String.fromCharCode(parseInt(p1, 16));
    });
}


function bufferToBinaryString ( buf ) {
    return Array.prototype.map.call(buf, function ( code ) {
        return String.fromCharCode(code);
    }).join('');
}


function binaryStringToBuffer ( bin ) {
    var buf = new Uint8Array(bin.length);

    Array.prototype.forEach.call(bin, function ( char, index ) {
        buf[index] = char.charCodeAt(0);
    });

    return buf;
}


function binaryStringToUtf8 ( bin ) {
    return decodeURIComponent(bin.replace(/(.)/g, function ( m, p ) {
        var code = p.charCodeAt(0).toString(16).toUpperCase();

        if ( code.length < 2 ) {
            code = '0' + code;
        }

        return '%' + code;
    }));
}


function utf8ToBuffer ( str ) {
    return binaryStringToBuffer(utf8ToBinaryString(str));
}


function bufferToUtf8 ( buf ) {
    return binaryStringToUtf8(bufferToBinaryString(buf));
}


if ( 'TextEncoder' in window && 'TextDecoder' in window ) {
    // shared instances
    encoder = new TextEncoder('utf-8');
    decoder = new TextDecoder();

    // native calls
    methods.utf8ToBuffer = encoder.encode.bind(encoder);
    methods.bufferToUtf8 = decoder.decode.bind(decoder);

    console.log('utf-8/buffer encoding: native');
} else {
    methods.utf8ToBuffer = utf8ToBuffer;
    methods.bufferToUtf8 = bufferToUtf8;

    console.log('utf-8/buffer encoding: polyfill');
}


methods.bufferToBase64 = function ( buf ) {
    // simple alternative:
    // btoa(String.fromCharCode.apply(null, buf));
    return btoa(bufferToBinaryString(buf));
};


methods.base64ToBuffer = function ( b64 ) {
    return binaryStringToBuffer(atob(b64));
    // return new Uint8Array(atob(b64).split('').map(function ( char ) {
    //     return char.charCodeAt(0);
    // }));
};


methods.bufferToHex = function ( buffer ) {
    return Array.prototype.map.call(buffer, function ( byte ) {
        return (byte < 16 ? '0' : '') + byte.toString(16);
    }).join('');
};


// public
module.exports = methods;
