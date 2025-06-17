import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useHandleProtectedBackNavigation } from "../useHandleProtectedBackNavigation";

// Mocks
const mockNavigate = vi.fn();
const mockUseLocation = vi.fn();
const mockUseNavigationType = vi.fn();

vi.mock("react-router", () => ({
  useLocation: () => mockUseLocation(),
  useNavigate: () => mockNavigate,
  useNavigationType: () => mockUseNavigationType(),
}));

vi.mock("@/routes/constants", () => ({
  PRIVATE_ROUTES: ["/protected", "/dashboard"],
  ROUTES: { HOME: "/home" },
}));

describe("useHandleProtectedBackNavigation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not navigate if navigationType is not POP", () => {
    mockUseLocation.mockReturnValue({ pathname: "/protected" });
    mockUseNavigationType.mockReturnValue("PUSH");

    renderHook(() => useHandleProtectedBackNavigation());

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should not navigate if route is not protected", () => {
    mockUseLocation.mockReturnValue({ pathname: "/public" });
    mockUseNavigationType.mockReturnValue("POP");

    renderHook(() => useHandleProtectedBackNavigation());

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("should navigate to HOME if navigationType is POP and route is protected", () => {
    mockUseLocation.mockReturnValue({ pathname: "/protected/settings" });
    mockUseNavigationType.mockReturnValue("POP");

    renderHook(() => useHandleProtectedBackNavigation());

    expect(mockNavigate).toHaveBeenCalledWith("/home", { replace: true });
  });

  it("should navigate to HOME if navigationType is POP and route matches another protected route", () => {
    mockUseLocation.mockReturnValue({ pathname: "/dashboard/analytics" });
    mockUseNavigationType.mockReturnValue("POP");

    renderHook(() => useHandleProtectedBackNavigation());

    expect(mockNavigate).toHaveBeenCalledWith("/home", { replace: true });
  });
});
