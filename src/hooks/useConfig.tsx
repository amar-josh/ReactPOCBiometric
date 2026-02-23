import { useMutation } from "@tanstack/react-query";

import { getConfig } from "@/services/config";

export const useGetConfig = () => {
  return useMutation({
    mutationFn: getConfig,
  });
};
