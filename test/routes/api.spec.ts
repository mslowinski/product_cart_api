import * as chai from 'chai';
import chaiHttp = require('chai-http');
import 'mocha';
import app from '../../src/app';

chai.use(chaiHttp);

const expect = chai.expect;

describe('apiRoute', () => {
  it('GET /api should respond with HTTP 200 status', async() => {
    const response = await chai.request(app).get('/api');

    expect(response).to.have.status(200);
  });
  it('GET /api should respond with title message', async() => {
    const response = await chai.request(app).get('/api');

    expect(response.body).to.have.property('title').to.be.equal('Product API');
  });
});
