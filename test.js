'use strict';
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var gutil = require('gulp-util');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var vulcanize = require('./');

function copyTestFile(src, dest) {
	fs.writeFileSync(dest, fs.readFileSync(src, 'utf8'));
}

describe('should vulcanize web components:', function (argument) {
	var targets = ['', '/abc', '/xyz', '/xyz/abs'];

	before(function () {
		rimraf.sync('tmp');
		mkdirp.sync('tmp');

		targets.forEach(function (el) {
			var dest = path.join('tmp', 'src', el);
			mkdirp.sync(dest);
			copyTestFile('fixture/index.html', path.join(dest, 'index.html'));
			copyTestFile('fixture/import.html', path.join(dest, 'import.html'));
		});
	});

	it('single', function (cb) {
		var stream = vulcanize();

		stream.on('data', function (file) {
			if (/\.html$/.test(file.path)) {
				assert.equal(file.relative, 'index.html');
				assert(/Imported/.test(file.contents.toString()));
				return;
			}
			assert.equal(file.relative, 'index.js');
			assert(/Polymer/.test(file.contents.toString()));
		});

		stream.on('end', cb);

		stream.write(new gutil.File({
			cwd: __dirname,
			base: 'tmp/src',
			path: 'tmp/src/index.html',
			contents: fs.readFileSync('tmp/src/index.html')
		}));

		stream.end();
	});

	it('multiple', function (cb) {
		var stream = vulcanize();

		stream.on('data', function (file) {
			var t = path.dirname(file.path).replace('tmp/src', '');

			assert.notStrictEqual(targets.indexOf(t), -1);
			assert.strictEqual(file.relative, 'index.html');
			assert(/Imported/.test(file.contents.toString()));
		});

		stream.on('end', cb);

		targets.forEach(function (el) {
			var src = path.join('tmp', 'src', el);

			stream.write(new gutil.File({
				cwd: __dirname,
				base: 'tmp/src',
				path: src + '/index.html',
				contents: fs.readFileSync(src + '/index.html')
			}));
		});

		stream.end();
	});
});
