import { useEffect } from "react";
import { useLocation, useNavigate, useNavigationType } from "react-router";

import { PRIVATE_ROUTES, ROUTES } from "@/routes/constants";

export const useHandleProtectedBackNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationType = useNavigationType();

  const isProtectedRoute = (pathname: string) => {
    return PRIVATE_ROUTES.some((protectedPath) =>
      pathname.startsWith(protectedPath)
    );
  };

  useEffect(() => {
    if (navigationType === "POP" && isProtectedRoute(location.pathname)) {
      navigate(ROUTES.HOME, { replace: true });
    }
  }, [location, navigationType, navigate]);
};
