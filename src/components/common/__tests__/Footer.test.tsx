import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import Footer from "../Footer";

// Mock the translator function
vi.mock("@/i18n/translator", () => ({
  default: (key: string) => key,
}));

describe("Footer", () => {
  test("renders footer text using translator key", () => {
    render(<Footer />);
    expect(screen.getByText("footer")).toBeInTheDocument();
  });

  test("applies custom className", () => {
    render(<Footer className="bg-gray-100" />);
    const footer = screen.getByText("footer");
    expect(footer).toHaveClass("bg-gray-100");
  });
});
