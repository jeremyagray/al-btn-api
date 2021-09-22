/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2020-2021 Jeremy A Gray <jeremy.a.gray@gmail.com>.
 */

'use strict';

const express = require('express');
const router = express.Router();

const validation = require('../middleware/validation.js');

const countyController = require('../controllers/county.js');

router.get('/all',
  countyController.getAll
);

router.get('/fips/:fips',
  validation.validateFips,
  validation.validationErrorReporterJSON,
  countyController.getByFips
);

router.get('/code/:code',
  validation.validateCode,
  validation.validationErrorReporterJSON,
  countyController.getByCode
);

module.exports = router;
