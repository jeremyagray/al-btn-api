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

// router.get('/states/all',
//   geoController.getAllStates
// );

// router.get('/states/geoid/:geoid',
//   geoController.getByGeoId
// );

// router.get('/states/name/:name',
//   geoController.getByName
// );

// router.get('/states/usps/:usps',
//   geoController.getByUsps
// );

module.exports = router;
