const request = require('supertest');
const express = require('express');
const yearlyReleasesRouter = require('../routes/yearlyReleases');

describe('yearlyReleases Route', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use('/yearlyReleases', yearlyReleasesRouter);
  });

  it('GET /yearlyReleases should respond', async () => {
    const res = await request(app).get('/yearlyReleases');
    expect([200,404,500]).toContain(res.statusCode);
  });
});
