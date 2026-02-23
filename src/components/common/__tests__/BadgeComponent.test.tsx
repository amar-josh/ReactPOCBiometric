import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import BadgeComponent from "../BadgeComponent";

describe("BadgeComponent", () => {
  it("renders with default variant (success)", () => {
    render(<BadgeComponent label="Active" />);

    const badge = screen.getByText("Active");

    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass(
      "px-2.5",
      "py-1",
      "border-1",
      "text-md",
      "text-xs",
      "rounded-md",
      "bg-green-100",
      "text-green-800",
      "border-green-200"
    );
  });

  it("renders with warning variant", () => {
    render(<BadgeComponent label="Pending" variant="warning" />);

    const badge = screen.getByText("Pending");

    expect(badge).toHaveClass(
      "bg-yellow-100",
      "text-yellow-800",
      "border-yellow-200"
    );
  });

  it("renders with info variant", () => {
    render(<BadgeComponent label="Info" variant="info" />);

    const badge = screen.getByText("Info");

    expect(badge).toHaveClass(
      "bg-blue-100",
      "text-blue-800",
      "border-blue-200"
    );
  });

  it("renders with danger variant", () => {
    render(<BadgeComponent label="Error" variant="danger" />);

    const badge = screen.getByText("Error");

    expect(badge).toHaveClass("bg-red-100", "text-red-800", "border-red-200");
  });

  it("renders with success variant explicitly provided", () => {
    render(<BadgeComponent label="Success" variant="success" />);
    const badge = screen.getByText("Success");
    expect(badge).toHaveClass("bg-green-100");
  });

  it("handles invalid variant by falling back (Branch Coverage)", () => {
    render(<BadgeComponent label="Invalid" variant="unknown" />);
    const badge = screen.getByText("Invalid");
    expect(badge).toHaveClass("px-2.5", "rounded-md");
    expect(badge).not.toHaveClass("bg-green-100");
  });
});
