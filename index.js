'use strict';

var through = require('through2');
var gutil = require('gulp-util');

var defaults = {
  warnList: {
    search: [
      ' req.body.'
    ],
    onFound: function (string, file) { 
      var error = 'Warning: Your file ' + file.history + ' contains "' + string + '", it should not.';
      // eslint-disable-next-line no-console
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
      var error = 'Warning: Your file ' + file.history + ' contains "' + string + '", it should not.';
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }
};

/**
 * @param  {opts}    an array of options
 */
function mraudit (opts) {

  // Use default module settings, or apply opts which came from the user when
  // instantiating this module
  var settings;
  
  // Sanity check the options passed to the gulp plugin
  // Use plugin defaults, confirm it's an object, or otherwise throw an error
  if (!opts) {
    settings = defaults;
  } else if (opts !== null && typeof opts === 'object') {
    settings = opts;
  } else {
    return new gutil.PluginError('gulp-mraudit', 'expecting an object as parameter to function');
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

    // Process the warnList
    if (settings.hasOwnProperty('warnList') && settings.warnList.hasOwnProperty('search') &&
         Object.prototype.toString.call(settings.warnList.search) === '[object Array]')  {
      findMatch(settings.warnList, file, enc);
    }
    
    // Process the errList
    if (settings.hasOwnProperty('errList') && settings.errList.hasOwnProperty('search') &&
         Object.prototype.toString.call(settings.errList.search) === '[object Array]')  {
      var match = findMatch(settings.errList, file, enc);
      if (match) {
        gulpError(match, file, cb);
      }
    }
  
    cb(null, file);
  });
	
}


function findMatch(list, file, enc) {
  // Iterate through the array of strings to find a match,
  // upon which we should call the handler callback for displaying
  // a console msg
  
  for (var i = 0; i <= list.search.length; i++) {
    var match = findString(file.contents.toString(enc), list.search[i]);
    if (match) {
      list.onFound(match, file);
      return match;
    }
  }
  
  return false;
}

function findString(haystack, needle) {
  if (typeof needle === 'string') {
    return haystack.indexOf(needle) !== -1 ? needle : false;
  }
	
  if (needle instanceof RegExp) {
    return haystack.match(needle) ? needle : false;
  }

  return false;
}

function gulpError(string, file, cb) {
  var error = 'Your file contains "' + string + '", it should not.';
  cb(new gutil.PluginError('gulp-mraudit', error));
}

module.exports = mraudit;
