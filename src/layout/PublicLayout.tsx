import { Outlet } from "react-router";

import ErrorBoundaryWrapper from "@/components/common/ErrorBoundaryWrapper";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";

function PublicLayout() {
  return (
    <>
      <Header />
      <main className="flex flex-col flex-1 overflow-auto">
        <ErrorBoundaryWrapper>
          <Outlet />
        </ErrorBoundaryWrapper>
        <Footer className="text-gray-500 mt-auto" />
      </main>
    </>
  );
}

export default PublicLayout;
