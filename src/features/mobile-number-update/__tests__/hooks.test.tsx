import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  useBioMetricVerification,
  useCheckStatus,
  useCustomerSearch,
  useFetchRecords,
  useGenerateLink,
  useUpdateNumber,
  useVerifyLink,
  useVerifyNumber,
} from "../hooks"; // adjust path as needed
import * as services from "../services"; // mocks come from this module

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("Mobile number update Hooks", () => {
  it("should call getCustomerSearchService when useCustomerSearch is triggered", async () => {
    const mockFn = vi
      .spyOn(services, "getCustomerSearchService")
      .mockResolvedValue("ok");

    const { result } = renderHook(() => useCustomerSearch(), { wrapper });

    await result.current.mutateAsync({ dummy: "data" });

    expect(mockFn).toHaveBeenCalledWith({ dummy: "data" });
    mockFn.mockRestore();
  });

  it("should call getVerifyNumberService when useVerifyNumber is triggered", async () => {
    const mockFn = vi
      .spyOn(services, "getVerifyNumberService")
      .mockResolvedValue("ok");

    const { result } = renderHook(() => useVerifyNumber(), { wrapper });

    await result.current.mutateAsync("9876543210");

    expect(mockFn).toHaveBeenCalledWith("9876543210");
    mockFn.mockRestore();
  });

  it("should call getUpdateNumberService when useUpdateNumber is triggered", async () => {
    const mockFn = vi
      .spyOn(services, "getUpdateNumberService")
      .mockResolvedValue("ok");

    const { result } = renderHook(() => useUpdateNumber(), { wrapper });

    await result.current.mutateAsync({ newNumber: "9999999999" });

    expect(mockFn).toHaveBeenCalledWith({ newNumber: "9999999999" });
    mockFn.mockRestore();
  });

  it("should call getFetchRecordsService when useFetchRecords is triggered", async () => {
    const mockFn = vi
      .spyOn(services, "getFetchRecordsService")
      .mockResolvedValue("ok");

    const { result } = renderHook(() => useFetchRecords(), { wrapper });

    await result.current.mutateAsync("CID123");

    expect(mockFn).toHaveBeenCalledWith("CID123");
    mockFn.mockRestore();
  });

  it("should call getCheckStatusService when useCheckStatus is triggered", async () => {
    const mockFn = vi
      .spyOn(services, "getCheckStatusService")
      .mockResolvedValue("ok");

    const { result } = renderHook(() => useCheckStatus(), { wrapper });

    await result.current.mutateAsync({ requestNumber: "REQ123" });

    expect(mockFn).toHaveBeenCalledWith({ requestNumber: "REQ123" });
    mockFn.mockRestore();
  });

  it("should call getGenerateLinkService when useGenerateLink is triggered", async () => {
    const mockFn = vi
      .spyOn(services, "getGenerateLinkService")
      .mockResolvedValue("ok");

    const { result } = renderHook(() => useGenerateLink(), { wrapper });

    await result.current.mutateAsync({ id: "USER123" });

    expect(mockFn).toHaveBeenCalledWith({ id: "USER123" });
    mockFn.mockRestore();
  });

  it("should call getVerifyLinkService when useVerifyLink is triggered", async () => {
    const mockFn = vi
      .spyOn(services, "getVerifyLinkService")
      .mockResolvedValue("ok");

    const { result } = renderHook(() => useVerifyLink(), { wrapper });

    await result.current.mutateAsync("link-token");

    expect(mockFn).toHaveBeenCalledWith("link-token");
    mockFn.mockRestore();
  });

  it("should call getBioMetricVerificationService when useBioMetricVerification is triggered", async () => {
    const mockFn = vi
      .spyOn(services, "getBioMetricVerificationService")
      .mockResolvedValue("ok");

    const { result } = renderHook(() => useBioMetricVerification(), {
      wrapper,
    });

    await result.current.mutateAsync({ fingerprintData: "base64data" });

    expect(mockFn).toHaveBeenCalledWith({ fingerprintData: "base64data" });
    mockFn.mockRestore();
  });
});
