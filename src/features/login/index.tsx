// Container: Login/index.tsx

import { useCallback } from "react";
import { useNavigate } from "react-router";

import { SESSION_STORAGE_KEY } from "@/constants/globalConstant";
import { setSessionStorageData } from "@/lib/sessionStorage";
import { ROUTES } from "@/routes/constants";
import { updateTokenValue } from "@/services/api.service";

import LoginComponent from "./components/LoginForm";
import { useGenerateToken } from "./hooks";
import { IGenerateTokenResponse } from "./types";

const Login = () => {
  const navigate = useNavigate();
  const {
    mutate: generateToken,
    error: generateTokenError,
    isError: isGenerateTokenError,
  } = useGenerateToken();

  const handleGenerateTokenSuccess = useCallback(
    (res: IGenerateTokenResponse) => {
      const token = res?.data?.accessToken;
      updateTokenValue(token);
      setSessionStorageData(SESSION_STORAGE_KEY.TOKEN, token);
      navigate(ROUTES.HOME);
    },
    [navigate]
  );

  const handleSubmit = useCallback(() => {
    generateToken(undefined, {
      onSuccess: handleGenerateTokenSuccess,
    });
  }, [generateToken, handleGenerateTokenSuccess]);

  return (
    <LoginComponent
      onSubmit={handleSubmit}
      errorMessage={generateTokenError?.message}
      isError={isGenerateTokenError}
    />
  );
};

export default Login;
