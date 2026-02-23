import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import {
  POST,
  axiosInstance,
  updateTokenValue,
  getIsTokenSet,
  clearToken,
  handleUnauthorized,
} from "../api.service";

vi.mock("@/lib/encryptionDecryption", () => ({
  encrypt: vi.fn(async (val: string) => `enc:${val}`),
  decrypt: vi.fn(async (val: string) => `{"ok":true,"from":"${val}"}`),
}));

vi.mock("@/lib/sessionStorage", () => ({
  removeSessionStorageData: vi.fn(),
}));

describe("api.service POST and token helpers", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.clearAllMocks();
    // Stub axiosInstance.post
    vi.spyOn(axiosInstance, "post").mockResolvedValue({
      data: { data: "resp:encrypted" },
    } as any);
  });

  afterEach(() => {
    // Restore window.location
    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: false,
    });
  });

  it("POST encrypts body, posts, decrypts response, and parses JSON", async () => {
    const result = await POST<{ a: number }, { ok: boolean }>("/test", {
      a: 1,
    });
    expect(result).toEqual({ ok: true, from: "resp:encrypted" });
    expect(axiosInstance.post).toHaveBeenCalledWith(
      "/test",
      { data: expect.any(String) },
      undefined
    );
  });

  it("POST handles request without body (no encrypt) and still parses", async () => {
    const result = await POST<undefined, { ok: boolean }>("/test2");
    expect(result.ok).toBe(true);
    expect(axiosInstance.post).toHaveBeenCalledWith(
      "/test2",
      undefined,
      undefined
    );
  });

  it("throws when decrypted response is not a string (type guard)", async () => {
    const { decrypt } = await import("@/lib/encryptionDecryption");
    (decrypt as any).mockResolvedValueOnce({ not: "a-string" });

    await expect(POST("/bad" as any, { x: 1 } as any)).rejects.toBeUndefined();
  });

  it("triggers handleUnauthorized on 401 error response", async () => {
    // Mock axios to reject with unauthorized response
    (axiosInstance.post as any).mockRejectedValueOnce({
      response: { data: { statusCode: 401 } },
    });

    // Mock window.location to observe changes
    const hrefSetter = vi.fn();
    Object.defineProperty(window, "location", {
      value: {
        set href(val: string) {
          hrefSetter(val);
        },
      } as any,
      writable: true,
    });

    await expect(POST("/unauth" as any, { y: 1 } as any)).rejects.toEqual({
      statusCode: 401,
    });

    // handleUnauthorized should have been called, which sets location.href
    expect(hrefSetter).toHaveBeenCalled();
  });

  it("updateTokenValue and clearToken manage auth header and token flag", () => {
    expect(getIsTokenSet()).toBe(false);
    updateTokenValue("token-123");
    expect(getIsTokenSet()).toBe(true);
    expect((axiosInstance.defaults.headers.common as any).Authorization).toBe(
      "Bearer token-123"
    );

    clearToken();
    expect(getIsTokenSet()).toBe(false);
    expect(
      (axiosInstance.defaults.headers.common as any).Authorization
    ).toBeUndefined();
  });

  it("handleUnauthorized clears token and redirects", () => {
    const hrefSetter = vi.fn();
    Object.defineProperty(window, "location", {
      value: {
        set href(val: string) {
          hrefSetter(val);
        },
      } as any,
      writable: true,
    });
    handleUnauthorized();
    expect(hrefSetter).toHaveBeenCalled();
  });
});
