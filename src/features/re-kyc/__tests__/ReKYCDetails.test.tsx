import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mocks
vi.mock("@/components/common/FullScreenLoader", () => ({
  default: () => <div data-testid="loader" />,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock("@/hooks/reKyc.hooks", () => ({
  useGetOccupation: () => ({
    mutate: vi.fn(),
    data: { data: { occupation: [{ name: "Salaried", code: 1 }] } },
  }),
  useGetResidenceType: () => ({
    mutate: vi.fn(),
    data: { data: { residentType: [{ name: "Owned", code: 2 }] } },
  }),
  useSaveOtherDetails: () => ({
    mutate: vi.fn(),
    isPending: false,
    isError: false,
    error: null,
  }),
}));

vi.mock("@/components/reKyc/ReKYCDetailsForm", () => ({
  default: () => <div data-testid="rekyc-form" />,
}));

vi.mock("@/components/reKyc/OtherDetailsForm", () => ({
  default: () => <div data-testid="other-details-form" />,
}));

// ReKYCDetails.test.tsx or in a setup file

vi.mock("@/components/ui/form", async () => {
  const actual = await vi.importActual<any>("@/components/ui/form");
  const { useForm, FormProvider } = await import("react-hook-form");

  return {
    ...actual,
    Form: ({ children }: any) => {
      const methods = useForm(); // Optionally pass defaultValues: useForm({ defaultValues: {} })
      return <FormProvider {...methods}>{children}</FormProvider>;
    },
  };
});

import ReKYCDetails from "../components/ReKYCDetails";

// TODO - need to update the testcases
describe("ReKYCDetails Component", () => {
  const mockProps = {
    reKYCDetails: {
      rekycDetails: {
        customerName: "John Doe",
        aadhaarNumber: "123412341234",
        aadhaarRefNumber: "REF123456",
        customerID: "CUST123456",
        dob: "1990-01-01",
        gender: "Male",
        mobileNumber: "9876543210",
        email: "john.doe@example.com",
        permanentAddress: {
          addressLine1: "Line1",
          addressLine2: "Line2",
          addressLine3: "Line3",
          city: "City",
          state: "State",
          country: "Country",
          pincode: 123456,
        },
        communicationAddress: {
          addressLine1: "CLine1",
          addressLine2: "CLine2",
          addressLine3: "Line3",
          city: "CCity",
          state: "CState",
          country: "CCountry",
          pincode: 654321,
        },
        accountNumber: 123456,
        mobileNo: "9876543210",
        emailId: "john.doe@example.com",
        nameOfOVD: "Passport",
      },
      otherDetails: {
        occupation: 1,
        residentType: 2,
        incomeRange: 500000,
      },
      requestNumber: "REQ123456",
      metaData: {
        noChangeEnabled: true,
        updateAddressEnabled: true,
        message: "",
      },
    },
    setIsWithAddressUpdate: vi.fn(),
    setIsProceedWithAadhaarOpen: vi.fn(),
    setOtherDetails: vi.fn(),
    setRequestNumber: vi.fn(),
    cif: "1234567890",
    handleContinueToEsign: vi.fn(),
    handleUpdateCommunicationAddress: vi.fn(),
    setIsOtherDetailsChange: vi.fn(),
  };

  it("should render the component and subcomponents", () => {
    render(<ReKYCDetails {...mockProps} />);
    expect(screen.getByTestId("rekyc-form")).toBeInTheDocument();
    expect(screen.getByTestId("other-details-form")).toBeInTheDocument();
    expect(screen.getByText("button.noChangeInKyc")).toBeInTheDocument();
    expect(
      screen.getByText("button.updateCommunicationAddress")
    ).toBeInTheDocument();
    expect(screen.getByText("button.cancel")).toBeInTheDocument();
  });

  it("should trigger setIsWithAddressUpdate(false) on 'No Change' click", async () => {
    render(<ReKYCDetails {...mockProps} />);
    const noChangeBtn = screen.getByText("button.noChangeInKyc");
    fireEvent.click(noChangeBtn);

    await waitFor(() => {
      expect(mockProps.setIsWithAddressUpdate).toHaveBeenCalledWith(false);
    });
  });

  it("should trigger setIsWithAddressUpdate(true) on 'Update Address' click", async () => {
    render(<ReKYCDetails {...mockProps} />);
    const updateBtn = screen.getByText("button.updateCommunicationAddress");
    fireEvent.click(updateBtn);

    await waitFor(() => {
      expect(mockProps.setIsWithAddressUpdate).toHaveBeenCalledWith(true);
    });
  });

  it("should not show loader by default", () => {
    render(<ReKYCDetails {...mockProps} />);
    expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
  });

  // You can add more tests for form submit, but they depend on form interaction or exposing form submit handler externally.
});
