import alertIcon from "@/assets/images/alert.svg";
import translator from "@/i18n/translator";

import { IMobileNumberUpdateFailureCheckpoints } from "./types";
export const mobileNumberUpdateFailureCheckpoints: IMobileNumberUpdateFailureCheckpoints =
  {
    AADHAR_NOT_AVAILABLE: {
      title: translator("checkpoints.notEligibleForInstaTitle"),
      message: translator("checkpoints.aadharNotAvailable"),
      icon: alertIcon,
    },
    ACCOUNT_DORMANCY: {
      title: translator("checkpoints.notEligibleForInstaTitle"),
      message: translator("checkpoints.accountDormant"),
      icon: alertIcon,
    },
    ACCOUNT_INACTIVE_OR_BLOCKED: {
      title: translator("checkpoints.notEligibleForInstaTitle"),
      message: translator("checkpoints.accountInactiveOrBlocked"),
      icon: alertIcon,
    },
  };
