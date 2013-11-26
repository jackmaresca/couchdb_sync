'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/
var request = require('request');

exports.couchdb = {
  setUp: function(done) { done(); },

  document: function(test) {
    test.expect(1);
    request.get('http://localhost:5984/cars/d4',function( err, response, body){
      var attachments = JSON.parse(body)._attachments;
      test.equal("text/javascript", attachments["js/app.js"] .content_type,'js file in correct path with content type');
      test.done();
    });
  },

  app_js: function(test) {
    test.expect(1);
    request.get('http://localhost:5984/cars/d4/js/app.js',function( err, response, body){
      test.equal('text/javascript', response.headers['content-type'] , 'js file in correct path with content type');
      test.done();
    });
  },
};
