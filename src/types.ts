export interface IAlertMessage {
  type: "success" | "error";
  message: string;
}

export interface ICommonSuccessResponse {
  statusCode: number;
  status: string;
  message: string;
}
