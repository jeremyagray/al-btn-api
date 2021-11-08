/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2021 Jeremy A Gray <gray@flyquackswim.com>.
 */

'use strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');

const chai = require('chai');
const expect = chai.expect;
// const chaiHttp = require('chai-http');

// chai.use(chaiHttp);

const RefreshToken = require('../models/refreshToken.js');
const authMiddleware = require('../middleware/authentication.js');

describe('refresh token middleware', async function() {

  before('clear the test database', async function() {
    await RefreshToken().deleteMany({});

    return;
  });

  after('clear the test database', async function() {
    await RefreshToken().deleteMany({});

    return;
  });

  it('should generate a refresh token', async function() {
    try {
      const refreshToken = await authMiddleware.generateRefreshToken({
        '_id': mongoose.Types.ObjectId(),
        'email': 'jd@example.net'
      });

      expect(refreshToken).to.be.a('object');
      expect(refreshToken._id.toString()).to.be.equal(refreshToken.rootId);

      // const isValid = await bcrypt.compare(token, refreshToken.token);
      // expect(isValid).to.be.true;

    } catch (error) {
      console.log(error);
      throw error;
    }
  });
});
