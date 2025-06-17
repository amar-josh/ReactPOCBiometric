import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { RadioGroup } from "@/components/ui/radio-group";

import AccountInfoCard from "../components/AccountInfoCard";

vi.mock("@/i18n/translator", () => ({
  default: (key: string) => key,
}));

vi.mock("@/lib/maskData", () => ({
  maskData: (value: string) => `***${value.slice(-4)}`,
}));

const mockAccounts = [
  {
    accountNumber: "1234567890",
    productName: "Savings",
    isAccountDormant: false,
    isDebitFreeze: false,
  },
  {
    accountNumber: "9876543210",
    productName: "Current",
    isAccountDormant: true,
    isDebitFreeze: false,
  },
  {
    accountNumber: "1111222233",
    productName: "Fixed Deposit",
    isAccountDormant: false,
    isDebitFreeze: true,
  },
];

const mockCustomer = {
  customerId: "CIF12345",
  customerName: "John Doe",
};

describe("AccountInfoCard", () => {
  it("renders customer details correctly", () => {
    render(
      <RadioGroup>
        <AccountInfoCard
          selected={false}
          accounts={mockAccounts}
          customerDetails={mockCustomer}
        />
      </RadioGroup>
    );

    expect(
      screen.getByText("reKyc.accountRelatedToCif CIF12345")
    ).toBeInTheDocument();
    expect(screen.getByText("reKyc.customerName")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("displays masked account numbers", () => {
    render(
      <RadioGroup>
        <AccountInfoCard
          selected={false}
          accounts={mockAccounts}
          customerDetails={mockCustomer}
        />
      </RadioGroup>
    );

    expect(screen.getByText("***7890")).toBeInTheDocument();
    expect(screen.getByText("***3210")).toBeInTheDocument();
    expect(screen.getByText("***2233")).toBeInTheDocument();
  });

  it("calls onSelect when clicked", () => {
    const onSelect = vi.fn();
    render(
      <RadioGroup>
        <AccountInfoCard
          selected={false}
          accounts={mockAccounts}
          onSelect={onSelect}
          customerDetails={mockCustomer}
        />
      </RadioGroup>
    );

    fireEvent.click(screen.getByText("reKyc.accountRelatedToCif CIF12345"));
    expect(onSelect).toHaveBeenCalled();
  });
});
