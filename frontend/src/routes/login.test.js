import { render, screen } from "@testing-library/react";
import Login from "./login";

test("renders main login page", () => {
  render(<Login />);
  const linkElement = screen.getByText("Sign In");
  expect(linkElement).toBeInTheDocument();
});
