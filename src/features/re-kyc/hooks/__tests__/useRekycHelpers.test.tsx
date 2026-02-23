import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useFormDetails, usePersonalDetails } from "../useRekycHelpers";

const mockCustomerDetailsResponse = {
  data: {
    rekycDetails: {
      customerName: "John Doe",
      mobileNo: "9999999999",
      emailId: "john@example.com",
    },
  },
};

// const mockOtherDetails: IOtherDetailsValues = {
//   occupation: { label: "Engineer", value: "engineer" },
//   residentType: { label: "Resident", value: "resident" },
//   incomeRange: { label: "5-10L", value: "5-10L" },
// };

const mockRekycDetails = {
  rekycDetails: {
    customerName: "John Doe",
    communicationAddress: {
      addressLine1: "",
      addressLine2: "",
      landmark: "",
      city: "Metropolis",
      district: "Gotham",
      pinCode: "",
      state: "",
    },
    permanentAddress: {
      addressLine1: "",
      addressLine2: "",
      landmark: "",
      city: "Metropolis",
      district: "Gotham",
      pinCode: "",
      state: "",
    },
    emailId: "john@example.com",
    mobileNo: "9999999999",
  },
};

describe("usePersonalDetails", () => {
  it("should extract fullName, mobileNo and emailId", () => {
    const { result } = renderHook(() =>
      usePersonalDetails(mockCustomerDetailsResponse)
    );
    expect(result.current).toEqual({
      fullName: "John Doe",
      mobileNo: "9999999999",
      emailId: "john@example.com",
    });
  });
});

describe("useFormDetails", () => {
  it("should return formatted form fields and other fields", () => {
    const { result } = renderHook(() =>
      useFormDetails(mockRekycDetails as any)
    );

    expect(result.current.rekycFields.length).toBeGreaterThan(0);
    // expect(result.current.otherFields.length).toBeGreaterThan(0);

    const commAddressField = result.current.rekycFields.find(
      (f) => f.value === "communicationAddress"
    );
    expect(commAddressField?.defaultValue).toContain("Metropolis");

    // const incomeField = result.current.otherFields.find(
    //   (f) => f.value === "incomeRange"
    // );
    // expect(incomeField?.defaultValue).toBe("5-10L");
  });
});
