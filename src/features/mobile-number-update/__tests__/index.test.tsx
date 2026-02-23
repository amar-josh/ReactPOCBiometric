import { UseMutationResult } from "@tanstack/react-query";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import MobileNumberUpdate from "../index";

// Create mocks
const mockNavigate = vi.fn();

// Mock all hooks and components
// Mock react-router partially
vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("@/context/scroll-context", () => ({
  useScrollToContentTop: () => ({
    scrollToContentTop: vi.fn(),
  }),
}));

vi.mock("@/hooks/useAlertMessage", () => ({
  useAlertMessage: vi.fn(() => ({
    alertMessage: { type: "success", message: "" },
    setAlertMessage: vi.fn(),
  })),
}));

vi.mock("../adfs-login/hooks", () => ({
  useEmpInfo: vi.fn(() => ({
    branchCode: "10001",
    empId: "222222",
    empName: "VENDOR TESTING",
    department: "SOME_DEPARTMENT",
  })),
}));

// Create hook mocks as variables so we can update them
const mockCustomerSearch = vi.fn();
const mockUpdateNumber = vi.fn();
const mockValidateFingerprint = vi.fn();
const mockFetchRecords = vi.fn();

vi.mock("../hooks", () => ({
  useCustomerSearch: vi.fn(() => ({
    mutate: mockCustomerSearch,
    data: null,
    isSuccess: false,
    error: null,
    isError: false,
    isPending: false,
    reset: vi.fn(),
  })),
  useUpdateNumber: vi.fn(() => ({
    mutate: mockUpdateNumber,
    data: null,
    error: null,
    isSuccess: false,
    isError: false,
    isPending: false,
  })),
  useValidateFingerprint: vi.fn(() => ({
    mutate: mockValidateFingerprint,
    isPending: false,
    error: null,
    data: null,
    isError: false,
    reset: vi.fn(),
  })),
  useFetchRecords: vi.fn(() => ({
    data: null,
    mutate: mockFetchRecords,
    isPending: false,
    error: null,
    reset: vi.fn(),
    isError: false,
  })),
}));

// Update the CustomerSearch mock to properly handle the props
vi.mock("@/shared/customerSearch", () => ({
  __esModule: true,
  default: vi.fn(({ handleNext, handleShowCancelModal }) => (
    <div data-testid="customer-search">
      <button onClick={handleNext} data-testid="next-button">
        Next
      </button>
      <button onClick={handleShowCancelModal} data-testid="cancel-button">
        Cancel
      </button>
    </div>
  )),
}));

vi.mock("@/shared/biometric", () => ({
  __esModule: true,
  default: ({ onCancel, updateStep }: any) => (
    <div data-testid="biometric-flow">
      <button onClick={onCancel} data-testid="biometric-cancel">
        Cancel
      </button>
      <button onClick={updateStep} data-testid="biometric-next">
        Next
      </button>
    </div>
  ),
}));

vi.mock("../components/MobileStepper", () => ({
  __esModule: true,
  default: ({ currentStep }: any) => (
    <div data-testid="mobile-stepper">Mobile Stepper - Step {currentStep}</div>
  ),
}));

vi.mock("../components/UpdateDetails", () => ({
  __esModule: true,
  default: ({ updateStep, setNewMobileNumber }: any) => (
    <div data-testid="update-details">
      <button
        onClick={() => {
          setNewMobileNumber("9876543210");
          updateStep();
        }}
        data-testid="update-details-next"
      >
        Next
      </button>
    </div>
  ),
}));

vi.mock("@/components/common/Stepper", () => ({
  __esModule: true,
  default: ({ currentStep }: any) => (
    <div data-testid="desktop-stepper">
      Desktop Stepper - Step {currentStep}
    </div>
  ),
}));

vi.mock("@/components/common/FullScreenLoader", () => ({
  __esModule: true,
  default: () => <div data-testid="full-screen-loader">Loading...</div>,
}));

vi.mock("@/components/common/PageHeader", () => ({
  __esModule: true,
  default: ({ title }: any) => <h1 data-testid="page-header">{title}</h1>,
}));

