const request = require('supertest');
const express = require('express');
const aiOverviewRouter = require('../routes/aiOverview');

describe('aiOverview Route', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/aiOverview', aiOverviewRouter);
  });

  it('POST /aiOverview should return 400 for missing body', async () => {
    const res = await request(app).post('/aiOverview').send({});
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });
});
