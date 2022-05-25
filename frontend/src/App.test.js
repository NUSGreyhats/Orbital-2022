import { render, screen } from '@testing-library/react';
import App from './App';

test('renders main react page', () => {
  render(<App />);
  const linkElement = screen.getByText("Notes.js");
  expect(linkElement).toBeInTheDocument();
});
