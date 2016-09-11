Mr. Audit validates secure code guidelines and security best practices for
JavaScript projects.

# About

gulp-mraudit is a gulp plugin that ties into the build process and will scan
specified JavaScript files to ensure that they conform with security best
practices.

This gulp plugin extends gulp-contains for searching specific strings in files.

# Example

# Install

```bash
npm install gulp-mraudit --save
```

# Configuration


# Security Best Practices

Out of the box Mr Audit is configured to assert the following list of security
best practices:
| Option | Description |
| --- | --- |
| req.body. | Potential noSQ injection with the use of directly using parsed
JSON objects in ExpressJS's `req.body`. This warning can be wavered if the
object being accessed was already sanitized and filtered before. Or if ExpressJS
does not use the `bodyParser` middleware for `json` or `urlencoded` options. |
| child_process.exec( | Potential OS command injection due to the use of
directly calling a command line option with `.exec` where the first argument
is the name of a command, which could potentially be originated from user 
manipulated input. |
| eval( | Interpreting JavaScript code in real-time could on potential user
manipulated input could.|


# Author

Liran Tal <liran.tal@gmail.com>
