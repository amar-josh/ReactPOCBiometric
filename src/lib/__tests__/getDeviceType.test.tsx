import { afterEach, describe, expect, it, vi } from "vitest";

import { getDeviceType } from "../getDeviceType"; // adjust path if needed

describe("getDeviceType", () => {
  const setUserAgent = (ua: string) => {
    vi.stubGlobal("navigator", { userAgent: ua });
  };

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should return 'android_webview' for Android WebView user agent", () => {
    setUserAgent(
      "Mozilla/5.0 (Linux; Android 9; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.157 Mobile Safari/537.36"
    );
    expect(getDeviceType()).toBe("android_webview");
  });

  it("should return 'android_device' for regular Android browser", () => {
    setUserAgent(
      "Mozilla/5.0 (Linux; Android 10; Pixel 3 XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Mobile Safari/537.36"
    );
    expect(getDeviceType()).toBe("android_device");
  });

  it("should return 'ios_device' for iPhone", () => {
    setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile Safari/604.1"
    );
    expect(getDeviceType()).toBe("ios_device");
  });

  it("should return 'ios_device' for iPad", () => {
    setUserAgent(
      "Mozilla/5.0 (iPad; CPU OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Mobile/15E148 Safari/604.1"
    );
    expect(getDeviceType()).toBe("ios_device");
  });

  it("should return 'desktop' for Windows", () => {
    setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );
    expect(getDeviceType()).toBe("desktop");
  });

  it("should return 'desktop' for Mac OS", () => {
    setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko)"
    );
    expect(getDeviceType()).toBe("desktop");
  });

  it("should return 'desktop' for Linux (non-Android)", () => {
    setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36"
    );
    expect(getDeviceType()).toBe("desktop");
  });

  it("should return 'unknown' for unrecognized user agents", () => {
    setUserAgent("SomeCustomAgent/1.0");
    expect(getDeviceType()).toBe("unknown");
  });
});
