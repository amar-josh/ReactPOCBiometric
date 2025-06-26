import { yupResolver } from "@hookform/resolvers/yup";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import AlertMessage from "@/components/common/AlertMessage";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ERROR } from "@/constants/globalConstant";
import { useGetOtherDropdownDetails } from "@/features/re-kyc/hooks/useRekyc";
import {
  IAddress,
  ILabelValue,
  IOnSubmitAddressFormData,
  IReKYCData,
} from "@/features/re-kyc/types";
import { useAlertMessage } from "@/hooks/useAlertMessage";
import translator from "@/i18n/translator";
import { convertToLabelValue } from "@/lib/utils";

import { ESIGN, UPDATE } from "../constants";
import {
  getLabelBasedOnValue,
  otherDetailsFormSchema,
  otherDetailsValidationSchema,
  reKycFormSchema,
} from "../utils";
import OtherDetailsForm from "./OtherDetailsForm";
import ReKYCDetailsForm from "./reKYCDetailsForm";

interface IReKYCDetailsProps {
  reKYCDetails: IReKYCData;
  handleContinueToEsign: () => void;
  handleUpdateCommunicationAddress: () => void;
  setOtherDetails: React.Dispatch<
    React.SetStateAction<{
      occupation: ILabelValue;
      residentType: ILabelValue;
      incomeRange: ILabelValue;
    }>
  >;
  onCancel?: () => void;
  setIsOtherDetailsChange: Dispatch<SetStateAction<boolean>>;
}

const ReKYCDetails = ({
  reKYCDetails,
  setOtherDetails,
  onCancel,
  handleContinueToEsign,
  handleUpdateCommunicationAddress,
  setIsOtherDetailsChange,
}: IReKYCDetailsProps) => {
  const [selectOptions, setSelectOptions] = useState<{
    residentType: ILabelValue[];
    occupation: ILabelValue[];
    incomeRange: ILabelValue[];
  }>({
    residentType: [],
    occupation: [],
    incomeRange: [],
  });

  const [submitAction, setSubmitAction] = useState<"esign" | "update" | null>(
    null
  );

  const {
    mutate: getOtherDropdownDetails,
    error: otherDropdownDetailsError,
    isError: isOtherDropdownDetailsError,
  } = useGetOtherDropdownDetails();

  const { alertMessage } = useAlertMessage(
    ERROR,
    otherDropdownDetailsError?.message,
    isOtherDropdownDetailsError
  );

  useEffect(() => {
    getOtherDropdownDetails(undefined, {
      onSuccess: (data) => {
        setSelectOptions(() => ({
          residentType: convertToLabelValue(data?.data?.resident, false) || [],
          occupation: convertToLabelValue(data?.data?.occupation) || [],
          incomeRange: convertToLabelValue(data?.data?.income) || [],
        }));
      },
    });
  }, [getOtherDropdownDetails]);

  const reKYCDetailsForm = useForm({
    defaultValues: reKycFormSchema.reduce(
      (acc, curr) => {
        const key = curr.value;

        const formatAddress = (addressObj: IAddress) => {
          const {
            addressLine1,
            addressLine2,
            addressLine3,
            city,
            state,
            country,
            pincode,
          } = addressObj || {};
          return [
            addressLine1,
            addressLine2,
            addressLine3,
            city,
            state,
            country,
            pincode,
          ].join(", ");
        };

        if (["permanentAddress", "communicationAddress"].includes(key)) {
          acc[key] = formatAddress(
            reKYCDetails?.rekycDetails?.[key] as IAddress
          );
        } else {
          acc[key] =
            reKYCDetails?.rekycDetails?.[key] ?? curr.defaultValue ?? "";
        }

        return acc;
      },
      {} as Record<string, any>
    ),
  });

  const otherDetailsForm = useForm({
    defaultValues: otherDetailsFormSchema.reduce(
      (acc, curr) => {
        const key = curr.value;
        acc[key] = reKYCDetails?.otherDetails?.[key] ?? curr.defaultValue ?? "";
        return acc;
      },
      {} as Record<string, any>
    ),
    //   TODO:fix onSubmit type issue
    // @ts-expect-error:fixes
    resolver: yupResolver(otherDetailsValidationSchema),
  });

  const { control: reKYCDetailsFormControl } = reKYCDetailsForm;

  const {
    control: otherDetailsFormControl,
    handleSubmit,
    formState: { isDirty },
    // TODO - will be useful once backend integrates
  } = otherDetailsForm;

  useEffect(() => {
    if (isDirty) {
      setIsOtherDetailsChange(true);
    }
  }, [isDirty, setIsOtherDetailsChange]);

  const getValuesBaseonKey = (data: IOnSubmitAddressFormData) => {
    const updatedOtherDetails = {
      residentType: {
        label: getLabelBasedOnValue(
          selectOptions["residentType"],
          data?.residentType
        ),
        value: data?.residentType,
      },
      occupation: {
        label: getLabelBasedOnValue(
          selectOptions["occupation"],
          data?.occupation
        ),
        value: data?.occupation,
      },
      incomeRange: {
        label: getLabelBasedOnValue(
          selectOptions["incomeRange"],
          data?.incomeRange
        ),
        value: data?.incomeRange,
      },
    };

    setOtherDetails(updatedOtherDetails);
  };

  const onSubmit = (data: IOnSubmitAddressFormData) => {
    getValuesBaseonKey(data);
    if (submitAction === ESIGN) {
      handleContinueToEsign();
    } else if (submitAction === UPDATE) {
      handleUpdateCommunicationAddress();
    }
  };

  return (
    <>
      <Form {...reKYCDetailsForm}>
        <form>
          <ReKYCDetailsForm reKYCDetailsFormControl={reKYCDetailsFormControl} />
        </form>
      </Form>

      <Form {...otherDetailsForm}>
        {/* TODO:fix onSubmit type issue */}
        {/*  @ts-expect-error:fixes */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <OtherDetailsForm
            isOtherDropdownDetailsError={isOtherDropdownDetailsError}
            otherDetailsFormControl={otherDetailsFormControl}
            selectOptions={selectOptions}
          />
          <div className="mt-5">
            {alertMessage.message && (
              <AlertMessage
                type={alertMessage.type}
                message={alertMessage.message}
              />
            )}
          </div>
          <div className="mt-7">
            {(reKYCDetails as IReKYCData)?.metaData?.message && (
              <AlertMessage
                type="warning"
                message={(reKYCDetails as IReKYCData)?.metaData?.message}
              />
            )}
          </div>
          <div className="flex flex-col md:flex-row justify-items-start mt-5 gap-3">
            <Button
              variant="primary"
              type="submit"
              onClick={() => setSubmitAction("esign")}
              disabled={reKYCDetails?.metaData?.noChangeEnabled ?? false}
            >
              {translator("button.continueToEsign")}
            </Button>
            <Button
              variant="primary"
              type="submit"
              onClick={() => setSubmitAction("update")}
              disabled={reKYCDetails?.metaData?.updateAddressEnabled ?? false}
            >
              {translator("button.updateCommunicationAddress")}
            </Button>
            <Button variant="outline" onClick={onCancel}>
              {translator("button.cancel")}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default ReKYCDetails;