vi.mock("@/components/ui/separator", () => ({
  Separator: () => <hr data-testid="separator" />,
}));

vi.mock("@/components/common/ResponseStatusComponent", () => ({
  __esModule: true,
  default: ({ isSuccess, backToHome }: any) => (
    <div data-testid="response-status">
      {isSuccess ? "Success" : "Error"}
      <button onClick={backToHome} data-testid="back-to-home">
        Back to Home
      </button>
    </div>
  ),
}));

vi.mock("@/components/common/AlertDialogComponent", () => ({
  __esModule: true,
  default: ({ open, onConfirm, confirmButtonText }: any) =>
    open ? (
      <div data-testid="alert-dialog">
        <button onClick={onConfirm} data-testid="alert-confirm">
          {confirmButtonText}
        </button>
      </div>
    ) : null,
}));

vi.mock("@/components/common/AbortJourneyConfirmationModal", () => ({
  __esModule: true,
  default: ({ open, onConfirm, onCancel }: any) =>
    open ? (
      <div data-testid="abort-modal">
        <button onClick={onConfirm} data-testid="confirm-abort">
          Confirm
        </button>
        <button onClick={onCancel} data-testid="cancel-abort">
          Cancel
        </button>
      </div>
    ) : null,
}));

// Mock assets
vi.mock("./../../assets/images/warning.svg", () => "warning-icon");
vi.mock("./../../assets/images/alert.svg", () => "alert-icon");

// Mock the utility
vi.mock("../utils", () => ({
  mobileNumberUpdateFailureCheckpoints: {
    SOME_CODE: {
      title: "Test Title",
      message: "Test Message",
    },
  },
}));

