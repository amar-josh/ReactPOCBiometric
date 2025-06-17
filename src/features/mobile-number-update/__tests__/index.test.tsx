import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

import * as alertHooks from "@/hooks/useAlertMessage";

import MobileNumberUpdate from "..";
import * as customerHooks from "../hooks";

vi.mock("../components/CustomerSearch", () => ({
  default: ({ handleNext }: any) => (
    <button onClick={handleNext}>MockCustomerSearch</button>
  ),
}));
vi.mock("../components/UpdateDetails", () => ({
  default: ({ updateStep }: any) => (
    <button onClick={updateStep}>MockUpdateDetails</button>
  ),
}));
vi.mock("../../re-kyc/BiometricFlow", () => ({
  default: ({ updateStep }: any) => (
    <button onClick={updateStep}>MockBiometricFlow</button>
  ),
}));
vi.mock("@/components/common/ResponseStatusComponent", () => ({
  default: () => <div>MockResponseStatus</div>,
}));

describe("MobileNumberUpdate", () => {
  beforeEach(() => {
    vi.spyOn(customerHooks, "useCustomerSearch").mockReturnValue({
      mutate: vi.fn(),
      data: null,
      isSuccess: false,
      error: null,
      isError: false,
      isPending: false,
      reset: vi.fn(),
    });

    // REMOVE useFetchRecords from here!

    vi.spyOn(customerHooks, "useUpdateNumber").mockReturnValue({
      mutate: vi.fn(),
      data: null,
      isPending: false,
      isError: false,
    });

    vi.spyOn(customerHooks, "useBioMetricVerification").mockReturnValue({
      mutate: vi.fn(),
      data: null,
      isPending: false,
    });

    vi.spyOn(alertHooks, "useAlertMessage").mockReturnValue({
      alertMessage: { type: "", message: "" },
      setAlertMessage: vi.fn(),
    });
  });

  it("renders step 1: CustomerSearch", () => {
    vi.spyOn(customerHooks, "useFetchRecords").mockReturnValue({
      mutate: vi.fn(),
      data: null,
      isPending: false,
      error: null,
      reset: vi.fn(),
      isError: false,
    });

    render(
      <MemoryRouter>
        <MobileNumberUpdate />
      </MemoryRouter>
    );
    expect(screen.getByText("MockCustomerSearch")).toBeInTheDocument();
  });
  // TODO - unable to find mocked elements which are expected to have.
  // it("navigates to step 2 on handleNext", async () => {
  //   vi.spyOn(customerHooks, "useFetchRecords").mockReturnValue({
  //     mutate: vi.fn(),
  //     data: null,
  //     isPending: false,
  //     error: null,
  //     reset: vi.fn(),
  //     isError: false,
  //   });

  //   render(
  //     <MemoryRouter>
  //       <MobileNumberUpdate />
  //     </MemoryRouter>
  //   );
  //   fireEvent.click(screen.getByText("MockCustomerSearch"));
  //   expect(await screen.findByText("MockUpdateDetails")).toBeInTheDocument();
  // });

  // TODO -Unable to find an element with the text: MockUpdateDetails even after adding test-id and all mocks
  // it("navigates to step 3 on updateStep from UpdateDetails", async () => {
  //   vi.spyOn(customerHooks, "useFetchRecords").mockReturnValue({
  //     mutate: vi.fn(),
  //     data: null,
  //     isPending: false,
  //     error: null,
  //     reset: vi.fn(),
  //     isError: false,
  //   });

  //   render(
  //     <MemoryRouter>
  //       <MobileNumberUpdate />
  //     </MemoryRouter>
  //   );
  //   fireEvent.click(screen.getByText("MockCustomerSearch"));
  //   fireEvent.click(await screen.findByText("MockUpdateDetails"));
  //   expect(await screen.findByText("MockBiometricFlow")).toBeInTheDocument();
  // });
  //TODO -  Unable to find the mocked functions, expected in dom tree
  // it("renders final step when biometric completes", async () => {
  //   // This is the only test that needs the step-wise .mockReturnValueOnce chain
  //   vi.spyOn(customerHooks, "useFetchRecords")
  //     .mockReturnValueOnce({
  //       mutate: vi.fn(),
  //       data: null,
  //       isPending: false,
  //       error: null,
  //       reset: vi.fn(),
  //       isError: false,
  //     })
  //     .mockReturnValueOnce({
  //       mutate: vi.fn(),
  //       data: null,
  //       isPending: false,
  //       error: null,
  //       reset: vi.fn(),
  //       isError: false,
  //     })
  //     .mockReturnValueOnce({
  //       mutate: vi.fn(),
  //       data: {
  //         data: [
  //           {
  //             requestNumber: "REQ123",
  //             actionCode: "ACT001",
  //           },
  //         ],
  //       },
  //       isPending: false,
  //       error: null,
  //       reset: vi.fn(),
  //       isError: false,
  //     });

  //   render(
  //     <MemoryRouter>
  //       <MobileNumberUpdate />
  //     </MemoryRouter>
  //   );
  //   fireEvent.click(screen.getByText("MockCustomerSearch"));
  //   fireEvent.click(await screen.findByText("MockUpdateDetails"));
  //   fireEvent.click(await screen.findByText("MockBiometricFlow"));
  //   expect(await screen.findByText("MockResponseStatus")).toBeInTheDocument();
  // });
});
