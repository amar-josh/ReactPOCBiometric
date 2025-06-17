import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import FullScreenLoader from "../FullScreenLoader";

describe("FullScreenLoader", () => {
  it("renders a spinner", () => {
    render(<FullScreenLoader />);
    const spinner = screen.getByTestId("spinner");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("animate-spin", "text-primary");
  });

  it("renders the full-screen overlay", () => {
    const { container } = render(<FullScreenLoader />);
    const backdrop = container.firstChild;
    expect(backdrop).toHaveClass(
      "fixed",
      "inset-0",
      "z-50",
      "flex",
      "items-center",
      "justify-center",
      "bg-black/10",
      "backdrop-blur-[1px]"
    );
  });
});
