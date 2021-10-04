/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2020-2021 Jeremy A Gray <jeremy.a.gray@gmail.com>.
 */

'use strict';

// eslint-disable-next-line no-unused-vars
const GeoJSON = require('mongoose-geojson-schema');
const mongoose = require('mongoose');

// Create a state schema and model.
const stateSchema = new mongoose.Schema(
  {
    'name': {
      'type': String,
      'required': true
    },
    'usps': {
      'type': String,
      'required': true
    },
    'feature': mongoose.Schema.Types.Feature
  });

function stateModel() {
  return mongoose.model('State', stateSchema);
}

module.exports = stateModel;
