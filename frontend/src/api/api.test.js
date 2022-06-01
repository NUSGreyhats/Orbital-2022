import { get_notes, get_note_content } from "./api";

describe("Test API default value", () => {
  test("Test get all notes value", async () => {
    expect(await get_notes()).toEqual([]);
  });
  test("Test get particular note value", async () => {
    expect(await get_note_content(1000)).toEqual({
      title: "Note not found",
      body: "This note is not found.",
    });
  });
});
