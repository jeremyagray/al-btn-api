/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2021 Jeremy A Gray <gray@flyquackswim.com>.
 */

'use strict';

const mongoose = require('mongoose');

// Use the API County model.
const County = require('../models/countyGeo.js');

// The processed county data.
const counties = require('../public/data/census/al-counties-geo.json');

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
    const countyModel = County();
    await countyModel.deleteMany({}).exec();
    for (let i = 0; i < counties.features.length; i++) {
      await countyModel.create({
        // eslint-disable-next-line security/detect-object-injection
        'name': counties.features[i].properties.NAME,
        // eslint-disable-next-line security/detect-object-injection
        'fips': counties.features[i].properties.GEOID,
        // eslint-disable-next-line security/detect-object-injection
        'usps': counties.features[i].properties.STUSPS,
        // eslint-disable-next-line security/detect-object-injection
        'feature': counties.features[i]
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
