#!/usr/bin/env node
require('shelljs/global');
require('colors');

require('async').series([
    require('./test-lint'),
    require('./test-unit'),
], function (code) {
    !code && console.info('\npostman-url-encoder tests: all ok!'.green);
    exit(code);
});
