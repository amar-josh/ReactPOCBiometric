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
  let isTokenSet = false;
  return {
    updateTokenValue: (token: string) => {
      isTokenSet = true;
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
    },
    getIsTokenSet: () => isTokenSet,
    clearToken: () => {
      isTokenSet = false;
      removeSessionStorageData(SESSION_STORAGE_KEY.TOKEN); // clear token from session storage
      removeSessionStorageData(SESSION_STORAGE_KEY.EMP_INFO); // clear emp info from session storage
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

    const encryptedResponseData = response.data?.data;
    if (!encryptedResponseData)
      throw new Error("Missing encrypted response data");

    const decrypted = await decrypt(encryptedResponseData);
    if (typeof decrypted !== "string") {
      throw new Error("Decrypted response is not a string");
    }

    return JSON.parse(decrypted) as Response;
  } catch (error: any) {
    const errorResponse = error?.response?.data;

    if (errorResponse?.statusCode === STATUS_CODE.UNAUTHORIZED) {
      handleUnauthorized();
    }

    console.error("Request failed:", errorResponse);
    throw errorResponse;
  }
}

export const handleUnauthorized = () => {
  clearToken();
  window.location.href = ROUTES.UNAUTHORIZED;
};
