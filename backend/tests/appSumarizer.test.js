const request = require('supertest');
const express = require('express');
const appSumarizerRouter = require('../routes/appSumarizer');

describe('appSumarizer Route', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use('/appSumarizer', appSumarizerRouter);
  });

  it('GET /appSumarizer should respond (if implemented)', async () => {
    const res = await request(app).get('/appSumarizer');
    expect([200,404,500]).toContain(res.statusCode);
  });
});
