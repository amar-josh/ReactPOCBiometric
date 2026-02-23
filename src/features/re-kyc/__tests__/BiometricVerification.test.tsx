import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import BiometricVerificationComponent from "@/shared/biometric/BiometricVerification";
import { IBiometricCardKey } from "@/shared/biometric/types";

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

vi.mock("@/i18n/translator", () => ({
  __esModule: true,
  default: (key: string) => key,
}));

vi.mock("@/assets/images/aadhaar.svg", () => "aadhaar.svg");
vi.mock("@/components/common/AadhaarConsentModal", () => ({
  __esModule: true,
  default: ({ handleProceed, onClose }: any) => (
    <div data-testid="aadhaar-consent">
      Aadhaar Consent
      <button onClick={handleProceed}>Proceed</button>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

vi.mock("@/components/common/AlertDialogComponent", () => ({
  __esModule: true,
  default: ({ title, message }: any) => (
    <div data-testid="alert-dialog">
      <div>{title}</div>
      <div>{message}</div>
    </div>
  ),
}));

vi.mock("@/assets/images/aadhaar.svg", () => ({
  __esModule: true,
  default: "aadhaar.svg",
}));

describe("BiometricVerificationComponent", () => {
  const baseProps = {
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
    expect(screen.getByText("XXXXXXXX9012")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "button.continue" })
    ).toBeVisible();
    expect(screen.getByRole("button", { name: "button.cancel" })).toBeVisible();
  });

  it("calls handler when Esign button is clicked", () => {
    render(<BiometricVerificationComponent {...mockProps} />);
    fireEvent.click(screen.getByRole("button", { name: "button.continue" }));
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

    expect(screen.getByText("Aadhaar Consent")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Proceed"));
    expect(mockProps.handleConsentApproved).toHaveBeenCalled();

    fireEvent.click(screen.getByText("Close"));
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

    expect(screen.getByText("reKyc.biometricVerification")).toBeInTheDocument();
    fireEvent.click(screen.getByText("button.continue"));
  });

  it("renders the biometric verification heading and Aadhaar number", () => {
    render(<BiometricVerificationComponent {...baseProps} />);

    expect(screen.getByText("reKyc.biometricVerification")).toBeInTheDocument();
    expect(
      screen.getByText("reKyc.verifyAadhaarInformation")
    ).toBeInTheDocument();
    expect(screen.getByText("reKyc.aadhaarNumber")).toBeInTheDocument();
    expect(screen.getByText("XXXXXXXX9012")).toBeInTheDocument();
  });

  it("calls the handlers when buttons are clicked", () => {
    render(<BiometricVerificationComponent {...baseProps} />);

    fireEvent.click(screen.getByText("button.continue"));
    expect(baseProps.handleAadhaarConsentModal).toHaveBeenCalled();

    fireEvent.click(screen.getByText("button.cancel"));
    expect(baseProps.onCancel).toHaveBeenCalled();
  });

  it("shows AadhaarConsentModal when isAadhaarConsentOpen is true", () => {
    render(
      <BiometricVerificationComponent
        {...baseProps}
        isAadhaarConsentOpen={true}
      />
    );

    expect(screen.getByTestId("aadhaar-consent")).toBeInTheDocument();
  });

  it("renders AlertDialogComponent when isBiometricModalOpen is true", () => {
    const biometricDetails = {
      title: "Test Title",
      message: "Test Message",
      icon: "error-icon",
      isError: true,
      key: "retry" as IBiometricCardKey,
      buttonText: "Confirm",
    };

    render(
      <BiometricVerificationComponent
        {...baseProps}
        isBiometricModalOpen={true}
        biometricDetails={biometricDetails}
      />
    );

    expect(screen.getByTestId("alert-dialog")).toBeInTheDocument();
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Message")).toBeInTheDocument();
  });
});
