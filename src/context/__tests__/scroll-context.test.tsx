import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import ScrollContext, { useScrollToContentTop } from "../scroll-context";
const mockScrollFn = vi.fn();

const wrapperWithProvider = ({ children }: { children: ReactNode }) => (
  <ScrollContext.Provider value={{ scrollToContentTop: mockScrollFn }}>
    {children}
  </ScrollContext.Provider>
);

describe("useScrollToContentTop", () => {
  it("should return context value when used within provider", () => {
    const { result } = renderHook(() => useScrollToContentTop(), {
      wrapper: wrapperWithProvider,
    });

    expect(result.current).toBeDefined();
    expect(typeof result.current?.scrollToContentTop).toBe("function");
  });

  it("should log an error and return undefined when used outside provider", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const { result } = renderHook(() => useScrollToContentTop());
    expect(result.current).toBeUndefined();
    expect(logSpy).toHaveBeenCalledWith(
      "Error: Context not found, useScrollToContentTop must be used within a ScrollProvider"
    );
    logSpy.mockRestore();
  });
});
