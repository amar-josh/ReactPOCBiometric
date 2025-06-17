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
  defaultValue: string | null;
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
  accountNumber: number;
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
  customerId: number | string;
  customerName: string;
  mobileNumber: string;
  email: string;
  isIndividual: boolean;
}
export interface ICustomerSearchResponse {
  custDetails: ICustomerDetails;
  accDetails: IAccountDetail[];
}

export interface IGetCustomerSearchResponse {
  message: string;
  statusCode: number;
  status: string;
  data: ICustomerSearchResponse;
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
  aadhaarNumber: number;
  customerID: number;
  accountNumber: number;
  mobileNo: number;
  emailId: string;
  nameOfOVD: string;
  permenantAddress: IAddress;
  communicationAddress: IAddress;
  [key: string]: any;
}

export interface IOtherDetails {
  occupation: string;
  incomeRange: number;
  residentType: string;
  [key: string]: string | number;
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
  customerID: number;
}

export interface IReKYCCheckpointFailureResponse {
  action: string;
  actionCode: string;
}

export interface IGetCustomerDetailsResponse {
  message: string;
  statusCode: number;
  status: string;
  data: IReKYCData | IReKYCCheckpointFailureResponse;
}

export interface ISelectOptions {
  name: string;
  code: number;
}

export interface IreKYCFailureCheckpointElment {
  title: string;
  message: string;
  icon: string;
}

export interface IreKYCFailureCheckpoints {
  [key: string]: IreKYCFailureCheckpointElment;
}

// For biometric capture finger print request
export interface IValidateFingerPrintRequest {
  aadhaarNumber: string;
  rdServiceData: string;
  requestNumber?: string;
  mobileNo: string;
}

// For biometric capture finger print response
export interface IBiometricApiDataSuccess {
  message: string;
  statusCode: string;
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
  statusCode: string;
  status: string;
  timestamp: string;
  path: string;
  data: T;
}

export type IValidateFingerPrintResponse =
  | IBiometricApiBaseResponse<IBiometricApiDataSuccess>
  | IBiometricApiBaseResponse<IBiometricApiDataFailure>;

export type IUpdateKYCRequest = {
  requestNumber: string;
  makerDetails: {
    initiated_by: string;
    emp_id: string | number;
    emp_branchcode: string;
  };
  kycNoChange: boolean;
  kycDetails: IreKYCDetails & {
    otherDetails: {
      occupation: number | string;
      residentType: number | string;
      incomeRange: number | string;
    };
    aadhaarCommunicationAddress?: IAddress;
  };
};

// Address update api response
export interface IUpdateKYCData {
  requestNumber: string;
}

export interface IUpdateKYCResponse {
  message: string;
  statusCode: string;
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
