/**
 * Main SDK entry point.
 */

'use strict';

// redefinition of plugin option example
// require('spa-plugin-static/config').default.port = 8000;

// load default plugins
// and run default tasks
module.exports = require('spasdk/default');

// redefinition of default task example
// module.exports.runner.task('default', module.exports.runner.serial('build'));
