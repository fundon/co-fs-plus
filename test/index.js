var fs = require('..');
var co = require('co');

co(function *() {
  var b = yield fs.readdir('../')
  console.log(b);
})();

