/**
 * Set of gulp task helpers.
 *
 * @author DarkPark
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

/**
 * Dump data to console.
 */
function log () {
    var date  = new Date(),
        timeH = date.getHours(),
        timeM = date.getMinutes(),
        timeS = date.getSeconds(),
        args  = Array.prototype.slice.call(arguments);

    args.unshift('[' + (
        (timeH < 10 ? '0' : '') + timeH + ':' +
        (timeM < 10 ? '0' : '') + timeM + ':' +
        (timeS < 10 ? '0' : '') + timeS
        ).grey + ']');

    console.log.apply(console, args);
}


module.exports = {
    log: log
};
