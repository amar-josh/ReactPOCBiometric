import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as deviceLib from "@/lib/getDeviceType";

import { useDeviceDetection } from "../useDeviceDetection";

describe("useDeviceDetection", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should return isAndroidWebView = true if device type is android_webview", () => {
    vi.spyOn(deviceLib, "getDeviceType").mockReturnValue("android_webview");

    const { result } = renderHook(() => useDeviceDetection());

    // Initially the state is "desktop", but useEffect runs immediately after render
    // So we can just check result.current after render
    expect(result.current.isAndroidWebView).toBe(true);
  });

  it("should return isAndroidWebView = false if device type is not android_webview", () => {
    vi.spyOn(deviceLib, "getDeviceType").mockReturnValue("desktop");

    const { result } = renderHook(() => useDeviceDetection());

    expect(result.current.isAndroidWebView).toBe(false);
  });
});
