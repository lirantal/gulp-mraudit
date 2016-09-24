'use strict';

var gulp = require('gulp');
var mraudit = require('./index.js');

gulp.task('contains', function() {
  var opts = ['req.body.', 'eval(', 'child_process.exec('];
  gulp.src('gulpfile.js').pipe(mraudit(opts));
});
