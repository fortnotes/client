/**
 * @author DarkPark
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var Model    = require('./model'),
	router   = require('./router'),
	keyCodes = {},
	app, key;


/**
 * @instance
 * @type {Model}
 */
app = new Model({
	/**
	 * Enable logging and debugging flag set by debug module at runtime.
	 *
	 * @type {boolean}
	 */
	debug: false,

	/**
	 * Timestamps data.
	 *
	 * @type {Object}
	 * @property {number} init application initialization time (right now)
	 * @property {number} load document onload event
	 * @property {number} done onload event sent and processed
	 */
	time: {
		init: +new Date(),
		load: 0,
		done: 0
	}
});


/**
 * The load event is fired when a resource and its dependent resources have finished loading.
 *
 * Control flow:
 *   1. Global handler.
 *   2. Each page handler.
 *   3. Application DONE event.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/load
 *
 * @param {Event} event generated object with event data
 */
window.addEventListener('load', function globalEventListenerLoad ( event ) {
	var path;

	console.log(event);

	// time mark
	app.data.time.load = event.timeStamp;

	// global handler
	// there are some listeners
	if ( app.events[event.type] !== undefined ) {
		// notify listeners
		app.emit(event.type, event);
	}

	// local handler on each page
	router.pages.forEach(function forEachPages ( page ) {
		console.log('component ' + page.constructor.name + '.' + page.id + ' load', 'green');

		// there are some listeners
		if ( page.events[event.type] !== undefined ) {
			// notify listeners
			page.emit(event.type, event);
		}
	});

	// go to the given page if set
	if ( location.hash ) {
		path = router.parse(location.hash);
		router.navigate(path.name, path.data);
	}

	// time mark
	app.data.time.done = +new Date();

	// everything is ready
	// and there are some listeners
	if ( app.events['done'] !== undefined ) {
		// notify listeners
		app.emit('done', event);
	}
});


/**
 * The unload event is fired when the document or a child resource is being unloaded.
 *
 * Control flow:
 *   1. Each page handler.
 *   2. Global handler.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/unload
 *
 * @param {Event} event generated object with event data
 */
window.addEventListener('unload', function globalEventListenerUnload ( event ) {
	console.log(event);

	// global handler
	// there are some listeners
	if ( app.events[event.type] !== undefined ) {
		// notify listeners
		app.emit(event.type, event);
	}

	// local handler on each page
	router.pages.forEach(function forEachPages ( page ) {
		// there are some listeners
		if ( page.events[event.type] !== undefined ) {
			// notify listeners
			page.emit(event.type, event);
		}
	});
});


///**
// * The hashchange event is fired when the fragment identifier of the URL has changed (the part of the URL that follows the # symbol, including the # symbol).
// * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/hashchange
// */
//window.addEventListener('hashchange', function globalEventListenerHashChange ( event ) {
//	//var page, data;
//
//	console.log(event);
//	router.emit('change');
//
//	//debug.event(event);
//	//debug.inspect(event);
//    //
//	//app.emit(event.type, event);
//
//	//app.parseHash();
//
////	data = document.location.hash.split('/');
////
////	// the page is given
////	if ( data.length > 0 && (page = decodeURIComponent(data.shift().slice(1))) ) {
////		// the page params are given
////		if ( data.length > 0 ) {
////			data = data.map(decodeURIComponent);
////		}
////
////		app.emit(event.type, {page: page, data: data});
////	}
//});


/**
 * The error event is fired when a resource failed to load.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/error
 *
 * @param {Event} event generated object with event data
 */
window.addEventListener('error', function globalEventListenerError ( event ) {
	console.log(event);
});


