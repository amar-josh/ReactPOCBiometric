import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as androidServices from "@/services/biometricForAndroid";
import * as webServices from "@/services/biometricForWeb";

import {
  useCaptureFingerprint,
  useGetDeviceStatus,
  useGetRDServiceStatus,
} from "../useBiometrics";
import * as deviceDetection from "../useDeviceDetection";

describe("useBiometrics hooks", () => {
  const createWrapper = () => {
    const queryClient = new QueryClient();
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("useGetRDServiceStatus should call web service", async () => {
    const spy = vi
      .spyOn(webServices, "getRDServiceStatus")
      .mockResolvedValue(true);

    const { result } = renderHook(() => useGetRDServiceStatus(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync();
    expect(spy).toHaveBeenCalled();
  });

  it("useGetDeviceStatus uses android service when in Android WebView", async () => {
    vi.spyOn(deviceDetection, "useDeviceDetection").mockReturnValue({
      isAndroidWebView: true,
    });
    const spy = vi
      .spyOn(androidServices, "getBiometricDeviceStatusInAndroid")
      .mockResolvedValue("android-status");

    const { result } = renderHook(() => useGetDeviceStatus(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync();
    expect(spy).toHaveBeenCalled();
  });

  it("useGetDeviceStatus uses web service when not in Android WebView", async () => {
    vi.spyOn(deviceDetection, "useDeviceDetection").mockReturnValue({
      isAndroidWebView: false,
    });
    const spy = vi
      .spyOn(webServices, "getBiometricDeviceStatus")
      .mockResolvedValue("web-status");

    const { result } = renderHook(() => useGetDeviceStatus(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync();
    expect(spy).toHaveBeenCalled();
  });

  it("useCaptureFingerprint uses android fingerprint service in Android WebView", async () => {
    vi.spyOn(deviceDetection, "useDeviceDetection").mockReturnValue({
      isAndroidWebView: true,
    });
    const spy = vi
      .spyOn(androidServices, "captureFingerPrintInAndroid")
      .mockResolvedValue("android-fingerprint");

    const { result } = renderHook(() => useCaptureFingerprint(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync();
    expect(spy).toHaveBeenCalled();
  });

  it("useCaptureFingerprint uses web fingerprint service if not Android WebView", async () => {
    vi.spyOn(deviceDetection, "useDeviceDetection").mockReturnValue({
      isAndroidWebView: false,
    });
    const spy = vi
      .spyOn(webServices, "captureFingerPrint")
      .mockResolvedValue("web-fingerprint");

    const { result } = renderHook(() => useCaptureFingerprint(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync();
    expect(spy).toHaveBeenCalled();
  });
});
