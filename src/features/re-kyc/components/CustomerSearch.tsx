import { RadioGroup } from "@radix-ui/react-radio-group";
import { AxiosError } from "axios";
import { Dispatch, RefObject, SetStateAction } from "react";

import AlertMessage from "@/components/common/AlertMessage";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ERROR, SUCCESS } from "@/constants/globalConstant";
import { useAlertMessage } from "@/hooks/useAlertMessage";
import translator from "@/i18n/translator";
import { IAlertMessage } from "@/types";

import { ICif, IGetCustomerSearchRequest } from "../types";
import AccountInfoCard from "./AccountInfoCard";
import CustomerSearchForm from "./CustomerSearchForm";
import EligibilityCard from "./EligibilityCard";

interface ISearchCustomerComponentProps {
  customerSearchRef: RefObject<{
    resetForm: () => void;
  } | null>;
  handleSearch: (data: IGetCustomerSearchRequest) => void;
  handleResetSearch: () => void;
  handleResetCustomerSearchAPI: () => void;
  isCustomerSearchSuccess: boolean;
  customerSearchAlertMessage: IAlertMessage;
  accountDetails: ICif[] | undefined;
  selected: string | undefined;
  setSelected: Dispatch<SetStateAction<string | undefined>>;
  hasDormantAccount: boolean | undefined;
  handleReKYCNext: () => void;
  isCustomerSearchLoading: boolean;
  customerDetailsError: Error | AxiosError | null;
  isCustomerDetailsError: boolean;
  customerDetailsErrorMessage: IAlertMessage;
  setCustomerDetailsErrorAlertMessage: Dispatch<SetStateAction<IAlertMessage>>;
}

const CustomerSearch = ({
  customerSearchRef,
  handleSearch,
  handleResetSearch,
  handleResetCustomerSearchAPI,
  isCustomerSearchSuccess,
  customerSearchAlertMessage,
  accountDetails,
  customerDetailsErrorMessage,
  setCustomerDetailsErrorAlertMessage,
  selected,
  setSelected,
  hasDormantAccount,
  handleReKYCNext,
  isCustomerSearchLoading,
}: ISearchCustomerComponentProps) => {
  const onCancel = () => {
    handleResetSearch();
    setCustomerDetailsErrorAlertMessage({
      type: SUCCESS,
      message: "",
    });
  };

  return (
    <>
      {isCustomerSearchLoading && <FullScreenLoader />}
      <CustomerSearchForm
        ref={customerSearchRef}
        onSearch={handleSearch}
        onReset={onCancel}
        onResetCustomerSearchAPI={handleResetCustomerSearchAPI}
        isSuccess={isCustomerSearchSuccess}
      />
      <Separator />
      {customerSearchAlertMessage.message && (
        <AlertMessage
          type={customerSearchAlertMessage.type}
          message={customerSearchAlertMessage.message}
        />
      )}

      {/* TODO:Remove below component if not needed */}
      {/* {personalDetails && (
        <PersonalDetailsCard
          name={personalDetails.fullName}
          email={personalDetails.emailId}
          mobile={personalDetails.mobileNo}
        />
      )} */}

      {accountDetails ? (
        <>
          <RadioGroup
            value={selected}
            onValueChange={setSelected}
            className="flex flex-col gap-6"
          >
            {accountDetails.map((data, index) => {
              return (
                <AccountInfoCard
                  key={index}
                  selected={selected === String(data?.custDetails?.customerId)}
                  onSelect={() =>
                    setSelected(String(data?.custDetails?.customerId))
                  }
                  customerDetails={data.custDetails}
                  accounts={data.accDetails}
                  isDisabled={data?.custDetails?.isIndividual}
                />
              );
            })}
          </RadioGroup>
          <p className="text-sm">
            {translator("reKyc.allAccountsMappedGetsUpdated")}
          </p>
          <div className="flex gap-3">
            <Button
              variant="primary"
              disabled={!selected}
              onClick={handleReKYCNext}
            >
              {translator("button.next")}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              {translator("button.cancel")}
            </Button>
          </div>
          {customerDetailsErrorMessage.message && (
            <AlertMessage
              type={customerDetailsErrorMessage.type}
              message={customerDetailsErrorMessage.message}
            />
          )}
          {hasDormantAccount && (
            <AlertMessage
              type="warning"
              message={translator("reKyc.modal.dormantAccount")}
            />
          )}
        </>
      ) : (
        <EligibilityCard />
      )}
    </>
  );
};

export default CustomerSearch;
