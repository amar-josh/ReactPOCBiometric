// TODO - These details are not available in the ESB yet, so we are hiding them until they become available.

// import { yupResolver } from "@hookform/resolvers/yup";
import {
  Dispatch,
  memo,
  SetStateAction,
  // useEffect,
  useMemo,
} from "react";
import { useForm } from "react-hook-form";

import infoIcon from "@/assets/images/info-black.svg";
import AlertMessage from "@/components/common/AlertMessage";
import InfoMessage from "@/components/common/InfoMessage";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
// import { ERROR } from "@/constants/globalConstant";
// import { useGetOtherDropdownDetails } from "@/features/re-kyc/hooks/useRekyc";
import {
  IAddress,
  // ILabelValue,
  // IOnSubmitAddressFormData,
  IReKYCData,
} from "@/features/re-kyc/types";
// import { useAlertMessage } from "@/hooks/useAlertMessage";
import translator from "@/i18n/translator";

// import { convertToLabelValue } from "@/lib/utils";
import { ESIGN, UPDATE } from "../constants";
import {
  formatAddress,
  // getLabelBasedOnValue,
  // otherDetailsFormSchema,
  // otherDetailsValidationFormSchema,
  reKycFormSchema,
} from "../utils";
// import OtherDetailsForm from "./OtherDetailsForm";
import ReKYCDetailsForm from "./reKYCDetailsForm";

interface IReKYCDetailsProps {
  reKYCDetails: IReKYCData;
  handleContinueToEsign: () => void;
  handleUpdateCommunicationAddress: () => void;
  // setOtherDetails: React.Dispatch<
  //   React.SetStateAction<{
  //     occupation: ILabelValue;
  //     residentType: ILabelValue;
  //     incomeRange: ILabelValue;
  //   }>
  // >;
  handleShowCancelModal: () => void;
  setIsOtherDetailsChange: Dispatch<SetStateAction<boolean>>;
}

