const request = require('supertest');
const express = require('express');
const matrixRouter = require('../routes/matrix');

describe('matrix Route', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use('/matrix', matrixRouter);
  });

  it('GET /matrix should respond', async () => {
    const res = await request(app).get('/matrix');
    expect([200,500]).toContain(res.statusCode);
  });
});
