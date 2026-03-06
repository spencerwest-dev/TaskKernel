import { render, screen } from '@testing-library/react';
import App from './App';

test('renders task dashboard header', () => {
  render(<App />);
  expect(screen.getByText(/add task/i)).toBeInTheDocument();
  expect(screen.getByText(/daily tasks/i)).toBeInTheDocument();
});
