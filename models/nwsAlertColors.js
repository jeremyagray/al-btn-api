/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2021 Jeremy A Gray <jeremy.a.gray@gmail.com>.
 */

'use strict';

const mongoose = require('mongoose');

// NWS Alert Colors schema and model.
const nwsAlertColorsSchema = new mongoose.Schema(
  {
    'event': {
      'type': String,
      'required': true
    },
    'priority': {
      'type': Number,
      'required': true
    },
    'color': {
      'type': String,
      'required': true
    }
  });

function nwsAlertColorsModel() {
  return mongoose.model('nwsAlertColors', nwsAlertColorsSchema);
}

module.exports = nwsAlertColorsModel;
