const request = require('supertest');
const express = require('express');
const getVennRouter = require('../routes/getVenn');

describe('getVenn Route', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use('/getVenn', getVennRouter);
  });

  it('GET /getVenn should respond', async () => {
    const res = await request(app).get('/getVenn');
    expect([200,500]).toContain(res.statusCode);
  });
});
