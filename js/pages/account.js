/**
 * Page to add new user account.
 *
 * @author DarkPark
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var id     = 'pageAccount',
    Page   = require('../lib/ui/page'),
    Panel  = require('../lib/ui/panel'),
    Button = require('../lib/ui/button'),
    page   = new Page({$node: document.getElementById(id)}),
    //wizard = new Panel({
    //    $node: document.getElementById('pageAccountWizard')
    //    //visible: false
    //}),
    step1  = new Panel({
        $node: document.getElementById('pageAccountStep1'),
        //visible: false
        children: [
            new Button({
                $node: document.getElementById('pageAccountStep1Next'),
                //icon: 'menu',
                value: 'Continue'
            })
        ]
    }),
    step2  = new Panel({
        $node: document.getElementById('pageAccountStep2'),
        visible: false
    }),
    step3  = new Panel({
        $node: document.getElementById('pageAccountStep3'),
        visible: false
    });


page.addListener('load', function load () {
    //console.log(wizard);
});


page.addListener('show', function show () {
    // initial active component
    if ( !page.activeComponent ) {
        //page.menu.focus();
    }
});


// public
module.exports = page;
