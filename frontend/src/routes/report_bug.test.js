import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ReportBug from "./report_bug";

test("renders main sign up page", () => {
  render(
    <MemoryRouter initialEntries={["/report"]}>
      <ReportBug />
    </MemoryRouter>
  );
  const linkElement = screen.getByText("Report");
  expect(linkElement).toBeInTheDocument();
});
