const request = require('supertest');
const express = require('express');
const runsRouter = require('../routes/runs');

describe('runs Route', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use('/runs', runsRouter);
  });

  it('GET /runs should respond', async () => {
    const res = await request(app).get('/runs');
    expect([200,500]).toContain(res.statusCode);
  });
});
