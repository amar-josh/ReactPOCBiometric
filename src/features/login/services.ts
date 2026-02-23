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
        "eyJraWQiOiJ5bkNqRDZuWlF5V0hqV0k1MWlDQ2d2NVZibUZNbjB4RjlZaHFQZmY1UFVZPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI0YzFrZXNjYjYzcXJsczBnMzl2MHJvN2w4cCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiZGVmYXVsdC1tMm0tcmVzb3VyY2Utc2VydmVyLWF2ZWVrMVwvcmVhZCIsImF1dGhfdGltZSI6MTc3MTgyNzE5NSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGgtMV9ZTEVoc0pLNXIiLCJleHAiOjE3NzE4MzA3OTUsImlhdCI6MTc3MTgyNzE5NSwidmVyc2lvbiI6MiwianRpIjoiNjdlYjQzZjctNDUwNi00ZTc4LWE2MDMtYjk1ZmIxZTQxNGQ2IiwiY2xpZW50X2lkIjoiNGMxa2VzY2I2M3FybHMwZzM5djBybzdsOHAifQ.mmoFwOlmFgJ6_2QadtSMLiUa_NETruGAGGKK5k_lvRi5lKJD2cahENtgu1NatGJWnBMFJBFAS3vRUYDZZyu6JtZ0XNi49Hsm7JLWES9nPpRwNM_FSgB4slmt28ZqVxfeukBnPIyBVqFc0tDKAb69vcaUfr2lxPJ2KBDYCVJgfNx9HFWT0-vukWRM8m5rm0QKAoNjBFbQs3drfkqsvGCzA1UURUCyoopuMKKIoVipEppLuS_HAPWfYaYVaNnIkUO56KUcD3FZvRJNvOifHAn5R4VXqQeIbrSvcb49Ig4-RilAXRyJAmXOEzVRd1AaEayPKxIfhfJvrEBDtJ15vMVk0A",
      userAttributes: {
        empName: "Pratik Powale",
        empId: null,
        branchCode: null,
        department: null,
        email: null,
      },
    },
  });
  return POST<ILoginRequest, ILoginResponse>(ENDPOINTS.LOGIN, payload);
};
