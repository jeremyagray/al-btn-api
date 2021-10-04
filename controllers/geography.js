/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2021 Jeremy A Gray <gray@flyquackswim.com>.
 */

'use strict';

const County = require('../models/county.js');
const Nation = require('../models/nation.js');
const State = require('../models/state.js');
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
