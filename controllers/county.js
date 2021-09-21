/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2021 Jeremy A Gray <gray@flyquackswim.com>.
 */

'use strict';

const County = require('../models/county.js');
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

async function getAll(request, response) {
  logger.debug('request:  GET /api/v1/counties/all');

  try {
    return response.json(await County()
      .find({}, {'_id': false, '__v': false})
      .sort({'fips': 1})
      .exec());
  } catch {
    logger.error('GET /api/v1/counties/all failed to return documents');
    return response
      .status(500)
      .json({
        'error': 'server error'
      });
  }
}

exports.getAll = getAll;
