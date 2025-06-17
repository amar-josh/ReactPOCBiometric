import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Header from "../Header";

describe("Header", () => {
  it("renders the logo with correct alt text", () => {
    render(<Header />);
    const logoImg = screen.getByAltText("Bandhan Bank");

    expect(logoImg).toBeInTheDocument();
    expect(logoImg.tagName).toBe("IMG");
  });

  it("applies header styles", () => {
    render(<Header />);
    const header = screen.getByRole("banner");

    expect(header).toBeInTheDocument();
    expect(header.className).toContain("bg-primary");
    expect(header.className).toContain("min-h-20");
    expect(header.className).toContain("px-12");
  });
});
