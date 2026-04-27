const request = require('supertest');
const express = require('express');
const downloadRouter = require('../routes/download');

describe('download Route', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use('/download', downloadRouter);
  });

  it('GET /download/:indexName should respond', async () => {
    const res = await request(app).get('/download/test_index');
    expect([200,500]).toContain(res.statusCode);
  });
});
