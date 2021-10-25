/*
 * SPDX-License-Identifier: MIT
 *
 * Copyright 2021 Jeremy A Gray <gray@flyquackswim.com>.
 */

'use strict';

const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const server = require('../server.js');
const Contact = require('../models/contact.js');
// const contactController = require('../controllers/contact.js');

describe('POST /api/v1/contact/message', async function() {

  before('clear the test database', async function() {
    await Contact().deleteMany({});

    return;
  });

  after('clear the test database', async function() {
    await Contact().deleteMany({});

    return;
  });

  it('should process a non-spam contact', async function() {
    try {
      const response = await chai.request(server)
        .post('/api/v1/contact/message')
        .send(
          {
            'contactName': 'John Doe',
            'contactEmail': 'jd@example.net',
            'contactMessage': 'This is a test.',
            'contactSpam': false,
          });

      expect(response).to.have.status(200);
      expect(response.body).to.be.a('object');
      expect(response.body.message).to.be.equal('Thanks for contacting us!');

    } catch (error) {
      console.log(error);
      throw error;
    }
  });

  it('should appear to process a spam contact', async function() {
    try {
      const response = await chai.request(server)
        .post('/api/v1/contact/message')
        .send(
          {
            'contactName': 'John Doe',
            'contactEmail': 'jd@example.net',
            'contactMessage': 'This is a test.',
            'contactSpam': true,
          });

      expect(response).to.have.status(200);
      expect(response.body).to.be.a('object');
      expect(response.body.message).to.be.equal('Thanks!');

    } catch (error) {
      console.log(error);
      throw error;
    }
  });

  it('should not process a message with empty fields', async function() {
    try {
      let response = await chai.request(server)
        .post('/api/v1/contact/message')
        .send(
          {
            'contactName': '',
            'contactEmail': 'jd@example.net',
            'contactMessage': 'This is a test.',
            'contactSpam': true,
          });

      expect(response).to.have.status(400);
      expect(response.body).to.be.a('object');
      expect(response.body.error).to.be.equal('input validation failed');

      response = await chai.request(server)
        .post('/api/v1/contact/message')
        .send(
          {
            'contactName': 'John Doe',
            'contactEmail': '',
            'contactMessage': 'This is a test.',
            'contactSpam': true,
          });

      expect(response).to.have.status(400);
      expect(response.body).to.be.a('object');
      expect(response.body.error).to.be.equal('input validation failed');

      response = await chai.request(server)
        .post('/api/v1/contact/message')
        .send(
          {
            'contactName': 'John Doe',
            'contactEmail': 'jd@example.net',
            'contactMessage': '',
            'contactSpam': true,
          });

      expect(response).to.have.status(400);
      expect(response.body).to.be.a('object');
      expect(response.body.error).to.be.equal('input validation failed');

      response = await chai.request(server)
        .post('/api/v1/contact/message')
        .send(
          {
            'contactName': 'John Doe',
            'contactEmail': 'jd@example.net',
            'contactMessage': 'This is a test.',
            'contactSpam': '',
          });

      expect(response).to.have.status(400);
      expect(response.body).to.be.a('object');
      expect(response.body.error).to.be.equal('input validation failed');
    } catch (error) {
      console.log(error);
      throw error;
    }
  });
});
