import { I } from "vitest/dist/chunks/reporters.d.CfRkRKN2.js";

import { ICommonSuccessResponse } from "@/types";

export interface IGetVerifyNumberRequest {
  mobileNumber: number;
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
  requestNumber: number;
}

export interface IGetCheckStatusData {
  id: string;
  service_request_number: string | number;
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
  shortCode: string;
}

export interface IGetVerifyLinkResponse {
  statusCode: number;
  msg: string;
}

export interface IGetCustomerSearchRequest {
  branchCode: string;
  employeeId: string | number;
  employeeName: string;
  cif?: string;
  mobileNumber?: string;
  accountNumber?: number;
}

export interface ICustomerDetails {
  customerId: string;
  customerName: string;
  mobileNumber: string | number;
  email: string;
  isIndividual?: boolean;
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
  aadharNumber: string;
  rdServiceData: string;
  requestNumber: string;
}

export interface IMobileNumberUpdateFailureCheckpointElement {
  title: string;
  message: string;
  icon: string;
}

export interface IMobileNumberUpdateFailureCheckpoints {
  [key: string]: IMobileNumberUpdateFailureCheckpointElement;
}
