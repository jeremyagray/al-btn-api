/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2021 Jeremy A Gray <gray@flyquackswim.com>.
 */

'use strict';

const jose = require('jose');
const mongoose = require('mongoose');

const chai = require('chai');
const expect = chai.expect;

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
      const key = await authMiddleware.createEncryptionKey();
      const id = mongoose.Types.ObjectId().toString();
      const email = 'jd@example.net';
      const refreshToken = await authMiddleware.generateRefreshToken({
        '_id': id,
        'email': email
      });

      expect(refreshToken).to.be.a('string');

      const { payload, protectedHeader } = await jose.jwtDecrypt(refreshToken, key, { 'issuer': 'flyquackswim.com/al-btn' });
      expect(payload).to.be.a('object');
      expect(payload.userId).to.be.equal(id);
      expect(payload.email).to.be.equal(email);
      expect(payload.iss).to.be.equal('flyquackswim.com/al-btn');

      expect(protectedHeader).to.be.a('object');
      expect(protectedHeader.alg).to.be.equal('dir');
      expect(protectedHeader.enc).to.be.equal('A256GCM');
    } catch (error) {
      console.log(error);
      throw error;
    }
  });
});
