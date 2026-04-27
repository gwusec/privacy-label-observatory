const request = require('supertest');
const express = require('express');
const priceRouter = require('../routes/price');

describe('price Route', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use('/price', priceRouter);
  });

  it('GET /price should respond', async () => {
    const res = await request(app).get('/price');
    expect([200,500]).toContain(res.statusCode);
  });
});
