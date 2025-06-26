import { lazy } from "react";

const PageNotFound = lazy(() => import("@/components/common/PageNotFound"));
const SessionExpired = lazy(() => import("@/components/common/SessionExpired"));
const Unauthorized = lazy(() => import("@/components/common/Unauthorized"));
const Home = lazy(() => import("@/features/home"));
const MobileNumberUpdate = lazy(
  () => import("@/features/mobile-number-update")
);
const LinkVerification = lazy(
  () => import("@/features/mobile-number-update/components/LinkVerification")
);
const ReKYC = lazy(() => import("@/features/re-kyc"));

import { ROUTES } from "./constants";

const {
  HOME,
  RE_KYC,
  MOBILE_NUMBER_UPDATE,
  VERIFY_LINK,
  UNAUTHORIZED,
  SESSION_EXPIRED,
  PAGE_NOT_FOUND,
} = ROUTES;

export const privateRoutes = [
  {
    path: HOME,
    element: <Home />,
  },
  {
    path: RE_KYC,
    element: <ReKYC />,
  },
  {
    path: MOBILE_NUMBER_UPDATE,
    element: <MobileNumberUpdate />,
  },
];

export const publicRoute = [
  {
    path: VERIFY_LINK,
    element: <LinkVerification />,
  },
  {
    path: UNAUTHORIZED,
    element: <Unauthorized />,
  },
  {
    path: SESSION_EXPIRED,
    element: <SessionExpired />,
  },
  {
    path: PAGE_NOT_FOUND,

    element: <PageNotFound />,
  },
];
