# co-fs-plus [![Build Status](https://travis-ci.org/fundon/co-fs-plus.svg)](https://travis-ci.org/fundon/co-fs-plus)

  [co-fs](https://github.com/visionmedia/co-fs) plus, supports `fs.walk` `fs.mkdirp` `fs.readdir` `fs.rimraf`.

## Installation

```
$ npm install co-fs-plus
```

## Example

```js
var files = yield fs.walk('/opt/boxen');
var files = yield fs.walk('.', {
  followSymlinks: true
});

var files = yield fs.readdir('/opt/boxen', {   // Recursively, excudes hidden files.
  filterFilename: function (filename) {
    return filename[0] != '.';
  }
}, []);

var res = yield fs.mkdirp('web/js/jquery');

yield fs.rimraf('web/js/jquery');
```

## APIs

  `fs.walk(path, [options], [arr])`

  `fs.readdir(path, [options], [arr])`

  `fs.mkdirp(path, [mode])`

  `fs.rimraf(path, [mode])`, based on [rimraf][]

## License

  MIT

[rimraf]: https://github.com/isaacs/rimraf
