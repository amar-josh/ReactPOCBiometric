import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";

import ErrorBoundaryWrapper from "@/components/common/ErrorBoundaryWrapper";
import Footer from "@/components/common/Footer";
import HeaderWithAuth from "@/components/common/HeaderWithAuth";
import { SESSION_STORAGE_KEY } from "@/constants/globalConstant";
import ScrollContext from "@/context/scroll-context";
import { useEmpInfo } from "@/features/adfs-login/hooks";
import { useHandleProtectedBackNavigation } from "@/hooks/useHandleProtectedBackNavigation";
import { useHandleProtectedRefreshPage } from "@/hooks/useHandleProtectedRefreshPage";
import useInactivityLogout from "@/hooks/useInactivityLogout";
import { useScrollProvider } from "@/hooks/useScrollProvider";
import { getSessionStorageData } from "@/lib/sessionStorage";
import { ROUTES } from "@/routes/constants";
import { clearToken, getIsTokenSet } from "@/services/api.service";

function Layout() {
  const navigate = useNavigate();
  useHandleProtectedBackNavigation();
  useHandleProtectedRefreshPage();

  useInactivityLogout(getIsTokenSet());
  const { mainContentRef, scrollToContentTop } = useScrollProvider();

  const empInfo = useEmpInfo();

  const handleLogout = () => {
    clearToken();
    navigate(ROUTES.LOGIN);
  };

  useEffect(() => {
    const token = getSessionStorageData<string>(SESSION_STORAGE_KEY.TOKEN);
    if (!token) {
      navigate(ROUTES.LOGIN);
    }
  }, [navigate]);

  return (
    <>
      <ErrorBoundaryWrapper>
        <HeaderWithAuth
          name={empInfo?.empName}
          branch={empInfo?.branchCode}
          handleLogout={handleLogout}
        />
      </ErrorBoundaryWrapper>

      <main className="flex flex-col flex-1 overflow-auto" ref={mainContentRef}>
        <ScrollContext.Provider value={{ scrollToContentTop }}>
          <ErrorBoundaryWrapper>
            <Outlet />
          </ErrorBoundaryWrapper>
        </ScrollContext.Provider>
        <Footer className="text-gray-500 mt-auto" />
      </main>
    </>
  );
}

export default Layout;
