import { describe, it, expect, vi, beforeEach } from "vitest";
import { getConfig } from "../config"; // adjust import as needed

const mockPost = vi.fn();
const mockDeriveKey = vi.fn();
const mockTransactionId = "dummy-transaction-id";

vi.mock("@/constants/endPoints", () => ({
  ENDPOINTS: { CONFIG: "/config-endpoint" },
}));

vi.mock("@/constants/globalConstant", () => ({
  PADDING: "PADDING_VALUE",
}));

vi.mock("@/lib/utils", () => ({
  deriveAes256Key: vi.fn((key: string) => mockDeriveKey(key)),
  generateRandomTransactionId: vi.fn(() => mockTransactionId),
}));

vi.mock("../api.service", () => ({
  POST: vi.fn((...args) => mockPost(...args)),
}));

describe("getConfig.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call btoa correctly for transactionId and padding", () => {
    const btoaSpy = vi.spyOn(globalThis, "btoa");

    getConfig();

    expect(btoaSpy).toHaveBeenCalledWith(mockTransactionId);
    expect(btoaSpy).toHaveBeenCalledWith("PADDING_VALUE");

    btoaSpy.mockRestore();
  });

  it("should call POST with correct parameters", () => {
    const expectedHeaders = {
      transId: btoa(mockTransactionId),
      padding: btoa("PADDING_VALUE"),
    };

    getConfig();

    expect(mockPost).toHaveBeenCalledWith("/config-endpoint", undefined, {
      headers: expectedHeaders,
    });
  });

  it("should return POST result", () => {
    mockPost.mockReturnValueOnce("MOCK_RESPONSE");

    const result = getConfig();

    expect(result).toBe("MOCK_RESPONSE");
    expect(mockPost).toHaveBeenCalledTimes(1);
  });
});
