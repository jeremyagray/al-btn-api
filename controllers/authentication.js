/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2021 Jeremy A Gray <gray@flyquackswim.com>.
 */

'use strict';

// Middleware.
const jose = require('jose');
const logger = require('../middleware/logger.js');
const authentication = require('../middleware/authentication.js');
const generateAccessToken = require('../middleware/authentication.js').generateAccessToken;
const generateRefreshToken = require('../middleware/authentication.js').generateRefreshToken;

// Models.
const User = require('../models/user.js');

/*
 * Custom errors.
 *
 */

// class ProtocolError extends Error {
//   constructor(protocol, ...params) {
//     // Call the super.
//     super(...params);

//     // Maintains proper stack trace.
//     if (Error.captureStackTrace) {
//       Error.captureStackTrace(this, ProtocolError);
//     }

//     this.name = 'ProtocolError';
//     this.protocol = protocol;
//     this.message = `${protocol} is not a valid protocol (${ALLOWED_PROTOCOLS}).`;
//     this.date = new Date();
//   }
// }

// exports.ProtocolError;

/*
 * Utility functions.
 *
 */

/*
 * Route functions.
 *
 */

const initializeTokens = async (request, response) => {
  logger.debug(`request:  POST /api/v1/auth/login/initializeTokens for ${request.body.email}`);

  try {
    const user = await User().findOne({'email': request.body.email}).exec();

    if (user && user.isValidPassword(request.body.password)) {
      const accessToken = await generateAccessToken({
        '_id': user._id, 'email': user.email
      });
      const refreshToken = await generateRefreshToken({
        '_id': user._id, 'email': user.email
      });

      logger.debug(`POST /api/v1/auth/login/initializeTokens token initialization for ${request.body.email} successful`);
      return response
        .status(200)
        .json({
          'message': 'authentication succeeded',
          'tokens': {
            'access': accessToken,
            'refresh': refreshToken,
          }
        });
    }

    logger.debug(`POST /api/v1/auth/login/initializeTokens token initialization for ${request.body.email} failed`);
    return response
      .status(401)
      .json({
        'message': 'authentication failed',
        'token': null
      });
  } catch (error) {
    logger.error(`POST /api/v1/auth/login/initializeTokens for ${request.body.email} error: ${error}`);

    return response
      .status(500)
      .json({
        'message': 'authentication error'
      });
  }
};

exports.initializeTokens = initializeTokens;

const refreshTokens = async (request, response) => {
  logger.debug('request:  POST /api/v1/auth/login/refreshTokens');

  try {
    const user = await User().findOne({'email': request.body.email}).exec();

    if (user && user.isValidPassword(request.body.password)) {
      const tokens = await generateRefreshToken({ '_id': user._id, 'email': user.email });

      return response
        .status(200)
        .json({
          'message': 'authentication succeeded',
          'tokens': tokens
        });
    }

    return response
      .status(401)
      .json({
        'message': 'authentication failed',
        'tokens': null
      });
  } catch (error) {
    logger.error(`POST /api/v1/auth/login/refreshTokens authentication error: ${error}`);

    return response
      .status(500)
      .json({
        'message': 'authentication error'
      });
  }
};

exports.refreshTokens = refreshTokens;

const authenticateAccessToken = async (request, response) => {
  logger.debug('request:  POST /api/v1/auth/login/authenticateAccessToken');

  try {
    // get access token
    const accessToken = request.headers['authorization'].split('bearer ')[1];
    // decrypt
    const key = authentication.encryptionKey;
    const { payload } = await jose.jwtDecrypt(accessToken, key, { 'issuer': 'flyquackswim.com/al-btn' });
    // if expired, use refresh
    const exp = new Date(parseInt(payload.exp) * 1000);
    const now = new Date();
    if (exp >= now) {
      // go refresh
    }
    // if valid, authenticate
    const user = await User().findOne({'email': payload.email}).exec();

    logger.debug('request:  POST /api/v1/auth/login/authenticateAccessToken successful');
    return response
      .status(200)
      .json({
        'message': 'authentication succeeded'
      });

    logger.debug('request:  POST /api/v1/auth/login/authenticateAccessToken failed');
    return response
      .status(401)
      .json({
        'message': 'authentication failed',
        'token': null
      });
  } catch (error) {
    logger.error(`POST /api/v1/auth/login/authenticateAccessToken error: ${error}`);

    return response
      .status(500)
      .json({
        'message': 'authentication error'
      });
  }
};

exports.authenticateAccessToken = authenticateAccessToken;
