import { describe, expect, it, vi } from "vitest";
import { customerSearchFormSchema } from "../utils";

vi.mock("@/i18n/translator", () => ({
  default: (key: string) => key,
}));

describe("customerSearchFormSchema", () => {
  it("requires searchBy to be one of mobile, cif, account", async () => {
    await expect(
      customerSearchFormSchema.validate({
        searchBy: "invalid",
        mobile: "",
        cif: "",
        account: "",
      })
    ).rejects.toThrow();
  });

  it("validates mobile when searchBy is mobile", async () => {
    await expect(
      customerSearchFormSchema.validate({
        searchBy: "mobile",
        mobile: "12345",
      })
    ).rejects.toThrow("validations.mobileNumber.matchesRegex");

    await expect(
      customerSearchFormSchema.validate({
        searchBy: "mobile",
        mobile: "9999999999",
      })
    ).resolves.toBeTruthy();
  });

  it("validates cif when searchBy is cif", async () => {
    await expect(
      customerSearchFormSchema.validate({
        searchBy: "cif",
        cif: "ABC",
      })
    ).rejects.toThrow("validations.cif.matchesRegex");

    // FIX: Using numeric string. Adjust the length to match your CIF_LENGTH constant
    await expect(
      customerSearchFormSchema.validate({
        searchBy: "cif",
        cif: "123456789",
      })
    ).resolves.toBeTruthy();
  });

  it("validates account when searchBy is account", async () => {
    await expect(
      customerSearchFormSchema.validate({
        searchBy: "account",
        account: "XYZ",
      })
    ).rejects.toThrow("validations.account.matchesRegex");

    // FIX: Using 14 digits as per your component's maxLength
    await expect(
      customerSearchFormSchema.validate({
        searchBy: "account",
        account: "12345678901234",
      })
    ).resolves.toBeTruthy();
  });

  it("does not require other fields when searchBy is set", async () => {
    // Only mobile
    await expect(
      customerSearchFormSchema.validate({
        searchBy: "mobile",
        mobile: "9999999999",
      })
    ).resolves.toBeTruthy();

    // Only CIF (Numeric)
    await expect(
      customerSearchFormSchema.validate({
        searchBy: "cif",
        cif: "123456789",
      })
    ).resolves.toBeTruthy();

    // Only account (Numeric)
    await expect(
      customerSearchFormSchema.validate({
        searchBy: "account",
        account: "12345678901234",
      })
    ).resolves.toBeTruthy();
  });
});
