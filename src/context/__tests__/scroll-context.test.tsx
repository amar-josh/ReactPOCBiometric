import { renderHook } from "@testing-library/react";
import { ReactNode } from "react";
import { describe, expect, it } from "vitest";

import ScrollContext, { useScrollToContentTop } from "../scroll-context";

describe("useScrollToContentTop", () => {
  const mockScrollToContentTop = vi.fn();

  const wrapper = ({ children }: { children: ReactNode }) => (
    <ScrollContext.Provider
      value={{ scrollToContentTop: mockScrollToContentTop }}
    >
      {children}
    </ScrollContext.Provider>
  );

  it("returns context value when inside provider", () => {
    const { result } = renderHook(() => useScrollToContentTop(), { wrapper });

    expect(result.current).toBeDefined();
    expect(typeof result.current?.scrollToContentTop).toBe("function");

    // Call the function and check the mock
    result.current?.scrollToContentTop();
    expect(mockScrollToContentTop).toHaveBeenCalled();
  });

  it("returns undefined when used outside provider", () => {
    const { result } = renderHook(() => useScrollToContentTop());

    expect(result.current).toBeUndefined();
  });
});
