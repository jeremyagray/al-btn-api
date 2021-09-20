/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2021 Jeremy A Gray <gray@flyquackswim.com>.
 */

'use strict';

const mongoose = require('mongoose');

// Use the API's county model.
const County = require('../models/county.js');

// The processed county data.
const counties = require('../public/data/alabama/processed/county-fips-cname-codes-seats-coordinates.json');

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
    await countyModel.insertMany(counties);
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
