var co = require('co');
var fs = require('..');
var path = require('path');

describe('.walk()', function () {
  it('should work', function (done) {
    co(function *() {
      var files = yield fs.walk('test/fixtures')
      files.should.have.length(1);
      files[0].should.equal('test/fixtures/msg.txt');
    })(done);
  });
});

describe('.mkdirp()', function () {
  it('should work', function (done) {
    co(function *() {
      var res = yield fs.mkdirp('test/a/b/c/d/e/f/g')
      res.path.should.equal(path.resolve('test/a/b/c/d/e/f/g'));
    })(done);
  });
});

