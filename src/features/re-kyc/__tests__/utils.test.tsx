// tests/utils/reKYCUtils.test.ts
import { describe, expect, it } from "vitest";

import {
  formatAddress,
  getBiometricCardDetails,
  getLabelBasedOnValue,
  otherDetailsFormSchema,
  otherDetailsReadOnlySchema,
  otherDetailsValidationSchema,
  reKYCFailureCheckpoints,
  reKycFormSchema,
} from "@/features/re-kyc/utils";

import { BIOMETRIC_OPERATIONS } from "../constants";

const dummyOptions = [
  { label: "Option A", value: "A" },
  { label: "Option B", value: "B" },
];

describe("getBiometricCardDetails", () => {
  it("returns correct details for DEVICE_NOT_READY", () => {
    const result = getBiometricCardDetails({
      statusKey: BIOMETRIC_OPERATIONS.DEVICE_NOT_READY,
      count: 2,
    });
    expect(result.key).toBe("retryDevice");
    expect(result.icon).toBeDefined();
  });

  it("returns correct details for ATTEMPT_FAILED with count 0", () => {
    const result = getBiometricCardDetails({
      statusKey: BIOMETRIC_OPERATIONS.ATTEMPT_FAILED,
      count: 0,
    });
    expect(result.key).toBe("home");
  });

  it("returns default error object for unknown statusKey", () => {
    const result = getBiometricCardDetails({ statusKey: "UNKNOWN", count: 0 });
    expect(result.isError).toBe(true);
    expect(result.key).toBe("capture");
  });
});

describe("getLabelBasedOnValue", () => {
  it("returns correct label when value exists", () => {
    expect(getLabelBasedOnValue(dummyOptions, "A")).toBe("Option A");
  });

  it("returns empty string when value doesn't match", () => {
    expect(getLabelBasedOnValue(dummyOptions, "Z")).toBe("");
  });
});

describe("formatAddress", () => {
  it("formats address correctly", () => {
    const formatted = formatAddress({
      addressLine1: "Line 1",
      addressLine2: "Line 2",
      city: "City",
      state: "State",
      country: "Country",
      pincode: "123456",
    });
    expect(formatted).toBe("Line 1, Line 2, City, State, Country, 123456");
  });
});

describe("form schemas and constants", () => {
  it("reKycFormSchema has readonly fields", () => {
    const allReadonly = reKycFormSchema.every((field) => field.readOnly);
    expect(allReadonly).toBe(true);
  });

  it("otherDetailsFormSchema has combobox/select types", () => {
    const types = otherDetailsFormSchema.map((f) => f.type);
    expect(types).toContain("combobox");
    expect(types).toContain("select");
  });

  it("otherDetailsReadOnlySchema has label-value pairs", () => {
    expect(otherDetailsReadOnlySchema.length).toBeGreaterThan(0);
    expect(otherDetailsReadOnlySchema[0]).toHaveProperty("label");
    expect(otherDetailsReadOnlySchema[0]).toHaveProperty("value");
  });
});

describe("otherDetailsValidationSchema", () => {
  it("fails when required fields are empty", async () => {
    try {
      await otherDetailsValidationSchema.validate({
        occupation: "",
        incomeRange: "",
        residentType: "",
      });
    } catch (e: any) {
      expect(e.errors.length).toBe(1);
    }
  });

  it("passes when all fields are filled", async () => {
    await expect(
      otherDetailsValidationSchema.validate({
        occupation: "Engineer",
        incomeRange: "0-5L",
        residentType: "Owned",
      })
    ).resolves.toBeDefined();
  });
});
