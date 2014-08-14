'use strict';
var assert = require('assert');
var fs = require('fs');
var gutil = require('gulp-util');
var vulcanize = require('./');

it('should vulcanize web components', function (cb) {
	var i = 0;
	var stream = vulcanize({
		dest: 'tmp',
		csp: true
	});

	stream.on('data', function (file) {
		i++;

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
		base: __dirname + '/fixture',
		path: __dirname + '/fixture/index.html',
		contents: fs.readFileSync('fixture/index.html')
	}));

	stream.end();
});
