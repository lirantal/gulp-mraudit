'use strict';

var gulp = require('gulp');
var mraudit = require('./index.js');

var options = {
  warnList: {
    search: [
      ' req.body.'
    ],
    onFound: function (string, file) { 
      var error = 'Warning: Your file contains "' + string + '", it should not.';
      console.log(error);
    }
  },
  errList: {
    search: [
      'eval(',
      'child_process.exec(',
      'setTimeout(',
      'setInterval('
    ],
    onFound: function (string, file) { 
      var error = 'Error: Your file contains "' + string + '", it should not.';
      console.log(error);
    }
  }
};

gulp.task('contains', function() {
  gulp.src('gulpfile.js').pipe(mraudit(options));
});
