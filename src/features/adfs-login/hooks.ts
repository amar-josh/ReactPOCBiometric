import { useMemo } from "react";

import { SESSION_STORAGE_KEY } from "@/constants/globalConstant";
import { getSessionStorageData } from "@/lib/sessionStorage";

import { IEmpInfo } from "./types";

export const useEmpInfo = () => {
  return useMemo(
    () => getSessionStorageData<IEmpInfo>(SESSION_STORAGE_KEY.EMP_INFO),
    []
  );
};
