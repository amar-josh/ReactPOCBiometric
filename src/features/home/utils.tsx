import dailpad from "@/assets/images/dialpad.svg";
import id from "@/assets/images/id.svg";
import kyc from "@/assets/images/kyc.svg";
import map from "@/assets/images/map.svg";

import { DASHBOARD_KEYS } from "../re-kyc/constants";

export const getIconBasedOnModuleKey = (moduleKey: string) => {
  switch (moduleKey) {
    case DASHBOARD_KEYS.MOBILE_NUMBER_UPDATE:
      return dailpad;
    case DASHBOARD_KEYS.ADDRESS_UPDATE:
      return map;
    case DASHBOARD_KEYS.PAN_UPDATE:
      return id;
    case DASHBOARD_KEYS.RE_KYC:
      return kyc;
    default:
      return kyc;
  }
};

export const homeListJson = [
  {
    label: "Mobile Number Update",
    icon: dailpad,
    description: "Lorem ipsum dolor sit amet, consect etu. met, consect etu.",
  },
  {
    label: "Address Update",
    icon: map,
    description: "Lorem ipsum dolor sit amet, consect etu. met, consect etu.",
  },
  {
    label: "PAN Number Update",
    icon: id,
    description: "Lorem ipsum dolor sit amet, consect etu. met, consect etu.",
  },
  {
    label: "Re-KYC Update",
    icon: kyc,
    description: "Lorem ipsum dolor sit amet, consect etu. met, consect etu.",
  },
];
