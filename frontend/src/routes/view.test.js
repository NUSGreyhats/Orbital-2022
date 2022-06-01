import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ViewNote from "./view";

describe("View Notes page", () => {
  test("renders general view page", () => {
    render(
      <MemoryRouter initialEntries={["/view"]}>
        <ViewNote />
      </MemoryRouter>
    );
    const linkElement = screen.getByText("Loading");
    expect(linkElement).toBeInTheDocument();
  });
});
