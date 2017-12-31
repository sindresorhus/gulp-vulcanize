'use strict';
const through = require('through2');
const Vulcanize = require('vulcanize');
const PluginError = require('plugin-error');
const Buffer = require('safe-buffer').Buffer;

module.exports = options => {
	options = options || {};

	return through.obj((file, enc, cb) => {
		if (file.isNull()) {
			cb(null, file);
			return;
		}

		if (file.isStream()) {
			cb(new PluginError('gulp-vulcanize', 'Streaming not supported'));
			return;
		}

		(new Vulcanize(options)).process(file.path, (err, inlinedHtml) => {
			if (err) {
				cb(new PluginError('gulp-vulcanize', err, {fileName: file.path}));
				return;
			}

			file.contents = Buffer.from(inlinedHtml);
			cb(null, file);
		});
	});
};
