import { beforeEach, describe, expect, it, vi } from "vitest";

import { STATUS_CODE } from "@/constants/statusCodes";
import { ROUTES } from "@/routes/constants";

// 1. Mock axios and define mocks INSIDE the factory, attach to globalThis
vi.mock("axios", () => {
  const mockHeaders: Record<string, any> = {};
  const mockAxiosInstance = {
    defaults: {
      headers: {
        common: mockHeaders,
      },
    },
    post: vi.fn(),
  };
  // Attach to globalThis so you can access in tests
  (globalThis as any).mockAxiosInstance = mockAxiosInstance;
  (globalThis as any).mockHeaders = mockHeaders;
  return {
    __esModule: true,
    default: {
      create: vi.fn(() => mockAxiosInstance),
    },
    create: vi.fn(() => mockAxiosInstance),
  };
});

// 2. Mock encryption/decryption
vi.mock("@/lib/encryptionDecryption", () => ({
  encrypt: vi.fn(async (data: string) => `encrypted(${data})`),
  decrypt: vi.fn(async (data: string) => {
    if (typeof data === "string" && data.startsWith("encrypted(")) {
      return data.slice(10, -1);
    }
    return data;
  }),
}));

// 3. Mock environment
Object.defineProperty(import.meta, "env", {
  value: {
    VITE_API_URL: "http://mock-api",
    VITE_BASE_URL: "/base",
  },
  configurable: true,
});

// 4. Import after mocks
import {
  axiosInstance,
  clearToken,
  getIsTokenSet,
  handleApiError,
  POST,
  updateTokenValue,
} from "../api.service";

beforeEach(() => {
  vi.clearAllMocks();
  clearToken();
  if ((globalThis as any).mockHeaders)
    delete (globalThis as any).mockHeaders.Authorization;
  vi.stubGlobal("window", { location: { href: "" } });
});

describe("api.service", () => {
  it("should update, get, and clear token state", () => {
    expect(getIsTokenSet()).toBe(false);
    updateTokenValue("abc");
    expect(getIsTokenSet()).toBe(true);
    expect(axiosInstance.defaults.headers.common.Authorization).toBe(
      "Bearer abc"
    );
    clearToken();
    expect(getIsTokenSet()).toBe(false);
    expect(axiosInstance.defaults.headers.common.Authorization).toBeUndefined();
  });

  it("encrypts request, sends POST, and decrypts response", async () => {
    (globalThis as any).mockAxiosInstance.post.mockResolvedValueOnce({
      data: { data: 'encrypted({"mocked":"response"})' },
    });

    const result = await POST<{ name: string }, any>("/test", {
      name: "Vamsi",
    });

    expect((globalThis as any).mockAxiosInstance.post).toHaveBeenCalledWith(
      "/test",
      { data: 'encrypted({"name":"Vamsi"})' },
      undefined
    );
    expect(result).toEqual({ mocked: "response" });
  });

  it("throws if encrypted response data is missing", async () => {
    (globalThis as any).mockAxiosInstance.post.mockResolvedValueOnce({
      data: {},
    });

    await expect(POST("/test", {})).rejects.toThrow(
      "Missing encrypted response data"
    );
  });

  it("throws if decrypted response is not string", async () => {
    const { decrypt } = await import("@/lib/encryptionDecryption");
    (decrypt as any).mockResolvedValueOnce({} as any);

    (globalThis as any).mockAxiosInstance.post.mockResolvedValueOnce({
      data: { data: "encrypted" },
    });

    await expect(POST("/test", {})).rejects.toThrow(
      "Decrypted response is not a string"
    );
  });

  it("falls back if error decryption fails", async () => {
    const { decrypt } = await import("@/lib/encryptionDecryption");
    (decrypt as any).mockRejectedValueOnce(new Error("fail"));

    (globalThis as any).mockAxiosInstance.post.mockRejectedValueOnce({
      response: { data: { data: "invalid" } },
    });

    await expect(POST("/test", {})).rejects.toThrow(
      "Failed to decrypt error response"
    );
  });

  it("throws generic error if no encryption", async () => {
    (globalThis as any).mockAxiosInstance.post.mockRejectedValueOnce(
      new Error("Network Error")
    );

    await expect(POST("/test", {})).rejects.toThrow("Network Error");
  });

  // TODO - unable to test redirections even with mocked
  // it("clears token and redirects on 401", async () => {
  //   updateTokenValue("abc");
  //   (globalThis as any).mockAxiosInstance.post.mockRejectedValueOnce({
  //     statusCode: STATUS_CODE.UNAUTHORIZED,
  //     response: { data: {} },
  //   });

  //   await expect(POST("/test", {})).rejects.toEqual({
  //     statusCode: STATUS_CODE.UNAUTHORIZED,
  //     response: { data: {} },
  //   });

  //   expect(getIsTokenSet()).toBe(false);
  //   expect(window.location.href).toBe("/base/unauthorized");
  // });

  // TODO - not sure how to test this scenario
  // it("handleApiError should clear token and redirect on UNAUTHORIZED", () => {
  //   updateTokenValue("abc");
  //   const err = { statusCode: STATUS_CODE.UNAUTHORIZED };
  //   handleApiError(err);
  //   expect(getIsTokenSet()).toBe(false);
  //   expect(window.location.href).toBe("/base/unauthorized");
  // });

  // it("handleApiError should throw error for other status codes", () => {
  //   const err = { statusCode: 500 };
  //   expect(() => handleApiError(err)).toThrow(err);
  // });
});
