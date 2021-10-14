/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2021 Jeremy A Gray <gray@flyquackswim.com>.
 */

'use strict';

const flattenCoordinates = (...coords) => {
  let flat = [];

  while (coords.length > 0) {
    if (Array.isArray(coords[0]) && typeof coords[0][0] !== 'number') {
      coords = coords[0].concat(coords.slice(1));
    } else {
      flat.push(coords.shift());
    }
  }

  return flat;
};

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
    const statesData = JSON.parse(statesString);
    let contiguous = [];
    const noncontiguous = [
      'AK',
      'AS',
      'GU',
      'HI',
      'MP',
      'PR',
      'VI'
    ];

    // Batch update county documents.
    const stateModel = State();
    await stateModel.deleteMany({}).exec();
    for (let i = 0; i < statesData.features.length; i++) {
      await stateModel.create({
        // eslint-disable-next-line security/detect-object-injection
        'name': statesData.features[i].properties.NAME,
        // eslint-disable-next-line security/detect-object-injection
        'geoid': statesData.features[i].properties.GEOID,
        // eslint-disable-next-line security/detect-object-injection
        'usps': statesData.features[i].properties.STUSPS,
        // eslint-disable-next-line security/detect-object-injection
        'geometry': statesData.features[i].geometry
      });

      // Build contiguous state list.
      // eslint-disable-next-line security/detect-object-injection
      if (! noncontiguous.includes(statesData.features[i].properties.STUSPS)) {
        // eslint-disable-next-line security/detect-object-injection
        contiguous.push(statesData.features[i].properties.STUSPS);
      }
    }

    // Find adjacent states.
    for (let i = 0; i < contiguous.length; i++) {
      const state = await State()
        .findOne(
          // eslint-disable-next-line security/detect-object-injection
          {'usps': contiguous[i]},
          {
            '_id': false, '__v': false, 'name': false,
            'geoid': false, 'usps': false, 'centroid': false
          }
        ).exec();

      let neighbors = [];
      const coords = flattenCoordinates(state.geometry.coordinates);
      let cur = {};

      for (let j = 0; j < coords.length; j++) {
        cur = await State()
          .findOne({
            '$and': [
              // eslint-disable-next-line security/detect-object-injection
              { 'usps': {'$ne': contiguous[i]}},
              { 'geometry': {
                '$geoIntersects': {
                  '$geometry': {
                    'type': 'Point',
                    // eslint-disable-next-line security/detect-object-injection
                    'coordinates': coords[j]
                  }
                }
              }}
            ]
          },
          {
            '_id': false, '__v': false, 'geometry': false,
            'centroid': false, 'geoid': false, 'name': false
          })
          .exec();

        if (cur && ! neighbors.includes(cur.usps)) {
          neighbors.push(cur.usps);
        }
      }

      // Update state with adjacent states list.
      await State().findOneAndUpdate(
        // eslint-disable-next-line security/detect-object-injection
        {'usps': contiguous[i]},
        {'neighbors': neighbors}
      ).exec();
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
