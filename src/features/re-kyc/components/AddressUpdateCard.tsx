import { useState } from "react";

import AlertMessage from "@/components/common/AlertMessage";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ERROR } from "@/constants/globalConstant";
import { useAlertMessage } from "@/hooks/useAlertMessage";
import translator from "@/i18n/translator";
import { IAlertMessage } from "@/types";

import {
  IAddress,
  IBiometricApiDataSuccess,
  IFormDetailsSchema,
  IPersonalDetails,
  IValidateFingerPrintResponse,
} from "../types";
import { CommunicationAddressComponent } from "./CommunicationAddressComponent";
import PersonalDetailsCard from "./PersonalDetailsCard";
import ReadonlyFieldCard from "./ReadonlyFieldCard";

interface IAddressUpdateCardProps {
  personalDetails: IPersonalDetails | undefined;
  formDetails: {
    rekycFields: IFormDetailsSchema[];
    otherFields: IFormDetailsSchema[];
  };
  communicationAddress: IAddress;
  validateFingerPrintResponse: IValidateFingerPrintResponse | undefined;
  handleAddressConfirmed: () => void;
  onCancel: () => void;
  isUpdateKYCError: boolean;
  updateKYCError: { message: string };
}

const AddressUpdateCard = ({
  isUpdateKYCError,
  updateKYCError,
  personalDetails,
  formDetails,
  communicationAddress,
  validateFingerPrintResponse,
  handleAddressConfirmed,
  onCancel,
}: IAddressUpdateCardProps) => {
  const [agreed, setAgreed] = useState<boolean>(false);

  const { alertMessage } = useAlertMessage(
    ERROR,
    updateKYCError?.message,
    isUpdateKYCError
  );

  return (
    <>
      {personalDetails && (
        <PersonalDetailsCard
          name={personalDetails.fullName}
          email={personalDetails.emailId}
          mobile={personalDetails.mobileNo}
        />
      )}

      <ReadonlyFieldCard
        title={translator("reKyc.reKycDetails")}
        fields={formDetails?.rekycFields}
      />
      <ReadonlyFieldCard
        title={translator("reKyc.otherDetails")}
        fields={formDetails?.otherFields}
      />

      <h4>{translator("formFields.communicationAddress")}</h4>
      <CommunicationAddressComponent
        title={translator("reKyc.biometric.previousAddress")}
        description={communicationAddress}
        isSelected={false}
      />
      <CommunicationAddressComponent
        title={translator("reKyc.biometric.newAddress")}
        description={
          (validateFingerPrintResponse?.data as IBiometricApiDataSuccess)
            ?.aadhaarAddress
        }
        isSelected={true}
      />
      <div className="flex items-start gap-2">
        <Checkbox
          className="data-[state=checked]:bg-info data-[state=checked]:border-info"
          id="agree"
          checked={agreed}
          onCheckedChange={() => setAgreed(!agreed)}
        />
        <Label htmlFor="agree" className="text-gray-900">
          {translator("reKyc.agreeAddressUpdate")}
        </Label>
      </div>
      <div>
        <Button
          className="mr-3 border-b-info"
          variant="primary"
          onClick={handleAddressConfirmed}
          disabled={!agreed}
        >
          {translator("reKyc.biometric.confirmAddress")}
        </Button>
        <Button variant="outline" onClick={onCancel}>
          {translator("button.cancel")}
        </Button>
      </div>
      {alertMessage.message && (
        <AlertMessage type={alertMessage.type} message={alertMessage.message} />
      )}
    </>
  );
};

export default AddressUpdateCard;
