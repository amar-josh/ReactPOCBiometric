import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import translator from "@/i18n/translator";
import { IValidateFingerPrintResponse } from "@/shared/biometric/types";

import { IAddress, IFormDetailsSchema } from "../types";
import { CommunicationAddressComponent } from "./CommunicationAddressComponent";
import ReadonlyFieldCard from "./ReadonlyFieldCard";

interface IAddressUpdateCardProps {
  formDetails: {
    rekycFields: IFormDetailsSchema[];
    // otherFields: IFormDetailsSchema[];
  };
  communicationAddress: IAddress;
  validateFingerPrintResponse: IValidateFingerPrintResponse | undefined;
  handleAddressConfirmed: () => void;
  handleShowCancelModal: () => void;
}

const AddressUpdateCard = ({
  formDetails,
  communicationAddress,
  validateFingerPrintResponse,
  handleAddressConfirmed,
  handleShowCancelModal,
}: IAddressUpdateCardProps) => {
  const [agreed, setAgreed] = useState<boolean>(false);

  return (
    <>
      <ReadonlyFieldCard
        title={translator("reKyc.reKycDetails")}
        fields={formDetails?.rekycFields}
      />
      {/* Other details are not available in the ESB yet, so we are hiding them
      until they become available */}
      {/* <ReadonlyFieldCard
        title={translator("reKyc.otherDetails")}
        fields={formDetails?.otherFields}
      /> */}
      <h4 className="font-semibold">
        {translator("formFields.communicationAddress")}
      </h4>
      <h4 className="text-sm">
        {translator("reKyc.biometric.asPerBankDetails")}
      </h4>
      <CommunicationAddressComponent
        title={translator("reKyc.biometric.currentAddress")}
        address={communicationAddress}
        isSelected={false}
      />
      <h4 className="text-sm">{translator("reKyc.biometric.toBeUpdated")}</h4>
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
        <Button variant="outline" onClick={handleShowCancelModal}>
          {translator("button.cancel")}
        </Button>
      </div>
    </>
  );
};

export default AddressUpdateCard;
