/**
 * Compile all CommonJS modules into a single js file.
 *
 * @author Stanislav Kalashnik <sk@infomir.eu>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var util    = require('util'),
	gulp    = require('gulp'),
	plumber = require('gulp-plumber'),
	webpack = require('gulp-webpack'),
	log     = require('./utils').log,
	del     = require('del');


/**
 * Callback to output the statistics.
 *
 * @param {Object} err problem description structure if any
 * @param {Object} stats data to report
 */
function report ( err, stats ) {
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


gulp.task('webpack:clean:develop', function ( done ) {
	del(['./build/develop/app.js', './build/develop/app.js.map'], done);
});


gulp.task('webpack:clean:release', function ( done ) {
	del(['./build/release/app.js'], done);
});


gulp.task('webpack:clean', ['webpack:clean:develop', 'webpack:clean:release']);


gulp.task('webpack:develop', function () {
	return gulp
		.src('./js/develop.js')
		.pipe(plumber())
		.pipe(webpack({
			output: {
				filename: 'develop.js',
				pathinfo: true,
				sourcePrefix: '\t\t\t'
			},
			resolve: {
				extensions:['', '.js']
			},
			devtool: 'source-map',
			node: {
				console: false,
				process: true,
				global: false,
				buffer: false,
				__filename: true,
				__dirname: true
			},
			debug: true,
			cache: false,
			plugins: [
				// fix compilation persistence
				new webpack.webpack.optimize.OccurenceOrderPlugin(true),
				// global constants
				new webpack.webpack.DefinePlugin({
					DEBUG: true
				})
			]
		}, null, report))
		.pipe(gulp.dest('./build/js/'));
});


gulp.task('webpack:release', function () {
	var appInfo = require('../package.json'),
		wpkInfo = require('../node_modules/gulp-webpack/node_modules/webpack/package.json');

	return gulp
		.src('./js/main.js')
		.pipe(plumber())
		.pipe(webpack({
			output: {
				filename: 'release.js'
			},
			resolve: {
				extensions:['', '.js']
			},
			debug: false,
			cache: false,
			plugins: [
				// fix compilation persistence
				new webpack.webpack.optimize.OccurenceOrderPlugin(true),
				// global constants
				new webpack.webpack.DefinePlugin({
					DEBUG: false
				}),
				// obfuscation
				new webpack.webpack.optimize.UglifyJsPlugin({
					// this option prevents name changing
					// use in case of strange errors
					// mangle: false,
					output: {
						comments: false
					},
					/*eslint camelcase:0 */
					compress: {
						warnings: true,
						unused: true,
						dead_code: true,
						drop_console: true,
						drop_debugger: true,
						pure_funcs: ['console.assert', 'console.log']
					}
				}),
				// add comment to the top of app.js
				new webpack.webpack.BannerPlugin(util.format(
					'%s: v%s (webpack: v%s)',
					appInfo.name, appInfo.version, wpkInfo.version
				))
			]
		}, null, report))
		.pipe(gulp.dest('./build/js/'));
});


gulp.task('webpack', ['webpack:develop', 'webpack:release']);
