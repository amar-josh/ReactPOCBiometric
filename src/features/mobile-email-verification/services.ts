import { MOBILE_EMAIL_VERIFICATION_ENDPOINTS } from "@/constants/endPoints";
import { POST } from "@/services/api.service";

import {
  IGenerateVerificationLinkRequest,
  IGenerateVerificationLinkResponse,
  ISearchDetailsRequest,
  ISearchDetailsResponse,
} from "./types";

export const getSearchDetailsService = (
  payload: ISearchDetailsRequest
): Promise<ISearchDetailsResponse> => {
  return POST<ISearchDetailsRequest, ISearchDetailsResponse>(
    MOBILE_EMAIL_VERIFICATION_ENDPOINTS.SEARCH_DETAILS,
    payload
  );
};

export const generateLinkService = (
  payload: IGenerateVerificationLinkRequest
): Promise<IGenerateVerificationLinkResponse> => {
  return POST<
    IGenerateVerificationLinkRequest,
    IGenerateVerificationLinkResponse
  >(MOBILE_EMAIL_VERIFICATION_ENDPOINTS.GENERATE_LINK, payload);
};
