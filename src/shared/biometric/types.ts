import { IAddress } from "@/features/re-kyc/types";

export interface IGetBiometricCardDetailsProps {
  statusKey: string | undefined;
  count: number;
  message?: string;
}

export type IBiometricCardKey =
  | "retry"
  | "close"
  | "capture"
  | "recapture"
  | "home";

export interface IBiometricCardDetails {
  title: string;
  message: string;
  icon: string;
  buttonText: string;
  key: IBiometricCardKey;
  isError?: boolean;
}

// For biometric capture finger print request
export interface IValidateFingerPrintRequest {
  aadhaarNumber: string;
  rdServiceData: string;
  requestNumber: string;
  mobileNo?: string;
}

// For biometric capture finger print response
export type IValidateFingerPrintResponse = {
  message: string;
  statusCode: number;
  status: string;
  data: {
    aadhaarVerification: string;
    requestNumber: string;
    aadhaarAddress: IAddress;
  };
};

export interface IValidFingerprintErrorResponse {
  message: string;
  statusCode: number;
}
