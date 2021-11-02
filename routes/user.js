/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2020-2021 Jeremy A Gray <jeremy.a.gray@gmail.com>.
 */

'use strict';

const express = require('express');
const router = express.Router();

const validation = require('../middleware/validation.js');

const userController = require('../controllers/user.js');

router.post('/new',
  validation.validateFirstName,
  validation.validateLastName,
  validation.validateEmail,
  validation.validatePassword,
  validation.validatePasswordToo,
  validation.validationErrorReporterJSON,
  userController.createUser
);

module.exports = router;
