import { RadioGroup } from "@radix-ui/react-radio-group";
import { memo, useState } from "react";
import { Dispatch, RefObject, SetStateAction } from "react";

import AlertMessage from "@/components/common/AlertMessage";
import EligibilityCard from "@/components/common/EligibilityCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { IGetCustomerSearchRequest as IGetCustomerSearchRequestMobileNumberUpdate } from "@/features/mobile-number-update/types";
import { IGetCustomerSearchRequest as IGetCustomerSearchRequestReKYC } from "@/features/re-kyc/types";
import translator from "@/i18n/translator";
import { IAlertMessage, JourneyType } from "@/types";

import AccountInfoCard from "./AccountInfo";
import { ELIGIBILITY_CARD_CONTENT } from "./constants";
import CustomerSearchForm from "./CustomerSearchForm";
import { ICustomerSearchResponseItem, ISearchOption } from "./types";

interface ISearchCustomerComponentProps {
  customerSearchRef: RefObject<{
    resetForm: () => void;
  } | null>;
  handleSearch: (
    data:
      | IGetCustomerSearchRequestReKYC
      | IGetCustomerSearchRequestMobileNumberUpdate
  ) => void;
  handleResetCustomerSearchAPI: () => void;
  isCustomerSearchSuccess: boolean;
  customerSearchAlertMessage: IAlertMessage;
  accountDetails: ICustomerSearchResponseItem[] | undefined;
  selectedCustomerId: string | undefined;
  setSelectedCustomerId: Dispatch<SetStateAction<string>>;
  handleNext: () => void;
  customerDetailsErrorMessage: IAlertMessage;
  handleShowCancelModal: () => void;
  handleResetSearch: () => void;
  journeyType: JourneyType;
  searchOptions: Array<ISearchOption>;
}

const CustomerSearch = ({
  customerSearchRef,
  handleSearch,
  handleResetSearch,
  handleShowCancelModal,
  handleResetCustomerSearchAPI,
  isCustomerSearchSuccess,
  customerSearchAlertMessage,
  accountDetails,
  customerDetailsErrorMessage,
  selectedCustomerId,
  setSelectedCustomerId,
  handleNext,
  journeyType,
  searchOptions,
}: ISearchCustomerComponentProps) => {
  const [searchBy, setSearchBy] = useState<string>("mobile");
  return (
    <>
      <CustomerSearchForm
        ref={customerSearchRef}
        onSearch={handleSearch}
        onReset={handleResetSearch}
        onResetCustomerSearchAPI={handleResetCustomerSearchAPI}
        isSuccess={isCustomerSearchSuccess}
        searchOptions={searchOptions}
        onSearchByChange={setSearchBy}
      />
      <Separator />
      {customerSearchAlertMessage.message && (
        <AlertMessage
          type={customerSearchAlertMessage.type}
          message={customerSearchAlertMessage.message}
        />
      )}

      {accountDetails ? (
        <>
          <RadioGroup
            value={selectedCustomerId}
            onValueChange={setSelectedCustomerId}
            className="flex flex-col gap-6"
          >
            {accountDetails?.map((data, index) => {
              return (
                <AccountInfoCard
                  key={index}
                  selected={
                    selectedCustomerId === data?.custDetails?.customerId
                  }
                  onSelect={() =>
                    setSelectedCustomerId(data?.custDetails?.customerId)
                  }
                  customerDetails={data.custDetails}
                  accounts={data.accDetails}
                  isDisabled={!data?.custDetails?.isIndividual}
                  searchBy={searchBy}
                />
              );
            })}
          </RadioGroup>

          <div className="flex gap-3">
            <Button
              variant="primary"
              disabled={!selectedCustomerId}
              onClick={handleNext}
            >
              {translator("button.next")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleShowCancelModal}
            >
              {translator("button.cancel")}
            </Button>
          </div>
          {customerDetailsErrorMessage.message && (
            <AlertMessage
              type={customerDetailsErrorMessage.type}
              message={customerDetailsErrorMessage.message}
            />
          )}
        </>
      ) : (
        <EligibilityCard
          title={ELIGIBILITY_CARD_CONTENT[journeyType].title}
          items={ELIGIBILITY_CARD_CONTENT[journeyType].items}
          rightImage={ELIGIBILITY_CARD_CONTENT[journeyType].rightImage}
          rightImageAlt={ELIGIBILITY_CARD_CONTENT[journeyType].rightImageAlt}
        />
      )}
    </>
  );
};

export default memo(CustomerSearch);
