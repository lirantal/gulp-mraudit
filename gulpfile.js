'use strict';

var gulp = require('gulp');
var mraudit = require('./index.js');

var options = {
  warnList: {
    search: [
      ' req.body.'
    ],
    onFound: function (string, file) { 
      var error = 'Warning: Your file ' + file.history + ' contains "' + string + '", it should not.';
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
      var error = 'Error: Your file ' + file.history + ' contains "' + string + '", it should not.';
      console.log(error);
    }
  }
};

gulp.task('audit', function() {
  gulp.src('package.json').pipe(mraudit(options));
});
