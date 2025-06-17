import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import AadhaarConsentModal from "../AadhaarConsentModal";

// Mock translator to return key as string for testing
vi.mock("@/i18n/translator", () => ({
  default: (key: string) => key,
}));

describe("AadhaarConsentModal", () => {
  const onClose = vi.fn();
  const handleProceed = vi.fn();

  const setup = (props = {}) => {
    return render(
      <AadhaarConsentModal
        open={true}
        onClose={onClose}
        handleProceed={handleProceed}
        {...props}
      />
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("enables proceed button only when consent checkbox is checked", () => {
    setup({ isConsentRequired: true });

    const checkbox = screen.getByRole("checkbox");
    const proceedBtn = screen.getByRole("button", { name: "button.proceed" });

    expect(proceedBtn).toBeDisabled();
    fireEvent.click(checkbox);
    expect(proceedBtn).toBeEnabled();
  });

  test("calls handleProceed on clicking proceed with consent", () => {
    setup({ isConsentRequired: true });

    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "button.proceed" }));

    expect(handleProceed).toHaveBeenCalled();
  });

  test("calls onClose on clicking cancel button", () => {
    setup({ isConsentRequired: true });

    fireEvent.click(screen.getByRole("button", { name: "button.cancel" }));
    expect(onClose).toHaveBeenCalled();
  });

  test("renders modal for address update without checkbox", () => {
    setup({ isWithAddressUpdate: true });

    expect(
      screen.getByText("reKyc.modal.reKYCWithAddressUpdate")
    ).toBeInTheDocument();
    expect(
      screen.getByText("reKyc.modal.updateCommunicationAddressPopUpMessage")
    ).toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  test("renders modal for no KYC change without checkbox", () => {
    setup();

    expect(
      screen.getByText("reKyc.modal.noChangeInKYCDetails")
    ).toBeInTheDocument();
    expect(
      screen.getByText("reKyc.modal.noChangeInKYCDetailsPopUpMessage")
    ).toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });

  test("calls handleProceed directly when consent is not required", () => {
    setup();

    const proceedBtn = screen.getByRole("button", {
      name: "reKyc.modal.proceedWithAadhaarBiometric",
    });

    fireEvent.click(proceedBtn);
    expect(handleProceed).toHaveBeenCalled();
  });
});
