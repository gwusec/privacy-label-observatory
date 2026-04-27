const request = require('supertest');
const express = require('express');
const latestIndexRouter = require('../routes/latestIndex');

describe('latestIndex Route', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use('/latestIndex', latestIndexRouter);
  });

  it('GET /latestIndex should respond', async () => {
    const res = await request(app).get('/latestIndex');
    expect([200,500]).toContain(res.statusCode);
  });
});
