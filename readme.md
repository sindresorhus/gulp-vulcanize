# [gulp](https://github.com/wearefractal/gulp)-vulcanize [![Build Status](https://secure.travis-ci.org/sindresorhus/gulp-vulcanize.png?branch=master)](http://travis-ci.org/sindresorhus/gulp-vulcanize)

> Concatenate a set of Web Components into one file with [Vulcanize](https://github.com/Polymer/vulcanize)

*Issues with the output should be reported on the Vulcanize [issue tracker](https://github.com/Polymer/vulcanize/issues).*


## Install

Install with [npm](https://npmjs.org/package/gulp-vulcanize)

```
npm install --save-dev gulp-vulcanize
```


## Example

```js
var gulp = require('gulp');
var vulcanize = require('gulp-vulcanize');

gulp.task('default', function () {
	gulp.src('src/index.html')
		.pipe(vulcanize({dest: 'dist'}))
		.pipe(gulp.dest('dist'));
});
```


## API

### vulcanize(options)

Same as [grunt-vulcanize](https://github.com/Polymer/grunt-vulcanize#options) plus the below.

#### options.dest

Type: `String`

The destination directory.

Unfortunately needed to get correct relative paths in the output.


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
