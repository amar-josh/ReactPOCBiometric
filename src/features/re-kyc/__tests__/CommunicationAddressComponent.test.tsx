import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { IAddress } from "@/features/re-kyc/types";

import { CommunicationAddressComponent } from "../components/CommunicationAddressComponent";

// Mock formatAddress util
vi.mock("../utils", () => ({
  formatAddress: (address: IAddress) =>
    `${address.addressLine1}, ${address.city}, ${address.state} - ${address.pincode}`,
}));

describe("CommunicationAddressComponent", () => {
  const mockAddress: IAddress = {
    addressLine1: "123 Main Street",
    addressLine2: "Apt 4B",
    addressLine3: "",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    pincode: 400001,
  };

  it("renders the title and formatted address", () => {
    render(
      <CommunicationAddressComponent
        title="Previous Address"
        address={mockAddress}
        isSelected={false}
      />
    );

    expect(screen.getByText("Previous Address")).toBeInTheDocument();
    expect(
      screen.getByText(
        (content) =>
          content.includes("123 Main Street") &&
          content.includes("Mumbai") &&
          content.includes("Maharashtra") &&
          content.includes("400001")
      )
    ).toBeInTheDocument();
  });

  it("applies selected styles when isSelected is true", () => {
    const { container } = render(
      <CommunicationAddressComponent
        title="New Address"
        address={mockAddress}
        isSelected={true}
      />
    );

    const card = container.querySelector(".border-blue-500.bg-blue-50");
    expect(card).toBeTruthy();
  });

  it("does not apply selected styles when isSelected is false", () => {
    const { container } = render(
      <CommunicationAddressComponent
        title="New Address"
        address={mockAddress}
        isSelected={false}
      />
    );

    const card = container.querySelector(".border-blue-500.bg-blue-50");
    expect(card).toBeNull();
  });
});
