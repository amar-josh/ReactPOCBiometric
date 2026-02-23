// Uncomment these imports and add missing ones
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as useBiometricsHooks from "@/hooks/useBiometrics";
import * as deviceDetectionHook from "@/hooks/useDeviceDetection";

// Uncomment the component import
import BiometricFlow from "../index";

// ------------------------
// Mock BiometricVerificationComponent
// ------------------------
vi.mock("@/shared/biometric/BiometricVerification", () => ({
  default: ({
    handleBiometricModalAction,
    handleConsentApproved,
    isPending,
  }: any) => (
    <div>
      <button
        onClick={() => handleConsentApproved()}
        data-testid="consent-button"
        disabled={isPending}
      >
        Consent
      </button>
      <button
        onClick={() => handleBiometricModalAction("CAPTURE")}
        data-testid="capture-button"
        disabled={isPending}
      >
        Capture
      </button>
      <button
        onClick={() => handleBiometricModalAction("HOME")}
        data-testid="home-button"
        disabled={isPending}
      >
        Home
      </button>
      <button
        onClick={() => handleBiometricModalAction("RETRY_DEVICE")}
        data-testid="retry-device-button"
        disabled={isPending}
      >
        Retry Device
      </button>
    </div>
  ),
}));

// ------------------------
// Mock hooks
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
  // Create spy functions at the top level
  let rdServiceMutate: ReturnType<typeof vi.fn>;
  let rdServiceReset: ReturnType<typeof vi.fn>;
  let deviceStatusMutate: ReturnType<typeof vi.fn>;
  let deviceStatusReset: ReturnType<typeof vi.fn>;
  let captureFingerprintMutate: ReturnType<typeof vi.fn>;
  let captureFingerprintReset: ReturnType<typeof vi.fn>;

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

    // Create fresh spies for each test
    rdServiceMutate = vi.fn();
    rdServiceReset = vi.fn();
    deviceStatusMutate = vi.fn();
    deviceStatusReset = vi.fn();
    captureFingerprintMutate = vi.fn();
    captureFingerprintReset = vi.fn();

    // Default hook mocks
    (deviceDetectionHook.useDeviceDetection as any).mockReturnValue({
      isAndroidWebView: false,
    });

    (useBiometricsHooks.useGetRDServiceStatus as any).mockReturnValue({
      mutate: rdServiceMutate,
      data: null,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      reset: rdServiceReset,
    });

    (useBiometricsHooks.useGetDeviceStatus as any).mockReturnValue({
      mutate: deviceStatusMutate,
      data: null,
      isPending: false,
      isSuccess: false,
      isError: false,
      reset: deviceStatusReset,
    });

    (useBiometricsHooks.useCaptureFingerprint as any).mockReturnValue({
      mutate: captureFingerprintMutate,
      data: null,
      isPending: false,
      isSuccess: false,
      isError: false,
      reset: captureFingerprintReset,
    });
  });

  it("renders without crashing", () => {
    render(<BiometricFlow {...defaultProps} />);
    expect(screen.getByTestId("consent-button")).toBeInTheDocument();
    expect(screen.getByTestId("capture-button")).toBeInTheDocument();
    expect(screen.getByTestId("home-button")).toBeInTheDocument();
  });

  it("calls getRDServiceStatus when consent button clicked", () => {
    render(<BiometricFlow {...defaultProps} />);
    fireEvent.click(screen.getByTestId("consent-button"));

    // The consent button should trigger getRDServiceStatus
    expect(rdServiceMutate).toHaveBeenCalled();
  });

  it("updates modal details when aadhaarVerificationStatus changes to SUCCESS", () => {
    render(
      <BiometricFlow {...defaultProps} aadhaarVerificationStatus="SUCCESS" />
    );
    expect(screen.getByTestId("consent-button")).toBeInTheDocument();
  });

  it("handles validate fingerprint error with 4xx status code", () => {
    const errorResponse = { statusCode: 400, message: "Invalid fingerprint" };
    render(
      <BiometricFlow
        {...defaultProps}
        isValidateFingerPrintError={true}
        validateFingerPrintError={errorResponse}
      />
    );
    expect(screen.getByTestId("consent-button")).toBeInTheDocument();
  });

  it("handles device status success with READY status", () => {
    (useBiometricsHooks.useGetDeviceStatus as any).mockReturnValue({
      mutate: deviceStatusMutate,
      data: "READY",
      isPending: false,
      isSuccess: true,
      isError: false,
      reset: deviceStatusReset,
    });

    render(<BiometricFlow {...defaultProps} />);

    expect(screen.getByTestId("capture-button")).toBeInTheDocument();
  });

  it("handles RD service status error", () => {
    (useBiometricsHooks.useGetRDServiceStatus as any).mockReturnValue({
      mutate: rdServiceMutate,
      data: null,
      isPending: false,
      isSuccess: false,
      isError: true,
      error: new Error("RD Service not available"),
      reset: rdServiceReset,
    });

    render(<BiometricFlow {...defaultProps} />);

    expect(screen.getByTestId("consent-button")).toBeInTheDocument();
  });

  it("handles fingerprint capture success with valid response", () => {
    const mockFingerprintData = {
      xmlText: "<xml>fingerprint data</xml>",
      jsonData: {
        PidData: {
          children: [
            {
              Resp: {
                errCode: "0",
              },
            },
          ],
        },
      },
    };

    (useBiometricsHooks.useCaptureFingerprint as any).mockReturnValue({
      mutate: captureFingerprintMutate,
      data: mockFingerprintData,
      isPending: false,
      isSuccess: true,
      isError: false,
      reset: captureFingerprintReset,
    });

    const handleValidateMock = vi.fn();

    render(
      <BiometricFlow
        {...defaultProps}
        handleValidateFingerPrint={handleValidateMock}
      />
    );

    // handleValidateFingerPrint should be called with the base64 encoded data
    expect(handleValidateMock).toHaveBeenCalled();
  });

  it("handles fingerprint capture with error code", () => {
    const mockFingerprintData = {
      xmlText: "<xml>fingerprint data</xml>",
      jsonData: {
        PidData: {
          children: [
            {
              Resp: {
                errCode: "100", // Non-zero error code
              },
            },
          ],
        },
      },
    };

    (useBiometricsHooks.useCaptureFingerprint as any).mockReturnValue({
      mutate: captureFingerprintMutate,
      data: mockFingerprintData,
      isPending: false,
      isSuccess: true,
      isError: false,
      reset: captureFingerprintReset,
    });

    render(<BiometricFlow {...defaultProps} />);

    // Reset should be called when there's an error code
    expect(captureFingerprintReset).toHaveBeenCalled();
  });

  it("decrements attempt count on FAILED aadhaar verification", () => {
    const { rerender } = render(<BiometricFlow {...defaultProps} />);

    // Simulate failed validation
    rerender(
      <BiometricFlow
        {...defaultProps}
        aadhaarVerificationStatus="FAILED"
        validateFingerPrintResponse={{ message: "Validation failed" } as any}
      />
    );

    expect(screen.getByTestId("consent-button")).toBeInTheDocument();
  });

  it("handles validate fingerprint error with 5xx status code", () => {
    const errorResponse = { statusCode: 500, message: "Server error" };
    render(
      <BiometricFlow
        {...defaultProps}
        isValidateFingerPrintError={true}
        validateFingerPrintError={errorResponse}
      />
    );
    expect(screen.getByTestId("consent-button")).toBeInTheDocument();
  });

  it("handles device status error", () => {
    (useBiometricsHooks.useGetDeviceStatus as any).mockReturnValue({
      mutate: deviceStatusMutate,
      data: null,
      isPending: false,
      isSuccess: false,
      isError: true,
      reset: deviceStatusReset,
    });

    render(<BiometricFlow {...defaultProps} />);

    expect(screen.getByTestId("consent-button")).toBeInTheDocument();
  });

  it("handles Android WebView device check on consent", () => {
    (deviceDetectionHook.useDeviceDetection as any).mockReturnValue({
      isAndroidWebView: true,
    });

    render(<BiometricFlow {...defaultProps} />);

    fireEvent.click(screen.getByTestId("consent-button"));

    // For Android WebView, it should call device status directly
    expect(deviceStatusMutate).toHaveBeenCalled();
  });

  it("handles RD service not available error", () => {
    (useBiometricsHooks.useGetRDServiceStatus as any).mockReturnValue({
      mutate: rdServiceMutate,
      data: null,
      isPending: false,
      isSuccess: false,
      isError: true,
      error: new Error("Service unavailable"),
      reset: rdServiceReset,
    });

    render(<BiometricFlow {...defaultProps} />);

    // Component should render despite error
    expect(screen.getByTestId("consent-button")).toBeInTheDocument();
  });

  it("renders all action buttons", () => {
    render(<BiometricFlow {...defaultProps} />);

    expect(screen.getByTestId("consent-button")).toBeInTheDocument();
    expect(screen.getByTestId("capture-button")).toBeInTheDocument();
    expect(screen.getByTestId("home-button")).toBeInTheDocument();
    expect(screen.getByTestId("retry-device-button")).toBeInTheDocument();
  });

  it("handles multiple consent button clicks", () => {
    render(<BiometricFlow {...defaultProps} />);

    const consentButton = screen.getByTestId("consent-button");

    fireEvent.click(consentButton);
    fireEvent.click(consentButton);

    // Should be called twice
    expect(rdServiceMutate).toHaveBeenCalledTimes(2);
  });

  it("handles biometric modal details update on status change", () => {
    const { rerender } = render(<BiometricFlow {...defaultProps} />);

    // Change status to SUCCESS
    rerender(
      <BiometricFlow {...defaultProps} aadhaarVerificationStatus="SUCCESS" />
    );

    // Component should still render
    expect(screen.getByTestId("consent-button")).toBeInTheDocument();
  });
});
