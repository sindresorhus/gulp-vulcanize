'use strict';
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var vulcanize = require('vulcanize');

module.exports = function (opts) {
	opts = opts || {};

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-vulcanize', 'Streaming not supported'));
			return;
		}
	
		vulcanize.setOptions(opts, function () {});

		vulcanize.process(file.path, function(err, inlinedHtml) {
			if (err) {
				cb(new gutil.PluginError('gulp-vulcanize', err, {fileName: file.path}));
			} else {
				this.push(new gutil.File({
					cwd: file.cwd,
					base: path.dirname(file.path),
					path: file.path,
					contents: new Buffer(inlinedHtml)
				}));
				cb();
			}
		}.bind(this));
	});
};
