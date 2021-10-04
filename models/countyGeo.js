/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2020-2021 Jeremy A Gray <jeremy.a.gray@gmail.com>.
 */

'use strict';

require('mongoose-geojson-schema');
const mongoose = require('mongoose');

// Create a county schema and model.
const countySchema = new mongoose.Schema(
  {
    'name': {
      'type': String,
      'required': true
    },
    'fips': {
      'type': String,
      'required': true
    },
    'usps': {
      'type': String,
      'required': true
    },
    'feature': mongoose.Schema.Types.Feature
  });

function countyModel() {
  return mongoose.model('CountyBoundary', countySchema);
}

module.exports = countyModel;
