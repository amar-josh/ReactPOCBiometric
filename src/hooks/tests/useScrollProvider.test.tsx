import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useScrollProvider } from "../useScrollProvider";

describe("useScrollProvider", () => {
  it("should return a ref and a scrollToContentTop function", () => {
    const { result } = renderHook(() => useScrollProvider());
    expect(result.current).toHaveProperty("mainContentRef");
    expect(result.current).toHaveProperty("scrollToContentTop");
    expect(typeof result.current.scrollToContentTop).toBe("function");
  });

  it("should call scrollTo on the ref's current element", () => {
    const { result } = renderHook(() => useScrollProvider());
    const mockScrollTo = vi.fn();
    // Simulate the ref being attached to an element
    result.current.mainContentRef.current = { scrollTo: mockScrollTo } as any;

    act(() => {
      result.current.scrollToContentTop();
    });

    expect(mockScrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("should not throw if ref is null", () => {
    const { result } = renderHook(() => useScrollProvider());
    // mainContentRef.current is null by default
    expect(() => {
      act(() => {
        result.current.scrollToContentTop();
      });
    }).not.toThrow();
  });
});
