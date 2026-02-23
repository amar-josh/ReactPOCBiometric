import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import BiometricFlow from "@/shared/biometric";

// Mock component
vi.mock("@/shared/biometric/BiometricVerification", () => ({
  __esModule: true,
  default: ({
    handleConsentApproved,
    handleAadhaarConsentModal,
    handleBiometricModalAction,
    biometricDetails,
    onCancel,
    aadhaarNumber,
  }: any) => (
    <div data-testid="BiometricVerificationComponent">
      <button onClick={handleConsentApproved}>Consent Approved</button>
      <button onClick={handleAadhaarConsentModal}>Show Consent</button>
      <button onClick={onCancel}>Cancel</button>
      <button onClick={() => handleBiometricModalAction("home")}>Home</button>
      <button onClick={() => handleBiometricModalAction("capture")}>
        Capture
      </button>
      <button onClick={() => handleBiometricModalAction("retryDevice")}>
        Retry Device
      </button>
      <button onClick={() => handleBiometricModalAction("retryRDService")}>
        Retry RD
      </button>
      <button onClick={() => handleBiometricModalAction("close")}>Close</button>
      <div>{aadhaarNumber}</div>
      <div>{biometricDetails?.title}</div>
    </div>
  ),
}));

// Mocks for hooks
vi.mock("@/hooks/useDeviceDetection", () => ({
  useDeviceDetection: () => ({ isAndroidWebView: false }),
}));

vi.mock("@/hooks/useBiometrics", () => {
  const mocks = {
    getRDServiceStatusMutate: vi.fn(),
    getRDServiceStatusReset: vi.fn(),
    getDeviceStatusMutate: vi.fn(),
    getDeviceStatusReset: vi.fn(),
    captureFingerPrintMutate: vi.fn(),
    captureFingerPrintReset: vi.fn(),
  };
  return {
    useGetRDServiceStatus: () => ({
      mutate: mocks.getRDServiceStatusMutate,
      reset: mocks.getRDServiceStatusReset,
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: null,
    }),
    useGetDeviceStatus: () => ({
      mutate: mocks.getDeviceStatusMutate,
      reset: mocks.getDeviceStatusReset,
      isPending: false,
      isSuccess: false,
      isError: false,
      data: null,
    }),
    useCaptureFingerprint: () => ({
      mutate: mocks.captureFingerPrintMutate,
      reset: mocks.captureFingerPrintReset,
      isPending: false,
      isSuccess: false,
      isError: false,
      data: null,
    }),
    __mocks: mocks,
  };
});

describe("BiometricFlow", () => {
  const props = {
    onCancel: vi.fn(),
    updateStep: vi.fn(),
    aadhaarNumber: "123456789012",
    requestNumber: "REQ123",
    handleValidateFingerPrint: vi.fn(),
    handleUpdateJourney: vi.fn(),
    isValidateFingerPrintError: false,
    isValidateFingerPrintLoading: false,
    validateFingerPrintError: null,
    validateFingerPrintReset: vi.fn(),
    isValidateFingerPrintSuccess: false,
    validateFingerPrintResponse: undefined,
    aadhaarVerificationStatus: "success",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the BiometricVerificationComponent", async () => {
    render(
      <MemoryRouter>
        <BiometricFlow {...props} />
      </MemoryRouter>
    );

    expect(
      await screen.findByTestId("BiometricVerificationComponent")
    ).toBeInTheDocument();
    expect(screen.getByText("123456789012")).toBeInTheDocument();
  });

  it("calls onCancel when Cancel button is clicked", async () => {
    render(
      <MemoryRouter>
        <BiometricFlow {...props} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("Cancel"));
    expect(props.onCancel).toHaveBeenCalled();
  });

  it("calls handleConsentApproved and opens modal", async () => {
    render(
      <MemoryRouter>
        <BiometricFlow {...props} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("Consent Approved"));
    expect(
      await screen.findByTestId("BiometricVerificationComponent")
    ).toBeInTheDocument();
  });

  it("calls handleAadhaarConsentModal", async () => {
    render(
      <MemoryRouter>
        <BiometricFlow {...props} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("Show Consent"));
    expect(
      await screen.findByTestId("BiometricVerificationComponent")
    ).toBeInTheDocument();
  });

  it("calls onCancel via HOME action", async () => {
    render(
      <MemoryRouter>
        <BiometricFlow {...props} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("Home"));
    expect(props.onCancel).toHaveBeenCalled();
  });

  it("captures fingerprint on CAPTURE action", async () => {
    const biometrics = await import("@/hooks/useBiometrics");
    const __mocks = (biometrics as any).__mocks;
    render(
      <MemoryRouter>
        <BiometricFlow {...props} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("Capture"));
    expect(__mocks.captureFingerPrintMutate).toHaveBeenCalled();
  });

  it("retries device on RETRY_DEVICE action", async () => {
    const biometrics = await import("@/hooks/useBiometrics");
    const __mocks = (biometrics as any).__mocks;
    render(
      <MemoryRouter>
        <BiometricFlow {...props} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("Retry Device"));
    expect(__mocks.captureFingerPrintReset).toHaveBeenCalled();
    expect(__mocks.getDeviceStatusReset).toHaveBeenCalled();
    expect(__mocks.getDeviceStatusMutate).toHaveBeenCalled();
  });

  it("retries RD service on RETRY_RD action", async () => {
    const biometrics = await import("@/hooks/useBiometrics");
    const __mocks = (biometrics as any).__mocks;
    render(
      <MemoryRouter>
        <BiometricFlow {...props} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("Retry RD"));
    expect(__mocks.getRDServiceStatusReset).toHaveBeenCalled();
    expect(__mocks.getRDServiceStatusMutate).toHaveBeenCalled();
  });

  it("closes modal on CLOSE action and updates journey", async () => {
    render(
      <MemoryRouter>
        <BiometricFlow {...props} />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText("Close"));
    expect(props.updateStep).toHaveBeenCalled();
    expect(props.handleUpdateJourney).toHaveBeenCalled();
  });
});
