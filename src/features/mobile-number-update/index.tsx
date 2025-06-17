import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";

import homeIcon from "@/assets/images/home.svg";
import AlertDialogComponent from "@/components/common/AlertDialogComponent";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import ResponseStatusComponent from "@/components/common/ResponseStatusComponent";
import { Separator } from "@/components/ui/separator";
import { ERROR, MASKED_KEY, SUCCESS } from "@/constants/globalConstant";
import { IGetCustomerSearchRequest } from "@/features/re-kyc/types";
import { useAlertMessage } from "@/hooks/useAlertMessage";
import translator from "@/i18n/translator";
import { maskData } from "@/lib/maskData";
import { ROUTES } from "@/routes/constants";
import { IAlertMessage } from "@/types";

import Stepper from "../../components/common/Stepper";
import BiometricFlow from "../re-kyc/BiometricFlow";
import { BIOMETRIC_OPERATIONS } from "../re-kyc/constants";
import alertIcon from "./../../assets/images/alert.svg";
import CustomerSearch from "./components/CustomerSearch";
import MobileStepper from "./components/MobileStepper";
import UpdateDetails from "./components/UpdateDetails";
import { AADHAR_NOT_AVAILABLE, STEPS } from "./constants";
import {
  useBioMetricVerification,
  useCustomerSearch,
  useFetchRecords,
  useUpdateNumber,
} from "./hooks";
import { mobileNumberUpdateFailureCheckpoints } from "./utils";

