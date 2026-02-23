import * as yup from "yup";

import { MOBILE_NUMBER_REGEX, VALID_EMAIL_REGEX } from "@/constants/regex";
import translator from "@/i18n/translator";

import { IMobileOrEmailVerificationForm } from "./types";

// Yup validation schema
export const mobileOrEmailVerificationFormSchema: yup.ObjectSchema<IMobileOrEmailVerificationForm> =
  yup.object({
    identifier: yup.string().required().oneOf(["mobile", "email"]),
    mobile: yup.string().when("identifier", {
      is: "mobile",
      then: (schema) =>
        schema
          .required(translator("validations.mobileNumber.matchesRegex"))
          .matches(
            MOBILE_NUMBER_REGEX,
            translator("validations.mobileNumber.matchesRegex")
          ),
      otherwise: (schema) => schema.optional(),
    }),
    email: yup.string().when("identifier", {
      is: "email",
      then: (schema) =>
        schema
          .required(translator("validations.email.required"))
          .matches(
            VALID_EMAIL_REGEX,
            translator("validations.email.enterValidEmail")
          ),
      otherwise: (schema) => schema.optional(),
    }),
  });

export const getTableHeaders = (isMobileNumber: boolean) => {
  return [
    {
      label: isMobileNumber ? "mobileNumber" : "email",
      key: isMobileNumber ? "mobile" : "email",
    },
    { label: "mobileEmailVerification.verificationStatus", key: "status" },
    { label: "mobileEmailVerification.verifiedOn", key: "date" },
  ];
};
