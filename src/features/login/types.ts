export interface IGenerateTokenResponse {
  message: string;
  statusCode: number;
  status: string;
  data: IGenerateTokenData;
}
export interface IGenerateTokenData {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}
