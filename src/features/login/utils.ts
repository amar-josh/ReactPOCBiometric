import * as yup from "yup";

import { MIN_USER_NAME_LENGTH } from "@/constants/globalConstant";
import { PASSWORD_REGEX } from "@/constants/regex";
import translator from "@/i18n/translator";

export const loginFormSchema = yup.object({
  username: yup
    .string()
    .required(translator("validations.username.required"))
    .min(
      MIN_USER_NAME_LENGTH,
      translator("validations.username.userNameMinimumLength")
    ),
  // .matches(
  //   ALPHANUMERIC_REGEX,
  //   translator("validations.username.enterValidUserId")
  // ),
  password: yup
    .string()
    .required(translator("validations.password.required"))
    .matches(PASSWORD_REGEX, translator("validations.password.matchesRegex")),
});
