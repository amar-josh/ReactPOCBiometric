import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import * as configService from "@/services/config";

import { useGetConfig } from "../useConfig";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useGetConfig hook", () => {
  it("should return data on success", async () => {
    vi.spyOn(configService, "getConfig").mockResolvedValue({
      status: "success",
      statusCode: 200,
      message: "OK",
      data: {
        cognitoApiKey: "",
        aesKey: "",
      },
    });

    const { result } = renderHook(() => useGetConfig(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.mutate();
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual({
      status: "success",
      statusCode: 200,
      message: "OK",
      data: {
        cognitoApiKey: "",
        aesKey: "",
      },
    });
  });
});
