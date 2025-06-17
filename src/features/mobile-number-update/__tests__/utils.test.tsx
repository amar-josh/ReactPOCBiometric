import { describe, expect, it, vi } from "vitest";

import { mobileNumberUpdateFailureCheckpoints } from "../utils";

// ✅ Mock translator to return key string
vi.mock("@/i18n/translator", () => ({
  default: (key: string) => key,
}));

// ✅ Mock alert icon
vi.mock("@/assets/images/alert.svg", () => ({
  default: "mock-alert-icon",
}));

describe("mobileNumberUpdateFailureCheckpoints", () => {
  it("should have all defined failure types with correct structure", () => {
    const checkpoints = mobileNumberUpdateFailureCheckpoints;

    expect(Object.keys(checkpoints)).toEqual([
      "AADHAR_NOT_AVAILABLE",
      "ACCOUNT_DORMANCY",
      "ACCOUNT_INACTIVE_OR_BLOCKED",
    ]);

    for (const [key, value] of Object.entries(checkpoints)) {
      expect(value).toHaveProperty(
        "title",
        "checkpoints.notEligibleForInstaTitle"
      );
      expect(value.message).toMatch(/^checkpoints\./); // message starts with "checkpoints."
      expect(value.icon).toBe("mock-alert-icon");
    }
  });
});
