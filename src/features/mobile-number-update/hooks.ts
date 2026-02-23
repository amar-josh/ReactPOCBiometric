import { useMutation } from "@tanstack/react-query";

import {
  getCheckStatusService,
  getCustomerSearchService,
  getGenerateLinkService,
  getRecordsService,
  getUpdateNumberService,
  getVerifyNumberService,
  validateFingerprint,
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
    mutationFn: getRecordsService,
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

export const useValidateFingerprint = () => {
  return useMutation({
    mutationFn: validateFingerprint,
  });
};
