/*
 * couchdb
 * https://github.com/fbehrens/grunt_couchdb
 *
 * Copyright (c) 2013 Frank Behrens
 * Licensed under the MIT license.
 */

'use strict';
var request = require('request');

function couch_update(url, object, done){
  request.get({url: url}, function(error, response, body){
    if (response.statusCode == 200){
      var rev = JSON.parse(body)._rev
      console.log("last revision = " + rev );
      object._rev = rev;
    };

    request.put({url: url, body: JSON.stringify(object)},function(error, response, body){
      console.log("response = " + response.statusCode );
      done();
    });
  });
};

module.exports = function(grunt) {
  grunt.registerMultiTask('couchdb', 'uploads a directory into one couch document with many attachments', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var done = this.async();
    this.files.forEach(function(f) {
      var result = {},
          start_at = f.orig.src[0].length - 6;

      f.src.forEach(function(filepath) {
          result[filepath.substring(start_at,200)] = {
            "content_type": "text/html",
            "data":         new Buffer(grunt.file.read(filepath)).toString('base64')
          };
      });

      grunt.log.writeln('upload to "' + f.dest );
      couch_update(f.dest, result, done);
    });
  });
};
