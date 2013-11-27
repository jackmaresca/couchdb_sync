/*
 * couchdb_sync
 * https://github.com/fbehrens/couchdb_sync
 *
 * Copyright (c) 2013 Frank Behrens
 * Licensed under the MIT license.
 */

'use strict';
var request = require('request');

function couch_update(url, object, done){
  request.get(url, function(error, response, body){
    if (response.statusCode === 200){
      var rev = JSON.parse(body)._rev;
      console.log("last revision = " + rev );
      object._rev = rev;
    }
    request.put({url: url, body: JSON.stringify(object)},function(error, response, body){
      console.log("response = " + response.statusCode );
      done();
    });
  });
}

function content_type (filepath){
  var extension = filepath.split('.').pop();
  if ( extension === "js" ){
    extension = "javascript";
  }
  return "text/" + extension;
}

module.exports = function(grunt) {
  grunt.registerMultiTask('couchdb_sync', 'uploads a directory into one couch document with many attachments', function() {

    var done = this.async();
    this.files.forEach(function(f) {
      var attachments = {},
          start_at = f.orig.src[0].length - 6;

      f.src.forEach(function(filepath) {
          attachments[filepath.substring(start_at,200)] = {
            "content_type": content_type(filepath),
            "data":         new Buffer(grunt.file.read(filepath)).toString('base64')
          };
      });

      grunt.log.writeln('upload to "' + f.dest );
      couch_update(f.dest, { _attachments: attachments }, done);
    });
  });
};
