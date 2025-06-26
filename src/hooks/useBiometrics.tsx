import { useMutation } from "@tanstack/react-query";

import {
  captureFingerPrintInAndroid,
  getBiometricDeviceStatusInAndroid,
} from "@/services/biometricForAndroid";
import {
  captureFingerPrint,
  getBiometricDeviceStatus,
  getRDServiceStatus,
} from "@/services/biometricForWeb";

import { useDeviceDetection } from "./useDeviceDetection";

export const useGetRDServiceStatus = () => {
  return useMutation({
    mutationFn: getRDServiceStatus,
  });
};

export const useGetDeviceStatus = () => {
  const { isAndroidWebView } = useDeviceDetection();
  return useMutation({
    mutationFn: isAndroidWebView
      ? getBiometricDeviceStatusInAndroid
      : getBiometricDeviceStatus,
  });
};

export const useCaptureFingerprint = () => {
  const { isAndroidWebView } = useDeviceDetection();
  return useMutation({
    mutationFn: isAndroidWebView
      ? captureFingerPrintInAndroid
      : captureFingerPrint,
  });
};
