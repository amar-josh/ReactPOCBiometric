import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import CustomerSearchForm from "../CustomerSearchForm";

// Mock translator to return key
vi.mock("@/i18n/translator", () => ({
  default: (key: string) => key,
}));

describe("CustomerSearchForm", () => {
  const mockOnSearch = vi.fn();
  const mockOnReset = vi.fn();
  const mockOnResetAPI = vi.fn();

  const searchOptions = [
    { label: "Mobile", value: "mobile" },
    { label: "CIF", value: "cif" },
    { label: "Account", value: "account" },
  ];

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders correctly with default mobile search", () => {
    render(
      <CustomerSearchForm
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        onResetCustomerSearchAPI={mockOnResetAPI}
        isSuccess={false}
        searchOptions={searchOptions}
      />
    );

    expect(screen.getByText(/reKyc.searchWith/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/placeholder.mobileNumber/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/searchCustomer/i)).toBeDisabled();
  });

  it("switches to CIF search and shows CIF input", async () => {
    const user = userEvent.setup();
    render(
      <CustomerSearchForm
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        onResetCustomerSearchAPI={mockOnResetAPI}
        isSuccess={false}
        searchOptions={searchOptions}
      />
    );

    const cifRadio = screen.getByLabelText("CIF");
    await user.click(cifRadio);

    expect(
      await screen.findByPlaceholderText(/placeholder.cif/i)
    ).toBeInTheDocument();
  });

  it("calls onSearch with mobile number", async () => {
    const user = userEvent.setup();
    render(
      <CustomerSearchForm
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        onResetCustomerSearchAPI={mockOnResetAPI}
        isSuccess={false}
        searchOptions={searchOptions}
      />
    );

    const mobileInput = screen.getByPlaceholderText(
      /placeholder.mobileNumber/i
    );
    await user.type(mobileInput, "9999999999");

    const submitButton = screen.getByText(/searchCustomer/i);
    expect(submitButton).not.toBeDisabled();
    await user.click(submitButton);

    // Use waitFor to handle async form submission
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith({ mobileNumber: "9999999999" });
    });
  });

  it("calls onSearch with CIF", async () => {
    const user = userEvent.setup();
    render(
      <CustomerSearchForm
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        onResetCustomerSearchAPI={mockOnResetAPI}
        isSuccess={false}
        searchOptions={searchOptions}
      />
    );

    await user.click(screen.getByLabelText("CIF"));

    const cifInput = await screen.findByPlaceholderText(/placeholder.cif/i);
    // Ensure the value matches your yup regex (length, etc)
    await user.type(cifInput, "123456789");

    const submitButton = screen.getByText(/searchCustomer/i);
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith({ customerID: "123456789" });
    });
  });

  it("calls onSearch with Account number", async () => {
    const user = userEvent.setup();
    render(
      <CustomerSearchForm
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        onResetCustomerSearchAPI={mockOnResetAPI}
        isSuccess={false}
        searchOptions={searchOptions}
      />
    );

    await user.click(screen.getByLabelText("Account"));

    const accountInput = await screen.findByPlaceholderText(
      /placeholder.accountNumber/i
    );
    await user.type(accountInput, "12345678901234");

    const submitButton = screen.getByText(/searchCustomer/i);
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith({
        accountNumber: "12345678901234",
      });
    });
  });

  it("calls onReset when reset button clicked", async () => {
    const user = userEvent.setup();
    render(
      <CustomerSearchForm
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        onResetCustomerSearchAPI={mockOnResetAPI}
        isSuccess={false}
        searchOptions={searchOptions}
      />
    );

    const mobileInput = screen.getByPlaceholderText(
      /placeholder.mobileNumber/i
    );
    await user.type(mobileInput, "9999999999");

    const resetButton = screen.getByText(/button.reset/i);
    await user.click(resetButton);

    expect(mockOnReset).toHaveBeenCalled();
    expect(mobileInput).toHaveValue("");
  });

  it("disables submit button when isSuccess is true", () => {
    render(
      <CustomerSearchForm
        onSearch={mockOnSearch}
        onReset={mockOnReset}
        onResetCustomerSearchAPI={mockOnResetAPI}
        isSuccess={true}
        searchOptions={searchOptions}
      />
    );

    const submitButton = screen.getByText(/searchCustomer/i);
    expect(submitButton).toBeDisabled();
  });
});
