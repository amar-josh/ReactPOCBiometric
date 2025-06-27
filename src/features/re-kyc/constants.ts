export const STEPS = [
  "mobileNumberUpdate.searchCustomer",
  "reKyc.title",
  "reKyc.eSign",
];

export const ESIGN = "esign";
export const UPDATE = "update";

export const SEARCH_OPTIONS = [
  {
    label: "Mobile Number",
    value: "mobile",
  },
  {
    label: "CIF ID",
    value: "cif",
  },
  {
    label: "Account Number",
    value: "account",
  },
];

export const DASHBOARD_KEYS = {
  MOBILE_NUMBER_UPDATE: "mobile_number_update",
  ADDRESS_UPDATE: "address_update",
  PAN_UPDATE: "pan_update",
  RE_KYC: "re_kyc",
};

export const BIOMETRIC_OPERATIONS = {
  CHECK_RD_SERVICE_STATUS: "checkRDServiceStatus",
  CHECK_RD_SERVICE_ERROR: "checkRDServiceError",
  DEVICE_NOT_READY: "deviceNotReady",
  READY_TO_CAPTURE: "readyToCapture",
  SUCCESS: "success",
  NO_FINGER_FOUND: "notFound",
  ATTEMPT_FAILED: "attemptFailed",
  ATTEMPT_LIMIT_CROSSED: "attemptLimitCrossed",
  DEVICE_USED_BY_ANOTHER_APPLICATION: "usedByOtherApplication",
  DEFAULT: "default",
};

export const BIOMETRIC_MODAL_ACTIONS = {
  RETRY_RD_SERVICE: "retryRDService",
  RETRY_DEVICE: "retryDevice",
  CLOSE: "close",
  CAPTURE: "capture",
  RECAPTURE: "recapture",
  HOME: "home",
};

export const ACCOUNT_STATUS = {
  DORMANT: "ACCOUNT DORMANT",
  FROZEN: "ACCOUNT FROZEN",
};

export const ACCOUNT_STATUS_LABELS = {
  [ACCOUNT_STATUS.DORMANT]: "Dormant Account",
  [ACCOUNT_STATUS.FROZEN]: "Freeze Account",
};

export const CIF_LENGTH = 9;
export const MAX_BIOMETRIC_ATTEMPT = 3;

export const INITIAL_OTHER_DETAILS_DATA = {
  occupation: { label: "", value: "" },
  residentType: { label: "", value: "" },
  incomeRange: { label: "", value: "" },
};

export const BIOMETRIC_DEVICE_STATUS_CODES = {
  "720": BIOMETRIC_OPERATIONS.DEVICE_NOT_READY,
  "700": BIOMETRIC_OPERATIONS.NO_FINGER_FOUND,
  "730": BIOMETRIC_OPERATIONS.NO_FINGER_FOUND,
  "710": BIOMETRIC_OPERATIONS.DEVICE_USED_BY_ANOTHER_APPLICATION,
};
