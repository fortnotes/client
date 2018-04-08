/**
 * User management page implementation.
 */

'use strict';

var Page     = require('spa-component-page'),
    tag      = require('spa-dom').tag,
    Svg      = require('../../lib/svg'),
    profiles = require('../../lib/profiles'),
    Profile  = require('../../lib/profile'),
    page, tabs, images;


function setProfile ( id, data ) {
    var profile = new Profile(id, data);

    profile.addListener('ready', function () {
        console.log(profile);
        page.emit('ready', profile);
    });

    return profile;
}


// init
page = new Page({
    modifiers: ['profile'],
    hidden: true,
    events: {
        show: function () {
            tabs.switch.show(profiles.data);
        }
    }
});

page.init = function () {
    var profile;

    // init
    profiles.load();

    if ( profiles.current ) {
        // apply existing
        setProfile(profiles.current, profiles.data[profiles.current]);
    } else if ( Object.keys(profiles.data).length ) {
        // select existing
        page.emit('switch');
    } else {
        // create new
        profile = setProfile();
        console.log(profile);
        // apply and save
        profiles.add(profile);
        profiles.current = profile.id;
        profiles.save();
    }
};

// content
tabs = {
    create: require('./create'),
    switch: require('./switch')
};

tabs.create.addListeners({
    switch: function () {
        tabs.switch.show(profiles.data);
    },
    create: function ( data ) {
        var profile = setProfile(null, data);

        // apply and save
        profiles.add(profile);
        profiles.current = profile.id;
        profiles.save();
    }
});

tabs.switch.addListeners({
    create: function () {
        tabs.create.show();
    },
    switch: function ( event ) {
        var profile = setProfile(event.id, event.data);

        profiles.current = profile.id;
        profiles.save();
    }
});

images = {
    logo: new Svg({
        id: 'svg-logo',
        className: 'icon--normal'
    })
};

// header
page.$node.appendChild(tag('div', {className: 'page__header'},
    tag('div', {className: 'header'},
        tag('div', {className: 'header__logo'},
            images.logo.$node,
            tag('div', {className: 'header__logo-a'}, 'fort'),
            tag('div', {className: 'header__logo-b'}, 'notes')
        )
    )
));

// body with tabs
page.$node.appendChild(tag('div', {className: 'page__body page__body--centered'},
    tabs.create.$node,
    tabs.switch.$node
));

// footer
page.$node.appendChild(tag('div', {className: 'page__footer'},
    _('© 2013-2018 FortNotes. All rights reserved.')
));


// public
module.exports = page;
