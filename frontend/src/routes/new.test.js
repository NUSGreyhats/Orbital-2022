import { render, screen } from "@testing-library/react";
import NewNote from "./new";

test("renders new notes page", () => {
  render(<NewNote />);
  const linkElement = screen.getByText("Create a new note");
  expect(linkElement).toBeInTheDocument();
});
