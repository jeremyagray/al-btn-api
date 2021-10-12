/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2021 Jeremy A Gray <gray@flyquackswim.com>.
 */

'use strict';

const mongoose = require('mongoose');
const fs = require('fs');

// Use the API State model.
const State = require('../models/stateGeo.js');

async function load() {
  // Configure mongoose.
  const MONGO_URI = 'mongodb://localhost:27017/albtn';
  const MONGOOSE_OPTIONS = {
    'useCreateIndex': true,
    'useNewUrlParser': true,
    'useUnifiedTopology': true,
    'useFindAndModify': false
  };

  try {
    // Initialize mongoose connection.
    await mongoose.connect(MONGO_URI, MONGOOSE_OPTIONS);

    // The processed states data.
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const statesString = await fs.promises.readFile(process.argv[2], 'utf8');
    const states = JSON.parse(statesString);

    // Batch update county documents.
    const stateModel = State();
    await stateModel.deleteMany({}).exec();
    for (let i = 0; i < states.features.length; i++) {
      await stateModel.create({
        // eslint-disable-next-line security/detect-object-injection
        'name': states.features[i].properties.NAME,
        // eslint-disable-next-line security/detect-object-injection
        'geoid': states.features[i].properties.GEOID,
        // eslint-disable-next-line security/detect-object-injection
        'usps': states.features[i].properties.STUSPS,
        // eslint-disable-next-line security/detect-object-injection
        'geometry': states.features[i].geometry
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
