export const MASKED_KEY = {
  MOBILE_NUMBER: "mobile",
  AADHAAR: "aadhaar",
  CUSTOMER_ID: "customerId",
  EMAIL: "email",
} as const;

export const ERROR = "error" as const;

export const POPUP = "pop-up" as const;

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
  EMP_INFO: "empInfo",
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
export const CAPTURE_FINGERPRINT_REQUEST_BODY = `<PidOptions ver="1.0"><Opts env="P" fCount="1" fType="2" iCount="" iType="" pCount="" pType="" format="0,1" pidVer="2.0" timeout="10000" otp="" wadh="CtbFfteJR5nXKr+GVvh78PjlqkxOBcj+9XgPi5p8mbE=" posh=""/></PidOptions>`;
// Biometric service constants end

export const INITIAL_STEP_STATUS = {
  1: false,
  2: false,
  3: false,
};

export const SUPPORT_EMAIL = "instaservice_support@bandhanbank.com";

export const VALUE_IN_INDIAN_FORMAT = "en-IN";

export const INDIAN_CURRENCY = "INR";

export const CURRENCY = "currency";

export const ZERO = 0;

export const YES = "Yes";

export const NO = "No";

export const ALPHANUMERIC =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export const PADDING = "BIS_REKYC";

export const MIN_USER_NAME_LENGTH = 3;

export const MAX_USER_NAME_LENGTH = 50;

export const MAX_PASSWORD_LENGTH = 30;

export const JOURNEY_TYPE = {
  REKYC: "reKyc",
  MOBILE_NUMBER_UPDATE: "mobileNumberUpdate",
} as const;
