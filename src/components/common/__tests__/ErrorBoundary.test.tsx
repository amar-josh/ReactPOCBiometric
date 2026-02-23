import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ErrorBoundary } from "../ErrorBoundary";

// Mock the fallback component
vi.mock("./ErrorBoundaryWrapper", () => ({
  __esModule: true,
  default: () => <div data-testid="default-fallback">Default Fallback</div>,
}));

// Set up router-related mocks
vi.mock("react-router", async () => {
  const actual =
    await vi.importActual<typeof import("react-router")>("react-router");
  return {
    ...actual,
    useNavigate: vi.fn(),
    useLocation: vi.fn(() => ({ pathname: "/" })), // ✅ mock pathname
  };
});

// Component that throws error
const ProblemChild = () => {
  throw new Error("Test error");
};

// Component that renders normally
const NormalChild = () => <div data-testid="normal-child">Working</div>;

describe("ErrorBoundary", () => {
  const originalError = console.error;

  beforeEach(() => {
    // Suppress expected error output in test logs
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalError;
  });

  it("renders children when no error is thrown", () => {
    render(
      <ErrorBoundary>
        <NormalChild />
      </ErrorBoundary>
    );

    expect(screen.getByTestId("normal-child")).toBeInTheDocument();
  });

  it("renders provided fallback when error is thrown", () => {
    render(
      <ErrorBoundary fallback={<div data-testid="custom-fallback">Oops!</div>}>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
  });

  it("logs error when caught", () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(console.error).toHaveBeenCalled();
  });
});
