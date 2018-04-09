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
    group: 'user',
    events: {
        show: function () {
            inputs.$node.focus();
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

    create: new Button({
        value: 'Create',
        modifiers: ['primary'],
        events: {
            click: function () {
                var valid = true;

                if ( !inputs.$node.value ) {
                    errors.$node.textContent = _('this field can not be empty');
                    valid = false;
                }

                if ( !inputs.$user.value ) {
                    errors.$user.textContent = _('this field can not be empty');
                    valid = false;
                }

                if ( !inputs.$passA.value || !inputs.$passB.value ) {
                    errors.$pass.textContent = _('these fields can not be empty');
                    valid = false;
                } else if ( inputs.$passA.value !== inputs.$passB.value ) {
                    errors.$pass.textContent = _('both passwords should be identical');
                    valid = false;
                }

                if ( valid ) {
                    // prevent focusing
                    event.preventDefault();

                    // send result
                    tab.emit('create', {
                        node: inputs.$node.value,
                        user: inputs.$user.value,
                        pass: inputs.$passA.value
                    });

                    // reset user data
                    inputs.$node.value = '';
                    inputs.$user.value = '';
                    inputs.$passA.value = '';
                    inputs.$passB.value = '';

                    // reset possible errors
                    errors.$node.textContent = '';
                    errors.$user.textContent = '';
                    errors.$pass.textContent = '';
                }

                /*app.createUser(
                    {
                        user: inputs.$user.value,
                        node: inputs.$node.value,
                        pass: inputs.$passA.value,
                        salt: window.crypto.getRandomValues(new Uint8Array(32))
                    },
                    function ( error, user ) {
                        console.log('createUser', error, user);
                        if ( error ) {
                            app.emit('error', error.target.error);
                        } else {
                            app.user = user;
                            app.userId = user.id;
                            localStorage.setItem('userId', user.id);

                            tab.reset();
                            tab.emit('create');
                        }
                    }
                );*/
            }
        }
    })
};

images = {
    main: new Svg({
        id: 'svg-user-add',
        className: 'dialog__logo'
    }),
    user: new Svg({
        id: 'svg-user',
        className: 'icon--large'
    }),
    device: new Svg({
        id: 'svg-device',
        className: 'icon--large'
    }),
    password: new Svg({
        id: 'svg-key',
        className: 'icon--large'
    })
};

inputs = {
    $node: tag('input', {className: 'dialog__input', autocomplete: 'nodename'/*, value: 'Raspberry Pi'/**/}),
    $user: tag('input', {className: 'dialog__input', autocomplete: 'username', name: 'username'/*, value: 'DarkPark'/**/}),
    $passA: tag('input', {type: 'password', className: 'dialog__input', autocomplete: 'new-password', name: 'password'/*, value: '111111'/**/}),
    $passB: tag('input', {type: 'password', className: 'dialog__input', autocomplete: 'repeat new-password'/*, value: '111111'/**/})
};

errors = {
    $node: tag('div', {className: 'dialog__error'}),
    $user: tag('div', {className: 'dialog__error'}),
    $pass: tag('div', {className: 'dialog__error'})
};

tab.$node.appendChild(
    tag('div', {className: 'dialog'},
        tab.$form = tag('form', {},
            tag('div', {className: 'dialog__title dialog__title--create'},
                images.main.$node,
                _('User creation')
            ),
            tag('div', {className: 'dialog__info'},
                // eslint-disable-next-line max-len
                _('Your profile will contain all your notes, tags, contacts, messages, logs and settings. Everything will be encrypted with the password bellow.')
            ),
            tag('div', {className: 'dialog__entries'},
                // device name
                tag('div', {className: 'dialog__entry dialog__entry--device'},
                    tag('div', {className: 'dialog__icon'}, images.device.$node),
                    tag('div', {className: 'dialog__body'},
                        tag('div', {className: 'dialog__name'}, 'Device name'),
                        errors.$node,
                        inputs.$node,
                        tag('div', {className: 'dialog__hint'}, _('this device name ("home laptop", "work phone", etc.)'))
                    )
                ),

                // user name
                tag('div', {className: 'dialog__entry dialog__entry--user'},
                    tag('div', {className: 'dialog__icon'}, images.user.$node),
                    tag('div', {className: 'dialog__body'},
                        tag('div', {className: 'dialog__name'}, 'User name'),
                        errors.$user,
                        inputs.$user,
                        tag('div', {className: 'dialog__hint'}, _('your name or email (will be stored unencrypted)'))
                    )
                ),

                // password
                tag('div', {className: 'dialog__entry dialog__entry--password'},
                    tag('div', {className: 'dialog__icon'}, images.password.$node),
                    tag('div', {className: 'dialog__body'},
                        tag('div', {className: 'dialog__name'}, 'Password'),
                        errors.$pass,
                        inputs.$passA,
                        tag('div', {className: 'dialog__hint'}, _('master password for encryption/decryption')),
                        inputs.$passB,
                        tag('div', {className: 'dialog__hint'}, _('master password once again'))
                    )
                )
            ),
            tag('div', {className: 'dialog__errors'}),
            tag('div', {className: 'dialog__buttons'},
                buttons.switch.$node,
                buttons.create.$node
            )
        )
    )
);

tab.$form.addEventListener('submit', function ( event ) {
    event.preventDefault();
    console.log('Form submission cancelled.');
});

// tab.$inputName.addEventListener('keydown', function ( event ) {
//     if ( event.keyCode === 13 ) {
//         console.log('keydown');
//     }
// });

tab.reset = function () {
    inputs.$user.value = '';
    inputs.$node.value = '';
    inputs.$passA.value = '';
    inputs.$passB.value = '';
};


// public
module.exports = tab;
