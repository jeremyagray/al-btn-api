/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2021 Jeremy A Gray <gray@flyquackswim.com>.
 */

'use strict';

// Middleware.
const logger = require('../middleware/logger.js');
const authentication = require('../middleware/authentication.js');
const generateToken = require('../middleware/authentication.js').generateToken;

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

const authenticateForToken = async (request, response) => {
  logger.debug('request:  POST /api/v1/auth/login/initialize-token');

  try {
    const user = await User().findOne({'email': request.body.email}).exec();

    if (user && user.isValidPassword(request.body.password)) {
      const token = await generateToken({ '_id': user._id, 'email': user.email });

      return response
        .status(200)
        .json({
          'message': 'authentication succeeded',
          'token': token
        });
    }

    return response
      .status(401)
      .json({
        'message': 'authentication failed',
        'token': null
      });
  } catch (error) {
    logger.error(`POST /api/v1/auth/login/initialize-token authentication error: ${error}`);

    return response
      .status(500)
      .json({
        'message': 'authentication error'
      });
  }
};

exports.authenticateForToken = authenticateForToken;
