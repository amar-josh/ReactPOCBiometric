const API_BASE_RE_KYC = "/rekyc-stp/api/v1";
const API_BASE_MOBILE_NUMBER = "/mobile-update";
const API_BASE_MOBILE_EMAIL_VERIFICATION = "/verification-service/verify/v1";

export const ENDPOINTS = Object.freeze({
  LOGIN: `${API_BASE_RE_KYC}/login/ldap`,
  LOGOUT: `${API_BASE_RE_KYC}/auth/logout`,
  GENERATE_TOKEN: `${API_BASE_RE_KYC}/generate-token`,
  ADFS_LOGIN: "/auth-service/login/adfs",
  GET_INSTA_SERVICES: `${API_BASE_RE_KYC}/menus`,
  GET_CUSTOMER_SEARCH: `${API_BASE_RE_KYC}/search-customer`,
  GET_CUSTOMER_DETAILS: `${API_BASE_RE_KYC}/get-customer-details`,
  GET_OTHER_DETAILS: `${API_BASE_RE_KYC}/metaData/otherDetails/default`,
  UPDATE_KYC: `${API_BASE_RE_KYC}/kyc-update`,
  VERIFY_CUSTOMER_BIOMETRIC: `${API_BASE_RE_KYC}/verify-customer-biometric`,
  CONFIG: `${API_BASE_RE_KYC}/config`,
});

export const MOBILE_NUMBER_ENDPOINTS = Object.freeze({
  VERIFY_NUMBER: `${API_BASE_MOBILE_NUMBER}/account/dedupe-check`,
  UPDATE_NUMBER: `${API_BASE_MOBILE_NUMBER}/update-account/`,
  BIOMETRIC_VERIFICATION: `${API_BASE_MOBILE_NUMBER}/aadhar/biom-verify`,
  SEARCH_CUSTOMER: `${API_BASE_MOBILE_NUMBER}/account/search-details`,
  GET_CUSTOMER_RECORDS: `${API_BASE_MOBILE_NUMBER}/account/fetch-records`,
  CHECK_STATUS: `${API_BASE_MOBILE_NUMBER}/verify/status-check`,
  GENERATE_LINK: `${API_BASE_MOBILE_NUMBER}/verify/generate-link`,
  VERIFY_LINK: `${API_BASE_MOBILE_NUMBER}/verify/verify-link`,
});

export const MOBILE_EMAIL_VERIFICATION_ENDPOINTS = Object.freeze({
  SEARCH_DETAILS: `${API_BASE_MOBILE_EMAIL_VERIFICATION}/search-details`,
  GENERATE_LINK: `${API_BASE_MOBILE_EMAIL_VERIFICATION}/generate-link`,
});
