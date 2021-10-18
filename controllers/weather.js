/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2021 Jeremy A Gray <gray@flyquackswim.com>.
 */

'use strict';

const nwsAlertColors = require('../models/nwsAlertColors.js');
const Radar = require('../models/radar.js');
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

const getNwsAlertColors = async (request, response) => {
  logger.debug('request:  GET /api/v1/weather/alert/colors/all');

  try {
    const colors = await nwsAlertColors()
      .find({}, {'_id': false, '__v': false})
      .sort({'priority': 1})
      .exec();

    return response.json({
      'length': colors.length,
      'colors': colors
    });
  } catch {
    logger.error('GET /api/v1/weather/alert/colors all failed to return documents');
    return response
      .status(500)
      .json({
        'error': 'server error'
      });
  }
};

exports.getNwsAlertColors = getNwsAlertColors;

const getRadarsAll = async (request, response) => {
  logger.debug('request:  GET /api/v1/weather/radars/all');

  try {
    const radars = await Radar()
      .find({}, {'station': true, '_id': false})
      .exec();

    return response.json({
      'length': radars.length,
      'stations': radars
    });
  } catch {
    logger.error('GET /api/v1/weather/colors all failed to return documents');
    return response
      .status(500)
      .json({
        'error': 'server error'
      });
  }
};

exports.getRadarsAll = getRadarsAll;
