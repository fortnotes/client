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
    modifiers: ['unlock'],
    hidden: true,
    group: 'user',
    events: {
        show: function () {
            inputs.$pass.focus();
        }
    }
});

buttons = {
    switch: new Button({
        value: 'Switch profile',
        events: {
            click: function ( event ) {
                event.preventDefault();
                tab.emit('switch');
            }
        }
    }),

    unlock: new Button({
        value: 'Unlock',
        modifiers: ['primary'],
        events: {
            click: function ( event ) {
                var valid = true;

                if ( !inputs.$pass.value ) {
                    errors.$pass.textContent = _('this field can not be empty');
                    valid = false;
                }

                if ( valid ) {
                    // prevent focusing
                    event.preventDefault();

                    /*inputs.$pass.disabled = true;

                    app.loadUser(app.userId, inputs.$pass.value, function ( error, data ) {
                        if ( !error ) {
                            console.log(data);

                            //setTimeout(function () {
                            tab.reset();
                            tab.emit('unlock');
                            //}, 500);
                        }
                    });*/

                    // send result
                    tab.emit('unlock', {
                        pass: inputs.$pass.value
                    });

                    // reset user data
                    inputs.$pass.value = '';
                    inputs.$pass.disabled = false;

                    // reset possible errors
                    errors.$pass.textContent = '';
                }
            }
        }
    })
};

images = {
    main: new Svg({
        id: 'svg-user-unlock',
        className: 'dialog__logo'
    }),
    key: new Svg({
        id: 'svg-key',
        className: 'icon--large'
    })
};

inputs = {
    $pass: tag('input', {type: 'password', className: 'dialog__input', autocomplete: 'current-password'/*, value: '111111'*/})
};

errors = {
    $pass: tag('div', {className: 'dialog__error'})
};

tab.$node.appendChild(
    tag('div', {className: 'dialog'},
        tag('form', {},
            tag('div', {className: 'dialog__title dialog__title--unlock'},
                images.main.$node,
                _('Unlock user')
            ),
            tag('div', {className: 'dialog__info'},
                _('All profile data is unavailable till the master password is provided. You can unlock it with your password or switch to another user.')
            ),
            tag('div', {className: 'dialog__entries'},
                // password
                tag('div', {className: 'dialog__entry dialog__entry--password'},
                    tag('div', {className: 'dialog__icon'}, images.key.$node),
                    tag('div', {className: 'dialog__body'},
                        tag('div', {className: 'dialog__name'}, 'Password'),
                        errors.$pass,
                        inputs.$pass,
                        tag('div', {className: 'dialog__hint'}, _('master password for encryption/decryption'))
                    )
                )
            ),
            tag('div', {className: 'dialog__errors'}),
            tag('div', {className: 'dialog__buttons'},
                buttons.switch.$node,
                buttons.unlock.$node
            )
        )
    )
);

inputs.$pass.addEventListener('keydown', function ( event ) {
    if ( event.keyCode === 13 ) {
        buttons.unlock.emit('click');
    }
});

// public
module.exports = tab;
