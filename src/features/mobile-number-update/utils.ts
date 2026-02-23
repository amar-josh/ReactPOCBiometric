import * as yup from "yup";

import alertIcon from "@/assets/images/alert.svg";
import { MOBILE_NUMBER_REGEX } from "@/constants/regex";
import translator from "@/i18n/translator";

import { IMobileNumberUpdateFailureCheckpoints } from "./types";
export const mobileNumberUpdateFailureCheckpoints: IMobileNumberUpdateFailureCheckpoints =
  {
    AADHAR_NOT_AVAILABLE: {
      title: "checkpoints.aadhaarDetailsMissingTitle",
      message: "",
      icon: alertIcon,
    },
    ACCOUNT_DORMANCY: {
      title: "checkpoints.notEligibleForInstaTitle",
      message: "checkpoints.accountDormant",
      icon: alertIcon,
    },
    ACCOUNT_INACTIVE_OR_BLOCKED: {
      title: "checkpoints.notEligibleForInstaTitle",
      message: "checkpoints.accountInactiveOrBlocked",
      icon: alertIcon,
    },
    ACCOUNT_FREEZE: {
      title: "checkpoints.notEligibleForInstaTitle",
      message: "checkpoints.accountFreeze",
      icon: alertIcon,
    },
  };

export const mobileNumberUpdateFormSchema = yup.object().shape({
  mobileNumber: yup
    .string()
    .required(translator("validations.mobileNumber.matchesRegex"))
    .matches(
      MOBILE_NUMBER_REGEX,
      translator("validations.mobileNumber.matchesRegex")
    ),
});
