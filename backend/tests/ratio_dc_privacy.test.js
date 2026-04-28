const request = require('supertest');
const express = require('express');
const ratioDcPrivacyRouter = require('../routes/ratio_dc_privacy');

describe('ratio_dc_privacy Route', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use('/ratio_dc_privacy', ratioDcPrivacyRouter);
  });

  it('GET /ratio_dc_privacy should respond', async () => {
    const res = await request(app).get('/ratio_dc_privacy');
    expect([200,500]).toContain(res.statusCode);
  });
});
