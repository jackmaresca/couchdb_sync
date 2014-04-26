/*
 * couchdb_sync
 * https://github.com/jackmaresca/couchdb_sync
 *
 * Copyright (c) 2013 Frank Behrens
 * Licensed under the MIT license.
 */

'use strict';
var fs = require('fs');



function content_type (filepath){
  var extension = filepath.split('.').pop();
  var prefix = "text/";
  if ( extension === "js" ){
    extension = "javascript";
  }
  if(extension === "zip")
	  prefix="application/"
  return prefix + extension;
}

module.exports = function(grunt) {
  grunt.registerMultiTask('couchdb_sync', 'uploads a directory into one couch document with many attachments', function() {

    var done = this.async();


    this.files.forEach(function(f) {
      var nano = require('nano')(f.dest);
      
      f.src.forEach(function(filepath) {
    	  var filename = filepath.split(/(\\|\/)/g).pop();
    	  grunt.log.writeln('filepath "' + filepath );
    	  nano.get(f.doc, function(err, body2) {
    		  if (!err){
        	    fs.readFile(filepath, function(err2, data) {
            	  if (!err2) {
            	    nano.attachment.insert(f.doc, filename, data, content_type(filepath),
            	    { rev:body2._rev }, function(err3, body) {
            	        if (!err3)
            	          console.log(body);
            	    });
            	  }
            	 });
    	  		}else if(err.error==='not_found'){
    	  			//CREATE DOC
            	    fs.readFile(filepath, function(err2, data) {
                  	  if (!err2) {
                  	    nano.attachment.insert(f.doc, filename, data, content_type(filepath),
                  	     function(err3, body) {
                  	        if (!err3)
                  	          console.log(body);
                  	    });
                  	  }
                  	 });   	  			
	
    	  		}
    	  		done();
    	  });
      });

      grunt.log.writeln('upload to "' + f.dest );

    });
  });
};
