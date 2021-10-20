/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2021 Jeremy A Gray <gray@flyquackswim.com>.
 */

'use strict';

const nwsAlertColors = require('../models/nwsAlertColors.js');
const Radar = require('../models/radar.js');
const State = require('../models/stateGeo.js');
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
          // eslint-disable-next-line security/detect-object-injection
          'wban': radars[i].wban,
          // eslint-disable-next-line security/detect-object-injection
          'station': radars[i].station,
          // eslint-disable-next-line security/detect-object-injection
          'radarType': radars[i].radarType,
          // eslint-disable-next-line security/detect-object-injection
          'location': radars[i].location,
          // eslint-disable-next-line security/detect-object-injection
          'usps': radars[i].usps,
          // eslint-disable-next-line security/detect-object-injection
          'elevation': radars[i].elevation,
          // eslint-disable-next-line security/detect-object-injection
          'towerHeight': radars[i].towerHeight
        },
        // eslint-disable-next-line security/detect-object-injection
        'geometry': radars[i].geometry
      });
    }

    return response
      .status(200)
      .json(radarData);
  } catch {
    logger.error('GET /api/v1/weather/radars/all failed to return documents');
    return response
      .status(500)
      .json({
        'error': 'server error'
      });
  }
};

exports.getRadarsAll = getRadarsAll;

const getRadarsByState = async (request, response) => {
  logger.debug(`request:  GET /api/v1/weather/nws/radars/state/${request.params.usps}`);

  try {
    const radars = await Radar()
      .find(
        {'usps': request.params.usps.toUpperCase()},
        {'_id': false, '__v': false})
      .sort({'station': 1})
      .exec();

    let radarData = [];
    for (let i = 0; i < radars.length; i++) {
      radarData.push({
        'type': 'Feature',
        'properties': {
          // eslint-disable-next-line security/detect-object-injection
          'wban': radars[i].wban,
          // eslint-disable-next-line security/detect-object-injection
          'station': radars[i].station,
          // eslint-disable-next-line security/detect-object-injection
          'radarType': radars[i].radarType,
          // eslint-disable-next-line security/detect-object-injection
          'location': radars[i].location,
          // eslint-disable-next-line security/detect-object-injection
          'usps': radars[i].usps,
          // eslint-disable-next-line security/detect-object-injection
          'elevation': radars[i].elevation,
          // eslint-disable-next-line security/detect-object-injection
          'towerHeight': radars[i].towerHeight
        },
        // eslint-disable-next-line security/detect-object-injection
        'geometry': radars[i].geometry
      });
    }

    return response
      .status(200)
      .json(radarData);
  } catch {
    logger.error(`GET /api/v1/weather/nws/radars/state/${request.params.usps} failed to return documents`);
    return response
      .status(500)
      .json({
        'error': 'server error'
      });
  }
};

exports.getRadarsByState = getRadarsByState;

const getRadarStationsWithin = async (request, response) => {
  logger.debug(`request:  GET /api/v1/weather/radars/within/usps/${request.params.usps}/distance/${request.params.distance}`);

  try {
    const state = await State()
      .findOne(
        {'usps': request.params.usps.toUpperCase()},
        {'_id': false, '__v': false, 'name': false, 'geoid': false, 'usps': false, 'geometry': false}
      ).exec();

    const radars = await Radar()
      .find({
        'geometry': {
          '$near': {
            '$geometry': state.centroid,
            '$maxDistance': request.params.distance
          }
        }
      },
      { '_id': false, '__v': false })
      .exec();

    let radarCollection = {
      'type': 'FeatureCollection',
      'crs': {
        'type': 'NEXRAD Weather Stations',
        'properties': {
          'name': 'urn:ogc:def:crs:EPSG::4269'
        }
      },
      'features' : []
    };

    for (let i = 0; i < radars.length; i++) {
      radarCollection.features.push({
        'type': 'Feature',
        'properties': {
          // eslint-disable-next-line security/detect-object-injection
          'wban': radars[i].wban,
          // eslint-disable-next-line security/detect-object-injection
          'station': radars[i].station,
          // eslint-disable-next-line security/detect-object-injection
          'radarType': radars[i].radarType,
          // eslint-disable-next-line security/detect-object-injection
          'location': radars[i].location,
          // eslint-disable-next-line security/detect-object-injection
          'usps': radars[i].usps,
          // eslint-disable-next-line security/detect-object-injection
          'elevation': radars[i].elevation,
          // eslint-disable-next-line security/detect-object-injection
          'towerHeight': radars[i].towerHeight
        },
        // eslint-disable-next-line security/detect-object-injection
        'geometry': radars[i].geometry
      });
    }

    return response
      .status(200)
      .json(radarCollection);
  } catch (error) {
    logger.error(`GET /api/v1/weather/radars/within/usps/${request.params.usps}/distance/${request.params.distance} failed to return documents`);
    return response
      .status(500)
      .json({
        'error': 'server error'
      });
  }
};

exports.getRadarStationsWithin = getRadarStationsWithin;

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
