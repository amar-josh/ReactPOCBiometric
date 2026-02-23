import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { JOURNEY_TYPE } from "@/constants/globalConstant";

import CustomerSearch from "..";

/* ------------------------------------------------------------------ */
/* ------------------------------ MOCKS ------------------------------ */
/* ------------------------------------------------------------------ */

vi.mock("@/i18n/translator", () => ({
  default: (key: string) => key,
}));

vi.mock("@/components/ui/radio-group", () => ({
  RadioGroup: ({ children, onValueChange }: any) => (
    <div data-testid="radio-group" onClick={() => onValueChange?.("CUST123")}>
      {children}
    </div>
  ),
  RadioGroupItem: ({ children }: any) => (
    <div data-testid="radio-item">{children}</div>
  ),
}));

vi.mock("lucide-react", async () => {
  const actual =
    await vi.importActual<typeof import("lucide-react")>("lucide-react");

  return {
    ...actual,
    Info: () => <svg data-testid="info-icon" />,
    User: () => <svg data-testid="user-icon" />,
    UserCheck: () => <svg data-testid="user-check-icon" />,
    IdCard: () => <svg data-testid="id-card-icon" />,
    Check: () => <svg data-testid="check-icon" />,
  };
});

vi.mock("../CustomerSearchForm", () => ({
  default: () => <div data-testid="customer-search-form" />,
}));

vi.mock("../AccountInfo", () => ({
  default: ({ customerDetails, isDisabled, onSelect }: any) => (
    <div
      data-testid="account-info-card"
      data-disabled={isDisabled}
      onClick={onSelect}
    >
      {customerDetails.customerId}
    </div>
  ),
}));

vi.mock("@/components/common/EligibilityCard", () => ({
  default: ({ title }: any) => (
    <div data-testid="eligibility-card">{title}</div>
  ),
}));

vi.mock("@/components/common/AlertMessage", () => ({
  default: ({ message }: any) => (
    <div data-testid="alert-message">{message}</div>
  ),
}));

/* ------------------------------------------------------------------ */
/* -------------------------- TEST DATA ------------------------------ */
/* ------------------------------------------------------------------ */

const baseProps: any = {
  customerSearchRef: { current: { resetForm: vi.fn() } },
  handleSearch: vi.fn(),
  handleResetSearch: vi.fn(),
  handleResetCustomerSearchAPI: vi.fn(),
  handleShowCancelModal: vi.fn(),
  handleNext: vi.fn(),
  isCustomerSearchSuccess: false,
  customerSearchAlertMessage: { type: "info", message: "" },
  customerDetailsErrorMessage: { type: "error", message: "" },
  selectedCustomerId: "",
  setSelectedCustomerId: vi.fn(),
  journeyType: JOURNEY_TYPE.REKYC,
  searchOptions: [],
  searchBy: "mobile",
  onSearchByChange: vi.fn(),
};

/* ------------------------------------------------------------------ */
/* ------------------------------ TESTS ------------------------------ */
/* ------------------------------------------------------------------ */

describe("CustomerSearch Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders CustomerSearchForm", () => {
    render(<CustomerSearch {...baseProps} />);

    expect(screen.getByTestId("customer-search-form")).toBeInTheDocument();
  });

  it("renders EligibilityCard when accountDetails is undefined", () => {
    render(<CustomerSearch {...baseProps} accountDetails={undefined} />);

    expect(screen.getByTestId("eligibility-card")).toBeInTheDocument();
  });

  it("renders AccountInfoCards when accountDetails are present", () => {
    render(
      <CustomerSearch
        {...baseProps}
        accountDetails={[
          {
            custDetails: {
              customerId: "CUST123",
              isIndividual: true,
            },
            accDetails: [],
          },
        ]}
      />
    );

    expect(screen.getByTestId("account-info-card")).toBeInTheDocument();
  });

  it("marks AccountInfoCard as disabled for non-individual customers", () => {
    render(
      <CustomerSearch
        {...baseProps}
        accountDetails={[
          {
            custDetails: {
              customerId: "CUST999",
              isIndividual: false,
            },
            accDetails: [],
          },
        ]}
      />
    );

    expect(screen.getByTestId("account-info-card")).toHaveAttribute(
      "data-disabled",
      "true"
    );
  });

  it("selects customer when account card is clicked", () => {
    render(
      <CustomerSearch
        {...baseProps}
        accountDetails={[
          {
            custDetails: {
              customerId: "CUST123",
              isIndividual: true,
            },
            accDetails: [],
          },
        ]}
      />
    );

    fireEvent.click(screen.getByTestId("account-info-card"));

    expect(baseProps.setSelectedCustomerId).toHaveBeenCalledWith("CUST123");
  });

  it("disables Next button when no customer selected", () => {
    render(
      <CustomerSearch
        {...baseProps}
        selectedCustomerId=""
        accountDetails={[]}
      />
    );

    expect(screen.getByText("button.next")).toBeDisabled();
  });

  it("calls handleNext when Next button clicked", () => {
    render(
      <CustomerSearch
        {...baseProps}
        selectedCustomerId="CUST123"
        accountDetails={[]}
      />
    );

    fireEvent.click(screen.getByText("button.next"));

    expect(baseProps.handleNext).toHaveBeenCalled();
  });

  it("calls handleShowCancelModal on Cancel click", () => {
    render(<CustomerSearch {...baseProps} accountDetails={[]} />);

    fireEvent.click(screen.getByText("button.cancel"));

    expect(baseProps.handleShowCancelModal).toHaveBeenCalled();
  });

  it("renders alert messages when present", () => {
    render(
      <CustomerSearch
        {...baseProps}
        customerSearchAlertMessage={{
          type: "error",
          message: "Search failed",
        }}
      />
    );

    expect(screen.getByTestId("alert-message")).toHaveTextContent(
      "Search failed"
    );
  });
});
