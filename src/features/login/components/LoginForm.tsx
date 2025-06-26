import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router";
import * as yup from "yup";

import AlertMessage from "@/components/common/AlertMessage";
import Footer from "@/components/common/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ERROR } from "@/constants/globalConstant";
import { VALID_EMAIL_REGEX } from "@/constants/regex";
import { useAlertMessage } from "@/hooks/useAlertMessage";
import translator from "@/i18n/translator";

import logo from "../../../assets/images/BandhanBank.svg";
import RegainAccessModal from "./RegainAccessModal";

interface ILoginComponentProps {
  onSubmit: SubmitHandler<{ email: string }>;
  errorMessage: string | undefined;
  isError: boolean;
}

const schema = yup.object({
  email: yup
    .string()
    .matches(VALID_EMAIL_REGEX, translator("validations.email.enterValidEmail"))
    .required(translator("validations.email.enterValidEmail")),
});

const LoginComponent = ({
  onSubmit,
  errorMessage,
  isError,
}: ILoginComponentProps) => {
  const { alertMessage } = useAlertMessage(ERROR, errorMessage, isError);

  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(schema),
  });

  return (
    <>
      <div className="flex px-4 md:px-0 h-screen items-center justify-center bg-radial from-[#3399E8] to-[#004880] pb-20">
        <Card className="w-[32rem] px-10 py-16 flex flex-col items-center border-none outline-0">
          <div className="w-full h-full flex flex-col justify-center items-center">
            <div className="flex flex-col mb-10">
              <Link to={"/re-kyc"} />
              <img src={logo} alt="Bandhan Bank" className="w-52 h-14" />
            </div>
            <h3 className="text-2xl text-center font-bold text-dark-gray mb-4">
              {translator("login.bbInstaServices")}
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              <Input
                placeholder="Enter your official/work email ID"
                className="w-full"
                {...register("email")}
                autoComplete="off"
              />

              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}

              <p
                className="my-3.5 text-primary hover:text-blue cursor-pointer"
                onClick={() => setShowModal(true)}
              >
                {translator("login.cantAccessYourAccount")} ?
              </p>

              <Button type="submit" className="w-full" variant="primary">
                {translator("button.next")}
              </Button>
            </form>
            {alertMessage?.message && (
              <div className="mt-4 w-full">
                <AlertMessage
                  type={alertMessage?.type}
                  message={alertMessage?.message}
                />
              </div>
            )}
          </div>
        </Card>
        <Footer className="absolute bottom-0 left-0 w-full text-light-gray" />
      </div>
      <RegainAccessModal showModal={showModal} setShowModal={setShowModal} />
    </>
  );
};

export default LoginComponent;
