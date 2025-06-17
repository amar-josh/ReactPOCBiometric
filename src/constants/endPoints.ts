// This file contains the endpoints for the API
const ENDPOINTS = Object.freeze({
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  GET_USER_PROFILE: "/user/profile",
  GET_INSTA_SERVICES: "/menus",
  GET_CUSTOMER_SEARCH: "/search-customer",
  GET_CUSTOMER_DETAILS: "/reKyc/get-customer-details",
  GET_OTHER_DETAILS: "master/metaData/otherDetails/default",
  UPDATE_KYC: "/update-kyc",
  VERIFY_NUMBER: "/account/dedupe-check",
  UPDATE_NUMBER: "/update-account/",
  VERIFY_CUSTOMER_BIOMETRIC: "/verify-customer-biometric",
  SEARCH_CUSTOMER: "/account/search-details",
  GET_CUSTOMER_RECORDS: "/account/fetch-records",
  CHECK_STATUS: "/verify/status-check",
  GENERATE_LINK: "/verify/generate-link",
  VERIFY_LINK: "/verify/verify-link",
  BIOMETRIC_VERIFICATION: "/aadhar/biom-verify",
});

export default ENDPOINTS;
