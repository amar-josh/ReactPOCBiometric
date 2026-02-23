import dailpad from "@/assets/images/dialpad.svg";
import kyc from "@/assets/images/kyc.svg";
import map from "@/assets/images/map.svg";
import { ROUTES } from "@/routes/constants";

import { IInstaServiceCards } from "./types";

export const INSTA_SERVICES_CARDS: IInstaServiceCards[] = [
  {
    key: "re_kyc",
    name: "home.instaServices.reKYCTitle",
    description: "home.instaServices.reKYCDescription",
    icon: kyc,
    path: ROUTES.RE_KYC,
  },
  {
    key: "mobile_number_update",
    name: "home.instaServices.mobileNumberUpdateTitle",
    description: "home.instaServices.mobileNumberUpdateDescription",
    icon: dailpad,
    path: ROUTES.MOBILE_NUMBER_UPDATE,
  },
  {
    key: "mobile_email_verification",
    name: "home.instaServices.mobileEmailVerificationTitle",
    description: "home.instaServices.mobileEmailVerificationDescription",
    icon: map,
    path: ROUTES.MOBILE_EMAIL_VERIFICATION,
  },
];
