import { describe, expect, it, vi } from "vitest";

import { mobileNumberUpdateFailureCheckpoints } from "../utils";

// Mock translator to return key string
vi.mock("@/i18n/translator", () => ({
  default: (key: string) => key,
}));

// Mock alert icon
vi.mock("@/assets/images/alert.svg", () => ({
  default: "mock-alert-icon",
}));

describe("mobileNumberUpdateFailureCheckpoints", () => {
  it("should have all defined failure types with correct structure", () => {
    const checkpoints = mobileNumberUpdateFailureCheckpoints;
    const expectedTitles = {
      AADHAR_NOT_AVAILABLE: "checkpoints.aadhaarDetailsMissingTitle",
      ACCOUNT_DORMANCY: "checkpoints.notEligibleForInstaTitle",
      ACCOUNT_INACTIVE_OR_BLOCKED: "checkpoints.notEligibleForInstaTitle",
      ACCOUNT_FREEZE: "checkpoints.notEligibleForInstaTitle",
    };

    for (const [key, value] of Object.entries(checkpoints)) {
      expect(value).toHaveProperty(
        "title",
        expectedTitles[key as keyof typeof expectedTitles]
      );
      expect(value.icon).toBe("mock-alert-icon");
    }
  });
});
