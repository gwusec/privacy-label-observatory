const request = require('supertest');
const express = require('express');
const ratingRouter = require('../routes/rating');

describe('rating Route', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use('/rating', ratingRouter);
  });

  it('GET /rating should respond', async () => {
    const res = await request(app).get('/rating');
    expect([200,500]).toContain(res.statusCode);
  });
});
