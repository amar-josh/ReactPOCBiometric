export interface IMobileOrEmailVerificationForm {
  identifier: string;
  mobile?: string;
  email?: string;
}

export interface ISearchDetailsRequest {
  email?: string;
  mobile?: string;
}

export interface ISearchDetailsResponse {
  statusCode: number;
  status: string;
  message: string;
  data: {
    mobile?: string;
    email?: string;
    lastVerificationPerformed: string;
    verificationStatus: boolean;
    requestNumber: string;
    reVerify: boolean;
  } | null;
}

export interface IGenerateVerificationLinkRequest {
  identifier: string;
  mobileNumber?: string;
  email?: string;
  requestNumber: string;
}

export interface IGenerateVerificationLinkResponse {
  statusCode: number;
  status: string;
  message: string;
  data: {
    uniqueId: string;
  };
}
