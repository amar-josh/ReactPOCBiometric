import * as yup from "yup";

import {
  IAddress,
  IFormDetailsSchema,
  ILabelValue,
  IreKYCFailureCheckpointElement,
  IreKYCFailureCheckpoints,
} from "@/features/re-kyc/types";
import translator from "@/i18n/translator";

import alertIcon from "./../../assets/images/alert.svg";

export const otherDetailsValidationFormSchema: yup.ObjectSchema<any> = yup
  .object()
  .shape({
    occupation: yup
      .string()
      .required(translator("reKyc.errorMessages.occupationRequired")),
    residentType: yup
      .string()
      .required(translator("reKyc.errorMessages.residenceTypeRequired")),
    incomeRange: yup
      .string()
      .required(translator("reKyc.errorMessages.annualIncomeRequired")),
  });

export const getLabelBasedOnValue = (
  optionsList: ILabelValue[],
  value: string | number
) =>
  optionsList.find((option: ILabelValue) => option.value == value)?.label || "";

export const formatAddress = (addressObj: IAddress) => {
  if (!addressObj) return "";
  const {
    addressLine1,
    addressLine2,
    addressLine3,
    city,
    state,
    country,
    pinCode,
  } = addressObj;

  const lineFields = [addressLine1, addressLine2, addressLine3]
    .filter(Boolean)
    .map((line) => `${line}`)
    .join("\n");

  const locationFields = [city, state, country]
    .filter(Boolean)
    .map((field) => `${field},`)
    .join(" ");

  const inlinePart = `${locationFields} ${pinCode}`.trim();

  return [lineFields, inlinePart].filter(Boolean).join("\n");
};

export const reKycFormSchema: IFormDetailsSchema[] = [
  {
    label: "formFields.customerName",
    value: "customerName",
    type: "text",
    defaultValue: "",
    readOnly: true,
  },
  {
    label: "formFields.customerID",
    value: "customerID",
    type: "text",
    defaultValue: "",
    readOnly: true,
  },
  {
    label: "formFields.idProofDocument",
    value: "kycIdDocType",
    type: "text",
    defaultValue: "",
    readOnly: true,
  },
  {
    label: "formFields.idNumber",
    value: "kycIdDocNumber",
    type: "text",
    defaultValue: "",
    readOnly: true,
  },
  {
    label: "formFields.addressProofDocument",
    value: "addressIdDocType",
    type: "text",
    defaultValue: "",
    readOnly: true,
  },
  {
    label: "formFields.idNumber",
    value: "addressIdDocNumber",
    type: "text",
    defaultValue: "",
    readOnly: true,
  },
  {
    label: "formFields.mobileNumber",
    value: "mobileNo",
    type: "number",
    defaultValue: "",
    readOnly: true,
  },
  {
    label: "formFields.emailId",
    value: "emailId",
    type: "email",
    defaultValue: "",
    readOnly: true,
  },
  {
    label: "formFields.permanentAddress",
    value: "permanentAddress",
    type: "textarea",
    defaultValue: "",
    readOnly: true,
  },
  {
    label: "formFields.communicationAddress",
    value: "communicationAddress",
    type: "textarea",
    defaultValue: "",
    readOnly: true,
  },
];

export const otherDetailsFormSchema: IFormDetailsSchema[] = [
  {
    label: "formFields.occupation",
    value: "occupation",
    type: "combobox",
    defaultValue: null,
  },
  {
    label: "formFields.grossAnnualIncome",
    value: "incomeRange",
    type: "select",
    defaultValue: null,
  },
  {
    label: "formFields.residenceType",
    value: "residentType",
    type: "select",
    defaultValue: null,
  },
];

export const otherDetailsReadOnlySchema: IFormDetailsSchema[] = [
  {
    type: "text",
    label: "formFields.occupation",
    value: "occupation",
    defaultValue: "",
    readOnly: true,
  },
  {
    type: "text",
    label: "formFields.grossAnnualIncome",
    value: "incomeRange",
    defaultValue: "",
    readOnly: true,
  },
  {
    type: "text",
    label: "formFields.residenceType",
    value: "residentType",
    defaultValue: "",
    readOnly: true,
  },
];

const commonAccountTypeError: IreKYCFailureCheckpointElement = {
  title: "checkpoints.notEligibleForInstaTitle",
  message: "checkpoints.notEligibleForInstaMessage",
  icon: alertIcon,
};

export const reKYCFailureCheckpoints: IreKYCFailureCheckpoints = {
  IS_INDIVIDUAL: commonAccountTypeError,
  AGE_GROUP_MINOR: commonAccountTypeError,
  HIGH_RISK: commonAccountTypeError,
  PAN_FORM_SIXTY_MISSING: commonAccountTypeError,
  MOBILE_NUMBER_MISSING: {
    title: "checkpoints.notEligibleForInstaTitle",
    message: "checkpoints.mobileNumberUpdateNeededMessage",
    icon: alertIcon,
  },
  ACCOUNT_DORMANCY: {
    title: "checkpoints.notEligibleForInstaTitle",
    message: "checkpoints.accountDormant",
    icon: alertIcon,
  },
  AADHAAR_MISSING: {
    title: "checkpoints.aadhaarDetailsMissingTitle",
    message: "",
    icon: alertIcon,
  },
  AADHAAR_REFERENCE_NO_MISSING: {
    title: "checkpoints.aadhaarReferenceNoMissing",
    message: "checkpoints.aadhaarReferenceNoMissingMessage",
    icon: alertIcon,
  },
};
