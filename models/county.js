/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2020-2021 Jeremy A Gray <jeremy.a.gray@gmail.com>.
 */

'use strict';

const mongoose = require('mongoose');

// Create a URL schema and model.
const countySchema = new mongoose.Schema(
  {
    'name': {
      'type': String,
      'required': true
    },
    'cname': {
      'type': String,
      'required': true
    },
    'fips': {
      'type': String,
      'required': true,
      'unique': true,
    },
    'seat': {
      'name': {
        'type': String,
        'required': true
      },
      'geoid': {
        'type': String,
        'required': true
      },
      'location': {
        'type': {
          'type': 'String',
          'enum': ['Point'],
          'required': true
        },
        'coordinates': {
          'type': [Number],
          'required': true
        }
      }
    },
    'established': {
      'type': Date,
      'required': true
    },
    'code': {
      'type': String,
      'required': true
    }
  });

function countyModel() {
  return mongoose.model('County', countySchema);
}

module.exports = countyModel;
