import { render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ReKYC from "..";

// ✅ Mocks
const mockNavigate = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("../components/CustomerSearch", () => ({
  default: () => <div data-testid="CustomerSearch">Mock CustomerSearch</div>,
}));
vi.mock("../components/ReKYCDetails", () => ({
  default: () => <div data-testid="ReKYCDetails">Mock ReKYCDetails</div>,
}));
vi.mock("../BiometricFlow", () => ({
  default: () => <div data-testid="BiometricFlow">Mock BiometricFlow</div>,
}));
vi.mock("../components/AddressUpdateCard", () => ({
  default: () => (
    <div data-testid="AddressUpdateCard">Mock AddressUpdateCard</div>
  ),
}));
vi.mock("@/components/common/ResponseStatusComponent", () => ({
  default: () => (
    <div data-testid="ResponseStatusComponent">
      Mock ResponseStatusComponent
    </div>
  ),
}));
vi.mock("@/components/common/FullScreenLoader", () => ({
  default: () => <div data-testid="FullScreenLoader" />,
}));
vi.mock("@/components/ui/separator", () => ({
  Separator: () => <hr data-testid="Separator" />,
}));

// ✅ Mock hooks
vi.mock("../hooks", async () => {
  const actual = await vi.importActual("../hooks");
  return {
    ...actual,
    useCustomerSearch: () => ({
      mutate: vi.fn(),
      data: null,
      isSuccess: false,
      error: null,
      isError: false,
      isPending: false,
      reset: vi.fn(),
    }),
    useCustomerDetails: () => ({
      mutate: vi.fn(),
      data: null,
      reset: vi.fn(),
      error: null,
      isError: false,
      isPending: false,
    }),
    useValidateFingerprint: () => ({
      mutate: vi.fn(),
      isPending: false,
      data: null,
      error: null,
      isError: false,
    }),
    useUpdateKYC: () => ({
      mutate: vi.fn(),
      isSuccess: false,
      isPending: false,
      data: null,
      error: null,
      isError: false,
    }),
  };
});

describe.skip("ReKYC", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders CustomerSearch by default (step 1)", () => {
    render(<ReKYC />);
    expect(screen.getByTestId("CustomerSearch")).toBeInTheDocument();
  });

  it("calls navigate when flow completes successfully and user presses done", () => {
    const useStateMock = vi.spyOn(require("react"), "useState");
    useStateMock
      .mockImplementationOnce(() => [4, vi.fn()]) // currentStep
      .mockImplementationOnce(() => [false, vi.fn()]) // isWithAddressUpdate
      .mockImplementationOnce(() => [
        { status: "success", message: "Updated" },
        vi.fn(),
      ]) // cardDetails
      .mockImplementation((initial) => [initial, vi.fn()]);

    render(<ReKYC />);
  });
});
