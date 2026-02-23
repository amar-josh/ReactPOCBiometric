import { useMutation } from "@tanstack/react-query";

import { generateLinkService, getSearchDetailsService } from "./services";

export const useSearchDetails = () => {
  return useMutation({
    mutationFn: getSearchDetailsService,
  });
};

export const useGenerateLink = () => {
  return useMutation({
    mutationFn: generateLinkService,
  });
};
