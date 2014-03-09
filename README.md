# co-fs-plus

  `co-fs` plus, supprots `fs.walk(path)` walk a directory tree.

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
```

## APIs

  `fs.walk(path, [options], [arr])`

  `fs.readdir(path, [options], [arr])`

## License

  MIT
