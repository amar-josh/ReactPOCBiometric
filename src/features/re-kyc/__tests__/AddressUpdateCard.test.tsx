import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import AddressUpdateCard from "../components/AddressUpdateCard";

// Mock translator to return the key
vi.mock("@/i18n/translator", () => ({
  default: (key: string) => key,
}));

// Mock subcomponents
vi.mock("../components/CommunicationAddressComponent", () => ({
  CommunicationAddressComponent: ({ title }: { title: string }) => (
    <div>{title}</div>
  ),
}));

vi.mock("../components/ReadonlyFieldCard", () => ({
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

vi.mock("../components/PersonalDetailsCard", () => ({
  default: ({ name }: { name: string }) => <div>{name}</div>,
}));

describe("AddressUpdateCard", () => {
  const defaultProps = {
    personalDetails: {
      fullName: "John Doe",
      emailId: "john@example.com",
      mobileNo: "9999999999",
    },
    formDetails: {
      rekycFields: [],
      otherFields: [],
    },
    communicationAddress: {
      addressLine1: "Old Address Line 1",
      addressLine2: "new lane",
      addressLine3: "",
      city: "Mumbai",
      state: "Maharashtra",
      pinCode: 400001,
      country: "India",
    },
    validateFingerPrintResponse: {
      data: {
        aadhaarVerification: "verified",
        requestNumber: "REQ123456",
        aadhaarAddress: {
          addressLine1: "New Address Line 1",
          addressLine2: "New Address Line 2",
          addressLine3: "",
          city: "New City",
          state: "New State",
          pinCode: 123456,
          country: "India",
        },
      },
      message: "",
      statusCode: 200,
      status: "success",
    },
    handleAddressConfirmed: vi.fn(),
    onCancel: vi.fn(),
    handleShowCancelModal: vi.fn(),
    isUpdateKYCError: false,
    updateKYCError: { name: "Error", message: "" },
  };

  it("renders all sections correctly", () => {
    render(<AddressUpdateCard {...defaultProps} />);

    // Section headings
    expect(screen.getByText("reKyc.reKycDetails")).toBeInTheDocument();
    expect(
      screen.getByText("formFields.communicationAddress")
    ).toBeInTheDocument();

    // Address sections
    expect(
      screen.getByText("reKyc.biometric.currentAddress")
    ).toBeInTheDocument();
    expect(screen.getByText("reKyc.biometric.newAddress")).toBeInTheDocument();
  });

  it("enables confirm button only after checking agreement", () => {
    render(<AddressUpdateCard {...defaultProps} />);

    const confirmBtn = screen.getByRole("button", {
      name: "reKyc.biometric.confirmAddress",
    });
    expect(confirmBtn).toBeDisabled();

    fireEvent.click(screen.getByLabelText("reKyc.agreeAddressUpdate"));
    expect(confirmBtn).toBeEnabled();
  });

  it("calls handlers correctly", () => {
    render(<AddressUpdateCard {...defaultProps} />);

    // Agree to update
    fireEvent.click(screen.getByLabelText("reKyc.agreeAddressUpdate"));

    // Click confirm
    fireEvent.click(
      screen.getByRole("button", {
        name: "reKyc.biometric.confirmAddress",
      })
    );
    expect(defaultProps.handleAddressConfirmed).toHaveBeenCalled();

    // Click cancel
    fireEvent.click(screen.getByRole("button", { name: "button.cancel" }));
    expect(defaultProps.handleShowCancelModal).toHaveBeenCalled();
  });
});
