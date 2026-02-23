import { describe, expect, it } from "vitest";

import { getInitials } from "../utils";

describe("getInitials", () => {
  it("returns initials from first and last name", () => {
    expect(getInitials("John Doe")).toBe("JD");
  });

  it("returns initials from multi-word name using first and last", () => {
    expect(getInitials("Ravi Kumar Sharma")).toBe("RS");
  });

  it("returns first letter and dash for single-word name", () => {
    expect(getInitials("Sandhya")).toBe("S-");
  });

  it("handles underscore-separated names", () => {
    expect(getInitials("John_Doe")).toBe("JD");
  });

  it("handles hyphen-separated names", () => {
    expect(getInitials("Mary-Jane")).toBe("MJ");
  });

  it("handles mixed separators", () => {
    expect(getInitials("Mary_Jane-Watson")).toBe("MW");
  });

  it("returns dash for undefined", () => {
    expect(getInitials(undefined)).toBe("-");
  });

  it("returns dash for null", () => {
    expect(getInitials(null)).toBe("-");
  });

  it("returns dash for empty string", () => {
    expect(getInitials("")).toBe("-");
  });

  it("returns dash for whitespace-only string", () => {
    expect(getInitials("   ")).toBe("-");
  });

  it("trims leading and trailing whitespace", () => {
    expect(getInitials("  Alice Bob  ")).toBe("AB");
  });

  it("returns uppercase initials for lowercase input", () => {
    expect(getInitials("john doe")).toBe("JD");
  });
});
