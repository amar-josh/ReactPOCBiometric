export interface IAlertMessage {
  type: "success" | "error";
  message: string;
}

export interface IGetConfigResponse {
  statusCode: number;
  status: string;
  message: string;
  data: {
    cognitoApiKey: string;
    aesKey: string;
  };
}

export type JourneyType = "reKyc" | "mobileNumberUpdate";
