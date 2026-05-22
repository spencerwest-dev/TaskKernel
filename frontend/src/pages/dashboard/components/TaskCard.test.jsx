import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskCard from "./TaskCard";

const mockGetToken = jest.fn();
jest.mock("@clerk/react", () => ({
  __esModule: true,
  useAuth: () => ({
    getToken: mockGetToken,
  }),
}));
jest.mock("../../../assets/Icons/streak_icon.svg", () => ({
  __esModule: true,
  ReactComponent: () => <svg data-testid="streak-icon" />,
}));

const baseTask = {
  id: "1",
  title: "Test task",
  description: "This is a task description",
  strength: "strong",
  streak: 3,
  frequency: "Daily",
  xp: 20,
  completed: false,
};

describe("TaskCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    jest.spyOn(console, "error").mockImplementation(() => {});
    // Hermetic default API base (TaskCard reads env at render time).
    delete process.env.REACT_APP_API_URL;
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  test("renders task details", () => {
    const onToggle = jest.fn();

    render(<TaskCard task={baseTask} onToggle={onToggle} />);

    expect(screen.getByText("Test task")).toBeInTheDocument();
    expect(screen.getByText("This is a task description")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Daily")).toBeInTheDocument();
    expect(screen.getByText("Strong")).toBeInTheDocument();
    expect(screen.getByText("+20 XP")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mark complete" })).toBeInTheDocument();
  });

  test("shows completed state with weak strength", () => {
    const completedTask = { ...baseTask, completed: true, strength: "weak" };
    render(<TaskCard task={completedTask} />);

    expect(screen.getByRole("button", { name: "Mark incomplete" })).toBeInTheDocument();
    expect(screen.getByText("Weak")).toBeInTheDocument();

    const titleElement = screen.getByText("Test task");
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveClass("line-through");
  });

  /**
   * markDailyCompletions: toggle completion + POST/DELETE `/tasks/:id/complete`
   * (implemented as `handleToggle` in TaskCard.jsx).
   */
  describe("markDailyCompletions", () => {
    test("POSTs to complete endpoint and passes user payload to onToggle", async () => {
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

      render(<TaskCard task={baseTask} onToggle={onToggle} />);

      await userEvent.click(screen.getByRole("button", { name: "Mark complete" }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "http://localhost:8080/tasks/1/complete",
          expect.objectContaining({
            method: "POST",
            headers: { Authorization: "Bearer clerk-token" },
          })
        );
      });

      await waitFor(() => {
        expect(onToggle).toHaveBeenCalledWith("1", {
          completed: true,
          user: { xp: 42, level: 3, streak: 5 },
        });
      });
    });

    test("uses numeric task id in URL when API returns Long id", async () => {
      const onToggle = jest.fn();
      mockGetToken.mockResolvedValue("clerk-token");
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ user: { xp: 10, level: 1, streak: 1 } }),
      });

      render(<TaskCard task={{ ...baseTask, id: 42 }} onToggle={onToggle} />);
      await userEvent.click(screen.getByRole("button", { name: "Mark complete" }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "http://localhost:8080/tasks/42/complete",
          expect.objectContaining({ method: "POST" })
        );
      });
    });

    test("uses REACT_APP_API_URL with trailing slash stripped", async () => {
      const prev = process.env.REACT_APP_API_URL;
      process.env.REACT_APP_API_URL = "https://api.example.com/";
      try {
        const onToggle = jest.fn();
        mockGetToken.mockResolvedValue("t");
        global.fetch.mockResolvedValue({
          ok: true,
          json: async () => ({ user: { xp: 0, level: 1, streak: 0 } }),
        });

        render(<TaskCard task={baseTask} onToggle={onToggle} />);
        await userEvent.click(screen.getByRole("button", { name: "Mark complete" }));

        await waitFor(() => {
          expect(global.fetch).toHaveBeenCalledWith(
            "https://api.example.com/tasks/1/complete",
            expect.any(Object)
          );
        });
      } finally {
        if (prev === undefined) {
          delete process.env.REACT_APP_API_URL;
        } else {
          process.env.REACT_APP_API_URL = prev;
        }
      }
    });

    test("falls back to local toggle when token is missing (no fetch)", async () => {
      const onToggle = jest.fn();
      mockGetToken.mockResolvedValue(null);

      render(<TaskCard task={baseTask} onToggle={onToggle} />);
      await userEvent.click(screen.getByRole("button", { name: "Mark complete" }));

      expect(global.fetch).not.toHaveBeenCalled();
      await waitFor(() => {
        expect(onToggle).toHaveBeenCalledWith("1", { completed: true });
      });
    });

    test("falls back to local toggle when fetch rejects", async () => {
      const onToggle = jest.fn();
      mockGetToken.mockResolvedValue("clerk-token");
      global.fetch.mockRejectedValue(new Error("network error"));

      render(<TaskCard task={baseTask} onToggle={onToggle} />);
      await userEvent.click(screen.getByRole("button", { name: "Mark complete" }));

      await waitFor(() => {
        expect(onToggle).toHaveBeenCalledWith("1", { completed: true });
      });
    });

    test("falls back to local toggle when response is not ok", async () => {
      const onToggle = jest.fn();
      mockGetToken.mockResolvedValue("clerk-token");
      global.fetch.mockResolvedValue({
        ok: false,
        status: 403,
        json: async () => ({}),
      });

      render(<TaskCard task={baseTask} onToggle={onToggle} />);
      await userEvent.click(screen.getByRole("button", { name: "Mark complete" }));

      await waitFor(() => {
        expect(onToggle).toHaveBeenCalledTimes(1);
      });
      expect(onToggle.mock.calls[0]).toEqual(["1", { completed: true }]);
    });

    test("DELETEs to complete endpoint when marking incomplete", async () => {
      const onToggle = jest.fn();
      mockGetToken.mockResolvedValue("clerk-token");
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ taskId: "1", user: { xp: 20, level: 2, streak: 3 } }),
      });

      render(<TaskCard task={{ ...baseTask, completed: true }} onToggle={onToggle} />);
      await userEvent.click(screen.getByRole("button", { name: "Mark incomplete" }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "http://localhost:8080/tasks/1/complete",
          expect.objectContaining({ method: "DELETE" })
        );
      });

      await waitFor(() => {
        expect(onToggle).toHaveBeenCalledWith("1", {
          completed: false,
          user: { xp: 20, level: 2, streak: 3 },
        });
      });
    });

    test("disables toggle button while request is in flight", async () => {
      const onToggle = jest.fn();
      mockGetToken.mockResolvedValue("clerk-token");
      let resolveFetch;
      global.fetch.mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveFetch = resolve;
          })
      );

      render(<TaskCard task={baseTask} onToggle={onToggle} />);
      const button = screen.getByRole("button", { name: "Mark complete" });

      await userEvent.click(button);

      await waitFor(() => expect(button).toBeDisabled());

      resolveFetch({
        ok: true,
        json: async () => ({ user: { xp: 1, level: 1, streak: 1 } }),
      });

      await waitFor(() => expect(button).not.toBeDisabled());
      expect(onToggle).toHaveBeenCalledTimes(1);
    });
  });
});
