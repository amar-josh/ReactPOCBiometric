import { useMutation } from "@tanstack/react-query";

import {
  getBioMetricVerificationService,
  getCheckStatusService,
  getCustomerSearchService,
  getFetchRecordsService,
  getGenerateLinkService,
  getUpdateNumberService,
  getVerifyLinkService,
  getVerifyNumberService,
} from "./services";

export const useCustomerSearch = () => {
  return useMutation({
    mutationFn: getCustomerSearchService,
  });
};

export const useVerifyNumber = () => {
  return useMutation({
    mutationFn: getVerifyNumberService,
  });
};

export const useUpdateNumber = () => {
  return useMutation({
    mutationFn: getUpdateNumberService,
  });
};

export const useFetchRecords = () => {
  return useMutation({
    mutationFn: getFetchRecordsService,
  });
};

export const useCheckStatus = () => {
  return useMutation({
    mutationFn: getCheckStatusService,
  });
};

export const useGenerateLink = () => {
  return useMutation({
    mutationFn: getGenerateLinkService,
  });
};

export const useVerifyLink = () => {
  return useMutation({
    mutationFn: getVerifyLinkService,
  });
};

export const useBioMetricVerification = () => {
  return useMutation({
    mutationFn: getBioMetricVerificationService,
  });
};
