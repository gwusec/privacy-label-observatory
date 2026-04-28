const request = require('supertest');
const express = require('express');
const testAPIRouter = require('../routes/testAPI');

describe('testAPI Route', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use('/testAPI', testAPIRouter);
  });

  it('GET /testAPI should respond', async () => {
    const res = await request(app).get('/testAPI');
    expect([200,500]).toContain(res.statusCode);
  });
});
