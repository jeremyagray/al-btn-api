/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2020-2021 Jeremy A Gray <jeremy.a.gray@gmail.com>.
 */

'use strict';

require('mongoose-geojson-schema');
const mongoose = require('mongoose');

// Create a state schema and model.
const stateSchema = new mongoose.Schema(
  {
    'name': {
      'type': String,
      'required': true
    },
    'geoid': {
      'type': String,
      'required': true,
      'minLength': 2,
      'maxLength': 2
    },
    'usps': {
      'type': String,
      'required': true,
      'minLength': 2,
      'maxLength': 2
    },
    'geometry': mongoose.Schema.Types.Geometry,
    'centroid': mongoose.Schema.Types.Point
  });

stateSchema.index({'geometry': '2dsphere'});

function stateModel() {
  return mongoose.model('StateBoundary', stateSchema);
}

module.exports = stateModel;
