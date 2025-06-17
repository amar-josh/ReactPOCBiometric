import { axiosInstance } from "@/services/api.service";

export const logout = () => {
  // TODO: Uncomment when the logout endpoint is available
  //   return POST<void, void>(ENDPOINTS.LOGOUT).finally(clearTokens);
};

export const clearTokens = () => {
  localStorage.removeItem("appToken");
  axiosInstance.defaults.headers.common.Authorization = "";
};
