/**
 *  Modules dependencies.
 */

var co = require('co');
var ofs = require('fs');    // Original `fs`
var fs = require('co-fs');
var path = require('path');
var rimraf_ = require('rimraf');

var join = path.join;
var resolve = path.resolve;
var dirname = path.dirname;
var realpath = fs.realpath;
var readFile = fs.readFile;
var oreaddir = ofs.readdir; // Original `fs.readdir`
var olstat = ofs.lstat;     // Oreaddir `fs.lstat`

/**
 *  Expose `fs`
 */

module.exports = exports = fs;


/**
 *  Expose `walk(path, [options], [arr])`.
 */

fs.walk = walk;

/**
 *  Return a list of all files in the directory.
 *
 *  Examples:
 *
 *      var files = yield fs.walk('/opt/boxen');
 *      var files = yield fs.walk('/opt/boxen', {
 *        followSymlinks: true
 *      });
 *
 *  @param {String} path
 *  @param {Object} options
 *  @param {Array} arr
 *  @return {Array} arr 
 *  @api public
 */

function walk(path, options, arr) {
  if (!options) options = {};
  if (!arr) arr = [];
  return function (done) {
    olstat(path, function (err, stat) {
      if (err) return done(err);
      co(function *() {
        if (options.followSymlinks && stat.isSymbolicLink()) {
          path = yield realpath(path);
          yield walk(path, options, arr);
        } else if (stat.isDirectory()) {
          yield readdir(path, options, arr);
        } else if (stat.isFile()) {
          arr.push(path);
        }
        return arr;
      })(done);
    });
  };
}

/**
 *  Expose `readdir(path, [options], [arr])`.
 */

fs.readdir = readdir;

/**
 *  Return an array of filenames in the directory.
 *
 *  Examples:
 *
 *      var files = yield fs.readdir('./');
 *      var files = yield fs.readdir('./', null, []);  // Recursive!
 *      var files = yield fs.readdir('/opt/boxen', {   // Excudes hidden files.
 *        filterFilename: function (filename) {
 *          return filename[0] != '.';
 *        }
 *      }, []);
 *
 *  @param {String} path
 *  @param {Object} options
 *  @param {Array} arr
 *    - When arr is an array, recursively walk directory trees.
 *  @return {Array} arr
 *  @api public
 */

function readdir(path, options, arr) {
  var filter = (options && options.filterFilename || function () { return true; });
  return function (done) {
    oreaddir(path, function (err, filenames) {
      if (err) return done(err);
      if (!arr) return done(null, filenames);
      co(function *() {
        var filename;
        while ((filename = filenames.shift())) {
          if (filter(filename)) {
            yield walk(join(path, filename), options, arr)
          }
        }
        return arr;
      })(done);
    });
  };
}

/**
 *  Expose `mkdirp(path, [mode])`.
 */

fs.mkdirp = mkdirp;

/**
 *  Recursively mkdir, like `mkdir -p`
 *
 *  Examples:
 *
 *    var res = fs.mkdirp('./web/js/jquery')
 *
 *  @param {String} path
 *  @param {Number|String} mode
 *  @return {Object}
 *    - { path: 'last made directory' }
 *    - { path: 'last made directory', error: 'mkdir error' }
 *  @api public
 */

function mkdirp(path, mode, arr) {
  if (!mode) {
    mode = 0777 & (~process.umask());
  } else if (typeof  mode === 'string') {
    mode = parseInt(mode, 8);
  }
  if (!arr) arr = [];
  path = resolve(path);

  function *getPaths(path, arr) {
    try {
      var stat = yield fs.stat(path);
      if (!stat || (stat && !stat.isDirectory())) {
        arr.unshift(path);
      }
    } catch (e) {
      arr.unshift(path);
      path = dirname(path);
      yield getPaths(path, arr);
    }
    return arr;
  }

  function *mkp(p) {
    while ((p = arr.shift())) {
      try {
        yield fs.mkdir(p, mode);
        path = p;
      } catch (e) {
        if (e.code === 'EEXIST') continue;
        return e;
      }
    }
  }

  return function (done) {
    co(function *() {
      arr = yield getPaths(path, arr);
      var err = yield mkp();
      var res = { path: path };
      if (err) res.error = res;
      return res;
    })(done);
  };
}

/**
 *  Expose `rimraf(path)`.
 */

fs.rimraf = rimraf;

/**
 *
 *  Recursively rm dir, like `rm -rf`
 *
 *  Examples:
 *
 *    var res = fs.rimraf('./web/js/jquery')
 *
 *  @param {String} string
 *  @api public
 */

function rimraf(path) {
  return function (done) {
    rimraf_(path, function (err) {
      if (err) return done(err);
      done(null);
    });
  };
}
