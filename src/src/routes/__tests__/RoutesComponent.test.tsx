import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import RoutesComponent from "../RoutesComponent";

// --- Mocks ---
vi.mock("@/components/common/ErrorBoundaryWrapper", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>Mock ErrorBoundary: {children}</div>
  ),
}));

vi.mock("@/components/common/FullScreenLoader", () => ({
  default: () => <div>Loading...</div>,
}));

vi.mock("@/features/login", () => ({
  default: () => <div>Login Page</div>,
}));

vi.mock("@/layout/PublicLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>
      Public Layout
      {children}
    </div>
  ),
}));

vi.mock("@/layout/PrivateLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>
      Private Layout
      {children}
    </div>
  ),
}));

vi.mock("../components/PrivateRoutes", () => ({
  default: ({ element }: { element: React.ReactNode }) => (
    <div>Private Route: {element}</div>
  ),
}));

vi.mock("../routesConfig", () => ({
  publicRoute: [{ path: "about", element: <div>About Page</div> }],
  privateRoutes: [{ path: "dashboard", element: <div>Dashboard Page</div> }],
}));

vi.mock("../constants", () => ({
  ROUTES: {
    LOGIN: "/login",
  },
}));

// --- Helper ---
const setPath = (path: string) => {
  window.history.pushState({}, "Test page", path);
};

describe("RoutesComponent", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("renders login route with ErrorBoundary", () => {
    setPath("/stp/login");
    render(<RoutesComponent />);
    expect(screen.getByText("Mock ErrorBoundary:")).toBeInTheDocument();
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });
});
