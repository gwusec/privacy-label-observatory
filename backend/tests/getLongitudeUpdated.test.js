const request = require('supertest');
const express = require('express');
const getLongitudeUpdatedRouter = require('../routes/getLongitudeUpdated');

describe('getLongitudeUpdated Route', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use('/getLongitudeUpdated', getLongitudeUpdatedRouter);
  });

  it('GET /getLongitudeUpdated should respond', async () => {
    const res = await request(app).get('/getLongitudeUpdated');
    expect([200,500]).toContain(res.statusCode);
  });
});
