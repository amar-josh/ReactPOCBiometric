const API_BASE_V1 = "/rekyc-stp/api/v1/";

export const ENDPOINTS = Object.freeze({
  LOGIN: `${API_BASE_V1}/auth/login`,
  LOGOUT: `${API_BASE_V1}/auth/logout`,
  GENERATE_TOKEN: `${API_BASE_V1}/generate-token`,
  GET_INSTA_SERVICES: `${API_BASE_V1}/menus`,
  GET_CUSTOMER_SEARCH: `${API_BASE_V1}/search-customer`,
  GET_CUSTOMER_DETAILS: `${API_BASE_V1}/rekyc/get-customer-details`,
  GET_OTHER_DETAILS: `${API_BASE_V1}/metaData/otherDetails/default`,
  UPDATE_KYC: `${API_BASE_V1}/kyc-update`,
  VERIFY_CUSTOMER_BIOMETRIC: `${API_BASE_V1}/verify-customer-biometric`,
});

export const MOBILE_NUMBER_ENDPOINTS = Object.freeze({
  VERIFY_NUMBER: "/account/dedupe-check",
  UPDATE_NUMBER: "/update-account/",
  BIOMETRIC_VERIFICATION: "/aadhar/biom-verify",
  SEARCH_CUSTOMER: "/account/search-details",
  GET_CUSTOMER_RECORDS: "/account/fetch-records",
  CHECK_STATUS: "/verify/status-check",
  GENERATE_LINK: "/verify/generate-link",
  VERIFY_LINK: "/verify/verify-link",
});
