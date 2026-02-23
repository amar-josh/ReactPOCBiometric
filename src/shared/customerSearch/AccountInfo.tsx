import { useCallback } from "react";

import BadgeComponent from "@/components/common/BadgeComponent";
import CardWrapper from "@/components/common/InfoCardWrapper";
import { BADGE_COLOR_CONSTANTS, MASKED_KEY } from "@/constants/globalConstant";
import { IAccountDetail, ICustomerDetails } from "@/features/re-kyc/types";
import translator from "@/i18n/translator";
import { maskData } from "@/lib/maskData";

import { ACCOUNT_STATUS, ACCOUNT_STATUS_LABELS } from "./constants";

interface IAccountInfoCardProps {
  selected: boolean;
  accounts: IAccountDetail[];
  onSelect?: () => void;
  isDisabled?: boolean;
  customerDetails?: ICustomerDetails;
  searchBy?: string;
}

const AccountInfoCard = ({
  selected,
  accounts,
  onSelect,
  customerDetails,
  isDisabled,
  searchBy,
}: IAccountInfoCardProps) => {
  const accountStatus = useCallback((account: IAccountDetail) => {
    if (account?.isAccountDormant) {
      return (
        <BadgeComponent
          label={ACCOUNT_STATUS_LABELS[ACCOUNT_STATUS.DORMANT]}
          variant={BADGE_COLOR_CONSTANTS.WARNING}
        />
      );
    } else if (account?.isDebitFreeze) {
      return (
        <BadgeComponent
          label={ACCOUNT_STATUS_LABELS[ACCOUNT_STATUS.FROZEN]}
          variant={BADGE_COLOR_CONSTANTS.DANGER}
        />
      );
    } else {
      return <></>;
    }
  }, []);

  const disabledStyles = isDisabled
    ? "pointer-events-none cursor-not-allowed"
    : "";

  const isMobileSearch = searchBy === "mobile";

  return (
    <div className={disabledStyles}>
      <CardWrapper
        withRadio
        selected={!isDisabled && selected}
        radioValue={customerDetails?.customerId}
        title={
          isMobileSearch
            ? `${translator("reKyc.associatedCifId")} ${customerDetails?.customerId}`
            : `${translator("reKyc.accountRelatedToCif")} ${customerDetails?.customerId}`
        }
        subTitle={translator("reKyc.customerName")}
        subTitleInfo={customerDetails?.customerName || ""}
        onSelect={onSelect}
        className={isDisabled ? "bg-light-gray" : ""}
        hideAccountNumbers={isMobileSearch}
      >
        <div className="space-y-2">
          {!isMobileSearch &&
            accounts?.map((account, index) => (
              <div
                key={index}
                className="flex justify-between items-center rounded-md"
              >
                <div className="flex flex-col lg:flex-row gap-2">
                  <p className="text-sm">{translator("accountNumber")}:</p>
                  <p className="text-muted-foreground text-sm">
                    {maskData(
                      String(account.accountNumber),
                      MASKED_KEY.CUSTOMER_ID
                    )}
                  </p>
                </div>

                <div className="flex-1 flex ml-0 md:ml-12 items-center justify-start">
                  <BadgeComponent label={account.productName} />
                </div>

                <div className="flex items-center justify-end w-[12.5rem]">
                  {accountStatus(account)}
                </div>
              </div>
            ))}
          {isDisabled && (
            <p className="text-xs">
              {translator("reKyc.notEligibleForInstaServiceRequest")}
            </p>
          )}
        </div>
      </CardWrapper>
    </div>
  );
};

export default AccountInfoCard;
