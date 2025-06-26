import { useMutation } from "@tanstack/react-query";

import {
  getCustomerDetailsService,
  getCustomerSearchService,
  getOtherDetailsDropdownService,
  updateKYC,
  validateFingerprint,
} from "@/features/re-kyc/services";

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
