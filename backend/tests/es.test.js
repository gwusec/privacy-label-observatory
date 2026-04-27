require('dotenv').config({ path: '../.env' });

const { Client } = require('@elastic/elasticsearch');

describe("Elasticsearch Connectivity", () => {
  let client;

  beforeAll(() => {
    client = new Client({
      node: process.env.ELASTIC_ENDPOINT,
      auth: {
        username: process.env.ELASTIC_USERNAME,
        password: process.env.ELASTIC_PASSWORD
      },
      caFingerprint: process.env.ELASTIC_FINGERPRINT,
      tls: {
        rejectUnauthorized: false
      }
    });
  });

  afterAll(async () => {
    await client.close();
  });

  test("should ping Elasticsearch", async () => {
    const response = await client.ping();
    expect(response).toBeTruthy();
  });
});