import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Badge } from "@/components/ui/badge";

describe("Badge component", () => {
  it("renders with default variant", () => {
    render(<Badge>Default Badge</Badge>);
    const badge = screen.getByText("Default Badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-danger"); // default variant
  });

  it("renders with primary variant", () => {
    render(<Badge variant="primary">Primary Badge</Badge>);
    const badge = screen.getByText("Primary Badge");
    expect(badge).toHaveClass("bg-primary");
  });

  it("renders with destructive variant", () => {
    render(<Badge variant="destructive">Destructive Badge</Badge>);
    const badge = screen.getByText("Destructive Badge");
    expect(badge).toHaveClass("bg-destructive");
  });

  it("renders with outline variant", () => {
    render(<Badge variant="outline">Outline Badge</Badge>);
    const badge = screen.getByText("Outline Badge");
    expect(badge).toHaveClass("text-foreground");
  });

  it("applies custom class names", () => {
    render(<Badge className="custom-class">Custom Class</Badge>);
    const badge = screen.getByText("Custom Class");
    expect(badge).toHaveClass("custom-class");
  });

  it("renders as child if asChild is true", () => {
    render(
      <Badge asChild>
        <a href="/test">Link Badge</a>
      </Badge>
    );
    const badge = screen.getByRole("link");
    expect(badge).toHaveTextContent("Link Badge");
    expect(badge.dataset.slot).toBe("badge");
  });

  it("has data-slot attribute for targeting", () => {
    render(<Badge>Slot Badge</Badge>);
    const badge = screen.getByText("Slot Badge");
    expect(badge.getAttribute("data-slot")).toBe("badge");
  });
});
