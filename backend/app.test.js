const {app} = require("./app");
const request = require("supertest");

describe("GET /", () => {
  describe("Get the main api page", () => {
    test("Should respond with 200 status code", async () => {
      const response = await request(app).get("/");
      expect(response.statusCode).toBe(200);
    });
  });
});
