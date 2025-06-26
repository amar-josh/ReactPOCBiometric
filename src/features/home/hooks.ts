import { useMutation } from "@tanstack/react-query";

import { getInstaServices } from "./services";

export const useGetInstaServices = () => {
  return useMutation({
    mutationFn: getInstaServices,
  });
};
