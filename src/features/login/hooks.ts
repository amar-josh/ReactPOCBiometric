import { useMutation } from "@tanstack/react-query";

import { generateToken } from "./services";

// write login hook here using tanstack query
export const useGenerateToken = () => {
  return useMutation({
    mutationFn: generateToken,
  });
};
