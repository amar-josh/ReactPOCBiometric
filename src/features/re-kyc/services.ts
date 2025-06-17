import ENDPOINTS from "@/constants/endPoints";
import {
  addressUpdateFailure,
  addressUpdateSuccess,
  biometricApiFailure,
  biometricApiSuccess,
} from "@/features/re-kyc/mocks/biometricMocks";
import {
  IGetCustomerDetailsRequest,
  IGetCustomerDetailsResponse,
  IGetCustomerSearchRequest,
  IGetCustomerSearchResponse,
  IUpdateKYCRequest,
  IUpdateKYCResponse,
  IValidateFingerPrintRequest,
  IValidateFingerPrintResponse,
} from "@/features/re-kyc/types";
import { fetchFakeData } from "@/lib/utils";

import { POST } from "../../services/api.service";
import mockData from "./mocks/customerDetails.json";
import mockOtherDetailsData from "./mocks/otherDetails.json";
import mockReKYCData from "./mocks/reKYCDetails.json";
import mockSaveOtherDetailsData from "./mocks/saveOtherDetails.json";
export const getCustomerSearchService =
  (): // payload: IGetCustomerSearchRequest
  Promise<IGetCustomerSearchResponse> => {
    // return POST<IGetCustomerSearchRequest, IGetCustomerSearchResponse>(
    //   ENDPOINTS.GET_CUSTOMER_SEARCH,
    //   payload
    // );
    return fetchFakeData(mockData);
  };

export const getCustomerDetailsService =
  (): // payload: IGetCustomerDetailsRequest
  Promise<IGetCustomerDetailsResponse> => {
    // return POST<IGetCustomerDetailsRequest, IGetCustomerDetailsResponse>(
    // ENDPOINTS.GET_CUSTOMER_DETAILS,
    //   payload
    // );
    return fetchFakeData(mockReKYCData);
  };

export const validateFingerprint = (
  payload: IValidateFingerPrintRequest
): Promise<IValidateFingerPrintResponse> => {
  // return POST<IValidateFingerPrintRequest, IValidateFingerPrintResponse>(
  //   ENDPOINTS.VERIFY_CUSTOMER_BIOMETRIC, payload
  // )
  return fetchFakeData(biometricApiSuccess);
};

export const updateKYC = (
  payload: IUpdateKYCRequest
): Promise<IUpdateKYCResponse> => {
  // return POST<IUpdateKYCRequest, IUpdateKYCResponse>(
  //   ENDPOINTS.UPDATE_KYC,
  //   payload
  // );
  return fetchFakeData(addressUpdateFailure);
};

export const getOtherDetailsDropdownService = () =>
  // : Promise<IOtherDetailsResponse>
  {
    // return POST(ENDPOINTS.GET_OTHER_DETAILS);
    return fetchFakeData(mockOtherDetailsData);
  };
