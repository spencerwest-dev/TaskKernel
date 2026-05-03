import React from "react";
import { render, screen } from "@testing-library/react";
import XpBar from "./XpBar";

// mock the xpSystem functions
jest.mock("./xpSystem", () => ({
  getLevel: jest.fn(),
  getXpIntoCurrentLevel: jest.fn(),
  getXpPercent: jest.fn(),
}));

import {
  getLevel,
  getXpIntoCurrentLevel,
  getXpPercent,
} from "./xpSystem";

describe("XpBar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders level and xp correctly", () => {
    getLevel.mockReturnValue(3);
    getXpIntoCurrentLevel.mockReturnValue(40);
    getXpPercent.mockReturnValue(40);

    render(<XpBar xp={340} />);

    expect(screen.getByText(/Level/i)).toHaveTextContent("Level 3");
    expect(screen.getByText("40 / 100 XP")).toBeInTheDocument();
  });

  test("renders progress bar width based on percent", () => {
    getLevel.mockReturnValue(2);
    getXpIntoCurrentLevel.mockReturnValue(50);
    getXpPercent.mockReturnValue(50);

    const { container } = render(<XpBar xp={250} />);

    const progressBar = container.querySelector(".bg-\\[\\#e9a319\\]");
    expect(progressBar).toHaveStyle("width: 50%");
  });

  test("updates when xp changes", () => {
    getLevel.mockReturnValue(5);
    getXpIntoCurrentLevel.mockReturnValue(75);
    getXpPercent.mockReturnValue(75);

    render(<XpBar xp={575} />);

    expect(screen.getByText("75 / 100 XP")).toBeInTheDocument();
    expect(screen.getByText(/Level/i)).toHaveTextContent("Level 5");
  });
});
