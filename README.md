# co-fs-plus

  [co-fs](https://github.com/visionmedia/co-fs) plus, supprots `fs.walk` `fs.mkdirp` walk a directory tree.

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
```

## APIs

  `fs.walk(path, [options], [arr])`

  `fs.readdir(path, [options], [arr])`

  `fs.mkdirp(path, [mode])`

## License

  MIT
