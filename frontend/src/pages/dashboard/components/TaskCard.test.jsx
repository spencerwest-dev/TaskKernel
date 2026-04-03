// TaskCard Unit Tests
// To run these tests:
// 1. Make sure you have Node.js installed
// 2. Clone the repo: git clone https://github.com/spencerwest-dev/TaskKernel.git
// 3. Navigate to the frontend folder: cd TaskKernel/frontend
// 4. Install dependencies: npm install
// 5. Run tests: npm test -- --watchAll=false

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TaskCard from "./TaskCard";

describe("TaskCard", () => {
  const task = {
    id: "1",
    title: "Test task",
    description: "This is a task description",
    strength: "strong",
    streak: 3,
    frequency: "Daily",
    xp: 20,
    completed: false,
  };

  // Verifies task displays title, description, streak, frequency, strength, XP and triggers onToggle
  test("renders task and calls onToggle", () => {
    const onToggle = jest.fn();

    render(<TaskCard task={task} onToggle={onToggle} />);

    expect(screen.getByText("Test task")).toBeInTheDocument();
    expect(screen.getByText("This is a task description")).toBeInTheDocument();
    expect(screen.getByText("🔥 3")).toBeInTheDocument();
    expect(screen.getByText("Daily")).toBeInTheDocument();
    expect(screen.getByText("Strong")).toBeInTheDocument();
    expect(screen.getByText("+20 XP")).toBeInTheDocument();

    const toggleButton = screen.getByRole("button", { name: "Mark complete" });
    expect(toggleButton).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith("1");
  });

  // Verifies completed task state updates label and style
  test("shows completed state with weak strength", () => {
    const completedTask = { ...task, completed: true, strength: "weak" };
    render(<TaskCard task={completedTask} />);

    expect(screen.getByRole("button", { name: "Mark incomplete" })).toBeInTheDocument();
    expect(screen.getByText("Weak")).toBeInTheDocument();

    const titleElement = screen.getByText("Test task");
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass("line-through");
  });
});
