import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import HomeCard from "../component/HomeCard";

// ✅ Mock translator to return the input string
vi.mock("@/i18n/translator", () => ({
  default: (key: string) => key,
}));

// ✅ Mock lucide-react icon to avoid rendering issues
vi.mock("lucide-react", () => ({
  MoveRightIcon: () => <span data-testid="icon">➡️</span>,
}));

describe("HomeCard", () => {
  const mockOnClick = vi.fn();

  const defaultProps = {
    icon: "https://dummyimage.com/100x100",
    label: "home.cardLabel",
    description: "home.cardDescription",
    onClick: mockOnClick,
  };

  it("renders label, description and icon", () => {
    render(<HomeCard {...defaultProps} />);
    expect(screen.getByText("home.cardLabel")).toBeInTheDocument();
    expect(screen.getByText("home.cardDescription")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", defaultProps.icon);
    expect(screen.getByTestId("icon")).toBeInTheDocument(); // MoveRightIcon
  });

  it("calls onClick when button is clicked", () => {
    render(<HomeCard {...defaultProps} />);
    const button = screen.getByRole("button", { name: /button.proceed/i });
    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
