import * as yup from "yup";

import fingerprintFailure from "@/assets/images/fingerPrintError.svg";
import fingerprint from "@/assets/images/fingerPrintInfo.svg";
import success from "@/assets/images/success.svg";
import warning from "@/assets/images/warning.svg";
import xicon from "@/assets/images/x-circle.svg";
import {
  IAddress,
  IFormDetailsSchema,
  ILabelValue,
  IreKYCFailureCheckpointElement,
  IreKYCFailureCheckpoints,
} from "@/features/re-kyc/types";
import translator from "@/i18n/translator";

import alertIcon from "./../../assets/images/alert.svg";
import { BIOMETRIC_OPERATIONS } from "./constants";

interface IGetBiometricCardDetailsProps {
  statusKey: string | undefined;
  count: number;
}

export const otherDetailsValidationSchema = yup.object().shape({
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

export const getBiometricCardDetails = ({
  statusKey,
  count,
}: IGetBiometricCardDetailsProps) => {
  switch (statusKey) {
    case BIOMETRIC_OPERATIONS.CHECK_RD_SERVICE_STATUS:
      return {
        title: "Searching RD Service",
        message: "reKyc.biometric.biometricServiceChcek",
        icon: fingerprint,
        key: "retryRDService",
      };
    case BIOMETRIC_OPERATIONS.CHECK_RD_SERVICE_ERROR:
      return {
        title: "RD Service Not Available",
        message: "reKyc.biometric.biometricServiceNotFoundMessage",
        icon: fingerprintFailure,
        buttonText: "Retry",
        key: "retryRDService",
      };
    case BIOMETRIC_OPERATIONS.DEVICE_NOT_READY:
      return {
        title: "reKyc.biometric.confirmUsingFingerprint",
        message: "reKyc.biometric.connectBiometricDevice",
        icon: fingerprintFailure,
        buttonText: "Retry",
        key: "retryDevice",
      };
    case BIOMETRIC_OPERATIONS.READY_TO_CAPTURE:
      return {
        title: "reKyc.biometric.confirmUsingFingerprint",
        message: "reKyc.biometric.touchFingerprintSensor",
        icon: fingerprint,
        buttonText: "Capture",
        key: "capture",
      };
    case BIOMETRIC_OPERATIONS.SUCCESS:
      return {
        title: "reKyc.biometric.verified",
        message: "reKyc.biometric.verifiedSuccess",
        icon: success,
        buttonText: "Close",
        key: "close",
      };
    case BIOMETRIC_OPERATIONS.NO_FINGER_FOUND:
      return {
        title: "No Finger found",
        message:
          "No finger is placed on device, Please make sure to place your finger on the device",
        icon: fingerprintFailure,
        buttonText: "Retry",
        key: "retryDevice",
      };
    case BIOMETRIC_OPERATIONS.ATTEMPT_FAILED:
      if (count === 2) {
        return {
          title: "reKyc.biometric.aadhaarAuthFailed",
          message: "reKyc.biometric.aadhaarAuthFailedOnce",
          icon: warning,
          buttonText: "Re-Capture",
          key: "recapture",
        };
      } else if (count === 1) {
        return {
          title: "reKyc.biometric.aadhaarAuthFailed",
          message: "reKyc.biometric.aadhaarAuthFailedTwice",
          icon: warning,
          buttonText: "Re-Capture",
          key: "recapture",
        };
      } else if (count === 0) {
        return {
          title: "reKyc.biometric.aadhaarAuthFailed",
          message: "reKyc.biometric.formBasedProcess",
          icon: xicon,
          buttonText: "Back to home",
          key: "home",
        };
      } else {
        return {};
      }
    case BIOMETRIC_OPERATIONS.ATTEMPT_LIMIT_CROSSED:
      return {
        title: "reKyc.biometric.aadhaarAuthFailed",
        message: "reKyc.biometric.formBasedProcess",
        icon: xicon,
        buttonText: "Back to home",
        key: "home",
      };
    default:
      return {
        title: "reKyc.errorMessages.tryAgain",
        message: "reKyc.errorMessages.somethingWentWrong",
        icon: xicon,
        buttonText: "Re-capture",
        key: "capture",
        isError: true,
      };
  }
};

export const getLabelBasedOnValue = (
  optionsList: ILabelValue[],
  value: string | number
) =>
  optionsList.find((option: ILabelValue) => option.value == value)?.label || "";

export const formatAddress = (addressObj: IAddress) => {
  const { addressLine1, addressLine2, city, state, country, pincode } =
    addressObj || {};
  return [addressLine1, addressLine2, city, state, country, pincode].join(", ");
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
    value: "permenantAddress",
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
    label: "formFields.occupationRequired",
    value: "occupation",
    type: "combobox",
    defaultValue: null,
  },
  {
    label: "formFields.grossAnnualIncomeRequired",
    value: "incomeRange",
    type: "select",
    defaultValue: null,
  },
  {
    label: "formFields.residenceTypeRequired",
    value: "residentType",
    type: "select",
    defaultValue: null,
  },
];

export const otherDetailsReadOnlySchema: ILabelValue[] = [
  {
    label: "formFields.occupation",
    value: "occupation",
  },
  {
    label: "formFields.grossAnnualIncome",
    value: "incomeRange",
  },
  {
    label: "formFields.residenceType",
    value: "residentType",
  },
];

const commonAccountTypeError: IreKYCFailureCheckpointElement = {
  title: translator("checkpoints.notEligibleForInstaTitle"),
  message: translator("checkpoints.notEligibleForInstaMessage"),
  icon: alertIcon,
};

export const reKYCFailureCheckpoints: IreKYCFailureCheckpoints = {
  ACCOUNT_IS_INDIVIDUAL: commonAccountTypeError,
  AGE_GROUP_MINOR: commonAccountTypeError,
  ACCOUNT_LOW_RISK: commonAccountTypeError,
  MOBILE_NUMBER_MISSING: {
    title: translator("checkpoints.mobileNumberMissingTitle"),
    message: translator("checkpoints.mobileNumberUpdateNeededMessage"),
    icon: alertIcon,
  },
  // TODO - Get message from Sai and update pan accordingly.
  PAN_FORM_SIXTY_MISSING: commonAccountTypeError,
  // TODO - update message from sai and update dormant accordingly.
  DORMANT_ACCOUNT: commonAccountTypeError,
  AADHAAR_MISSING_OR_INVALID: {
    title: translator("checkpoints.aadhaarDetailsMissingTitle"),
    message: "",
    icon: alertIcon,
  },
};
