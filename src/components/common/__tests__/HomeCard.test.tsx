import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import HomeCard, { IHomeCardProps } from "../HomePageCard";

// Mock translator
vi.mock("@/i18n/translator", () => ({
  default: (key: string) => key,
}));

describe("HomeCard component", () => {
  const mockClickHandler = vi.fn();
  const props: IHomeCardProps = {
    icon: "/test-icon.png",
    label: "Test Module",
    description: "This is a test description.",
    onHandleClick: mockClickHandler,
    moduleKey: "test-module",
  };

  beforeEach(() => {
    mockClickHandler.mockClear();
  });

  test("renders icon, label, and description", () => {
    render(<HomeCard {...props} />);
    expect(screen.getByText("Test Module")).toBeInTheDocument();
    expect(screen.getByText("This is a test description.")).toBeInTheDocument();
    expect(screen.getByRole("img")).toBeInTheDocument(); // <img src=icon>
  });

  test('renders "button.proceed" as button text from translator', () => {
    render(<HomeCard {...props} />);
    expect(
      screen.getByRole("button", { name: /button.proceed/i })
    ).toBeInTheDocument();
  });

  test("calls onHandleClick with moduleKey when button is clicked", () => {
    render(<HomeCard {...props} />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockClickHandler).toHaveBeenCalledWith("test-module");
    expect(mockClickHandler).toHaveBeenCalledTimes(1);
  });
});
