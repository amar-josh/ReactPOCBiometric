import { describe, expect, it } from "vitest";

import { maskData, MaskType } from "../maskData";

describe("maskData", () => {
  const testCases: { type: MaskType; input: string; expected: string }[] = [
    // Mobile
    { type: "mobile", input: "9876543210", expected: "XXXXXX3210" },
    { type: "mobile", input: "3210", expected: "3210" },
    { type: "mobile", input: "123", expected: "123" },

    // Aadhaar
    { type: "aadhaar", input: "123456789012", expected: "XXXXXXXX9012" },
    { type: "aadhaar", input: "7890", expected: "7890" },

    // Customer ID
    { type: "customerId", input: "CUS123456", expected: "XXXXX3456" },
    { type: "customerId", input: "1234", expected: "1234" },
    { type: "customerId", input: "12", expected: "12" },

    // Email
    {
      type: "email",
      input: "john.doe@example.com",
      expected: "johXXXXX@example.com",
    },
    { type: "email", input: "ab@example.com", expected: "ab@example.com" },
    { type: "email", input: "abc@example.com", expected: "abc@example.com" },
    { type: "email", input: "abcd@example.com", expected: "abcX@example.com" },
    { type: "email", input: "a@b.com", expected: "a@b.com" },
    { type: "email", input: "invalid-email", expected: "invalid-email" }, // no @

    // Edge cases
    { type: "email", input: "", expected: "" },
    { type: "mobile", input: "", expected: "" },
    { type: "aadhaar", input: "", expected: "" },
    { type: "customerId", input: "", expected: "" },
  ];

  testCases.forEach(({ type, input, expected }) => {
    it(`masks ${type} input "${input}" to "${expected}"`, () => {
      expect(maskData(input, type)).toBe(expected);
    });
  });

  it("returns original value for unknown type", () => {
    expect(maskData("whatever", "unknown-type" as MaskType)).toBe("whatever");
  });
});
