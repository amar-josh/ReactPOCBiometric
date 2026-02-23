import { ENDPOINTS } from "@/constants/endPoints";
import { fetchFakeData } from "@/lib/utils";
import { POST } from "@/services/api.service";

import { ILoginRequest, ILoginResponse } from "./types";

export const loginService = (payload: ILoginRequest) => {
  return fetchFakeData({"message":"Login successful","statusCode":200,"status":"success","data":{"cognitoToken":"eyJraWQiOiJ5bkNqRDZuWlF5V0hqV0k1MWlDQ2d2NVZibUZNbjB4RjlZaHFQZmY1UFVZPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI0YzFrZXNjYjYzcXJsczBnMzl2MHJvN2w4cCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiZGVmYXVsdC1tMm0tcmVzb3VyY2Utc2VydmVyLWF2ZWVrMVwvcmVhZCIsImF1dGhfdGltZSI6MTc3MTgzOTQ1OCwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGgtMV9ZTEVoc0pLNXIiLCJleHAiOjE3NzE4NDMwNTgsImlhdCI6MTc3MTgzOTQ1OCwidmVyc2lvbiI6MiwianRpIjoiMTdmMGNiZjYtNDBkMC00YjczLTliNjktNDcxOWU3MTMxZTM0IiwiY2xpZW50X2lkIjoiNGMxa2VzY2I2M3FybHMwZzM5djBybzdsOHAifQ.lK8FzX-f13T-b1ByStna2qf87qA74xcy_pPSKTH2dszNwKDJpKjmPVXr6Xb5aFFusXVqftqbuDKu6iOhKDi3DhDMP_dyN6PYkx3DJK23MSIdAHcBVAhfu0__IIE8FPmS9zE2Nfb7JYRv2McPNwfnzYXlEYZBq5Wp9Y3gr06Rr4tJ_8j2Eo8YOv1ylySpWoJjyrNejQ-DnfO2L3bJmdrVtXItt9E9qSP72Ui0kn9Dhf2CWnw1l__qgZAcLe3L5Nzoqx_G60MwADue7Sg3FFIldLR_RL91PTdenvS8ScIccK9qpdxHISmniAXjQX2Z3AyLBowOFBePqL62O_i-hi4KFg","userAttributes":{"empName":"Sandhya Dornal","empId":null,"branchCode":null,"department":null,"email":"sandhya.dornal@joshsoftware.com"}}});
  return POST<ILoginRequest, ILoginResponse>(ENDPOINTS.LOGIN, payload);
};
