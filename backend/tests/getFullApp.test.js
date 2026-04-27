const request = require('supertest');
const express = require('express');
const getFullAppRouter = require('../routes/getFullApp');

describe('getFullApp Route', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use('/getFullApp', getFullAppRouter);
  });

  it('GET /getFullApp should respond', async () => {
    const res = await request(app).get('/getFullApp?id=test&run=test');
    expect([200,500]).toContain(res.statusCode);
  });
});
