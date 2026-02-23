import { ENDPOINTS } from "@/constants/endPoints";
import { PADDING } from "@/constants/globalConstant";
import { deriveAes256Key, generateRandomTransactionId } from "@/lib/utils";
import { IGetConfigResponse } from "@/types";

import { POST } from "./api.service";

export const getConfig = () => {
  const transactionId = generateRandomTransactionId();
  deriveAes256Key(transactionId);
  const encodedTransactionId = btoa(transactionId);
  const encodedPadding = btoa(PADDING);
  return POST<void, IGetConfigResponse>(ENDPOINTS.CONFIG, undefined, {
    headers: {
      transId: encodedTransactionId,
      padding: encodedPadding,
    },
  });
};
