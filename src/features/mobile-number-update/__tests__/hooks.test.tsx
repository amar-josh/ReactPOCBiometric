import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  useCheckStatus,
  useCustomerSearch,
  useFetchRecords,
  useGenerateLink,
  useUpdateNumber,
  useValidateFingerprint,
  useVerifyNumber,
} from "../hooks"; // adjust path as needed
import * as services from "../services"; // mocks come from this module

vi.mock("../services", () => ({
  getCustomerSearchService: vi.fn(),
  getVerifyNumberService: vi.fn(),
  getUpdateNumberService: vi.fn(),
  getRecordsService: vi.fn(),
  getCheckStatusService: vi.fn(),
  getGenerateLinkService: vi.fn(),
  getVerifyLinkService: vi.fn(),
  getBioMetricVerificationService: vi.fn(),
  validateFingerprint: vi.fn(),
}));
const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("Mobile number update Hooks", () => {
  it("should call getCustomerSearchService when useCustomerSearch is triggered", async () => {
    const mockGetCustomerSearchResponse = {
      statusCode: 200,
      status: "SUCCESS",
      message: "Customer search successful",
      data: [
        {
          custDetails: {
            customerId: "CUST0001",
            customerName: "Jane Smith",
            mobileNumber: "9876543210",
            email: "jane.smith@example.com",
            isIndividual: true,
          },
          accDetails: [
            {
              accountNumber: "ACC1234567890",
              productName: "Savings Account",
              isAccountDormant: false,
              accountOpenDate: "2015-06-15",
            },
            {
              accountNumber: "ACC0987654321",
              productName: "Fixed Deposit",
              isAccountDormant: true,
              accountOpenDate: "2020-01-01",
            },
          ],
        },
      ],
    };

    (services.getCustomerSearchService as any).mockResolvedValue(
      mockGetCustomerSearchResponse
    );

    const { result } = renderHook(() => useCustomerSearch(), { wrapper });

    const payload = {
      customerID: "CIF0012345",
      accountNumber: "1234567890",
      branchCode: "BR1234",
      employeeId: "EMP5678",
      employeeName: "Anita Sharma",
      mobileNumber: "9876543210",
    };

    await act(() => result.current.mutateAsync(payload));

    await waitFor(() =>
      expect(result.current.data).toEqual(mockGetCustomerSearchResponse)
    );
    expect(services.getCustomerSearchService).toHaveBeenCalledWith(payload);
  });

  it("should call getVerifyNumberService when useVerifyNumber is triggered", async () => {
    const mockGenericResponse = {
      statusCode: 200,
      status: "SUCCESS",
      message: "Operation completed successfully",
    };

    (services.getVerifyNumberService as any).mockResolvedValue(
      mockGenericResponse
    );

    const { result } = renderHook(() => useVerifyNumber(), { wrapper });

    const payload = {
      mobileNumber: "9876543210",
      requestNumber: "REQ1234567890",
    };

    await act(() => result.current.mutateAsync(payload));

    await waitFor(() =>
      expect(result.current.data).toEqual(mockGenericResponse)
    );
    expect(services.getVerifyNumberService).toHaveBeenCalledWith(payload);
  });

  it("should call getUpdateNumberService when useUpdateNumber is triggered", async () => {
    const mockUpdateNumberResponse = {
      statusCode: 200,
      status: "success",
      message: "ok",
      data: {
        oldMobileNumber: "9999999999",
        newMobileNumber: "9999999999",
        requestNumber: "9999999999",
      },
    };
    (services.getUpdateNumberService as any).mockResolvedValue(
      mockUpdateNumberResponse
    );

    const { result } = renderHook(() => useUpdateNumber(), { wrapper });

    const payload = {
      branchCode: "BR1001",
      customerID: "CUST7890",
      customerName: "Rajesh Kumar",
      custUpdatedMobileNumber: "9123456789",
      requestNumber: "REQ4567890123",
      type: "MOBILE_UPDATE",
    };

    await act(() => result.current.mutateAsync(payload));

    await waitFor(() =>
      expect(result.current.data).toEqual(mockUpdateNumberResponse)
    );
    expect(services.getUpdateNumberService).toHaveBeenCalledWith(payload);
  });

  it("should call getFetchRecordsService when useFetchRecords is triggered", async () => {
    const fetchRecordsResponse = {
      statusCode: 200,
      status: "success",
      message: "ok",
      data: {
        statusCode: 200,
        status: "success",
        message: "ok",
      },
    };
    (services.getRecordsService as any).mockResolvedValue(fetchRecordsResponse);

    const { result } = renderHook(() => useFetchRecords(), { wrapper });

    const payload = {
      branchCode: "BR2025",
      customerID: "CIF789654123",
      employeeId: "EMP4521",
      employeeName: "Sneha Rane",
    };

    await act(() => result.current.mutateAsync(payload));

    await waitFor(() =>
      expect(result.current.data).toEqual(fetchRecordsResponse)
    );
    expect(services.getRecordsService).toHaveBeenCalledWith(payload);
  });

  it("should call getCheckStatusService when useCheckStatus is triggered", async () => {
    const mockVerificationStatus = {
      statusCode: 200,
      status: "success",
      message: "ok",
      data: {
        id: "VERIF123456",
        requestNumber: "REQ1234567890",
        is_verified: true,
      },
    };
    (services.getCheckStatusService as any).mockResolvedValue(
      mockVerificationStatus
    );

    const { result } = renderHook(() => useCheckStatus(), { wrapper });

    const payload = { requestNumber: "REQ123" };

    await act(() => result.current.mutateAsync(payload));

    await waitFor(() =>
      expect(result.current.data).toEqual(mockVerificationStatus)
    );
    expect(services.getCheckStatusService).toHaveBeenCalledWith(payload);
  });

  it("should call getGenerateLinkService when useGenerateLink is triggered", async () => {
    const mockGenerateResponseData = {
      statusCode: 200,
      status: "success",
      message: "ok",
      data: {
        shortUrl: "https://short.ly/abc123",
        totalClicks: 42,
      },
    };

    (services.getGenerateLinkService as any).mockResolvedValue(
      mockGenerateResponseData
    );

    const { result } = renderHook(() => useGenerateLink(), { wrapper });

    const payload = {
      channel: "WEB_PORTAL",
      mobileNumber: "9876543210",
      requestNumber: "REQ1234567890",
    };

    await act(() => result.current.mutateAsync(payload));

    await waitFor(() =>
      expect(result.current.data).toEqual(mockGenerateResponseData)
    );
    expect(services.getGenerateLinkService).toHaveBeenCalledWith(payload);
  });

  it("should call getBioMetricVerificationService when useBioMetricVerification is triggered", async () => {
    const mockAadhaarVerificationResponse = {
      message: "Aadhaar verification successful",
      statusCode: 200,
      status: "SUCCESS",
      data: {
        aadhaarVerification: "VERIFIED",
        requestNumber: "REQ1234567890",
        aadhaarAddress: {
          addressLine1: "123 Aadhaar Nagar",
          addressLine2: "Sector 5",
          addressLine3: "sector5",
          landmark: "Near Post Office",
          city: "Pune",
          district: "Pune",
          state: "Maharashtra",
          pinCode: 411001,
          country: "India",
        },
      },
    };

    (services.validateFingerprint as any).mockResolvedValue(
      mockAadhaarVerificationResponse
    );

    const { result } = renderHook(() => useValidateFingerprint(), {
      wrapper,
    });

    const payload = {
      aadhaarNumber: "1234-5678-9012",
      rdServiceData:
        "<RDService><DeviceInfo><name>MockDevice</name></DeviceInfo></RDService>",
      requestNumber: "REQ1234567890",
    };

    await act(() => result.current.mutateAsync(payload));

    await waitFor(() =>
      expect(result.current.data).toEqual(mockAadhaarVerificationResponse)
    );
    expect(services.validateFingerprint).toHaveBeenCalledWith(payload);
  });
});
