var co = require('co');
var fs = require('..');

describe('.walk()', function () {
  it('should work', function (done) {
    co(function *() {
      var files = yield fs.walk('test/fixtures')
      files.should.have.length(1);
      files[0].should.equal('test/fixtures/msg.txt');
    })(done);
  });
});

