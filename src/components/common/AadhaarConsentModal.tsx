import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import translator from "@/i18n/translator";

interface IAadhaarConsentModalProps {
  open: boolean;
  onClose: () => void;
  handleProceed: () => void;
  isConsentRequired?: boolean;
  isWithAddressUpdate?: boolean;
}

export default function AadhaarConsentModal({
  open,
  onClose,
  isConsentRequired = false,
  handleProceed,
  isWithAddressUpdate = false,
}: IAadhaarConsentModalProps) {
  const [agreed, setAgreed] = useState(false);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl bg-gray-100 [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="flex justify-center">
            {isConsentRequired
              ? translator("reKyc.modal.aadhaarConsentText")
              : isWithAddressUpdate
                ? translator("reKyc.modal.reKYCWithAddressUpdate")
                : translator("reKyc.modal.noChangeInKYCDetails")}
          </DialogTitle>
        </DialogHeader>
        {/* TODO - this text needs to be integrated when data comes from api */}
        <div className="text-sm bg-white p-4 mt-4 rounded-md text-muted-foreground space-y-2 max-h-96 overflow-auto">
          {isConsentRequired ? (
            <>
              {translator(
                "reKyc.modal.proceedWithAadhaarBiometricPopUpMessage"
              )}
              {translator(
                "reKyc.modal.proceedWithAadhaarBiometricPopUpMessage2"
              )}
            </>
          ) : isWithAddressUpdate ? (
            <>
              {translator("reKyc.modal.updateCommunicationAddressPopUpMessage")}
            </>
          ) : (
            <>{translator("reKyc.modal.noChangeInKYCDetailsPopUpMessage")}</>
          )}
          {isConsentRequired && (
            <div className="flex items-start gap-2 pt-4">
              <Checkbox
                className="data-[state=checked]:bg-info data-[state=checked]:border-info"
                id="agree"
                checked={agreed}
                onCheckedChange={() => setAgreed(!agreed)}
              />
              <Label htmlFor="agree" className="text-gray-900">
                {translator("reKyc.modal.checkBoxText")}
              </Label>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-2 pt-2">
          <Button
            onClick={handleProceed}
            variant="primary"
            disabled={!agreed && isConsentRequired}
          >
            {isConsentRequired
              ? translator("button.proceed")
              : translator("reKyc.modal.proceedWithAadhaarBiometric")}
          </Button>
          {isConsentRequired && (
            <Button variant="outline" onClick={onClose}>
              {translator("button.cancel")}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
