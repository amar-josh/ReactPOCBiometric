import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, it, vi, expect } from "vitest";

import * as useBiometricsHooks from "@/hooks/useBiometrics";
import * as deviceDetectionHook from "@/hooks/useDeviceDetection";
import { BIOMETRIC_MODAL_ACTIONS } from "@/shared/biometric/constants";
import BiometricFlow from "../index";

// ------------------------
// Mock BiometricVerificationComponent
// ------------------------
vi.mock("../BiometricVerification", () => ({
  default: ({
    handleBiometricModalAction,
    handleConsentApproved,
    isBiometricModalOpen,
    isPending,
  }: any) => (
    <div>
      {!isBiometricModalOpen && (
        <button
          onClick={() => handleConsentApproved()}
          data-testid="consent-button"
        >
          button.continue
        </button>
      )}

      {isBiometricModalOpen && (
        <div data-testid="biometric-modal">
          {/* Use the actual constants here so the switch statement in the component works */}
          <button
            onClick={() =>
              handleBiometricModalAction(BIOMETRIC_MODAL_ACTIONS.CAPTURE)
            }
            data-testid="capture-button"
            disabled={isPending}
          >
            Capture
          </button>
          <button
            onClick={() =>
              handleBiometricModalAction(BIOMETRIC_MODAL_ACTIONS.HOME)
            }
            data-testid="home-button"
            disabled={isPending}
          >
            Home
          </button>
          <button
            onClick={() =>
              handleBiometricModalAction(BIOMETRIC_MODAL_ACTIONS.RETRY_DEVICE)
            }
            data-testid="retry-device-button"
            disabled={isPending}
          >
            Retry Device
          </button>
        </div>
      )}
    </div>
  ),
}));

// ------------------------
// Mock Hooks
// ------------------------
vi.mock("@/hooks/useDeviceDetection", () => ({
  useDeviceDetection: vi.fn(),
}));

vi.mock("@/hooks/useBiometrics", () => ({
  useCaptureFingerprint: vi.fn(),
  useGetDeviceStatus: vi.fn(),
  useGetRDServiceStatus: vi.fn(),
}));

describe("BiometricFlow Component", () => {
  let rdServiceMutate = vi.fn();
  let rdServiceReset = vi.fn();
  let deviceStatusMutate = vi.fn();
  let deviceStatusReset = vi.fn();
  let captureFingerprintMutate = vi.fn();
  let captureFingerprintReset = vi.fn();

  const defaultProps = {
    onCancel: vi.fn(),
    updateStep: vi.fn(),
    aadhaarNumber: "123412341234",
    requestNumber: "REQ123",
    handleValidateFingerPrint: vi.fn(),
    handleUpdateJourney: vi.fn(),
    isAddressUpdate: false,
    isValidateFingerPrintError: false,
    isValidateFingerPrintLoading: false,
    validateFingerPrintError: null,
    validateFingerPrintReset: vi.fn(),
    aadhaarVerificationStatus: undefined,
    validateFingerPrintResponse: undefined,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (deviceDetectionHook.useDeviceDetection as any).mockReturnValue({
      isAndroidWebView: false,
    });

    (useBiometricsHooks.useGetRDServiceStatus as any).mockReturnValue({
      mutate: rdServiceMutate,
      reset: rdServiceReset,
      isPending: false,
      isSuccess: false,
      isError: false,
    });

    (useBiometricsHooks.useGetDeviceStatus as any).mockReturnValue({
      mutate: deviceStatusMutate,
      reset: deviceStatusReset,
      isPending: false,
      isSuccess: false,
      isError: false,
    });

    (useBiometricsHooks.useCaptureFingerprint as any).mockReturnValue({
      mutate: captureFingerprintMutate,
      reset: captureFingerprintReset,
      isPending: false,
      isSuccess: false,
      isError: false,
    });
  });

  it("renders the initial continue button", () => {
    render(<BiometricFlow {...defaultProps} />);
    expect(screen.getByTestId("consent-button")).toBeInTheDocument();
  });

  it("calls getRDServiceStatus when continue/consent button clicked", async () => {
    render(<BiometricFlow {...defaultProps} />);
    fireEvent.click(screen.getByTestId("consent-button"));
    await waitFor(() => {
      expect(rdServiceMutate).toHaveBeenCalled();
    });
  });

  it("calls captureFingerprint when capture button is clicked inside modal", async () => {
    render(<BiometricFlow {...defaultProps} />);
    fireEvent.click(screen.getByTestId("consent-button"));

    const captureBtn = await screen.findByTestId("capture-button");
    fireEvent.click(captureBtn);

    await waitFor(() => {
      expect(captureFingerprintMutate).toHaveBeenCalled();
    });
  });

  it("calls onCancel when HOME action is triggered", async () => {
    const onCancelMock = vi.fn();
    render(<BiometricFlow {...defaultProps} onCancel={onCancelMock} />);
    fireEvent.click(screen.getByTestId("consent-button"));

    const homeBtn = await screen.findByTestId("home-button");
    fireEvent.click(homeBtn);

    await waitFor(() => {
      expect(onCancelMock).toHaveBeenCalled();
    });
  });

  it("calls deviceStatus when RETRY_DEVICE action is triggered", async () => {
    render(<BiometricFlow {...defaultProps} />);
    fireEvent.click(screen.getByTestId("consent-button"));

    const retryBtn = await screen.findByTestId("retry-device-button");
    fireEvent.click(retryBtn);

    await waitFor(() => {
      expect(deviceStatusReset).toHaveBeenCalled();
      expect(deviceStatusMutate).toHaveBeenCalled();
    });
  });

  it("handles Android WebView device check directly on consent", async () => {
    (deviceDetectionHook.useDeviceDetection as any).mockReturnValue({
      isAndroidWebView: true,
    });

    render(<BiometricFlow {...defaultProps} />);
    fireEvent.click(screen.getByTestId("consent-button"));

    await waitFor(() => {
      expect(deviceStatusMutate).toHaveBeenCalled();
    });
  });
});
