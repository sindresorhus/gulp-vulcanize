'use strict';
var fs = require('fs');
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var vulcanize = require('vulcanize');

module.exports = function (options) {
	options = options || {};

	if (!options.dest) {
		throw new gutil.PluginError('gulp-vulcanize', '`dest` required');
	}

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-vulcanize', 'Streaming not supported'));
			return;
		}

		options.input = file.path;
		options.inputSrc = file.contents;
		options.output = path.join(options.dest, path.basename(file.path));
		options.outputSrc = function(filename, data, finished) {
			this.push(new gutil.File({
				cwd: file.cwd,
				base: path.dirname(filename),
				path: filename,
				contents: new Buffer(data)
			}));

			if (finished) {
				cb();
			}
		}.bind(this);

		vulcanize.setOptions(options, function () {});

		try {
			vulcanize.processDocument();
		} catch (err) {
			this.emit('error', new gutil.PluginError('gulp-vulcanize', err, {fileName: file.path}));
		}
	});
};
