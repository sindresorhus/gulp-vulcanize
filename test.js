/* eslint-env mocha */
'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const gutil = require('gulp-util');
const makeDir = require('make-dir');
const del = require('del');
const vulcanize = require('.');

function copyTestFile(src, dest) {
	fs.writeFileSync(dest, fs.readFileSync(src, 'utf8'));
}

describe('should vulcanize web components:', () => {
	const targets = [
		'',
		path.join('/abc'),
		path.join('/xyz'),
		path.join('/xyz', 'abs')
	];

	before(() => {
		del.sync('tmp');
		makeDir.sync('tmp');

		for (const target of targets) {
			const dest = path.join('tmp/src', target);
			makeDir.sync(dest);
			copyTestFile('fixture/index.html', path.join(dest, 'index.html'));
			copyTestFile('fixture/import.html', path.join(dest, 'import.html'));
		}
	});

	it('single', cb => {
		const stream = vulcanize();

		stream.on('data', file => {
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
			base: path.join(__dirname, 'tmp', 'src'),
			path: path.join('tmp', 'src', 'index.html'),
			contents: fs.readFileSync(path.join('tmp', 'src', 'index.html'))
		}));

		stream.end();
	});

	it('multiple', cb => {
		const stream = vulcanize();

		stream.on('data', file => {
			const t = path.dirname(file.path).replace(path.join(file.cwd, 'tmp', 'src'), '');
			assert.notStrictEqual(targets.indexOf(t), -1);
			assert(/Imported/.test(file.contents.toString()));
		});

		stream.on('end', cb);

		targets.forEach(el => {
			stream.write(new gutil.File({
				cwd: __dirname,
				base: path.join(__dirname, 'tmp', 'src'),
				path: path.join(__dirname, 'tmp', 'src', el, 'index.html'),
				contents: fs.readFileSync(path.join(__dirname, 'tmp', 'src', 'index.html'))
			}));
		});

		stream.end();
	});
});
