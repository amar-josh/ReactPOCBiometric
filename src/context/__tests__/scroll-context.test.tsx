import { renderHook } from "@testing-library/react";
import { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import ScrollContext, { useScrollToContentTop } from "../scroll-context";

describe("useScrollToContentTop", () => {
  const mockScrollFn = vi.fn();

  const wrapper = ({ children }: { children: ReactNode }) => (
    <ScrollContext.Provider value={{ scrollToContentTop: mockScrollFn }}>
      {children}
    </ScrollContext.Provider>
  );

  it("returns context value when used inside provider", () => {
    const { result } = renderHook(() => useScrollToContentTop(), { wrapper });
    expect(result.current.scrollToContentTop).toBe(mockScrollFn);
  });
});
