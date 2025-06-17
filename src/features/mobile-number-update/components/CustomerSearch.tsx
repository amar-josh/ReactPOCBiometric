import { Dispatch, RefObject, SetStateAction } from "react";

import infoIcon from "@/assets/images/info-black.svg";
import AlertMessage from "@/components/common/AlertMessage";
import InfoMessage from "@/components/common/InfoMessage";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { SUCCESS } from "@/constants/globalConstant";
import AccountInfoCard from "@/features/re-kyc/components/AccountInfoCard";
import CustomerSearchForm from "@/features/re-kyc/components/CustomerSearchForm";
import PersonalDetailsCard from "@/features/re-kyc/components/PersonalDetailsCard";
import {
  ICif,
  IGetCustomerSearchRequest,
  IPersonalDetails,
} from "@/features/re-kyc/types";
import translator from "@/i18n/translator";
import { IAlertMessage } from "@/types";

interface ICustomerSearchProps {
  customerSearchRef: RefObject<{
    resetForm: () => void;
  } | null>;
  handleSearch: (data: IGetCustomerSearchRequest) => void;
  handleResetSearch: () => void;
  handleResetCustomerSearchAPI: () => void;
  isCustomerSearchSuccess: boolean;
  fetchRecordsErrorMessage: IAlertMessage;
  personalDetails: IPersonalDetails | undefined;
  accountDetails: ICif[] | undefined;
  selected: string | undefined;
  setSelected: Dispatch<SetStateAction<string | undefined>>;
  handleNext: () => void;
  setFetchRecordsErrorMessage: Dispatch<SetStateAction<IAlertMessage>>;
  customerSearchAlertMessage: IAlertMessage;
}

const CustomerSearch = ({
  customerSearchRef,
  handleSearch,
  handleResetSearch,
  handleResetCustomerSearchAPI,
  isCustomerSearchSuccess,
  customerSearchAlertMessage,
  fetchRecordsErrorMessage,
  personalDetails,
  accountDetails,
  setFetchRecordsErrorMessage,
  handleNext,
  selected,
  setSelected,
}: ICustomerSearchProps) => {
  const onCancel = () => {
    handleResetSearch();
    setFetchRecordsErrorMessage({ type: SUCCESS, message: "" });
  };
  return (
    <div className="gap-6 flex flex-col">
      <CustomerSearchForm
        ref={customerSearchRef}
        onSearch={handleSearch}
        onReset={handleResetSearch}
        onResetCustomerSearchAPI={handleResetCustomerSearchAPI}
        isSuccess={isCustomerSearchSuccess}
      />
      <InfoMessage
        icon={infoIcon}
        message={"mobileNumberUpdate.errorMessages.aadharMustLinked"}
      />

      <Separator />
      {customerSearchAlertMessage.message && (
        <AlertMessage
          type={customerSearchAlertMessage.type}
          message={customerSearchAlertMessage.message}
        />
      )}

      {personalDetails && (
        <PersonalDetailsCard
          name={personalDetails.fullName}
          email={personalDetails.emailId}
          mobile={personalDetails.mobileNo}
        />
      )}

      {accountDetails && (
        <>
          <RadioGroup
            value={selected}
            onValueChange={setSelected}
            className="flex flex-col gap-6"
          >
            {accountDetails.map((data, index) => {
              return (
                <div key={index}>
                  <AccountInfoCard
                    key={index}
                    selected={
                      selected === String(data?.custDetails?.customerId)
                    }
                    onSelect={() =>
                      setSelected(String(data?.custDetails?.customerId))
                    }
                    customerDetails={data.custDetails}
                    accounts={data.accDetails}
                    isDisabled={data?.custDetails?.isIndividual}
                  />
                </div>
              );
            })}
            <InfoMessage
              icon={infoIcon}
              message={"mobileNumberUpdate.numberUpdateForAboveAccount"}
            />
          </RadioGroup>

          <div className="flex gap-3">
            <Button variant="primary" onClick={handleNext}>
              {translator("button.next")}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              {translator("button.cancel")}
            </Button>
          </div>
          {fetchRecordsErrorMessage.message && (
            <AlertMessage
              type={fetchRecordsErrorMessage.type}
              message={fetchRecordsErrorMessage.message}
            />
          )}
        </>
      )}
    </div>
  );
};

export default CustomerSearch;
