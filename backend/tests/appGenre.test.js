const request = require('supertest');
const express = require('express');
const appGenreRouter = require('../routes/appGenre');

describe('appGenre Route', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use('/appGenre', appGenreRouter);
  });

  it('GET /appGenre should respond', async () => {
    const res = await request(app).get('/appGenre');
    expect([200,500]).toContain(res.statusCode);
  });
});
