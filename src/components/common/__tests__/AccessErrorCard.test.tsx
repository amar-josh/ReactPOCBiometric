import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import AccessErrorCard from "../AccessErrorCard";

// ✅ Mock the translator
vi.mock("@/i18n/translator", () => ({
  default: (key: string) => key,
}));

describe("AccessErrorCard", () => {
  const defaultProps = {
    title: "access.denied",
    description: "you.do.not.have.permission",
    primaryButtonText: "go.back",
    primaryButtonType: "primary",
    onClickPrimaryButton: vi.fn(),
  };

  it("renders title, description, and button", () => {
    render(<AccessErrorCard {...defaultProps} />);

    expect(screen.getByText("access.denied")).toBeInTheDocument();
    expect(screen.getByText("you.do.not.have.permission")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "go.back" })).toBeInTheDocument();
  });

  it("calls onClickPrimaryButton when button is clicked", () => {
    render(<AccessErrorCard {...defaultProps} />);

    const button = screen.getByRole("button", { name: "go.back" });
    fireEvent.click(button);

    expect(defaultProps.onClickPrimaryButton).toHaveBeenCalledTimes(1);
  });

  it("uses default button text if none provided", () => {
    render(
      <AccessErrorCard
        title="title"
        description="desc"
        onClickPrimaryButton={vi.fn()}
      />
    );

    expect(screen.getByText("button.backToLogin")).toBeInTheDocument();
  });
});
