import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

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

vi.mock("@/lib/sessionStorage", () => ({
  getSessionStorageData: vi.fn(),
}));

vi.mock("@/features/adfs-login/hooks", () => ({
  useEmpInfo: () => ({
    empName: "Sandhya",
    branchCode: "BR001",
  }),
}));

vi.mock("@/services/api.service", () => ({
  clearToken: vi.fn(),
  getIsTokenSet: () => true,
}));

vi.mock("@/components/common/HeaderWithAuth", () => ({
  default: ({
    handleLogout,
    name,
    branch,
  }: {
    handleLogout: () => void;
    name?: string | null;
    branch?: string | null;
  }) => (
    <div>
      <button onClick={handleLogout}>Logout</button>
      <span data-testid="header-name">{name}</span>
      <span data-testid="header-branch">{branch}</span>
    </div>
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
  it("redirects to login if token is not present in session storage", async () => {
    const { getSessionStorageData } = await import("@/lib/sessionStorage");

    (getSessionStorageData as Mock).mockReturnValue(null);

    render(
      <MemoryRouter>
        <PrivateLayout />
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.LOGIN);
  });
  it("does not redirect when token exists", async () => {
    const { getSessionStorageData } = await import("@/lib/sessionStorage");

    (getSessionStorageData as Mock).mockReturnValue("mock-token");

    render(
      <MemoryRouter>
        <PrivateLayout />
      </MemoryRouter>
    );

    expect(mockNavigate).not.toHaveBeenCalledWith(ROUTES.LOGIN);
  });
});
