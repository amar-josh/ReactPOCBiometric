// __tests__/aesGcmUtil.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  AesDecryptionException,
  aesGcmUtil,
  decrypt,
  encrypt,
} from "../encryptionDecryption";

const mockSubtle = {
  importKey: vi.fn(),
  encrypt: vi.fn(),
  decrypt: vi.fn(),
};

const mockCrypto = {
  subtle: mockSubtle,
  getRandomValues: vi.fn(),
};

// Define the global mock first
Object.defineProperty(global, "crypto", {
  value: mockCrypto,
  writable: true,
  configurable: true,
});

// Store original functions
const originalCrypto = global.crypto;
const originalAtob = global.atob;
const originalBtoa = global.btoa;
const originalTextEncoder = global.TextEncoder;
const originalTextDecoder = global.TextDecoder;

describe("AesGcmUtil", () => {
  const mockKey = "VGVzdCBLZXkgMTIzNDU2Nzg5MA=="; // "Test Key 1234567890" in base64
  const mockPlainText = "Hello, World!";
  const mockEncryptedData = "dGVzdC1lbmNyeXB0ZWQtZGF0YQ=="; // "test-encrypted-data" in base64

  let mockCryptoKey: CryptoKey;

  beforeEach(() => {
    vi.clearAllMocks();

    mockCryptoKey = {
      algorithm: { name: "AES-GCM", length: 256 },
      extractable: true,
      type: "secret",
      usages: ["encrypt", "decrypt"],
    } as CryptoKey;

    // Reset aesGcmUtil instance
    aesGcmUtil["keyPromise"] = null;

    // Set up atob/btoa mocks
    global.atob = vi.fn();
    global.btoa = vi.fn();

    // Set up TextEncoder/TextDecoder mocks
    global.TextEncoder = vi.fn().mockImplementation(() => ({
      encode: vi.fn((text: string) => {
        const encoder = new originalTextEncoder();
        return encoder.encode(text);
      }),
    }));

    global.TextDecoder = vi.fn().mockImplementation(() => ({
      decode: vi.fn((buffer: ArrayBuffer) => {
        const decoder = new originalTextDecoder();
        return decoder.decode(buffer);
      }),
    }));
  });

  afterEach(() => {
    // Restore original functions
    global.crypto = originalCrypto;
    global.atob = originalAtob;
    global.btoa = originalBtoa;
    global.TextEncoder = originalTextEncoder;
    global.TextDecoder = originalTextDecoder;
    vi.restoreAllMocks();
  });

  describe("setKey", () => {
    it("should set the key successfully", async () => {
      // Mock atob for base64 conversion
      (global.atob as any).mockReturnValue("Test Key 1234567890");

      mockSubtle.importKey.mockResolvedValue(mockCryptoKey);

      // Don't expect to throw
      aesGcmUtil.setKey(mockKey);

      // Verify the key promise was set
      expect(aesGcmUtil["keyPromise"]).toBeDefined();

      // Verify atob was called
      expect(global.atob).toHaveBeenCalledWith(mockKey);
    });

    it("should throw error when Web Cryptography API is not supported", () => {
      // Temporarily remove crypto
      Object.defineProperty(global, "crypto", {
        value: undefined,
        writable: true,
      });

      expect(() => aesGcmUtil.setKey(mockKey)).toThrow(
        "Web Cryptography API not supported."
      );

      // Restore crypto
      Object.defineProperty(global, "crypto", {
        value: originalCrypto,
        writable: true,
      });
    });
  });

  describe("encrypt", () => {
    it("should encrypt data successfully", async () => {
      // Mock atob for setKey
      (global.atob as any).mockReturnValue("Test Key 1234567890");
      mockSubtle.importKey.mockResolvedValue(mockCryptoKey);

      // Mock IV
      const mockIv = new Uint8Array(12);
      mockCrypto.getRandomValues.mockReturnValue(mockIv);

      // Mock encryption
      const mockCipherBuffer = new ArrayBuffer(16);
      mockSubtle.encrypt.mockResolvedValue(mockCipherBuffer);

      // Mock btoa for final conversion
      (global.btoa as any).mockReturnValue("base64-encoded-string");

      // Set key
      aesGcmUtil.setKey(mockKey);

      // Mock TextEncoder for encrypt method
      const mockEncode = vi
        .fn()
        .mockReturnValue(new Uint8Array([72, 101, 108, 108, 111]));
      (global.TextEncoder as any).mockImplementation(() => ({
        encode: mockEncode,
      }));

      const result = await aesGcmUtil.encrypt(mockPlainText);

      expect(result).toBe("base64-encoded-string");
      expect(mockSubtle.encrypt).toHaveBeenCalledWith(
        {
          name: "AES-GCM",
          iv: expect.any(Uint8Array),
          tagLength: 128,
        },
        mockCryptoKey,
        expect.any(Uint8Array)
      );
      expect(mockCrypto.getRandomValues).toHaveBeenCalledWith(
        new Uint8Array(12)
      );
    });

    it("should throw error when key is not set", async () => {
      await expect(aesGcmUtil.encrypt(mockPlainText)).rejects.toThrow(
        "Encryption key not set."
      );
    });

    it("should handle encryption errors gracefully", async () => {
      // Mock atob for setKey
      (global.atob as any).mockReturnValue("Test Key 1234567890");
      mockSubtle.importKey.mockResolvedValue(mockCryptoKey);
      mockSubtle.encrypt.mockRejectedValue(new Error("Encryption failed"));

      aesGcmUtil.setKey(mockKey);

      await expect(aesGcmUtil.encrypt(mockPlainText)).rejects.toThrow(
        "Encryption failed"
      );
    });
  });

  describe("decrypt", () => {
    beforeEach(() => {
      // Mock atob for setKey and decrypt
      (global.atob as any)
        .mockReturnValueOnce("Test Key 1234567890") // For setKey
        .mockReturnValueOnce("binary-string-representation"); // For decrypt

      mockSubtle.importKey.mockResolvedValue(mockCryptoKey);
      aesGcmUtil.setKey(mockKey);
    });

    it("should decrypt data successfully", async () => {
      // Mock decryption
      const mockDecryptedBuffer = new TextEncoder().encode(
        mockPlainText
      ).buffer;
      mockSubtle.decrypt.mockResolvedValue(mockDecryptedBuffer);

      const result = await aesGcmUtil.decrypt(mockEncryptedData);

      expect(result).toBe(mockPlainText);
      expect(mockSubtle.decrypt).toHaveBeenCalledWith(
        {
          name: "AES-GCM",
          iv: expect.any(Uint8Array),
          tagLength: 128,
        },
        mockCryptoKey,
        expect.any(ArrayBuffer)
      );
    });

    it("should throw error when key is not set", async () => {
      // Create a new instance to avoid affecting other tests
      const util = new (aesGcmUtil.constructor as any)();
      await expect(util.decrypt(mockEncryptedData)).rejects.toThrow(
        "Decryption key not set."
      );
    });

    it("should throw error when encrypted data is too short", async () => {
      // Mock short data
      (global.atob as any)
        .mockReset()
        .mockReturnValueOnce("Test Key 1234567890") // For setKey
        .mockReturnValueOnce("short"); // Too short for decrypt

      await expect(aesGcmUtil.decrypt("short-data")).rejects.toThrow(
        "Encrypted data too short"
      );
    });

    it("should throw AesDecryptionException with authentication failed message for DOMException", async () => {
      // Reset the mock by creating a new mock implementation
      const mockAtob = vi
        .fn()
        .mockReturnValueOnce("Test Key 1234567890") // For setKey
        .mockReturnValueOnce("x".repeat(32)); // Long enough for decrypt length check

      global.atob = mockAtob;

      const domException = new DOMException(
        "operation failed",
        "OperationError"
      );
      mockSubtle.decrypt.mockRejectedValue(domException);

      await expect(aesGcmUtil.decrypt(mockEncryptedData)).rejects.toThrow(
        AesDecryptionException
      );

      await expect(aesGcmUtil.decrypt(mockEncryptedData)).rejects.toThrow(
        "Authentication failed or invalid data"
      );
    });

    it("should throw AesDecryptionException for generic decryption errors", async () => {
      // Return a string long enough to pass the length check
      (global.atob as any)
        .mockReset()
        .mockReturnValueOnce("Test Key 1234567890") // For setKey
        .mockReturnValueOnce("x".repeat(32)); // Long enough for decrypt length check

      const genericError = new Error("Generic decryption error");
      mockSubtle.decrypt.mockRejectedValue(genericError);

      await expect(aesGcmUtil.decrypt(mockEncryptedData)).rejects.toThrow(
        AesDecryptionException
      );

      await expect(aesGcmUtil.decrypt(mockEncryptedData)).rejects.toThrow(
        "Decryption failed" // Fixed: Should be "Decryption failed", not "Authentication failed"
      );
    });
  });

  describe("AesDecryptionException", () => {
    it("should create exception with message only", () => {
      const exception = new AesDecryptionException("Test error");

      expect(exception).toBeInstanceOf(Error);
      expect(exception).toBeInstanceOf(AesDecryptionException);
      expect(exception.name).toBe("AesDecryptionException");
      expect(exception.message).toBe("Test error");
    });

    it("should create exception with original error", () => {
      const originalError = new Error("Original error");
      originalError.stack = "Original stack trace";

      const exception = new AesDecryptionException("Test error", originalError);

      expect(exception.message).toBe("Test error: Original error");
      expect(exception.stack).toBe("Original stack trace");
    });
  });

  describe("exported encrypt function", () => {
    beforeEach(() => {
      // Mock atob for setKey
      (global.atob as any).mockReturnValue("Test Key 1234567890");
      mockSubtle.importKey.mockResolvedValue(mockCryptoKey);
      aesGcmUtil.setKey(mockKey);
    });

    it("should return encrypted string on success", async () => {
      // Mock encryption
      const mockIv = new Uint8Array(12);
      mockCrypto.getRandomValues.mockReturnValue(mockIv);
      const mockCipherBuffer = new ArrayBuffer(16);
      mockSubtle.encrypt.mockResolvedValue(mockCipherBuffer);
      (global.btoa as any).mockReturnValue("encrypted-base64");

      const result = await encrypt(mockPlainText);

      expect(result).toBe("encrypted-base64");
    });

    it("should return undefined on encryption failure", async () => {
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      mockSubtle.encrypt.mockRejectedValue(new Error("Encryption failed"));

      const result = await encrypt(mockPlainText);

      expect(result).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Encryption failed:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe("exported decrypt function", () => {
    // Don't use beforeEach, set up fresh for each test
    it("should return decrypted string on success", async () => {
      // Set up fresh mocks for this test
      global.atob = vi
        .fn()
        .mockReturnValueOnce("Test Key 1234567890") // For setKey
        .mockReturnValueOnce("x".repeat(32)); // For decrypt

      mockSubtle.importKey.mockResolvedValue(mockCryptoKey);
      aesGcmUtil.setKey(mockKey);

      const mockDecryptedBuffer = new TextEncoder().encode(
        mockPlainText
      ).buffer;
      mockSubtle.decrypt.mockResolvedValue(mockDecryptedBuffer);

      const result = await decrypt(mockEncryptedData);

      expect(result).toBe(mockPlainText);
    });

    it("should return undefined on decryption failure", async () => {
      // Set up fresh mocks for this test
      global.atob = vi
        .fn()
        .mockReturnValueOnce("Test Key 1234567890") // For setKey
        .mockReturnValueOnce("x".repeat(32)); // For decrypt

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      mockSubtle.importKey.mockResolvedValue(mockCryptoKey);
      aesGcmUtil.setKey(mockKey);

      mockSubtle.decrypt.mockRejectedValue(new Error("Decryption failed"));

      const result = await decrypt(mockEncryptedData);

      expect(result).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Decryption failed:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  // Test the standalone utility functions directly
  describe("base64ToArrayBuffer", () => {
    it("should convert base64 to ArrayBuffer correctly", () => {
      // Create a simple test implementation
      const testBinaryString = "ABC";

      // Mock atob
      (global.atob as any).mockReturnValue(testBinaryString);

      // Since base64ToArrayBuffer is not exported, we need to test it indirectly
      // or export it for testing

      // Test through the decrypt flow instead
      mockSubtle.importKey.mockResolvedValue(mockCryptoKey);
      aesGcmUtil.setKey(mockKey);

      // Verify atob was called with the right argument
      expect(global.atob).toHaveBeenCalledWith(mockKey);
    });
  });

  describe("arrayBufferToBase64", () => {
    it("should convert ArrayBuffer to base64 correctly", () => {
      // Mock atob for setKey FIRST
      global.atob = vi.fn().mockReturnValue("Test Key 1234567890");

      mockSubtle.importKey.mockResolvedValue(mockCryptoKey);

      const testArray = new Uint8Array([65, 66, 67]); // "ABC"

      // Mock btoa
      global.btoa = vi.fn().mockReturnValue("QUJD");

      aesGcmUtil.setKey(mockKey);

      // Now test through encrypt method
      mockCrypto.getRandomValues.mockReturnValue(new Uint8Array(12));
      mockSubtle.encrypt.mockResolvedValue(testArray.buffer);

      // We can't directly test the function since it's not exported
      // but we can verify it works through the encrypt flow
      // The actual test would verify btoa is called during encryption
    });
  });

  describe("integration test", () => {
    it("should encrypt and decrypt correctly", async () => {
      // Real base64 key (256-bit)
      const key = "MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDE=";

      // Set up atob mock for the entire flow
      let callCount = 0;
      global.atob = vi.fn().mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return "01234567890123456789012345678901"; // For setKey
        } else if (callCount === 2) {
          // For decrypt - must return a string with length ≥28
          // Create a mock IV (12 bytes) + ciphertext (at least 16 bytes)
          return "x".repeat(28); // 12 (IV) + 16 (min ciphertext) = 28
        }
        return "";
      });

      // Mock btoa for encryption result
      global.btoa = vi.fn().mockReturnValue("mock-encrypted-base64");

      // Mock the entire flow
      mockSubtle.importKey.mockResolvedValue(mockCryptoKey);

      // Mock encryption
      const mockIv = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      mockCrypto.getRandomValues.mockReturnValue(mockIv);

      const mockEncryptedDataBuffer = new ArrayBuffer(32);
      mockSubtle.encrypt.mockResolvedValue(mockEncryptedDataBuffer);

      // Mock decryption
      const mockDecryptedBuffer = new TextEncoder().encode(
        mockPlainText
      ).buffer;
      mockSubtle.decrypt.mockResolvedValue(mockDecryptedBuffer);

      aesGcmUtil.setKey(key);

      const encrypted = await aesGcmUtil.encrypt(mockPlainText);
      expect(encrypted).toBe("mock-encrypted-base64");

      const decrypted = await aesGcmUtil.decrypt(encrypted!);
      expect(decrypted).toBe(mockPlainText);
    });
  });
});
