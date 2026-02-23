import { MOBILE_NUMBER_ENDPOINTS } from "@/constants/endPoints";
import { POST } from "@/services/api.service";
import {
  IValidateFingerPrintRequest,
  IValidateFingerPrintResponse,
} from "@/shared/biometric/types";

import {
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
  IGetVerifyNumberRequest,
  IGetVerifyNumberResponse,
} from "./types";

export const getCustomerSearchService = (
  payload: IGetCustomerSearchRequest
): Promise<IGetCustomerSearchResponse> => {
  return POST<IGetCustomerSearchRequest, IGetCustomerSearchResponse>(
    MOBILE_NUMBER_ENDPOINTS.SEARCH_CUSTOMER,
    payload
  );
};

export const getVerifyNumberService = (
  payload: IGetVerifyNumberRequest
): Promise<IGetVerifyNumberResponse> => {
  return POST<IGetVerifyNumberRequest, IGetVerifyNumberResponse>(
    MOBILE_NUMBER_ENDPOINTS.VERIFY_NUMBER,
    payload
  );
};

export const getUpdateNumberService = (
  payload: IGetUpdateNumberRequest
): Promise<IGetUpdateNumberResponse> => {
  return POST<IGetUpdateNumberRequest, IGetUpdateNumberResponse>(
    MOBILE_NUMBER_ENDPOINTS.UPDATE_NUMBER,
    payload
  );
};

export const getRecordsService = (
  payload: IGetRecordRequest
): Promise<IGetRecordResponse> => {
  return POST<IGetRecordRequest, IGetRecordResponse>(
    MOBILE_NUMBER_ENDPOINTS.GET_CUSTOMER_RECORDS,
    payload
  );
};

export const getCheckStatusService = (
  payload: IGetCheckStatusRequest
): Promise<IGetCheckStatusResponse> => {
  return POST<IGetCheckStatusRequest, IGetCheckStatusResponse>(
    MOBILE_NUMBER_ENDPOINTS.CHECK_STATUS,
    payload
  );
};

export const getGenerateLinkService = (
  payload: IGetGenerateLinkRequest
): Promise<IGetGenerateLinkResponse> => {
  return POST<IGetGenerateLinkRequest, IGetGenerateLinkResponse>(
    MOBILE_NUMBER_ENDPOINTS.GENERATE_LINK,
    payload
  );
};

export const validateFingerprint = (
  payload: IValidateFingerPrintRequest
): Promise<IValidateFingerPrintResponse> => {
  return POST<IValidateFingerPrintRequest, IValidateFingerPrintResponse>(
    MOBILE_NUMBER_ENDPOINTS.BIOMETRIC_VERIFICATION,
    payload
  );
};
