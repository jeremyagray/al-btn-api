/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2021 Jeremy A Gray <gray@flyquackswim.com>.
 */

'use strict';

const express = require('express');
const router = express.Router();

const validation = require('../middleware/validation.js');

const geoController = require('../controllers/geography.js');

router.get('/nation',
  geoController.getNation
);

router.get('/states/all',
  geoController.getAllStates
);

router.get('/states/all/info',
  geoController.getAllStatesInfo
);

router.get('/states/geoid/:geoid',
  validation.validateGeoId,
  geoController.getStateByGeoId
);

router.get('/states/usps/:usps',
  validation.validateUSPS,
  validation.validationErrorReporterJSON,
  geoController.getStateByUsps
);

router.get('/counties/state/usps/:usps/all',
  validation.validateUSPS,
  validation.validationErrorReporterJSON,
  geoController.getAllCountiesForStateByUSPS
);

module.exports = router;
