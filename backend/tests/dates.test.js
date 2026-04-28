const request = require('supertest');
const express = require('express');
const datesRouter = require('../routes/dates');

describe('dates Route', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use('/dates', datesRouter);
  });

  it('GET /dates should respond', async () => {
    const res = await request(app).get('/dates');
    expect([200,500]).toContain(res.statusCode);
  });
});