function globalEventListenerKeydown ( event ) {
	var page = router.current;

	if ( DEBUG ) {
		if ( page === null || page === undefined ) { throw 'app should have at least one page'; }
	}

	// filter phantoms
	if ( event.keyCode === 0 ) { return; }

	// combined key code
	event.code = event.keyCode;

	// apply key modifiers
	if ( event.shiftKey ) { event.code += 1000; }
	if ( event.altKey )   { event.code += 2000; }

	console.log(event);

	// current component handler
	if ( page.activeComponent && page.activeComponent !== page ) {
		// component is available and not page itself
		if ( page.activeComponent.events[event.type] !== undefined ) {
			// there are some listeners
			page.activeComponent.emit(event.type, event);
		}
	}

	// page handler
	if ( !event.stop ) {
		// not prevented
		if ( page.events[event.type] !== undefined ) {
			// there are some listeners
			page.emit(event.type, event);
		}
	}

	// global app handler
	if ( !event.stop ) {
		// not prevented
		if ( app.events[event.type] !== undefined ) {
			// there are some listeners
			app.emit(event.type, event);
		}
	}

	// suppress non-printable keys in stb device (not in your browser)
	if ( app.data.host && keyCodes[event.code] && event.preventDefault ) {
		event.preventDefault();
	}
}


/**
 * The keydown event is fired when a key is pressed down.
 * Set event.stop to true in order to prevent bubbling.
 *
 * Control flow:
 *   1. Current active component on the active page.
 *   2. Current active page itself.
 *   3. Application.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/keydown
 *
 * @param {Event} event generated object with event data
 */
window.addEventListener('keydown', globalEventListenerKeydown);


/**
 * The keypress event is fired when press a printable character.
 * Delivers the event only to activeComponent at active page.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/keypress
 *
 * @param {Event} event generated object with event data
 * @param {string} event.char entered character
 */
window.addEventListener('keypress', function ( event ) {
	var page = router.current;

	if ( DEBUG ) {
		if ( page === null || page === undefined ) { throw 'app should have at least one page'; }
	}

	//debug.event(event);

	// current component handler
	if ( page.activeComponent && page.activeComponent !== page ) {
		// component is available and not page itself
		if ( page.activeComponent.events[event.type] !== undefined ) {
			// there are some listeners
			page.activeComponent.emit(event.type, event);
		}
	}
});


/**
 * The click event is fired when a pointing device button (usually a mouse button) is pressed and released on a single element.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/click
 *
 * @param {Event} event generated object with event data
 */
window.addEventListener('click', function globalEventListenerClick ( event ) {
	console.log(event);
});


/**
 * The contextmenu event is fired when the right button of the mouse is clicked (before the context menu is displayed),
 * or when the context menu key is pressed (in which case the context menu is displayed at the bottom left of the focused
 * element, unless the element is a tree, in which case the context menu is displayed at the bottom left of the current row).
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/contextmenu
 *
 * @param {Event} event generated object with event data
 */
window.addEventListener('contextmenu', function globalEventListenerContextmenu ( event ) {
	var kbEvent = {}; //Object.create(document.createEvent('KeyboardEvent'));

	console.log(event);

	kbEvent.type    = 'keydown';
	kbEvent.keyCode = 8;

	//debug.log(kbEvent.type);

	globalEventListenerKeydown(kbEvent);
	//var event = document.createEvent('KeyboardEvent');
	//event.initEvent('keydown', true, true);

	//document.dispatchEvent(kbEvent);

	//if ( !DEBUG ) {
	// disable right click in release mode
	event.preventDefault();
	//}
});


///**
// * The wheel event is fired when a wheel button of a pointing device (usually a mouse) is rotated.
// * @see https://developer.mozilla.org/en-US/docs/Web/Reference/Events/wheel
// */
//window.addEventListener('wheel', function globalEventListenerWheel ( event ) {
//	var page = router.current;
//
//	debug.event(event);
//
//	event.preventDefault();
//	event.stopPropagation();
//
//	// local handler
//	if ( page ) {
//		if ( page.activeComponent && page.activeComponent !== page ) {
//			page.activeComponent.emit(event.type, event);
//		}
//
//		if ( !event.stop ) {
//			// not prevented
//			page.emit(event.type, event);
//		}
//	}
//});


// public
module.exports = app;
