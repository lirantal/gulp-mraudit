'use strict';

var mraudit = require('../index.js');
var should = require('should');
var gutil = require('gulp-util');
var gulp = require('gulp');

describe('gulp-mraudit plugin tests', function() {
   
   it('should search for eval( in code that is ok and should return successful', function(done) {
       
       // Get the stream object when initializing the gulp plugin with searching
       // for the function mention of eval(
       var searchOptions = {
           errList: {
               search: ['eval(']
           }
       };
       var stream = mraudit(searchOptions);
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
       
   });
   
   it('should search for eval( in code that is ok and should throw an error', function() {
       
       // Get the stream object when initializing the gulp plugin with searching
       // for the function mention of eval(
       var searchOptions = {
           errList: {
               search: ['eval(']
           }
       }
       var stream = mraudit(searchOptions);
       var codeEvil = 'eval(alert(1));'
       
       // Push some line of code into the plugin to process.
       // gutil.File() is a helpful tool for simulating a file streamed to the
       // plugin
       should.throws(function() {
           stream.write(new gutil.File({
               contents: new Buffer(codeEvil)
           }));
       });
       
   });
   
   it('should search using plugin defaults for warnList', function(done) {
       
       // Get the stream object when initializing the gulp plugin with searching
       // for the function mention of eval(
       var stream = mraudit();
       var codeEvil = 'var user = req.body.username;'
       
       // Push some line of code into the plugin to process.
       // gutil.File() is a helpful tool for simulating a file streamed to the
       // plugin

       stream.write(new gutil.File({
           contents: new Buffer(codeEvil)
       }));
       
       stream.on('data', function(file) {
          file.contents.toString().should.equal(codeEvil);
          done(); 
       });

   });
   
   it('should search using plugin defaults for errList', function() {
       
       // Get the stream object when initializing the gulp plugin with searching
       // for the function mention of eval(
       var stream = mraudit();
       var codeEvil = 'var user = eval();'
       
       // Push some line of code into the plugin to process.
       // gutil.File() is a helpful tool for simulating a file streamed to the
       // plugin

       should.throws(function() {
           stream.write(new gutil.File({
               contents: new Buffer(codeEvil)
           }));
       })
       
   });
   
   it('should search and support multiple text strings to match for errList', function() {
       
       var searchOptions = {
           errList: {
               search: ['eval(', 'setTimeout(']
           }
       }
       var stream = mraudit(searchOptions);
       var codeEvil = 'var a = "a"; setTimeout(function() { console.log(a); }, 1000);';
       
       should.throws(function() {
           stream.write(new gutil.File({
               contents: new Buffer(codeEvil)
           }));
       });
       
   });
   
   it('should search and support multiple text strings to match for warnList', function(done) {
       
       var searchOptions = {
           warnList: {
               search: ['abc', 'setTimeout(']
           }
       }
       var stream = mraudit(searchOptions);
       var codeEvil = 'var a = "a"; setTimeout(function() { console.log(a); }, 1000);';
       
       stream.write(new gutil.File({
           contents: new Buffer(codeEvil)
       }));
       
       // Validate we receive the data back
       // It doesn't raise an exception because this is a warnList match
       stream.on('data', function(file) {
          file.contents.toString().should.equal(codeEvil);
          done();
       });
       
   });
   
   it('should search and support multiple text strings to match for warnList', function(done) {
       
       var count = 1;
       var searchOptions = {
           warnList: {
               search: ['abc', 'setTimeout('],
               onFound: function() {
                 count = count + 1;
               }
           }
       }
       var stream = mraudit(searchOptions);
       var codeEvil = 'var a = "a"; setTimeout(function() { console.log(a); }, 1000);';
       
       stream.write(new gutil.File({
           contents: new Buffer(codeEvil)
       }));
       
       // Validate we receive the data back
       // It doesn't raise an exception because this is a warnList match
       stream.on('data', function(file) {
          file.contents.toString().should.equal(codeEvil);
          count.should.equal(2);
          done();
       });
       
   });
   
   it('should search and support regex notation in search array', function() {
       
       var count = 1;
       var searchOptions = {
           errList: {
               search: ['abc', /setTimeout\(/],
               onFound: function() {
                 count = count + 1;
               }
           }
       }
       var stream = mraudit(searchOptions);
       var codeEvil = 'var a = "a"; setTimeout(function() { console.log(a); }, 1000);';
       
       should.throws(function() {
           stream.write(new gutil.File({
               contents: new Buffer(codeEvil)
           }));    
       });
       
   });
   
   it('should search for a match and not find it', function(done) {
       
       // Get the stream object when initializing the gulp plugin with searching
       // for the function mention of eval(
       var stream = mraudit();
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
       
   });
   
   it('should not process anything if no file is provided', function(done) {
       
       // Get the stream object when initializing the gulp plugin with searching
       // for the function mention of eval(
       var stream = mraudit();
       var codeOk = 'var a = 1;'
       
       // Push some line of code into the plugin to process.
       // gutil.File() is a helpful tool for simulating a file streamed to the
       // plugin
       stream.write(new gutil.File({
           contents: ''
       }));
       
       // Validate we receive the data back
      stream.on('data', function(file) {
          should.not.exist(file._contents);
          done();
      });
       
   });
   
   it('should not process a stream because its not supported', function(done) {
      
      gulp.src(__dirname + '/test.js', {buffer: false})
          .pipe(mraudit())
          .on('error', function (err) {
            err.message.should.eql('Streaming not supported');
            done();
          });
   });
   
   it('should throw an error if an object is not passed to mraudit', function() {
       
       // Get the stream object when initializing the gulp plugin with searching
       // for the function mention of eval(
       var stream = mraudit('hello');
       var codeEvil = 'var user = eval();'
       
       // Push some line of code into the plugin to process.
       // gutil.File() is a helpful tool for simulating a file streamed to the
       // plugin

       should.throws(function() {
           stream.write(new gutil.File({
               contents: new Buffer(codeEvil)
           }));
       });
       
   });
    
});
