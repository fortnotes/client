/**
 * @license The MIT License (MIT)
 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
 */

'use strict';

var manager = {
    data: null,
    current: null
};


manager.load = function () {
    this.data = JSON.parse(localStorage.getItem('profiles')) || {};
    this.current = sessionStorage.getItem('profileId') || localStorage.getItem('profileId');
};


manager.save = function () {
    localStorage.setItem('profiles', JSON.stringify(this.data));
    localStorage.setItem('profileId', this.current);
};


manager.add = function ( profile ) {
    this.data[profile.id] = {
        name: profile.name,
        time: profile.time
    };
};


manager.remove = function ( profile ) {
    delete this.data[profile.id];

    if ( this.current === profile.id ) {
        this.current = null;
    }
};


// public
module.exports = manager;
