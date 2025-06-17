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
    },
    validateFingerPrintResponse: {
      data: {
        aadhaarAddress: {
          addressLine1: "New Address Line 1",
        },
      },
    },
    handleAddressConfirmed: vi.fn(),
    onCancel: vi.fn(),
    isUpdateKYCError: false,
    updateKYCError: { message: "" },
  };

  it("renders all sections correctly", () => {
    render(<AddressUpdateCard {...defaultProps} />);

    // Verify personal details
    expect(screen.getByText("John Doe")).toBeInTheDocument();

    // Section headings
    expect(screen.getByText("reKyc.reKycDetails")).toBeInTheDocument();
    expect(screen.getByText("reKyc.otherDetails")).toBeInTheDocument();
    expect(
      screen.getByText("formFields.communicationAddress")
    ).toBeInTheDocument();

    // Address sections
    expect(
      screen.getByText("reKyc.biometric.previousAddress")
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
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it("shows alert when there is an update KYC error", () => {
    render(
      <AddressUpdateCard
        {...defaultProps}
        isUpdateKYCError={true}
        updateKYCError={{ message: "Something went wrong" }}
      />
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });
});
