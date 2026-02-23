import {
  ACCOUNT_NUMBER_REGEX,
  CIF_LENGTH_REGEX,
  MOBILE_NUMBER_REGEX,
} from "@/constants/regex";
import translator from "@/i18n/translator";
import * as yup from "yup";
import { ICustomerSearchFormValues } from "./types";

export const customerSearchFormSchema: yup.ObjectSchema<ICustomerSearchFormValues> =
  yup.object({
    searchBy: yup.string().oneOf(["mobile", "cif", "account"]).required(),
    mobile: yup.string().when("searchBy", {
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

    cif: yup.string().when("searchBy", {
      is: "cif",
      then: (schema) =>
        schema
          .required(translator("validations.cif.matchesRegex"))
          .matches(
            CIF_LENGTH_REGEX,
            translator("validations.cif.matchesRegex")
          ),
      otherwise: (schema) => schema.optional(),
    }),

    account: yup.string().when("searchBy", {
      is: "account",
      then: (schema) =>
        schema
          .required(translator("validations.account.matchesRegex"))
          .matches(
            ACCOUNT_NUMBER_REGEX,
            translator("validations.account.matchesRegex")
          ),
      otherwise: (schema) => schema.optional(),
    }),
  });
