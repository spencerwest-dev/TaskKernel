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

  test("opens sort dropdown and calls onSortChange when an option is selected", async () => {
    const mockOnSortChange = jest.fn();

    render(
      <Header
        query=""
        sortOrder="latest"
        onSortChange={mockOnSortChange}
        onAddTask={() => {}}
      />
    );

    const button = screen.getByRole("button", { name: /tags \/ filters/i });
    await userEvent.click(button);

    await userEvent.click(screen.getByRole("button", { name: /^oldest$/i }));

    expect(mockOnSortChange).toHaveBeenCalledWith("oldest");
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