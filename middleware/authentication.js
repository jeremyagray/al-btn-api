/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2021 Jeremy A Gray <gray@flyquackswim.com>.
 */

'use strict';

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const accessTokenExtractor = require('passport-jwt').ExtractJwt.fromAuthHeaderAsBearerToken();

// Middleware.
const logger = require('../middleware/logger.js');

// Models.
const User = require('../models/user.js');

const AccessTokenStrategy = new JwtStrategy(
  {
    'secretOrKey': 'secret',
    'jwtFromRequest': accessTokenExtractor,
    'issuer': 'http://localhost:3200',
    'audience': 'http://localhost:3001'
  },
  async function (payload, done) {
    try {
      const user = User().findOne({ 'accountId': payload.sub }).exec();

      if (user) {
        return done(null, user);
      }

      return done(null, false);
    } catch (error) {
      logger.info(error);
      done(error);
    }
  }
);

exports.AccessTokenStrategy = AccessTokenStrategy;
