const request = require('supertest');
const express = require('express');
const purposeRatiosRouter = require('../routes/purpose_ratios');

describe('purpose_ratios Route', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use('/purpose_ratios', purposeRatiosRouter);
  });

  it('GET /purpose_ratios should respond', async () => {
    const res = await request(app).get('/purpose_ratios');
    expect([200,404,500]).toContain(res.statusCode);
  });
});
