import PageNotFound from "@/components/common/PageNotFound";
import SessionExpired from "@/components/common/SessionExpired";
import Unauthorized from "@/components/common/Unauthorized";
import Home from "@/features/home";
import Login from "@/features/login";
import MobileNumberUpdate from "@/features/mobile-number-update";
import LinkVerification from "@/features/mobile-number-update/components/LinkVerification";
import ReKYC from "@/features/re-kyc";

import { ROUTES } from "./constants";

const {
  LOGIN,
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
    path: LOGIN,
    element: <Login />,
  },
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
