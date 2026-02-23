import { describe, expect, it, vi } from "vitest";

import type { IMobileOrEmailVerificationForm } from "../types";
import { getTableHeaders, mobileOrEmailVerificationFormSchema } from "../utils";

vi.mock("@/i18n/translator", () => ({
  default: (key: string) => key,
}));

describe("Utils - mobileOrEmailVerificationFormSchema", () => {
  it("should validate when identifier is mobile and mobile is valid", async () => {
    const data: IMobileOrEmailVerificationForm = {
      identifier: "mobile",
      mobile: "9876543210",
      email: "",
    };
    await expect(
      mobileOrEmailVerificationFormSchema.validate(data)
    ).resolves.toEqual(data);
  });

  it("should fail when identifier is mobile and mobile is empty (required check)", async () => {
    const data = { identifier: "mobile", mobile: "" };
    await expect(
      mobileOrEmailVerificationFormSchema.validate(data)
    ).rejects.toThrow("validations.mobileNumber.matchesRegex");
  });

  it("should fail when identifier is mobile and mobile fails regex", async () => {
    const data = { identifier: "mobile", mobile: "abc" };
    await expect(
      mobileOrEmailVerificationFormSchema.validate(data)
    ).rejects.toThrow("validations.mobileNumber.matchesRegex");
  });

  // --- EMAIL BRANCH TESTS ---

  it("should validate when identifier is email and email is valid", async () => {
    const data: IMobileOrEmailVerificationForm = {
      identifier: "email",
      mobile: "",
      email: "test@example.com",
    };
    await expect(
      mobileOrEmailVerificationFormSchema.validate(data)
    ).resolves.toEqual(data);
  });

  it("should fail when identifier is email and email is empty (required check)", async () => {
    const data = { identifier: "email", email: "" };
    await expect(
      mobileOrEmailVerificationFormSchema.validate(data)
    ).rejects.toThrow("validations.email.required");
  });

  it("should fail when identifier is email and email fails regex", async () => {
    const data = { identifier: "email", email: "invalid-email" };
    await expect(
      mobileOrEmailVerificationFormSchema.validate(data)
    ).rejects.toThrow("validations.email.enterValidEmail");
  });

  it("should fail when identifier is invalid", async () => {
    const data = { identifier: "other", mobile: "9876543210" };
    await expect(
      mobileOrEmailVerificationFormSchema.validate(data as any)
    ).rejects.toThrow();
  });

  it("should pass when identifier is email and mobile field is null/undefined", async () => {
    const data = { identifier: "email", email: "test@test.com" };
    const validated = await mobileOrEmailVerificationFormSchema.validate(data);
    expect(validated.email).toBe("test@test.com");
  });
});

describe("Utils - getTableHeaders", () => {
  it("should return mobile-specific headers when isMobileNumber is true", () => {
    const headers = getTableHeaders(true);

    expect(headers[0]).toEqual({ label: "mobileNumber", key: "mobile" });
    expect(headers[1].key).toBe("status");
    expect(headers[2].key).toBe("date");
    expect(headers.length).toBe(3);
  });

  it("should return email-specific headers when isMobileNumber is false", () => {
    const headers = getTableHeaders(false);

    expect(headers[0]).toEqual({ label: "email", key: "email" });
    expect(headers[1].label).toBe("mobileEmailVerification.verificationStatus");
    expect(headers[2].label).toBe("mobileEmailVerification.verifiedOn");
    expect(headers.length).toBe(3);
  });
});
