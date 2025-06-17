import { Outlet, useNavigate } from "react-router";

import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import HeaderWithAuth from "@/components/common/HeaderWithAuth";
import ScrollContext from "@/context/scroll-context";
import { useHandleProtectedBackNavigation } from "@/hooks/useHandleProtectedBackNavigation";
import { useHandleProtectedRefreshPage } from "@/hooks/useHandleProtectedRefreshPage";
import useInactivityLogout from "@/hooks/useInactivityLogout";
import { useScrollProvider } from "@/hooks/useScrollProvider";
import { ROUTES } from "@/routes/constants";
import { getIsTokenSet } from "@/services/api.service";

function Layout() {
  const navigate = useNavigate();
  useHandleProtectedBackNavigation();
  useHandleProtectedRefreshPage();

  useInactivityLogout(getIsTokenSet());
  const { mainContentRef, scrollToContentTop } = useScrollProvider();

  const handleLogout = () => {
    // TODO:replace this with logout api
    navigate(ROUTES.RE_KYC);
  };

  //TODO:replace hardcoded value with api response
  const isLoggedIn = true;

  return (
    <>
      {isLoggedIn ? (
        <HeaderWithAuth
          name={"John Doe"}
          branch={"123456"}
          handleLogout={handleLogout}
        />
      ) : (
        <Header />
      )}

      <main className="flex flex-col flex-1 overflow-auto" ref={mainContentRef}>
        <ScrollContext.Provider value={{ scrollToContentTop }}>
          <Outlet />
        </ScrollContext.Provider>
        <Footer className="text-gray-500 mt-auto" />
      </main>
    </>
  );
}

export default Layout;
