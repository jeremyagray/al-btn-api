/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2021 Jeremy A Gray <gray@flyquackswim.com>.
 */

'use strict';

// Middleware.
const logger = require('../middleware/logger.js');

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

const emailAvailable = async (email) => {
  const user = await User().findOne({'email': email}).exec();
  if (user === {}) {
    return true;
  }

  return false;
};

/*
 * Route functions.
 *
 */

const createUser = async (request, response) => {
  logger.debug('request:  POST /api/v1/users/new');

  try {
    if (emailAvailable(request.body.email)
        && request.body.password === request.body.passwordToo) {

      const userModel = new User();
      await userModel.create({
        'firstName': request.body.firstName,
        'lastName': request.body.lastName,
        'email': request.body.email,
        'password': request.body.password
      });

    }
    return response.json({
      'message': 'Check the provided email for activation instructions.  Thanks!'
    });
  } catch (error) {
    logger.error(`POST /api/v1/users/new user creation failed: ${error}`);
    return response
      .status(500)
      .json({
        'error': 'user creation failed'
      });
  }
};

exports.createUser = createUser;
