# gulp-vulcanize [![Build Status](https://travis-ci.org/sindresorhus/gulp-vulcanize.svg?branch=master)](https://travis-ci.org/sindresorhus/gulp-vulcanize)

> Concatenate a set of Web Components into one file with [Vulcanize](https://github.com/Polymer/vulcanize)

*Issues with the output should be reported on the Vulcanize [issue tracker](https://github.com/Polymer/vulcanize/issues).*


## Install

```sh
$ npm install --save-dev gulp-vulcanize
```


## Usage

```js
var gulp = require('gulp');
var vulcanize = require('gulp-vulcanize');

gulp.task('default', function () {
	var DEST_DIR = 'dist';

	return gulp.src('src/index.html')
		.pipe(vulcanize({
			dest: DEST_DIR,
			strip: true
		}))
		.pipe(gulp.dest(DEST_DIR));
});
```


## API

### vulcanize(options)

These [options](https://github.com/Polymer/grunt-vulcanize#options) plus the below.

#### options.dest

*Required*  
Type: `string`

The destination directory.

Unfortunately needed to get correct relative paths in the output.


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
