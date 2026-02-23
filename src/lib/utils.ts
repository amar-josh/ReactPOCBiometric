import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import {
  ALPHANUMERIC,
  CURRENCY,
  INDIAN_CURRENCY,
  PADDING,
  VALUE_IN_INDIAN_FORMAT,
  ZERO,
} from "@/constants/globalConstant";
import { ISelectOptions } from "@/features/re-kyc/types";
import translator from "@/i18n/translator";

import { aesGcmUtil } from "./encryptionDecryption";

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

const formatCurrencyRange = (
  range: string,
  isFirst: boolean = false
): string => {
  if (typeof range !== "string") return "";

  const [start, end] = range.split(" to ").map(Number);

  const format = (value?: number) => {
    if (typeof value !== "number" || isNaN(value)) return "";
    return value.toLocaleString(VALUE_IN_INDIAN_FORMAT, {
      style: CURRENCY,
      currency: INDIAN_CURRENCY,
      minimumFractionDigits: ZERO,
    });
  };

  if (isFirst && !isNaN(end)) {
    return `${translator("reKyc.lessThan")} ${format(end)}`;
  }

  if (!isNaN(start) && !isNaN(end)) {
    return `${format(start)} ${translator("reKyc.to")} ${format(end)}`;
  }

  return range;
};

// Convert select options to label and value format
export const convertToLabelValue = ({
  list,
  showCurrency = false,
}: {
  list: ISelectOptions[];
  showCurrency?: boolean;
}) => {
  return list.map(({ name, code }, index) => {
    const label = showCurrency ? formatCurrencyRange(name, index === 0) : name;

    return {
      label,
      value: code,
    };
  });
};

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

// Generate a random alphanumeric string of length 12
export const generateRandomTransactionId = (): string => {
  let result = "";
  const charactersLength = ALPHANUMERIC.length;

  for (let i = 0; i < 12; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += ALPHANUMERIC.charAt(randomIndex);
  }
  return result;
};
// Derive AES-256 key from transaction ID
export const deriveAes256Key = async (transactionId: string) => {
  const padding = PADDING;
  const combined = transactionId + padding;

  const encoder = new TextEncoder();
  const data = encoder.encode(combined);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashString = btoa(String.fromCharCode(...hashArray));
  aesGcmUtil.setKey(hashString);
  setTransactionId(transactionId);
};
// Singleton pattern to manage encryption key, and transaction ID
const updateTransactionId = () => {
  let transactionId = "";
  return {
    setTransactionId: (transactionIdValue: string) => {
      transactionId = transactionIdValue;
    },
    getTransactionId: () => transactionId,
  };
};

export const { setTransactionId, getTransactionId } = updateTransactionId();
