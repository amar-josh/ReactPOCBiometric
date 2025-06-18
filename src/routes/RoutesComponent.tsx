import { BrowserRouter, Route, Routes } from "react-router";

import Layout from "@/layout";

import PrivateRoute from "./components/PrivateRoutes";
import { privateRoutes, publicRoute } from "./routesConfig";
console.log(
  "import.meta.env.VITE_BASE_URL in route file",
  import.meta.env.VITE_BASE_URL
);
const RoutesComponent = () => {
  return (
    <BrowserRouter basename={import.meta.env.VITE_BASE_URL}>
      <Routes>
        <Route path="/" element={<Layout />}>
          {publicRoute.map((route) => (
            <Route path={route.path} element={route.element} />
          ))}
          {privateRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<PrivateRoute element={route.element} />}
            />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesComponent;
