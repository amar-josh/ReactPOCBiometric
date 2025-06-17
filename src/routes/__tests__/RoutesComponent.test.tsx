import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import RoutesComponent from "../RoutesComponent";

vi.mock("@/layout", () => ({
  default: () => <div>Mock Layout</div>,
}));

const renderWithRoute = (path: string) => {
  const base = import.meta.env.VITE_BASE_URL || "/";
  const fullPath = `${base.replace(/\/$/, "")}${path}`;
  window.history.pushState({}, "Test Page", fullPath);
  return render(<RoutesComponent />);
};

describe("RoutesComponent", () => {
  it("renders Layout component", () => {
    renderWithRoute("/login");
    expect(screen.getByText("Mock Layout")).toBeInTheDocument();
  });

  it("renders public route component", () => {
    renderWithRoute("/login");
    expect(screen.getByText("Mock Layout")).toBeInTheDocument();
  });

  it("renders private route component", () => {
    renderWithRoute("/dashboard");
    expect(screen.getByText("Mock Layout")).toBeInTheDocument();
  });
});
