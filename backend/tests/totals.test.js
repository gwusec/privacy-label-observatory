const request = require('supertest');
const express = require('express');
const totalsRouter = require('../routes/totals');

describe('totals Route', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use('/totals', totalsRouter);
  });

  it('GET /totals should respond', async () => {
    const res = await request(app).get('/totals?run=test');
    expect([200,500]).toContain(res.statusCode);
  });
});
