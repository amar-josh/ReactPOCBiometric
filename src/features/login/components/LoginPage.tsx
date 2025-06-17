import { t } from "i18next";
import {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";

import AlertMessage from "@/components/common/AlertMessage";
import Footer from "@/components/common/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import translator from "@/i18n/translator";
import { IAlertMessage } from "@/types";

import logo from "../../../assets/images/BandhanBank.svg";
import RegainAccessModal from "./RegainAccessModal";

interface ILoginComponentProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  errors: FieldErrors<{
    email: string;
  }>; // Type for errors object
  register: UseFormRegister<{
    email: string;
  }>; // Type for register function
  handleSubmit: UseFormHandleSubmit<
    {
      email: string;
    },
    {
      email: string;
    }
  >; // Type for handleSubmit function
  onSubmit: () => void;
  handleNextClick: () => void;
  alertMessage: IAlertMessage;
}

const LoginComponent: React.FC<ILoginComponentProps> = ({
  showModal,
  setShowModal,
  errors,
  register,
  alertMessage,
  handleSubmit,
  onSubmit,
  handleNextClick,
}) => {
  return (
    <>
      <div className="flex h-screen items-center justify-center bg-radial from-[#3399E8] to-[#004880] pb-20">
        <Card className="w-[512px] px-11 py-22 flex flex-col items-center border-none outline-0">
          <div className="w-full h-full flex flex-col justify-center items-center">
            <div className="flex flex-col mb-16">
              <img src={logo} alt="Bandhan Bank" />
            </div>
            <h3 className="text-3xl text-center font-bold text-dark-gray mb-4">
              {t("login.bbInstaServices")}
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

              <Button
                type="submit"
                className="w-full"
                variant="primary"
                onClick={handleNextClick}
              >
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
