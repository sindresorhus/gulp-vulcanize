'use strict';
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var vulcanize = require('vulcanize');

module.exports = function (opts) {
	opts = opts || {};

	if (!opts.dest) {
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

		opts.input = file.path;
		opts.inputSrc = file.contents;
		opts.output = path.join(opts.dest, file.relative);
		opts.outputHandler = function(filename, data, finished) {
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

		vulcanize.setOptions(opts, function () {});

		try {
			vulcanize.processDocument();
		} catch (err) {
			this.emit('error', new gutil.PluginError('gulp-vulcanize', err, {fileName: file.path}));
		}
	});
};
