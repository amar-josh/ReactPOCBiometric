import { afterEach, describe, expect, it, vi } from "vitest";

import {
  clearSessionStorage,
  getSessionStorageData,
  removeSessionStorageData,
  setSessionStorageData,
} from "../sessionStorage";

describe("sessionStorage utilities", () => {
  const key = "testKey";
  const testData = { name: "John", age: 30 };

  afterEach(() => {
    vi.restoreAllMocks();
    try {
      sessionStorage.clear();
    } catch (e) {
      // Ignore errors during cleanup
    }
  });

  it("setSessionStorageData should save data to sessionStorage", () => {
    setSessionStorageData(key, testData);
    const stored = sessionStorage.getItem(key);
    expect(stored).toBe(JSON.stringify(testData));
  });

  it("getSessionStorageData should retrieve parsed data from sessionStorage", () => {
    sessionStorage.setItem(key, JSON.stringify(testData));
    const result = getSessionStorageData<typeof testData>(key);
    expect(result).toEqual(testData);
  });

  it("getSessionStorageData should return null if key doesn't exist", () => {
    const result = getSessionStorageData<typeof testData>("nonexistent");
    expect(result).toBeNull();
  });

  it("removeSessionStorageData should remove data from sessionStorage", () => {
    sessionStorage.setItem(key, JSON.stringify(testData));
    removeSessionStorageData(key);
    expect(sessionStorage.getItem(key)).toBeNull();
  });

  it("clearSessionStorage should clear all data", () => {
    sessionStorage.setItem("key1", "val1");
    clearSessionStorage();
    expect(sessionStorage.length).toBe(0);
  });

  it("normalizeValue should handle 'null' and 'undefined' strings recursively", () => {
    const complex = { a: "null", b: ["undefined"], c: { d: "null" } };
    sessionStorage.setItem(key, JSON.stringify(complex));
    const result = getSessionStorageData<any>(key);

    expect(result.a).toBeNull();
    expect(result.b[0]).toBeNull();
    expect(result.c.d).toBeNull();
  });

  it("handles JSON.stringify errors in setSessionStorageData", () => {
    const circular: any = {};
    circular.self = circular;
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    setSessionStorageData(key, circular);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error occurred while saving session data:",
      expect.any(TypeError)
    );
  });

  it("handles JSON.parse errors in getSessionStorageData", () => {
    sessionStorage.setItem(key, "invalid-json");
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const result = getSessionStorageData(key);
    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it("handles errors in removeSessionStorageData", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const spy = vi
      .spyOn(Storage.prototype, "removeItem")
      .mockImplementation(() => {
        throw new Error("Remove error");
      });

    removeSessionStorageData(key);
    expect(consoleSpy).toHaveBeenCalled();

    spy.mockRestore();
  });

  it("handles errors in clearSessionStorage", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    // Force the prototype to throw
    const spy = vi.spyOn(Storage.prototype, "clear").mockImplementation(() => {
      throw new Error("Clear failed");
    });

    clearSessionStorage();

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error occurred while clearing session storage:",
      expect.any(Error)
    );

    spy.mockRestore();
  });
});