const MobileNumberUpdate = () => {
  const navigate = useNavigate();
  const customerSearchRef = useRef<{ resetForm: () => void }>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isAadhaarRequired, setIsAadhaarRequired] = useState(false);
  const [biometricStatus, setBiometricStatus] = useState(
    BIOMETRIC_OPERATIONS.DEVICE_NOT_READY
  );

  const [currentStep, setCurrentStep] = useState(1);
  const [completed, setCompleted] = useState<{ [k: number]: boolean }>({
    1: false,
    2: false,
    3: false,
  });
  const [selected, setSelected] = useState<string | undefined>("");
  const [newMobileNumber, setNewMobileNumber] = useState("");

  const updateStep = () => {
    setCompleted((prev) => ({ ...prev, [currentStep]: true }));
    setCurrentStep((step) => step + 1);
  };

  const resetStep = () => {
    setCompleted({
      1: false,
      2: false,
      3: false,
    });
    setCurrentStep(1);
  };

  const {
    mutate: customerSearchMutate,
    data: customerDetailsResponse,
    isSuccess: isCustomerSearchSuccess,
    error: customerSearchError,
    isError: isCustomerSearchError,
    isPending: isCustomerSearchLoading,
    reset: customerSearchReset,
  } = useCustomerSearch();

  const {
    mutate: updateNumber,
    data: updateNumberResponse,
    isPending: isUpdateNumberLoading,
    isError: isUpdateNumberError,
  } = useUpdateNumber();

  const {
    mutate: bioMetricVerificationMutation,
    isPending: isBioMetricVerificationLoading,
    data: bioMetricVerificationResponse,
  } = useBioMetricVerification();

  const {
    data: getRecordsData,
    mutate: fetchRecordsMutate,
    isPending: isFetchRecordsLoading,
    error: fetchRecordsError,
    reset: fetchRecordsReset,
    isError: isFetchRecordsError,
  } = useFetchRecords();

  const {
    alertMessage: customerSearchAlertMessage,
    setAlertMessage: setCustomerSearchAlertMessage,
  } = useAlertMessage(
    ERROR,
    customerSearchError?.message,
    isCustomerSearchError
  );

  const actionCode = getRecordsData?.data?.actionCode || "";

  const requestNumber = getRecordsData?.data[0]?.requestNumber || "";

  const personalDetails = getRecordsData?.data[0] || {};

  const aadhaarNumber =
    getRecordsData?.data[0]?.custDetails?.aadharNumber || "";

  const maskedAadhaarNumber = maskData(aadhaarNumber, MASKED_KEY.AADHAAR);

  const numberUpdateData = updateNumberResponse?.data;

  // Handle customer search success and default cif selection
  useEffect(() => {
    if (isCustomerSearchSuccess) {
      if (customerDetailsResponse?.data?.status === AADHAR_NOT_AVAILABLE) {
        setIsAadhaarRequired(true);
      } else {
        setCustomerSearchAlertMessage({
          type: SUCCESS,
          message: customerDetailsResponse.message,
        });
      }

      if (customerDetailsResponse?.data?.length > 0) {
        const enabledCifDetails = customerDetailsResponse?.data?.find(
          (cifDetails) => !cifDetails.isIndividual
        );
        setSelected(
          enabledCifDetails
            ? String(enabledCifDetails.custDetails?.customerId)
            : undefined
        );
      }
    }
  }, [
    customerDetailsResponse?.data.cifs,
    customerDetailsResponse?.message,
    isCustomerSearchSuccess,
  ]);

  const handleSearch = (data: IGetCustomerSearchRequest) => {
    customerSearchMutate(data);
  };

  const handleResetSearch = () => {
    resetStep();
    setSelected("");
    customerSearchReset();
    setCustomerSearchAlertMessage({ type: SUCCESS, message: "" });
    customerSearchRef.current?.resetForm();
  };

  const {
    alertMessage: fetchRecordsErrorMessage,
    setAlertMessage: setFetchRecordsErrorMessage,
  } = useAlertMessage(ERROR, fetchRecordsError?.message, isFetchRecordsError);

  const onCancel = () => {
    setIsOpen(false);
    handleResetSearch();
  };

  const handleCloseAadhaarRequired = () => {
    setIsAadhaarRequired(false);
    navigate(ROUTES.HOME);
  };

  const handleResetCustomerSearchAPI = useCallback(() => {
    customerSearchReset();
    setCustomerSearchAlertMessage({ type: SUCCESS, message: "" });
    fetchRecordsReset();
    setFetchRecordsErrorMessage({ type: SUCCESS, message: "" });
  }, [
    customerSearchReset,
    fetchRecordsReset,
    setCustomerSearchAlertMessage,
    setFetchRecordsErrorMessage,
  ]);

  // Get account details from customerDetailsResponse
  const accountDetails = useMemo(
    () => customerDetailsResponse?.data,
    [customerDetailsResponse]
  );

  const handleUpdateMobileNumber = () => {
    // TODO:Replace hardcoded values with actual data from API
    const payload = {
      customerId: selected,
      custUpdatedMobileNumber: newMobileNumber,
      branchCode: "12354",
      customerName: "Jhon Doe",
      requestNumber: requestNumber,
      type: "XYZ",
    };
    updateNumber(payload);
  };

  const backToHome = () => {
    navigate(ROUTES.HOME);
  };

  const handleNext = () => {
    // TODO: Replace with actual aadhaar number from API
    fetchRecordsMutate(
      {
        // TODO: Replace hardcoded values from API
        branchCode: "2541",
        employeeId: "281688",
        employeeName: "piyush jain",
        cif: selected,
      },
      {
        onSuccess: (data) => {
          if (data?.data?.action === "pop-up") {
            setIsOpen(true);
          } else {
            updateStep();
          }
        },
      }
    );
  };

  useEffect(() => {
    if (
      !isBioMetricVerificationLoading &&
      bioMetricVerificationResponse?.data
    ) {
      if (
        bioMetricVerificationResponse?.data?.aadharVerification ==
        BIOMETRIC_OPERATIONS.SUCCESS
      ) {
        setBiometricStatus(BIOMETRIC_OPERATIONS.SUCCESS);
      } else {
        setBiometricStatus(BIOMETRIC_OPERATIONS.ATTEMPT_FAILED);
      }
    }
  }, [bioMetricVerificationResponse, isBioMetricVerificationLoading]);

  const isNumberUpdateSuccess =
    !isUpdateNumberError || updateNumberResponse?.statusCode === 200;

  return (
    <div className="p-6">
      {(isCustomerSearchLoading ||
        isUpdateNumberLoading ||
        isFetchRecordsLoading) && <FullScreenLoader />}
      <div className="flex items-center mb-3">
        <h2 className="text-xl font-semibold">
          {translator("mobileNumberUpdate.title")}
        </h2>
      </div>
      <Separator />
      <div className="flex gap-10 mt-5">
        <div className="w-1/4 hidden lg:block">
          <Stepper
            steps={STEPS}
            currentStep={currentStep}
            completed={completed}
          />
        </div>
        <div className="flex flex-col gap-6 w-full">
          <div
            onClick={backToHome}
            className="text-sm text-gray-700 inline-flex cursor-pointer w-fit"
          >
            <img src={homeIcon} alt="Home Icon" className="w-5" />
            <p className="text-primary-gray font-bold text-base ml-1">
              {translator("reKyc.home")}
            </p>
          </div>

          <div className="block lg:hidden">
            <MobileStepper
              steps={STEPS}
              currentStep={currentStep}
              completed={completed}
            />
          </div>

          {currentStep === 1 && (
            <CustomerSearch
              handleNext={handleNext}
              customerSearchRef={customerSearchRef}
              handleSearch={handleSearch}
              handleResetSearch={handleResetSearch}
              fetchRecordsErrorMessage={fetchRecordsErrorMessage}
              setFetchRecordsErrorMessage={setFetchRecordsErrorMessage}
              handleResetCustomerSearchAPI={handleResetCustomerSearchAPI}
              isCustomerSearchSuccess={isCustomerSearchSuccess}
              customerSearchAlertMessage={customerSearchAlertMessage}
              accountDetails={accountDetails}
              selected={selected}
              setSelected={setSelected}
              isFetchRecordsError={isFetchRecordsError}
              fetchRecordsError={fetchRecordsError}
            />
          )}
          {currentStep === 2 && (
            <UpdateDetails
              updateStep={updateStep}
              setNewMobileNumber={setNewMobileNumber}
              requestNumber={requestNumber}
              personalDetails={personalDetails}
            />
          )}
          {currentStep === 3 && (
            <BiometricFlow
              // TODO:Replace with actual aadhaar number from API
              aadhaarNumber={maskedAadhaarNumber}
              onCancel={onCancel}
              updateStep={updateStep}
              isAddressUpdate={false}
              requestNumber={requestNumber}
              biometricStatus={biometricStatus}
              setBiometricStatus={setBiometricStatus}
              handleAddressConfirmed={handleUpdateMobileNumber}
              captureFingerPrintDetails={bioMetricVerificationMutation}
              isFingerPrintValidated={isBioMetricVerificationLoading}
            />
          )}
          {currentStep === 4 && !isUpdateNumberLoading && (
            <ResponseStatusComponent
              status={isNumberUpdateSuccess ? "success" : "failure"}
              title={
                translator(
                  isNumberUpdateSuccess
                    ? "reKyc.thankYou"
                    : "reKyc.rekycUpdateFailed"
                ) as string
              }
              message={
                isNumberUpdateSuccess
                  ? translator("mobileNumberUpdate.numberWillUpdate")
                  : translator("mobileNumberUpdate.tryWithFormBasedProcess")
              }
              // TODO: Replace with actual request number from API
              requestNumber={numberUpdateData?.requestNumber || ""}
              newMobileNumber={
                isNumberUpdateSuccess ? numberUpdateData?.newMobileNumber : ""
              }
              oldMobileNumber={numberUpdateData?.oldMobileNumber || ""}
              backToHome={backToHome}
            />
          )}
        </div>
      </div>
      <AlertDialogComponent
        title={mobileNumberUpdateFailureCheckpoints[actionCode]?.title || ""}
        message={
          mobileNumberUpdateFailureCheckpoints[actionCode]?.message || ""
        }
        icon={alertIcon}
        onConfirm={onCancel}
        open={isOpen}
        confirmButtonText={translator("button.ok")}
      />
      <AlertDialogComponent
        title={translator("mobileNumberUpdate.errorMessages.aadhaarRequired")}
        message={translator(
          "mobileNumberUpdate.errorMessages.aadhaarRequiredMessage"
        )}
        icon={alertIcon}
        onConfirm={handleCloseAadhaarRequired}
        open={isAadhaarRequired}
        confirmButtonText={translator("button.ok")}
      />
    </div>
  );
};

export default MobileNumberUpdate;
