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
      .find({}, {'_id': false, '__v': false})
      .exec();

    let radarData = [];
    for (let i = 0; i < radars.length; i++) {
      radarData.push({
        'type': 'Feature',
        'properties': {
          'wban': radars[i].wban,
          'station': radars[i].station,
          'radarType': radars[i].radarType,
          'location': radars[i].location,
          'usps': radars[i].usps,
          'elevation': radars[i].elevation,
          'towerHeight': radars[i].towerHeight
        },
        'geometry': radars[i].geometry
      });
    }

    return response
      .status(200)
      .json(radarData);
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

const getRadarByStation = async (request, response) => {
  logger.debug('request:  GET /api/v1/weather/radars/station/${request.params.station}');

  try {
    const station = await Radar()
      .findOne(
        {'station': request.params.station.toUpperCase()},
        {'_id': false, '__v': false})
      .exec();

    return response
      .status(200)
      .json({
        'type': 'Feature',
        'properties': {
          'wban': station.wban,
          'station': station.station,
          'radarType': station.radarType,
          'location': station.location,
          'usps': station.usps,
          'elevation': station.elevation,
          'towerHeight': station.towerHeight
        },
        'geometry': station.geometry
      });
  } catch {
    logger.error(`GET /api/v1/weather/radar/station/${request.params.station} all failed to return documents`);
    return response
      .status(500)
      .json({
        'error': 'server error'
      });
  }
};

exports.getRadarByStation = getRadarByStation;
