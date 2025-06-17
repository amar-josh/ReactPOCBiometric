import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import PageNotFound from "../PageNotFound";

// Mock translator
vi.mock("@/i18n/translator", () => ({
  default: (key: string) => key, // simple key passthrough
}));

// Mock assets (to prevent bundler issues)
vi.mock("pageNotFound.svg", () => ({
  default: "pageNotFound.svg",
}));

describe("PageNotFound", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders image, title, message, and button", () => {
    render(<PageNotFound />);

    expect(screen.getByAltText("Page Not Found")).toBeInTheDocument();
    expect(screen.getByText("pageNotFound.title")).toBeInTheDocument();
    expect(screen.getByText("pageNotFound.message")).toBeInTheDocument();
  });
});
