/**
 * User management page implementation.
 */

'use strict';

var Page = require('spa-component-page'),
    tag  = require('spa-dom').tag,
    Svg  = require('../../lib/svg'),
    page, tabs, images;


// init
page = new Page({
    modifiers: ['user'],
    hidden: true,
    events: {
        show: function ( profile ) {
            page.profile = profile;

            // check if user exists
            if ( profile.options && profile.options.userId ) {
                tabs.unlock.show();
            } else {
                tabs.create.show();
            }
        }
    }
});

// content
tabs = {
    create: require('./create'),
    unlock: require('./unlock')
};

tabs.create.addListeners({
    show: function () {
        page.$user.style.display = 'none';
    },
    switch: function () {
        localStorage.removeItem('profileId');
        location.reload();
    },
    create: function ( data ) {
        page.profile.addUser(data, function ( error ) {
            error && console.error(error);

            //tabs.create.hide();
            location.reload();
        });
    }
});

tabs.unlock.addListeners({
    show: function () {
        page.$user.style.display = 'block';
        // todo: enable
        page.$user.textContent = 'app.user.name';
    },
    switch: function () {
        localStorage.removeItem('profileId');
        location.reload();
    },
    unlock: function ( data ) {
        page.profile.unlockUser(data.pass, function ( error ) {
            error && console.error(error);

            console.log('ok');
            page.emit('ready');
        });
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
        ),
        page.$user = tag('div', {className: 'header__user'})
    )
));

// body with tabs
page.$node.appendChild(tag('div', {className: 'page__body page__body--centered'},
    tabs.create.$node,
    tabs.unlock.$node
));

// footer
page.$node.appendChild(tag('div', {className: 'page__footer'},
    _('© 2013-2018 FortNotes. All rights reserved.')
));


// public
module.exports = page;


// tabs = {
//     // list: new Tab({
//     //     id: 'page-user-tab-list',
//     //     modifiers: ['list'],
//     //     hidden: true,
//     //     group: 'user-menu',
//     //     events: {
//     //         show: function () {
//     //             page.$header.textContent = 'User profile list';
//     //         }
//     //     }
//     // }),
//     // create: new Tab({
//     //     id: 'page-user-tab-create',
//     //     modifiers: ['create'],
//     //     hidden: true,
//     //     group: 'user-menu',
//     //     events: {
//     //         show: function () {
//     //             page.$header.textContent = 'User profile creation';
//     //         }
//     //     }
//     // }),
//     unlock: require('../tabs/user.unlock')
//     // unlock: new Tab({
//     //     id: 'page-user-tab-unlock',
//     //     modifiers: ['unlock'],
//     //     hidden: true,
//     //     group: 'user-menu',
//     //     events: {
//     //         show: function () {
//     //             app.pages.user.$header.textContent = 'Unlock user profile';
//     //         }
//     //     }
//     // })
// };


/*page.menu = new List({
    name: 'menu',
    id: 'page-user-header-menu',
    modifiers: ['user-menu'],
    data: [
        {
            name: 'List',
            //active: true,
            tab: tabs.list
        },
        {
            name: 'Create',
            tab: tabs.create
        },
        {
            name: 'Unlock',
            tab: tabs.unlock
        }
    ],
    render: function ( $item, data ) {
        $item.textContent = data.name;
        //data.active && ($item.className = this.CLASS_ITEM_ACTIVE);
    },
    events: {
        click: function ( event ) {
            console.log('click');
            //event.preventDefault();
        },
        'click:item': function ( data, event ) {
            console.log('click:item');
            //event.preventDefault();
            //data.tab.show();
        },
        focus: function ( event ) {
            console.log('focus');
        },
        'focus:item': function ( data, event ) {
            console.log('focus:item');
            //console.log(data, event);
            data.tab.show();
        }
    }
});/**/


/*createUser = new CreateUser({
    events: {
        done: function ( data ) {
            data.salt = window.crypto.getRandomValues(new Uint8Array(32));

            console.log(data);

            app.createUser(data, function ( error, user ) {
                console.log('app.createUser', error, user);
                if ( !error ) {
                    app.userId = user.id;
                    localStorage.setItem('userId', user.id);

                    // show main page
                    app.pages.user.hide();
                    app.pages.main.show();
                }
            });
        }
    }
});/**/
//tabs.create.$node.appendChild(createUser.$node);


// unlockUser = new UnlockUser({
//     events: {
//         list: function () {
//             console.log('list');
//
//             app.getUserList(function ( error, data ) {
//                 console.log(data);
//                 tabs.list.listUser.setData(data);
//                 tabs.list.show(data);
//             });
//         },
//         done: function ( data ) {
//             console.log(data);
//
//             app.loadUser(app.userId, data.pass, function ( error, data ) {
//                 console.log(error, data);
//
//                 app.crypto.sign(data.keys.public, function ( error, signature ) {
//                     //console.log('signature', error, buf2b64(signature));
//
//                     app.crypto.verify(data.keys.public, buf2b64(signature), function ( error, isValid ) {
//                         //console.log('isValid', error, isValid);
//
//                         // remove loading gif
//                         //document.body.classList.remove('loading');
//
//                         // show main page
//                         app.pages.user.hide();
//                         app.pages.main.show();
//                     });
//                 });
//             });
//         }
//     }
// });
// tabs.unlock.$node.appendChild(unlockUser.$node);


// tabs.list.listUser = new ListUser({
//     events: {
//         create: function () {
//             tabs.create.show();
//         },
//         done: function ( data ) {
//             console.log(data);
//
//
//         }
//     }
// });
//tabs.list.$node.appendChild(tabs.list.listUser.$node);


// function switchUser () {
//
// }
