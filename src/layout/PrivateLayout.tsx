import { Outlet, useNavigate } from "react-router";

import ErrorBoundaryWrapper from "@/components/common/ErrorBoundaryWrapper";
import Footer from "@/components/common/Footer";
import HeaderWithAuth from "@/components/common/HeaderWithAuth";
import ScrollContext from "@/context/scroll-context";
import { useHandleProtectedBackNavigation } from "@/hooks/useHandleProtectedBackNavigation";
import { useHandleProtectedRefreshPage } from "@/hooks/useHandleProtectedRefreshPage";
import useInactivityLogout from "@/hooks/useInactivityLogout";
import { useScrollProvider } from "@/hooks/useScrollProvider";
import { ROUTES } from "@/routes/constants";
import { clearToken, getIsTokenSet } from "@/services/api.service";

function Layout() {
  const navigate = useNavigate();
  useHandleProtectedBackNavigation();
  useHandleProtectedRefreshPage();

  useInactivityLogout(getIsTokenSet());
  const { mainContentRef, scrollToContentTop } = useScrollProvider();

  const handleLogout = () => {
    // TODO:replace this with logout api
    clearToken();
    navigate(ROUTES.LOGIN);
  };

  return (
    <>
      {/*TODO: Integrate the actual api values */}
      <ErrorBoundaryWrapper>
        <HeaderWithAuth
          name={"John Doe"}
          branch={"123456"}
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
