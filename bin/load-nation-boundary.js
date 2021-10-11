/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2021 Jeremy A Gray <gray@flyquackswim.com>.
 */

'use strict';

const mongoose = require('mongoose');
const fs = require('fs');

// Use the API Nation model.
const Nation = require('../models/nationGeo.js');

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

    // The processed nation data.
    const nationString = await fs.promises.readFile(process.argv[2], 'utf8');
    const nation = JSON.parse(nationString);

    // Batch update county documents.
    const nationModel = Nation();
    await nationModel.deleteMany({}).exec();
    await nationModel.create({
      'name': 'United States',
      'feature': nation.features[0]
    });
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
