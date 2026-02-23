import { Check, IdCard, User, UserCheck } from "lucide-react";

import aadhaarIcon from "@/assets/images/aadhaarGray.svg";
import dailpadIcon from "@/assets/images/dialpad.svg";
import eligibilityIcon from "@/assets/images/eligibility.svg";
import riskIcon from "@/assets/images/risk.svg";

export const CUSTOMER_SEARCH_OPTIONS = [
  {
    label: "cifId",
    value: "cif",
  },
  {
    label: "mobileNumber",
    value: "mobile",
  },
];

export const CIF_LENGTH = 9;

export const ACCOUNT_STATUS = {
  DORMANT: "ACCOUNT DORMANT",
  FROZEN: "ACCOUNT FROZEN",
};

export const ACCOUNT_STATUS_LABELS = {
  [ACCOUNT_STATUS.DORMANT]: "Dormant Account",
  [ACCOUNT_STATUS.FROZEN]: "Freeze Account",
};

export const ELIGIBILITY_CARD_CONTENT = {
  reKyc: {
    title: "eligibilityForReKyc.title",
    rightImage: eligibilityIcon,
    rightImageAlt: "eligibility_icon",
    items: [
      {
        icon: User,
        alt: "user_icon",
        text: "eligibilityForReKyc.eligibilityOne",
      },
      {
        icon: aadhaarIcon,
        alt: "aadhaar_icon",
        text: "eligibilityForReKyc.eligibilityTwo",
      },
      {
        icon: riskIcon,
        alt: "risk_icon",
        text: "eligibilityForReKyc.eligibilityThree",
      },
    ],
  },
  mobileNumberUpdate: {
    title: "eligibilityForMobileNumberUpdate.title",
    rightImage: dailpadIcon,
    rightImageAlt: "dailpad_icon",
    items: [
      {
        icon: User,
        alt: "user_icon",
        text: "eligibilityForMobileNumberUpdate.eligibilityOne",
      },
      {
        icon: UserCheck,
        alt: "Individual_icon",
        text: "eligibilityForMobileNumberUpdate.eligibilityTwo",
      },
      {
        icon: IdCard,
        alt: "compliant_icon",
        text: "eligibilityForMobileNumberUpdate.eligibilityThree",
      },
      {
        icon: Check,
        alt: "active_icon",
        text: "eligibilityForMobileNumberUpdate.eligibilityFour",
      },
    ],
  },
};
