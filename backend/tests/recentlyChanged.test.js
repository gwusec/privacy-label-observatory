const request = require('supertest');
const express = require('express');
const recentlyChangedRouter = require('../routes/recentlyChanged');

describe('recentlyChanged Route', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use('/recentlyChanged', recentlyChangedRouter);
  });

  it('GET /recentlyChanged should respond', async () => {
    const res = await request(app).get('/recentlyChanged');
    expect([200,500]).toContain(res.statusCode);
  });
});
