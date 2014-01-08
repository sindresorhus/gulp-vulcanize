'use strict';
var fs = require('fs');
var path = require('path');
var gutil = require('gulp-util');
var through = require('through');
var mkdirp = require('mkdirp');
var vulcanize = require('vulcanize');

module.exports = function (options) {
	options = options || {};

	if (!options.dest) {
		throw new gutil.PluginError('gulp-vulcanize', '`dest` required');
	}

	return through(function (file) {
		if (file.isNull()) {
			return this.queue(file);
		}

		if (file.isStream()) {
			return this.emit('error', new gutil.PluginError('gulp-vulcanize', 'Streaming not supported'));
		}

		var self = this;
		var destFilename = path.join(options.dest, path.basename(file.path));
		options.input = file.path;
		options.output = destFilename;
		vulcanize.setOptions(options);

		mkdirp(options.dest, function (err) {
			if (err) {
				return self.emit('error', new gutil.PluginError('gulp-vulcanize', err));
			}

			vulcanize.processDocument();

			fs.readFile(destFilename, function (err, data) {
				if (err) {
					return self.emit('error', new gutil.PluginError('gulp-vulcanize', err));
				}

				var html = data;

				fs.readFile(gutil.replaceExtension(destFilename, '.js'), function (err, data) {
					if (err && err.code !== 'ENOENT') {
						return self.emit('error', new gutil.PluginError('gulp-vulcanize', err));
					}

					self.queue(new gutil.File({
						cwd: file.cwd,
						base: file.base,
						path: file.path,
						contents: html
					}));

					if (data) {
						self.queue(new gutil.File({
							cwd: file.cwd,
							base: file.base,
							path: gutil.replaceExtension(file.path, '.js'),
							contents: data
						}));
					}
				});
			});
		});
	});
};
