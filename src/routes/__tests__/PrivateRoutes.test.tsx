import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getSessionStorageData } from "@/lib/sessionStorage";
import PrivateRoute from "../components/PrivateRoutes";
import { ROUTES } from "../constants";

// Mock sessionStorage utility
vi.mock("@/lib/sessionStorage", () => ({
  getSessionStorageData: vi.fn(),
}));

const TestComponent = () => <div>Protected Content</div>;
const LoginComponent = () => <div>Login Page</div>;

describe("PrivateRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders protected component when token is set", () => {
    vi.mocked(getSessionStorageData).mockReturnValue("fake-token");

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={<PrivateRoute element={<TestComponent />} />}
          />
          <Route path={ROUTES.LOGIN} element={<LoginComponent />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("redirects to login when token is not set", () => {
    vi.mocked(getSessionStorageData).mockReturnValue(null);

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={<PrivateRoute element={<TestComponent />} />}
          />
          <Route path={ROUTES.LOGIN} element={<LoginComponent />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });
});
