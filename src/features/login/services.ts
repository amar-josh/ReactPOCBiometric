import { ENDPOINTS } from "@/constants/endPoints";
import { POST } from "@/services/api.service";

import { ILoginRequest, ILoginResponse } from "./types";

export const loginService = (payload: ILoginRequest) => {
  return POST<ILoginRequest, ILoginResponse>(ENDPOINTS.LOGIN, payload);
};
