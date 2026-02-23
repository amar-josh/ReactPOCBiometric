import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import logo from "@/assets/images/BandhanBank.svg";
import AlertMessage from "@/components/common/AlertMessage";
import Footer from "@/components/common/Footer";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import PasswordInput from "@/components/common/PasswordInput";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ERROR,
  MAX_PASSWORD_LENGTH,
  MAX_USER_NAME_LENGTH,
  SESSION_STORAGE_KEY,
} from "@/constants/globalConstant";
import { STATUS_CODE } from "@/constants/statusCodes";
import { useAlertMessage } from "@/hooks/useAlertMessage";
import { useGetConfig } from "@/hooks/useConfig";
import translator from "@/i18n/translator";
import { aesGcmUtil } from "@/lib/encryptionDecryption";
import { setSessionStorageData } from "@/lib/sessionStorage";
import { setTransactionId } from "@/lib/utils";
import { ROUTES } from "@/routes/constants";
import { updateTokenValue } from "@/services/api.service";

import RegainAccessModal from "./components/RegainAccessModal";
import { useLogin } from "./hooks";
import { ILoginRequest, ILoginResponse } from "./types";
import { loginFormSchema } from "./utils";

const Login = () => {
  const navigate = useNavigate();
  const { mutate: getConfig, data: configData } = useGetConfig();

  const { mutate: loginMutate, isPending: isLoginLoading } = useLogin();

  const {
    alertMessage: loginAlertMessage,
    setAlertMessage: setLoginAlertMessage,
  } = useAlertMessage(ERROR, "", false);

  const [showModal, setShowModal] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: yupResolver(loginFormSchema),
  });

  const handleLoginSuccess = (res: ILoginResponse) => {
    const { empName, empId, branchCode, department } =
      res?.data?.userAttributes ?? {};
    const token = res?.data?.cognitoToken ?? "";

    const empInfo = {
      empName,
      empId,
      branchCode,
      department,
    };

    setSessionStorageData(SESSION_STORAGE_KEY.EMP_INFO, empInfo);
    setSessionStorageData(SESSION_STORAGE_KEY.TOKEN, token);
    updateTokenValue(token);
    navigate(ROUTES.HOME);
  };

  const handleLoginError = (error: any) => {
    if (error?.statusCode === STATUS_CODE.BAD_REQUEST) {
      setLoginAlertMessage({
        type: ERROR,
        message: translator("login.invalidCredentials"),
      });
      return;
    }

    setLoginAlertMessage({
      type: ERROR,
      message:
        error?.message || translator("reKyc.errorMessages.somethingWentWrong"),
    });
  };

  const onSubmit = (data: ILoginRequest) => {
    loginMutate(data, {
      onSuccess: handleLoginSuccess,
      onError: handleLoginError,
    });
  };

  useEffect(() => {
    getConfig();
  }, [getConfig]);

  useEffect(() => {
    if (configData?.data) {
      const { aesKey } = configData.data;
      aesGcmUtil.setKey(aesKey);
      setTransactionId("");
    }
  }, [configData]);

  return (
    <div className="flex px-4 md:px-0 h-screen items-center justify-center bg-radial from-[#3399E8] to-[#004880] pb-20">
      {isLoginLoading && <FullScreenLoader />}
      <Card className="w-[32rem] px-10 py-16 flex flex-col items-center border-none outline-0">
        <div className="w-full h-full flex flex-col justify-center items-center">
          <div className="flex flex-col mb-10">
            <img src={logo} alt="Bandhan Bank" className="w-52 h-14" />
          </div>

          <h3 className="text-2xl text-center font-bold text-dark-gray mb-4">
            {translator("login.bbInstaServices")}
          </h3>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
            <div>
              <Input
                placeholder={translator("login.userId")}
                className="w-full"
                {...register("username")}
                maxLength={MAX_USER_NAME_LENGTH}
                autoComplete="off"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <PasswordInput
                placeholder={translator("login.password")}
                {...register("password")}
                className="w-full"
                autoComplete="off"
                maxLength={MAX_PASSWORD_LENGTH}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <p
              className="my-3.5 text-primary hover:text-blue cursor-pointer"
              onClick={() => setShowModal(true)}
            >
              {translator("login.cantAccessYourAccount")} ?
            </p>

            <Button
              type="submit"
              className="w-full"
              variant="primary"
              disabled={isLoginLoading}
            >
              {translator("button.login")}
            </Button>
          </form>
        </div>
        {loginAlertMessage?.message && (
          <AlertMessage
            type={loginAlertMessage.type}
            message={loginAlertMessage.message}
          />
        )}
      </Card>
      <Footer className="absolute bottom-0 left-0 w-full text-light-gray" />
      <RegainAccessModal showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
};

export default Login;
