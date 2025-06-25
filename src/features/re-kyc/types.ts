import * as yup from "yup";

export interface IFormDetailsSchema {
  label: string;
  value: string;
  type:
    | "select"
    | "number"
    | "text"
    | "date"
    | "textarea"
    | "email"
    | "combobox"; // extendable
  defaultValue: number | string | null;
  validation?: yup.AnySchema;
  readOnly?: boolean;
  className?: string;
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

export interface IGetCustomerSearchRequest {
  customerID?: number;
  mobileNumber?: string;
  accountNumber?: number;
}

export interface IAccountDetail {
  accountNumber: string;
  productName: string;
  isAccountDormant: boolean;
  isDebitFreeze?: boolean;
}

export interface ICif {
  cif: number;
  accDetails: IAccountDetail[];
  isIndividual?: boolean;
}

export interface IPersonalDetails {
  firstName?: string;
  lastName?: string;
  fullName: string;
  mobileNo: string;
  emailId: string;
}

export interface ICustomerDetails {
  customerId: string;
  customerName: string;
  mobileNumber: string;
  email: string;
  isIndividual: boolean;
}
export interface ICustomerSearchResponse {
  custDetails: ICustomerDetails;
  accDetails: IAccountDetail[];
}

export interface IFetchRecordError {
  action: string;
  actionCode: string;
}

export interface ICheckpointFailure {
  message: string;
  statusCode: number;
  status: string;
  data: IFetchRecordError;
}

export interface IGetCustomerSearchResponse {
  message: string;
  statusCode: number;
  status: string;
  data: ICustomerSearchResponse[];
}

export interface IAddress {
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  city: string;
  state: string;
  pincode: number;
  country: string;
}
export interface IreKYCDetails {
  customerName: string;
  aadhaarNumber: string;
  aadhaarRefNumber: string;
  customerID: string;
  accountNumber: number;
  mobileNo: string;
  emailId: string;
  nameOfOVD: string;
  permanentAddress: IAddress;
  communicationAddress: IAddress;
  [key: string]: string | number | IAddress | undefined;
}

export interface IOtherDetails {
  occupation: number;
  incomeRange: number;
  residentType: number;
  [key: string]: number | undefined;
}

export interface IReKYCData {
  requestNumber: string;
  metaData: {
    noChangeEnabled: boolean;
    updateAddressEnabled: boolean;
    message: string;
  };
  rekycDetails: IreKYCDetails;
  otherDetails: IOtherDetails;
}

export interface IGetCustomerDetailsRequest {
  customerID: string;
}

export interface IReKYCCheckpointFailureResponse {
  action: string;
  actionCode: string;
}

export interface IGetCustomerDetailsResponse {
  message: string;
  statusCode: number;
  status: string;
  data: IReKYCData;
}

export interface ISelectOptions {
  name: string;
  code: number;
}

export interface IOtherDetailsValues {
  occupation: ILabelValue;
  residentType: ILabelValue;
  incomeRange: ILabelValue;
}

export interface IreKYCFailureCheckpointElement {
  title: string;
  message: string;
  icon: string;
}

export interface IreKYCFailureCheckpoints {
  [key: string]: IreKYCFailureCheckpointElement;
}

// For biometric capture finger print request
export interface IValidateFingerPrintRequest {
  aadhaarNumber: string;
  rdServiceData: string;
  requestNumber: string;
  mobileNo?: string;
}

// For biometric capture finger print response
export interface IBiometricApiDataSuccess {
  message: string;
  statusCode: number;
  status: string;
  data: {
    aadhaarVerification: string;
    requestNumber: string;
    aadhaarAddress: IAddress;
  };
}

export interface IBiometricApiDataFailure {
  aadhaarVerification: "failed";
}

export interface IBiometricApiBaseResponse<T> {
  message: string;
  statusCode: number;
  status: string;
  timestamp: string;
  path: string;
  data: T;
}

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

export type IUpdateKYCRequest = {
  requestNumber: string;
  makerDetails: {
    initiatedBy: string;
    empId: string;
    empBranchCode: string;
  };
  isOtherDetailsChange: boolean;
  kycNoChange: boolean;
  rekycDetails: {
    customerName: string;
    aadhaarNumber: string;
    aadhaarRefNumber: string;
    customerID: string;
    mobileNo: string;
    emailId: string;
    permanentAddress: IAddress;
    communicationAddress: IAddress;
    aadhaarCommunicationAddress?: IAddress;
    otherDetails: {
      occupation: number;
      incomeRange: number;
      residentType: number;
    };
  };
};

// Address update api response
export interface IUpdateKYCData {
  requestNumber: string;
}

export interface IUpdateKYCResponse {
  message: string;
  statusCode: number;
  status: "success" | "failure";
  timestamp: string;
  path: string;
  data: IUpdateKYCData;
}

export interface ILabelValue {
  label: string;
  value: number | string;
}

export interface IOnSubmitAddressFormData {
  occupation: number;
  incomeRange: number;
  residentType: number;
}

export interface IOtherDetailsResponse {
  message: string;
  statusCode: number;
  status: string;
  data: {
    occupation: ISelectOptions[];
    income: ISelectOptions[];
    resident: ISelectOptions[];
  };
}
