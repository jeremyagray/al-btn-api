/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2020-2021 Jeremy A Gray <jeremy.a.gray@gmail.com>.
 */

'use strict';

const express = require('express');
const router = express.Router();

const validation = require('../middleware/validation.js');

const weatherController = require('../controllers/weather.js');

router.get('/nws/alert/colors/all',
  weatherController.getNwsAlertColors
);

module.exports = router;
