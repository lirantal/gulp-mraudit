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
  var opts = ['eval(', 'child_process.exec('];
  gulp.src('gulpfile.js').pipe(mraudit(opts));
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

# Install

```bash
npm install gulp-mraudit --save
```

# Configuration


# Security Best Practices

Out of the box Mr Audit is configured to assert the following list of security
best practices:

Option | Description |
--- | --- |
req.body. | Potential noSQ injection with directly using parsed JSON objects in ExpressJS's `req.body`. This warning can be wavered if the object being accessed was already sanitized and filtered before. Or if ExpressJS does not use the `bodyParser` middleware for `json` or `urlencoded` options.
child_process.exec( | Potential OS command injection due to the use of directly calling a command line option with `.exec` where the first argument is the name of a command, which could potentially be originated from user manipulated input.
eval( | Interpreting JavaScript code in real-time could on potential user manipulated input could.|


# Author

Liran Tal <liran.tal@gmail.com>
