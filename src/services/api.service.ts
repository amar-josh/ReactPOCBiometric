import type { AxiosRequestConfig } from "axios";
import axios from "axios";

import { STATUS_CODE } from "@/constants/statusCodes";
import { decrypt, encrypt } from "@/lib/encryptionDecryption";
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
  } catch (err: any) {
    const isEncryptedError =
      err?.response?.data?.data && typeof err.response.data.data === "string";

    if (isEncryptedError) {
      try {
        const decryptedError = await decrypt(err.response.data.data);
        if (typeof decryptedError !== "string") {
          throw new Error("Decrypted error is not a string");
        }
        const parsedError = JSON.parse(decryptedError);

        console.error("Decrypted error:", parsedError);

        throw new Error(
          parsedError?.message || parsedError?.error || "Decrypted server error"
        );
      } catch (decryptionError) {
        console.error("Error decrypting error response:", decryptionError);
        throw new Error("Failed to decrypt error response");
      }
    }

    console.error("Request failed:", err);
    handleApiError(err);
  }
}

export const handleApiError = (err: unknown) => {
  const axiosError = err;

  if (axiosError?.statusCode === STATUS_CODE.UNAUTHORIZED) {
    clearToken();

    window.location.href = `${import.meta.env.VITE_BASE_URL}${ROUTES.UNAUTHORIZED}`;
    return;
  }
  throw err;
};
