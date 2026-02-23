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

export interface IGetCustomerSearchRequest {
  customerID?: string;
  mobileNumber?: string;
  accountNumber?: string;
}

export interface IAccountDetail {
  accountNumber: string;
  productName: string;
  isAccountDormant: boolean;
  isDebitFreeze?: boolean;
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
  pinCode: number;
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
  kycStatus: string;
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

export interface IAccountDetails {
  accountId: string;
  accountType: string;
}

export interface IReKYCData {
  requestNumber: string;
  metaData: {
    isNoChange: boolean;
    isUpdateAddress: boolean;
    message: string;
  };
  rekycDetails: IreKYCDetails;
  // otherDetails: IOtherDetails;
  action?: string;
  actionCode?: string;
  filteredAccountDetails: IAccountDetails[];
}

export interface IMakerDetails {
  initiatedBy: string | null | undefined;
  empId: string | null | undefined;
  empBranchCode: string | null | undefined;
}

export interface IGetCustomerDetailsRequest {
  customerID: string;
  makerDetails: IMakerDetails;
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

export type IUpdateKYCRequest = {
  requestNumber: string;
  makerDetails: IMakerDetails;
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
    // TODO - These details are not available in the ESB yet, so we are hiding them until they become available.
    // otherDetails: {
    //   occupation: number;
    //   incomeRange: number;
    //   residentType: number;
    // };
  };
  filteredAccountDetails: IAccountDetails[];
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

export interface ICustomerSearchFormValues {
  searchBy: "mobile" | "cif" | "account";
  mobile?: string;
  cif?: string;
  account?: string;
}
