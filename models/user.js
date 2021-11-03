/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2021 Jeremy A Gray <jeremy.a.gray@gmail.com>.
 */

'use strict';

const bcrypt = require('bcrypt');
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

userSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(this.password, salt);

  this.password = hash;
});

userSchema.methods.isValidPassword = async function (password) {
  const isValid = await bcrypt.compare(password, this.password);

  return isValid;
};

function userModel() {
  return mongoose.model('User', userSchema);
}

module.exports = userModel;
