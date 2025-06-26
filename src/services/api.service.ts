import type { AxiosRequestConfig } from "axios";
import axios from "axios";

import { SESSION_STORAGE_KEY } from "@/constants/globalConstant";
import { STATUS_CODE } from "@/constants/statusCodes";
import { decrypt, encrypt } from "@/lib/encryptionDecryption";
import { removeSessionStorageData } from "@/lib/sessionStorage";
import { ROUTES } from "@/routes/constants";

const BASE_URL = import.meta.env.VITE_API_URL;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

const updateTokenValueClosure = () => {
  let isTokenSet = true;
  return {
    updateTokenValue: (token: string) => {
      isTokenSet = true;
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
    },
    getIsTokenSet: () => isTokenSet,
    clearToken: () => {
      isTokenSet = false;
      removeSessionStorageData(SESSION_STORAGE_KEY.TOKEN); // clear token from session storage
      delete axiosInstance.defaults.headers.common.Authorization;
    },
  };
};

export const { updateTokenValue, getIsTokenSet, clearToken } =
  updateTokenValueClosure();

export async function POST<RequestBody, Response>(
  url: string,
  body?: RequestBody,
  config?: AxiosRequestConfig
): Promise<Response> {
  try {
    const encryptedPayload = body
      ? await encrypt(JSON.stringify(body))
      : undefined;

    const response = await axiosInstance.post(
      url,
      encryptedPayload ? { data: encryptedPayload } : undefined,
      config
    );

    // Decrypt response
    console.log("API Response", response);
    console.log("API Response.Data", response.data);
    console.log("API Response.Data.Data", response.data.data);

    const encryptedResponseData = response.data?.data;
    if (!encryptedResponseData)
      throw new Error("Missing encrypted response data");

    const decrypted = await decrypt(encryptedResponseData);
    if (typeof decrypted !== "string") {
      throw new Error("Decrypted response is not a string");
    }

    return JSON.parse(decrypted) as Response;
  } catch (err: any) {
    // Check for encrypted error response
    console.log("Response error", err);
    console.log("Response error.response", err?.response);
    console.log("Response error.response.data", err?.response?.data);
    console.log("Response error.response.data.data", err?.response?.data?.data);

    const encryptedError = err?.response?.data?.data;

    if (encryptedError && typeof encryptedError === "string") {
      try {
        const decryptedError = await decrypt(encryptedError);
        if (typeof decryptedError !== "string") {
          throw new Error("Decrypted error is not a string");
        }
        const error = JSON.parse(decryptedError);

        console.error("Decrypted error:", error);

        if (error?.statusCode === STATUS_CODE.UNAUTHORIZED) {
          handleUnauthorized();
        }
        return error;
      } catch (decryptionError) {
        console.error("Error decrypting error response:", decryptionError);
        throw new Error("Failed to decrypt error response");
      }
    }

    console.error("Request failed:", err);
    return err;
  }
}

export const handleUnauthorized = () => {
  clearToken();
  window.location.href = `${import.meta.env.VITE_BASE_URL}${ROUTES.UNAUTHORIZED}`;
};
