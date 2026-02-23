import type { AxiosRequestConfig } from "axios";
import axios from "axios";

import { SESSION_STORAGE_KEY } from "@/constants/globalConstant";
import { STATUS_CODE } from "@/constants/statusCodes";
import { decrypt, encrypt } from "@/lib/encryptionDecryption";
import { removeSessionStorageData } from "@/lib/sessionStorage";
import { ROUTES } from "@/routes/constants";

// const BASE_URL = import.meta.env.VITE_API_URL;

export const axiosInstance = axios.create({
  baseURL: "https://instaservices-api-uat.bandhanbank.co.in",
});

/* ============================================================
   🔍 Axios Request Logger
============================================================ */
axiosInstance.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.group("🚀 Axios Request");

      console.log("Full URL:", `${config.baseURL}${config.url}`);
      console.log("Method:", config.method?.toUpperCase());

      // Browser origin (actual origin sent in request)
      console.log("Browser Origin:", window.location.origin);

      console.log("Headers:", config.headers);
      console.log("Request Body (Encrypted):", config.data);

      console.groupEnd();
    }

    return config;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error("❌ Request Error:", error);
    }
    return Promise.reject(error);
  }
);

/* ============================================================
   🔍 Axios Response Logger
============================================================ */
axiosInstance.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.group("✅ Axios Response");

      console.log("URL:", response.config.url);
      console.log("Status:", response.status);
      console.log("Response Data (Encrypted):", response.data);

      console.groupEnd();
    }

    return response;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.group("❌ Axios Error");

      console.log("URL:", error.config?.url);
      console.log("Status:", error.response?.status);
      console.log("Error Data:", error.response?.data);

      console.groupEnd();
    }

    return Promise.reject(error);
  }
);

/* ============================================================
   🔐 Token Handling
============================================================ */
const updateTokenValueClosure = () => {
  let isTokenSet = false;

  return {
    updateTokenValue: (token: string) => {
      isTokenSet = true;
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
    },

    getIsTokenSet: () => isTokenSet,

    clearToken: () => {
      isTokenSet = false;

      removeSessionStorageData(SESSION_STORAGE_KEY.TOKEN);
      removeSessionStorageData(SESSION_STORAGE_KEY.EMP_INFO);

      delete axiosInstance.defaults.headers.common.Authorization;
    },
  };
};

export const { updateTokenValue, getIsTokenSet, clearToken } =
  updateTokenValueClosure();

/* ============================================================
   📤 POST Wrapper with Encryption
============================================================ */
export async function POST<RequestBody, Response>(
  url: string,
  body?: RequestBody,
  config?: AxiosRequestConfig
): Promise<Response> {
  try {
    if (import.meta.env.DEV) {
      console.log("📦 Original Request Body (Before Encryption):", body);
    }

    const encryptedPayload = body
      ? await encrypt(JSON.stringify(body))
      : undefined;

    const response = await axiosInstance.post(
      url,
      encryptedPayload ? { data: encryptedPayload } : undefined,
      config
    );

    const encryptedResponseData = response.data?.data;

    if (!encryptedResponseData) {
      throw new Error("Missing encrypted response data");
    }

    const decrypted = await decrypt(encryptedResponseData);

    if (typeof decrypted !== "string") {
      throw new Error("Decrypted response is not a string");
    }

    const parsedResponse = JSON.parse(decrypted) as Response;

    if (import.meta.env.DEV) {
      console.log("🔓 Decrypted Response:", parsedResponse);
    }

    return parsedResponse;
  } catch (error: any) {
    const errorResponse = error?.response?.data;

    if (errorResponse?.statusCode === STATUS_CODE.UNAUTHORIZED) {
      handleUnauthorized();
    }

    if (import.meta.env.DEV) {
      console.error("🚨 Request Failed:", errorResponse);
    }

    throw errorResponse;
  }
}

/* ============================================================
   ⛔ Unauthorized Handler
============================================================ */
export const handleUnauthorized = () => {
  clearToken();
  window.location.href = ROUTES.UNAUTHORIZED;
};