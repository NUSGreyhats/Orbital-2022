import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Signup from "./signup";

test("renders main sign up page", () => {
  render(
    <MemoryRouter initialEntries={["/signup"]}>
      <Signup />
    </MemoryRouter>
  );
  const linkElement = screen.getByText("Sign Up");
  expect(linkElement).toBeInTheDocument();
});
