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
import { MOBILE_NUMBER_REGEX } from "@/constants/regex";
import { ICustomerSearchResponse } from "@/features/re-kyc/types";
import { useAlertMessage } from "@/hooks/useAlertMessage";
import translator from "@/i18n/translator";

import { useCheckStatus, useGenerateLink, useVerifyNumber } from "../hooks";

const formSchema = yup.object().shape({
  searchBy: yup.string(),
  mobileNumber: yup
    .string()
    .required(translator("validations.mobileNumber.matchesRegex"))
    .matches(
      MOBILE_NUMBER_REGEX,
      translator("validations.mobileNumber.matchesRegex")
    ),
});

type FormSchemaType = yup.InferType<typeof formSchema>;

interface IUpdateDetailsProps {
  setNewMobileNumber: React.Dispatch<React.SetStateAction<string | undefined>>;
  updateStep: () => void;
  personalDetails: ICustomerSearchResponse;
  requestNumber: string;
}

const UpdateDetails = (props: IUpdateDetailsProps) => {
  const { setNewMobileNumber, updateStep, personalDetails, requestNumber } =
    props;

  const nameFirstLetter =
    personalDetails?.custDetails?.customerName?.charAt(0).toUpperCase() || "";

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
    // @ts-expect-error: yupResolver type mismatch with react-hook-form expected resolver, safe to ignore as per project setup
    resolver: yupResolver(formSchema),
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
    if (data?.data?.totalCicks > 3) {
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

  const handleCheckStatusSuccess = () => {
    setTimer(0);
    setIsShowCheckStatus(false);
    setIsProceedToAadhar((prev) => !prev);
    setAlertMessage({
      message: translator("mobileNumberUpdate.successfulVerified"),
      type: SUCCESS,
    });
  };

  const handleCheckStatus = () => {
    checkStatusMutate(
      {
        requestNumber,
      },
      {
        onSuccess: handleCheckStatusSuccess,
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
      <h4 className="text-primary text-2xl font-medium pb-5">
        {translator("mobileNumberUpdate.updateDetails")}
      </h4>
      <CardWrapper backgroundColor="bg-light-gray pt-0 px-2">
        <div className="flex items-center gap-6">
          <div className="flex flex-col gap-y-1.5 lg:flex-row  w-full">
            <div className="flex flex-row gap-7">
              <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-3xl font-bold">
                {nameFirstLetter}
              </div>
              <div>
                <h3 className="font-semibold">
                  {personalDetails?.custDetails?.customerName || ""}
                </h3>
                <div className="flex gap-2">
                  <p className="text-md">
                    {translator("mobileNumberUpdate.cif")}
                  </p>
                  <p className="text-muted-foreground text-md">
                    {personalDetails?.custDetails?.customerId || ""}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 px-0 md:px-16 items-center">
              <p className="text-md">{translator("reKyc.mobileNumber")}:</p>
              <p className="text-muted-foreground text-md">
                {personalDetails?.custDetails?.mobileNumber}
              </p>
            </div>
          </div>
        </div>
      </CardWrapper>

      <h4 className="text-xl text-primary py-4">
        {translator("mobileNumberUpdate.enterMobileNumber")}
      </h4>
      <Form {...form}>
        {/* TODO:Fix control type issue
         @ts-expect-error:fixes */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            // TODO:Fix control type issue
            // @ts-expect-error:fixes
            control={control}
            name="mobileNumber"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <MobileNumberInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={translator("reKyc.placeholder.mobileNumber")}
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
        title={translator("mobileNumberUpdate.verifyMobile")}
        message={translator("mobileNumberUpdate.verificationLinkSend")}
        icon={warning}
        onConfirm={onCancel}
        open={isOpen}
        confirmButtonText={translator("button.close")}
      />
    </div>
  );
};

export default UpdateDetails;
