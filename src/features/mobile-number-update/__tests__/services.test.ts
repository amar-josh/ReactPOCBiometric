import { describe, expect, it, vi } from "vitest";

import { biometricApiSuccess } from "../../re-kyc/mocks/biometricMocks";
import mockData from "../mocks/checkDuplicateNumber.json";
import checkStatusMockdata from "../mocks/checkStatusSuccess.json";
import fetchRecordsSuccess from "../mocks/fetchRecordsSuccess.json";
import getLinkMockData from "../mocks/generateLinkSuccess.json";
import verifyLinkFailureMockData from "../mocks/linkVerificationError.json";
import searchCustomer from "../mocks/searchCustomerCIFsuccess.json";
import updateNumberMockData from "../mocks/updateNumberSuccess.json";
import * as services from "../services";

vi.mock("@/lib/utils", () => ({
  fetchFakeData: vi.fn((data) => Promise.resolve(data)),
}));

describe("mobile-number-update/services", () => {
  it("getCustomerSearchService returns searchCustomer mock", async () => {
    const result = await services.getCustomerSearchService();
    expect(result).toEqual(searchCustomer);
  });

  it("getVerifyNumberService returns mockData", async () => {
    const result = await services.getVerifyNumberService();
    expect(result).toEqual(mockData);
  });

  it("getUpdateNumberService returns updateNumberMockData", async () => {
    const result = await services.getUpdateNumberService();
    expect(result).toEqual(updateNumberMockData);
  });

  it("getFetchRecordsService returns fetchRecordsSuccess", async () => {
    const result = await services.getFetchRecordsService();
    expect(result).toEqual(fetchRecordsSuccess);
  });

  it("getCheckStatusService returns checkStatusMockdata", async () => {
    const result = await services.getCheckStatusService();
    expect(result).toEqual(checkStatusMockdata);
  });

  it("getGenerateLinkService returns getLinkMockData", async () => {
    const result = await services.getGenerateLinkService();
    expect(result).toEqual(getLinkMockData);
  });

  it("getVerifyLinkService returns verifyLinkFailureMockData", async () => {
    const result = await services.getVerifyLinkService();
    expect(result).toEqual(verifyLinkFailureMockData);
  });

  it("getBioMetricVerificationService returns biometricApiSuccess", async () => {
    const result = await services.getBioMetricVerificationService();
    expect(result).toEqual(biometricApiSuccess);
  });
});
