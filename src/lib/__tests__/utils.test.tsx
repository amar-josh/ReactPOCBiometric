import { describe, expect, it, vi } from "vitest";

import {
  cn,
  convertToLabelValue,
  fetchFakeData,
  getFieldErrorMessages,
} from "../utils";

// Mock translator to return key
vi.mock("@/i18n/translator", () => ({
  default: (key: string) => key,
}));

describe("cn utility", () => {
  it("merges class names with tailwind merge", () => {
    expect(cn("bg-red-500", "text-white")).toBe("bg-red-500 text-white");
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
    expect(cn("hidden", false && "block")).toBe("hidden");
  });
});

describe("getFieldErrorMessages", () => {
  it("returns empty object for undefined input", () => {
    expect(getFieldErrorMessages(undefined)).toEqual({});
  });

  it("returns empty object if structure is invalid", () => {
    const invalid = {
      data: { message: "Error", errors: "not-an-array" },
    } as any;
    expect(getFieldErrorMessages(invalid)).toEqual({});
  });

  it("extracts field errors from API error structure", () => {
    const error = {
      data: {
        message: "Validation failed",
        errors: [
          { field: "email", message: "Invalid email" },
          { field: "mobile", message: "Mobile required" },
        ],
      },
    };

    expect(getFieldErrorMessages(error)).toEqual({
      email: "Invalid email",
      mobile: "Mobile required",
    });
  });
});

describe("convertToLabelValue", () => {
  it("converts options to label-value array", () => {
    const options = [
      { code: 1, name: "Engineer" },
      { code: 2, name: "Doctor" },
    ];
    const expected = [
      { label: "Engineer", value: 1 },
      { label: "Doctor", value: 2 },
    ];

    expect(convertToLabelValue(options)).toEqual(expected);
  });

  it('adds "other" option if code is 0 and includeOther is true', () => {
    const options = [
      { code: 0, name: "Ignore this" },
      { code: 3, name: "Teacher" },
    ];
    const result = convertToLabelValue(options, true);
    expect(result).toEqual([
      { label: "formFields.other", value: 0 },
      { label: "Teacher", value: 3 },
    ]);
  });

  it("skips 'other' if includeOther is false", () => {
    const options = [
      { code: 0, name: "Other" },
      { code: 1, name: "Something" },
    ];
    const result = convertToLabelValue(options, false);
    expect(result).toEqual([
      { label: "Other", value: 0 },
      { label: "Something", value: 1 },
    ]);
  });

  it("returns empty array for undefined input", () => {
    expect(convertToLabelValue(undefined)).toEqual([]);
  });
});

describe("fetchFakeData", () => {
  it("resolves with mock data on success", async () => {
    const mock = { name: "test" };
    await expect(fetchFakeData(mock, true)).resolves.toEqual(mock);
  });

  it("rejects with mock error on failure", async () => {
    const mockError = { error: "Something went wrong" };
    await expect(fetchFakeData(mockError, false)).rejects.toEqual(mockError);
  });
});
