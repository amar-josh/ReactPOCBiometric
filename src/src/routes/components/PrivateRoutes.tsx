import type { JSX } from "react";
import { Navigate } from "react-router";

import { getIsTokenSet } from "@/services/api.service";

import { ROUTES } from "../constants";

const PrivateRoute = ({ element }: { element: JSX.Element }) => {
  return getIsTokenSet() ? element : <Navigate to={ROUTES.LOGIN} replace />;
};

export default PrivateRoute;
