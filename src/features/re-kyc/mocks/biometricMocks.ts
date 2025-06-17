import { request } from "http";

export const biometricApiSuccess = {
  message: "",
  statusCode: "200",
  status: "success",
  timestamp: "2025-04-17T15:45:30",
  path: "/api/your-endpoint",
  data: {
    requestNumber: "1494761",
    aadhaarVerification: "success",
    aadhaarAddress: {
      addressLine1: "Amar tech park",
      addressLine2: "Balewadi",
      city: "pune",
      state: "MH",
      pincode: "411045",
      country: "India",
    },
  },
};

export const biometricApiFailure = {
  message: "Error",
  statusCode: "422",
  status: "failed",
  timestamp: "2025-04-17T15:45:30",
  path: "/api/your-endpoint",
  data: {
    aadhaarVerification: "failed",
  },
};

export const addressUpdateSuccess = {
  message: "Thank you! Re-KYC update request will be processed within 24 hrs.",
  statusCode: "200",
  status: "success",
  timestamp: "2025-04-24T16:42:49.7868209",
  path: "/master/updateAddress",
  data: {
    requestNumber: "1494761",
  },
};

export const addressUpdateFailure = {
  message:
    "Re-KYC Update failed. Please try again or continue with form based process",
  statusCode: "400",
  status: "failure",
  timestamp: "2025-04-24T16:42:49.7868209",
  path: "/master/updateAddress",
  data: {
    requestNumber: "1494761",
  },
};
