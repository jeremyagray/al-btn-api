/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2021 Jeremy A Gray <gray@flyquackswim.com>.
 */

'use strict';

const County = require('../models/countyGeo.js');
const Nation = require('../models/nationGeo.js');
const State = require('../models/stateGeo.js');
const logger = require('../middleware/logger.js');

/*
 * Custom errors.
 *
 */

/*
 * Utility functions.
 *
 */

/*
 * Route functions.
 *
 */

async function getNation(request, response) {
  logger.debug('request:  GET /api/v1/geography/nation');

  try {
    const usa = await Nation()
      .findOne({'name': 'United States'}, {'_id': false, '__v': false})
      .exec();
    return response.json({
      'type': 'FeatureCollection',
      'features' : [usa.feature]
    });
  } catch {
    return response
      .status(500)
      .json({
        'error': 'server error'
      });
  }
}

exports.getNation = getNation;

async function getAllStates(request, response) {
  logger.debug('request:  GET /api/v1/geography/states/all');

  try {
    const states = await State()
      .find({}, {'_id': false, '__v': false})
      .sort({'name': 1})
      .exec();

    let statesCollection = {
      'type': 'FeatureCollection',
      'crs': {
        'type': 'name',
        'properties': {
          'name': 'urn:ogc:def:crs:EPSG::4269'
        }
      },
      'features' : []
    };

    for (let i = 0; i < states.length; i++) {
      statesCollection.features.push({
        'type': 'Feature',
        'properties': {
          // eslint-disable-next-line security/detect-object-injection
          'geoid': states[i].geoid,
          // eslint-disable-next-line security/detect-object-injection
          'name': states[i].name,
          // eslint-disable-next-line security/detect-object-injection
          'usps': states[i].usps
        },
        // eslint-disable-next-line security/detect-object-injection
        'geometry': states[i].geometry
      });
    }

    return response
      .status(200)
      .json(statesCollection);
  } catch {
    return response
      .status(500)
      .json({
        'error': 'server error'
      });
  }
}

exports.getAllStates = getAllStates;

async function getStatesAdjacentByUsps(request, response) {
  logger.debug(`request:  GET /api/v1/geography/states/adjacent/usps/${request.params.usps}`);

  try {
    const state = await State()
      .findOne(
        {'usps': request.params.usps.toUpperCase()},
        {'neighbors': true}
      ).exec();

    return response
      .status(200)
      .json(state.neighbors);
  } catch {
    return response
      .status(500)
      .json({
        'error': 'server error'
      });
  }
}

exports.getStatesAdjacentByUsps = getStatesAdjacentByUsps;

const getStatesAround = async (request, response) => {
  logger.debug(`request:  GET /api/v1/geography/states/around/${request.params.usps}/distance/${request.params.distance}`);

  try {
    const state = await State()
      .findOne(
        {'usps': request.params.usps.toUpperCase()},
        {'_id': false, '__v': false, 'name': false, 'geoid': false, 'usps': false, 'geometry': false}
      ).exec();

    const states = await State()
      .find({
        '$and': [
          { 'usps': {'$ne': request.params.usps.toUpperCase()}},
          {
            'geometry': {
              '$near': {
                '$geometry': state.centroid,
                '$maxDistance': request.params.distance
              }
            }
          }
        ]
      },
      { '_id': false, '__v': false })
      .exec();

    let statesCollection = {
      'type': 'FeatureCollection',
      'crs': {
        'type': 'name',
        'properties': {
          'name': 'urn:ogc:def:crs:EPSG::4269'
        }
      },
      'features' : []
    };

    for (let i = 0; i < states.length; i++) {
      // eslint-disable-next-line security/detect-object-injection
      statesCollection.features.push({
        'type': 'Feature',
        'properties': {
          // eslint-disable-next-line security/detect-object-injection
          'geoid': states[i].geoid,
          // eslint-disable-next-line security/detect-object-injection
          'name': states[i].name,
          // eslint-disable-next-line security/detect-object-injection
          'usps': states[i].usps
        },
        // eslint-disable-next-line security/detect-object-injection
        'geometry': states[i].geometry
      });
    }

    return response
      .status(200)
      .json(statesCollection);
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json({
        'error': 'server error'
      });
  }
};

exports.getStatesAround = getStatesAround;

