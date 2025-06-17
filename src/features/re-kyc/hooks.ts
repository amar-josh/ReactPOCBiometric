import { useMutation } from "@tanstack/react-query";

import {
  getCustomerDetailsService,
  getCustomerSearchService,
  getOtherDetailsDropdownService,
  updateKYC,
  validateFingerprint,
} from "@/features/re-kyc/services";
import { useDeviceDetection } from "@/hooks/useDeviceDetection";
import {
  captureFingerPrint,
  getBiometricDeviceStatus,
  getRDServiceStatus,
} from "@/services/biometricWebServices";
import {
  captureFingerPrintInWebView,
  getBiometricDeviceStatusInWebView,
} from "@/services/biometricWebViewServices";

export const useCustomerSearch = () => {
  return useMutation({
    mutationFn: getCustomerSearchService,
  });
};

export const useCustomerDetails = () => {
  return useMutation({
    mutationFn: getCustomerDetailsService,
  });
};

export const useGetOtherDropdownDetails = () => {
  return useMutation({
    mutationFn: getOtherDetailsDropdownService,
  });
};

export const useGetRDServiceStatus = () => {
  return useMutation({
    mutationFn: getRDServiceStatus,
  });
};

export const useGetDeviceStatus = () => {
  const { isAndroidWebView } = useDeviceDetection();
  return useMutation({
    mutationFn: isAndroidWebView
      ? getBiometricDeviceStatusInWebView
      : getBiometricDeviceStatus,
  });
};

export const useCaptureFingerprint = () => {
  const { isAndroidWebView } = useDeviceDetection();
  return useMutation({
    mutationFn: isAndroidWebView
      ? captureFingerPrintInWebView
      : captureFingerPrint,
  });
};

export const useValidateFingerprint = () => {
  return useMutation({
    mutationFn: validateFingerprint,
  });
};

export const useUpdateKYC = () => {
  return useMutation({
    mutationFn: updateKYC,
  });
};
