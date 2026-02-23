import { describe, expect, it } from "vitest";

import { BIOMETRIC_OPERATIONS } from "@/shared/biometric/constants";

import { getBiometricCardDetails } from "../utils";

describe("getBiometricCardDetails", () => {
  it("should return correct details for CHECK_RD_SERVICE_STATUS", () => {
    const result = getBiometricCardDetails({
      statusKey: BIOMETRIC_OPERATIONS.CHECK_RD_SERVICE_STATUS,
      count: 0,
    });
    expect(result).toEqual({
      title: "reKyc.biometric.searchingForDevice",
      message: "reKyc.biometric.pleaseWait",
      icon: expect.any(String),
      key: "retryRDService",
    });
  });

  it("should return correct details for CHECK_RD_SERVICE_ERROR", () => {
    const result = getBiometricCardDetails({
      statusKey: BIOMETRIC_OPERATIONS.CHECK_RD_SERVICE_ERROR,
      count: 0,
    });
    expect(result).toEqual({
      title: "reKyc.biometric.deviceNotFound",
      message: "reKyc.biometric.connectBiometricDevice",
      icon: expect.any(String),
      buttonText: "button.retry",
      key: "retryRDService",
    });
  });

  it("should return correct details for DEVICE_USED_BY_ANOTHER_APPLICATION", () => {
    const result = getBiometricCardDetails({
      statusKey: BIOMETRIC_OPERATIONS.DEVICE_USED_BY_ANOTHER_APPLICATION,
      count: 0,
    });
    expect(result).toEqual({
      title: "reKyc.biometric.deviceNotFound",
      message: "reKyc.biometric.deviceUsedByOtherAppMessage",
      icon: expect.any(String),
      buttonText: "button.retry",
      key: "retryRDService",
    });
  });

  it("should return correct details for DEVICE_NOT_READY", () => {
    const result = getBiometricCardDetails({
      statusKey: BIOMETRIC_OPERATIONS.DEVICE_NOT_READY,
      count: 0,
    });
    expect(result).toEqual({
      title: "reKyc.biometric.deviceNotFound",
      message: "reKyc.biometric.connectBiometricDevice",
      icon: expect.any(String),
      buttonText: "button.retry",
      key: "retryDevice",
    });
  });

  it("should return correct details for READY_TO_CAPTURE", () => {
    const result = getBiometricCardDetails({
      statusKey: BIOMETRIC_OPERATIONS.READY_TO_CAPTURE,
      count: 0,
    });
    expect(result).toEqual({
      title: "reKyc.biometric.confirmUsingFingerprint",
      message: "reKyc.biometric.touchFingerprintSensor",
      icon: expect.any(String),
      buttonText: "button.capture",
      key: "capture",
    });
  });

  it("should return correct details for SUCCESS", () => {
    const result = getBiometricCardDetails({
      statusKey: BIOMETRIC_OPERATIONS.SUCCESS,
      count: 0,
    });
    expect(result).toEqual({
      title: "reKyc.biometric.verified",
      message: "reKyc.biometric.verifiedSuccess",
      icon: expect.any(String),
      buttonText: "button.close",
      key: "close",
    });
  });

  it("should return correct details for NO_FINGER_FOUND", () => {
    const result = getBiometricCardDetails({
      statusKey: BIOMETRIC_OPERATIONS.NO_FINGER_FOUND,
      count: 0,
    });
    expect(result).toEqual({
      title: "reKyc.biometric.noFingerFound",
      message:
        "No finger is placed on device, Please make sure to place your finger on the device",
      icon: expect.any(String),
      buttonText: "button.retry",
      key: "retryDevice",
    });
  });

  it("should return correct details for ATTEMPT_FAILED with count 2", () => {
    const result = getBiometricCardDetails({
      statusKey: BIOMETRIC_OPERATIONS.ATTEMPT_FAILED,
      count: 2,
    });
    expect(result).toEqual({
      title: "reKyc.biometric.aadhaarAuthFailed",
      message: "reKyc.biometric.aadhaarAuthFailedOnce",
      icon: expect.any(String),
      buttonText: "button.recapture",
      key: "recapture",
    });
  });

  it("should return correct details for ATTEMPT_FAILED with count 1", () => {
    const result = getBiometricCardDetails({
      statusKey: BIOMETRIC_OPERATIONS.ATTEMPT_FAILED,
      count: 1,
    });
    expect(result).toEqual({
      title: "reKyc.biometric.aadhaarAuthFailed",
      message: "reKyc.biometric.aadhaarAuthFailedTwice",
      icon: expect.any(String),
      buttonText: "button.recapture",
      key: "recapture",
    });
  });

  it("should return correct details for ATTEMPT_FAILED with count 0", () => {
    const result = getBiometricCardDetails({
      statusKey: BIOMETRIC_OPERATIONS.ATTEMPT_FAILED,
      count: 0,
    });
    expect(result).toEqual({
      title: "reKyc.biometric.aadhaarAuthFailed",
      message: "reKyc.biometric.formBasedProcess",
      icon: expect.any(String),
      buttonText: "button.backToHome",
      key: "home",
    });
  });

  it("should return correct details for ATTEMPT_LIMIT_CROSSED", () => {
    const result = getBiometricCardDetails({
      statusKey: BIOMETRIC_OPERATIONS.ATTEMPT_LIMIT_CROSSED,
      count: 0,
    });
    expect(result).toEqual({
      title: "reKyc.biometric.aadhaarAuthFailed",
      message: "reKyc.biometric.formBasedProcess",
      icon: expect.any(String),
      buttonText: "button.backToHome",
      key: "home",
    });
  });

  it("should return correct details for unknown statusKey", () => {
    const result = getBiometricCardDetails({
      statusKey: "UNKNOWN" as any,
      count: 0,
      message: "Custom message",
    });
    expect(result).toEqual({
      title: "reKyc.errorMessages.tryAgain",
      message: "Custom message",
      icon: expect.any(String),
      buttonText: "button.recapture",
      key: "retryDevice",
    });
  });

  it("should use default message if unknown statusKey and no message provided", () => {
    const result = getBiometricCardDetails({
      statusKey: "UNKNOWN" as any,
      count: 0,
    });
    expect(result).toEqual({
      title: "reKyc.errorMessages.tryAgain",
      message: "reKyc.errorMessages.somethingWentWrong",
      icon: expect.any(String),
      buttonText: "button.recapture",
      key: "retryDevice",
    });
  });
});
