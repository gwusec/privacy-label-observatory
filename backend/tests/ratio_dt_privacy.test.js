const request = require('supertest');
const express = require('express');
const ratioDtPrivacyRouter = require('../routes/ratio_dt_privacy');

describe('ratio_dt_privacy Route', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use('/ratio_dt_privacy', ratioDtPrivacyRouter);
  });

  it('GET /ratio_dt_privacy should respond', async () => {
    const res = await request(app).get('/ratio_dt_privacy');
    expect([200,500]).toContain(res.statusCode);
  });
});
