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
    clearSessionStorage();
    vi.restoreAllMocks();
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

  it("handles JSON.parse errors gracefully in getSessionStorageData", () => {
    sessionStorage.setItem(key, "invalid JSON");
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const result = getSessionStorageData(key);
    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error occurred while fetching session data:",
      expect.any(SyntaxError)
    );
  });

  it("handles JSON.stringify errors gracefully in setSessionStorageData", () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    setSessionStorageData(key, circular);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error occurred while saving session data:",
      expect.any(TypeError)
    );
    expect(sessionStorage.getItem(key)).toBeNull();
  });
});
