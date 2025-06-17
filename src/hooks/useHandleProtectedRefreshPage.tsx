import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

import { SESSION_STORAGE_KEY } from "@/constants/globalConstant";
import { PRIVATE_ROUTES, ROUTES } from "@/routes/constants";

export const useHandleProtectedRefreshPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isProtectedRoute = (pathname: string) => {
    return PRIVATE_ROUTES.some((protectedPath) =>
      pathname.startsWith(protectedPath)
    );
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isProtectedRoute(location.pathname)) {
        sessionStorage.setItem(
          SESSION_STORAGE_KEY.RELOAD_PROTECTED_ROUTE,
          SESSION_STORAGE_KEY.RELOAD_PROTECTED_ROUTE_VALUE
        );

        e.preventDefault();
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [location.pathname]);

  useEffect(() => {
    if (
      sessionStorage.getItem(SESSION_STORAGE_KEY.RELOAD_PROTECTED_ROUTE) ===
      SESSION_STORAGE_KEY.RELOAD_PROTECTED_ROUTE_VALUE
    ) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY.RELOAD_PROTECTED_ROUTE);
      navigate(ROUTES.HOME, { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
};
