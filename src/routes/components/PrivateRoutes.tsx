import type { JSX } from "react";
import { Navigate } from "react-router";

import { SESSION_STORAGE_KEY } from "@/constants/globalConstant";
import { getSessionStorageData } from "@/lib/sessionStorage";

import { ROUTES } from "../constants";

const PrivateRoute = ({ element }: { element: JSX.Element }) => {
  const token = getSessionStorageData<string>(SESSION_STORAGE_KEY.TOKEN);
  return token ? element : <Navigate to={ROUTES.LOGIN} replace />;
};

export default PrivateRoute;
