export const STEPS = ["searchCustomer", "verify", "eSign"];

export const ESIGN = "esign";
export const UPDATE = "update";

export const DASHBOARD_KEYS = {
  MOBILE_NUMBER_UPDATE: "mobile_number_update",
  ADDRESS_UPDATE: "address_update",
  PAN_UPDATE: "pan_update",
  RE_KYC: "re_kyc",
};

export const INITIAL_OTHER_DETAILS_DATA = {
  occupation: { label: "", value: "" },
  residentType: { label: "", value: "" },
  incomeRange: { label: "", value: "" },
};

export const STEP = {
  SEARCH_CUSTOMER: 1,
  VERIFY: 2,
  ESIGN: 3,
  ADDRESS_UPDATE: 4,
} as const;
