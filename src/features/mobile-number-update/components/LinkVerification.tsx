import { useEffect } from "react";
import { useSearchParams } from "react-router";

import error from "@/assets/images/error.svg";
import success from "@/assets/images/success.svg";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { STATUS_CODE } from "@/constants/statusCodes";
import translator from "@/i18n/translator";

import { useVerifyLink } from "../hooks";

const LinkVerification = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams?.get("token");

  const {
    mutate: linkVerificationMutation,
    data: linkVerificationData,
    isPending: isLinkVerificationLoading,
    error: linkVerificationError,
  } = useVerifyLink();

  const isSuccess =
    linkVerificationData?.statusCode === STATUS_CODE.OK ||
    linkVerificationData?.statusCode === STATUS_CODE.UNAUTHORIZED;

  const title = isSuccess
    ? translator("mobileNumberUpdate.thankYou")
    : translator("mobileNumberUpdate.sorry");

  const Icon = isSuccess ? success : error;

  useEffect(() => {
    linkVerificationMutation({
      shortCode: token,
    });
  }, []);

  if (isLinkVerificationLoading) {
    return <FullScreenLoader />;
  }

  const message = linkVerificationData?.msg || linkVerificationError?.message;

  return (
    <div className="flex flex-col items-center justify-center px-5 md:px-10 py-5">
      <h3 className="text-xl md:text-4xl font-medium">
        {translator("mobileNumberUpdate.linkVerification")}
      </h3>
      <Separator className="my-7" />
      <Card className="bg-light-gray w-full mx-auto p-6 text-center rounded-xl shadow-sm">
        <CardContent className="flex flex-col items-center gap-3">
          <div className="p-3 rounded-full">
            <img src={Icon} className="text-white" />
          </div>
          <h2 className="font-semibold text-xl">{title}</h2>
          <p className="font-semibold text-lg">{message}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LinkVerification;
