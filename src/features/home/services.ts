import { ENDPOINTS } from "@/constants/endPoints";
import { POST } from "@/services/api.service";

import { IInstaServicesRequest, IInstaServicesResponse } from "./types";

// TODO - user_id, user_role should be passed to fetch but use post method.
export const getInstaServices = (payload: IInstaServicesRequest) => {
  return POST<IInstaServicesRequest, IInstaServicesResponse>(
    ENDPOINTS.GET_INSTA_SERVICES,
    payload
  );
};
