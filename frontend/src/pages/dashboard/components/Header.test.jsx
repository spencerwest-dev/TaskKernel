import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "./Header";

describe("Header", () => {
  test("renders header controls", () => {
    render(<Header query="" />);
    
    expect(screen.getByPlaceholderText(/search tasks/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /tags \/ filters/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add task/i })).toBeInTheDocument();
  });

  test("calls onQueryChange when user types in search input", async () => {
    const mockOnQueryChange = jest.fn();

    render(<Header query="" onQueryChange={mockOnQueryChange} />);

    const input = screen.getByPlaceholderText(/search tasks/i);
    await userEvent.type(input, "study");

    expect(mockOnQueryChange).toHaveBeenCalled();
  });

  test("calls onOpenFilters when filter button is clicked", async () => {
    const mockOnOpenFilters = jest.fn();

    render(<Header query="" onOpenFilters={mockOnOpenFilters} />);

    const button = screen.getByRole("button", { name: /tags \/ filters/i });
    await userEvent.click(button);

    expect(mockOnOpenFilters).toHaveBeenCalledTimes(1);
  });

  test("calls onAddTask when add task button is clicked", async () => {
    const mockOnAddTask = jest.fn();

    render(<Header query="" onAddTask={mockOnAddTask} />);

    const button = screen.getByRole("button", { name: /add task/i });
    await userEvent.click(button);

    expect(mockOnAddTask).toHaveBeenCalledTimes(1);
  });

  test("renders passed xp, level, and streak values", () => {
    render(<Header query="" xp={150} level={4} streak={12} />);

    expect(screen.getByText("150")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("XP")).toBeInTheDocument();
    expect(screen.getByText("Level")).toBeInTheDocument();
    expect(screen.getByText("Streak")).toBeInTheDocument();
  });
});