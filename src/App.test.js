import { render, screen } from '@testing-library/react';
import App from './App';

test('shows the login screen when no user is authenticated', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
});
