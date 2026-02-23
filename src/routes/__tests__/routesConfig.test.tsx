import { render, screen } from "@testing-library/react";
import { Suspense } from "react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

import { ROUTES } from "../constants";
import { privateRoutes, publicRoute } from "../routesConfig";

// --- Mock all lazy-loaded components ---
vi.mock("@/components/common/PageNotFound", () => ({
  default: () => <div data-testid="PageNotFound" />,
}));
vi.mock("@/components/common/SessionExpired", () => ({
  default: () => <div data-testid="SessionExpired" />,
}));
vi.mock("@/components/common/Unauthorized", () => ({
  default: () => <div data-testid="Unauthorized" />,
}));
vi.mock("@/features/home", () => ({
  default: () => <div data-testid="Home" />,
}));
vi.mock("@/features/mobile-number-update", () => ({
  default: () => <div data-testid="MobileNumberUpdate" />,
}));
vi.mock("@/features/mobile-number-update/components/LinkVerification", () => ({
  default: () => <div data-testid="LinkVerification" />,
}));
vi.mock("@/features/re-kyc", () => ({
  default: () => <div data-testid="ReKYC" />,
}));

vi.mock("react-router", async () => {
  const actual =
    await vi.importActual<typeof import("react-router")>("react-router");
  return {
    ...actual,
    useNavigate: vi.fn(),
    useLocation: vi.fn(),
  };
});

describe("Route Configs", () => {
  it("should include correct private routes", () => {
    const paths = privateRoutes.map((r) => r.path);
    expect(paths).toContain(ROUTES.HOME);
    expect(paths).toContain(ROUTES.RE_KYC);
    expect(paths).toContain(ROUTES.MOBILE_NUMBER_UPDATE);
  });

  it("should include correct public routes", () => {
    const paths = publicRoute.map((r) => r.path);
    expect(paths).toContain(ROUTES.UNAUTHORIZED);
    expect(paths).toContain(ROUTES.SESSION_EXPIRED);
    expect(paths).toContain(ROUTES.PAGE_NOT_FOUND);
  });

  it("renders all private route elements", async () => {
    for (const route of privateRoutes) {
      render(<Suspense fallback="loading...">{route.element}</Suspense>);
      const testId = await screen.findByTestId(
        route.path === ROUTES.HOME
          ? "Home"
          : route.path === ROUTES.RE_KYC
            ? "ReKYC"
            : "MobileNumberUpdate"
      );
      expect(testId).toBeInTheDocument();
    }
  });

  it("renders all public route elements", async () => {
    for (const route of publicRoute) {
      render(
        <MemoryRouter>
          <Suspense fallback="loading...">{route.element}</Suspense>
        </MemoryRouter>
      );

      const testId = await screen.findByTestId(
        route.path === ROUTES.UNAUTHORIZED
          ? "Unauthorized"
          : route.path === ROUTES.SESSION_EXPIRED
            ? "SessionExpired"
            : "LottieMock"
      );

      expect(testId).toBeInTheDocument();
    }
  });
});
