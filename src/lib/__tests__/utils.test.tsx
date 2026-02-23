import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockSetKey } = vi.hoisted(() => ({
  mockSetKey: vi.fn(),
}));

vi.mock("@/i18n/translator", () => ({
  default: (key: string) => key,
}));

vi.mock("@/constants/globalConstant", () => ({
  VALUE_IN_INDIAN_FORMAT: "en-IN",
  CURRENCY: "currency",
  INDIAN_CURRENCY: "INR",
  ZERO: 0,
  PADDING: "00000000000000000000000000000000",
  ALPHANUMERIC:
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
}));

vi.mock("../encryptionDecryption", () => ({
  aesGcmUtil: {
    setKey: mockSetKey,
  },
}));

import {
  cn,
  convertToLabelValue,
  deriveAes256Key,
  fetchFakeData,
  generateRandomTransactionId,
  getFieldErrorMessages,
  getTransactionId,
  setTransactionId,
} from "../utils";

describe("cn utility", () => {
  it("merges class names correctly", () => {
    expect(cn("bg-red-500", "text-white")).toBe("bg-red-500 text-white");
  });

  it("handles conflicting classes correctly", () => {
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
  });

  it("ignores falsy values", () => {
    expect(cn("hidden", false && "block")).toBe("hidden");
  });
});

describe("getFieldErrorMessages", () => {
  it("returns empty object for undefined", () => {
    expect(getFieldErrorMessages(undefined)).toEqual({});
  });

  it("returns empty object for invalid structure", () => {
    expect(
      getFieldErrorMessages({ data: { errors: "notArray" } } as any)
    ).toEqual({});
  });

  it("returns correct error messages", () => {
    const error = {
      data: {
        message: "Validation failed",
        errors: [
          { field: "email", message: "Invalid email" },
          { field: "password", message: "Too short" },
        ],
      },
    };
    expect(getFieldErrorMessages(error)).toEqual({
      email: "Invalid email",
      password: "Too short",
    });
  });
});

describe("convertToLabelValue", () => {
  it("maps list correctly without currency", () => {
    const list = [
      { name: "Engineer", code: 1 },
      { name: "Doctor", code: 2 },
    ];
    expect(convertToLabelValue({ list })).toEqual([
      { label: "Engineer", value: 1 },
      { label: "Doctor", value: 2 },
    ]);
  });

  it("formats currency when showCurrency is true", () => {
    const list = [
      { name: "0 to 1000", code: 1 },
      { name: "1000 to 2000", code: 2 },
    ];
    const result = convertToLabelValue({ list, showCurrency: true });
    expect(result[0].label).toContain("reKyc.lessThan");
    expect(result[1].label).toContain("reKyc.to");
  });

  it("handles empty list", () => {
    expect(convertToLabelValue({ list: [] })).toEqual([]);
  });
});

describe("fetchFakeData", () => {
  it("resolves when isSuccess=true", async () => {
    const data = { ok: true };
    await expect(fetchFakeData(data, true)).resolves.toEqual(data);
  });

  it("rejects when isSuccess=false", async () => {
    const data = { ok: false };
    await expect(fetchFakeData(data, false)).rejects.toEqual(data);
  });
});

describe("generateRandomTransactionId", () => {
  it("generates 12-character alphanumeric string", () => {
    const id = generateRandomTransactionId();
    expect(id).toHaveLength(12);
    expect(/^[A-Za-z0-9]+$/.test(id)).toBe(true);
  });

  it("generates unique IDs across calls", () => {
    const id1 = generateRandomTransactionId();
    const id2 = generateRandomTransactionId();
    expect(id1).not.toBe(id2);
  });
});

describe("deriveAes256Key", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("calls crypto.subtle.digest and sets AES key and transaction ID", async () => {
    const mockDigest = vi.fn().mockResolvedValue(new ArrayBuffer(32));
    Object.defineProperty(globalThis, "crypto", {
      value: { subtle: { digest: mockDigest } },
      configurable: true,
    });

    const transactionId = "TXNKEY123";
    await deriveAes256Key(transactionId);

    // Digest should be called with SHA-256 and some data
    const [algorithm, data] = mockDigest.mock.calls[0];
    expect(algorithm).toBe("SHA-256");

    // Decode the bytes passed to digest and check the transaction ID is included
    const decoded = new TextDecoder().decode(data);
    expect(decoded.startsWith(transactionId)).toBe(true);

    // AES key setter called
    expect(mockSetKey).toHaveBeenCalled();

    // Transaction ID stored
    expect(getTransactionId()).toBe(transactionId);
  });

  it("handles crypto.digest rejection gracefully", async () => {
    const mockDigest = vi.fn().mockRejectedValue(new Error("crypto failed"));
    Object.defineProperty(globalThis, "crypto", {
      value: { subtle: { digest: mockDigest } },
      configurable: true,
    });

    await expect(deriveAes256Key("TEST1234")).rejects.toThrow("crypto failed");
  });
});

describe("Transaction ID setter/getter", () => {
  it("sets and retrieves transaction ID", () => {
    setTransactionId("TXN123");
    expect(getTransactionId()).toBe("TXN123");
  });

  it("returns empty string when not set", () => {
    setTransactionId("");
    expect(getTransactionId()).toBe("");
  });
});
