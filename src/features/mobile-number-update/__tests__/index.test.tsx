import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as alertHooks from "@/hooks/useAlertMessage";

import MobileNumberUpdate from "..";

// ✅ Mocks
vi.mock("../components/CustomerSearch", () => ({
  default: ({ handleNext }: { handleNext: () => void }) => (
    <button onClick={handleNext}>MockCustomerSearch</button>
  ),
}));
vi.mock("../components/UpdateDetails", () => ({
  default: ({ updateStep }: { updateStep: () => void }) => (
    <button onClick={updateStep}>MockUpdateDetails</button>
  ),
}));
vi.mock("../../re-kyc/BiometricFlow", () => ({
  default: ({ updateStep }: { updateStep: () => void }) => (
    <button onClick={updateStep}>MockBiometricFlow</button>
  ),
}));
vi.mock("@/components/common/ResponseStatusComponent", () => ({
  default: () => <div>MockResponseStatus</div>,
}));

// ✅ Utility render with react-query provider
const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
};

describe("MobileNumberUpdate", () => {
  beforeEach(() => {
    vi.spyOn(alertHooks, "useAlertMessage").mockReturnValue({
      alertMessage: { type: "success", message: "" },
      setAlertMessage: vi.fn(),
    });
  });

  it("renders step 1: CustomerSearch", () => {
    renderWithProviders(<MobileNumberUpdate />);
    expect(screen.getByText("MockCustomerSearch")).toBeInTheDocument();
  });
});
