import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ROUTES } from "@/routes/constants";

import PrivateLayout from "../PrivateLayout";

// Mocks
const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Outlet: () => <div>Mocked Outlet</div>,
  };
});

vi.mock("@/services/api.service", () => ({
  clearToken: vi.fn(),
  getIsTokenSet: () => true,
}));

vi.mock("@/components/common/HeaderWithAuth", () => ({
  default: ({ handleLogout }: { handleLogout: () => void }) => (
    <button onClick={handleLogout}>Logout</button>
  ),
}));

vi.mock("@/components/common/Footer", () => ({
  default: ({ className }: { className: string }) => (
    <div className={className}>Mocked Footer</div>
  ),
}));

vi.mock("@/hooks/useHandleProtectedBackNavigation", () => ({
  useHandleProtectedBackNavigation: () => {},
}));

vi.mock("@/hooks/useHandleProtectedRefreshPage", () => ({
  useHandleProtectedRefreshPage: () => {},
}));

vi.mock("@/hooks/useInactivityLogout", () => ({
  default: () => {},
}));

vi.mock("@/hooks/useScrollProvider", () => ({
  useScrollProvider: () => ({
    mainContentRef: { current: null },
    scrollToContentTop: vi.fn(),
  }),
}));

describe("Private Layout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders private layout structure correctly", () => {
    render(
      <MemoryRouter>
        <PrivateLayout />
      </MemoryRouter>
    );

    expect(screen.getByText("Mocked Outlet")).toBeInTheDocument();
    expect(screen.getByText("Mocked Footer")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Logout" })).toBeInTheDocument();
  });

  it("logs out and navigates to login", async () => {
    const { clearToken } = await import("@/services/api.service");

    render(
      <MemoryRouter>
        <PrivateLayout />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: "Logout" }));

    expect(clearToken).toHaveBeenCalledOnce();
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.LOGIN);
  });
});
