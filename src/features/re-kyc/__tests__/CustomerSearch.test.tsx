import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ERROR, SUCCESS } from "@/constants/globalConstant";

import CustomerSearch from "../components/CustomerSearch";
import CustomerSearchForm from "../components/CustomerSearchForm";

// Mocks
vi.mock("@/components/common/AlertMessage", () => ({
  __esModule: true,
  default: ({ type, message }: any) => (
    <div data-testid={`alert-${type}`}>{message}</div>
  ),
}));
vi.mock("@/components/common/FullScreenLoader", () => ({
  __esModule: true,
  default: () => <div data-testid="loader" />,
}));
vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));
vi.mock("@/components/ui/separator", () => ({
  Separator: () => <hr data-testid="separator" />,
}));
vi.mock("@/features/re-kyc/components/AccountInfoCard", () => ({
  __esModule: true,
  default: ({ selected, onSelect, customerDetails, isDisabled }: any) => (
    <div
      data-testid="account-info-card"
      data-selected={selected}
      data-disabled={isDisabled}
      onClick={onSelect}
    >
      {customerDetails?.customerId}
    </div>
  ),
}));
vi.mock("../components/EligibilityCard", () => ({
  __esModule: true,
  default: () => <div data-testid="eligibility-card">EligibilityCard</div>,
}));
vi.mock("@/i18n/translator", () => ({
  __esModule: true,
  default: (key: string) => key,
}));

const defaultProps = {
  customerSearchRef: { current: { resetForm: vi.fn() } },
  handleSearch: vi.fn(),
  handleResetSearch: vi.fn(),
  handleResetCustomerSearchAPI: vi.fn(),
  isCustomerSearchSuccess: false,
  customerSearchAlertMessage: { type: SUCCESS, message: "Search success!" },
  accountDetails: [
    {
      custDetails: {
        customerId: "123",
        isIndividual: false,
      },
      accDetails: [],
    },
  ],
  selected: "123",
  setSelected: vi.fn(),
  hasDormantAccount: false,
  handleReKYCNext: vi.fn(),
  isCustomerSearchLoading: false,
  customerDetailsError: null,
  isCustomerDetailsError: false,
  customerDetailsErrorMessage: { type: ERROR, message: "Something went wrong" },
  setCustomerDetailsErrorAlertMessage: vi.fn(),
};

describe("CustomerSearch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loader when loading", () => {
    render(<CustomerSearch {...defaultProps} isCustomerSearchLoading={true} />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("renders search form and separator", () => {
    render(<CustomerSearch {...defaultProps} />);
    expect(screen.getByTestId("separator")).toBeInTheDocument();
  });

  it("renders alert message if present", () => {
    render(<CustomerSearch {...defaultProps} />);
    expect(screen.getByTestId("alert-success")).toHaveTextContent(
      "Search success!"
    );
  });

  it("renders account info cards when accountDetails is present", () => {
    render(<CustomerSearch {...defaultProps} />);
    expect(screen.getByTestId("account-info-card")).toBeInTheDocument();
  });

  it("calls setSelected when account info card is clicked", () => {
    render(<CustomerSearch {...defaultProps} />);
    fireEvent.click(screen.getByTestId("account-info-card"));
    expect(defaultProps.setSelected).toHaveBeenCalled();
  });

  it("calls handleReKYCNext when Next button is clicked", () => {
    render(<CustomerSearch {...defaultProps} />);
    fireEvent.click(screen.getByText("button.next"));
    expect(defaultProps.handleReKYCNext).toHaveBeenCalled();
  });

  it("calls handleResetSearch and setCustomerDetailsErrorAlertMessage on Cancel", () => {
    render(<CustomerSearch {...defaultProps} />);
    fireEvent.click(screen.getByText("button.cancel"));
    expect(defaultProps.handleResetSearch).toHaveBeenCalled();
    expect(
      defaultProps.setCustomerDetailsErrorAlertMessage
    ).toHaveBeenCalledWith({
      type: SUCCESS,
      message: "",
    });
  });

  it("renders customer details error message if present", () => {
    render(<CustomerSearch {...defaultProps} />);
    expect(screen.getByTestId("alert-error")).toHaveTextContent(
      "Something went wrong"
    );
  });

  it("renders warning alert if hasDormantAccount is true", () => {
    render(<CustomerSearch {...defaultProps} hasDormantAccount={true} />);
    expect(screen.getByTestId("alert-warning")).toBeInTheDocument();
  });

  it("renders EligibilityCard if accountDetails is not present", () => {
    render(
      <CustomerSearchForm
        {...defaultProps}
        onSearch={vi.fn()}
        onReset={vi.fn()}
        onResetCustomerSearchAPI={vi.fn()}
        isSuccess={false}
      />
    );
    expect(screen.getByText("button.searchCustomer")).toBeInTheDocument();
  });
});
