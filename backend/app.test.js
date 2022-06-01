const { app } = require("./app");
const request = require("supertest");

describe("GET /", () => {
  describe("Get the main api page", () => {
    test("Should respond with 200 status code", async () => {
      const response = await request(app).get("/");
      expect(response.statusCode).toBe(200);
    });
  });

  describe("Get the notes api page", () => {
    test("Should respond with array of notes", async () => {
      const response = await request(app).get("/notes");
      expect(response.statusCode).toBe(200);
      expect(response.body.length).toBeGreaterThanOrEqual(0);
    });

    test("Should respond for specific id", async () => {
      const response = await request(app).get("/notes/1");
      expect(response.statusCode).toBe(200);
    });
  });
});
