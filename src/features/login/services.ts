import { ENDPOINTS } from "@/constants/endPoints";
import { POST } from "@/services/api.service";

import { IGenerateTokenResponse } from "./types";

export const logout = () => {
  // TODO: Uncomment when the logout endpoint is available
  //   return POST<void, void>(ENDPOINTS.LOGOUT).finally(clearTokens);
};

export const generateToken = (): Promise<IGenerateTokenResponse> => {
  return POST<void, IGenerateTokenResponse>(ENDPOINTS.GENERATE_TOKEN);
};
