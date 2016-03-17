# gulp-vulcanize [![Build Status](https://travis-ci.org/sindresorhus/gulp-vulcanize.svg?branch=master)](https://travis-ci.org/sindresorhus/gulp-vulcanize)

> Concatenate a set of Web Components into one file with [`Vulcanize`](https://github.com/Polymer/vulcanize)

*Issues with the output should be reported on the `Vulcanize` [issue tracker](https://github.com/Polymer/vulcanize/issues).*


## Install

```
$ npm install --save-dev gulp-vulcanize
```


## Usage

```js
const gulp = require('gulp');
const vulcanize = require('gulp-vulcanize');

gulp.task('default', () =>
	gulp.src('src/index.html')
		.pipe(vulcanize({
			abspath: '',
			excludes: [],
			stripExcludes: false
		}))
		.pipe(gulp.dest('dest'))
);
```


## API

### vulcanize([options])

See the `Vulcanize` [options](https://github.com/Polymer/vulcanize#using-vulcanize-programmatically).


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
