/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2020-2021 Jeremy A Gray <jeremy.a.gray@gmail.com>.
 */

'use strict';

require('mongoose-geojson-schema');
const mongoose = require('mongoose');

// Create a radar schema and model.
const radarSchema = new mongoose.Schema(
  {
    'wban': {
      'type': String,
      'required': true
    },
    'station': {
      'type': String,
      'required': true
    },
    'radarType': {
      'type': String,
      'required': true
    },
    'location': {
      'type': String,
      'required': true
    },
    'usps': {
      'type': String,
      'required': true,
      'minLength': 2,
      'maxLength': 2
    },
    // feet
    'elevation': {
      'type': Number,
      'required': true
    },
    // meters
    'towerHeight': {
      'type': Number,
      'required': true
    },
    'geometry': mongoose.Schema.Types.Point
  });

radarSchema.index({'geometry': '2dsphere'});

function radarModel() {
  return mongoose.model('RadarLocation', radarSchema);
}

module.exports = radarModel;
