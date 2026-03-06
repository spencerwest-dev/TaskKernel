import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer Component', () => {
  test('renders the Footer component', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  test('displays copyright text', () => {
    render(<Footer />);
    expect(screen.getByText(/2026© TaskKernel/i)).toBeInTheDocument();
  });

  test('has centered text alignment', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveStyle('textAlign: center');
  });

  test('is positioned at the bottom', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveStyle('position: fixed');
    expect(footer).toHaveStyle('bottom: 0');
  });
});
