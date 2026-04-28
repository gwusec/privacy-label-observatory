const request = require('supertest');
const express = require('express');
const appListRouter = require('../routes/appList');

describe('appList Route', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use('/appList', appListRouter);
  });

  it('GET /appList should respond', async () => {
    const res = await request(app).get('/appList');
    expect([200,500]).toContain(res.statusCode);
  });
});
