/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2021 Jeremy A Gray <gray@flyquackswim.com>.
 */

'use strict';

const Contact = require('../models/contact.js');
const logger = require('../middleware/logger.js');

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

async function postMessage(request, response) {
  logger.debug('request:  POST /api/v1/contact/message');

  try {
    const messageModel = new Contact();
    const message = await messageModel.create({
      'name': request.body.contactName,
      'email': request.body.contactEmail,
      'message': request.body.contactMessage,
      'spam': request.body.contactSpam,
    });

    if (message.spam) {
      logger.info('POST /api/v1/contact spam contact detected');

      return response
        .status(200)
        .json({
          'message': 'Thanks!'
        });
    }

    return response
      .status(200)
      .json({
        'message': 'Thanks for contacting us!'
      });
  } catch (error) {
    logger.error(`POST /api/v1/contact had an error: ${error.message}`);
    return response
      .status(500)
      .json({
        'error': 'server error'
      });
  }
}

exports.postMessage = postMessage;
