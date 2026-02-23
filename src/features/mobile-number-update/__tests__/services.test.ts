import { describe, expect, it, vi } from "vitest";

import { MOBILE_NUMBER_ENDPOINTS } from "@/constants/endPoints";
import { POST } from "@/services/api.service";

import { biometricApiSuccess } from "../../re-kyc/mocks/biometricMocks";
import verifyNumberResponse from "../mocks/checkDuplicateNumber.json";
import checkStatusMockdata from "../mocks/checkStatusSuccess.json";
import fetchRecordsSuccess from "../mocks/fetchRecordsSuccess.json";
import getLinkMockData from "../mocks/generateLinkSuccess.json";
import searchCustomer from "../mocks/searchCustomerCIFsuccess.json";
import updateNumberMockData from "../mocks/updateNumberSuccess.json";
import * as services from "../services";

vi.mock("@/lib/utils", () => ({
  fetchFakeData: vi.fn((data) => Promise.resolve(data)),
}));

vi.mock("@/services/api.service", () => ({
  POST: vi.fn(),
}));

const mockPost = POST as unknown as ReturnType<typeof vi.fn>;

describe("mobile-number-update/services", () => {
  it("getCustomerSearchService returns searchCustomer mock", async () => {
    mockPost.mockResolvedValueOnce(searchCustomer);
    const response = await services.getCustomerSearchService({
      branchCode: "BR1234",
    });
    expect(mockPost).toHaveBeenCalledWith(
      MOBILE_NUMBER_ENDPOINTS.SEARCH_CUSTOMER,
      { branchCode: "BR1234" }
    );
    expect(response).toEqual(searchCustomer);
  });

  it("getVerifyNumberService returns mockData", async () => {
    mockPost.mockResolvedValueOnce(verifyNumberResponse);
    const response = await services.getVerifyNumberService({
      requestNumber: "BR1234",
      mobileNumber: "9090909090",
    });
    expect(mockPost).toHaveBeenCalledWith(
      MOBILE_NUMBER_ENDPOINTS.VERIFY_NUMBER,
      {
        requestNumber: "BR1234",
        mobileNumber: "9090909090",
      }
    );
    expect(response).toEqual(verifyNumberResponse);
  });

  it("getUpdateNumberService returns updateNumberMockData", async () => {
    const payload = {
      branchCode: "BR1234",
      customerID: "CUST0001",
      customerName: "Jane Smith",
      custUpdatedMobileNumber: "9876543210",
      requestNumber: "REQ1234567890",
      type: "MOBILE_UPDATE",
    };
    mockPost.mockResolvedValueOnce(updateNumberMockData);
    const response = await services.getUpdateNumberService(payload);
    expect(mockPost).toHaveBeenCalledWith(
      MOBILE_NUMBER_ENDPOINTS.UPDATE_NUMBER,
      payload
    );
    expect(response).toEqual(updateNumberMockData);
  });

  it("getFetchRecordsService returns fetchRecordsSuccess", async () => {
    const payload = {
      branchCode: "BR5678",
      customerID: "CIF0012345",
      employeeId: "EMP9876",
      employeeName: "Rahul Mehta",
    };

    mockPost.mockResolvedValueOnce(fetchRecordsSuccess);
    const response = await services.getRecordsService(payload);
    expect(mockPost).toHaveBeenCalledWith(
      MOBILE_NUMBER_ENDPOINTS.GET_CUSTOMER_RECORDS,
      payload
    );
    expect(response).toEqual(fetchRecordsSuccess);
  });

  it("getCheckStatusService returns checkStatusMockdata", async () => {
    const payload = {
      requestNumber: "REQ1234567890",
    };
    mockPost.mockResolvedValueOnce(checkStatusMockdata);
    const response = await services.getCheckStatusService(payload);
    expect(mockPost).toHaveBeenCalledWith(
      MOBILE_NUMBER_ENDPOINTS.CHECK_STATUS,
      payload
    );
    expect(response).toEqual(checkStatusMockdata);
  });

  it("getGenerateLinkService returns getLinkMockData", async () => {
    const payload = {
      channel: "WEB_PORTAL",
      mobileNumber: "9876543210",
      requestNumber: "REQ1234567890",
    };
    mockPost.mockResolvedValueOnce(getLinkMockData);
    const response = await services.getGenerateLinkService(payload);
    expect(mockPost).toHaveBeenCalledWith(
      MOBILE_NUMBER_ENDPOINTS.GENERATE_LINK,
      payload
    );
    expect(response).toEqual(getLinkMockData);
  });

  it("getBioMetricVerificationService returns biometricApiSuccess", async () => {
    const payload = {
      aadhaarNumber: "1234-5678-9012",
      rdServiceData:
        "<RDService><DeviceInfo><name>MockDevice</name></DeviceInfo></RDService>",
      requestNumber: "REQ1234567890",
    };
    mockPost.mockResolvedValueOnce(biometricApiSuccess);
    const response = await services.validateFingerprint(payload);
    expect(mockPost).toHaveBeenCalledWith(
      MOBILE_NUMBER_ENDPOINTS.BIOMETRIC_VERIFICATION,
      payload
    );
    expect(response).toEqual(biometricApiSuccess);
  });
});
