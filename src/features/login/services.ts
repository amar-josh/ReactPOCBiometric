import { ENDPOINTS } from "@/constants/endPoints";
import { fetchFakeData } from "@/lib/utils";
import { POST } from "@/services/api.service";

import { ILoginRequest, ILoginResponse } from "./types";

export const loginService = (payload: ILoginRequest) => {
  return fetchFakeData({"message":"Login successful","statusCode":200,"status":"success","data":{"cognitoToken":"eyJraWQiOiJ5bkNqRDZuWlF5V0hqV0k1MWlDQ2d2NVZibUZNbjB4RjlZaHFQZmY1UFVZPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI0YzFrZXNjYjYzcXJsczBnMzl2MHJvN2w4cCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiZGVmYXVsdC1tMm0tcmVzb3VyY2Utc2VydmVyLWF2ZWVrMVwvcmVhZCIsImF1dGhfdGltZSI6MTc3MTgzNjc2NiwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGgtMV9ZTEVoc0pLNXIiLCJleHAiOjE3NzE4NDAzNjYsImlhdCI6MTc3MTgzNjc2NiwidmVyc2lvbiI6MiwianRpIjoiN2ExMzlmMmQtN2MxNS00Njg1LWEyMjEtOGUyNmZjMDVlM2Y4IiwiY2xpZW50X2lkIjoiNGMxa2VzY2I2M3FybHMwZzM5djBybzdsOHAifQ.asPAQ_QFGxbOCb2NTgEx7HSKRVbGrRFRFR7J9Zbc_o_K-yj5DpEuVJfdfTqS0N4wO-AeEsjfhs9eZg4oJazC8xE1EWbtDs2XUvHEpm8uMCcBHTXlgekIefgjRPJh8tpvyuwvVlzTnhbtp5lmbhpDykS7wT82hc46M9Qudl50NaldAqZnUfA1TgzJg1yZF9Pp8ISU4UVfXTR612NawTIngysvRW90ZBkpD577V9C-rXr914KDCyFP-mUcq1SO9i3Ng2rNQSnt5DWOvE1vd50fuE-4k3i1vvbZW9S81eNuwzEYlwIy9bgn0__5b8CtI7yYJOHX1ysXmOH2p37ILvc41g","userAttributes":{"empName":"Pratik Powale","empId":null,"branchCode":null,"department":null,"email":null}}});
  return POST<ILoginRequest, ILoginResponse>(ENDPOINTS.LOGIN, payload);
};
