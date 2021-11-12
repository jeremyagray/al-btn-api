/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2020-2021 Jeremy A Gray <gray@flyquackswim.com>.
 */

'use strict';

const express = require('express');
const passport = require('passport');
const router = express.Router();

// Middleware.
const validation = require('../middleware/validation.js');
const PasswordStrategy = require('../middleware/authentication.js').PasswordStrategy;
const TokenStrategy = require('../middleware/authentication.js').TokenStrategy;
const serializeUser = require('../middleware/authentication.js').serializeUser;
const deserializeUser = require('../middleware/authentication.js').deserializeUser;

// Controllers.
const authController = require('../controllers/authentication.js');

passport.use(PasswordStrategy);
passport.use(TokenStrategy);
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

router.post('/login/password',
  validation.validateEmail,
  validation.validatePassword,
  validation.validationErrorReporterJSON,
  passport.authenticate('local'),
  function(request, response) {
    return response.json({ 'message': 'successful login' });
  }
);

router.post('/login/initializeTokens',
  validation.validateEmail,
  validation.validatePassword,
  validation.validationErrorReporterJSON,
  authController.initializeTokens
);

router.post('/login/accessToken',
  authController.authenticateAccessToken
);

router.post('/login/refreshTokens',
  authController.refreshTokens
);

module.exports = router;
