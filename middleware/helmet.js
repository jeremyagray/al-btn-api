/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2020-2021 Jeremy A Gray <gray@flyquackswim.com>.
 */

'use strict';

const helmet = require('helmet');

exports.config = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: [
        '\'self\''
      ],
      scriptSrc: [
        '\'self\''
      ],
      styleSrc: [
        '\'self\''
      ]
    }},
  referrerPolicy: {
    policy: 'same-origin'
  },
  frameguard: {
    action: 'sameorigin'
  }});
