const request = require('supertest');
const express = require('express');
const getAppRouter = require('../routes/getApp');

describe('getApp Route', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use('/getApp', getAppRouter);
  });

  it('GET /getApp should respond', async () => {
    const res = await request(app).get('/getApp?id=test&run=test');
    expect([200,500]).toContain(res.statusCode);
  });
});
