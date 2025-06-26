import { ICommonSuccessResponse } from "@/types";

import { IAddress } from "../re-kyc/types";

export interface IGetVerifyNumberRequest {
  mobileNumber: string;
  requestNumber: string;
}

export interface IGetVerifyNumberResponse {
  statusCode: number;
  status: string;
  message: string;
}

export interface IGetUpdateNumberRequest {
  customerId: string;
  custUpdatedMobileNumber: string | number;
  branchCode: string;
  customerName: string;
  requestNumber: string;
  type: string;
}

export interface IGetUpdateNumberResponseData {
  oldMobileNumber: string;
  newMobileNumber: string;
  requestNumber: string;
}

export interface IGetUpdateNumberResponse {
  statusCode: number;
  status: string;
  message: string;
  data: IGetUpdateNumberResponseData;
}

export interface IGetRecordRequest {
  branchCode: string;
  employeeId: string | number;
  employeeName: string;
  cif: string;
}

export interface IGetRecordResponse {
  statusCode: number;
  status: string;
  message: string;
  data:
    | ICommonSuccessResponse
    | {
        action: string;
        actionCode: string;
      };
}

export interface IGetCheckStatusRequest {
  requestNumber: string;
}

export interface IGetCheckStatusData {
  id: string;
  requestNumber: string;
  is_verified: boolean;
}

export interface IGetCheckStatusResponse {
  statusCode: number;
  status: string;
  message: string;
  data: IGetCheckStatusData;
}

export interface IGetGenerateLinkRequest {
  requestNumber: string;
  mobileNumber: string;
  channel: string;
}

export interface IGetGenerateResponseData {
  shortUrl: string;
  totalClicks: number;
}

export interface IGetGenerateLinkResponse {
  statusCode: number;
  status: string;
  message: string;
  data: IGetGenerateResponseData;
}

export interface IGetVerifyLinkRequest {
  shortCode: string | null;
}

export interface IGetVerifyLinkResponse {
  statusCode: number;
  msg: string;
}

export interface IGetCustomerSearchRequest {
  branchCode?: string;
  employeeId?: string | number;
  employeeName?: string;
  cif?: string;
  mobileNumber?: string;
  accountNumber?: number;
}

export interface ICustomerDetails {
  customerId: string;
  customerName: string;
  mobileNumber: string;
  email: string;
  isIndividual: boolean;
}

export interface IAccountDetail {
  accountNumber: string;
  productName: string;
  isAccountDormant: boolean;
  accountOpenDate: string;
}

export interface IGetCustomerSearchResponseData {
  custDetails: ICustomerDetails;
  accDetails: IAccountDetail[];
}

export interface IGetCustomerSearchResponse {
  statusCode: number;
  status: string;
  message: string;
  data: IGetCustomerSearchResponseData[];
}

export interface IBioMetricVerificationRequest {
  aadhaarNumber: string;
  rdServiceData: string;
  requestNumber: string;
}

export interface IBioMetricVerificationResponse {
  message: string;
  statusCode: string;
  status: string;
  data: {
    aadhaarVerification: string;
    requestNumber: string;
    aadhaarAddress: IAddress;
  };
}

export interface IMobileNumberUpdateFailureCheckpointElement {
  title: string;
  message: string;
  icon: string;
}

export interface IMobileNumberUpdateFailureCheckpoints {
  AADHAR_NOT_AVAILABLE: IMobileNumberUpdateFailureCheckpointElement;
  [key: string]: IMobileNumberUpdateFailureCheckpointElement;
}
