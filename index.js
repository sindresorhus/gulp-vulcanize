'use strict';
var fs = require('fs');
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var mkdirp = require('mkdirp');
var vulcanize = require('vulcanize');

module.exports = function (options) {
	options = options || {};

	if (!options.dest) {
		throw new gutil.PluginError('gulp-vulcanize', '`dest` required');
	}

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			this.push(file);
			return cb();
		}

		if (file.isStream()) {
			this.emit('error', new gutil.PluginError('gulp-vulcanize', 'Streaming not supported'));
			return cb();
		}

		var self = this;
		var destFilename = path.join(options.dest, path.basename(file.path));
		options.input = file.path;
		options.output = destFilename;
		vulcanize.setOptions(options, function () {});

		mkdirp(options.dest, function (err) {
			if (err) {
				self.emit('error', new gutil.PluginError('gulp-vulcanize', err, {fileName: file.path}));
				return cb();
			}

			vulcanize.processDocument();

			fs.readFile(destFilename, function (err, data) {
				if (err) {
					self.emit('error', new gutil.PluginError('gulp-vulcanize', err, {fileName: file.path}));
					return cb();
				}

				var html = data;

				fs.readFile(gutil.replaceExtension(destFilename, '.js'), function (err, data) {
					if (err && err.code !== 'ENOENT') {
						self.emit('error', new gutil.PluginError('gulp-vulcanize', err, {fileName: file.path}));
						self.push(file);
						return cb();
					}

					self.push(new gutil.File({
						cwd: file.cwd,
						base: file.base,
						path: file.path,
						contents: html
					}));

					if (data) {
						self.push(new gutil.File({
							cwd: file.cwd,
							base: file.base,
							path: gutil.replaceExtension(file.path, '.js'),
							contents: data
						}));
					}

					cb();
				});
			});
		});
	});
};
