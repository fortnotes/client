/**
 * @license The MIT License (MIT)
 * @copyright Stanislav Kalashnik <darkpark.main@gmail.com>
 */

'use strict';

var Tab    = require('spa-component-tab'),
    Button = require('spa-component-button'),
    tag    = require('spa-dom').tag,
    Svg    = require('../../lib/svg'),
    tab, buttons, images, inputs, errors;


tab = new Tab({
    modifiers: ['create'],
    hidden: true,
    group: 'profile',
    events: {
        show: function () {
            inputs.$name.focus();
        }
    }
});

buttons = {
    switch: new Button({
        value: 'Switch',
        events: {
            click: function ( event ) {
                event.preventDefault();
                tab.emit('switch');
            }
        }
    }),

    create: new Button({
        value: 'Create',
        modifiers: ['primary'],
        events: {
            click: function () {
                var valid = true;

                event.preventDefault();

                if ( !inputs.$name.value ) {
                    errors.$name.textContent = _('this field can not be empty');
                    valid = false;
                }

                if ( valid ) {
                    // send result
                    tab.emit('create', {
                        name: inputs.$name.value,
                        time: Date.now()
                    });

                    // reset user data
                    inputs.$name.value = '';

                    // reset possible errors
                    errors.$name.textContent = '';
                }
            }
        }
    })
};

images = {
    main: new Svg({
        id: 'svg-profile-add',
        className: 'dialog__logo'
    }),
    user: new Svg({
        id: 'svg-profile',
        className: 'icon--large'
    })
};

inputs = {
    $name: tag('input', {className: 'dialog__input', name: 'name', value: ''})
};

errors = {
    $name: tag('div', {className: 'dialog__error'})
};

tab.$node.appendChild(
    tag('div', {className: 'dialog'},
        tag('div', {className: 'dialog__title dialog__title--create'},
            images.main.$node,
            _('Profile creation')
        ),
        tag('div', {className: 'dialog__info'},
            // eslint-disable-next-line max-len
            _('Your profile will contain all your information - your notes, tags, contacts, messages, logs and settings.')
        ),
        tag('div', {className: 'dialog__entries'},
            // name
            tag('div', {className: 'dialog__entry dialog__entry--user'},
                tag('div', {className: 'dialog__icon'}, images.user.$node),
                tag('div', {className: 'dialog__body'},
                    tag('div', {className: 'dialog__name'}, _('Name')),
                    errors.$name,
                    inputs.$name,
                    tag('div', {className: 'dialog__hint'}, _('"home", "work", etc.'))
                )
            )
        ),
        //tag('div', {className: 'dialog__errors'}),
        tag('div', {className: 'dialog__buttons'},
            buttons.switch.$node,
            buttons.create.$node
        )
    )
);

inputs.$name.addEventListener('keydown', function ( event ) {
    if ( event.keyCode === 13 ) {
        buttons.create.emit('click');
    }
});


// public
module.exports = tab;
