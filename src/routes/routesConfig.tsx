import { lazy } from "react";

import ADFSLogin from "@/features/adfs-login";
const PageNotFound = lazy(() => import("@/components/common/PageNotFound"));
const SessionExpired = lazy(() => import("@/components/common/SessionExpired"));
const Unauthorized = lazy(() => import("@/components/common/Unauthorized"));
const Home = lazy(() => import("@/features/home"));
const MobileNumberUpdate = lazy(
  () => import("@/features/mobile-number-update")
);

const MobileEmailVerification = lazy(
  () => import("@/features/mobile-email-verification")
);

const ReKYC = lazy(() => import("@/features/re-kyc"));

import { ROUTES } from "./constants";

const {
  HOME,
  RE_KYC,
  MOBILE_NUMBER_UPDATE,
  UNAUTHORIZED,
  SESSION_EXPIRED,
  PAGE_NOT_FOUND,
  MOBILE_EMAIL_VERIFICATION,
  ADFS_AUTH,
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
  {
    path: MOBILE_EMAIL_VERIFICATION,
    element: <MobileEmailVerification />,
  },
];

export const publicRoute = [
  {
    path: ADFS_AUTH,
    element: <ADFSLogin />,
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
