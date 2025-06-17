import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import BadgeComponent from "../BadgeComponent";

describe("BadgeComponent", () => {
  it("renders with default variant (success)", () => {
    render(<BadgeComponent label="Active" />);
    const badge = screen.getByText("Active");

    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain("bg-green-100");
    expect(badge.className).toContain("text-green-800");
    expect(badge.className).toContain("border-green-200");
  });

  it("renders with warning variant", () => {
    render(<BadgeComponent label="Pending" variant="warning" />);
    const badge = screen.getByText("Pending");

    expect(badge.className).toContain("bg-yellow-100");
    expect(badge.className).toContain("text-yellow-800");
    expect(badge.className).toContain("border-yellow-200");
  });

  it("renders with info variant", () => {
    render(<BadgeComponent label="Info" variant="info" />);
    const badge = screen.getByText("Info");

    expect(badge.className).toContain("bg-blue-100");
    expect(badge.className).toContain("text-blue-800");
    expect(badge.className).toContain("border-blue-200");
  });

  it("renders with danger variant", () => {
    render(<BadgeComponent label="Error" variant="danger" />);
    const badge = screen.getByText("Error");

    expect(badge.className).toContain("bg-red-100");
    expect(badge.className).toContain("text-red-800");
    expect(badge.className).toContain("border-red-200");
  });
});
