var fs = require('..');
var co = require('co');

co(function *() {
  var files = yield fs.walk('../')
  console.log(files);

  var files = yield fs.readdir('.', {   // Recursively, excudes hidden files.
    filterFilename: function (filename) {
      return filename[0] != '.';
    }
  }, []);
  console.log(files);
})();

