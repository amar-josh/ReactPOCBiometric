import { fetchFakeData } from "@/lib/utils";

import mockData from "./mocks/HomeCards.json";

// TODO - user_id, user_role should be passed to fetch but use post method.
export const getInstaServices = async () =>
  //payload: IInstaServicesRequest
  {
    // return POST<IInstaServicesRequest, IInstaServicesResponse>(ENDPOINTS.GET_INSTA_SERVICES, payload);
    return fetchFakeData(mockData);
  };
