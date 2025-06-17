import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock navigate
const mockNavigate = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("@/routes/constants", () => ({
  ROUTES: {
    SESSION_EXPIRED: "/session-expired",
  },
}));

vi.mock("@/services/api.service", () => ({
  clearToken: vi.fn(),
}));

import useInactivityLogout from "@/hooks/useInactivityLogout";
import * as apiService from "@/services/api.service";

vi.useFakeTimers();

describe("useInactivityLogout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call clearToken and navigate to session expired after timeout", () => {
    renderHook(() => useInactivityLogout(true));

    vi.advanceTimersByTime(5 * 60 * 1000);

    expect(apiService.clearToken).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/session-expired", {
      replace: true,
    });
  });

  it("should reset timer on user activity", () => {
    renderHook(() => useInactivityLogout(true));

    act(() => {
      document.dispatchEvent(new Event("mousemove"));
    });

    vi.advanceTimersByTime(5 * 60 * 1000);

    expect(apiService.clearToken).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/session-expired", {
      replace: true,
    });
  });

  it("should set up and clean up event listeners", () => {
    const addEventListenerSpy = vi.spyOn(document, "addEventListener");
    const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");

    const { unmount } = renderHook(() => useInactivityLogout(true));

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "mousemove",
      expect.any(Function)
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "click",
      expect.any(Function)
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "touchstart",
      expect.any(Function)
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "mousemove",
      expect.any(Function)
    );
  });

  it("should not set listeners when not authenticated", () => {
    const addEventListenerSpy = vi.spyOn(document, "addEventListener");

    renderHook(() => useInactivityLogout(false));

    expect(addEventListenerSpy).not.toHaveBeenCalled();
  });
});
