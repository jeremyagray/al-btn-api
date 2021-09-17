/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2020-2021 Jeremy A Gray <gray@flyquackswim.com>.
 */

'use strict';

// References:
//
// https://thoughtbot.com/blog/testing-your-style-with-eslint-and-mocha
// https://eslint.org/docs/developer-guide/nodejs-api#eslint-class

const chai = require('chai');
const expect = chai.expect;
const { ESLint } = require('eslint');

function formatMessages(messages) {
  return messages.map((msg) => {
    return `${msg.line}:${msg.column}: ${msg.message} [${msg.ruleId}]`;
  }).join('\n');
}

async function generateTest(result) {
  it(`${result.filePath} should lint`, function() {
    if (result.messages.length > 0) {
      expect.fail(false, true, formatMessages(result.messages));
    }
  });
}

(async function lint() {
  const eslint = new ESLint();
  const results = await eslint.lintFiles('**/*.js');

  describe('linting tests', async function() {
    results.forEach(async function(result) {
      await generateTest(result);
    });
  });
})();
