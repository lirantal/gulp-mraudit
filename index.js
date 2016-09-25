'use strict';

var contains = require('gulp-contains');
var defaults = {
    search: [
        ' req.body.',
        'eval(',
        'child_process.exec('
    ]
}

/**
 * @param  {opts}    an array of options
 */
function mraudit(opts) {
    
    var options = defaults;
    if (Object.prototype.toString.call(opts) === '[object Array]' && opts.length > 0) {
        options = { 
            search: opts
        };
    }
    
    return contains(options);
};

module.exports = mraudit;
