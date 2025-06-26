export const MASKED_KEY = {
  MOBILE_NUMBER: "mobile",
  AADHAAR: "aadhaar",
  CUSTOMER_ID: "customerId",
  EMAIL: "email",
} as const;

export const ERROR = "error" as const;

export const SUCCESS = "success" as const;
export const BADGE_COLOR_CONSTANTS = {
  SUCCESS: "success",
  WARNING: "warning",
  INFO: "info",
  DANGER: "danger",
};

export const SESSION_STORAGE_KEY = {
  TOKEN: "token",
  RELOAD_PROTECTED_ROUTE: "reloadProtectedRoute",
  RELOAD_PROTECTED_ROUTE_VALUE: "refreshPage",
};

// Biometric service constants start
export const RD_SERVICE_NAME = "IDEMIA_L1_RDSERVICE";
export const RD_SERVICE_PORTS = {
  START: 11100,
  END: 11120,
};
export const RD_SERVICE_TIMEOUT_MS = 3000; // Timeout for each port attempt in milliseconds
export const BIOMETRIC_SERVICE_AND_DEVICE_STATUS = {
  READY: "READY",
  NOT_READY: "NOTREADY",
};
export const CAPTURE_FINGERPRINT_REQUEST_BODY = `<PidOptions ver="1.0"><Opts env="PP" fCount="1" fType="0" iCount="" iType="" pCount="" pType="" format="0" pidVer="2.0" timeout="120000" otp="" wadh="" posh=""/></PidOptions>`;
// Biometric service constants end
