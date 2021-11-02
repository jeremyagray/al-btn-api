/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2021 Jeremy A Gray <jeremy.a.gray@gmail.com>.
 */

'use strict';

const mongoose = require('mongoose');

// User schema and model.
const userSchema = new mongoose.Schema(
  {
    'firstName': {
      'type': String,
      'required': true
    },
    'lastName': {
      'type': String,
      'required': true
    },
    'email': {
      'type': String,
      'required': true
    },
    'salt': {
      'type': String,
      'required': true
    },
    'password': {
      'type': String,
      'required': true
    },
    'activated': {
      'type': Boolean,
      'required': true,
      'default': false
    }
  });

function userModel() {
  return mongoose.model('User', userSchema);
}

module.exports = userModel;
