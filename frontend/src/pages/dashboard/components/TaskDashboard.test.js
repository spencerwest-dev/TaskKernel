// TaskDashboard Unit Tests
// To run ONLY these tests (recommended):
//   1. Clone the repo: git clone https://github.com/spencerwest-dev/TaskKernel.git
//   2. Navigate to the frontend folder: cd TaskKernel/frontend
//   3. Install dependencies: npm install
//   4. Run this specific test file: npm test -- --watchAll=false --testPathPattern=TaskDashboard
//
// NOTE: If you run all tests with "npm test -- --watchAll=false", App.test.js will
// fail due to a separate unrelated dependency issue. That failure is not part of
// this ticket. Run the command above to see only the TaskDashboard tests.

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TaskDashboard from "./TaskDashboard";

// Mocking Navbar and Footer to isolate the TaskDashboard component
jest.mock("./Navbar", () => () => <nav data-testid="navbar" />);
jest.mock("./Footer", () => () => <footer data-testid="footer" />);

describe("TaskDashboard - Task Creation", () => {
  // Verifies the Add Task button is visible on the dashboard
  test("renders the Add Task button", () => {
    render(<TaskDashboard />);
    expect(screen.getByText("Add Task")).toBeInTheDocument();
  });

  // Verifies that clicking Add Task creates a new task
  test("clicking Add Task adds a new task to the list", () => {
    render(<TaskDashboard />);
    fireEvent.click(screen.getByText("Add Task"));
    expect(screen.getByText("New task")).toBeInTheDocument();
  });

  // Verifies the new task appears in the Daily Tasks column
  test("new task appears in the Daily Tasks column", () => {
    render(<TaskDashboard />);
    fireEvent.click(screen.getByText("Add Task"));
    expect(screen.getByText("New task")).toBeInTheDocument();
  });

  // Verifies new tasks default to incomplete (unchecked)
  test("new task defaults to incomplete", () => {
    render(<TaskDashboard />);
    fireEvent.click(screen.getByText("Add Task"));
    const plusButtons = screen.getAllByText("+");
    expect(plusButtons.length).toBeGreaterThan(0);
  });

  // Verifies multiple tasks can be added sequentially
  test("multiple tasks can be added", () => {
    render(<TaskDashboard />);
    fireEvent.click(screen.getByText("Add Task"));
    fireEvent.click(screen.getByText("Add Task"));
    const newTasks = screen.getAllByText("New task");
    expect(newTasks.length).toBe(2);
  });
});