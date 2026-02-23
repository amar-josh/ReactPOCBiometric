import { useMemo } from "react";

import AlertMessage from "@/components/common/AlertMessage";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import PageHeader from "@/components/common/PageHeader";
import TableComponent from "@/components/common/TableComponent";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MASKED_KEY, NO, YES } from "@/constants/globalConstant";
import translator from "@/i18n/translator";

import VerificationForm from "./components/VerificationForm";
import { IDENTIFIER_TYPE_CONSTANTS } from "./constants";
import { useGenerateLink, useSearchDetails } from "./hooks";
import { IMobileOrEmailVerificationForm } from "./types";
import { getTableHeaders } from "./utils";

const MobileEmailVerification = () => {
  const {
    mutate: searchDetails,
    isPending: isSearchDetailsLoading,
    isSuccess: isSearchDetailsSuccess,
    data: searchDetailsResponse,
    reset: resetSearchDetails,
  } = useSearchDetails();

  const {
    mutate: generateLink,
    isPending: isGenerateLinkLoading,
    isSuccess: isGenerateLinkSuccess,
    reset: resetGenerateLink,
  } = useGenerateLink();

  const isLoading = useMemo(
    () => isSearchDetailsLoading || isGenerateLinkLoading,
    [isGenerateLinkLoading, isSearchDetailsLoading]
  );

  const requestNumber = useMemo(
    () => searchDetailsResponse?.data?.requestNumber || "",
    [searchDetailsResponse?.data?.requestNumber]
  );

  const onSubmit = (data: IMobileOrEmailVerificationForm) => {
    const payload =
      data?.identifier === MASKED_KEY.EMAIL
        ? { email: data.email }
        : { mobile: data.mobile };
    searchDetails(payload);
  };

  const identifier = useMemo(() => {
    return searchDetailsResponse?.data?.mobile
      ? IDENTIFIER_TYPE_CONSTANTS.MOBILE
      : IDENTIFIER_TYPE_CONSTANTS.EMAIL;
  }, [searchDetailsResponse?.data?.mobile]);

  const handleSubmit = () => {
    const payload = {
      identifier: identifier,
      ...(searchDetailsResponse?.data?.mobile && {
        mobileNumber: searchDetailsResponse?.data?.mobile,
      }),
      ...(searchDetailsResponse?.data?.email && {
        email: searchDetailsResponse?.data?.email,
      }),
      requestNumber: requestNumber,
    };
    generateLink(payload);
  };

  const handleReset = () => {
    resetSearchDetails();
    resetGenerateLink();
  };

  const tableHeaders = useMemo(() => {
    return getTableHeaders(identifier === IDENTIFIER_TYPE_CONSTANTS.MOBILE);
  }, [identifier]);

  const isVerifyButtonDisabled = useMemo(
    () =>
      searchDetailsResponse?.data?.reVerify ||
      searchDetailsResponse?.data?.verificationStatus,
    [
      searchDetailsResponse?.data?.reVerify,
      searchDetailsResponse?.data?.verificationStatus,
    ]
  );

  const isReverifyButtonDisabled = useMemo(
    () => !searchDetailsResponse?.data?.reVerify,
    [searchDetailsResponse?.data?.reVerify]
  );

  const tableData = useMemo(() => {
    if (isSearchDetailsSuccess && searchDetailsResponse?.data) {
      const { mobile, email, verificationStatus, lastVerificationPerformed } =
        searchDetailsResponse.data;

      return [
        {
          mobile,
          email,
          status: verificationStatus ? YES : NO,
          date: lastVerificationPerformed,
        },
      ];
    }
    return [];
  }, [isSearchDetailsSuccess, searchDetailsResponse]);

  return (
    <div className="px-6 py-3">
      {isLoading && <FullScreenLoader />}
      <PageHeader title={"mobileEmailVerification.title"} />
      <Separator />
      <VerificationForm
        onSubmit={onSubmit}
        onReset={handleReset}
        isSearchDetailsSuccess={isSearchDetailsSuccess}
      />
      {isSearchDetailsSuccess && (
        <div className="w-full lg:w-2/3">
          <TableComponent
            data={tableData as Array<Record<string, string>>}
            headers={tableHeaders}
          />
          {searchDetailsResponse?.data?.reVerify && (
            <div className="my-5">
              <AlertMessage
                type="warning"
                message={translator(
                  "mobileEmailVerification.lastVerifiedMoreThanThreeMonthsAgo"
                )}
              />
            </div>
          )}
          <div className="flex gap-3 my-5">
            <Button
              disabled={isVerifyButtonDisabled}
              variant="primary"
              onClick={handleSubmit}
            >
              {translator("verify")}
            </Button>
            <Button
              type="button"
              disabled={isReverifyButtonDisabled}
              variant="outline"
              onClick={handleSubmit}
            >
              {translator("button.reVerify")}
            </Button>
          </div>
        </div>
      )}
      {isGenerateLinkSuccess && (
        <AlertMessage
          type="success"
          message={translator(
            "mobileEmailVerification.mobileLinkSentToCustomer"
          )}
        />
      )}
    </div>
  );
};

export default MobileEmailVerification;
