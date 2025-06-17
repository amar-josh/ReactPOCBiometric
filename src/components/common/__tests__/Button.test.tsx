import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders with default props", () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole("button", { name: "Click Me" });

    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-danger");
    expect(button).not.toBeDisabled();
  });

  it("renders with variant and size", () => {
    render(
      <Button variant="outline" size="sm">
        Small Outline
      </Button>
    );

    const button = screen.getByRole("button", { name: "Small Outline" });
    expect(button).toHaveClass("border border-primary text-primary");
    expect(button).toHaveClass("h-8");
  });

  it("renders disabled with correct styles", () => {
    render(
      <Button variant="outline" disabled>
        Disabled
      </Button>
    );

    const button = screen.getByRole("button", { name: "Disabled" });
    expect(button).toBeDisabled();
    expect(button).toHaveClass("disabled:border-gray-300");
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    const button = screen.getByRole("button", { name: "Click" });

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });

  it("does not call onClick when disabled", () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Disabled Click
      </Button>
    );

    const button = screen.getByRole("button", { name: "Disabled Click" });
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders using Slot when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/test" data-testid="slot-link">
          Link
        </a>
      </Button>
    );

    const link = screen.getByTestId("slot-link");
    expect(link.tagName.toLowerCase()).toBe("a");
    expect(link).toHaveAttribute("href", "/test");
    expect(link).toHaveClass("bg-danger");
  });
});
