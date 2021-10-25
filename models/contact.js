/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2021 Jeremy A Gray <jeremy.a.gray@gmail.com>.
 */

'use strict';

const mongoose = require('mongoose');

// Contact schema and model.
const contactSchema = new mongoose.Schema(
  {
    'name': {
      'type': String,
      'required': true
    },
    'email': {
      'type': String,
      'required': true
    },
    'message': {
      'type': String,
      'required': true,
    },
    'spam': {
      'type': Boolean,
      'required': true
    }
  });

function contactModel() {
  return mongoose.model('Contact', contactSchema);
}

module.exports = contactModel;
