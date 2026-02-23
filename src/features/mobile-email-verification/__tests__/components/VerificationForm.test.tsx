import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import VerificationForm from "../../components/VerificationForm";
import { IDENTIFIER_TYPE_CONSTANTS } from "../../constants";

describe("VerificationForm", () => {
  const onSubmit = vi.fn();
  const onReset = vi.fn();

  const setup = (isSearchDetailsSuccess = false) => {
    render(
      <VerificationForm
        onSubmit={onSubmit}
        onReset={onReset}
        isSearchDetailsSuccess={isSearchDetailsSuccess} // default false
      />
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with mobile as default identifier", () => {
    setup();
    expect(screen.getByPlaceholderText(/mobileNumber/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("switches to email input when identifier is changed", async () => {
    setup();
    const emailRadio = screen.getByRole("radio", { name: /email/i });
    await userEvent.click(emailRadio);

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  });

  it("shows error if mobile number is empty", async () => {
    setup();
    const searchBtn = screen.getByRole("button", { name: /search/i });
    await userEvent.click(searchBtn);

    await screen.findByText("formFields.mobileNumber");
  });

  it("submits form with valid mobile", async () => {
    setup(false);

    const mobileInput = screen.getByPlaceholderText(/mobileNumber/i);
    await userEvent.type(mobileInput, "9876543210");

    const searchBtn = screen.getByRole("button", { name: /search/i });
    await userEvent.click(searchBtn);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        identifier: IDENTIFIER_TYPE_CONSTANTS.MOBILE,
        mobile: "9876543210",
        email: "",
      });
    });
  });

  it("submits form with valid email", async () => {
    setup(false);

    const emailRadio = screen.getByRole("radio", { name: /email/i });
    await userEvent.click(emailRadio);

    const emailInput = screen.getByPlaceholderText(/email/i);
    await userEvent.type(emailInput, "test@example.com");

    const searchBtn = screen.getByRole("button", { name: /search/i });
    await userEvent.click(searchBtn);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        identifier: IDENTIFIER_TYPE_CONSTANTS.EMAIL,
        mobile: "",
        email: "test@example.com",
      });
    });
  });

  it("resets form on reset button click", async () => {
    setup();

    const mobileInput = screen.getByPlaceholderText(/mobileNumber/i);
    await userEvent.type(mobileInput, "9999999999");

    const resetBtn = screen.getByRole("button", { name: /reset/i });
    await userEvent.click(resetBtn);

    expect(mobileInput).toHaveValue("");
    expect(onReset).toHaveBeenCalled();
  });
});
