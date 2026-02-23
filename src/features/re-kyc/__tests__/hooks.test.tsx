import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  useCustomerDetails,
  useCustomerSearch,
  useGetOtherDropdownDetails,
  useUpdateKYC,
  useValidateFingerprint,
} from "@/features/re-kyc/hooks/useRekyc";
import * as services from "@/features/re-kyc/services";
import { useCaptureFingerprint } from "@/hooks/useBiometrics";
import * as service from "@/services/biometricForWeb";

import otherDetailsMockData from "../mocks/otherDetails";
import reKYCDetailMockData from "../mocks/reKYCDetails";

const createWrapper = () => {
  const queryClient = new QueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

vi.mock("../services", () => ({
  getCustomerSearchService: vi.fn(),
  updateKYC: vi.fn(),
  captureFingerPrint: vi.fn(),
  validateFingerprint: vi.fn(),
  getCustomerDetailsService: vi.fn(),
  getOtherDetailsDropdownService: vi.fn(),
}));

// Add this at the top of your test file, before imports that use the hook
vi.mock("@/services/biometricForWeb", () => ({
  captureFingerPrint: vi.fn(),
  getBiometricDeviceStatus: vi.fn(),
  getRDServiceStatus: vi.fn(),
}));

describe("Re-KYC Custom Hooks", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("calls getCustomerSearchService via useCustomerSearch", async () => {
    const mockResponse = {
      customerId: "123",
      custDetails: {
        customerId: "123",
        customerName: "John Doe",
        mobileNumber: "9876543210",
        email: "john.doe@example.com",
        isIndividual: true,
      },
      accDetails: [],
    };
    (services.getCustomerSearchService as any).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useCustomerSearch(), {
      wrapper: createWrapper(),
    });

    const payload = { customerID: "123" };
    await act(() => result.current.mutateAsync(payload));

    await waitFor(() => expect(result.current.data).toEqual(mockResponse));
    expect(services.getCustomerSearchService).toHaveBeenCalledWith(payload);
  });

  it("calls updateKYC via useUpdateKYC", async () => {
    const mockResponse = {
      message: "KYC updated successfully",
      statusCode: 200,
      status: "success",
      timestamp: new Date().toISOString(),
      path: "/update-kyc",
      data: { requestNumber: "REQ123" },
    };
    (services.updateKYC as any).mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useUpdateKYC(), {
      wrapper: createWrapper(),
    });
    const mockReKYCRequest = {
      requestNumber: "REQ1234567890",
      makerDetails: {
        initiatedBy: "John Doe",
        empId: "EMP00123",
        empBranchCode: "BR1234",
      },
      isOtherDetailsChange: true,
      kycNoChange: false,
      rekycDetails: {
        customerName: "Jane Smith",
        aadhaarNumber: "1234-5678-9012",
        aadhaarRefNumber: "REF9876543210",
        customerID: "CUST0001",
        mobileNo: "9876543210",
        emailId: "jane.smith@example.com",
        permanentAddress: {
          addressLine1: "123 Main Street",
          addressLine2: "Apt 4B",
          addressLine3: "Apt 4B",
          landmark: "Near City Park",
          city: "Mumbai",
          district: "Mumbai",
          state: "Maharashtra",
          pinCode: 400001,
          country: "India",
        },
        communicationAddress: {
          addressLine1: "456 Secondary Street",
          addressLine2: "Suite 12",
          addressLine3: "Suite 12",
          landmark: "Opposite Mall",
          city: "Pune",
          district: "Pune",
          state: "Maharashtra",
          pinCode: 411001,
          country: "India",
        },
        aadhaarCommunicationAddress: {
          addressLine1: "789 Aadhaar Lane",
          addressLine2: "",
          addressLine3: "",
          landmark: "Near Government Office",
          city: "Nagpur",
          district: "Nagpur",
          state: "Maharashtra",
          pinCode: 440001,
          country: "India",
        },
        otherDetails: {
          occupation: 2,
          incomeRange: 3,
          residentType: 1,
        },
      },
      filteredAccountDetails: [{ accountId: "123", accountType: "ABC" }],
    };
    await act(() => result.current.mutateAsync(mockReKYCRequest));

    await waitFor(() => expect(result.current.data).toEqual(mockResponse));
    expect(services.updateKYC).toHaveBeenCalledWith(mockReKYCRequest);
  });

  // TODO -  undefined is not a spy or a call to a spy!
  // it("calls getDeviceStatus via useGetDeviceStatus and handles error", async () => {
  //   const error = new Error("Device not found");
  //   vi.spyOn(service, "getBiometricDeviceStatus").mockRejectedValue(error);

  //   const { result } = renderHook(() => useGetDeviceStatus(), {
  //     wrapper: createWrapper(),
  //   });

  //   result.current.mutate();

  //   await waitFor(() => {
  //     expect(service.getDeviceStatus).toHaveBeenCalled();
  //   });
  // });

  it("calls captureFingerPrint via useCaptureFingerprint", async () => {
    const mockResponse = { xml: "captured" };
    (service.captureFingerPrint as any).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useCaptureFingerprint(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync();
    });

    await waitFor(() => {
      expect(result.current.data).toEqual(mockResponse);
      expect(service.captureFingerPrint).toHaveBeenCalled();
    });
  });

  it("calls validateFingerprint via useValidateFingerprint", async () => {
    const mockAadhaarVerificationResponse = {
      message: "Aadhaar verification successful",
      statusCode: 200,
      status: "SUCCESS",
      data: {
        aadhaarVerification: "VERIFIED",
        requestNumber: "REQ1234567890",
        aadhaarAddress: {
          addressLine1: "789 Aadhaar Lane",
          addressLine2: "",
          addressLine3: "",
          landmark: "Near Government Office",
          city: "Nagpur",
          district: "Nagpur",
          state: "Maharashtra",
          pinCode: 440001,
          country: "India",
        },
      },
    };

    const mockAadhaarRequestPayload = {
      aadhaarNumber: "1234-5678-9012",
      rdServiceData: "<RDService><DeviceInfo>...</DeviceInfo></RDService>",
      requestNumber: "REQ1234567890",
      mobileNo: "9876543210",
    };

    (services.validateFingerprint as any).mockResolvedValue(
      mockAadhaarVerificationResponse
    );

    const { result } = renderHook(() => useValidateFingerprint(), {
      wrapper: createWrapper(),
    });

    await act(() => result.current.mutateAsync(mockAadhaarRequestPayload));

    await waitFor(() =>
      expect(result.current.data).toEqual(mockAadhaarVerificationResponse)
    );
    expect(services.validateFingerprint).toHaveBeenCalledWith(
      mockAadhaarRequestPayload
    );
  });

  it("calls getCustomerDetailsService via useCustomerDetails", async () => {
    (services.getCustomerDetailsService as any).mockResolvedValue(
      reKYCDetailMockData
    );

    const { result } = renderHook(() => useCustomerDetails(), {
      wrapper: createWrapper(),
    });

    const payload = {
      customerID: "adsfas",
      makerDetails: {
        initiatedBy: "John Doe",
        empId: "EMP00123",
        empBranchCode: "BR1234",
      },
    };
    await act(() => result.current.mutateAsync(payload));

    await waitFor(() =>
      expect(result.current.data).toEqual(reKYCDetailMockData)
    );
    expect(services.getCustomerDetailsService).toHaveBeenCalledWith(payload);
  });

  it("calls getOtherDetailsDropdownService via useGetOtherDropdownDetails", async () => {
    (services.getOtherDetailsDropdownService as any).mockResolvedValue(
      otherDetailsMockData
    );

    const { result } = renderHook(() => useGetOtherDropdownDetails(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync();
    });
    await waitFor(() =>
      expect(result.current.data).toEqual(otherDetailsMockData)
    );
    expect(services.getOtherDetailsDropdownService).toHaveBeenCalled();
  });
});
