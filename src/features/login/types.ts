export interface ILoginRequest {
  username: string;
  password: string;
}

export interface ILoginResponse {
  statusCode: number;
  status: string;
  message: string;
  data: {
    cognitoToken: string;
    userAttributes: {
      empName: string;
      empId: string;
      branchCode: string;
      department: string;
      email: string;
    };
  };
}
