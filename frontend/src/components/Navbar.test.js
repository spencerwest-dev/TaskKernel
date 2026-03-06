import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from './Navbar';

describe('Navbar Component', () => {
  test('renders the Navbar component', () => {
    render(<Navbar />);
    const navbar = screen.getByRole('navigation');
    expect(navbar).toBeInTheDocument();
  });

  test('has dark background styling', () => {
    render(<Navbar />);
    const navbar = screen.getByRole('navigation');
    expect(navbar).toHaveStyle('backgroundColor: #333');
  });

  test('has white text color', () => {
    render(<Navbar />);
    const navbar = screen.getByRole('navigation');
    expect(navbar).toHaveStyle('color: white');
  });
});
