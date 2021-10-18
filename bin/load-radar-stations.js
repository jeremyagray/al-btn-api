/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2021 Jeremy A Gray <gray@flyquackswim.com>.
 */

'use strict';

const mongoose = require('mongoose');
const fs = require('fs');

// Use the API Nation model.
const Radar = require('../models/radar.js');

async function load() {
  // Configure mongoose.
  const MONGO_URI = 'mongodb://localhost:27017/albtn';
  const MONGOOSE_OPTIONS = {
    'useCreateIndex': true,
    'useFindAndModify': false,
    'useNewUrlParser': true,
    'useUnifiedTopology': true
  };

  try {
    // Initialize mongoose connection.
    await mongoose.connect(MONGO_URI, MONGOOSE_OPTIONS);

    // The processed nation data.
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const radarString = await fs.promises.readFile(process.argv[2], 'utf8');
    const radars = JSON.parse(radarString);

    // Batch update county documents.
    const radarModel = Radar();
    await radarModel.deleteMany({}).exec();

    for (let i = 0; i < radars.length; i++) {
      await radarModel.create({
        // eslint-disable-next-line security/detect-object-injection
        'wban': radars[i].properties.wban,
        // eslint-disable-next-line security/detect-object-injection
        'station': radars[i].properties.station,
        // eslint-disable-next-line security/detect-object-injection
        'radarType': radars[i].properties.radarType,
        // eslint-disable-next-line security/detect-object-injection
        'location': radars[i].properties.location,
        // eslint-disable-next-line security/detect-object-injection
        'usps': radars[i].properties.usps,
        // eslint-disable-next-line security/detect-object-injection
        'elevation': radars[i].properties.elevation,
        // eslint-disable-next-line security/detect-object-injection
        'towerHeight': radars[i].properties.towerHeight,
        // eslint-disable-next-line security/detect-object-injection
        'geometry': radars[i].geometry
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