const ReKYCDetails = ({
  reKYCDetails,
  // setOtherDetails,
  handleShowCancelModal,
  handleContinueToEsign,
  handleUpdateCommunicationAddress,
  // setIsOtherDetailsChange,
}: IReKYCDetailsProps) => {
  // const [selectOptions, setSelectOptions] = useState<{
  //   residentType: ILabelValue[];
  //   occupation: ILabelValue[];
  //   incomeRange: ILabelValue[];
  // }>({
  //   residentType: [],
  //   occupation: [],
  //   incomeRange: [],
  // });

  // const {
  //   mutate: getOtherDropdownDetails,
  //   error: otherDropdownDetailsError,
  //   isError: isOtherDropdownDetailsError,
  // } = useGetOtherDropdownDetails();

  // const { alertMessage } = useAlertMessage(
  //   ERROR,
  //   otherDropdownDetailsError?.message,
  //   isOtherDropdownDetailsError
  // );

  // useEffect(() => {
  //   getOtherDropdownDetails(undefined, {
  //     onSuccess: (data) => {
  //       setSelectOptions(() => ({
  //         residentType:
  //           convertToLabelValue({
  //             list: data?.data?.resident || [],
  //           }) || [],
  //         occupation:
  //           convertToLabelValue({
  //             list: data?.data?.occupation || [],
  //           }) || [],
  //         incomeRange:
  //           convertToLabelValue({
  //             list: data?.data?.income || [],
  //             showCurrency: true,
  //           }) || [],
  //       }));
  //     },
  //   });
  // }, [getOtherDropdownDetails]);

  const reKYCDetailsForm = useForm({
    defaultValues: reKycFormSchema.reduce(
      (acc, curr) => {
        const key = curr.value;

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

  // const otherDetailsForm = useForm({
  //   defaultValues: otherDetailsFormSchema.reduce(
  //     (acc, curr) => {
  //       const key = curr.value;
  //       acc[key] =
  //         (key === "incomeRange" || key === "occupation") &&
  //         String(reKYCDetails?.otherDetails?.[key]) === "0"
  //           ? ""
  //           : (reKYCDetails?.otherDetails?.[key] ?? curr.defaultValue ?? "");
  //       return acc;
  //     },
  //     {} as Record<string, any>
  //   ),
  //   resolver: yupResolver(otherDetailsValidationFormSchema),
  // });

  const { control: reKYCDetailsFormControl } = reKYCDetailsForm;

  // const {
  //   control: otherDetailsFormControl,
  //   handleSubmit,
  //   formState: { isDirty },
  // } = otherDetailsForm;

  // useEffect(() => {
  //   if (isDirty) {
  //     setIsOtherDetailsChange(true);
  //   }
  // }, [isDirty, setIsOtherDetailsChange]);

  // const getValuesBaseonKey = (data: IOnSubmitAddressFormData) => {
  //   const updatedOtherDetails = {
  //     residentType: {
  //       label: getLabelBasedOnValue(
  //         selectOptions["residentType"],
  //         data?.residentType
  //       ),
  //       value: data?.residentType,
  //     },
  //     occupation: {
  //       label: getLabelBasedOnValue(
  //         selectOptions["occupation"],
  //         data?.occupation
  //       ),
  //       value: data?.occupation,
  //     },
  //     incomeRange: {
  //       label: getLabelBasedOnValue(
  //         selectOptions["incomeRange"],
  //         data?.incomeRange
  //       ),
  //       value: data?.incomeRange,
  //     },
  //   };

  //   setOtherDetails(updatedOtherDetails);
  // };

  // const onSubmit = (data: IOnSubmitAddressFormData) => {
  //   getValuesBaseonKey(data);
  //   if (submitAction === ESIGN) {
  //     handleContinueToEsign();
  //   } else if (submitAction === UPDATE) {
  //     handleUpdateCommunicationAddress();
  //   }
  // };

  const onSubmit = (action: "esign" | "update") => {
    if (action === ESIGN) {
      handleContinueToEsign();
    } else if (action === UPDATE) {
      handleUpdateCommunicationAddress();
    }
  };

  const isReKYCJourneyButtonsDisabled = useMemo(() => {
    return (
      !reKYCDetails?.metaData?.isNoChange &&
      !reKYCDetails?.metaData?.isUpdateAddress
    );
  }, [
    reKYCDetails?.metaData?.isNoChange,
    reKYCDetails?.metaData?.isUpdateAddress,
  ]);

  return (
    <>
      <Form {...reKYCDetailsForm}>
        <form>
          <ReKYCDetailsForm reKYCDetailsFormControl={reKYCDetailsFormControl} />
        </form>
      </Form>

      {/* <Form {...otherDetailsForm}>
        <form onSubmit={handleSubmit(onSubmit)}> */}
      {/* <OtherDetailsForm
            isOtherDropdownDetailsError={isOtherDropdownDetailsError}
            otherDetailsFormControl={otherDetailsFormControl}
            selectOptions={selectOptions}
          /> */}
      {/* <div className="mt-5">
            {alertMessage.message && (
              <AlertMessage
                type={alertMessage.type}
                message={alertMessage.message}
              />
            )}
          </div> */}
      {(reKYCDetails as IReKYCData)?.metaData?.message && (
        <div className="mt-7">
          <AlertMessage
            type="warning"
            message={(reKYCDetails as IReKYCData)?.metaData?.message}
          />
        </div>
      )}
      <div className="flex flex-col md:flex-row justify-items-start mt-5 gap-3">
        <Button
          variant="primary"
          type="submit"
          onClick={() => onSubmit("esign")}
          disabled={!reKYCDetails?.metaData?.isNoChange}
        >
          {translator("button.reKycWithNoChange")}
        </Button>
        <Button
          variant="primary"
          type="submit"
          onClick={() => onSubmit("update")}
          disabled={!reKYCDetails?.metaData?.isUpdateAddress}
        >
          {translator("button.updateCommunicationAddress")}
        </Button>
        <Button variant="outline" type="button" onClick={handleShowCancelModal}>
          {translator("button.cancel")}
        </Button>
      </div>
      {isReKYCJourneyButtonsDisabled && (
        <InfoMessage
          icon={infoIcon}
          className="my-2"
          message={"reKyc.reKYCJourneybuttonsDisableInfoMessage"}
        />
      )}
      {/* </form>
      </Form> */}
    </>
  );
};

export default memo(ReKYCDetails);
