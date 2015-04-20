/**
 * Set of gulp task helpers.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

/**
 * Dump data to console.
 */
function log () {
	var date  = new Date(),
		timeH = date.getHours(),
		timeM = date.getMinutes(),
		timeS = date.getSeconds(),
		args  = Array.prototype.slice.call(arguments);

	args.unshift('[' + (
		(timeH < 10 ? '0' : '') + timeH + ':' +
		(timeM < 10 ? '0' : '') + timeM + ':' +
		(timeS < 10 ? '0' : '') + timeS
		).grey + ']');

	console.log.apply(console, args);
}


/**
 * Callback to output the statistics.
 *
 * @param {Object} err problem description structure if any
 * @param {Object} stats data to report
 */
function webpack ( err, stats ) {
	var json  = stats.toJson({source:false}),
		title = 'webpack '.black.bgYellow;

	if ( err ) {
		log(title, 'FATAL ERROR'.red, err);
	} else {
		// general info
		log(title, 'hash:\t'    + json.hash.bold);
		log(title, 'version:\t' + json.version.bold);
		log(title, 'time:\t'    + json.time.toString().bold + ' ms');

		// title and headers
		log(title, 'ASSETS'.green);
		log(title, '\tSize\tName'.grey);
		// data
		json.assets.forEach(function ( asset ) {
			log(title, '\t' + asset.size + '\t' + asset.name.bold);
		});

		// title and headers
		log(title, 'MODULES'.green);
		log(title, '\tID\tSize\tErrs\tWarns\tName'.grey);

		// sort modules by name (not always is necessary)
		//json.modules.sort(function ( a, b ) { return a.name.toLowerCase().localeCompare(b.name.toLowerCase()); });

		// data
		json.modules.forEach(function ( module ) {
			log(title, '\t' +
				module.id + '\t' +
				module.size + '\t' +
				(module.errors > 0 ? module.errors.toString().red : '0') + '\t' +
				(module.warnings > 0 ? module.warnings.toString().yellow : '0') + '\t' +
				(module.name.indexOf('./') === 0 ? module.name.replace(/\//g, '/'.grey) : module.name.grey)
			);
		});

		json.errors.forEach(function ( error, errorIndex ) {
			log(title, ('ERROR #' + errorIndex).red);
			error.split('\n').forEach(function ( line, lineIndex ) {
				if ( lineIndex === 0 ) {
					log(title, line.bold);
				} else {
					log(title, '\t' + line.grey);
				}
			});
		});

		json.warnings.forEach(function ( warning, warningIndex ) {
			log(title, ('WARNING #' + warningIndex).yellow);
			warning.split('\n').forEach(function ( line, lineIndex ) {
				if ( lineIndex === 0 ) {
					log(title, line.bold);
				} else {
					log(title, '\t' + line.grey);
				}
			});
		});
	}
}


module.exports = {
	log: log,
	webpack: webpack
};