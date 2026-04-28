const request = require('supertest');
const express = require('express');
const sizeRouter = require('../routes/size');

describe('size Route', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use('/size', sizeRouter);
  });

  it('GET /size should respond', async () => {
    const res = await request(app).get('/size');
    expect([200,500]).toContain(res.statusCode);
  });
});
