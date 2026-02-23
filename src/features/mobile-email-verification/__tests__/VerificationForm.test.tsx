import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import VerificationForm from "../components/VerificationForm";
import { IDENTIFIER_TYPE_CONSTANTS } from "../constants";

vi.mock("@/i18n/translator", () => ({
  default: (key: string) => key,
}));

vi.mock("@/components/common/RadioGroupComponent", () => ({
  default: ({ value, onChange, options }: any) => (
    <div data-testid="radio-group">
      {options.map((opt: any) => (
        <label key={opt.value}>
          <input
            type="radio"
            name="identifier"
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
          />
          {opt.label}
        </label>
      ))}
    </div>
  ),
}));

vi.mock("@/components/common/MobileNumberInput", () => ({
  default: ({ value, onChange, placeholder }: any) => (
    <input
      data-testid="mobile-input"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

describe("VerificationForm Component", () => {
  const mockOnSubmit = vi.fn();
  const mockOnReset = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (isSearchDetailsSuccess = false) => {
    return render(
      <VerificationForm
        onSubmit={mockOnSubmit}
        onReset={mockOnReset}
        isSearchDetailsSuccess={isSearchDetailsSuccess}
      />
    );
  };

  it("renders with default values (Mobile selected)", () => {
    renderComponent();

    expect(screen.getByText("verify")).toBeInTheDocument();
    expect(screen.getByTestId("mobile-input")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "button.search" })
    ).toBeDisabled();
  });

  it("switches to Email input when Radio button changes", async () => {
    renderComponent();

    const emailRadio = screen.getByLabelText(/email/i);
    fireEvent.click(emailRadio);

    await waitFor(() => {
      expect(screen.queryByTestId("mobile-input")).not.toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("mobileEmailVerification.placeholder.email")
      ).toBeInTheDocument();
    });

    expect(mockOnReset).toHaveBeenCalled();
  });

  it("enables Search and Reset buttons when input is provided", async () => {
    renderComponent();

    const mobileInput = screen.getByTestId("mobile-input");
    fireEvent.change(mobileInput, { target: { value: "9876543210" } });

    expect(screen.getByRole("button", { name: "button.search" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "button.reset" })).toBeEnabled();
  });

  it("calls onSubmit with correct data when form is valid", async () => {
    renderComponent();

    fireEvent.change(screen.getByTestId("mobile-input"), {
      target: { value: "9876543210" },
    });
    fireEvent.click(screen.getByRole("button", { name: "button.search" }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        identifier: IDENTIFIER_TYPE_CONSTANTS.MOBILE,
        mobile: "9876543210",
        email: "",
      });
    });
  });

  it("clears inputs and calls onReset when Reset button is clicked", async () => {
    renderComponent();

    const mobileInput = screen.getByTestId("mobile-input");
    fireEvent.change(mobileInput, { target: { value: "9876543210" } });

    const resetButton = screen.getByRole("button", { name: "button.reset" });
    fireEvent.click(resetButton);

    await waitFor(() => {
      expect(mobileInput).toHaveValue("");
      expect(mockOnReset).toHaveBeenCalled();
    });
  });

  it("disables Search button when isSearchDetailsSuccess is true", () => {
    renderComponent(true);

    fireEvent.change(screen.getByTestId("mobile-input"), {
      target: { value: "9876543210" },
    });

    expect(
      screen.getByRole("button", { name: "button.search" })
    ).toBeDisabled();
  });
});
