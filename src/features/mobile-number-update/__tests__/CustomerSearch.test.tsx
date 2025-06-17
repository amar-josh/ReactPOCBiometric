import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { ERROR, SUCCESS } from "@/constants/globalConstant";

import CustomerSearch from "../components/CustomerSearch";

// Mocks
vi.mock("@/components/common/InfoMessage", () => ({
  __esModule: true,
  default: ({ message }: { message: string }) => <div>{message}</div>,
}));

vi.mock("@/components/common/AlertMessage", () => ({
  __esModule: true,
  default: ({ message }: { message: string }) => <div>{message}</div>,
}));

vi.mock("@/features/re-kyc/components/CustomerSearchForm", () => ({
  __esModule: true,
  default: (props: any) => (
    <div>
      <button onClick={() => props.onSearch({})}>Search</button>
      <button onClick={props.onReset}>Reset</button>
    </div>
  ),
}));

vi.mock("@/features/re-kyc/components/PersonalDetailsCard", () => ({
  __esModule: true,
  default: ({ name }: { name: string }) => <div>{name}</div>,
}));

vi.mock("@/features/re-kyc/components/AccountInfoCard", () => ({
  __esModule: true,
  default: ({ selected, onSelect, customerDetails }: any) => (
    <div>
      <div>{customerDetails.customerId}</div>
      <button onClick={onSelect}>{selected ? "Selected" : "Select"}</button>
    </div>
  ),
}));

vi.mock("@/i18n/translator", () => ({
  __esModule: true,
  default: (key: string) => key,
}));

describe("CustomerSearch Component", () => {
  const defaultProps = {
    customerSearchRef: { current: null },
    handleSearch: vi.fn(),
    handleResetSearch: vi.fn(),
    handleResetCustomerSearchAPI: vi.fn(),
    isCustomerSearchSuccess: true,
    customerSearchAlertMessage: { type: SUCCESS, message: "Search success!" },
    fetchRecordsErrorMessage: { type: ERROR, message: "Something went wrong" },
    personalDetails: {
      fullName: "John Doe",
      emailId: "john@example.com",
      mobileNo: "1234567890",
    },
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
    handleNext: vi.fn(),
    setFetchRecordsErrorMessage: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders search form, info message, and alert message", () => {
    render(<CustomerSearch {...defaultProps} />);

    expect(
      screen.getByText("mobileNumberUpdate.errorMessages.aadharMustLinked")
    ).toBeInTheDocument();
    expect(screen.getByText("Search success!")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("123")).toBeInTheDocument();
    expect(
      screen.getByText("mobileNumberUpdate.numberUpdateForAboveAccount")
    ).toBeInTheDocument();
  });

  it("calls onSearch when search button is clicked", () => {
    render(<CustomerSearch {...defaultProps} />);
    fireEvent.click(screen.getByText("Search"));
    expect(defaultProps.handleSearch).toHaveBeenCalled();
  });

  it("calls onReset when cancel is clicked", () => {
    render(<CustomerSearch {...defaultProps} />);
    fireEvent.click(screen.getByText("button.cancel"));
    expect(defaultProps.handleResetSearch).toHaveBeenCalled();
    expect(defaultProps.setFetchRecordsErrorMessage).toHaveBeenCalledWith({
      type: SUCCESS,
      message: "",
    });
  });

  it("calls handleNext on clicking Next", () => {
    render(<CustomerSearch {...defaultProps} />);
    fireEvent.click(screen.getByText("button.next"));
    expect(defaultProps.handleNext).toHaveBeenCalled();
  });

  it("renders error message at the bottom", () => {
    render(<CustomerSearch {...defaultProps} />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("does not render details if `accountDetails` and `personalDetails` are undefined", () => {
    render(
      <CustomerSearch
        {...defaultProps}
        accountDetails={undefined}
        personalDetails={undefined}
      />
    );
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    expect(screen.queryByText("123")).not.toBeInTheDocument();
  });
});
