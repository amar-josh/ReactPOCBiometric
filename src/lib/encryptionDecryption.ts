const AES_ENCRYPTION_KEY_BASE64 = "mZygpLJhMzFzqfKxA+YUYReosbswBr2lEfG7ViCGuAM=";

class AesDecryptionException extends Error {
  constructor(message: string, originalError?: Error) {
    super(message);
    this.name = "AesDecryptionException";
    if (originalError) {
      this.stack = originalError.stack;
      this.message += `: ${originalError.message}`;
    }
  }
}

class AesGcmUtil {
  static AES_ALGORITHM = "AES-GCM";
  static IV_LENGTH = 12; // bytes
  static TAG_LENGTH = 128; // bits

  private keyPromise: Promise<CryptoKey>;

  constructor(base64Key: string) {
    if (!window.crypto?.subtle) {
      throw new Error("Web Cryptography API not supported.");
    }
    const keyBytes = base64ToArrayBuffer(base64Key);
    // TODO - Unable to find window.crypto
    this.keyPromise = window.crypto.subtle.importKey(
      "raw",
      keyBytes,
      { name: AesGcmUtil.AES_ALGORITHM, length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  async encrypt(plainText: string): Promise<string> {
    const key = await this.keyPromise;
    const iv = window.crypto.getRandomValues(
      new Uint8Array(AesGcmUtil.IV_LENGTH)
    );
    const encoded = new TextEncoder().encode(plainText);

    const cipherBuffer = await window.crypto.subtle.encrypt(
      {
        name: AesGcmUtil.AES_ALGORITHM,
        iv,
        tagLength: AesGcmUtil.TAG_LENGTH,
      },
      key,
      encoded
    );

    // Combine IV + ciphertext+tag into one buffer
    const combined = new Uint8Array(iv.length + cipherBuffer.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(cipherBuffer), iv.length);

    return arrayBufferToBase64(combined.buffer);
  }

  async decrypt(encryptedBase64: string): Promise<string> {
    try {
      const key = await this.keyPromise;
      const combined = base64ToArrayBuffer(encryptedBase64);

      if (
        combined.byteLength <
        AesGcmUtil.IV_LENGTH + AesGcmUtil.TAG_LENGTH / 8
      ) {
        throw new Error("Encrypted data too short");
      }

      const iv = new Uint8Array(combined.slice(0, AesGcmUtil.IV_LENGTH));
      const cipherBuffer = combined.slice(AesGcmUtil.IV_LENGTH);

      const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
          name: AesGcmUtil.AES_ALGORITHM,
          iv,
          tagLength: AesGcmUtil.TAG_LENGTH,
        },
        key,
        cipherBuffer
      );

      return new TextDecoder().decode(decryptedBuffer);
    } catch (e: any) {
      if (
        e instanceof DOMException &&
        e.name === "OperationError" &&
        e.message.includes("operation failed")
      ) {
        throw new AesDecryptionException(
          "Authentication failed or invalid data",
          e
        );
      }
      throw new AesDecryptionException("Decryption failed", e);
    }
  }
}

const aesGcmUtil = new AesGcmUtil(AES_ENCRYPTION_KEY_BASE64);

// encrypt function
export async function encrypt(data: string): Promise<string | undefined> {
  try {
    const encrypted = await aesGcmUtil.encrypt(JSON.stringify(data));
    return encrypted;
  } catch (error) {
    console.error("Encryption failed:", error);
  }
}

// decrypt function
export async function decrypt(data: string): Promise<string | undefined> {
  try {
    const decrypted = await aesGcmUtil.decrypt(data);
    const response = JSON.parse(decrypted);
    return response;
  } catch (error) {
    console.error("Decryption failed:", error);
  }
}

// Utility methods for base64 conversion
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes.buffer;
}

// Utility method to convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
