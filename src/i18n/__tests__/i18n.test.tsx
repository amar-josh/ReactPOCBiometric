import { describe, expect, it } from "vitest";

import i18n from "@/i18n/i18n";

describe("i18n configuration", () => {
  it("should be initialized with English as the default language", () => {
    expect(i18n.language).toBe("en");
  });

  it("should have translation resources loaded", () => {
    const resources = i18n.options.resources;
    expect(resources).toBeDefined();
    expect(resources?.en?.translation).toBeDefined();
  });

  it("should return the correct translation for known keys", () => {
    // Add a test key and value in your en.json file before this test runs
    const key = "reKyc.home"; // Assuming en.json contains { "test": { "hello": "Hello World" } }
    const translated = i18n.t(key);
    expect(translated).toBe("Back to Home");
  });

  it("should return the key itself for missing translations", () => {
    const key = "non.existent.key";
    const translated = i18n.t(key);
    expect(translated).toBe(key); // Because no fallback key is defined
  });
});
