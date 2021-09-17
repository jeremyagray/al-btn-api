/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2020-2021 Jeremy A Gray <gray@flyquackswim.com>.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const chai = require('chai');
const expect = chai.expect;

const ignoreDirs = [
  '.git',
  '.nyc_output',
  'coverage',
  'node_modules'
];

function findFiles(dir, ignoreDirs=[], extension='') {
  let files = [];

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  fs.readdirSync(dir).forEach((item) => {
    let abs = path.join(dir, item);
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    if (fs.statSync(abs).isDirectory()
        && (! ignoreDirs.some((igDir) => {
          return abs.startsWith(igDir);
        }))) {
      files = files.concat(findFiles(abs));
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    } else if (fs.statSync(abs).isFile()) {
      files.push(abs);
    }
  });

  if (extension.length > 0) {
    const allowedExtensions = ['js', 'cjs', 'mjs'];
    if (allowedExtensions.includes(extension)) {
      return files.filter((file) => {
        return file.substr(-(extension.length + 1)) === ('.' + extension);
      });
    }
  }

  return files;
}

async function generateTest(file) {
  it(`${file} should contain a license identifier`, function() {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const fileContent = fs.readFileSync(file, {'encoding': 'utf-8'});
    const id = 'SPDX-License-Identifier: MIT';
    const message = `${file} should contain a license identifier.`;

    expect(fileContent).to.include(id, message);
  });
}

(async function license() {
  const files = await findFiles('./', ignoreDirs, 'js');

  describe('license identfier tests', async function() {
    files.forEach(async function(file) {
      await generateTest(file);
    });
  });
})();
