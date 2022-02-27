/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2020-2021 Jeremy A Gray <gray@flyquackswim.com>.
 */

'use strict';

// Load the environment variables.
require('dotenv').config();

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const path = require('path');
const winston = require('winston');

// Middleware.
const helmet = require('./middleware/helmet.js');
const logger = require('./middleware/logger.js');

// Routing.
const contactRoute = require('./routes/contact.js');
const countyRoute = require('./routes/county.js');
const geographyRoute = require('./routes/geography.js');
const weatherRoute = require('./routes/weather.js');
const userRoute = require('./routes/user.js');

// Express.
const app = express();
let server;

// Configuration variables.
const port = process.env.PORT || 3000;
const name = 'al-btn-api';
const version = '0.0.1';

async function start() {
  // Configure mongoose.
  const MONGOOSE_OPTIONS = {};

  try {
    // Initialize mongoose connection.
    if (process.env.NODE_ENV === 'test') {
      await mongoose.connect(process.env.MONGO_TEST_URI, MONGOOSE_OPTIONS);
    } else {
      await mongoose.connect(process.env.MONGO_URI, MONGOOSE_OPTIONS);
    }

    // Logging middleware.
    if (process.env.NODE_ENV === 'development') {
      // Development:  dump to console.
      logger.clear();
      logger.add(new winston.transports.Console({
        'level': 'silly',
        'format': winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )}));
      app.use(morgan('dev', {
        'stream': {
          'write': (message) => {
            logger.info(message.trim());
          }
        }}));
    } else if (process.env.NODE_ENV === 'test') {
      // Testing:  silence for tests.
      logger.clear();
      logger.silent = true;
    } else {
      // Production:  defaults.
      app.use(morgan('combined', {
        'stream': {
          'write': (message) => {
            logger.info(message.trim());
          }
        }}));
    }

    // Helmet middleware.
    app.use(helmet.config);
    
    // Use CORS.
    app.use(cors({
      origin: '*',
      optionSuccessStatus: 200
    }));

    // Use body parser for post data.
    app.use(express.urlencoded({extended: false}));
    app.use(express.json());

    // Application routes.
    app.use('/api/v1/contact', contactRoute);
    app.use('/api/v1/counties', countyRoute);
    app.use('/api/v1/geography', geographyRoute);
    app.use('/api/v1/weather', weatherRoute);
    app.use('/api/v1/users', userRoute);
    
    // 404 middleware.
    app.use((request, response) => {
      return response
        .status(404)
        .render('404');
    });

    // Run server.
    const host = process.env?.HOST || 'localhost';
    server = app.listen(port, process.env.HOST);
    logger.info(`${name}@${version} listening on ${host}:${port}`);
  } catch (error) {
    if (server && server.listening) {
      server.close();
    }

    logger.error(error);
    logger.error(
      `${name}@${version} cowardly refusing to continue with errors...`
    );

    process.exitCode = 1;
  }
}

// Start the server.
(async function() {
  await start(); 
})();

module.exports = app;
