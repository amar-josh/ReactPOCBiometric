import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ROUTES } from "@/routes/constants";
import RoutesComponent from "@/routes/RoutesComponent";

vi.mock("@/features/ADFSLogin", () => ({
  default: () => <div>ADFS Login Page</div>,
}));

vi.mock("@/features/login", () => ({ default: () => <div>Login Page</div> }));
vi.mock("@/features/Home", () => ({ default: () => <div>Home Page</div> }));
vi.mock("@/features/ReKYC", () => ({ default: () => <div>ReKYC Page</div> }));
vi.mock("@/features/MobileNumberUpdate", () => ({
  default: () => <div>Mobile Number Update Page</div>,
}));
vi.mock("@/features/LinkVerification", () => ({
  default: () => <div>Link Verification Page</div>,
}));
vi.mock("@/features/Unauthorized", () => ({
  default: () => <div>Unauthorized Page</div>,
}));
vi.mock("@/features/SessionExpired", () => ({
  default: () => <div>Session Expired Page</div>,
}));
vi.mock("@/features/PageNotFound", () => ({
  default: () => <div>Page Not Found</div>,
}));

vi.mock("@/layout/PrivateLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>PrivateLayout {children}</div>
  ),
}));
vi.mock("@/layout/PublicLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>PublicLayout {children}</div>
  ),
}));
vi.mock("@/components/common/ErrorBoundaryWrapper", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock("@/components/common/FullScreenLoader", () => ({
  default: () => <div>Loading...</div>,
}));
vi.mock("@/routes/components/PrivateRoutes", () => ({
  default: ({ element }: { element: React.ReactNode }) => (
    <div>PrivateRoute {element}</div>
  ),
}));

describe("RoutesComponent", () => {
  beforeEach(() => {
    vi.resetModules(); // Reset mocks for each test
  });

  it("redirects / to /login", () => {
    window.history.pushState({}, "", "/");
    render(<RoutesComponent />);
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("renders public route: /unauthorized", () => {
    window.history.pushState({}, "", ROUTES.UNAUTHORIZED);
    render(<RoutesComponent />);
    expect(screen.getByText("PublicLayout")).toBeInTheDocument();
  });

  it("renders private route: /re-kyc", () => {
    window.history.pushState({}, "", ROUTES.RE_KYC);
    render(<RoutesComponent />);
    expect(screen.getByText("PrivateLayout")).toBeInTheDocument();
  });

  it("renders private route: /mobile-update", () => {
    window.history.pushState({}, "", ROUTES.MOBILE_NUMBER_UPDATE);
    render(<RoutesComponent />);
    expect(screen.getByText("PrivateLayout")).toBeInTheDocument();
  });

  it("renders 404 route: /non-existent", () => {
    window.history.pushState({}, "", "/non-existent");
    render(<RoutesComponent />);
    expect(screen.getByText("PublicLayout")).toBeInTheDocument();
  });
});
