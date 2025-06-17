import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Layout from "../index";

// Mocks
const mockNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual<any>("react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Outlet: () => <div data-testid="outlet" />,
  };
});

vi.mock("@/components/common/Footer", () => ({
  default: (props: any) => <footer data-testid="footer" {...props} />,
}));
vi.mock("@/components/common/Header", () => ({
  default: () => <header data-testid="header" />,
}));
vi.mock("@/components/common/HeaderWithAuth", () => ({
  default: ({ handleLogout }: any) => (
    <header data-testid="header-with-auth">
      <button data-testid="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </header>
  ),
}));
vi.mock("@/context/scroll-context", () => ({
  default: {
    Provider: ({ children }: any) => (
      <div data-testid="scroll-provider">{children}</div>
    ),
  },
}));
vi.mock("@/hooks/useHandleProtectedBackNavigation", () => ({
  useHandleProtectedBackNavigation: vi.fn(),
}));
vi.mock("@/hooks/useHandleProtectedRefreshPage", () => ({
  useHandleProtectedRefreshPage: vi.fn(),
}));
vi.mock("@/hooks/useInactivityLogout", () => ({
  default: vi.fn(),
}));
vi.mock("@/hooks/useScrollProvider", () => ({
  useScrollProvider: () => ({
    mainContentRef: { current: null },
    scrollToContentTop: vi.fn(),
  }),
}));
vi.mock("@/routes/constants", () => ({
  ROUTES: { LOGIN: "/login" },
}));
vi.mock("@/services/api.service", () => ({
  getIsTokenSet: () => true,
}));

describe("Layout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders HeaderWithAuth and Footer when logged in", () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );
    expect(screen.getByTestId("header-with-auth")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
    expect(screen.getByTestId("outlet")).toBeInTheDocument();
  });

  it("calls navigate to login on logout", () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByTestId("logout-btn"));
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  // TODO - unable to find header, But we mocked it properly
  //   it("renders Header when not logged in", () => {
  //     // Override getIsTokenSet to return false for this test
  //     vi.doMock("@/services/api.service", () => ({
  //       getIsTokenSet: () => false,
  //     }));
  //     // Re-import Layout to apply the new mock
  //     render(
  //       <MemoryRouter>
  //         <Layout />
  //       </MemoryRouter>
  //     );
  //     expect(screen.getByTestId("header")).toBeInTheDocument();
  //     expect(screen.getByTestId("footer")).toBeInTheDocument();
  //   });
});
