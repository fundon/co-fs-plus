var co = require('co');
var fs = require('..');
var path = require('path');

describe('co-fs-plus', function () {
  describe('.walk()', function () {
    it('should be walked', function (done) {
      co(function *() {
        var files = yield fs.walk('test/fixtures')
        files.should.have.length(1);
        files[0].should.equal('test/fixtures/msg.txt');
      })(done);
    });
  });

  describe('.mkdirp()', function () {
    it('should be maked', function (done) {
      co(function *() {
        var res = yield fs.mkdirp('test/a/b/c/d/e/f/g')
        res.path.should.equal(path.resolve('test/a/b/c/d/e/f/g'));
      })(done);
    });
  });

  describe('.rimraf()', function () {
    it('should be removed', function (done) {
      co(function *() {
        var e0 = yield fs.exists('test/a/b/c/d/e/f/g')
        var res = yield fs.rimraf('test/a')
        var e1 = yield fs.exists('test/a')
        e1.should.equal(!e0);
      })(done);
    });
  });
});
