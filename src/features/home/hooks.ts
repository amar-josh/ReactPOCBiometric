import { useQuery } from "@tanstack/react-query";

import { getInstaServices } from "./services";

// Get users
export const useGetInstaServices = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: getInstaServices,
  });
};
