import { beforeEach, describe, expect, it, vi } from "vitest";

// Setup mocks BEFORE importing the module
const mockKey = new Uint8Array(32).fill(1);
const mockKeyBase64 = Buffer.from(mockKey).toString("base64");

// Mock environment variable
vi.stubGlobal("import", {
  meta: {
    env: {
      VITE_ENCRYPTION_KEY: mockKeyBase64,
    },
  },
});

// Mock TextEncoder/Decoder
const mockTextEncoder = {
  encode: (input: string) => new Uint8Array(Buffer.from(input)),
};

const mockTextDecoder = {
  decode: (input: ArrayBuffer) => Buffer.from(input).toString(),
};

vi.stubGlobal(
  "TextEncoder",
  vi.fn(() => mockTextEncoder)
);
vi.stubGlobal(
  "TextDecoder",
  vi.fn(() => mockTextDecoder)
);

// Mock base64 utilities
const mockAtob = (str: string) => Buffer.from(str, "base64").toString("binary");
const mockBtoa = (str: string) => Buffer.from(str, "binary").toString("base64");

vi.stubGlobal("atob", mockAtob);
vi.stubGlobal("btoa", mockBtoa);

// Mock crypto API
const mockIv = new Uint8Array(12).fill(2);
const mockCryptoKey = {};

const mockSubtleCrypto = {
  importKey: vi.fn().mockResolvedValue(mockCryptoKey),
  encrypt: vi.fn().mockImplementation(async (_, __, data) => {
    const dataArray = new Uint8Array(data);
    const result = new Uint8Array(mockIv.length + dataArray.length);
    result.set(mockIv);
    result.set(dataArray, mockIv.length);
    return result.buffer;
  }),
  decrypt: vi.fn().mockImplementation(async (_, __, data) => {
    const arr = new Uint8Array(data);
    const decrypted = arr.slice(mockIv.length);
    return decrypted.buffer;
  }),
};

const mockCrypto = {
  subtle: mockSubtleCrypto,
  getRandomValues: vi.fn((arr) => {
    arr.set(mockIv);
    return arr;
  }),
};

vi.stubGlobal("crypto", mockCrypto);

// Import the module AFTER all mocks are set up
import { decrypt, encrypt } from "../encryptionDecryption";

describe("AES GCM Utility", () => {
  const testData = "Hello, World!";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TODO --- Not sure how to test and chatgpt failed
  // it("encrypt should return a base64 string", async () => {
  //   const testInput = JSON.stringify(testData);
  //   const expectedEncrypted = mockBtoa(testInput);
  //   mockSubtleCrypto.encrypt.mockResolvedValueOnce(
  //     new TextEncoder().encode(testInput).buffer
  //   );

  //   const encrypted = await encrypt(testData);

  //   expect(encrypted).toBeDefined();
  //   expect(typeof encrypted).toBe("string");
  //   expect(() => mockAtob(encrypted!)).not.toThrow();
  // });

  // it("decrypt should return original data", async () => {
  //   const testInput = JSON.stringify(testData);
  //   const encrypted = mockBtoa(testInput);
  //   mockSubtleCrypto.decrypt.mockResolvedValueOnce(
  //     new TextEncoder().encode(testInput).buffer
  //   );

  //   const decrypted = await decrypt(encrypted);

  //   expect(decrypted).toBe(testData);
  // });

  it("should handle encryption errors", async () => {
    mockSubtleCrypto.encrypt.mockRejectedValueOnce(
      new Error("Encryption failed")
    );
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await encrypt(testData);

    expect(result).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Encryption failed:",
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });

  it("should handle decryption errors", async () => {
    mockSubtleCrypto.decrypt.mockRejectedValueOnce(
      new Error("Decryption failed")
    );
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await decrypt("invalid-data");

    expect(result).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Decryption failed:",
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });

  it("should handle invalid base64 input for decryption", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = await decrypt("not-base64!");
    expect(result).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
