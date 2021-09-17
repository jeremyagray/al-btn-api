/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2020-2021 Jeremy A Gray <gray@flyquackswim.com>.
 */

'use strict';

const {check, validationResult} = require('express-validator');

const logger = require('../middleware/logger.js');

// Validation error handlers.  Reuse everywhere.
exports.validationErrorReporterJSON = function(request, response, next) {
  // Grab errors.
  const errors = validationResult(request);

  if (request.params.num) {
    logger.debug(`validation num:  ${request.params.num}`);
  } else {
    logger.debug('validation num:  no num in request');
  }

  if (request.body.url) {
    logger.debug(`validation url:  ${request.body.url}`);
  } else {
    logger.debug('validation url:  no URL in request');
  }

  if (request.body.title) {
    logger.debug(`validation title:  ${request.body.title}`);
  } else {
    logger.debug('validation title:  no title in request');
  }

  // Bail on errors.
  if (! errors.isEmpty()) {
    logger.debug('validation failed');
    return response
      .status(400)
      .json({'error': 'invalid URL'});
  }

  // Continue if no errors.
  next();
};

// Validation rules.
exports.validateNumber = [
  check('num')
    .notEmpty()
    .escape()
    .stripLow(true)
    .trim()
    .isNumeric()
    .isInt({'min': 1})
    .withMessage('`num` should be a number.')
];

exports.validateURL = [
  check('url')
    .notEmpty()
    .stripLow(true)
    .trim()
    .isURL({'require_valid_protocol': true})
    .withMessage('url should be a valid URL.')
];

exports.validateTitle = [
  check('title')
    .stripLow(true)
    .trim()
    .isString()
    .withMessage('title should be a string.')
];
