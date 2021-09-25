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
    const counties = await County()
      .find({}, {'_id': false, '__v': false})
      .sort({'fips': 1})
      .exec();

    return response.json({
      'length': counties.length,
      'counties': counties
    });
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

async function getByFips(request, response) {
  logger.debug(`request:  GET /api/v1/counties/fips/${request.params.fips}`);

  try {
    return response.json(await County()
      .findOne({'fips': request.params.fips}, {'_id': false, '__v': false})
      .exec());
  } catch {
    logger.error(`GET /api/v1/counties/fips/${request.params.fips} failed to return documents`);
    return response
      .status(500)
      .json({
        'error': 'server error'
      });
  }
}

exports.getByFips = getByFips;

async function getByCode(request, response) {
  logger.debug(`request:  GET /api/v1/counties/code/${request.params.code}`);

  try {
    return response.json(await County()
      .findOne({'code': request.params.code}, {'_id': false, '__v': false})
      .exec());
  } catch {
    logger.error(`GET /api/v1/counties/code/${request.params.code} failed to return documents`);
    return response
      .status(500)
      .json({
        'error': 'server error'
      });
  }
}

exports.getByCode = getByCode;
