// LandingPage Validation Unit Tests
// To run these tests:
// 1. Make sure you have Node.js installed
// 2. Clone the repo: git clone https://github.com/spencerwest-dev/TaskKernel.git
// 3. Navigate to the frontend folder: cd TaskKernel/frontend
// 4. Install dependencies: npm install
// 5. Run these tests only: npm test -- --watchAll=false --testPathPattern=LandingPage

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LandingPage from "./index";

// Mock useNavigate since we're not using a full router
jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn(),
}));

// Mock Navbar to isolate LandingPage
jest.mock("./Navbar", () => () => <nav data-testid="navbar" />);

describe("LandingPage Validation", () => {
  test("renders the main heading", () => {
    render(<LandingPage />);
    expect(screen.getByText(/Gamify your/i)).toBeInTheDocument();
  });

  test("renders the sign up form fields", () => {
    render(<LandingPage />);
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
  });

  test("shows error when fields are empty and Continue is clicked", () => {
    render(<LandingPage />);
    fireEvent.click(screen.getByText("Continue"));
    expect(screen.getByText("All fields are required.")).toBeInTheDocument();
  });

  test("shows error when passwords do not match", () => {
    render(<LandingPage />);
    fireEvent.change(screen.getByPlaceholderText("Username"), {
      target: { value: "janeth" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByText("Continue"));
    expect(screen.getByText("Passwords do not match.")).toBeInTheDocument();
  });

  test("renders the Continue button", () => {
    render(<LandingPage />);
    expect(screen.getByText("Continue")).toBeInTheDocument();
  });
});
