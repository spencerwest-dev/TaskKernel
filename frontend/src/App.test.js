import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App Component", () => {
  test("renders without crashing", () => {
    render(<App />);
    // App should render without throwing an error
    expect(document.body).toBeInTheDocument();
  });

  test("renders task dashboard header", () => {
    render(<App />);
    expect(screen.getByText(/add task/i)).toBeInTheDocument();
    expect(screen.getByText(/daily tasks/i)).toBeInTheDocument();
  });

  test("includes navbar and footer", () => {
    render(<App />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
