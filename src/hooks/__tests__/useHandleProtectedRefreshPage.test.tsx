import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useHandleProtectedRefreshPage } from "../useHandleProtectedRefreshPage";

// Mocks
const mockNavigate = vi.fn();
const mockUseLocation = vi.fn();

vi.mock("react-router", () => ({
  useLocation: () => mockUseLocation(),
  useNavigate: () => mockNavigate,
}));

vi.mock("@/constants/globalConstant", () => ({
  SESSION_STORAGE_KEY: {
    RELOAD_PROTECTED_ROUTE: "RELOAD_PROTECTED_ROUTE",
    RELOAD_PROTECTED_ROUTE_VALUE: "YES",
  },
}));

vi.mock("@/routes/constants", () => ({
  PRIVATE_ROUTES: ["/protected", "/dashboard"],
  ROUTES: { HOME: "/home" },
}));

describe("useHandleProtectedRefreshPage", () => {
  let addEventListenerSpy: ReturnType<typeof vi.spyOn>;
  let removeEventListenerSpy: ReturnType<typeof vi.spyOn>;
  let setItemSpy: ReturnType<typeof vi.spyOn>;
  let getItemSpy: ReturnType<typeof vi.spyOn>;
  let removeItemSpy: ReturnType<typeof vi.spyOn>;
  let pushStateSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    addEventListenerSpy = vi.spyOn(window, "addEventListener");
    removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    setItemSpy = vi.spyOn(window.sessionStorage, "setItem");
    getItemSpy = vi.spyOn(window.sessionStorage, "getItem") as ReturnType<
      typeof vi.spyOn
    >;
    removeItemSpy = vi.spyOn(window.sessionStorage, "removeItem");
    pushStateSpy = vi.spyOn(window.history, "pushState");
    mockUseLocation.mockReturnValue({ pathname: "/protected" });
  });

  afterEach(() => {
    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
    setItemSpy.mockRestore();
    getItemSpy.mockRestore();
    removeItemSpy.mockRestore();
    pushStateSpy.mockRestore();
  });

  it("should add and remove beforeunload event listener", () => {
    renderHook(() => useHandleProtectedRefreshPage());
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "beforeunload",
      expect.any(Function)
    );
    // Unmount to trigger cleanup
    renderHook(() => useHandleProtectedRefreshPage()).unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "beforeunload",
      expect.any(Function)
    );
  });

  // TODO - Not sure how to test it
  // it("should set sessionStorage on beforeunload for protected route", () => {
  //   renderHook(() => useHandleProtectedRefreshPage());
  //   // Find the handler
  //   const handler = addEventListenerSpy.mock.calls.find(
  //     ([event]) => event === "beforeunload"
  //   )[1];
  //   const event = { preventDefault: vi.fn() };
  //   handler(event);
  //   expect(setItemSpy).toHaveBeenCalledWith("RELOAD_PROTECTED_ROUTE", "YES");
  //   expect(event.preventDefault).toHaveBeenCalled();
  // });

  it("should not set sessionStorage on beforeunload for non-protected route", () => {
    mockUseLocation.mockReturnValue({ pathname: "/public" });
    renderHook(() => useHandleProtectedRefreshPage());
    const handler =
      addEventListenerSpy.mock.calls.find(
        ([event]) => event === "beforeunload"
      )?.[1] ?? (() => {});
    const event = { preventDefault: vi.fn() };
    if (typeof handler === "function") {
      if (typeof handler === "function") {
        handler(event);
      }
    }
    expect(setItemSpy).not.toHaveBeenCalled();
  });

  // TODO - Not sure unable to test it
  //   it("should navigate to HOME if sessionStorage key is set on mount", () => {
  //     getItemSpy.mockReturnValue("YES");
  //     renderHook(() => useHandleProtectedRefreshPage());
  //     expect(removeItemSpy).toHaveBeenCalledWith("RELOAD_PROTECTED_ROUTE");
  //     expect(mockNavigate).toHaveBeenCalledWith("/home", { replace: true });
  //   });

  it("should add and remove popstate event listener and pushState", () => {
    renderHook(() => useHandleProtectedRefreshPage());
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "popstate",
      expect.any(Function)
    );
    expect(pushStateSpy).toHaveBeenCalled();
    // Unmount to trigger cleanup
    renderHook(() => useHandleProtectedRefreshPage()).unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "popstate",
      expect.any(Function)
    );
  });

  it("should prevent default on popstate", () => {
    renderHook(() => useHandleProtectedRefreshPage());
    const handler =
      addEventListenerSpy.mock.calls.find(
        ([event]) => event === "popstate"
      )?.[1] ?? (() => {});
    const event = { preventDefault: vi.fn() };
    if (typeof handler === "function") {
      handler(event);
    }
    expect(event.preventDefault).toHaveBeenCalled();
    expect(pushStateSpy).toHaveBeenCalled();
  });
});
