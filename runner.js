/* SPDX-License-Identifier: MIT
 *
 * Copyright 2020 Jeremy A Gray <jeremy.a.gray@gmail.com>.
 */

'use strict';

const EventEmitter = require('events');
const Mocha = require('mocha');
const mocha = new Mocha();
const fs = require('fs');
const path = require('path');

// Configuration variables.
// Location of tests.
const testDir = './tests';

// Add the JavaScript files in testDir to mocha.
// eslint-disable-next-line security/detect-non-literal-fs-filename
fs.readdirSync(testDir).filter((file) => {
  return file.substr(-3) === '.js';
}).forEach((file) => {
  mocha.addFile(path.join(testDir, file));
});

// Get a new event emitter.
const emitter = new EventEmitter();  
// Define run() for use in server.js as runner.run().
emitter.run = function() {
  // Configure the interface and run the tests.
  mocha
    .ui('bdd')
    .run();
};

module.exports = emitter;
