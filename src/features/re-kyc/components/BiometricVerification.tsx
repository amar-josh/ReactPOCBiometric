import aadhaarIcon from "@/assets/images/aadhaar.svg";
import AadhaarConsentModal from "@/components/common/AadhaarConsentModal";
import AlertDialogComponent from "@/components/common/AlertDialogComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MASKED_KEY } from "@/constants/globalConstant";
import { IBiometricCardDetails } from "@/features/re-kyc/types";
import translator from "@/i18n/translator";
import { maskData } from "@/lib/maskData";

interface IBiometricVerificationComponentProps {
  handleAadhaarConsentModal: () => void;
  onCancel: () => void;
  isAadhaarConsentOpen: boolean;
  handleConsentApproved: () => void;
  isBiometricModalOpen: boolean;
  biometricDetails: IBiometricCardDetails | null;
  handleBiometricModalAction: (action: string) => void;
  isPending: boolean;
  aadhaarNumber: string;
  setIsAadhaarConsentOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const BiometricVerificationComponent = ({
  setIsAadhaarConsentOpen,
  handleAadhaarConsentModal,
  onCancel,
  isAadhaarConsentOpen,
  handleConsentApproved,
  isBiometricModalOpen,
  biometricDetails,
  handleBiometricModalAction,
  isPending,
  aadhaarNumber,
}: IBiometricVerificationComponentProps) => {
  const maskedAadhaarNumber = maskData(aadhaarNumber, MASKED_KEY.AADHAAR);
  return (
    <div className="max-w-sm space-y-4">
      <h2 className="text-xl font-semibold">
        {translator("reKyc.biometricVerification")}
      </h2>
      <div className="flex w-full items-center">
        <img src={aadhaarIcon} />
        <span>{translator("reKyc.verifyAadhaarInformation")}</span>
      </div>
      <div>
        <label className="block text-sm font-medium text-blue-900 mb-1">
          {translator("reKyc.aadhaarNumber")}
        </label>
        <Input
          value={maskedAadhaarNumber}
          readOnly
          autoComplete="off"
          className="bg-gray-100 cursor-not-allowed text-gray-600"
        />
      </div>
      <div className="flex gap-4">
        <Button onClick={handleAadhaarConsentModal} variant="primary">
          {translator("button.esign")}
        </Button>
        <Button onClick={onCancel} variant="outline">
          {translator("button.cancel")}
        </Button>
      </div>
      {isAadhaarConsentOpen && (
        <AadhaarConsentModal
          handleProceed={handleConsentApproved}
          open={isAadhaarConsentOpen}
          onClose={() => setIsAadhaarConsentOpen(false)}
          isConsentRequired
        />
      )}
      {isBiometricModalOpen && (
        <AlertDialogComponent
          type={biometricDetails?.isError ? "error" : undefined}
          title={biometricDetails?.title ?? ""}
          message={biometricDetails?.message ?? ""}
          icon={biometricDetails?.icon ?? ""}
          open={isBiometricModalOpen}
          onConfirm={handleBiometricModalAction}
          uniqueKey={biometricDetails?.key}
          confirmButtonText={biometricDetails?.buttonText}
          isLoading={isPending}
        />
      )}
    </div>
  );
};

export default BiometricVerificationComponent;
