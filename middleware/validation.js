/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2020-2021 Jeremy A Gray <gray@flyquackswim.com>.
 */

'use strict';

const {check, validationResult} = require('express-validator');

const logger = require('../middleware/logger.js');

// Reusable validation functions.

const checkEmail = (str) => {
  return check(str)
    .notEmpty()
    .escape()
    .stripLow(true)
    .trim()
    .isEmail()
    .withMessage(`\`${str}\` should be a non-empty email address.`)
    .normalizeEmail();
};

const checkString = (str) => {
  return check(str)
    .escape()
    .stripLow(true)
    .trim()
    .notEmpty()
    .withMessage(`\`${str}\` should be a non-empty string.`);
};

const checkLatitude = (queryStr) => {
  return check(queryStr)
    .notEmpty()
    .escape()
    .stripLow(true)
    .trim()
    .isNumeric()
    .withMessage(`\`${queryStr}\` should be a latitude between -90 and 90, inclusive.`);
};

const checkLongitude = (queryStr) => {
  return check(queryStr)
    .notEmpty()
    .escape()
    .stripLow(true)
    .trim()
    .isNumeric()
    .withMessage(`\`${queryStr}\` should be a longitude between -180 and 180, inclusive.`);
};

// Validation error handlers.  Reuse everywhere.
exports.validationErrorReporterJSON = function(request, response, next) {
  // Grab errors.
  const errors = validationResult(request);

  // Bail on errors.
  if (! errors.isEmpty()) {
    logger.debug('input validation failed');
    return response
      .status(400)
      .json({'error': 'input validation failed'});
  }

  // Continue if no errors.
  next();
};

// Validation rules.
exports.validateFips = [
  check('fips')
    .notEmpty()
    .escape()
    .stripLow(true)
    .trim()
    .isNumeric()
    .withMessage('`fips` should be a five-digit numerical string.')
];

exports.validateCode = [
  check('code')
    .notEmpty()
    .escape()
    .stripLow(true)
    .trim()
    .isNumeric()
    .withMessage('`code` should be a number between 1 and 67, inclusive.')
];

exports.validateGeoId = [
  check('geoid')
    .notEmpty()
    .escape()
    .stripLow(true)
    .trim()
    .isNumeric()
    .isLength({'min': '2', 'max': '2'})
    .withMessage('`geoid` should be a two-digit GEOID number.')
];

exports.validateUSPS = [
  check('usps')
    .notEmpty()
    .escape()
    .stripLow(true)
    .trim()
    .isAlpha()
    .isLength({'min': '2', 'max': '2'})
    .withMessage('`usps` should be a two-letter USPS state abbreviation.')
];

exports.validateDistance = [
  check('distance')
    .notEmpty()
    .escape()
    .stripLow(true)
    .trim()
    .isFloat({'min': '0', 'max': '15000000'})
    .withMessage('`distance` should be a number, in meters.')
];

exports.validateStation = [
  check('station')
    .notEmpty()
    .escape()
    .stripLow(true)
    .trim()
    .isAlpha()
    .isLength({'min': '4', 'max': '4'})
    .withMessage('`station` should be a four-letter radar station ID.')
];

exports.validateContactName = [
  checkString('contactName')
];

exports.validateContactEmail = [
  checkEmail('contactEmail')
];

exports.validateContactMessage = [
  checkString('contactMessage')
];

exports.validateContactSpam = [
  check('contactSpam')
    .notEmpty()
    .escape()
    .stripLow(true)
    .trim()
    .isBoolean()
    .withMessage('`contactSpam` should be a boolean.')
];

exports.validateWestLong = [
  checkLongitude('westLon')
];

exports.validateEastLong = [
  checkLongitude('eastLon')
];

exports.validateNorthLat = [
  checkLatitude('northLat')
];

exports.validateSouthLat = [
  checkLatitude('southLat')
];
