import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { IAddress } from "@/features/re-kyc/types";

import { CommunicationAddressComponent } from "../components/CommunicationAddressComponent";

// Mock formatAddress util
vi.mock("../utils", () => ({
  formatAddress: (address: IAddress) =>
    `${address.addressLine1}, ${address.city}, ${address.state} - ${address.pinCode}`,
}));

describe("CommunicationAddressComponent", () => {
  const mockAddress: IAddress = {
    addressLine1: "123 Main Street",
    addressLine2: "Apt 4B",
    addressLine3: "",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    pinCode: 400001,
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
      screen.getByText("Mumbai, Maharashtra, India, 400001")
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

    const card = container.querySelector(
      ".border-1.border-blue.bg-blue-50.mb-4"
    );
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

  it("returns null when address is undefined", () => {
    const { container } = render(
      <CommunicationAddressComponent
        title="Empty Address"
        address={undefined}
        isSelected={false}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders correctly without addressLine2 and addressLine3", () => {
    const partialAddress: IAddress = {
      addressLine1: "456 Elm Street",
      addressLine2: "",
      addressLine3: "",
      city: "Pune",
      state: "Maharashtra",
      country: "India",
      pinCode: 411001,
    };

    render(
      <CommunicationAddressComponent
        title="Partial Address"
        address={partialAddress}
        isSelected={false}
      />
    );

    expect(screen.getByText("456 Elm Street")).toBeInTheDocument();
    expect(
      screen.getByText("Pune, Maharashtra, India, 411001")
    ).toBeInTheDocument();
  });
});
