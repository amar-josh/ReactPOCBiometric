// src/features/your-feature/__tests__/useGetInstaServices.test.tsx

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useGetInstaServices } from "../hooks";
import * as services from "../services"; // adjust path based on location

const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useGetInstaServices", () => {
  it("fetches and returns insta services", async () => {
    // Arrange: Mock the API response
    const mockData = [{ id: 1, name: "Service A" }];
    vi.spyOn(services, "getInstaServices").mockResolvedValue(mockData);

    // Act
    const { result } = renderHook(() => useGetInstaServices(), {
      wrapper: createWrapper(),
    });

    // Assert: Wait until the query is successful
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
  });
});
