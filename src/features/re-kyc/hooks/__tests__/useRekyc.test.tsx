import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as services from "@/features/re-kyc/services";

import {
  useCustomerDetails,
  useCustomerSearch,
  useGetOtherDropdownDetails,
  useUpdateKYC,
  useValidateFingerprint,
} from "../useRekyc";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const hookTests = [
  { hook: useCustomerSearch, serviceName: "getCustomerSearchService" },
  { hook: useCustomerDetails, serviceName: "getCustomerDetailsService" },
  {
    hook: useGetOtherDropdownDetails,
    serviceName: "getOtherDetailsDropdownService",
  },
  { hook: useValidateFingerprint, serviceName: "validateFingerprint" },
  { hook: useUpdateKYC, serviceName: "updateKYC" },
];

describe("Re-KYC Hooks", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  hookTests.forEach(({ hook, serviceName }) => {
    describe(hook.name, () => {
      it("should call the service and return data on success", async () => {
        const mockData = { success: true } as any;
        const serviceMock = vi
          .spyOn(services, serviceName as keyof typeof services)
          .mockResolvedValue(mockData);

        const { result } = renderHook(() => hook(), {
          wrapper: createWrapper(),
        });

        act(() => {
          result.current.mutate({ test: "payload" } as any);
        });

        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true);
        });

        expect(serviceMock).toHaveBeenCalledWith({ test: "payload" });
        expect(result.current.data).toEqual(mockData);
      });

      it("should handle service errors", async () => {
        const error = new Error("Service failed");
        vi.spyOn(
          services,
          serviceName as keyof typeof services
        ).mockRejectedValue(error);

        const { result } = renderHook(() => hook(), {
          wrapper: createWrapper(),
        });

        act(() => {
          result.current.mutate({ test: "payload" } as any);
        });

        await waitFor(() => {
          expect(result.current.isError).toBe(true);
        });

        expect(result.current.error).toBe(error);
      });
    });
  });
});
