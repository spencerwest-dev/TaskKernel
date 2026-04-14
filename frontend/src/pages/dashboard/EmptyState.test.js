import React from "react";
import { render, screen } from "@testing-library/react";
import TaskColumn from "./components/TaskColumn";

describe("Empty State", () => {
  test("shows empty state when task list is empty", () => {
    render(
      <TaskColumn
        title="Daily Tasks"
        subtitle="Small wins, big streaks."
        tasks={[]}
        activeTab="All"
        onTabChange={() => {}}
        onToggleTask={() => {}}
      />
    );

    expect(screen.getByText("No tasks match this filter.")).toBeInTheDocument();
  });
});