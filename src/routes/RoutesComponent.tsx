import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

import ErrorBoundaryWrapper from "@/components/common/ErrorBoundaryWrapper";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import Login from "@/features/login";
import ReKYC from "@/features/re-kyc";
import PrivateLayout from "@/layout/PrivateLayout";
import PublicLayout from "@/layout/PublicLayout";

import PrivateRoute from "./components/PrivateRoutes";
import { ROUTES } from "./constants";
import { privateRoutes, publicRoute } from "./routesConfig";

const RoutesComponent = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/re-kyc" element={<ReKYC />} />
      </Routes>
      {/* <Suspense fallback={<FullScreenLoader />}>
        <Routes>
          <Route
            path={ROUTES.LOGIN}
            element={
              <ErrorBoundaryWrapper>
                <Login />
              </ErrorBoundaryWrapper>
            }
          />
          <Route path="/" element={<PublicLayout />}>
            {publicRoute.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>
          <Route path="/" element={<PrivateLayout />}>
            {privateRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<PrivateRoute element={route.element} />}
              />
            ))}
          </Route>
        </Routes>
      </Suspense> */}
    </BrowserRouter>
  );
};

export default RoutesComponent;
