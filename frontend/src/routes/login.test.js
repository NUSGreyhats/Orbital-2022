import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./login";

test("renders main signin page", () => {
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <Login />
    </MemoryRouter>
  );
  const linkElement = screen.getByText("Sign In");
  expect(linkElement).toBeInTheDocument();
});