const getStatesWithin = async (request, response) => {
  logger.debug(`request:  GET /api/v1/geography/states/within/${request.params.usps}/distance/${request.params.distance}`);

  try {
    const state = await State()
      .findOne(
        {'usps': request.params.usps.toUpperCase()},
        {'_id': false, '__v': false, 'name': false, 'geoid': false, 'usps': false, 'geometry': false}
      ).exec();

    const states = await State()
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

    let statesCollection = {
      'type': 'FeatureCollection',
      'crs': {
        'type': 'name',
        'properties': {
          'name': 'urn:ogc:def:crs:EPSG::4269'
        }
      },
      'features' : []
    };

    for (let i = 0; i < states.length; i++) {
      // eslint-disable-next-line security/detect-object-injection
      statesCollection.features.push({
        'type': 'Feature',
        'properties': {
          // eslint-disable-next-line security/detect-object-injection
          'geoid': states[i].geoid,
          // eslint-disable-next-line security/detect-object-injection
          'name': states[i].name,
          // eslint-disable-next-line security/detect-object-injection
          'usps': states[i].usps
        },
        // eslint-disable-next-line security/detect-object-injection
        'geometry': states[i].geometry
      });
    }

    return response
      .status(200)
      .json(statesCollection);
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json({
        'error': 'server error'
      });
  }
};

exports.getStatesWithin = getStatesWithin;

exports.getAllStatesInfo = async (request, response) => {
  logger.debug('request:  GET /api/v1/geography/states/all/info');

  try {
    const states = await State()
      .find({}, {'_id': false, '__v': false, 'geometry': false})
      .sort({'geoid': 1})
      .exec();

    return response
      .status(200)
      .json(states);
  } catch {
    return response
      .status(500)
      .json({
        'error': 'server error'
      });
  }
};

async function getStateByUsps(request, response) {
  logger.debug('request:  GET /api/v1/geography/states/usps/:usps');

  try {
    const state = await State()
      .findOne(
        {'usps': request.params.usps.toUpperCase()},
        {'_id': false, '__v': false}
      ).exec();
    return response
      .status(200)
      .json({
        'type': 'FeatureCollection',
        'crs': {
          'type': 'name',
          'properties': {
            'name': 'urn:ogc:def:crs:EPSG::4269'
          }
        },
        'features' : [{
          'type': 'Feature',
          'properties': {
            'geoid': state.geoid,
            'name': state.name,
            'usps': state.usps
          },
          'geometry': state.geometry
        }]});
  } catch {
    return response
      .status(500)
      .json({
        'error': 'server error'
      });
  }
}

exports.getStateByUsps = getStateByUsps;

async function getStateByGeoId(request, response) {
  logger.debug('request:  GET /api/v1/geography/states/geoid/:geoid');

  try {
    const state = await State()
      .findOne(
        {'geoid': request.params.geoid},
        {'_id': false, '__v': false}
      ).exec();
    return response
      .status(200)
      .json({
        'type': 'FeatureCollection',
        'crs': {
          'type': 'name',
          'properties': {
            'name': 'urn:ogc:def:crs:EPSG::4269'
          }
        },
        'features' : [{
          'type': 'Feature',
          'properties': {
            'geoid': state.geoid,
            'name': state.name,
            'usps': state.usps
          },
          'geometry': state.geometry
        }]});
  } catch {
    return response
      .status(500)
      .json({
        'error': 'server error'
      });
  }
}

exports.getStateByGeoId = getStateByGeoId;

const getStateCentroidByUsps = async (request, response) => {
  logger.debug(`request:  GET /api/v1/geography/states/centroid/usps/${request.params.usps}`);

  try {
    const state = await State()
      .findOne(
        {'usps': request.params.usps.toUpperCase()},
        {'_id': false, '__v': false, 'name': false, 'geoid': false, 'usps': false, 'geometry': false}
      ).exec();

    console.log(state);
    return response
      .status(200)
      .json(state.centroid);
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json({
        'error': 'server error'
      });
  }
};

exports.getStateCentroidByUsps = getStateCentroidByUsps;

async function getAllCountiesForStateByUSPS(request, response) {
  logger.debug('request:  GET /api/v1/geography/counties/state/usps/:usps/all');

  try {
    const counties = await County()
      .find({'usps': request.params.usps.toUpperCase()}, {'_id': false, '__v': false})
      .exec();
    let countiesCollection = {
      'type': 'FeatureCollection',
      'features' : []
    };

    for (let i = 0; i < counties.length; i++) {
      // eslint-disable-next-line security/detect-object-injection
      countiesCollection.features.push(counties[i].feature);
    }

    return response
      .status(200)
      .json(countiesCollection);
  } catch {
    return response
      .status(500)
      .json({
        'error': 'server error'
      });
  }
}

exports.getAllCountiesForStateByUSPS = getAllCountiesForStateByUSPS;
