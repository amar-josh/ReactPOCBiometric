import { useMutation } from "@tanstack/react-query";

import { loginService } from "./services";

export const useLogin = () => {
  return useMutation({
    mutationFn: loginService,
  });
};
