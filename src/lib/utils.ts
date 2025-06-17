import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { ILabelValue, ISelectOptions } from "@/features/re-kyc/types";
import translator from "@/i18n/translator";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Field level error handling for API response
export interface FieldsError {
  data: {
    message: string;
    errors: FieldErrorMessage[] | [];
  };
}
export interface FieldErrorMessage {
  [key: string]: string;
}

export const getFieldErrorMessages = (
  error: FieldsError | undefined
): FieldErrorMessage => {
  if (!error) return {};
  if (
    "data" in error &&
    error.data &&
    typeof error.data === "object" &&
    "errors" in error.data &&
    Array.isArray(error.data.errors)
  ) {
    const errorsObj = error?.data?.errors.reduce((accu: any, error: any) => {
      accu[error.field] = error.message;
      return accu;
    }, {});
    return errorsObj;
  }
  return {};
};

// Convert select options to label and value format
export const convertToLabelValue = (
  list?: Array<ISelectOptions>,
  includeOther: boolean = true
) => {
  const updatedList: ILabelValue[] = [];

  list?.forEach(({ name, code }) => {
    if (code === 0 && includeOther) {
      updatedList.push({ label: translator("formFields.other"), value: code });
    } else {
      updatedList.push({
        label: name,
        value: code,
      });
    }
  });

  return updatedList;
};

// example to usee field error message
// useEffect(() => {
//   const serverFieldErrors = getFieldErrorMessages(serverErrors);
//   const keys = Object.keys(serverFieldErrors);
//   if (keys.length) {
//     keys.forEach((field) => {
//       setFieldError(field, serverFieldErrors[field]);
//     });
//   }
// }, [serverErrors]);

// services/fakeApi.ts
export const fetchFakeData = async (mockData: any, isSuccess = true) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (isSuccess) {
        resolve(mockData);
      } else {
        reject(mockData);
      }
    }, 1000); // simulate network delay
  });
};
