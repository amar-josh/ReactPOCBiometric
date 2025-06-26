import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import translator from "@/i18n/translator";

import {
  IAddress,
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
}

const AddressUpdateCard = ({
  personalDetails,
  formDetails,
  communicationAddress,
  validateFingerPrintResponse,
  handleAddressConfirmed,
  onCancel,
}: IAddressUpdateCardProps) => {
  const [agreed, setAgreed] = useState<boolean>(false);

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
        address={communicationAddress}
        isSelected={false}
      />
      <CommunicationAddressComponent
        title={translator("reKyc.biometric.newAddress")}
        address={validateFingerPrintResponse?.data?.aadhaarAddress}
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
      <div className="flex flex-col md:flex-row gap-4">
        <Button
          className="border-b-info"
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
    </>
  );
};

export default AddressUpdateCard;
