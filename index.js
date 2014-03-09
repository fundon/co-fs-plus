/**
 *  Modules dependencies.
 */

var co = require('co');
var ofs = require('fs'); // Original `fs`
var fs = require('co-fs');
var path = require('path');

var join = path.join;
var resolve = path.resolve;
var realpath = fs.realpath;
var readFile = fs.readFile;
// Original `fs.readdir`
var oreaddir = ofs.readdir;

/**
 *  Expose `fs`
 */

module.exports = exports = fs;


/**
 * Expose `walk(path, [options], [arr])`.
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
    fs.lstat(path, function (err, stat) {
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
        done(null, arr);
      })();
    });
  };
}

/**
 * Expose `readdir(path, [options], [arr])`.
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
        done(null, arr);
      })();
    });
  };
}
