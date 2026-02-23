import fingerprintFailure from "@/assets/images/fingerPrintError.svg";
import fingerprint from "@/assets/images/fingerPrintInfo.svg";
import success from "@/assets/images/success.svg";
import warning from "@/assets/images/warning.svg";
import xicon from "@/assets/images/x-circle.svg";
import { BIOMETRIC_OPERATIONS } from "@/shared/biometric/constants";
import { IGetBiometricCardDetailsProps } from "@/shared/biometric/types";

export const getBiometricCardDetails = ({
  statusKey,
  count,
  message,
}: IGetBiometricCardDetailsProps) => {
  switch (statusKey) {
    case BIOMETRIC_OPERATIONS.CHECK_RD_SERVICE_STATUS:
      return {
        title: "reKyc.biometric.searchingForDevice",
        message: "reKyc.biometric.pleaseWait",
        icon: fingerprint,
        key: "retryRDService",
      };
    case BIOMETRIC_OPERATIONS.CHECK_RD_SERVICE_ERROR:
      return {
        title: "reKyc.biometric.deviceNotFound",
        message: "reKyc.biometric.connectBiometricDevice",
        icon: fingerprintFailure,
        buttonText: "button.retry",
        key: "retryRDService",
      };
    case BIOMETRIC_OPERATIONS.DEVICE_USED_BY_ANOTHER_APPLICATION:
      return {
        title: "reKyc.biometric.deviceNotFound",
        message: "reKyc.biometric.deviceUsedByOtherAppMessage",
        icon: fingerprintFailure,
        buttonText: "button.retry",
        key: "retryRDService",
      };
    case BIOMETRIC_OPERATIONS.DEVICE_NOT_READY:
      return {
        title: "reKyc.biometric.deviceNotFound",
        message: "reKyc.biometric.connectBiometricDevice",
        icon: fingerprintFailure,
        buttonText: "button.retry",
        key: "retryDevice",
      };
    case BIOMETRIC_OPERATIONS.READY_TO_CAPTURE:
      return {
        title: "reKyc.biometric.confirmUsingFingerprint",
        message: "reKyc.biometric.touchFingerprintSensor",
        icon: fingerprint,
        buttonText: "button.capture",
        key: "capture",
      };
    case BIOMETRIC_OPERATIONS.SUCCESS:
      return {
        title: "reKyc.biometric.verified",
        message: "reKyc.biometric.verifiedSuccess",
        icon: success,
        buttonText: "button.close",
        key: "close",
      };
    case BIOMETRIC_OPERATIONS.NO_FINGER_FOUND:
      return {
        title: "reKyc.biometric.noFingerFound",
        message:
          "No finger is placed on device, Please make sure to place your finger on the device",
        icon: fingerprintFailure,
        buttonText: "button.retry",
        key: "retryDevice",
      };
    case BIOMETRIC_OPERATIONS.ATTEMPT_FAILED:
      if (count === 2) {
        return {
          title: "reKyc.biometric.aadhaarAuthFailed",
          message: "reKyc.biometric.aadhaarAuthFailedOnce",
          icon: warning,
          buttonText: "button.recapture",
          key: "recapture",
        };
      } else if (count === 1) {
        return {
          title: "reKyc.biometric.aadhaarAuthFailed",
          message: "reKyc.biometric.aadhaarAuthFailedTwice",
          icon: warning,
          buttonText: "button.recapture",
          key: "recapture",
        };
      } else {
        return {
          title: "reKyc.biometric.aadhaarAuthFailed",
          message: "reKyc.biometric.formBasedProcess",
          icon: xicon,
          buttonText: "button.backToHome",
          key: "home",
        };
      }
    case BIOMETRIC_OPERATIONS.ATTEMPT_LIMIT_CROSSED:
      return {
        title: "reKyc.biometric.aadhaarAuthFailed",
        message: "reKyc.biometric.formBasedProcess",
        icon: xicon,
        buttonText: "button.backToHome",
        key: "home",
      };
    default:
      return {
        title: "reKyc.errorMessages.tryAgain",
        message: message || "reKyc.errorMessages.somethingWentWrong",
        icon: xicon,
        buttonText: "button.recapture",
        key: "retryDevice",
      };
  }
};
