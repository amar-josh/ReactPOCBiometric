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
  customerID: string;
  custUpdatedMobileNumber: string | number;
  branchCode: string | null | undefined;
  customerName: string | null | undefined;
  requestNumber: string;
  type: string | null | undefined;
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
  branchCode: string | null | undefined;
  employeeId: string | number | null | undefined;
  employeeName: string | null | undefined;
  customerID: string;
}

export interface ICustDetails {
  customerId: string;
  customerName: string;
  mobileNumber: string;
  aadharNumber: string;
}

export interface IAccountDetails {
  accountNumber: string;
  productName: string;
  accountStatus: string;
  accountStatusCode: string;
}

export interface IGetRecordData {
  custDetails: ICustDetails;
  accDetails: IAccountDetails[];
  action?: string;
  actionCode?: string;
}

export interface IGetRecordResponse {
  statusCode: number;
  status: string;
  message: string;
  data: IGetRecordData;
}

export interface IGetCheckStatusRequest {
  requestNumber: string;
}

export interface IGetCheckStatusData {
  id: string;
  requestNumber: string;
  isVerified: boolean;
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

export interface IGetCustomerSearchRequest {
  branchCode?: string;
  employeeId?: string | number;
  employeeName?: string;
  customerID?: string;
  mobileNumber?: string;
  accountNumber?: string;
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

export interface IMobileNumberUpdateFailureCheckpointElement {
  title: string;
  message: string;
  icon: string;
}

export interface IMobileNumberUpdateFailureCheckpoints {
  AADHAR_NOT_AVAILABLE: IMobileNumberUpdateFailureCheckpointElement;
  [key: string]: IMobileNumberUpdateFailureCheckpointElement;
}
