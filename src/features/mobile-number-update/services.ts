import ENDPOINTS from "@/constants/endPoints";
import { fetchFakeData } from "@/lib/utils";
import globalFailureMockData from "@/mocks/globalFailure.json";
import { POST } from "@/services/api.service";
import { ICommonSuccessResponse } from "@/types";

import { biometricApiSuccess } from "../re-kyc/mocks/biometricMocks";
import accountDormancy from "./mocks/accountDormancyError.json";
import mockData from "./mocks/checkDuplicateNumber.json";
import checkStatusMockdata from "./mocks/checkStatusSuccess.json";
import checkStatusFailureMockdata from "./mocks/checkStatusValidationError.json";
import fetchCheckpointFailure from "./mocks/fetchCheckpointFailure.json";
import fetchRecordsSuccess from "./mocks/fetchRecordsSuccess.json";
import getLinkMockData from "./mocks/generateLinkSuccess.json";
import verifyLinkFailureMockData from "./mocks/linkVerificationError.json";
import searchCustomer from "./mocks/searchCustomerCIFsuccess.json";
import updateNumberMockData from "./mocks/updateNumberSuccess.json";
import verifyLinkSuccessMockData from "./mocks/verifyLinkSuccess.json";
import {
  IBioMetricVerificationRequest,
  IGetCheckStatusRequest,
  IGetCheckStatusResponse,
  IGetCustomerSearchRequest,
  IGetCustomerSearchResponse,
  IGetGenerateLinkRequest,
  IGetGenerateLinkResponse,
  IGetRecordRequest,
  IGetRecordResponse,
  IGetUpdateNumberRequest,
  IGetUpdateNumberResponse,
  IGetVerifyLinkRequest,
  IGetVerifyLinkResponse,
  IGetVerifyNumberRequest,
  IGetVerifyNumberResponse,
} from "./types";

export const getCustomerSearchService =
  (): // payload: IGetCustomerSearchRequest
  Promise<IGetCustomerSearchResponse> => {
    // return POST<IGetCustomerSearchRequest, IGetCustomerSearchResponse>(
    //   ENDPOINTS.SEARCH_CUSTOMER,
    //   payload
    // );
    return fetchFakeData(searchCustomer);
  };

export const getVerifyNumberService = (): // payload: any
Promise<IGetVerifyNumberRequest> => {
  //   return POST<IGetVerifyNumberRequest, IGetVerifyNumberResponse>(
  //     ENDPOINTS.VERIFY_NUMBER,
  //     payload
  //   );
  return fetchFakeData(mockData);
};

export const getUpdateNumberService = (): // payload: any
Promise<IGetUpdateNumberRequest> => {
  // return POST<IGetUpdateNumberRequest, IGetUpdateNumberResponse>(
  //   ENDPOINTS.UPDATE_NUMBER,
  //   payload
  // );
  return fetchFakeData(updateNumberMockData);
};

export const getFetchRecordsService = (): // payload: any
Promise<IGetRecordRequest> => {
  //   return POST<IGetRecordRequest, IGetRecordResponse>(
  //     ENDPOINTS.GET_CUSTOMER_RECORDS,
  //     payload
  //   );
  return fetchFakeData(fetchRecordsSuccess);
};

export const getCheckStatusService = (): // payload: any
Promise<IGetCheckStatusRequest> => {
  // return POST<IGetCheckStatusRequest, IGetCheckStatusResponse>(
  //   ENDPOINTS.CHECK_STATUS,
  //   payload
  // );
  return fetchFakeData(checkStatusMockdata);
};

export const getGenerateLinkService = (): // payload: any
Promise<IGetGenerateLinkRequest> => {
  // return POST<IGetGenerateLinkRequest, IGetGenerateLinkResponse>(
  //   ENDPOINTS.GENERATE_LINK,
  //   payload
  // );
  return fetchFakeData(getLinkMockData);
};

export const getVerifyLinkService = (): // payload: any
Promise<IGetVerifyLinkRequest> => {
  // return POST<IGetVerifyLinkRequest, IGetVerifyLinkResponse>(
  //   ENDPOINTS.VERIFY_LINK,
  //   payload
  // );
  return fetchFakeData(verifyLinkFailureMockData);
};

export const getBioMetricVerificationService = (): // payload: any
Promise<IBioMetricVerificationRequest> => {
  // return POST<IBioMetricVerificationRequest, ICommonSuccessResponse>(
  //   ENDPOINTS.BIOMETRIC_VERIFICATION,
  //   payload
  // );
  return fetchFakeData(biometricApiSuccess);
};
