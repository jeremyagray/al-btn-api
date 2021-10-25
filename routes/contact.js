/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2020-2021 Jeremy A Gray <jeremy.a.gray@gmail.com>.
 */

'use strict';

const express = require('express');
const router = express.Router();

const validation = require('../middleware/validation.js');

const contactController = require('../controllers/contact.js');

router.post('/message',
  validation.validateContactName,
  validation.validateContactEmail,
  validation.validateContactMessage,
  validation.validateContactSpam,
  validation.validationErrorReporterJSON,
  contactController.postMessage
);

module.exports = router;
