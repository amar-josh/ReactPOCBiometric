import { ENDPOINTS } from "@/constants/endPoints";
import {
  IGetCustomerDetailsRequest,
  IGetCustomerDetailsResponse,
  IGetCustomerSearchRequest,
  IGetCustomerSearchResponse,
  IOtherDetailsResponse,
  IUpdateKYCRequest,
  IUpdateKYCResponse,
} from "@/features/re-kyc/types";
import { fetchFakeData } from "@/lib/utils";
import {
  IValidateFingerPrintRequest,
  IValidateFingerPrintResponse,
} from "@/shared/biometric/types";

import { POST } from "../../services/api.service";
import customerDetails from "./mocks/customerDetails";
import reKYCDetails from "./mocks/reKYCDetails";

export const getCustomerSearchService = (
  payload: IGetCustomerSearchRequest
): any => {
  return fetchFakeData(customerDetails);
  return POST<IGetCustomerSearchRequest, IGetCustomerSearchResponse>(
    ENDPOINTS.GET_CUSTOMER_SEARCH,
    payload
  );
};

export const getCustomerDetailsService = (
  payload: IGetCustomerDetailsRequest
): any => {
  return fetchFakeData(reKYCDetails);
  return POST<IGetCustomerDetailsRequest, IGetCustomerDetailsResponse>(
    ENDPOINTS.GET_CUSTOMER_DETAILS,
    payload
  );
};

export const validateFingerprint = (
  payload: IValidateFingerPrintRequest
): Promise<IValidateFingerPrintResponse> => {
  return POST<IValidateFingerPrintRequest, IValidateFingerPrintResponse>(
    ENDPOINTS.VERIFY_CUSTOMER_BIOMETRIC,
    payload
  );
};

export const updateKYC = (
  payload: IUpdateKYCRequest
): Promise<IUpdateKYCResponse> => {
  return POST<IUpdateKYCRequest, IUpdateKYCResponse>(
    ENDPOINTS.UPDATE_KYC,
    payload
  );
};

export const getOtherDetailsDropdownService =
  (): Promise<IOtherDetailsResponse> => {
    return POST(ENDPOINTS.GET_OTHER_DETAILS);
  };
