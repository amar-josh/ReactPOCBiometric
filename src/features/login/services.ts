import { ENDPOINTS } from "@/constants/endPoints";
import { fetchFakeData } from "@/lib/utils";
import { POST } from "@/services/api.service";

import { ILoginRequest, ILoginResponse } from "./types";

export const loginService = (payload: ILoginRequest) => {
  return fetchFakeData({
    message: "Login successful",
    statusCode: 200,
    status: "success",
    data: {
      cognitoToken:
        "eyJraWQiOiJ5bkNqRDZuWlF5V0hqV0k1MWlDQ2d2NVZibUZNbjB4RjlZaHFQZmY1UFVZPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI0YzFrZXNjYjYzcXJsczBnMzl2MHJvN2w4cCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiZGVmYXVsdC1tMm0tcmVzb3VyY2Utc2VydmVyLWF2ZWVrMVwvcmVhZCIsImF1dGhfdGltZSI6MTc3MTgzNzY3MywiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGgtMV9ZTEVoc0pLNXIiLCJleHAiOjE3NzE4NDEyNzMsImlhdCI6MTc3MTgzNzY3MywidmVyc2lvbiI6MiwianRpIjoiOGM3Y2FiODUtNGI5Yy00OWY2LThmNzYtMmZkYTMzYTk4Y2Y2IiwiY2xpZW50X2lkIjoiNGMxa2VzY2I2M3FybHMwZzM5djBybzdsOHAifQ.gDw_syJ2VWg9zlVMB0vcpV4bNzhR4Qycg1nGlobRtAXSlGMfFlmNEGhMmF6AnAMRJ8-UqMLz2s47IhM3iAU1GRSVuTlOgwzfuUsAEW-p_AVWbsv2NU7O6xte2mgdCWIJFxwZ0nnh9_YwNgjT-L8asxd9VPnWljwIk_M1cFp5HhSzshvBYCjfYEKhsMPKadJPn7l_R-NgWagZP0xiZoLOCDhmR7Wc3LL8G1Hc1unaf3bjysxZKNe-Co1yrpWeTHRuOQitj9I8MSE1sy7KkTJJDwbgg-6vI548nIZoTGL0EPt3CSCrX0pZ8704q0ANT1NI5tgfM6A27kIa0TMK5l3_Kg",
      userAttributes: {
        empName: "Sandhya Dornal",
        empId: null,
        branchCode: null,
        department: null,
        email: "sandhya.dornal@joshsoftware.com",
      },
    },
  });
  return POST<ILoginRequest, ILoginResponse>(ENDPOINTS.LOGIN, payload);
};
