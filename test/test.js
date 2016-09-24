'use strict';

var mraudit = require('../index.js');
var should = require('should');
var gutil = require('gulp-util');

describe('gulp-mraudit plugin tests', function() {
   
   it('sanity test for the gulp plugin', function(done) {
       
       // Get the stream object when initializing the gulp plugin with searching
       // for the function mention of eval(
       var stream = mraudit(['eval(']);
       var codeOk = 'var a = 1;'
       
       // Push some line of code into the plugin to process.
       // gutil.File() is a helpful tool for simulating a file streamed to the
       // plugin
       stream.write(new gutil.File({
           contents: new Buffer(codeOk)
       }));
       
       // Validate we receive the data back
       stream.on('data', function(file) {
          file.contents.toString().should.equal(codeOk);
          done();
       });
       
   })
   
   it('sanity test for the gulp plugin', function() {
       
       // Get the stream object when initializing the gulp plugin with searching
       // for the function mention of eval(
       var stream = mraudit(['eval(']);
       var codeEvil = 'eval(alert(1));'
       
       // Push some line of code into the plugin to process.
       // gutil.File() is a helpful tool for simulating a file streamed to the
       // plugin
       should.throws(function() {
           stream.write(new gutil.File({
               contents: new Buffer(codeEvil)
           }));
       })
       
   })
    
});
