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

router.get('/states/adjacent/usps/:usps',
  validation.validateUSPS,
  geoController.getStatesAdjacentByUsps
);

router.get('/states/around/:usps/distance/:distance',
  validation.validateUSPS,
  validation.validateDistance,
  validation.validationErrorReporterJSON,
  geoController.getStatesAround
);

router.get('/states/within/:usps/distance/:distance',
  validation.validateUSPS,
  validation.validateDistance,
  validation.validationErrorReporterJSON,
  geoController.getStatesWithin
);

router.get('/states/all/info',
  geoController.getAllStatesInfo
);

router.get('/states/geoid/:geoid',
  validation.validateGeoId,
  validation.validationErrorReporterJSON,
  geoController.getStateByGeoId
);

router.get('/states/usps/:usps',
  validation.validateUSPS,
  validation.validationErrorReporterJSON,
  geoController.getStateByUsps
);

router.get('/states/centroid/usps/:usps',
  validation.validateUSPS,
  validation.validationErrorReporterJSON,
  geoController.getStateCentroidByUsps
);

router.get('/counties/state/usps/:usps/all',
  validation.validateUSPS,
  validation.validationErrorReporterJSON,
  geoController.getAllCountiesForStateByUSPS
);

module.exports = router;
