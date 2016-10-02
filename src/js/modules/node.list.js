/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

/* eslint no-path-concat: 0 */

'use strict';

var Component = require('spa-component');


/**
 * Development node list implementation.
 *
 * @constructor
 * @extends Component
 *
 * @param {Object} config={}        init parameters (all inherited from the parent)
 * @param {Object} config.wamp      link to the server connection
 * @param {Array}  [config.data=[]] component data to visualize
 */
function NodeList ( config ) {
    // current execution context
    var self = this;

    // sanitize
    config = config || {};

    console.assert(typeof this === 'object', 'must be constructed via new');

    if ( DEVELOP ) {
        if ( typeof config !== 'object' ) { throw new Error(__filename + ': wrong config type'); }
        // init parameters checks
        if ( config.className && typeof config.className !== 'string' ) { throw new Error(__filename + ': wrong or empty config.className'); }
        //if ( !config.wamp ) { throw new Error(__filename + ': config.wamp must be given'); }
    }

    // set default className if classList property empty or undefined
    //config.className = 'taskList ' + (config.className || '');

    // parent constructor call
    Component.call(this, config);

    this.filterText = '';
    //this.wamp = config.wamp;

    // component setup
    this.init(config);

    // forward click to the specific item
    this.addListener('click', function ( event ) {
        // there are some listeners
        /*if ( self.events['click:item'] ) {
            // notify listeners
            self.emit('click:item', {$item: event.target});
        }*/

        //console.log(event.$item);
        // self.wamp.call('runTask', {id: event.target.taskId}, function ( error, data ) {
        //     console.log('run task', error, data);
        // });
    });

    // this.wamp.addListener('eventTaskStart', function ( event ) {
    //     console.log('task start', event);
    //     //window[event.id].classList.add('running');
    //     console.log(self);
    //     self.data[event.id].$node.classList.add('running');
    // });
	//
    // this.wamp.addListener('eventTaskFinish', function ( event ) {
    //     console.log('task finish', event);
    //     //window[event.id].classList.remove('running');
    //     self.data[event.id].$node.classList.remove('running');
    //     self.data[event.id].$node.classList.add('ok');
    // });
}


// inheritance
NodeList.prototype = Object.create(Component.prototype);
NodeList.prototype.constructor = NodeList;


// set component name
NodeList.prototype.name = 'app-component-node-list';


/**
 * List of all default event callbacks.
 *
 * @type {Object.<string, function>}
 */
NodeList.prototype.defaultEvents = {

};


/**
 * Init or re-init of the component inner structures and HTML.
 *
 * @param {Object} config init parameters (subset of constructor config params)
 */
NodeList.prototype.init = function ( config ) {
    var self = this;

    if ( DEVELOP ) {
        if ( arguments.length !== 1 ) { throw new Error(__filename + ': wrong arguments number'); }
        if ( typeof config !== 'object' ) { throw new Error(__filename + ': wrong config type'); }
    }

    // save
    this.data = config.data || {};

    // apply
    Object.keys(this.data).forEach(function ( id ) {
        var item = document.createElement('div'),
            data = self.data[id];

        item.innerText = item.taskId = id;
        item.className = 'item' + (data.running ? ' running' : '');

        data.$node = item;

        self.$node.appendChild(item);
    });
};


NodeList.prototype.matchFilter = function ( node ) {
    return !(this.filterText && node.innerText.indexOf(this.filterText) === -1);
};


NodeList.prototype.applyFilter = function () {
    var nodes = this.$body.children,
        length, item;

    // prepare
    length = nodes.length;
    // check
    while ( length-- ) {
        item = nodes[length];

        item.style.display = this.matchFilter(item) ? 'block' : 'none';
    }
};


NodeList.prototype.add = function ( data ) {
    var self = this,
        item = document.createElement('div'),
        info = document.createElement('div');

    item.className = 'item';

    data.tags = data.tags || [];
    data.tags.push(data.type);
    data.tags.forEach(function ( tag ) {
        var div = document.createElement('div');

        div.className = 'tag';
        div.innerText = tag;

        //item.appendChild(div);

        // if ( ['info', 'warn', 'fail'].indexOf(tag) !== -1 ) {
        //     item.classList.add(tag);
        // }

        div.addEventListener('click', function ( event ) {
            if ( event.ctrlKey ) {
                self.excludeTags.push(tag);
                window.pageMainTagsExclude.value = window.pageMainTagsExclude.value + (window.pageMainTagsExclude.value ? ' ' : '') + tag;
            } else {
                self.includeTags.push(tag);
                window.pageMainTagsInclude.value = window.pageMainTagsInclude.value + (window.pageMainTagsInclude.value ? ' ' : '') + tag;
            }

            self.applyFilter();

            /*var length = window.pageMainTabTargetList.children.length,
             index, node;

             console.log(tag);

             for ( index = 0; index < length; index++ ) {
             node = window.pageMainTabTargetList.children[index];
             //console.log(index, node);
             node.style.display = node.tags.indexOf(tag) === -1 ? 'none' : 'block';
             }*/
        });
    });
    item.classList.add(data.type);
    item.tags = data.tags;

    info.className = 'info';
    console.log(data.data);
    info.innerText = data.data; // && 'link' in  data.data ? '+ ' : '- ') +
        //getTime(data.time) + ' :: ' + data.info/*+ (data.data ? ' :: ' + data.data : '')*/;

    item.addEventListener('click', function () {
        //console.log(data.data.link);
        app.wamp.call('getLinkData', {targetId: 128, linkId: data.data.link}, function ( error, data ) {
            console.log(error, data);
        });
    });

    item.appendChild(info);

    //console.log('target message', data);

    if ( !this.matchFilter(item) ) {
        item.style.display = 'none';
    }

    this.$body.appendChild(item);
};


// public
module.exports = NodeList;
