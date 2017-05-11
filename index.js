'use strict';
const gutil = require('gulp-util');
const through = require('through2');
const Vulcanize = require('vulcanize');

module.exports = opts => {
	opts = opts || {};

	return through.obj((file, enc, cb) => {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new gutil.PluginError('gulp-vulcanize', 'Streaming not supported'));
			return;
		}

		(new Vulcanize(opts)).process(file.path, (err, inlinedHtml) => {
			if (err) {
				cb(new gutil.PluginError('gulp-vulcanize', err, {fileName: file.path}));
				return;
			}

			file.contents = new Buffer(inlinedHtml); // eslint-disable-line unicorn/no-new-buffer
			cb(null, file);
		});
	});
};
