import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import BiometricVerificationComponent from "../components/BiometricVerification";
import { IBiometricCardKey } from "../types";

// Mock translator
vi.mock("@/i18n/translator", () => ({
  default: (key: string) => key,
}));

// Mock AadhaarConsentModal
vi.mock("@/components/common/AadhaarConsentModal", () => ({
  __esModule: true,
  default: ({
    handleProceed,
    onClose,
  }: {
    handleProceed: () => void;
    onClose: () => void;
  }) => (
    <div>
      <p>Aadhaar Consent Modal</p>
      <button onClick={handleProceed}>Proceed Consent</button>
      <button onClick={onClose}>Close Consent</button>
    </div>
  ),
}));

// Mock AlertDialogComponent
vi.mock("@/components/common/AlertDialogComponent", () => ({
  __esModule: true,
  default: ({ onConfirm }: { onConfirm: (action: string) => void }) => (
    <div>
      <p>Biometric Modal</p>
      <button onClick={() => onConfirm("proceed")}>Confirm Biometric</button>
    </div>
  ),
}));

describe("BiometricVerificationComponent", () => {
  const mockProps = {
    handleAadhaarConsentModal: vi.fn(),
    onCancel: vi.fn(),
    isAadhaarConsentOpen: false,
    handleConsentApproved: vi.fn(),
    isBiometricModalOpen: false,
    biometricDetails: null,
    handleBiometricModalAction: vi.fn(),
    isPending: false,
    aadhaarNumber: "123456789012",
    setIsAadhaarConsentOpen: vi.fn(),
  };

  it("renders correctly with Aadhaar number and buttons", () => {
    render(<BiometricVerificationComponent {...mockProps} />);

    expect(screen.getByText("reKyc.biometricVerification")).toBeInTheDocument();
    expect(screen.getByDisplayValue("123456789012")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "button.esign" })).toBeVisible();
    expect(screen.getByRole("button", { name: "button.cancel" })).toBeVisible();
  });

  it("calls handler when Esign button is clicked", () => {
    render(<BiometricVerificationComponent {...mockProps} />);
    fireEvent.click(screen.getByRole("button", { name: "button.esign" }));
    expect(mockProps.handleAadhaarConsentModal).toHaveBeenCalled();
  });

  it("calls handler when Cancel button is clicked", () => {
    render(<BiometricVerificationComponent {...mockProps} />);
    fireEvent.click(screen.getByRole("button", { name: "button.cancel" }));
    expect(mockProps.onCancel).toHaveBeenCalled();
  });

  it("renders AadhaarConsentModal when open", () => {
    render(
      <BiometricVerificationComponent
        {...mockProps}
        isAadhaarConsentOpen={true}
      />
    );

    expect(screen.getByText("Aadhaar Consent Modal")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Proceed Consent"));
    expect(mockProps.handleConsentApproved).toHaveBeenCalled();

    fireEvent.click(screen.getByText("Close Consent"));
    expect(mockProps.setIsAadhaarConsentOpen).toHaveBeenCalledWith(false);
  });

  it("renders Biometric modal when open and calls confirm handler", () => {
    // Use a valid IBiometricCardKey value for the key property
    // Import or define IBiometricCardKey if not already imported

    const biometricDetails = {
      isError: false,
      title: "Sample Title",
      message: "Sample message",
      icon: "sample-icon",
      key: "success" as IBiometricCardKey, // Use the actual IBiometricCardKey union type
      buttonText: "Proceed",
    };

    render(
      <BiometricVerificationComponent
        {...mockProps}
        isBiometricModalOpen={true}
        biometricDetails={biometricDetails}
      />
    );

    expect(screen.getByText("Biometric Modal")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Confirm Biometric"));
    expect(mockProps.handleBiometricModalAction).toHaveBeenCalledWith(
      "proceed"
    );
  });
});
