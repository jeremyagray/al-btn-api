/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2021 Jeremy A Gray <gray@flyquackswim.com>.
 */

'use strict';

const jwt = require('jsonwebtoken');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const tokenExtractor = require('passport-jwt').ExtractJwt.fromBodyField('token');

// Middleware.
const logger = require('../middleware/logger.js');

// Models.
const User = require('../models/user.js');

const serializeUser = (user, cb) => {
  cb(null, user._id);
};

exports.serializeUser = serializeUser;

const deserializeUser = async (id, cb) => {
  const userModel = new User();
  try {
    const user = await userModel.findOneById(id).exec();
    cb(null, { '_id': user._id });
  } catch (error) {
    cb(error, null);
  }
};

exports.deserializeUser = deserializeUser;

const authenticatePassword = async (email, password, cb) => {
  const userModel = new User();

  try {
    const user = await userModel.findOne({'email': email}).exec();

    if (user && user.isValidPassword(password)) {
      return cb(null, user);
    }

    return cb(null, false, { 'message': 'authentication failed' });
  } catch (error) {
    cb(error, null);
  }
};

const PasswordStrategy = new Strategy(
  {
    'usernameField': 'email',
    'passwordField': 'password'
  },
  authenticatePassword
);

exports.PasswordStrategy = PasswordStrategy;

const SECRET = 'this is a super duper secret';

const generateToken = async (payload) => {
  logger.debug('middleware/authentication.js:generateToken: generating token');

  try {
    const token = await jwt.sign(payload, SECRET, { 'expiresIn': '86400s' });

    return token;
  } catch (error) {
    logger.debug(`middleware/authentication.js:generateToken: ${error}`);

    return;
  }
}

exports.generateToken = generateToken;

const authenticateToken = async (token, cb) => {
  try {
    return cb(null, { '_id': token._id, 'email': token.email });
  } catch (error) {
    cb(error, null);
  }
};

const TokenStrategy = new JwtStrategy(
  {
    'secretOrKey': SECRET,
    'jwtFromRequest': tokenExtractor
  },
  authenticateToken
);

exports.TokenStrategy = TokenStrategy;
