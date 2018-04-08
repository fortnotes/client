/**
 * @license The MIT License (MIT)
 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
 */

'use strict';

var Tab    = require('spa-component-tab'),
    Button = require('spa-component-button'),
    List   = require('spa-component-list'),
    tag    = require('spa-dom').tag,
    Svg    = require('../../lib/svg'),
    tab, list, buttons, images;


tab = new Tab({
    modifiers: ['switch'],
    hidden: true,
    group: 'profile',
    events: {
        show: function ( profiles ) {
            var data = [];

            Object.keys(profiles).forEach(function ( id ) {
                data.push({
                    id: id,
                    data: profiles[id]
                });
            });

            data.sort(function ( profileA, profileB ) {
                return profileA.data.name > profileB.data.name;
            });

            list.init({data: data});
            list.focus();
            list.focusItem(list.$node.firstChild);
        }
    }
});

list = new List({
    modifiers: ['profile-list'],
    data: [],
    render: function ( $item, profile ) {
        $item.textContent = profile.data.name;
    },
    events: {
        'click:item': function ( data ) {
            tab.emit('switch', data);
        }
    }
});

buttons = {
    create: new Button({
        value: _('Create'),
        events: {
            click: function ( event ) {
                event.preventDefault();
                tab.emit('create');
            }
        }
    }),

    switch: new Button({
        value: _('Switch'),
        modifiers: ['primary'],
        events: {
            click: function ( event ) {
                event.preventDefault();
                tab.emit('switch', list.data[list.$focusItem.index]);
            }
        }
    })
};

images = {
    main: new Svg({
        id: 'svg-profile-switch',
        className: 'dialog__logo'
    })
};

tab.$node.appendChild(
    tag('div', {className: 'dialog'},
        tag('div', {className: 'dialog__title dialog__title--switch'},
            images.main.$node,
            _('Profile selection')
        ),
        tag('div', {className: 'dialog__info'},
            _('Select a profile to work with or create a new one.')
        ),
        tag('div', {className: 'dialog__entries'},
            // profile name
            tag('div', {className: 'dialog__entry dialog__entry--user-list'},
                tag('div', {className: 'dialog__body'},
                    list.$node
                )
            )
        ),
        //tag('div', {className: 'dialog__errors'}),
        tag('div', {className: 'dialog__buttons'},
            buttons.create.$node,
            buttons.switch.$node
        )
    )
);


// public
module.exports = tab;
