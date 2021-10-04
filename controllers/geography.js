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
      .exec();
    let statesCollection = {
      'type': 'FeatureCollection',
      'features' : []
    };

    for (let i = 0; i < states.length; i++) {
      statesCollection.features.push(states[i].feature);
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
