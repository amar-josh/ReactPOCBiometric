import { useEffect, useState } from "react";

import { SUCCESS } from "@/constants/globalConstant";
import { IAlertMessage } from "@/types";

export const useAlertMessage = (
  type: "success" | "error",
  message: string | undefined,
  isShowAlert = false
) => {
  const [alertMessage, setAlertMessage] = useState<IAlertMessage>({
    type: SUCCESS,
    message: "",
  });

  useEffect(() => {
    if (isShowAlert) {
      setAlertMessage({ type, message: message || "" });
    }
  }, [type, message, isShowAlert]);

  return { alertMessage, setAlertMessage };
};
