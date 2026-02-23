import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import infoIcon from "@/assets/images/info-black.svg";
import warning from "@/assets/images/warning.svg";
import AlertDialogComponent from "@/components/common/AlertDialogComponent";
import AlertMessage from "@/components/common/AlertMessage";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import CardWrapper from "@/components/common/InfoCardWrapper";
import InfoMessage from "@/components/common/InfoMessage";
import MobileNumberInput from "@/components/common/MobileNumberInput";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ERROR, SUCCESS } from "@/constants/globalConstant";
import { ICustomerSearchResponse } from "@/features/re-kyc/types";
import { useAlertMessage } from "@/hooks/useAlertMessage";
import translator from "@/i18n/translator";

import { useCheckStatus, useGenerateLink, useVerifyNumber } from "../hooks";
import { IGetCheckStatusResponse } from "../types";
import { mobileNumberUpdateFormSchema } from "../utils";

type FormSchemaType = yup.InferType<typeof mobileNumberUpdateFormSchema>;

interface IUpdateDetailsProps {
  setNewMobileNumber: React.Dispatch<React.SetStateAction<string | undefined>>;
  updateStep: () => void;
  personalDetails: ICustomerSearchResponse;
  requestNumber: string;
}

const UpdateDetails = (props: IUpdateDetailsProps) => {
  const { setNewMobileNumber, updateStep, personalDetails, requestNumber } =
    props;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isProceedToAadhar, setIsProceedToAadhar] = useState<boolean>(false);
  const [isShowCheckStatus, setIsShowCheckStatus] = useState<boolean>(false);
  const [timer, setTimer] = useState(0);

  const {
    mutate: verifyMobileNumberMutate,
    error: verifyMobileNumberError,
    isError: isVerifyMobileNumberError,
    isPending: isVerifyMobileNumberLoading,
  } = useVerifyNumber();

  const {
    mutate: checkStatusMutate,
    error: checkStatusError,
    isError: isCheckStatusError,
    isPending: isCheckStatusLoading,
  } = useCheckStatus();

  const {
    mutate: generateLinkMutate,
    isPending: isGenerateLinkLoading,
    error: generateLinkError,
    isError: isGenerateLinkError,
  } = useGenerateLink();

  const { alertMessage, setAlertMessage } = useAlertMessage(
    ERROR,
    verifyMobileNumberError?.message,
    isVerifyMobileNumberError
  );

  const form = useForm<FormSchemaType>({
    resolver: yupResolver(mobileNumberUpdateFormSchema),
    defaultValues: {
      mobileNumber: undefined,
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    watch,
    getValues,
    formState: { isDirty },
  } = form;
  const isFormEmpty = !watch("mobileNumber");

  const handleGenerateLinkSuccess = (data: any) => {
    if (data?.data?.totalClicks > 3) {
      setAlertMessage({
        type: ERROR,
        message: translator("mobileNumberUpdate.maximumAttemptsExceeded"),
      });
    } else {
      setIsShowCheckStatus(true);
      setIsOpen(true);
      setAlertMessage({
        type: SUCCESS,
        message: "",
      });
      setTimer(120);
    }
  };

  const handleVerifyMobileNumberSuccess = (mobileNumber: string) => {
    generateLinkMutate(
      {
        requestNumber,
        mobileNumber,
        channel: "BRANCH_MOBILE",
      },
      {
        onSuccess: (data) => handleGenerateLinkSuccess(data),
      }
    );
  };

  const handleMobileVerification = (mobileNumber: string) => {
    const payload = {
      requestNumber,
      mobileNumber,
    };

    verifyMobileNumberMutate(payload, {
      onSuccess: () => handleVerifyMobileNumberSuccess(mobileNumber),
    });
  };

  const onSubmit = (data: FormSchemaType) => {
    setNewMobileNumber(data.mobileNumber);
    if (isProceedToAadhar) {
      updateStep();
    } else {
      handleMobileVerification(data.mobileNumber);
    }
  };

  const handleCheckStatusSuccess = (response: IGetCheckStatusResponse) => {
    if (response?.data?.isVerified) {
      setTimer(0);
      setIsShowCheckStatus(false);
      setIsProceedToAadhar((prev) => !prev);
      setAlertMessage({
        message: translator("mobileNumberUpdate.successfulVerified"),
        type: SUCCESS,
      });
    } else {
      setAlertMessage({
        message: translator("mobileNumberUpdate.verificationFailed"),
        type: ERROR,
      });
    }
  };

  const handleCheckStatus = () => {
    checkStatusMutate(
      {
        requestNumber,
      },
      {
        onSuccess: (response) => handleCheckStatusSuccess(response),
      }
    );
  };

  const handleFormReset = () => {
    reset({
      mobileNumber: undefined,
    });
    setAlertMessage({ type: SUCCESS, message: "" });
    setIsProceedToAadhar(false);
    setTimer(0);
  };

  const onCancel = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    if (isCheckStatusError) {
      setAlertMessage({
        type: ERROR,
        message: checkStatusError.message,
      });
    } else if (isGenerateLinkError) {
      setAlertMessage({
        type: ERROR,
        message: generateLinkError.message,
      });
    }
  }, [
    isCheckStatusError,
    checkStatusError?.message,
    isGenerateLinkError,
    generateLinkError?.message,
  ]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds: number): string => `${seconds}s`;

  const handleTryAgain = () => {
    const mobile = getValues("mobileNumber");
    if (mobile) {
      handleMobileVerification(mobile);
    }
  };

  const isLoading =
    isVerifyMobileNumberLoading ||
    isCheckStatusLoading ||
    isGenerateLinkLoading;

  return (
    <div>
      {isLoading && <FullScreenLoader />}
      <h4 className="text-primary text-2xl font-medium pb-4">
        {translator("mobileNumberUpdate.updateDetails")}
      </h4>
      <CardWrapper className="bg-light-gray pt-0 px-2">
        <div className="flex items-center gap-6">
          <div className="flex flex-col gap-y-0 md:gap-y-1.5 md:flex-row w-full">
            <div className="flex flex-row gap-7">
              <div>
                <h3 className="font-medium">
                  {personalDetails?.custDetails?.customerName || ""}
                </h3>
                <div className="flex gap-2">
                  <p className="text-md">
                    {translator("formFields.customerID")} :
                  </p>
                  <p className="text-muted-foreground text-md">
                    {personalDetails?.custDetails?.customerId || ""}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 px-0 md:px-16 items-center">
              <p className="text-md">{translator("mobileNumber")}:</p>
              <p className="text-muted-foreground text-md">
                {personalDetails?.custDetails?.mobileNumber}
              </p>
            </div>
          </div>
        </div>
      </CardWrapper>

      <h4 className="text-lg text-primary pt-4 pb-2">
        {translator("mobileNumberUpdate.enterMobileNumber")}
      </h4>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={control}
            name="mobileNumber"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <MobileNumberInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={translator("placeholder.mobileNumber")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <InfoMessage
            icon={infoIcon}
            message={"mobileNumberUpdate.updateForSelectedCif"}
          />
          <div className="max-w-max mt-5">
            <div className="flex gap-3">
              <Button
                variant="primary"
                type="submit"
                disabled={!isDirty || timer > 0}
              >
                {isProceedToAadhar
                  ? translator("button.continueToEsign")
                  : translator("mobileNumberUpdate.verifyMobile")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleFormReset}
                disabled={isProceedToAadhar}
              >
                {translator("button.reset")}
              </Button>
              {isShowCheckStatus && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCheckStatus}
                  disabled={isCheckStatusLoading}
                >
                  {translator("button.checkStatus")}
                </Button>
              )}
            </div>
            {isShowCheckStatus && (
              <div className="flex justify-between  text-xs text-right my-1">
                {timer ? (
                  <div>
                    {translator("mobileNumberUpdate.tryAgainIn")}{" "}
                    <span className="font-bold">{formatTime(timer)}</span>
                  </div>
                ) : (
                  <>
                    {isShowCheckStatus && !isFormEmpty && (
                      <div
                        className="text-primary underline cursor-pointer"
                        onClick={handleTryAgain}
                      >
                        {translator("mobileNumberUpdate.tryAgain")}
                      </div>
                    )}
                  </>
                )}
                <div className="text-primary-gray">
                  {translator("mobileNumberUpdate.maximumThreeAttempts")}
                </div>
              </div>
            )}
          </div>
        </form>
      </Form>

      {alertMessage.message && (
        <div className="my-5">
          <AlertMessage
            type={alertMessage.type}
            message={alertMessage.message}
          />
        </div>
      )}

      <AlertDialogComponent
        title={"mobileNumberUpdate.verifyMobile"}
        message={"mobileNumberUpdate.verificationLinkSend"}
        icon={warning}
        onConfirm={onCancel}
        open={isOpen}
        confirmButtonText="button.close"
      />
    </div>
  );
};

export default UpdateDetails;
