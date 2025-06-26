import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useGetInstaServices } from "../hooks";
import * as services from "../services"; // adjust path based on location

const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

vi.mock("../services", () => ({
  getInstaServices: vi.fn(),
}));

describe("useGetInstaServices", () => {
  it("fetches and returns insta services", async () => {
    // Arrange: Mock the API response
    const mockData = {
      message: "",
      statusCode: 200,
      status: "",
      data: {
        instaServices: [
          {
            categoryId: 123,
            categoryName: "string",
            categoryDesc: "string",
            categoryKey: "string",
            categoryOrderValue: "string",
            categoryIsActive: "string",
            rolesAssigned: "string",
            modules: [
              {
                moduleId: 123,
                moduleName: "string",
                moduleDesc: "string",
                moduleKey: "string",
                moduleOrderValue: "string",
                moduleActive: "string",
              },
            ],
          },
        ],
      },
    };
    (services.getInstaServices as any).mockResolvedValue(mockData);
    const { result } = renderHook(() => useGetInstaServices(), {
      wrapper: createWrapper(),
    });

    const payload = {
      userId: "23123",
      userRole: "Emp",
    };
    await act(() => result.current.mutateAsync(payload));

    await waitFor(() => expect(result.current.data).toEqual(mockData));
    expect(services.getInstaServices).toHaveBeenCalledWith(payload);
  });
});
