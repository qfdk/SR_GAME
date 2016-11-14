var assert = require('assert');
var server= require('./server.js')

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, server.test());
    });
  });
});

// server.test()