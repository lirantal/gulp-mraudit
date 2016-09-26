'use strict';

var contains = require('gulp-contains');

var defaults = {
  search: [
    ' req.body.',
    'eval(',
    'child_process.exec(',
    'setTimeout(',
    'setInterval('
  ]
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
    
  return contains(options);
}

module.exports = mraudit;
