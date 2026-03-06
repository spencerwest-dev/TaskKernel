import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
    // App should render without throwing an error
    expect(document.body).toBeInTheDocument();
  });

  test('includes LandingPage component', () => {
    render(<App />);
    // The LandingPage should contain Navbar and Footer
    const navbar = screen.getByRole('navigation');
    const footer = screen.getByRole('contentinfo');
    expect(navbar).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });

});
