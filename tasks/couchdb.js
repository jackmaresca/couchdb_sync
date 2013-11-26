/*
 * couchdb
 * https://github.com/fbehrens/grunt_couchdb
 *
 * Copyright (c) 2013 Frank Behrens
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('couchdb', 'uploads a directory into one couch document with many attachments', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var done = this.async();


    // Iterate over all specified file groups.
    this.files.forEach(function(f) {

      var result = {};
      f.src.forEach(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
        } else {
          result[filepath] = {
            "content_type": "text/html",
            "data":         new Buffer(grunt.file.read(filepath)).toString('base64')
          };
        }
      });
      result = JSON.stringify(result)
      //console.log(result);

      var opts = {
        uri:    f.couch,
        method: 'PUT',
        body:    result
      };

      require('request')(opts, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(response.statusCode)
          console.log(body) // Print the google web page.
        }
      });

      // Print a success message.
      grunt.log.writeln('uploaded to "' + f.couch );
    });
  });

};
