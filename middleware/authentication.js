/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2021 Jeremy A Gray <gray@flyquackswim.com>.
 */

'use strict';

const crypto = require('crypto');
const jose = require('jose');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const accessTokenExtractor = require('passport-jwt').ExtractJwt.fromAuthHeaderAsBearerToken();
const refreshTokenExtractor = require('passport-jwt').ExtractJwt.fromAuthHeaderAsBearerToken();

// Middleware.
const logger = require('../middleware/logger.js');

// Models.
const User = require('../models/user.js');
const RefreshToken = require('../models/refreshToken.js');

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

const accessSecret = 'this is a super duper secret';
const refreshSecret = 'this is another super duper secret';
// const encryptSecret = 'this is yet another super duper secret';

const generateAccessToken = async (payload) => {
  logger.debug('middleware/authentication.js:generateAccessToken: generating access token');

  try {
    const accessToken = await jwt.sign(payload, accessSecret, { 'expiresIn': '86400s' });

    return accessToken;
  } catch (error) {
    logger.debug(`middleware/authentication.js:generateAccessToken: ${error}`);

    return;
  }
};

exports.generateAccessToken = generateAccessToken;

// Generate a new refresh token in the provided token family.
const generateRefreshToken = async (user, rootTokenId = null, ip = '127.0.0.1') => {
  logger.debug('middleware/authentication.js:generateRefreshToken: generating refresh token');

  try {
    const token = await crypto.randomBytes(64).toString('hex');
    const encryptSecret = await jose.generateSecret('A256GCM');

    const refreshToken = await RefreshToken().create({
      'rootId': rootTokenId,
      'token': token,
      'userId': user._id,
      'createdByIp': ip,
    });

    const encryptedToken = await new jose.EncryptJWT({
      'userId': user._id,
      'email': user.email,
      'token': token,
    })
      .setIssuedAt(refreshToken.createdAt.getTime())
      .setIssuer('flyquackswim.com/al-btn')
      .setExpirationTime(`${refreshToken.expiresAt - refreshToken.createdAt}s`)
      .setProtectedHeader({
        'alg': 'dir',
        'enc': 'A256GCM'
      })
      .encrypt(encryptSecret);

    return encryptedToken;
  } catch (error) {
    logger.debug(`middleware/authentication.js:generateRefreshToken: ${error}`);

    return;
  }
};

exports.generateRefreshToken = generateRefreshToken;

// Replace a refresh token.
const replaceRefreshToken = async (token, newTokenId, ip) => {
  logger.debug('middleware/authentication.js:replaceRefreshToken: replacing refresh token');

  try {
    let refreshToken = await RefreshToken().findOne({
      'token': token
    });

    refreshToken = await refreshToken.update({
      'revokedAt': Date.now(),
      'replacedById': newTokenId,
      'revokedByIp': ip
    });

    return refreshToken;
  } catch (error) {
    logger.debug(`middleware/authentication.js:replaceRefreshToken: ${error}`);

    return;
  }
};

exports.replaceRefreshToken = replaceRefreshToken;

// Revoke a refresh token.
const revokeRefreshToken = async (token, ip) => {
  logger.debug('middleware/authentication.js:revokeRefreshToken: revoking refresh token');

  try {
    let refreshToken = await RefreshToken().findOne({
      'token': token
    });

    refreshToken = await refreshToken.update({
      'revokedAt': Date.now(),
      'revokedByIp': ip
    });

    return refreshToken;
  } catch (error) {
    logger.debug(`middleware/authentication.js:revokeRefreshToken: ${error}`);

    return;
  }
};

exports.revokeRefreshToken = revokeRefreshToken;

// Revoke a refresh token familiy.
const revokeRefreshTokenFamily = async (token, ip) => {
  logger.debug('middleware/authentication.js:revokeRefreshTokenFamily: revoking refresh token family');

  try {
    const refreshToken = await RefreshToken().findOne({
      'token': token
    });

    const tokenFamily = await RefreshToken().find({
      'rootId': refreshToken.rootId
    });

    let revoked = 0;
    for (let i = 0; i < tokenFamily.length; i++) {
      // eslint-disable-next-line security/detect-object-injection
      if (! tokenFamily[i].revokedAt) {
        // eslint-disable-next-line security/detect-object-injection
        revokeRefreshToken(tokenFamily[i].token, ip);
        revoked++;
      }
    }

    return revoked;
  } catch (error) {
    logger.debug(`middleware/authentication.js:revokeRefreshTokenFamily: ${error}`);

    return;
  }
};

exports.revokeRefreshTokenFamily = revokeRefreshTokenFamily;

const authenticateAccessToken = async (token, cb) => {
  try {
    return cb(null, { '_id': token._id, 'email': token.email });
  } catch (error) {
    cb(error, null);
  }
};

const AccessTokenStrategy = new JwtStrategy(
  {
    'secretOrKey': accessSecret,
    'jwtFromRequest': accessTokenExtractor
  },
  authenticateAccessToken
);

exports.AccessTokenStrategy = AccessTokenStrategy;
