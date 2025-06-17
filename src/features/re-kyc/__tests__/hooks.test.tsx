import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  useCaptureFingerprint,
  useCustomerDetails,
  useCustomerSearch,
  useGetDeviceStatus,
  useGetOtherDropdownDetails,
  useUpdateKYC,
  useValidateFingerprint,
} from "@/features/re-kyc/hooks";
import * as service from "@/features/re-kyc/services";

const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("Re-KYC Custom Hooks", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("calls getCustomerSearchService via useCustomerSearch", async () => {
    const mockResponse = { customerId: "123" };
    vi.spyOn(service, "getCustomerSearchService").mockResolvedValue(
      mockResponse
    );

    const { result } = renderHook(() => useCustomerSearch(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ cif: "123" });

    await waitFor(() => {
      expect(service.getCustomerSearchService).toHaveBeenCalledWith({
        cif: "123",
      });
    });
  });

  it("calls updateKYC via useUpdateKYC", async () => {
    const mockResponse = { status: "success" };
    vi.spyOn(service, "updateKYC").mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useUpdateKYC(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ cif: "999" });

    await waitFor(() => {
      expect(service.updateKYC).toHaveBeenCalledWith({ cif: "999" });
    });
  });

  // TODO -  undefined is not a spy or a call to a spy!
  // it("calls getDeviceStatus via useGetDeviceStatus and handles error", async () => {
  //   const error = new Error("Device not found");
  //   vi.spyOn(service, "getBiometricDeviceStatus").mockRejectedValue(error);

  //   const { result } = renderHook(() => useGetDeviceStatus(), {
  //     wrapper: createWrapper(),
  //   });

  //   result.current.mutate();

  //   await waitFor(() => {
  //     expect(service.getDeviceStatus).toHaveBeenCalled();
  //   });
  // });

  it("calls captureFingerPrint via useCaptureFingerprint", async () => {
    const mockResponse = { status: "captured" };
    vi.spyOn(service, "captureFingerPrint").mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useCaptureFingerprint(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ deviceId: "xyz" });

    await waitFor(() => {
      expect(service.captureFingerPrint).toHaveBeenCalledWith({
        deviceId: "xyz",
      });
    });
  });

  it("calls validateFingerprint via useValidateFingerprint", async () => {
    const mockResponse = { valid: true };
    vi.spyOn(service, "validateFingerprint").mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useValidateFingerprint(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ fingerprintData: "123abc" });

    await waitFor(() => {
      expect(service.validateFingerprint).toHaveBeenCalledWith({
        fingerprintData: "123abc",
      });
    });
  });

  it("calls getCustomerDetailsService via useCustomerDetails", async () => {
    const mockResponse = { name: "John Doe" };
    vi.spyOn(service, "getCustomerDetailsService").mockResolvedValue(
      mockResponse
    );

    const { result } = renderHook(() => useCustomerDetails(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ customerId: "abc" });

    await waitFor(() => {
      expect(service.getCustomerDetailsService).toHaveBeenCalledWith({
        customerId: "abc",
      });
    });
  });

  it("calls getOtherDetailsDropdownService via useGetOtherDropdownDetails", async () => {
    const mockResponse = { data: ["option1", "option2"] };
    vi.spyOn(service, "getOtherDetailsDropdownService").mockResolvedValue(
      mockResponse
    );

    const { result } = renderHook(() => useGetOtherDropdownDetails(), {
      wrapper: createWrapper(),
    });

    result.current.mutate();

    await waitFor(() => {
      expect(service.getOtherDetailsDropdownService).toHaveBeenCalled();
    });
  });
});
