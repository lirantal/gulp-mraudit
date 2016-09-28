'use strict';

var gulp = require('gulp');
var mraudit = require('./index.js');

gulp.task('contains', function() {
  gulp.src('gulpfile.js').pipe(mraudit());
});
