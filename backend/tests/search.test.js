const request = require("supertest");
const app = require("../index");

describe("Search API", () => {
  test("missing app_name is handled", async () => {
    const res = await request(app)
      .post("/api/search/app_name")
      .send({});

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("Error");
  });

  test("missing app_id is handled", async () => {
    const res = await request(app)
      .post("/api/search/app_id")
      .send({});

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("Error");
  });
});