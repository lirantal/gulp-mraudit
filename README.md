[![view on npm](http://img.shields.io/npm/v/gulp-mraudit.svg)](https://www.npmjs.org/package/gulp-mraudit)
[![view on npm](http://img.shields.io/npm/l/gulp-mraudit.svg)](https://www.npmjs.org/package/gulp-mraudit)
[![npm module downloads](http://img.shields.io/npm/dt/gulp-mraudit.svg)](https://www.npmjs.org/package/gulp-mraudit)
[![Dependency Status](https://david-dm.org/lirantal/gulp-mraudit.svg)](https://david-dm.org/lirantal/gulp-mraudit)
[![Build](https://travis-ci.org/lirantal/gulp-mraudit.svg?branch=master)](https://travis-ci.org/lirantal/gulp-mraudit)
[![Coverage Status](https://coveralls.io/repos/lirantal/gulp-mraudit/badge.svg?branch=master&service=github)](https://coveralls.io/github/lirantal/gulp-mraudit?branch=master)


Mr. Audit validates secure code guidelines and security best practices for
JavaScript projects.

# About

gulp-mraudit is a gulp plugin that ties into the build process and will scan
specified JavaScript files to ensure that they conform with security best
practices.

This gulp plugin extends gulp-contains for searching specific strings in files.

# Example

Add to your Gulpfile a task called `securecode` that ensures there is no use of insecure functions like `eval` or `child_process.exec` in your source code:

```js
gulp.task('securecode', function() {
  var options = {
    errList: {
      search: [
        'eval('
      ],
      onFound: function (string, file) { 
        var error = 'Error: found an occurrence of the code: "' + string;
        console.log(error);
      }
    }
  };
  gulp.src('gulpfile.js').pipe(mraudit(options));
});
```

Then run the task as part of your build process to enforce it:

```bash
$ gulp securecode

lirantal:~/workspace (master) $ gulp securecode
[07:10:58] Using gulpfile ~/workspace/gulpfile.js
[07:10:58] Starting 'securecode'...
[07:10:58] Finished 'securecode' after 12 ms

events.js:141
      throw er; // Unhandled 'error' event
      ^
Error: Your file contains "eval(", it should not.
```

## Gulp Example

The project itself includes a [gulpfile.js](https://github.com/lirantal/gulp-mraudit/blob/master/gulpfile.js) in the root directory as an example of an operational Gulpfile.

# Install

```bash
npm install gulp-mraudit --save
```

# Configuration

The plugin expects to receive an object with two properties: `warnList` and an `errList`.
This granularity is provided so that project owners can provide callbacks, and warnings when a match is found in the file for any string in the `warnList`, and can entirely break the build if the `errList` is matched.

Simple object example:

```js
var options = {
  warnList: {
    search: [
      ' req.body.'
    ]
  },
  errList: {
    search: [
      'eval(',
      'child_process.exec(',
      'setTimeout(',
      'setInterval('
    ]
  }
};
```

It is also possible to provide an `onFound` property for each of the `errList` and `warnList` properties so that you can completely customize any kind of callback function trigger that happens when a match is found in either case.


# Security Best Practices

Out of the box Mr Audit is configured to assert the following list of security
best practices:

Option | Description |
--- | --- |
`req.body.` | Potential noSQ injection with directly using parsed JSON objects in ExpressJS's `req.body`. This warning can be wavered if the object being accessed was already sanitized and filtered before. Or if ExpressJS does not use the `bodyParser` middleware for `json` or `urlencoded` options.
`child_process.exec(` | Potential OS command injection due to the use of directly calling a command line option with `.exec` where the first argument is the name of a command, which could potentially be originated from user manipulated input.
`eval(` | Interpreting JavaScript code in real-time on potential user manipulated input could result in malicious JavaScript code executed in the context of the application and complete access to the user's browser.
`setTimeout(`, `setInterval(` | Both of these functions can result in malicious JavaScript injection similar to how `eval(` is dangerous to use.


# Author

Liran Tal <liran.tal@gmail.com>
