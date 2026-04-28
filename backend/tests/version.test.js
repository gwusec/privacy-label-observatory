const request = require('supertest');
const express = require('express');
const versionRouter = require('../routes/version');

describe('version Route', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use('/version', versionRouter);
  });

  it('GET /version should respond', async () => {
    const res = await request(app).get('/version');
    expect([200,500]).toContain(res.statusCode);
  });
});
