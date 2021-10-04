/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2021 Jeremy A Gray <gray@flyquackswim.com>.
 */

'use strict';

const mongoose = require('mongoose');

// Use the API State model.
const State = require('../models/state.js');

// The processed county data.
const states = require('../public/data/census/states-geo.json');

async function load() {
  // Configure mongoose.
  const MONGO_URI = 'mongodb://localhost:27017/albtn';
  const MONGOOSE_OPTIONS = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  };

  try {
    // Initialize mongoose connection.
    await mongoose.connect(MONGO_URI, MONGOOSE_OPTIONS);

    // Batch update county documents.
    const stateModel = State();
    await stateModel.deleteMany({}).exec();
    for (let i = 0; i < states.features.length; i++) {
      await stateModel.create({
        'name': states.features[i].properties.NAME,
        'usps': states.features[i].properties.STUSPS,
        'feature': states.features[i]
      });
    }
  } catch (error) {
    console.error(error);
  }

  // Disconnect for clean exit.
  await mongoose.disconnect();

  return;
}

(async function() {
  await load(); 
  return;
})();
