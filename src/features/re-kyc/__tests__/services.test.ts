import axios from "axios";
import { convertXML } from "simple-xml-to-json";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ENDPOINTS } from "@/constants/endPoints";
import searchCustomerMockData from "@/features/mobile-number-update/mocks/searchCustomerCIFsuccess.json";
import {
  addressUpdateSuccess,
  biometricApiSuccess,
} from "@/features/re-kyc/mocks/biometricMocks";
import { POST } from "@/services/api.service";
import {
  captureFingerPrint,
  getBiometricDeviceStatus,
  getRDServiceStatus,
} from "@/services/biometricForWeb";

import otherDetailsMockData from "../mocks/otherDetails";
import mockReKYCData from "../mocks/reKYCDetails";
import * as services from "../services";

vi.mock("axios");
vi.mock("simple-xml-to-json", () => ({
  convertXML: vi.fn(),
}));

vi.mock("@/services/api.service", () => ({
  POST: vi.fn(),
}));

const mockPost = POST as unknown as ReturnType<typeof vi.fn>;

describe("Biometric Services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getRDServiceStatus", () => {
    it("should find RDService and return true", async () => {
      (axios as any).mockResolvedValue({
        data: "<RDService status='READY' info='IDEMIA_L1_RDSERVICE'/>",
      });
      (convertXML as any).mockReturnValue({
        RDService: { status: "READY", info: "IDEMIA_L1_RDSERVICE" },
      });

      const result = await getRDServiceStatus();
      expect(result).toBe(true);
    });

    it("should throw error if RDService not found", async () => {
      (axios as any).mockRejectedValue(new Error("Not found"));

      await expect(getRDServiceStatus()).rejects.toThrow(
        "RD Service not found"
      );
    });
  });

  describe("getBiometricDeviceStatus", () => {
    it("should return error if device check fails", async () => {
      const error = new Error("Failed");
      (axios as any).mockRejectedValue(error);

      const result = await getBiometricDeviceStatus();
      expect(result).toBe(error);
    });
  });

  describe("captureFingerPrint", () => {
    it("should return parsed JSON and raw XML", async () => {
      const mockXML = "<Capture><Status>Success</Status></Capture>";
      const mockParsed = { Capture: { Status: "Success" } };

      (axios as any).mockResolvedValue({ data: mockXML });
      (convertXML as any).mockReturnValue(mockParsed);

      const result = await captureFingerPrint();

      expect(result).toEqual({
        jsonData: mockParsed,
        xmlText: mockXML,
      });
    });

    it("should return error if axios fails", async () => {
      const error = new Error("Failed");
      (axios as any).mockRejectedValue(error);

      const result = await captureFingerPrint();
      expect(result).toBe(error);
    });
  });

  describe("validateFingerprint", () => {
    it("should return biometricApiSuccess", async () => {
      const payload = {
        aadhaarNumber: "123123123123",
        rdServiceData: "asdfasdf",
        requestNumber: "12312321",
      };
      mockPost.mockResolvedValueOnce(biometricApiSuccess);
      const response = await services.validateFingerprint(payload);
      expect(mockPost).toHaveBeenCalledWith(
        ENDPOINTS.VERIFY_CUSTOMER_BIOMETRIC,
        payload
      );
      expect(response).toEqual(biometricApiSuccess);
    });
  });

  it("getCustomerDetailsService", async () => {
    const payload = {
      customerID: "BR1234",
      makerDetails: {
        initiatedBy: "John Doe",
        empId: "EMP00123",
        empBranchCode: "BR1234",
      },
    };
    mockPost.mockResolvedValueOnce(mockReKYCData);
    const response = await services.getCustomerDetailsService(payload);
    expect(mockPost).toHaveBeenCalledWith(
      ENDPOINTS.GET_CUSTOMER_DETAILS,
      payload
    );
    expect(response).toEqual(mockReKYCData);
  });

  it("updateKYC", async () => {
    const payload = {
      requestNumber: "REQ123456789",
      makerDetails: {
        initiatedBy: "John Doe",
        empId: "EMP00123",
        empBranchCode: "BR001",
      },
      isOtherDetailsChange: true,
      kycNoChange: false,
      rekycDetails: {
        customerName: "Alice Sharma",
        aadhaarNumber: "1234-5678-9012",
        aadhaarRefNumber: "REF987654321",
        customerID: "CUST000123",
        mobileNo: "9876543210",
        emailId: "alice.sharma@example.com",
        permanentAddress: {
          addressLine1: "123 Main Street",
          addressLine2: "Near City Park",
          addressLine3: "Near City Park",
          landmark: "Opp. Police Station",
          pinCode: 400001,
          country: "India",
          state: "Maharashtra",
          district: "Mumbai",
          city: "Mumbai",
        },
        communicationAddress: {
          addressLine1: "Flat 5B, Ocean View",
          addressLine2: "Linking Road",
          addressLine3: "Linking Road",
          landmark: "Next to ABC Mall",
          pinCode: 400050,
          country: "India",
          state: "Maharashtra",
          district: "Mumbai Suburban",
          city: "Bandra",
        },
        aadhaarCommunicationAddress: {
          addressLine1: "Unit 12, Sky Tower",
          addressLine2: "MG Road",
          addressLine3: "MG Road",
          landmark: "Near Central Plaza",
          pinCode: 400054,
          country: "India",
          state: "Maharashtra",
          district: "Mumbai Suburban",
          city: "Andheri",
        },
        otherDetails: {
          occupation: 3,
          incomeRange: 2,
          residentType: 1,
        },
      },
      filteredAccountDetails: [
        {
          accountId: "1231",
          accountType: "abc",
        },
      ],
    };

    mockPost.mockResolvedValueOnce(addressUpdateSuccess);
    const response = await services.updateKYC(payload);
    expect(mockPost).toHaveBeenCalledWith(ENDPOINTS.UPDATE_KYC, payload);
    expect(response).toEqual(addressUpdateSuccess);
  });

  it("getOtherDetailsDropdownService", async () => {
    mockPost.mockResolvedValueOnce(otherDetailsMockData);
    const response = await services.getOtherDetailsDropdownService();
    expect(mockPost).toHaveBeenCalledWith(ENDPOINTS.GET_OTHER_DETAILS);
    expect(response).toEqual(otherDetailsMockData);
  });

  it("getCustomerSearchService", async () => {
    const payload = {
      customerID: "123123213",
    };
    mockPost.mockResolvedValueOnce(searchCustomerMockData);
    const response = await services.getCustomerSearchService(payload);
    expect(mockPost).toHaveBeenCalledWith(
      ENDPOINTS.GET_CUSTOMER_SEARCH,
      payload
    );
    expect(response).toEqual(searchCustomerMockData);
  });
});
