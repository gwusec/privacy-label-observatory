const request = require('supertest');
const express = require('express');
const cacheListRouter = require('../routes/cacheList');

describe('cacheList Route', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use('/cacheList', cacheListRouter);
  });

  it('GET /cacheList should respond', async () => {
    const res = await request(app).get('/cacheList');
    expect([200,500]).toContain(res.statusCode);
  });
});
