/**
 * Loading page.
 *
 * @author DarkPark
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var id   = 'pageInit',
	Page = require('../lib/ui/page'),
	page = new Page({$node: document.getElementById(id)});


// public
module.exports = page;
