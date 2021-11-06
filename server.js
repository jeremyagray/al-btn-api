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
const favicon = require('serve-favicon');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const path = require('path');
const session = require('express-session');
const winston = require('winston');

// Test runner.
const runner = require('./runner.js');

// Middleware.
const helmet = require('./middleware/helmet.js');
const logger = require('./middleware/logger.js');

// Routing.
const contactRoute = require('./routes/contact.js');
const countyRoute = require('./routes/county.js');
const geographyRoute = require('./routes/geography.js');
const weatherRoute = require('./routes/weather.js');
const authenticationRoute = require('./routes/authentication.js');
const userRoute = require('./routes/user.js');

// Express.
const app = express();

// Configuration variables.
const port = process.env.PORT || 3000;
const name = 'al-btn-api';
const version = '0.0.1';

async function start() {
  // Configure mongoose.
  const MONGOOSE_OPTIONS = {
    'useCreateIndex': true,
    'useNewUrlParser': true,
    'useUnifiedTopology': true,
    'useFindAndModify': false
  };

  try {
    // Initialize mongoose connection.
    await mongoose.connect(process.env.MONGO_URI, MONGOOSE_OPTIONS);

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

    // Favicon serving middleware.
    app.use(favicon(path.join(process.cwd(), 'public', 'favicon.ico')));
    
    // Use body parser for post data.
    app.use(express.urlencoded({extended: false}));
    app.use(express.json());

    // Set static directory to root.
    app.use(express.static(path.join(process.cwd(), 'public')));

    // Set view directory and view engine.
    // app.set('views', path.join(process.cwd(), 'views'));
    // app.set('view engine', 'pug');

    // Serve index.
    // app.route('/')
    //   .get(function(request, response) {
    //     return response.render('index');
    //   });

    // Passport/session support.
    app.use(session({
      'resave': false,
      'saveUninitialized': false,
      'secret': process.env.SECRET,
      'store': MongoStore.create({
        'mongoUrl': process.env.MONGO_URI,
        'mongoOptions': {
          'useNewUrlParser': true,
          'useUnifiedTopology': true
        }
      })
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    // Application routes.
    app.use('/api/v1/contact', contactRoute);
    app.use('/api/v1/counties', countyRoute);
    app.use('/api/v1/geography', geographyRoute);
    app.use('/api/v1/weather', weatherRoute);
    app.use('/api/v1/auth', authenticationRoute);
    app.use('/api/v1/users', userRoute);
    
    // 404 middleware.
    app.use((request, response) => {
      return response
        .status(404)
        .render('404');
    });

    // Run server and/or tests.
    await app.listen(port);
    logger.info(`${name}@${version} listening on port ${port}`);
    if (process.env.NODE_ENV === 'test'
        || process.env.NODE_ENV === 'development') {
      logger.info(`${name}@${version} preparing to run tests`);
      setTimeout(function () {
        try {
          runner.run();
        } catch (error) {
          logger.info(`${name}@${version}:  some tests failed`);
          logger.error(error);
        }
      }, 1500);
    }
  } catch (error) {
    logger.error(error);
    logger.error(`${name}@${version} cowardly refusing to continue with errors...`);
  }
}

// Start the server.
(async function() {
  await start(); 
})();

// Export app for testing.
module.exports = app;
