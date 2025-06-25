import { useMemo } from "react";

import {
  IAddress,
  ICustomerSearchResponse,
  IOtherDetailsValues,
  IReKYCData,
} from "../types";
import {
  formatAddress,
  otherDetailsReadOnlySchema,
  reKycFormSchema,
} from "../utils";

export function usePersonalDetails(customerDetailResponse: any) {
  return useMemo(() => {
    const rekycDetails = customerDetailResponse?.data?.rekycDetails;
    return {
      fullName: rekycDetails?.customerName || "",
      mobileNo: rekycDetails?.mobileNo || "",
      emailId: rekycDetails?.emailId || "",
    };
  }, [customerDetailResponse]);
}

export function useHasDormantAccount(
  accountDetails: ICustomerSearchResponse[] | undefined
) {
  return useMemo(
    () =>
      accountDetails?.some((account) =>
        account.accDetails?.some((accDetail) => accDetail.isAccountDormant)
      ),
    [accountDetails]
  );
}

export function useFormDetails(
  otherDetails: IOtherDetailsValues,
  reKYCDetailsResponse: IReKYCData | undefined
) {
  return useMemo(() => {
    const rekycFields = reKycFormSchema.map((ele) => {
      if (["communicationAddress", "permanentAddress"].includes(ele.value)) {
        const address = reKYCDetailsResponse?.rekycDetails[ele.value];
        return {
          ...ele,
          defaultValue:
            address && typeof address === "object"
              ? formatAddress(address as IAddress)
              : "",
        };
      }
      const value = reKYCDetailsResponse?.rekycDetails[ele.value];
      return {
        ...ele,
        defaultValue:
          value === undefined || value === null
            ? null
            : typeof value === "string" || typeof value === "number"
              ? value
              : "",
      };
    });
    const otherFields = otherDetailsReadOnlySchema.map((field) => {
      const selectedOption =
        otherDetails[field.value as keyof IOtherDetailsValues];

      return {
        ...field,
        defaultValue: selectedOption?.label ?? "",
      };
    });

    return {
      rekycFields: rekycFields,
      otherFields: otherFields,
    };
  }, [otherDetails, reKYCDetailsResponse?.rekycDetails]);
}