describe("MobileNumberUpdate", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Reset hook mocks to default
    mockCustomerSearch.mockClear();
    mockUpdateNumber.mockClear();
    mockValidateFingerprint.mockClear();
    mockFetchRecords.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <MobileNumberUpdate />
      </BrowserRouter>
    );
  };

  it("should render the component with initial step", () => {
    renderComponent();

    expect(screen.getByTestId("page-header")).toBeInTheDocument();
    expect(screen.getByTestId("separator")).toBeInTheDocument();
    expect(screen.getByTestId("desktop-stepper")).toBeInTheDocument();
    expect(screen.getByTestId("customer-search")).toBeInTheDocument();
  });

  it("should navigate to next step when customer search next button is clicked", async () => {
    // Setup mock implementation for this specific test
    mockFetchRecords.mockImplementation((_, options) => {
      options?.onSuccess?.({ data: {} });
    });

    renderComponent();

    fireEvent.click(screen.getByTestId("next-button"));

    await waitFor(() => {
      expect(screen.getByTestId("update-details")).toBeInTheDocument();
    });
  });

  it("should proceed to step 2 when update details next button is clicked", async () => {
    mockFetchRecords.mockImplementation((_, options) => {
      options?.onSuccess?.({ data: {} });
    });

    renderComponent();

    // First, go to step 1
    fireEvent.click(screen.getByTestId("next-button"));

    await waitFor(() => {
      expect(screen.getByTestId("update-details")).toBeInTheDocument();
    });

    // Then go to step 2
    fireEvent.click(screen.getByTestId("update-details-next"));

    await waitFor(() => {
      expect(screen.getByTestId("biometric-flow")).toBeInTheDocument();
    });
  });

  it("should proceed to step 3 when biometric flow next button is clicked", async () => {
    // Import the mocked hooks module to update its return value
    const hooksModule = await import("../hooks");

    // Mock fetch records to succeed
    mockFetchRecords.mockImplementation((_, options) => {
      options?.onSuccess?.({ data: {} });
    });

    // Update useUpdateNumber mock
    vi.mocked(hooksModule.useUpdateNumber).mockReturnValue({
      mutate: vi.fn(),
      data: {
        statusCode: 200,
        status: "SUCCESS",
        message: "Success message",
        data: {
          requestNumber: "REQ123",
          newMobileNumber: "9876543210",
          oldMobileNumber: "9876543211",
        },
      },
      error: null,
      isSuccess: true,
      isError: false,
      isPending: false,
    } as Partial<UseMutationResult<any, any, any, any>> as any);

    renderComponent();

    // Go to step 1
    fireEvent.click(screen.getByTestId("next-button"));

    await waitFor(() => {
      expect(screen.getByTestId("update-details")).toBeInTheDocument();
    });

    // Go to step 2
    fireEvent.click(screen.getByTestId("update-details-next"));

    await waitFor(() => {
      expect(screen.getByTestId("biometric-flow")).toBeInTheDocument();
    });

    // Go to step 3
    fireEvent.click(screen.getByTestId("biometric-next"));

    await waitFor(() => {
      expect(screen.getByTestId("response-status")).toBeInTheDocument();
    });
  });

  it("should show success response when mobile number update is successful", async () => {
    // Import the mocked hooks module
    const hooksModule = await import("../hooks");

    // Mock fetch records
    mockFetchRecords.mockImplementation((_, options) => {
      options?.onSuccess?.({ data: {} });
    });

    // Update useUpdateNumber mock
    vi.mocked(hooksModule.useUpdateNumber).mockReturnValue({
      mutate: vi.fn(),
      data: {
        statusCode: 200,
        status: "SUCCESS",
        message: "Success message",
        data: {
          requestNumber: "REQ123",
          newMobileNumber: "9876543210",
          oldMobileNumber: "9876543211",
        },
      },
      error: null,
      isSuccess: true,
      isError: false,
      isPending: false,
    } as Partial<UseMutationResult<any, any, any, any>> as any);

    renderComponent();

    // Navigate through all steps
    fireEvent.click(screen.getByTestId("next-button"));

    await waitFor(() => {
      expect(screen.getByTestId("update-details")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("update-details-next"));

    await waitFor(() => {
      expect(screen.getByTestId("biometric-flow")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("biometric-next"));

    await waitFor(() => {
      expect(screen.getByTestId("response-status")).toBeInTheDocument();
      expect(screen.getByText("Success")).toBeInTheDocument();
    });
  });

  it("should reset search when cancel is clicked", async () => {
    renderComponent();

    fireEvent.click(screen.getByTestId("cancel-button"));

    await waitFor(() => {
      expect(screen.getByTestId("customer-search")).toBeInTheDocument();
    });
  });

  it("should navigate to home when backToHome is clicked in success state", async () => {
    // Import the mocked hooks module
    const hooksModule = await import("../hooks");

    // Mock fetch records
    mockFetchRecords.mockImplementation((_, options) => {
      options?.onSuccess?.({ data: {} });
    });

    // Update useUpdateNumber mock
    vi.mocked(hooksModule.useUpdateNumber).mockReturnValue({
      mutate: vi.fn(),
      data: {
        statusCode: 200,
        status: "SUCCESS",
        message: "Success message",
        data: {
          requestNumber: "REQ123",
          newMobileNumber: "9876543210",
          oldMobileNumber: "9876543211",
        },
      },
      error: null,
      isSuccess: true,
      isError: false,
      isPending: false,
    } as Partial<UseMutationResult<any, any, any, any>> as any);

    renderComponent();

    // Navigate to success step
    fireEvent.click(screen.getByTestId("next-button"));

    await waitFor(() => {
      expect(screen.getByTestId("update-details")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("update-details-next"));

    await waitFor(() => {
      expect(screen.getByTestId("biometric-flow")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("biometric-next"));

    await waitFor(() => {
      expect(screen.getByTestId("response-status")).toBeInTheDocument();
    });

    // Click back to home
    fireEvent.click(screen.getByTestId("back-to-home"));

    expect(mockNavigate).toHaveBeenCalledWith("/home");
  });

  it("should show mobile stepper on mobile view", () => {
    // Mock window width for mobile view
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 500,
    });

    renderComponent();

    expect(screen.getByTestId("mobile-stepper")).toBeInTheDocument();
  });
});
