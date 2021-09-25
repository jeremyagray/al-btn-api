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
// const County = require('../models/county.js');
// const countyController = require('../controllers/county.js');

describe('GET /api/v1/counties/all', async function() {

  before('add the county data', async function() {
    // const countyModel = County();
    // await countyModel.deleteMany({});

    // for (let i = 0; i < goodURLs.length; i++) {
    //   // eslint-disable-next-line security/detect-object-injection
    //   await createURL({'url': goodURLs[i].url});
    // }

    return;
  });

  after('clear the test database', async function() {
    // await County().deleteMany({});

    return;
  });

  it('should list all URLs', async function() {
    try {
      const response = await chai.request(server)
        .get('/api/v1/counties/all');

      expect(response).to.have.status(200);
      expect(response.body).to.be.a('object');
      expect(response.body.length).to.be.equal(67);
      expect(response.body.counties).to.be.a('array');

      for (let i = 0; i < response.body.counties.length; i++) {
        // eslint-disable-next-line security/detect-object-injection
        expect(response.body.counties[i]).to.have.property('name');
        // eslint-disable-next-line security/detect-object-injection
        expect(response.body.counties[i]).to.have.property('cname');
        // eslint-disable-next-line security/detect-object-injection
        expect(response.body.counties[i]).to.have.property('fips');
        // eslint-disable-next-line security/detect-object-injection
        expect(response.body.counties[i]).to.have.property('seat');
        // eslint-disable-next-line security/detect-object-injection
        expect(response.body.counties[i].seat).to.have.property('name');
        // eslint-disable-next-line security/detect-object-injection
        expect(response.body.counties[i].seat).to.have.property('geoid');
        // eslint-disable-next-line security/detect-object-injection
        expect(response.body.counties[i].seat).to.have.property('location');
        // eslint-disable-next-line security/detect-object-injection
        expect(response.body.counties[i].seat.location).to.have.property('type');
        // eslint-disable-next-line security/detect-object-injection
        expect(response.body.counties[i].seat.location).to.have.property('coordinates');
        // eslint-disable-next-line security/detect-object-injection
        expect(response.body.counties[i].seat.location.coordinates).to.be.a('array');
        // eslint-disable-next-line security/detect-object-injection
        expect(response.body.counties[i]).to.have.property('established');
        // eslint-disable-next-line security/detect-object-injection
        expect(response.body.counties[i]).to.have.property('code');
      }

    } catch (error) {
      console.log(error);
      throw error;
    }
  });
});
