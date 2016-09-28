'use strict';

var through = require('through2');
var gutil = require('gulp-util');

var defaults = {
  search: [
    ' req.body.',
    'eval(',
    'child_process.exec(',
    'setTimeout(',
    'setInterval('
  ],
  onFound: function (string, file, cb) {
    var error = 'Your file contains "' + string + '", it should not.';
    cb(new gutil.PluginError('gulp-mraudit', error));
  }
};

/**
 * @param  {opts}    an array of options
 */
function mraudit (opts) {

  // Use default module settings, or apply opts which came from the user when
  // instantiating this module
  var options = defaults;
  if (Object.prototype.toString.call(opts) === '[object Array]' && opts.length > 0) {
    options = { 
      search: opts
    };
  }
    
  return through.obj(function (file, enc, cb) {
    
    // Nothing to do with an empty file
    if (file.isNull()) {
      cb(null, file);
      return;
    }

    // Not processing streams because we need to search the entire content
    // of the file to find the relevant string
    if (file.isStream()) {
      cb(new gutil.PluginError('gulp-mraudit', 'Streaming not supported'));
      return;
    }

    // Iterate through the array of strings to find a match,
    // upon which we should call the handler callback for displaying a console
    // msg
    for (var i = 0; i <= options.search.length; i++) {
      var match = findMatch(file.contents.toString(enc), options.search[i]);
      if (match) {
        options.onFound(match, file, cb);
      }
    }

    cb(null, file);
  });
	
}

function findMatch(haystack, needle) {
  if (typeof needle === 'string') {
    return haystack.indexOf(needle) !== -1 ? needle : false;
  }
	
  if (needle instanceof RegExp) {
    return haystack.match(needle) ? needle : false;
  }

  return false;
}

module.exports = mraudit;
