import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskCard from "./TaskCard";

const mockGetToken = jest.fn();
jest.mock("@clerk/clerk-react", () => ({
  __esModule: true,
  useAuth: () => ({
    getToken: mockGetToken,
  }),
}));
jest.mock("../../../assets/Icons/streak_icon.svg", () => ({
  __esModule: true,
  ReactComponent: () => <svg data-testid="streak-icon" />,
}));

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

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  test("renders task details", () => {
    const onToggle = jest.fn();

    render(<TaskCard task={task} onToggle={onToggle} />);

    expect(screen.getByText("Test task")).toBeInTheDocument();
    expect(screen.getByText("This is a task description")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Daily")).toBeInTheDocument();
    expect(screen.getByText("Strong")).toBeInTheDocument();
    expect(screen.getByText("+20 XP")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mark complete" })).toBeInTheDocument();
  });

  test("calls completion API and passes user payload to onToggle", async () => {
    const onToggle = jest.fn();
    mockGetToken.mockResolvedValue("clerk-token");
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        taskId: "1",
        date: "2026-04-29",
        user: { xp: 42, level: 3, streak: 5 },
      }),
    });

    render(<TaskCard task={task} onToggle={onToggle} />);

    const toggleButton = screen.getByRole("button", { name: "Mark complete" });
    await userEvent.click(toggleButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8080/tasks/1/complete",
        expect.objectContaining({
          method: "POST",
          headers: { Authorization: "Bearer clerk-token" },
        })
      );
    });

    expect(onToggle).toHaveBeenCalledWith("1", {
      completed: true,
      user: { xp: 42, level: 3, streak: 5 },
    });
  });

  test("falls back to local toggle when token is missing", async () => {
    const onToggle = jest.fn();
    mockGetToken.mockResolvedValue(null);

    render(<TaskCard task={task} onToggle={onToggle} />);

    const toggleButton = screen.getByRole("button", { name: "Mark complete" });
    await userEvent.click(toggleButton);

    expect(global.fetch).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(onToggle).toHaveBeenCalledWith("1", { completed: true });
    });
  });

  test("falls back to local toggle when API request fails", async () => {
    const onToggle = jest.fn();
    mockGetToken.mockResolvedValue("clerk-token");
    global.fetch.mockRejectedValue(new Error("network error"));

    render(<TaskCard task={task} onToggle={onToggle} />);

    const toggleButton = screen.getByRole("button", { name: "Mark complete" });
    await userEvent.click(toggleButton);

    await waitFor(() => {
      expect(onToggle).toHaveBeenCalledWith("1", { completed: true });
    });
  });

  test("uses DELETE for un-complete action", async () => {
    const onToggle = jest.fn();
    mockGetToken.mockResolvedValue("clerk-token");
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ taskId: "1", user: { xp: 20, level: 2, streak: 3 } }),
    });

    render(<TaskCard task={{ ...task, completed: true }} onToggle={onToggle} />);
    await userEvent.click(screen.getByRole("button", { name: "Mark incomplete" }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://localhost:8080/tasks/1/complete",
        expect.objectContaining({ method: "DELETE" })
      );
    });

    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith("1", {
      completed: false,
      user: { xp: 20, level: 2, streak: 3 },
    });
  });

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
