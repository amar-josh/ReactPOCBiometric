// hooks.test.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useGenerateLink, useSearchDetails } from "../hooks";
import {
  generateVerifyLinkRequest,
  generateVerifyLinkResponse,
} from "../mocks/generateVerifyLinkMock";
import {
  generateLinkRequestMock,
  generateLinkResponseMock,
  generateLinkResponseMockFirstTime,
  generatelinkResponseMockVerificationDone,
} from "../mocks/searchDetailsMock"; // move your mocks into a __mocks__ folder ideally
import { generateLinkService, getSearchDetailsService } from "../services";

// utility wrapper for react-query
const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

// mock services
vi.mock("../services", () => ({
  getSearchDetailsService: vi.fn(),
  generateLinkService: vi.fn(),
}));

describe("Custom Hooks", () => {
  describe("useSearchDetails", () => {
    it("should succeed with existing verification data", async () => {
      (getSearchDetailsService as any).mockResolvedValueOnce(
        generateLinkResponseMock
      );

      const { result } = renderHook(() => useSearchDetails(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(generateLinkRequestMock);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
        expect(result.current.data).toEqual(generateLinkResponseMock);
      });
    });

    it("should handle verification not done", async () => {
      (getSearchDetailsService as any).mockResolvedValueOnce(
        generatelinkResponseMockVerificationDone
      );

      const { result } = renderHook(() => useSearchDetails(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(generateLinkRequestMock);

      await waitFor(() => {
        expect(result.current.data).toEqual(
          generatelinkResponseMockVerificationDone
        );
      });
    });

    it("should handle first-time user (no data found)", async () => {
      (getSearchDetailsService as any).mockResolvedValueOnce(
        generateLinkResponseMockFirstTime
      );

      const { result } = renderHook(() => useSearchDetails(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(generateLinkRequestMock);

      await waitFor(() => {
        expect(result.current.data).toEqual(generateLinkResponseMockFirstTime);
      });
    });

    it("should handle API error", async () => {
      (getSearchDetailsService as any).mockRejectedValueOnce(
        new Error("API error")
      );

      const { result } = renderHook(() => useSearchDetails(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(generateLinkRequestMock);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
        expect(result.current.error).toEqual(new Error("API error"));
      });
    });
  });

  describe("useGenerateLink", () => {
    it("should generate link successfully", async () => {
      (generateLinkService as any).mockResolvedValueOnce(
        generateVerifyLinkResponse
      );

      const { result } = renderHook(() => useGenerateLink(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(generateVerifyLinkRequest);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
        expect(result.current.data).toEqual(generateVerifyLinkResponse);
      });
    });

    it("should handle API error", async () => {
      (generateLinkService as any).mockRejectedValueOnce(
        new Error("Service failed")
      );

      const { result } = renderHook(() => useGenerateLink(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(generateVerifyLinkRequest);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
        expect(result.current.error).toEqual(new Error("Service failed"));
      });
    });
  });
});
